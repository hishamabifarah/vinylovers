

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import ReactQueryProvider from "./ReactQueryProvider";
import SessionProvider from "./(main)/home/SessionProvider";
import { validateRequest } from "@/auth";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Vinylovers",
    default: "Vinylovers",
  },
  description: "The social media app for Vinyl Lovers",
};

// const session = await validateRequest();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
      {/* <SessionProvider value={session}> */}
      <ReactQueryProvider>
      <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
        {children}
        </ThemeProvider>
        </ReactQueryProvider>
        {/* </SessionProvider> */}
      </body>
      
    </html>
  );
}
