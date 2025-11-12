'use client'

import { useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { SimpleBreadcrumb } from "@/components/ui/breadcrumb"
import { Github, Linkedin, Instagram, Globe, Twitter } from "lucide-react"

const teamMembers = [
  {
    name: "Taizun Kaptan",
    role: "Founder & AI Developer",
    description: "Passionate AI developer creating innovative educational solutions. Currently studying at Medicaps University while building the future of learning.",
    image: "/Taizun.PNG",
    social: {
      website: "https://taizun.site",
      github: "https://github.com/t4zn",
      linkedin: "https://linkedin.com/in/taizuns",
      instagram: "https://instagram.com/t4zun"
    }
  },
  {
    name: "Vansh Singh",
    role: "Co-Founder & Developer",
    description: "Full-stack developer focused on creating seamless user experiences. Specializes in modern web technologies and system architecture.",
    image: "/vansh.PNG",
    social: {
      github: "https://github.com/v4nssh",
      linkedin: "#",
      instagram: "https://www.instagram.com/vanshhh16_/"
    }
  },
  {
    name: "Sakina",
    role: "Content Manager",
    description: "Ensures quality and organization of educational content. Manages content curation and maintains academic standards across the platform.",
    image: "/avatars/girl.PNG",
    social: {
      linkedin: "#",
      instagram: "#",
      twitter: "#"
    }
  },
  {
    name: "Raina",
    role: "Community Manager",
    description: "Builds and nurtures our student community. Focuses on user engagement and creating a supportive learning environment.",
    image: "/avatars/girl1.PNG",
    social: {
      linkedin: "#",
      instagram: "#",
      twitter: "#"
    }
  }
]

export default function AboutPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <SimpleBreadcrumb items={[{ label: "About" }]} homeHref="/welcome" />
      
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">Meet Our Team</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          The passionate individuals behind MediNotes, working together to make education more accessible for everyone.
        </p>
      </div>

      {/* Mobile View - Minimal */}
      <div className="block md:hidden space-y-4">
        {teamMembers.map((member, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold truncate">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                  <div className="flex space-x-2 mt-2">
                    {member.social.website && (
                      <a href={member.social.website} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                        <Globe className="h-3 w-3" />
                      </a>
                    )}
                    {member.social.github && (
                      <a href={member.social.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                        <Github className="h-3 w-3" />
                      </a>
                    )}
                    {member.social.linkedin && (
                      <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                        <Linkedin className="h-3 w-3" />
                      </a>
                    )}
                    {member.social.instagram && (
                      <a href={member.social.instagram} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                        <Instagram className="h-3 w-3" />
                      </a>
                    )}
                    {member.social.twitter && (
                      <a href={member.social.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                        <Twitter className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop View - Detailed */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {teamMembers.map((member, index) => (
          <Card key={index} className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="mb-4">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gray-100">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{member.role}</p>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">{member.description}</p>
              </div>
              
              <div className="flex justify-center space-x-3">
                {member.social.website && (
                  <a
                    href={member.social.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Globe className="h-4 w-4" />
                  </a>
                )}
                {member.social.github && (
                  <a
                    href={member.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                )}
                {member.social.linkedin && (
                  <a
                    href={member.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
                {member.social.instagram && (
                  <a
                    href={member.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                )}
                {member.social.twitter && (
                  <a
                    href={member.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center">
        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We&apos;re dedicated to democratizing access to educational resources through innovative technology. 
              Our platform connects students with quality study materials and AI-powered learning assistance, 
              making academic success more achievable for everyone at Medicaps University and beyond.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}