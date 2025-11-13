import Link from "next/link"

import { Settings } from "@/types/settings"

export function Footer() {
  return (
    <footer className="text-foreground w-full border-t px-4 py-4 text-sm lg:px-8">
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between sm:gap-0">
        <p className="text-center sm:text-left">
          &copy; {new Date().getFullYear()}{" "}
          <Link
            title={Settings.name}
            aria-label={Settings.name}
            className="hover:text-foreground transition-colors"
            href={Settings.link}
          >
            {Settings.name}
          </Link>
          .
        </p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <Link href="/about" className="hover:text-foreground transition-colors">
            About
          </Link>
          <Link href="/blog" className="hover:text-foreground transition-colors">
            Blog
          </Link>
          <Link href="/faq" className="hover:text-foreground transition-colors">
            FAQ
          </Link>
          <Link href="/docs" className="hover:text-foreground transition-colors">
            Docs
          </Link>
          <Link href="/privacy" className="hover:text-foreground transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-foreground transition-colors">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  )
}
