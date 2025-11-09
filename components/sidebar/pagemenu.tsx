"use client"

import { usePathname } from "next/navigation"
import { Routes } from "@/lib/pageroutes"
import { Separator } from "@/components/ui/separator"
import SubLink from "@/components/sidebar/sublink"
import Search from "@/components/navigation/search"

export function PageMenu({ isSheet = false }) {
  const pathname = usePathname()
  const isDocsPage = pathname.startsWith("/docs")

  return (
    <div className="flex flex-col gap-3.5 pb-6">
      {/* Search Bar */}
      <div className="px-2 mb-4">
        <Search />
      </div>
      
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
