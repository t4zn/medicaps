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
import { FaviconSwitcher } from "../components/theme/FaviconSwitcher"

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

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: {
    default: "MediNotes | Free Medicaps University Notes, PYQs & Study Materials",
    template: `%s | MediNotes - Medicaps University Study Platform`
  },
  metadataBase: new URL(baseUrl),
  description: "🎓 MediNotes - #1 platform for Medicaps University students. Download free B.Tech, B.Sc, BBA notes, previous year questions (PYQs), formula sheets & get AI tutoring. Join 10,000+ students achieving academic excellence.",
  keywords: [
    "MediNotes", "medinotes", "medicaps nites", "medicaps notes", "Medicaps University", 
    "Medicaps University notes", "free study materials", "B.Tech notes download", 
    "engineering notes India", "PYQ papers Medicaps", "previous year questions", 
    "formula sheets engineering", "AI tutoring platform", "exam preparation materials", 
    "student resources India", "Medicaps B.Tech notes", "CSE notes Medicaps", 
    "electrical engineering notes", "mechanical engineering notes", "civil engineering notes", 
    "Indore university notes", "engineering study materials", "free notes download", 
    "student community India", "Medicaps University Indore", "technical education India"
  ],
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
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    title: "MediNotes | #1 Free Medicaps University Notes & Study Materials Platform",
    description: "🎓 Join 10,000+ Medicaps students using MediNotes! Free B.Tech, B.Sc, BBA notes, PYQs, formula sheets + AI tutoring. Best exam preparation platform in India.",
    siteName: "MediNotes",
    images: [
      {
        url: `${baseUrl}/images/og-image.png`,
        width: 1200,
        height: 630,
        alt: "MediNotes - #1 Study Materials Platform for Medicaps University Students"
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "MediNotes | #1 Free Medicaps University Notes & Study Materials",
    description: "🎓 Join 10,000+ Medicaps students using MediNotes! Free B.Tech, B.Sc, BBA notes, PYQs, formula sheets + AI tutoring.",
    site: '@medinotes_live',
    creator: '@t4zn',
    images: [
      {
        url: `${baseUrl}/images/og-image.png`,
        alt: "MediNotes - Study Materials Platform"
      }
    ],
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
    'apple-mobile-web-app-title': 'MediNotes',
    'application-name': 'MediNotes',
    'msapplication-TileColor': '#000000',
    'theme-color': '#000000',
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
        <link rel="preconnect" href="https://fonts.cdnfonts.com" />
        <link href="https://fonts.cdnfonts.com/css/gilroy-bold" rel="stylesheet" />
        <link rel="dns-prefetch" href="https://medinotes.live" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MediNotes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="MediNotes" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <link rel="icon" href="/icon_light.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#000000" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
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
      <body className="font-gilroy">
        <StructuredData />
        <FaviconSwitcher />
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
