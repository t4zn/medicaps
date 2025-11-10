import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"
import { Providers } from "@/providers"
import { GoogleTagManager } from "@next/third-parties/google"
import { AuthProvider } from "@/contexts/AuthContext"
import { Analytics } from "@vercel/analytics/next"

import { Settings } from "@/types/settings"
import { SidebarProvider } from "@/contexts/SidebarContext"
import { LayoutContent } from "../components/LayoutContent"

import "@/styles/globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const baseUrl = Settings.metadataBase

export const metadata: Metadata = {
  title: Settings.title,
  metadataBase: new URL(baseUrl),
  description: Settings.description,
  keywords: Settings.keywords,
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  openGraph: {
    type: Settings.openGraph.type,
    url: baseUrl,
    title: Settings.openGraph.title,
    description: Settings.openGraph.description,
    siteName: Settings.openGraph.siteName,
    images: Settings.openGraph.images.map((image) => ({
      ...image,
      url: `${baseUrl}${image.url}`,
    })),
  },
  twitter: {
    card: Settings.twitter.card,
    title: Settings.twitter.title,
    description: Settings.twitter.description,
    site: Settings.twitter.site,
    images: Settings.twitter.images.map((image) => ({
      ...image,
      url: `${baseUrl}${image.url}`,
    })),
  },
  publisher: Settings.name,
  alternates: {
    canonical: baseUrl,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {Settings.gtmconnected && <GoogleTagManager gtmId={Settings.gtm} />}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-EZ7B74TTSE"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-EZ7B74TTSE');
        `}
      </Script>
      <body className={`${inter.variable} font-regular`}>
        <Providers>
          <AuthProvider>
            <SidebarProvider>
              <LayoutContent>{children}</LayoutContent>
            </SidebarProvider>
          </AuthProvider>
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
