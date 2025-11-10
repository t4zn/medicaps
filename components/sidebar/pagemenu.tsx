"use client"


import { Routes } from "@/lib/pageroutes"
import { Separator } from "@/components/ui/separator"
import SubLink from "@/components/sidebar/sublink"
import Search from "@/components/navigation/search"
import { Input } from "@/components/ui/input"
import { LuSearch } from "react-icons/lu"

export function PageMenu({ isSheet = false }) {
  return (
    <div className="flex flex-col gap-3.5 pb-6">
      {/* Search Bar */}
      <div className="px-2 mb-4">
        {isSheet ? (
          // Non-auto-focusing search for mobile sidebar
          <div className="relative">
            <LuSearch className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-500 dark:text-neutral-400" />
            <Input
              className="bg-background h-9 w-full rounded-md border pr-4 pl-10 text-sm shadow"
              placeholder="Search"
              type="search"
              onFocus={(e) => {
                // When clicked, blur immediately and trigger the main search dialog
                e.target.blur()
                // Find and click the main search trigger
                const searchTrigger = document.querySelector('[data-search-trigger]') as HTMLElement
                if (searchTrigger) {
                  searchTrigger.click()
                }
              }}
            />
          </div>
        ) : (
          <Search />
        )}
      </div>
      
      <Separator className="my-2" />
      
      {/* Navigation Sections - show on all pages */}
      {Routes.map((item, index) => {
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
                href: item.href,
                level: 0,
                isSheet,
                parentKey: item.heading || '',
              }}
            />
          </div>
        )
      })}
    </div>
  )
}
