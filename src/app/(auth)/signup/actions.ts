"use server"

import prisma from "@/lib/prisma";
import { lucia } from "@/auth";
import { signUpSchema, SignUpValues } from "@/lib/validation";
import { hash } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";
import { isRedirectError } from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";
import { sendVerificationEmail } from "../hooks/useSendVerificationEmail";
import streamServerClient from "@/lib/stream";
import { cookies } from "next/headers";

// return type of Promise can contain this error, if nothing wrong redirect the user .
// in the code we have to return the specific error for signup, we can't catch it in the front

export async function signUp(
  credentials: SignUpValues,
): Promise<{ error: string }> { 
  try {
    const { username, email, password } = signUpSchema.parse(credentials);

    const existingUsername = await prisma.user.findFirst({
        where: {
          username: {
            equals: username,
            mode: "insensitive",
          },
        },
      });
  
      if (existingUsername) {
        return {
          error: "Username already taken",
        };
      }
  
      const existingEmail = await prisma.user.findFirst({
        where: {
          email: {
            equals: email,
            mode: "insensitive",
          },
        },
      });
  
      if (existingEmail) {
        return {
          error: "Email already taken",
        };
      }
      
    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    const userId = generateIdFromEntropySize(10);

    // await prisma.user.create({
    //   data: {
    //     id: userId,
    //     username,
    //     displayName: username,
    //     email,
    //     passwordHash,
    //   },
    // });

    await prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          id: userId,
          username,
          displayName: username,
          email,
          passwordHash,
        },
      });
      await streamServerClient.upsertUser({
        id: userId,
        username,
        name: username,
      });
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
   
    try {
      await sendVerificationEmail(userId, email, username);

    } catch (error) {
      return {
        error: "Something went wrong. Please try again.",
      };
    }

    return redirect("/verification-sent");

  } catch (error) {

    //redirect throws a special error, and catch function catches it , we have to check isRedirect() we rethrow it so we get redirected
    if (isRedirectError(error)) throw error;
    console.error(error);
    return {
      error: "Something went wrong. Please try again.",
    };
  }
}
