"use client"

import { useEffect, useMemo, useState } from "react"
import { LuFileText, LuSearch, LuFile } from "react-icons/lu"

import { advanceSearch, cn, debounce, highlight, search } from "@/lib/utils"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import Anchor from "@/components/anchor"



interface FileResult {
  id: string
  title: string
  href: string
  snippet: string
  description: string
  type: 'file'
  category: string
  subject: string
  program: string
  year: string
  branch?: string
}

type SearchResult = search | FileResult

export default function Search() {
  const [searchedInput, setSearchedInput] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeFilters, setActiveFilters] = useState({ program: 'btech', year: 'all', branch: 'all' })

  const performSearch = async (input: string, filters: typeof activeFilters) => {
    setIsLoading(true)
    try {
      // Search subjects
      const subjectResults = advanceSearch(input.trim(), { year: filters.year, branch: filters.branch })
      
      // Search files
      const fileResponse = await fetch(`/api/search?q=${encodeURIComponent(input)}&program=${filters.program}&year=${filters.year}&branch=${filters.branch}`)
      const fileData = await fileResponse.json()
      const fileResults = fileData.files || []
      
      // Combine results with files first (prioritize file names), then subjects
      const combinedResults: SearchResult[] = [
        ...fileResults,
        ...subjectResults
      ]
      
      setFilteredResults(combinedResults)
    } catch (error) {
      console.error('Search error:', error)
      // Fallback to subject search only
      const results = advanceSearch(input.trim(), { year: filters.year, branch: filters.branch })
      setFilteredResults(results)
    } finally {
      setIsLoading(false)
    }
  }

  const debouncedSearch = useMemo(
    () => debounce((input: string, filters: typeof activeFilters) => performSearch(input, filters), 300),
    []
  )

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isOpen && event.key === "Enter" && filteredResults.length > 2) {
        const selected = filteredResults[0]
        if ("href" in selected) {
          // Check if it's a subject page or docs page
          const href = selected.href.startsWith('/notes') || selected.href.startsWith('/pyqs') || selected.href.startsWith('/formula-sheets') 
            ? selected.href 
            : `/docs${selected.href}`
          window.location.href = href
          setIsOpen(false)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, filteredResults])

  useEffect(() => {
    if (searchedInput.length >= 1) {
      debouncedSearch(searchedInput, activeFilters)
    } else {
      setFilteredResults([])
    }
  }, [searchedInput, activeFilters, debouncedSearch])

  // Listen for filter changes from sidebar
  useEffect(() => {
    const handleFiltersChanged = (event: CustomEvent) => {
      const newFilters = event.detail
      setActiveFilters(newFilters)
      // Re-run search with new filters if there's an active search
      if (searchedInput.length >= 1) {
        debouncedSearch(searchedInput, newFilters)
      }
    }

    // Load initial filters from sessionStorage
    if (typeof window !== 'undefined') {
      const savedFilters = sessionStorage.getItem('searchFilters')
      if (savedFilters) {
        try {
          const parsedFilters = JSON.parse(savedFilters)
          setActiveFilters(parsedFilters)
        } catch (e) {
          console.error('Error parsing saved filters:', e)
        }
      }
      
      window.addEventListener('filtersChanged', handleFiltersChanged as EventListener)
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('filtersChanged', handleFiltersChanged as EventListener)
      }
    }
  }, [])



  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open)
          if (!open) {
            setTimeout(() => setSearchedInput(""), 200)
          }
        }}
      >
        <DialogTrigger asChild>
          <div className="relative max-w-md flex-1 cursor-pointer" data-search-trigger>
            <LuSearch className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-500 dark:text-neutral-400" />
            <Input
              className="bg-background h-9 w-full rounded-md border pr-4 pl-10 text-sm shadow md:w-full"
              placeholder="Search notes"
              type="search"
            />
          </div>
        </DialogTrigger>
        <DialogContent className="top-[45%] max-w-xs p-0 sm:top-[38%] sm:max-w-lg">
          <DialogTitle className="sr-only">Search</DialogTitle>
          <DialogHeader>
            <input
              value={searchedInput}
              onChange={(e) => setSearchedInput(e.target.value)}
              placeholder="Search notes..."
              autoFocus
              className="h-14 border-b bg-transparent px-4 text-[15px] outline-none"
            />
          </DialogHeader>

          {isLoading ? (
            <p className="text-muted-foreground mx-auto mt-2 text-sm">
              Searching...
            </p>
          ) : (
            filteredResults.length === 0 &&
            searchedInput.length >= 1 && (
              <p className="text-muted-foreground mx-auto mt-2 text-sm">
                No results found for{" "}
                <span className="text-primary">{`"${searchedInput}"`}</span>
              </p>
            )
          )}
          <ScrollArea className="max-h-[350px] w-full overflow-hidden">
            <div className="flex w-full flex-col items-start px-1 pt-1 pb-4 sm:px-3">
              {searchedInput
                ? filteredResults.map((item) => {
                    if ("href" in item) {
                      const isFile = "type" in item && item.type === 'file'
                      const href = item.href.startsWith('/notes') || item.href.startsWith('/pyqs') || item.href.startsWith('/formula-sheets') ? item.href : `/docs${item.href}`
                      
                      return (
                        <DialogClose key={isFile ? `file-${item.id}` : item.href} asChild>
                          <Anchor
                            className={cn(
                              "flex w-full max-w-[310px] flex-col gap-0.5 rounded-sm p-3 text-[15px] transition-all duration-300 hover:bg-neutral-100 sm:max-w-[480px] dark:hover:bg-neutral-900"
                            )}
                            href={href}
                          >
                            <div className="flex h-full items-center gap-x-2">
                              {isFile ? (
                                <LuFile className="h-[1.1rem] w-[1.1rem] text-blue-500" />
                              ) : (
                                <LuFileText className="h-[1.1rem] w-[1.1rem]" />
                              )}
                              <span className="truncate">{item.title}</span>
                              {isFile && (
                                <span className="ml-auto text-xs text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded">
                                  FILE
                                </span>
                              )}
                            </div>
                            {"snippet" in item && item.snippet && (
                              <p
                                className="truncate text-xs text-neutral-500 dark:text-neutral-400"
                                dangerouslySetInnerHTML={{
                                  __html: highlight(
                                    item.snippet,
                                    searchedInput
                                  ),
                                }}
                              />
                            )}
                          </Anchor>
                        </DialogClose>
                      )
                    }
                    return null
                  })
                : (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-muted-foreground text-sm">
                      Start typing to search for subjects and files...
                    </p>
                  </div>
                )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  )
}
