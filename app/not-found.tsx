import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, Search, BookOpen } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 - Page Not Found | MediNotes',
  description: 'The page you are looking for does not exist. Browse our study materials, notes, and PYQs for Medicaps University students.',
  robots: {
    index: false,
    follow: true,
  },
}

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-gray-300 dark:text-gray-700">404</h1>
          <h2 className="text-2xl font-semibold">Page Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400">
            The page you&apos;re looking for doesn&apos;t exist. But don&apos;t worry, 
            we have plenty of study materials waiting for you!
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button variant="default" className="w-full sm:w-auto">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
          
          <Link href="/notes/btech">
            <Button variant="outline" className="w-full sm:w-auto">
              <BookOpen className="w-4 h-4 mr-2" />
              Browse Notes
            </Button>
          </Link>
        </div>
        
        <div className="pt-4 border-t">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            Popular sections:
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link href="/notes/btech/cse" className="text-sm text-blue-600 hover:underline">
              CSE Notes
            </Link>
            <Link href="/pyqs/btech" className="text-sm text-blue-600 hover:underline">
              PYQ Papers
            </Link>
            <Link href="/formula-sheets/btech" className="text-sm text-blue-600 hover:underline">
              Formula Sheets
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}