import { useEffect, useMemo, useCallback } from "react"
import { usePathname } from "next/navigation"
import { LuChevronDown, LuChevronRight } from "react-icons/lu"

import { Paths } from "@/lib/pageroutes"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { SheetClose } from "@/components/ui/sheet"
import Anchor from "@/components/anchor"
import { useSidebar } from "@/contexts/SidebarContext"

function isRoute(
  item: Paths
): item is Extract<Paths, { title: string; href: string }> {
  return "title" in item && "href" in item
}

export default function SubLink(
  props: Paths & { level: number; isSheet: boolean; parentKey?: string }
) {
  const path = usePathname()
  const { openSections, toggleSection } = useSidebar()
  
  // Create a unique section key that includes parent context
  const isRouteProps = isRoute(props)
  const parentKey = props.parentKey || ''
  const propTitle = isRouteProps ? props.title : ''
  const propHref = isRouteProps ? props.href : ''
  
  const sectionKey = useMemo(() => {
    if (!isRouteProps) return ''
    return `${parentKey}-${propTitle}-${propHref}`
  }, [parentKey, propTitle, propHref, isRouteProps])
  
  const isOpen = openSections[sectionKey] ?? false
  
  // Memoize the toggle handler to prevent unnecessary re-renders
  const handleToggle = useCallback(() => {
    toggleSection(sectionKey)
  }, [toggleSection, sectionKey])

  useEffect(() => {
    if (
      isRouteProps &&
      propHref &&
      path !== propHref &&
      path.includes(propHref) &&
      !isOpen
    ) {
      // Auto-expand for current path
      toggleSection(sectionKey)
    }
  }, [path, propHref, sectionKey, toggleSection, isRouteProps, isOpen])

  if (!isRoute(props)) {
    return null
  }

  const { title, href, items, noLink, level, isSheet } = props

  const Comp = (
    <Anchor activeClassName="text-primary text-sm font-semibold" href={href}>
      {title}
    </Anchor>
  )

  const titleOrLink = !noLink ? (
    isSheet ? (
      <SheetClose asChild>{Comp}</SheetClose>
    ) : (
      Comp
    )
  ) : (
    <h2 className="text-primary font-bold sm:text-sm">{title}</h2>
  )

  if (!items) {
    return <div className="flex flex-col text-sm">{titleOrLink}</div>
  }

  // Memoize the nested items to prevent unnecessary re-renders
  const nestedItems = useMemo(() => {
    return items?.map((innerLink) => {
      if (!isRoute(innerLink)) {
        return null
      }

      // Handle absolute paths (starting with /) differently
      const finalHref = innerLink.href.startsWith('/') ? innerLink.href : `${href}${innerLink.href}`
      
      const modifiedItems = {
        ...innerLink,
        href: finalHref,
        level: level + 1,
        isSheet,
        parentKey: sectionKey, // Pass current section key as parent for nested items
      }

      return <SubLink key={modifiedItems.href} {...modifiedItems} />
    })
  }, [items, href, level, isSheet, sectionKey])

  return (
    <div className="flex w-full flex-col gap-1">
      <Collapsible open={isOpen} onOpenChange={handleToggle}>
        <div className="mr-3 flex items-center gap-2 text-sm">
          {titleOrLink}
          <CollapsibleTrigger asChild>
            <Button className="ml-auto h-6 w-6" variant="link" size="icon">
              {!isOpen ? (
                <LuChevronRight className="h-[0.9rem] w-[0.9rem]" />
              ) : (
                <LuChevronDown className="h-[0.9rem] w-[0.9rem]" />
              )}
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="CollapsibleContent">
          <div
            className={cn(
              "mt-2.5 flex flex-col items-start gap-3 border-l pl-4 text-sm",
              level > 0 && "ml-1 border-l pl-4"
            )}
          >
            {nestedItems}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
