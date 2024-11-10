interface EmailTemplateProps {
  username: string;
  verificationLink: string;
}

export default function EmailTemplate({
    username,
    verificationLink,
  }: EmailTemplateProps) {
  return `
      <div>
        <h1>Welcome, ${username}!</h1>
        <p>Thank you for registering. Please verify your email by clicking the link below:</p>
        <a href="${verificationLink}">Verify Email</a>
      </div>
    `;
}
