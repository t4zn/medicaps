import { Link } from "lib/transition"
import Image from "next/image"
import { LuUpload } from "react-icons/lu"


import { buttonVariants } from "@/components/ui/button"
import { Button } from "@/components/ui/button"
import Search from "@/components/navigation/search"

export default function Home() {
  return (
    <section className="flex min-h-[86.5vh] flex-col items-center justify-center px-2 py-8 text-center">
      <div className="mb-4 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
        <Image
          src="/icon.png"
          alt="Medicaps Resources Icon"
          width={128}
          height={128}
          className="h-16 w-16 sm:h-32 sm:w-32"
        />
        <h1 className="text-3xl font-bold sm:text-7xl">Medicaps Resources</h1>
      </div>
      <p className="text-foreground mb-8 max-w-[600px] sm:text-base">
        Find notes, PYQs, cheat sheets, and study materials for Medicaps University. 
        Your comprehensive resource hub for academic success.
      </p>

      <div className="mb-6 w-full max-w-md">
        <Search />
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link href="/upload">
          <Button size="lg" className="w-full sm:w-auto">
            <LuUpload className="mr-2 h-5 w-5" />
            Upload Files
          </Button>
        </Link>
        <Link
          href="/docs/basic-setup"
          className={buttonVariants({ variant: "outline", className: "px-6 w-full sm:w-auto", size: "lg" })}
        >
          Get Started
        </Link>
      </div>
    </section>
  )
}
