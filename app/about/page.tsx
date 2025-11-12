'use client'

import { useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { SimpleBreadcrumb } from "@/components/ui/breadcrumb"
import { Github, Linkedin, Instagram, Code, Heart, Coffee, Globe } from "lucide-react"

export default function AboutPage() {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-4xl">
      <SimpleBreadcrumb items={[{ label: "About" }]} homeHref="/welcome" />
      
      <div className="flex flex-col items-center space-y-4 sm:space-y-8">
        {/* Profile Section */}
        <div className="flex flex-col items-center space-y-3 sm:space-y-6 text-center">
          <div className="relative">
            <Image
              src="/Taizun.PNG"
              alt="Taizun Kaptan"
              width={120}
              height={120}
              className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full border-2 sm:border-4 border-gray-200 dark:border-gray-800 shadow-lg"
              priority
            />
          </div>
          
          <div className="space-y-2 sm:space-y-4">
            <div className="space-y-1 sm:space-y-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Taizun Kaptan
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400">
                AI Developer & Creator
              </p>
            </div>
            
            {/* Social Icons */}
            <div className="flex justify-center space-x-4 sm:space-x-6">
              <a
                href="https://taizun.site"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a
                href="https://instagram.com/t4zun"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a
                href="https://github.com/t4zn"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                <Github className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a
                href="https://linkedin.com/in/taizuns"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                <Linkedin className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* About Content */}
        <div className="w-full max-w-4xl space-y-4 sm:space-y-8">
          <Card>
            <CardContent className="p-4 sm:p-6 md:p-8">
              <div className="space-y-4 sm:space-y-6 md:space-y-8">
                <div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                    <Heart className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                    About Me
                  </h2>
                  <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                    <p>
                      Hello! I&apos;m Taizun Kaptan, a passionate AI developer and the creator of MediNotes. 
                      I&apos;m currently pursuing my studies at Medicaps University while building innovative solutions 
                      that bridge the gap between technology and education.
                    </p>
                    <p>
                      This platform was born out of my own experience as a student struggling to find organized, 
                      quality study materials. I realized that many students face the same challenges, and I wanted 
                      to create something that would make academic resources more accessible to everyone.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                    <Code className="h-4 w-4 sm:h-5 sm:w-5" />
                    What I Do
                  </h3>
                  <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                    <p>
                      I specialize in developing AI-powered applications and intelligent systems that solve real-world problems. 
                      My expertise lies in creating user-friendly interfaces backed by powerful AI capabilities that enhance 
                      the learning experience.
                    </p>
                    <p>
                      Beyond this platform, I work on various AI projects ranging from natural language processing 
                      to machine learning applications. I believe in the power of artificial intelligence to transform 
                      how we learn, work, and interact with information.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4">Key Features I&apos;ve Built</h3>
                  <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="p-3 sm:p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                      <h4 className="text-sm sm:text-base font-medium mb-2">AI-Powered Chat Assistant</h4>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        Subject-specific AI tutoring with voice input capabilities for instant help with concepts and problems.
                      </p>
                    </div>
                    <div className="p-3 sm:p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                      <h4 className="text-sm sm:text-base font-medium mb-2">Google Drive Integration</h4>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        Seamless file sharing system that ensures reliable access to study materials without storage limitations.
                      </p>
                    </div>
                    <div className="p-3 sm:p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                      <h4 className="text-sm sm:text-base font-medium mb-2">Smart Organization</h4>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        Intelligent categorization by program, year, and subject for easy discovery of relevant materials.
                      </p>
                    </div>
                    <div className="p-3 sm:p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                      <h4 className="text-sm sm:text-base font-medium mb-2">Community Features</h4>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        User profiles, upload tracking, and collaborative features that build a strong academic community.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                    <Coffee className="h-4 w-4 sm:h-5 sm:w-5" />
                    Vision & Mission
                  </h3>
                  <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                    <p>
                      My mission is to democratize access to educational resources through AI-powered solutions. 
                      I believe that every student deserves access to quality study materials and personalized learning assistance, 
                      regardless of their background or circumstances.
                    </p>
                    <p>
                      Looking ahead, I envision expanding this platform to serve more universities and educational institutions, 
                      while continuously improving the AI capabilities to provide even more personalized and effective learning experiences.
                    </p>
                  </div>
                </div>


              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}