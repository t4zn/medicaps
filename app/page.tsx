import { Link } from "lib/transition"
import type { Metadata } from "next"
import Image from "next/image"

import { Upload } from "lucide-react"

import Search from "@/components/navigation/search"


export const metadata: Metadata = {
  title: "MediNotes | Free Medicaps University Notes, PYQs & Study Materials",
  description: "🎓 MediNotes - #1 platform for Medicaps University students. Download free B.Tech, B.Sc, BBA notes, previous year questions (PYQs), formula sheets & get AI tutoring. 10,000+ students trust us for exam preparation.",
  keywords: [
    "MediNotes",
    "medinotes",
    "medicaps nites", 
    "medicaps notes",
    "Medicaps University",
    "Medicaps University notes",
    "free study materials",
    "B.Tech notes download",
    "engineering notes India",
    "PYQ papers Medicaps",
    "previous year questions",
    "formula sheets engineering",
    "AI tutoring platform",
    "exam preparation materials",
    "student resources India",
    "Medicaps B.Tech notes",
    "CSE notes Medicaps",
    "electrical engineering notes",
    "mechanical engineering notes",
    "civil engineering notes",
    "Indore university notes",
    "engineering study materials",
    "free notes download",
    "student community India"
  ],
  openGraph: {
    title: "MediNotes | #1 Free Medicaps University Notes & Study Materials",
    description: "🎓 Join 10,000+ Medicaps students using MediNotes! Free B.Tech, B.Sc, BBA notes, PYQs, formula sheets + AI tutoring. Best exam preparation platform in India.",
    url: "https://medinotes.live",
    siteName: "MediNotes",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "MediNotes - #1 Study Materials Platform for Medicaps University Students"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "MediNotes | #1 Free Medicaps University Notes & Study Materials",
    description: "🎓 Join 10,000+ Medicaps students using MediNotes! Free B.Tech, B.Sc, BBA notes, PYQs, formula sheets + AI tutoring.",
    images: ["/images/og-image.png"]
  },
  alternates: {
    canonical: "https://medinotes.live"
  }
}

export default function Home() {
  return (
    <div className="relative">

      
      {/* Hero Section */}
      <section className="px-4 py-8 relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          {/* Hero Image */}
          <div className="mb-4">
            <Image
              src="/hero.jpg"
              alt="MediNotes Hero"
              width={400}
              height={200}
              className="mx-auto dark:hidden"
              priority
            />
            <Image
              src="/herodark.PNG"
              alt="MediNotes Hero"
              width={400}
              height={200}
              className="mx-auto hidden dark:block"
              priority
            />
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-none mb-6">
            Study smarter.
            <br />
            Achieve more.
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            <span className="hidden sm:inline">Find notes, PYQs and study materials for Medicaps University.<br />Get instant AI tutoring help for any subject.</span>
            <span className="sm:hidden">Access notes, PYQs, study materials and get AI tutoring help for Medicaps University.</span>
          </p>

          {/* Search Bar */}
          <div className="w-full max-w-md mx-auto mb-8">
            <Search />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/welcome"
              className="inline-block px-6 xs:px-8 py-2.5 xs:py-3 bg-black dark:bg-white text-white dark:text-black text-xs xs:text-sm font-medium hover:opacity-80 active:opacity-60 transition-opacity touch-manipulation"
            >
              Get Started
            </Link>
            <Link
              href="/upload"
              className="inline-flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white active:text-black dark:active:text-white transition-colors border-b border-transparent hover:border-current touch-manipulation py-1 text-xs xs:text-sm"
            >
              <Upload className="w-3 h-3" />
              Upload Notes
            </Link>
          </div>
        </div>
      </section>




    </div>
  )
}
