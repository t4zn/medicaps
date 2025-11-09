'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'

interface SidebarContextType {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  openSections: Record<string, boolean>
  toggleSection: (section: string) => void
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

  // Clear old localStorage data on first load to fix synchronization issues
  useEffect(() => {
    const version = localStorage.getItem('sidebar-version')
    if (version !== '2.1') {
      // Force clear all sidebar data to fix synchronization issues
      localStorage.removeItem('sidebar-sections')
      localStorage.removeItem('sidebar-open')
      localStorage.setItem('sidebar-version', '2.1')
      // Reset to default state
      setOpenSections(defaultOpenSections)
      console.log('Cleared sidebar cache and reset to defaults')
    }
  }, [])

  // Load state from localStorage on mount
  useEffect(() => {
    const savedIsOpen = localStorage.getItem('sidebar-open')
    const savedSections = localStorage.getItem('sidebar-sections')
    
    if (savedIsOpen !== null) {
      setIsOpen(JSON.parse(savedIsOpen))
    }
    
    // Clear old localStorage data that might have synchronization issues
    // and start fresh with default sections
    if (savedSections) {
      try {
        const parsedSections = JSON.parse(savedSections)
        // Only keep sections that don't have synchronization conflicts
        const cleanedSections: Record<string, boolean> = {}
        Object.keys(parsedSections).forEach(key => {
          // Only preserve the main program sections, not nested ones that might cause conflicts
          if (key.includes('Program-/')) {
            cleanedSections[key] = parsedSections[key]
          }
        })
        setOpenSections({ ...defaultOpenSections, ...cleanedSections })
      } catch (error) {
        // If there's any error parsing, just use defaults
        setOpenSections(defaultOpenSections)
      }
    }
  }, [])

  // Save state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('sidebar-open', JSON.stringify(isOpen))
  }, [isOpen])

  useEffect(() => {
    localStorage.setItem('sidebar-sections', JSON.stringify(openSections))
  }, [openSections])

  const toggleSection = useCallback((section: string) => {
    setOpenSections(prev => {
      const newState = { ...prev }
      const newValue = !prev[section]
      
      // Set the main section
      newState[section] = newValue
      
      // Debug logging to track what's happening
      console.log('Toggling section:', section, 'from', prev[section], 'to', newValue)
      
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