"use server";

import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { isWithinExpirationDate } from "oslo";
import { lucia } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect";
import { cookies } from "next/headers";

import { hash } from "@node-rs/argon2";
import { sha256 } from "oslo/crypto";
import { encodeHex } from "oslo/encoding";


export async function reset(
  password: string , confirmPassword: string , verificationToken :string
): Promise<{ error: string }> {

  try {
    if (typeof password !== "string" || password.length < 8) {
      return {
        error: "Invalid Password",
      };
    }

    const tokenHash = encodeHex( await sha256(new TextEncoder().encode(verificationToken)),);
    const token = await prisma.passwordResetToken.findUnique({
      where: {
        token_hash: tokenHash,
      },
    });

    if (token) {
      await prisma.passwordResetToken.delete({
        where: {
          token_hash: tokenHash
        }
      })
    }

    if (!token || !isWithinExpirationDate(token.expires_at)) {
      return {
        error: "Something went wrong. Please try again.",
      };
    }

    await lucia.invalidateUserSessions(token.user_id);
    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

      await prisma.user.update({
        where: {
          id: token.user_id,
        },
        data: {
          passwordHash: passwordHash,
        },
      });
    
      // const session = await lucia.createSession(token.user_id, {});
      // const sessionCookie = lucia.createSessionCookie(session.id);
      // cookies().set(
      //   sessionCookie.name,
      //   sessionCookie.value,
      //   sessionCookie.attributes,
      // );
    
      redirect('/login')
  } catch (error) {
    //redirect throws a special error, and catch function catches it , we have to check isRedirect() we rethrow it so we get redirected
    if (isRedirectError(error)) throw error;
    console.error(error);
    return {
      error: "Something went wrong. Please try again.",
    };
  }
}
