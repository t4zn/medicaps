import { Link } from "lib/transition"
import Image from "next/image"
import { LuUpload } from "react-icons/lu"


import { buttonVariants } from "@/components/ui/button"
import { Button } from "@/components/ui/button"
import Search from "@/components/navigation/search"

export default function Home() {
  return (
    <section className="flex min-h-[86.5vh] flex-col items-center justify-center px-2 py-8 text-center">
      <div className="mb-4 flex items-center justify-center gap-2 sm:gap-4">
        <Image
          src="/icon.png"
          alt="Medicaps Resources Icon"
          width={128}
          height={128}
          className="h-12 w-12 sm:h-32 sm:w-32"
        />
        <h1 className="text-2xl font-bold sm:text-7xl whitespace-nowrap">Medicaps Resources</h1>
      </div>
      <p className="text-foreground mb-8 max-w-[320px] sm:max-w-[600px] text-xs sm:text-base leading-relaxed">
        <span className="sm:hidden">
          Find notes, PYQs, and study materials for Medicaps University students.
        </span>
        <span className="hidden sm:inline">
          Find notes, PYQs, cheat sheets, and study materials for Medicaps University. 
          Your comprehensive resource hub for academic success.
        </span>
      </p>

      <div className="mb-6 w-full max-w-md">
        <Search />
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link
          href="/docs/basic-setup"
          className={buttonVariants({ variant: "outline", className: "px-6 w-full sm:w-auto", size: "lg" })}
        >
          Get Started
        </Link>
        <Link href="/upload">
          <Button size="lg" className="w-full sm:w-auto">
            <LuUpload className="mr-2 h-5 w-5" />
            Upload Files
          </Button>
        </Link>
      </div>
    </section>
  )
}
