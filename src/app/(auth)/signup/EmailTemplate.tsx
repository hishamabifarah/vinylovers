import React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Button,
  Hr,
  Preview,
  Section,
  Text,
} from "@react-email/components";


interface ResetPasswordTemplateEmailProps {
  username: string;
  verificationLink: string;
}

export const EmailTemplate = ({
  username,
  verificationLink,
}: ResetPasswordTemplateEmailProps) => (
  <Html>
    <Head />
    <Preview>Verify your Vinylovers account</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src="https://vinylovers.net/viny.png"
          width="100%"
          height="auto"
          alt="Vinylovers logo"
          style={logo}
        />
        <Heading style={h1}>Verify Vinylovers account</Heading>
        <Text style={text}>Hello {username},</Text>
        <Text style={text}>
          We received a request to verify your email for your Vinylovers account. If you didn&apos;t make this request, you can safely ignore this email.
        </Text>
        <Section style={buttonContainer}>
          <Button style={button} href={verificationLink}>
            Verify Account
          </Button>
        </Section>
        <Text style={text}>
          This verify account link will expire in 24 hours.
        </Text>
        <Text style={text}>
          If you&apos;re having trouble clicking the verify account button, copy and paste the following URL into your web browser:
        </Text>
        <Text style={link}>{verificationLink}</Text>
        <Text style={text}>
          If you didn&apos;t request account verification, please ignore this email or contact our support team <Link aria-label='contact@vinylovers.net - contact email' href="mailto:contact@vinylovers.net">contact@vinylovers.net</Link> if you have concerns about your account&apos;s security.
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          This email was sent by Vinylovers.net, Beirut, Lebanon
        </Text>
      </Container>
    </Body>
  </Html>
);

export default EmailTemplate;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '40px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const logo = {
  margin: '0 auto',
  marginBottom: '24px',
};

const h1 = {
  color: '#333',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
  textAlign: 'center' as const,
};

const text = {
  color: '#333',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'left' as const,
  marginBottom: '24px',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '40px 0',
};

const button = {
  backgroundColor: '#e30613',
  borderRadius: '4px',
  color: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '100%',
  padding: '12px'
  
};

const link = {
  color: '#5469d4',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  fontSize: '14px',
  textAlign: 'center' as const,
  textDecoration: 'underline',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  fontSize: '12px',
  lineHeight: '16px',
  textAlign: 'center' as const,
  marginTop: '48px',
};
