import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { Google } from "arctic";
import { Lucia, Session, User } from "lucia";
import { cookies } from "next/headers";
import { cache } from "react";
import prisma from "./lib/prisma";

// prisma adapter takes 2 args, session and user models created 
const adapter = new PrismaAdapter(prisma.session, prisma.user);

interface DatabaseUserAttributes {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
    googleId: string | null;
    verified: boolean
  }

// change type in the lucia object, and we have to do this so DatabaseUserAttributes contains the fields in the interface
// meaning we have to connect interface types to lucia
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false, // keep session cookie alive indefenitly 
    attributes: {
      secure: process.env.NODE_ENV === "production", // make cookie secure in production only beacuse while development we use http not https localhost
    },
  },
  // get user attributes to use in our app
  // so now whenever we fetch our session on the front we automatically get these fields
  getUserAttributes(databaseUserAttributes) {
    return {
      id: databaseUserAttributes.id,
      username: databaseUserAttributes.username,
      displayName: databaseUserAttributes.displayName,
      avatarUrl: databaseUserAttributes.avatarUrl,
      googleId: databaseUserAttributes.googleId,
      verified: databaseUserAttributes.verified
    };
  },
});

// cache function from react, it will make one databse request and share the results with different components
// but when we refresh the page the cache is cleared and we get a new request
export const validateRequest = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null } // type of the Promise, User and Session are Lucia types , request could be invalid so we add the or clause, user could be null and session could be null
  > => {

    const totalStart = Date.now();
    const cookieStart = Date.now();

    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

    const cookieDuration = Date.now() - cookieStart;
    console.log(`[validateRequest] Cookie read took ${cookieDuration}ms`);

    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    const validateStart = Date.now();
    const result = await lucia.validateSession(sessionId);
    const validateDuration = Date.now() - validateStart;
    console.log(`[validateRequest] lucia.validateSession took ${validateDuration}ms`);

    try {
      const cookieSetStart = Date.now();
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
      if (!result.session) {
        // used when we logout
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
      const cookieSetDuration = Date.now() - cookieSetStart;
      console.log(`[validateRequest] Cookie set took ${cookieSetDuration}ms`);
    } catch (e) {
      console.log(`[validateRequest] Cookie set error:`, e);
    }

    console.log(`[validateRequest] Total time: ${Date.now() - totalStart}ms`);
    return result;
  },
);