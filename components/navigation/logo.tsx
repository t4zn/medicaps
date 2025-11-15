import Image from "next/image"
import { Link } from "lib/transition"

import { Settings } from "@/types/settings"

export function Logo() {
  return (
    <Link
      href="/"
      title={`${Settings.title} main logo`}
      aria-label={`${Settings.title} main logo`}
      className="flex items-center gap-2 hover:opacity-80 transition-opacity"
    >
      <Image
        src="/logo_light.svg"
        alt={`${Settings.title} main logo`}
        width={28}
        height={28}
        loading="lazy"
        decoding="async"
        className="dark:hidden"
      />
      <Image
        src="/logo.svg"
        alt={`${Settings.title} main logo`}
        width={28}
        height={28}
        loading="lazy"
        decoding="async"
        className="hidden dark:block"
      />
      <span className="text-sm font-semibold text-black dark:text-white">{Settings.title}</span>
    </Link>
  )
}
