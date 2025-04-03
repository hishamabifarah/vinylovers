import EmailTemplate from '../signup/EmailTemplate';
import { Resend } from 'resend';
import { generateIdFromEntropySize } from "lucia";
import prisma from "@/lib/prisma";
import { TimeSpan, createDate } from "oslo";

/**
 * Creates a verification token for a user
 * @param userId The user's ID
 * @param email The user's email address
 * @returns The generated token ID
 */
export async function createEmailVerificationToken(userId: string, email: string): Promise<string> {
  const tokenId = generateIdFromEntropySize(25); // 40 characters long

  await prisma.emailVerificationToken.create({
    data: {
      id: tokenId,
      userId: userId,
      email,
      expires_at: createDate(new TimeSpan(1, "d")), // Token expires in 1 day
    },
  });

  return tokenId;
}

/**
 * Sends a verification email to a user
 * @param userId The user's ID
 * @param email The user's email address
 * @param username The user's username
 * @returns Object indicating success or throws an error
 */
export async function sendVerificationEmail(userId: string, email: string, username: string) {
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not defined');
    throw new Error('Email service configuration error');
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    // Create the verification token
    const verificationToken = await createEmailVerificationToken(userId, email);
    
    // Get base URL from environment variables
    const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
    const verificationLink = `${BASE_URL}/email-verification/?token=${verificationToken}`;

    // Create the email content
    const emailContent = EmailTemplate({ username, verificationLink });

    // Send the email using Resend
    const { data, error } = await resend.emails.send({
      from: 'VinyLovers <no-reply@vinylovers.net>',
      to: [email],
      subject: 'Email Verification',
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
}

// Add a default export that re-exports the named functions
export default { sendVerificationEmail, createEmailVerificationToken };