"use client"

import Link from "next/link"
import { GitHubLink, Navigations } from "@/settings/navigation"
import { LuArrowUpRight, LuGithub, LuHouse, LuUser, LuLogOut, LuUpload } from "react-icons/lu"
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

  return (
    <nav className="bg-opacity-5 sticky top-0 z-50 mx-auto flex h-16 w-full items-center justify-between border-b p-1 px-2 backdrop-blur-xl backdrop-filter sm:p-3 md:gap-2 md:px-4">
      <div className="flex items-center gap-5">
        <SheetLeft />
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
        <Search />
        <div className="flex gap-2 sm:ml-0">
          {user ? (
            <>
              <Link
                href="/upload"
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                <LuUpload className="h-4 w-4 mr-2" />
                Upload
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <LuUser className="h-4 w-4 mr-2" />
                    {profile?.full_name || user.email}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
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
              <LuUser className="h-4 w-4 mr-2" />
              Sign In
            </Link>
          )}
          
          <ModeToggle />
        </div>
      </div>
    </nav>
  )
}

export function NavMenu({ isSheet = false }) {
  return (
    <>
      {Navigations.map((item) => {
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
      })}
    </>
  )
}
