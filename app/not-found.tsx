import Link from 'next/link'
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
    <div className="min-h-[100dvh] flex items-center justify-center bg-white dark:bg-black px-4 py-8">
      <div className="text-center space-y-6 sm:space-y-8 w-full max-w-2xl">
        {/* Large 404 */}
        <div className="space-y-3 sm:space-y-4">
          <h1 className="text-[8rem] xs:text-[10rem] sm:text-[14rem] md:text-[16rem] font-black leading-none text-black dark:text-white opacity-10 select-none">
            404
          </h1>
          <div className="space-y-2 -mt-12 xs:-mt-14 sm:-mt-16 md:-mt-20">
            <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-black dark:text-white px-4">
              Page Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-xs xs:text-sm sm:text-base max-w-sm mx-auto px-4 leading-relaxed">
              This page doesn&apos;t exist, but your study materials do.
            </p>
          </div>
        </div>
        
        {/* Minimal Actions */}
        <div className="space-y-4 sm:space-y-5">
          <Link 
            href="/"
            className="inline-block px-6 xs:px-8 py-2.5 xs:py-3 bg-black dark:bg-white text-white dark:text-black text-xs xs:text-sm font-medium hover:opacity-80 active:opacity-60 transition-opacity touch-manipulation"
          >
            Go Home
          </Link>
          
          <div className="flex flex-wrap items-center justify-center gap-x-4 xs:gap-x-6 gap-y-2 text-xs xs:text-sm px-4">
            <Link 
              href="/notes/btech" 
              className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white active:text-black dark:active:text-white transition-colors border-b border-transparent hover:border-current touch-manipulation py-1"
            >
              Notes
            </Link>
            <span className="text-gray-300 dark:text-gray-700 hidden xs:inline">•</span>
            <Link 
              href="/pyqs/btech" 
              className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white active:text-black dark:active:text-white transition-colors border-b border-transparent hover:border-current touch-manipulation py-1"
            >
              PYQs
            </Link>
            <span className="text-gray-300 dark:text-gray-700 hidden xs:inline">•</span>
            <Link 
              href="/formula-sheets/btech" 
              className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white active:text-black dark:active:text-white transition-colors border-b border-transparent hover:border-current touch-manipulation py-1"
            >
              Formulas
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}