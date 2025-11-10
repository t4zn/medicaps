'use client'

import { usePathname } from "next/navigation"
import { Footer } from "@/components/navigation/footer"
import { Navbar } from "@/components/navigation/navbar"
import { Sidebar } from "@/components/sidebar"

interface LayoutContentProps {
  children: React.ReactNode
}

export function LayoutContent({ children }: LayoutContentProps) {
  const pathname = usePathname()
  
  // Don't show sidebar on homepage, auth, profile, and static pages
  const hideSidebarPaths = ['/', '/auth', '/profile', '/upload', '/about', '/privacy', '/terms', '/docs']
  const showSidebar = !hideSidebarPaths.includes(pathname)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        {showSidebar ? (
          <div className="flex items-start gap-10 px-5 sm:px-8 pt-10">
            <Sidebar />
            <main className="flex-1 md:flex-[6] h-auto">{children}</main>
          </div>
        ) : (
          <main className="h-auto px-5 sm:px-8">{children}</main>
        )}
      </div>
      <Footer />
    </div>
  )
}