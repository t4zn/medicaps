"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Navigations } from "@/settings/navigation"
import { LuArrowUpRight, LuHouse, LuUser, LuLogOut, LuUpload } from "react-icons/lu"
import { useAuth } from "@/contexts/AuthContext"


import { buttonVariants } from "@/components/ui/button"
import { Button } from "@/components/ui/button"
import { SheetClose } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Anchor from "@/components/anchor"
import { Logo } from "@/components/navigation/logo"
import Search from "@/components/navigation/search"
import { SheetLeft } from "@/components/sidebar"
import { ModeToggle } from "@/components/theme-toggle"

export function Navbar() {
  const { user, profile, signOut } = useAuth()
  const pathname = usePathname()
  

  
  // Hide search bar and upload button on homepage but always show hamburger menu
  const showSearch = pathname !== '/'
  const showUpload = pathname !== '/'
  const showHamburger = true // Always show sidebar

  return (
    <nav className="sticky top-0 z-50 mx-auto flex h-16 w-full items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-black/80 backdrop-blur-md px-4 md:px-6">
      <div className="flex items-center gap-4">
        {showHamburger && <SheetLeft />}
        <div className="flex items-center gap-8">
          <div className="hidden md:flex">
            <Logo />
          </div>
          <div className="hidden items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-400 md:flex">
            <NavMenu />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {showSearch && <Search />}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              {showUpload && (
                <Link
                  href="/upload"
                  className="inline-flex items-center justify-center h-8 px-3 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                >
                  <LuUpload className="h-3 w-3 sm:mr-2" />
                  <span className="hidden sm:inline">Upload</span>
                </Link>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="h-8 w-8 rounded-full overflow-hidden hover:opacity-80 transition-opacity">
                    {profile?.avatar_url ? (
                      <Image
                        src={profile.avatar_url}
                        alt="Profile"
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <LuUser className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      </div>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <LuUser className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => signOut()}
                    className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
                  >
                    <LuLogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link
              href="/auth"
              className="inline-flex items-center justify-center h-8 px-3 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
            >
              <LuUser className="h-3 w-3 sm:mr-2" />
              <span className="hidden sm:inline">Sign In</span>
              <span className="sm:hidden ml-1">Login</span>
            </Link>
          )}
          
          <ModeToggle />
        </div>
      </div>
    </nav>
  )
}

export function NavMenu({ isSheet = false }) {
  const navigationItems = Navigations.map((item) => {
    const Comp = (
      <Anchor
        key={item.title + item.href}
        absolute
        activeClassName="font-bold text-primary"
        className="flex items-center gap-1 text-sm"
        href={item.href}
        target={item.external ? "_blank" : undefined}
        rel={item.external ? "noopener noreferrer" : undefined}
      >
        {item.title === "🏠" ? <LuHouse className="h-4 w-4" /> : item.title}{" "}
        {item.external && (
          <LuArrowUpRight className="h-3 w-3 align-super" strokeWidth={3} />
        )}
      </Anchor>
    )
    return isSheet ? (
      <SheetClose key={item.title + item.href} asChild>
        {Comp}
      </SheetClose>
    ) : (
      Comp
    )
  })

  // In mobile sidebar, display items horizontally
  if (isSheet) {
    return (
      <div className="flex items-center gap-4">
        {navigationItems}
      </div>
    )
  }

  // In desktop navbar, display items as before
  return <>{navigationItems}</>
}
