import type React from "react"
import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
import { ThemeProvider } from "next-themes"
import ReactQueryProvider from "./ReactQueryProvider"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

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
const ogImageUrl = "https://vinylovers.net/viny.png" // Full absolute URL to the image

export const metadata: Metadata = {
  title: {
    default: "Vinylovers - Connect with Vinyl Lovers & Share Your Collection",
    template: "%s | Vinylovers",
  },
  description:
    "Join a vibrant vinyl lovers' community where you can share your record collection, discover fresh sounds, and connect with fellow vinyl enthusiasts from around the world",
  keywords: ["vinyl", "records", "music", "collection", "community" , "vinyl lovers" , "For every vinyl lover" , "A space for vinyl lovers"],
  authors: [{ name: "Vinylovers" }],
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "Vinylovers - Connect with Vinyl Lovers & Share Your Collection",
    description:
      "Join a vibrant vinyl lovers' community where you can share your record collection, discover fresh sounds, and connect with fellow vinyl enthusiasts from around the world",
    siteName: "Vinylovers",
    images: [
      {
        url: "/viny.png",
        width: 1200,
        height: 630,
        alt: "vinyl lovers community sharing records",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vinylovers - Connect with Vinyl Lovers & Share Your Collection",
    description:
      "Join a vibrant vinyl lovers' community where you can share your record collection, discover fresh sounds, and connect with fellow vinyl enthusiasts from around the world",
    images: [
      {
        url: "/viny.png",
        width: 1200,
        height: 630,
        alt: "vinyl lovers community sharing records",
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
         <meta name="google-site-verification" content="-7GGj5Z4Y23rNlOrBmYAqRoA16epUrp2UahAIgeFtuY" />
         <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ReactQueryProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
            <Analytics />
            <SpeedInsights/>
          </ThemeProvider>
        </ReactQueryProvider>
        <Toaster />
      </body>
    </html>
  )
}

