"use client"


import { usePathname } from "next/navigation"
import Link from "next/link"
import { LuUpload } from "react-icons/lu"

import { Routes } from "@/lib/pageroutes"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import SubLink from "@/components/sidebar/sublink"

import { useAuth } from "@/contexts/AuthContext"

export function PageMenu({ isSheet = false }) {
  const pathname = usePathname()
  const { user } = useAuth()
  const isDocsPage = pathname.startsWith("/docs")


  return (
    <div className="flex flex-col gap-3.5 pb-6">
      {/* Quick Actions */}
      {user && (
        <div className="px-2 mb-4">
          <Link href="/upload">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <LuUpload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </Link>
        </div>
      )}
      
      <Separator className="my-2" />
      
      {/* Documentation Navigation - only show on docs pages */}
      {isDocsPage && Routes.map((item, index) => {
        if ("spacer" in item) {
          return <Separator key={`spacer-${index}`} className="my-2" />
        }
        return (
          <div key={item.title + index}>
            {item.heading && (
              <div className="mb-4 text-sm font-bold">{item.heading}</div>
            )}
            <SubLink
              {...{
                ...item,
                href: `/docs${item.href}`,
                level: 0,
                isSheet,
              }}
            />
          </div>
        )
      })}
    </div>
  )
}
