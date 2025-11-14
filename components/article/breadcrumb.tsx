import { Fragment } from "react"
import { Link } from "lib/transition"
import { LuHouse } from "react-icons/lu"


import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { toTitleCase } from "@/utils/toTitleCase"

export function ArticleBreadcrumb({ paths }: { paths: string[] }) {
  return (
    <div className="pb-5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link
                title="Documentation Home"
                aria-label="Documentation Home"
                href="/welcome"
              >
                <LuHouse className="h-4" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          {paths.length > 2 ? (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {toTitleCase(paths[0])}
                </BreadcrumbPage>
              </BreadcrumbItem>

              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbEllipsis className="h-1" />
              </BreadcrumbItem>

              {paths.slice(-1).map((path) => (
                <Fragment key={path}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      {toTitleCase(path)}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </Fragment>
              ))}
            </>
          ) : (
            paths.map((path) => (
              <Fragment key={path}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {toTitleCase(path)}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </Fragment>
            ))
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}
