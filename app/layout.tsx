import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import Script from "next/script"
import { Providers } from "@/providers"
import { GoogleTagManager } from "@next/third-parties/google"
import { AuthProvider } from "@/contexts/AuthContext"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

import { Settings } from "@/types/settings"
import { SidebarProvider } from "@/contexts/SidebarContext"
import { LayoutContent } from "../components/LayoutContent"
import { StructuredData } from "@/components/seo/StructuredData"

import "@/styles/globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

const baseUrl = Settings.metadataBase

export const metadata: Metadata = {
  title: {
    default: Settings.title,
    template: `%s | ${Settings.title}`
  },
  metadataBase: new URL(baseUrl),
  description: Settings.description,
  keywords: Settings.keywords,
  authors: [
    {
      name: "Taizun Kaptan",
      url: "https://taizun.site"
    }
  ],
  creator: "Taizun Kaptan",
  publisher: Settings.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
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
  openGraph: {
    type: Settings.openGraph.type,
    locale: 'en_US',
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
    creator: '@t4zn',
    images: Settings.twitter.images.map((image) => ({
      ...image,
      url: `${baseUrl}${image.url}`,
    })),
  },
  alternates: {
    canonical: baseUrl,
  },
  category: 'education',
  classification: 'Educational Platform',
  other: {
    'google-site-verification': 'your-google-verification-code',
    'msvalidate.01': 'your-bing-verification-code',
    'yandex-verification': 'your-yandex-verification-code',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://medinotes.live" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MediNotes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="MediNotes" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#000000" />
      </head>
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
      <body className={`${inter.variable} ${poppins.variable} font-regular`}>
        <StructuredData />
        <Providers>
          <AuthProvider>
            <SidebarProvider>
              <LayoutContent>{children}</LayoutContent>
            </SidebarProvider>
          </AuthProvider>
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
