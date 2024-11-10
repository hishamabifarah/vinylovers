interface ResetPasswordTemplateEmailProps {
    username: string;
    verificationLink: string;
  }
  
  export default function ResetPasswordTemplateEmail({
      username,
      verificationLink,
    }: ResetPasswordTemplateEmailProps) {
    return `
        <div>
          <h1>Welcome, ${username}!</h1>
          <p>Kindly find the link below to reset your password</p>
          <a href="${verificationLink}">Reset Password</a>
        </div>
      `;
  }
  