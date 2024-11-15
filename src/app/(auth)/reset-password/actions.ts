"use server";

import { lucia } from "@/auth";
import prisma from "@/lib/prisma";
import { resetPasswordEmailSchema , ResetPassworEmaildValues} from "@/lib/validation";
import { verify } from "@node-rs/argon2";
import { isRedirectError } from "next/dist/client/components/redirect";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ResetPasswordTemplateEmail from "./ResetPasswordTemplateEmail";
import { Resend } from 'resend';

import { TimeSpan, createDate } from "oslo";
import { sha256 } from "oslo/crypto";
import { encodeHex } from "oslo/encoding";
import { generateIdFromEntropySize } from "lucia";

async function createPasswordResetToken(userId: string): Promise<string> {
    // optionally invalidate all existing tokens
    await prisma.passwordResetToken.deleteMany({
      where: {
        user_id: userId,
      },
    });
  
    // generate token
    const tokenId = generateIdFromEntropySize(25); // 40 character
    const tokenHash = encodeHex(await sha256(new TextEncoder().encode(tokenId)));
  
    await prisma.passwordResetToken.create({
      data: {
        token_hash: tokenHash,
        user_id: userId,
        expires_at: createDate(new TimeSpan(1, "d")),
      },
    });
    return tokenId;
  }

export async function verifyEmail(
  credentials: ResetPassworEmaildValues,
): Promise<{ error: string }> {
  try {
    const { email } = resetPasswordEmailSchema.parse(credentials);

    const userEmail = await prisma.user.findUnique({
        where :{
            email: email
        }
    });

    if(!userEmail?.email){
        return {
            error: "Email does not Exist",
          };
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
      // Step 2: Create the verification link
      const verificationToken = await createPasswordResetToken(userEmail.id);
      const BASE_URL = process.env.BASE_URL || "http://localhost:3000"; 
      const verificationLink = `${BASE_URL}/reset-password-email/?token=${verificationToken}`;
  
      // Step 3: Create the email template
      const emailContent = ResetPasswordTemplateEmail({
        username: userEmail.username,
        verificationLink: verificationLink,
      })
  
      // Step 4: Send the email using Resend
      const { data, error } = await resend.emails.send({
        from: 'Vinyl Lovers <no-reply@vinylovers.net>',
        to: [email],
        subject: 'Vinyl Lovers - Password Reset',
        react: emailContent,
      });
  
      if (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send verification email');
      }
  
    } catch (error) {
      console.error('Error in sendVerificationEmail:', error);
      throw new Error('An error occurred while sending the verification email');
    }

    return redirect("/login");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return {
      error: "Something went wrong. Please try again.",
    };
  }
}