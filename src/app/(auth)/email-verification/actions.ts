"use server";

import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { isWithinExpirationDate } from "oslo";
import { lucia } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect";
import { cookies } from "next/headers";

export async function verify(
  token: string,
): Promise<{ error: string }> {

  try {
    if (!token || typeof token !== 'string') {
      return { error: "Invalid token." };
    }
    
      const tokenDB = await prisma.emailVerificationToken.findUnique({
        where: {
          id: token,
        },
      });
    
      if (tokenDB) {
        await prisma.emailVerificationToken.delete({
          where: {
            id: tokenDB.id,
          },
        });
      }
      if (!tokenDB || !isWithinExpirationDate(tokenDB.expires_at)) {
        // return {
        //     error: "Something went wrong. Please try again.",
        //   };
        return  notFound();
      }
    
      const user = await prisma.user.findUnique({
        where: {
          id: tokenDB.userId,
        },
      });
    
      if (!user || user.email !== tokenDB.email) {
        return {
            error: "Something went wrong. Please try again.",
          };
      }
    
      await lucia.invalidateUserSessions(user.id);
    
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          verified: true,
        },
      });
    
      const session = await lucia.createSession(user.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    
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
