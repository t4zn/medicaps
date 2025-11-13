import type { Metadata } from "next"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export const metadata: Metadata = {
  title: "FAQ - Frequently Asked Questions | MediNotes",
  description: "Get answers to common questions about MediNotes - free study materials, notes download, PYQs, AI tutoring for Medicaps University students.",
  keywords: [
    "MediNotes FAQ",
    "Medicaps University questions",
    "how to download notes",
    "free study materials help",
    "PYQ download guide",
    "AI tutoring help"
  ]
}

const faqs = [
  {
    question: "What is MediNotes?",
    answer: "MediNotes is the #1 free study platform for Medicaps University students. We provide comprehensive study materials including notes, previous year questions (PYQs), formula sheets, and AI-powered tutoring support for all branches and subjects."
  },
  {
    question: "Is MediNotes really free to use?",
    answer: "Yes! MediNotes is completely free for all Medicaps University students. You can download unlimited notes, PYQs, formula sheets, and access AI tutoring without any charges."
  },
  {
    question: "Which subjects and branches are covered?",
    answer: "We cover all major branches including CSE, ECE, Civil, Mechanical, Electrical, IT, and more. Our materials include notes for all years (1st to 4th year) and subjects like C Programming, Data Structures, Mathematics, Physics, Chemistry, and specialized branch subjects."
  },
  {
    question: "How do I download study materials?",
    answer: "Simply search for your subject using our search bar, browse by branch and year, or use our navigation menu. Click on any material to view and download it instantly. No registration required for basic access."
  },
  {
    question: "What are PYQs and why are they important?",
    answer: "PYQs (Previous Year Questions) are question papers from previous exams. They're crucial for exam preparation as they help you understand exam patterns, important topics, and question formats. Our PYQ collection covers multiple years for better preparation."
  },
  {
    question: "How does the AI tutoring feature work?",
    answer: "Our AI tutor provides instant help with any subject or topic. Simply ask your question and get detailed explanations, step-by-step solutions, and concept clarifications. It's like having a personal tutor available 24/7."
  },
  {
    question: "Can I upload my own study materials?",
    answer: "Yes! We encourage students to contribute by uploading their notes, assignments, and study materials. This helps build a comprehensive resource library for the entire Medicaps community."
  },
  {
    question: "Is the content verified and accurate?",
    answer: "All uploaded materials go through a review process. We also rely on community feedback and ratings to ensure quality. However, we recommend cross-referencing with official sources for critical exam preparation."
  },
  {
    question: "How often is new content added?",
    answer: "New content is added regularly as students upload materials and as new academic sessions begin. We also update our database with the latest syllabus changes and exam patterns."
  },
  {
    question: "Can I access MediNotes on mobile devices?",
    answer: "Absolutely! MediNotes is fully responsive and works perfectly on smartphones, tablets, and computers. You can study anywhere, anytime with our mobile-friendly interface."
  },
  {
    question: "How can I stay updated with new materials?",
    answer: "Create an account to get notifications about new uploads in your subjects. You can also bookmark your favorite materials and track your study progress."
  },
  {
    question: "Who created MediNotes and why?",
    answer: "MediNotes was created by Medicaps students for Medicaps students. Our goal is to democratize access to quality study materials and help every student achieve academic excellence through collaborative learning."
  }
]

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-lg text-muted-foreground">
          Everything you need to know about MediNotes - your free study companion for Medicaps University
        </p>
      </div>

      <Accordion type="single" collapsible className="space-y-4">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
            <AccordionTrigger className="text-left font-semibold">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">Still have questions?</h2>
        <p className="text-muted-foreground mb-6">
          Can't find what you're looking for? Our AI tutor is here to help with any academic questions!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="/search" 
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Search Study Materials
          </a>
          <a 
            href="/welcome" 
            className="border border-border px-6 py-3 rounded-lg font-medium hover:bg-accent transition-colors"
          >
            Get Started
          </a>
        </div>
      </div>
    </div>
  )
}