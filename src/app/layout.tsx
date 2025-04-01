import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import ReactQueryProvider from "./ReactQueryProvider";
import SessionProvider from "./(main)/SessionProvider";
import { validateRequest } from "@/auth";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react"

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
    default: 'Vinylovers - Your Vinyl Collection Community',
    template: '%s | Vinylovers'
  },
  description: 'Join the vinyl community to share your collection, discover new music, and connect with fellow vinyl enthusiasts.',
  keywords: ['vinyl', 'records', 'music', 'collection', 'community'],
  authors: [{ name: 'Vinylovers' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://vinylovers.vercel.app',
    title: 'Vinylovers - Your Vinyl Collection Community',
    description: 'Join the vinyl community to share your collection, discover new music, and connect with fellow vinyl enthusiasts.',
    siteName: 'Vinylovers',
    images: [
      {
        url: 'https://vinylovers.vercel.app/viny.png', // Custom OG Image
        width: 1200,
        height: 630,
        alt: 'Vinylovers - Your Vinyl Collection Community',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vinylovers - Your Vinyl Collection Community',
    description: 'Join the vinyl community to share your collection, discover new music, and connect with fellow vinyl enthusiasts.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

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
        <Analytics/>
        </ThemeProvider>
        </ReactQueryProvider>
        <Toaster />
        {/* </SessionProvider> */}
      </body>
    </html>
  );
}
