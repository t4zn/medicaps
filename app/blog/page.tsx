import type { Metadata } from "next"
import { Link } from "lib/transition"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Study Tips & Resources Blog | MediNotes",
  description: "Expert study tips, exam preparation strategies, and academic resources for Medicaps University students. Learn effective study techniques and boost your academic performance.",
  keywords: [
    "study tips",
    "exam preparation",
    "academic success",
    "Medicaps University tips",
    "engineering study guide",
    "effective learning",
    "study strategies"
  ]
}

const blogPosts = [
  {
    title: "10 Effective Study Techniques for Engineering Students",
    description: "Discover proven study methods that help engineering students master complex concepts and excel in exams.",
    category: "Study Tips",
    readTime: "5 min read",
    slug: "effective-study-techniques-engineering"
  },
  {
    title: "How to Prepare for Medicaps University Exams",
    description: "Complete guide to exam preparation including time management, revision strategies, and stress management tips.",
    category: "Exam Prep",
    readTime: "8 min read",
    slug: "medicaps-exam-preparation-guide"
  },
  {
    title: "Making the Most of Previous Year Questions (PYQs)",
    description: "Learn how to effectively use PYQs for exam preparation and understand exam patterns.",
    category: "Resources",
    readTime: "6 min read",
    slug: "using-pyqs-effectively"
  },
  {
    title: "AI Tutoring: Your 24/7 Study Companion",
    description: "Maximize your learning with AI tutoring features and get instant help with any academic question.",
    category: "Technology",
    readTime: "4 min read",
    slug: "ai-tutoring-guide"
  },
  {
    title: "Time Management Tips for Engineering Students",
    description: "Balance academics, projects, and personal life with these proven time management strategies.",
    category: "Productivity",
    readTime: "7 min read",
    slug: "time-management-engineering-students"
  },
  {
    title: "Building a Strong Foundation in Mathematics",
    description: "Essential tips for mastering engineering mathematics and building problem-solving skills.",
    category: "Subjects",
    readTime: "9 min read",
    slug: "engineering-mathematics-foundation"
  }
]

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Study Tips & Resources</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Expert advice, study strategies, and academic resources to help you excel 
          in your Medicaps University journey
        </p>
      </div>

      {/* Featured Post */}
      <div className="mb-12">
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">Featured</Badge>
              <Badge variant="outline">Study Tips</Badge>
            </div>
            <CardTitle className="text-2xl">
              Complete Guide to Academic Success at Medicaps University
            </CardTitle>
            <CardDescription className="text-base">
              Everything you need to know about excelling in your studies, from effective note-taking 
              to exam strategies specifically tailored for Medicaps University students.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">12 min read</span>
              <Link 
                href="/blog/complete-academic-success-guide"
                className="text-primary hover:underline font-medium"
              >
                Read More →
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {blogPosts.map((post, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{post.category}</Badge>
                <span className="text-xs text-muted-foreground">{post.readTime}</span>
              </div>
              <CardTitle className="text-lg leading-tight">
                {post.title}
              </CardTitle>
              <CardDescription>
                {post.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link 
                href={`/blog/${post.slug}`}
                className="text-primary hover:underline font-medium"
              >
                Read More →
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Categories */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Browse by Category</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {["Study Tips", "Exam Prep", "Resources", "Technology", "Productivity", "Subjects"].map((category) => (
            <Link key={category} href={`/blog/category/${category.toLowerCase().replace(' ', '-')}`}>
              <Badge variant="secondary" className="text-sm px-4 py-2 hover:bg-primary hover:text-primary-foreground transition-colors">
                {category}
              </Badge>
            </Link>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <div className="text-center bg-accent/50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">Need Personalized Study Help?</h2>
        <p className="text-muted-foreground mb-6">
          Get instant answers to your academic questions with our AI tutoring feature
        </p>
        <Link 
          href="/welcome"
          className="inline-flex items-center justify-center bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Try AI Tutoring Now
        </Link>
      </div>
    </div>
  )
}