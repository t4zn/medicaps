import { Link } from "lib/transition"
import Image from "next/image"
import { LuUpload } from "react-icons/lu"
import type { Metadata } from "next"

import { buttonVariants } from "@/components/ui/button"
import { Button } from "@/components/ui/button"
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
    <section className="flex min-h-[86.5vh] flex-col items-center justify-center px-2 py-8 text-center">
      <div className="mb-4 flex items-center justify-center gap-2 sm:gap-4">
        <Image
          src="/icon_light.png"
          alt="MediNotes Icon"
          width={128}
          height={128}
          className="h-12 w-12 sm:h-32 sm:w-32 dark:hidden"
        />
        <Image
          src="/icon.png"
          alt="MediNotes Icon"
          width={128}
          height={128}
          className="h-12 w-12 sm:h-32 sm:w-32 hidden dark:block"
        />
        <h1 className="text-2xl font-bold sm:text-7xl whitespace-nowrap font-poppins">MediNotes</h1>
      </div>
      <p className="text-foreground mb-8 max-w-[320px] sm:max-w-[600px] text-xs sm:text-base leading-relaxed">
        <span className="sm:hidden">
          Find notes, PYQs, cheat sheets for Medicaps University. Get instant AI tutoring help.
        </span>
        <span className="hidden sm:inline">
          Find notes, PYQs, cheat sheets, and study materials for Medicaps University. Get instant AI tutoring help for any subject. Your comprehensive resource hub for academic success.
        </span>
      </p>

      <div className="mb-6 w-full max-w-md">
        <Search />
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link
          href="/welcome"
          className={buttonVariants({ variant: "outline", className: "px-6 w-full sm:w-auto", size: "lg" })}
        >
          Get Started
        </Link>
        <Link href="/upload">
          <Button size="lg" className="w-full sm:w-auto">
            <LuUpload className="mr-2 h-5 w-5" />
            Upload Files
          </Button>
        </Link>
      </div>
    </section>
  )
}
