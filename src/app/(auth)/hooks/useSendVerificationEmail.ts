import EmailTemplate from '../signup/EmailTemplate';
import { Resend } from 'resend';
import { generateIdFromEntropySize } from "lucia";
import prisma from "@/lib/prisma";
import { TimeSpan, createDate } from "oslo";

async function createEmailVerificationToken(userId: string, email: string): Promise<string> {

const tokenId = generateIdFromEntropySize(25); // 40 characters long

  await prisma.emailVerificationToken.create({
    data: {
      id: tokenId,
      userId: userId,
      email,
      expires_at: createDate(new TimeSpan(20, "m")),
    },
  });

	return tokenId;
}

export const sendVerificationEmail = async (userId: string, email: string, username: string) => {

    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
      // Step 2: Create the verification link
      const verificationToken = await createEmailVerificationToken(userId, email);
      const BASE_URL = process.env.BASE_URL || "http://localhostt:3001"; // Use environment variable for base URL
      const verificationLink = `${BASE_URL}/email-verification/?token=${verificationToken}`;
  
      // Step 3: Create the email template
      const emailContent = EmailTemplate({ username, verificationLink });
  
      // Step 4: Send the email using Resend
      const { data, error } = await resend.emails.send({
        from: 'Vinyl Lovers <no-reply@vinylovers.net>',
        to: [email],
        subject: 'Email Verification',
        html: emailContent,
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