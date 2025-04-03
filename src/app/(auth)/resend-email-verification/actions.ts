"use server";

import prisma from "@/lib/prisma";
import { lucia, validateRequest } from "@/auth";
import { ResendVerifcationEmailValues, resendVerificationEmailSchema } from "@/lib/validation";
import { isRedirectError } from "next/dist/client/components/redirect";
import { sendVerificationEmail } from "../hooks/useSendVerificationEmail";
import { cookies } from "next/headers";
import { isWithinExpirationDate } from "oslo";
import { redirect } from "next/navigation";

export async function resend(
  values : ResendVerifcationEmailValues,
): Promise<{ error: string }> { 
  try {
    // Parse and validate input
    const { email } = resendVerificationEmailSchema.parse(values);

    // Get the current user's ID from session
    const session = await validateRequest();
    if (!session || !session.user) {
      return {
        error: "You must be logged in to resend a verification email",
      };
    }

    // Find user with both session ID and email matching
    const user = await prisma.user.findFirst({
      where: {
        id: session.user.id,
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    });

    // Check if user exists and email matches session user
    if (!user) {
      return {
        error: "Email address doesn't match your account",
      };
    }

    // Check if user is already verified
    if (user.verified) {
      return {
        error: "Your email is already verified",
      };
    }

    // Rate limiting: Check for recent verification emails
    const recentToken = await prisma.emailVerificationToken.findFirst({
      where: {
        userId: user.id,
        email: user.email ?? undefined,
        // Only check tokens created in the last 1 minute
        createdAt: {
          gte: new Date(Date.now() - 60 * 1000)
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (recentToken) {
      return {
        error: "Please wait at least 1 minute before requesting another verification email",
      };
    }
  
    // Send verification email
    try {
      await sendVerificationEmail(user.id, email, user.username);
      
      return redirect("/verification-sent");
      
    } catch (error) {
      console.error("Error sending verification email:", error);
      return {
        error: "Failed to send verification email. Please try again.",
      };
    }

  } catch (error) {
    // Handle redirect errors
    if (isRedirectError(error)) throw error;
    
    // Log other errors
    console.error("Resend verification error:", error);
    return {
      error: "Something went wrong. Please try again.",
    };
  }
}

export async function resendold(
  values: ResendVerifcationEmailValues,
): Promise<{ error: string } | { success: string }> { 
  try {
    // Parse and validate input
    const { email } = resendVerificationEmailSchema.parse(values);

    // Get the current user's ID from session
    const session = await validateRequest();
    if (!session || !session.user) {
      return {
        error: "You must be logged in to resend a verification email",
      };
    }

    // Find user with both session ID and email matching
    const user = await prisma.user.findFirst({
      where: {
        id: session.user.id,
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    });

    // Check if user exists and email matches session user
    if (!user) {
      return {
        error: "Email address doesn't match your account",
      };
    }

    // Check if user is already verified
    if (user.verified) {
      return {
        error: "Your email is already verified",
      };
    }

    // Rate limiting: Check for recent verification emails
    const recentToken = await prisma.emailVerificationToken.findFirst({
      where: {
        userId: user.id,
        email: user.email ?? undefined,
        // Only check tokens created in the last 1 minute
        createdAt: {
          gte: new Date(Date.now() - 60 * 1000)
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (recentToken) {
      return {
        error: "Please wait at least 1 minute before requesting another verification email",
      };
    }
  
    // Send verification email
    try {
      await sendVerificationEmail(user.id, email, user.username);
      
      return {
        success: "Verification email sent successfully",
      };
      
    } catch (error) {
      console.error("Error sending verification email:", error);
      return {
        error: "Failed to send verification email. Please try again.",
      };
    }

  } catch (error) {
    // Handle redirect errors
    if (isRedirectError(error)) throw error;
    
    // Log other errors
    console.error("Resend verification error:", error);
    return {
      error: "Something went wrong. Please try again.",
    };
  }
}

export async function verify(
  token: string,
): Promise<{ error: string } | { success: string }> {
  try {
    // Validate token input
    if (!token || typeof token !== 'string') {
      return { error: "Invalid verification token" };
    }
    
    // Find token in database
    const tokenDB = await prisma.emailVerificationToken.findUnique({
      where: {
        id: token,
      },
    });
    
    // Check if token exists
    if (!tokenDB) {
      return { error: "Verification token not found or has already been used" };
    }
    
    // Check if token is expired
    if (!isWithinExpirationDate(tokenDB.expires_at)) {
      // Delete expired token
      await prisma.emailVerificationToken.delete({
        where: {
          id: tokenDB.id,
        },
      });
      return { error: "Verification token has expired. Please request a new one" };
    }
    
    // Find associated user
    const user = await prisma.user.findUnique({
      where: {
        id: tokenDB.userId,
      },
    });
    
    // Validate user exists and email matches
    if (!user || user.email !== tokenDB.email) {
      await prisma.emailVerificationToken.delete({
        where: {
          id: tokenDB.id,
        },
      });
      return { error: "Invalid verification token" };
    }
    
    // Check if user is already verified
    if (user.verified) {
      // Delete this token
      await prisma.emailVerificationToken.delete({
        where: {
          id: tokenDB.id,
        },
      });
      return { success: "Email already verified. Please log in" };
    }
    
    // Delete all verification tokens for this user - including the current one
    await prisma.emailVerificationToken.deleteMany({
      where: {
        userId: user.id,
      },
    });
    
    // Invalidate existing sessions
    await lucia.invalidateUserSessions(user.id);
    
    // Mark user as verified
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        verified: true,
      },
    });
    
    // Create new session
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
    
    return { success: "Email verified successfully" };
    
    // Optional redirect - uncomment if needed
    // redirect('/login');
  } catch (error) {
    // Handle redirect errors
    if (isRedirectError(error)) throw error;
    
    // Log other errors
    console.error("Email verification error:", error);
    return {
      error: "Something went wrong during verification. Please try again",
    };
  }
}