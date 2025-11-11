"use client"


import { useState } from "react"
import { Routes } from "@/lib/pageroutes"
import { Separator } from "@/components/ui/separator"
import SubLink from "@/components/sidebar/sublink"
import Search from "@/components/navigation/search"
import { Input } from "@/components/ui/input"
import { LuSearch, LuFilter, LuPlus } from "react-icons/lu"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function PageMenu({ isSheet = false }) {
  const [filters, setFilters] = useState({
    year: 'all',
    branch: 'all'
  })
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const applyFilters = () => {
    // Apply filters to search results
    console.log('Applied filters:', { program: 'btech', ...filters })
    
    // Update the search function with filters
    if (typeof window !== 'undefined') {
      // Store filters in sessionStorage so search can access them
      sessionStorage.setItem('searchFilters', JSON.stringify({ program: 'btech', ...filters }))
      
      // Trigger a custom event to notify search component
      window.dispatchEvent(new CustomEvent('filtersChanged', { 
        detail: { program: 'btech', ...filters } 
      }))
    }
    
    // Close the dropdown
    setIsFilterOpen(false)
  }

  return (
    <div className="flex flex-col gap-3.5 pb-6">
      {/* Search Bar with Filter */}
      <div className="px-2 mb-4">
        <div className="flex gap-2">
          <div className="flex-1">
            {isSheet ? (
              // Non-focusable search button for mobile sidebar
              <div 
                className="relative cursor-pointer"
                onClick={() => {
                  // Find and click the main search trigger
                  const searchTrigger = document.querySelector('[data-search-trigger]') as HTMLElement
                  if (searchTrigger) {
                    searchTrigger.click()
                  }
                }}
              >
                <LuSearch className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-500 dark:text-neutral-400 pointer-events-none" />
                <div className="bg-background h-9 w-full rounded-md border pr-4 pl-10 text-sm shadow flex items-center text-muted-foreground">
                  Search
                </div>
              </div>
            ) : (
              // Desktop sidebar - use a search trigger without "notes" in placeholder
              <div 
                className="relative cursor-pointer"
                onClick={() => {
                  // Find and click the main search trigger
                  const searchTrigger = document.querySelector('[data-search-trigger]') as HTMLElement
                  if (searchTrigger) {
                    searchTrigger.click()
                  }
                }}
              >
                <LuSearch className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-500 dark:text-neutral-400 pointer-events-none" />
                <div className="bg-background h-9 w-full rounded-md border pr-4 pl-10 text-sm shadow flex items-center text-muted-foreground">
                  Search
                </div>
              </div>
            )}
          </div>
          
          {/* Filter Button */}
          <DropdownMenu open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                <LuFilter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 p-4" align="end">
              <div className="space-y-4">
                <div className="font-medium text-sm">Filters</div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Year</label>
                    <Select value={filters.year} onValueChange={(value) => setFilters({...filters, year: value})}>
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Years</SelectItem>
                        <SelectItem value="1st-year">1st Year</SelectItem>
                        <SelectItem value="2nd-year">2nd Year</SelectItem>
                        <SelectItem value="3rd-year">3rd Year</SelectItem>
                        <SelectItem value="4th-year">4th Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Branch</label>
                    <Select value={filters.branch} onValueChange={(value) => setFilters({...filters, branch: value})}>
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Branches</SelectItem>
                        <SelectItem value="cse">CSE</SelectItem>
                        <SelectItem value="cse-ai">CSE - AI</SelectItem>
                        <SelectItem value="cse-ds">CSE - DS</SelectItem>
                        <SelectItem value="cse-networks">CSE - Networks</SelectItem>
                        <SelectItem value="cse-aiml">CSE - AI & ML</SelectItem>
                        <SelectItem value="cyber-security">Cyber Security</SelectItem>
                        <SelectItem value="cse-iot">CSE - IoT</SelectItem>
                        <SelectItem value="csbs">CSBS</SelectItem>
                        <SelectItem value="ece">ECE</SelectItem>
                        <SelectItem value="civil">Civil</SelectItem>
                        <SelectItem value="electrical">Electrical</SelectItem>
                        <SelectItem value="mechanical">Mechanical</SelectItem>
                        <SelectItem value="automobile">Automobile (EV)</SelectItem>
                        <SelectItem value="it">IT</SelectItem>
                        <SelectItem value="robotics">Robotics & Automation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 h-8 text-xs"
                    onClick={() => setFilters({ year: 'all', branch: 'all' })}
                  >
                    Reset
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 h-8 text-xs"
                    onClick={applyFilters}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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
              <>
                <div className="mb-4 text-sm font-bold">{item.heading}</div>
                {/* Add Subject link right after Resources heading */}
                {item.heading === "Resources" && (
                  <Link 
                    href="/settings/subject-requests" 
                    className="flex items-center gap-2 py-2 mb-3 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                  >
                    <LuPlus className="h-4 w-4" />
                    Add Subject
                  </Link>
                )}
              </>
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
