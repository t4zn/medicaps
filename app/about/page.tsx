import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { SimpleBreadcrumb } from "@/components/ui/breadcrumb"
import { Github, Linkedin, Instagram, Code, Heart, Coffee, Globe } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <SimpleBreadcrumb items={[{ label: "About" }]} homeHref="/welcome" />
      
      <div className="flex flex-col items-center space-y-8">
        {/* Profile Section */}
        <div className="flex flex-col items-center space-y-6 text-center">
          <div className="relative">
            <Image
              src="/Taizun.PNG"
              alt="Taizun Kaptan"
              width={200}
              height={200}
              className="rounded-full border-4 border-gray-200 dark:border-gray-800 shadow-lg"
              priority
            />
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Taizun Kaptan
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                AI Developer & Creator
              </p>
            </div>
            
            {/* Social Icons */}
            <div className="flex justify-center space-x-6">
              <a
                href="https://taizun.site"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                <Globe className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com/t4zun"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://github.com/t4zn"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/in/taizuns"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* About Content */}
        <div className="w-full max-w-4xl space-y-8">
          <Card>
            <CardContent className="p-8">
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                    <Heart className="h-6 w-6" />
                    About Me
                  </h2>
                  <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                    <p>
                      Hello! I&apos;m Taizun Kaptan, a passionate AI developer and the creator of Medicaps Resources. 
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
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    What I Do
                  </h3>
                  <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
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
                  <h3 className="text-xl font-semibold mb-4">Key Features I&apos;ve Built</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                      <h4 className="font-medium mb-2">AI-Powered Chat Assistant</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Subject-specific AI tutoring with voice input capabilities for instant help with concepts and problems.
                      </p>
                    </div>
                    <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                      <h4 className="font-medium mb-2">Google Drive Integration</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Seamless file sharing system that ensures reliable access to study materials without storage limitations.
                      </p>
                    </div>
                    <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                      <h4 className="font-medium mb-2">Smart Organization</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Intelligent categorization by program, year, and subject for easy discovery of relevant materials.
                      </p>
                    </div>
                    <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                      <h4 className="font-medium mb-2">Community Features</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        User profiles, upload tracking, and collaborative features that build a strong academic community.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Coffee className="h-5 w-5" />
                    Vision & Mission
                  </h3>
                  <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
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

                <div>
                  <h3 className="text-xl font-semibold mb-4">Philosophy</h3>
                  <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border-l-4 border-gray-300 dark:border-gray-700">
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed italic">
                      &ldquo;Technology should serve humanity, not the other way around. Every line of code I write 
                      is aimed at making someone&rsquo;s life easier, their learning more effective, or their goals more achievable. 
                      The best AI solutions are those that feel natural and empower users rather than replace them.&rdquo;
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