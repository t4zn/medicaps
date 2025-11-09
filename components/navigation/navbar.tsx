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
  
  // Hide search bar and hamburger menu on homepage
  const showSearch = pathname !== '/'
  const showHamburger = pathname !== '/'

  return (
    <nav className="bg-opacity-5 sticky top-0 z-50 mx-auto flex h-16 w-full items-center justify-between border-b p-1 px-2 backdrop-blur-xl backdrop-filter sm:p-3 md:gap-2 md:px-4">
      <div className="flex items-center gap-5">
        {showHamburger && <SheetLeft />}
        <div className="flex items-center gap-6">
          <div className="hidden md:flex">
            <Logo />
          </div>
          <div className="text-muted-foreground hidden items-center gap-5 text-sm font-medium md:flex">
            <NavMenu />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {showSearch && <Search />}
        <div className="flex gap-2 sm:ml-0">
          {user ? (
            <>
              <Link
                href="/upload"
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                <LuUpload className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Upload</span>
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0">
                    {profile?.avatar_url ? (
                      <Image
                        src={profile.avatar_url}
                        alt="Profile"
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <LuUser className="h-4 w-4 text-primary" />
                      </div>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {profile?.full_name && (
                        <p className="font-medium">{profile.full_name}</p>
                      )}
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
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
              className={buttonVariants({ variant: "default", size: "sm" })}
            >
              <LuUser className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Sign In</span>
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
