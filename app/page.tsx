import { Link } from "lib/transition"
import Image from "next/image"
import { 
  LuUpload, 
  LuFileText, 
  LuClipboardList, 
  LuCalculator, 
  LuUsers, 
  LuGraduationCap,
  LuBookOpen,
  LuDownload
} from "react-icons/lu"

import { buttonVariants } from "@/components/ui/button"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Search from "@/components/navigation/search"

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-12 text-center bg-gradient-to-b from-background to-muted/20">
        <div className="mb-6 flex items-center justify-center gap-3 sm:gap-4">
          <Image
            src="/icon.png"
            alt="Medicaps Resources Icon"
            width={128}
            height={128}
            className="h-16 w-16 sm:h-24 sm:w-24"
          />
          <div>
            <h1 className="text-3xl font-bold sm:text-6xl lg:text-7xl">
              Medicaps Resources
            </h1>
            <p className="text-sm sm:text-lg text-muted-foreground mt-2">
              Your Academic Success Hub
            </p>
          </div>
        </div>
        
        <p className="text-muted-foreground mb-8 max-w-2xl text-sm sm:text-lg leading-relaxed">
          Access thousands of study materials, notes, previous year questions, and formula sheets 
          shared by Medicaps University students. Join our community and excel in your academics.
        </p>

        <div className="mb-8 w-full max-w-lg">
          <Search />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/welcome"
            className={buttonVariants({ variant: "default", size: "lg", className: "w-full sm:w-auto" })}
          >
            <LuBookOpen className="mr-2 h-5 w-5" />
            Get Started
          </Link>
          <Link href="/upload">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              <LuUpload className="mr-2 h-5 w-5" />
              Upload Files
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What You'll Find Here</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to succeed in your studies at Medicaps University
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-blue-100 dark:bg-blue-900 rounded-full w-fit">
                  <LuFileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>Study Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Comprehensive notes from all subjects, organized by program, year, and branch.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-green-100 dark:bg-green-900 rounded-full w-fit">
                  <LuClipboardList className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>Previous Year Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Practice with real exam questions from previous years to ace your exams.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-purple-100 dark:bg-purple-900 rounded-full w-fit">
                  <LuCalculator className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle>Formula Sheets</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Quick reference formula sheets for mathematics, physics, and engineering subjects.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">1000+</div>
              <div className="text-sm text-muted-foreground">Study Materials</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-sm text-muted-foreground">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">15+</div>
              <div className="text-sm text-muted-foreground">Programs Covered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <div className="text-sm text-muted-foreground">Subjects Available</div>
            </div>
          </div>

          {/* Programs Section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Available Programs</h2>
            <p className="text-muted-foreground mb-8">
              Find resources for your specific program and year
            </p>
            
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/notes/btech">
                <Badge variant="outline" className="px-4 py-2 text-sm hover:bg-primary hover:text-primary-foreground cursor-pointer">
                  <LuGraduationCap className="mr-2 h-4 w-4" />
                  B.Tech
                </Badge>
              </Link>
              <Badge variant="outline" className="px-4 py-2 text-sm opacity-50">
                B.Sc (Coming Soon)
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-sm opacity-50">
                BBA (Coming Soon)
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-sm opacity-50">
                B.Com (Coming Soon)
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-sm opacity-50">
                M.Tech (Coming Soon)
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-sm opacity-50">
                MBA (Coming Soon)
              </Badge>
            </div>
          </div>

          {/* CTA Section */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="text-center py-12">
              <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Join thousands of Medicaps students who are already using our platform to excel in their studies.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/signup">
                  <Button size="lg" className="w-full sm:w-auto">
                    <LuUsers className="mr-2 h-5 w-5" />
                    Join Community
                  </Button>
                </Link>
                <Link href="/notes/btech">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    <LuDownload className="mr-2 h-5 w-5" />
                    Start Downloading
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
