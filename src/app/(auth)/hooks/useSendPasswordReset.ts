import ResetPasswordTemplateEmail from '../reset-password/ResetPasswordTemplateEmail';
import { Resend } from 'resend';
import prisma from "@/lib/prisma";

// create password token libs
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
        expires_at: createDate(new TimeSpan(20, "m")),
      },
    });
    return tokenId;
  }

export const sendVerificationEmail = async (userId: string, email: string, username: string) => {

    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
      // Step 2: Create the verification link
      const verificationToken = await createPasswordResetToken(userId);
      const BASE_URL = process.env.BASE_URL || "http://localhost:3000"; 
      const verificationLink = `${BASE_URL}/reset-password-email/?token=${verificationToken}`;
  
      // Step 3: Create the email template
      const emailContent = ResetPasswordTemplateEmail({ username, verificationLink });
  
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
  
      return { success: true };
    } catch (error) {
      console.error('Error in sendVerificationEmail:', error);
      throw new Error('An error occurred while sending the verification email');
    }
  };