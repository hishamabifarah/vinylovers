import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import ReactQueryProvider from "./ReactQueryProvider";
// import SessionProvider from "./(main)/SessionProvider";
// import { validateRequest } from "@/auth";
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
        url: 'https://vinylovers.vercel.app/logo192.png', // Custom OG Image
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
    images: [
      {
        url: 'https://vinylovers.vercel.app/logo192.png', // Custom OG Image
        width: 1200,
        height: 630,
        alt: 'Vinylovers - Your Vinyl Collection Community',
      },
    ],

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
            <head>
        {/* Viewport Meta Tag */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://vinylovers.vercel.app" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />

        {/* Theme Color */}
        <meta name="theme-color" content="#000000" />

        {/* Apple Touch Icon */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Open Graph Tags */}
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Vinylovers" />

        {/* Twitter Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Vinylovers - Your Vinyl Collection Community" />
        <meta name="twitter:description" content="Join the vinyl community to share your collection, discover new music, and connect with fellow vinyl enthusiasts." />
        <meta name="twitter:image" content="https://vinylovers.vercel.app/logo192.png" />
      </head>
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
