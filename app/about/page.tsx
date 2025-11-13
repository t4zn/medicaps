import type { Metadata } from "next"
import Image from "next/image"
import { Link } from "lib/transition"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "About MediNotes - Free Study Platform for Medicaps University",
  description: "Learn about MediNotes - the leading free study platform for Medicaps University students. Discover our mission to provide quality education resources, notes, PYQs, and AI tutoring.",
  keywords: [
    "About MediNotes",
    "Medicaps University platform",
    "free education resources",
    "student community",
    "study materials platform",
    "educational technology"
  ]
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-4 mb-6">
          <Image
            src="/icon.png"
            alt="MediNotes Logo"
            width={80}
            height={80}
            className="rounded-lg"
          />
          <h1 className="text-5xl font-bold">MediNotes</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Empowering Medicaps University students with free, high-quality study materials 
          and AI-powered learning support for academic excellence.
        </p>
      </div>

      {/* Mission Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6 text-center">Our Mission</h2>
        <div className="bg-accent/50 rounded-lg p-8">
          <p className="text-lg leading-relaxed text-center">
            To democratize access to quality education by providing free, comprehensive study materials 
            and innovative AI tutoring support to every Medicaps University student, fostering a 
            collaborative learning environment where knowledge is shared freely and academic success 
            is achievable for all.
          </p>
        </div>
      </section>

      {/* What We Offer */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">What We Offer</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">📚 Comprehensive Study Materials</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Complete notes for all B.Tech, B.Sc, BBA, and M.Tech subjects</li>
              <li>• Organized by branch, year, and subject for easy navigation</li>
              <li>• High-quality, student-verified content</li>
              <li>• Regular updates with latest syllabus changes</li>
            </ul>
          </div>
          
          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">📝 Previous Year Questions (PYQs)</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Extensive collection of past exam papers</li>
              <li>• Multiple years of question papers for pattern analysis</li>
              <li>• Subject-wise categorization for focused preparation</li>
              <li>• Solutions and explanations where available</li>
            </ul>
          </div>
          
          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">📊 Formula Sheets & Quick References</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Concise formula compilations for quick revision</li>
              <li>• Subject-wise quick reference guides</li>
              <li>• Exam-focused cheat sheets</li>
              <li>• Visual aids and diagrams for better understanding</li>
            </ul>
          </div>
          
          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">🤖 AI-Powered Tutoring</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• 24/7 instant help with any academic question</li>
              <li>• Step-by-step problem solving assistance</li>
              <li>• Concept explanations and clarifications</li>
              <li>• Personalized learning recommendations</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Why Choose MediNotes */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Why Choose MediNotes?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl mb-4">🆓</div>
            <h3 className="text-xl font-semibold mb-2">Completely Free</h3>
            <p className="text-muted-foreground">
              No hidden charges, no subscriptions. Quality education should be accessible to everyone.
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-semibold mb-2">Student Community</h3>
            <p className="text-muted-foreground">
              Built by students, for students. Real materials from real Medicaps University experiences.
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2">Instant Access</h3>
            <p className="text-muted-foreground">
              No lengthy registrations. Find what you need and download instantly.
            </p>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Impact</h2>
        <div className="grid md:grid-cols-4 gap-6 text-center">
          <div className="bg-primary/10 rounded-lg p-6">
            <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
            <div className="text-muted-foreground">Active Students</div>
          </div>
          <div className="bg-primary/10 rounded-lg p-6">
            <div className="text-3xl font-bold text-primary mb-2">5,000+</div>
            <div className="text-muted-foreground">Study Materials</div>
          </div>
          <div className="bg-primary/10 rounded-lg p-6">
            <div className="text-3xl font-bold text-primary mb-2">50+</div>
            <div className="text-muted-foreground">Subjects Covered</div>
          </div>
          <div className="bg-primary/10 rounded-lg p-6">
            <div className="text-3xl font-bold text-primary mb-2">24/7</div>
            <div className="text-muted-foreground">AI Support</div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center">
        <h2 className="text-3xl font-bold mb-6">Join the MediNotes Community</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Start your journey towards academic excellence with thousands of Medicaps University students 
          who trust MediNotes for their study needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/welcome">
            <Button size="lg" className="w-full sm:w-auto">
              Get Started Now
            </Button>
          </Link>
          <Link href="/upload">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Contribute Materials
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}