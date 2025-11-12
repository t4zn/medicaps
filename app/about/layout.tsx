import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About MediNotes - Created by Taizun Kaptan",
  description: "Learn about MediNotes, the comprehensive study platform for Medicaps University students. Created by Taizun Kaptan, AI developer and student.",
  keywords: [
    "about MediNotes",
    "Taizun Kaptan", 
    "MediNotes creator",
    "Medicaps University platform",
    "AI developer",
    "student platform"
  ],
  openGraph: {
    title: "About MediNotes - Created by Taizun Kaptan",
    description: "Learn about MediNotes, the comprehensive study platform for Medicaps University students.",
    url: "https://medinotes.live/about"
  },
  alternates: {
    canonical: "https://medinotes.live/about"
  }
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}