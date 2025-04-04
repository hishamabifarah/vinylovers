import type React from "react"
import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
import { ThemeProvider } from "next-themes"
import ReactQueryProvider from "./ReactQueryProvider"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@vercel/analytics/react"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
})
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
})

// Define the absolute URL for your site
const siteUrl = "https://vinylovers.net"

export const metadata: Metadata = {
  title: {
    default: "Vinylovers - Your Vinyl Collection Community",
    template: "%s | Vinylovers",
  },
  description:
    "Join the vinyl community to share your collection, discover new music, and connect with fellow vinyl enthusiasts.",
  keywords: ["vinyl", "records", "music", "collection", "community"],
  authors: [{ name: "Vinylovers" }],
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "Vinylovers - Your Vinyl Collection Community",
    description:
      "Join the vinyl community to share your collection, discover new music, and connect with fellow vinyl enthusiasts.",
    siteName: "Vinylovers",
    images: [
      {
        url: "/logo192.png", // Make sure this file exists in your public folder
        width: 1200,
        height: 630,
        alt: "Vinylovers - Your Vinyl Collection Community",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vinylovers - Your Vinyl Collection Community",
    description:
      "Join the vinyl community to share your collection, discover new music, and connect with fellow vinyl enthusiasts.",
    images: [
      {
        url: "/logo192.png", // Same image as OpenGraph
        width: 1200,
        height: 630,
        alt: "Vinylovers - Your Vinyl Collection Community",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={siteUrl} />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ReactQueryProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
            <Analytics />
          </ThemeProvider>
        </ReactQueryProvider>
        <Toaster />
      </body>
    </html>
  )
}

