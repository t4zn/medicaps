'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'

interface SidebarContextType {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  openSections: Record<string, boolean>
  toggleSection: (section: string, shouldSync?: boolean) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true)
  
  // Default sections to be open (Program dropdowns)
  const defaultOpenSections = {
    'Notes-Program-/basic-setup': true,
    'PYQs-Program-/structure': true,
    'Formula Sheet-Program-/markdown': true,
  }
  
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(defaultOpenSections)

  // Load state from localStorage on mount
  useEffect(() => {
    const savedIsOpen = localStorage.getItem('sidebar-open')
    const savedSections = localStorage.getItem('sidebar-sections')
    
    if (savedIsOpen !== null) {
      setIsOpen(JSON.parse(savedIsOpen))
    }
    
    if (savedSections) {
      const parsedSections = JSON.parse(savedSections)
      // Merge saved sections with defaults, giving priority to saved sections
      setOpenSections({ ...defaultOpenSections, ...parsedSections })
    }
  }, [])

  // Save state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('sidebar-open', JSON.stringify(isOpen))
  }, [isOpen])

  useEffect(() => {
    localStorage.setItem('sidebar-sections', JSON.stringify(openSections))
  }, [openSections])

  const toggleSection = useCallback((section: string, shouldSync: boolean = true) => {
    setOpenSections(prev => {
      const newState = { ...prev }
      const newValue = !prev[section]
      
      // Set the main section
      newState[section] = newValue
      
      // Only synchronize if this is a manual toggle (shouldSync = true)
      if (shouldSync) {
        // Parse section key format: "Category-Title-Href" or "Category-Title-Href-SubTitle-SubHref"
        const parts = section.split('-')
        
        if (parts.length >= 3) {
          const category = parts[0] // "Notes", "PYQs", "Formula Sheet"
          const title = parts[1] // "Program", "B.Tech", "1st Year", etc.
          const href = parts[2] // "/basic-setup", "/btech", "/1st-year", etc.
          
          // Synchronize across categories for programs (B.Tech, B.Sc, etc.)
          if (['B.Tech', 'B.Sc', 'BBA', 'B.Com', 'M.Tech', 'MBA'].includes(title)) {
            const categories = ['Notes', 'PYQs', 'Formula Sheet']
            categories.forEach(cat => {
              if (cat !== category) {
                const syncKey = `${cat}-${title}-${href}`
                newState[syncKey] = newValue
              }
            })
          }
          
          // For nested sections like "Notes-B.Tech-/btech-1st Year-/1st-year"
          if (parts.length >= 5) {
            const subTitle = parts[3] // "1st Year", "2nd Year", etc.
            const subHref = parts[4] // "/1st-year", "/2nd-year", etc.
            
            if (['1st Year', '2nd Year', '3rd Year', '4th Year'].includes(subTitle)) {
              const categories = ['Notes', 'PYQs', 'Formula Sheet']
              categories.forEach(cat => {
                if (cat !== category) {
                  const syncKey = `${cat}-${title}-${href}-${subTitle}-${subHref}`
                  newState[syncKey] = newValue
                }
              })
            }
          }
        }
      }
      
      console.log('Toggling section:', section, 'from', prev[section], 'to', newValue, 'shouldSync:', shouldSync)
      return newState
    })
  }, [])

  return (
    <SidebarContext.Provider value={{
      isOpen,
      setIsOpen,
      openSections,
      toggleSection
    }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}