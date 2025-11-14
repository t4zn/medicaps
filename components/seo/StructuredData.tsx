'use client'

import Script from 'next/script'

interface StructuredDataProps {
  type?: 'website' | 'educational' | 'article'
  title?: string
  description?: string
  url?: string
}

export function StructuredData({ 
  description = 'Free study materials, notes, PYQs, and formula sheets for Medicaps University students'
}: StructuredDataProps) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "MediNotes",
    "alternateName": ["Medicaps Notes", "Medicaps Resources", "MediNotes Live", "Medicaps Nites", "Medicaps University Notes"],
    "url": "https://medinotes.live",
    "description": "Free study materials, notes, PYQs, and formula sheets for Medicaps University students with AI tutoring support",
    "inLanguage": "en-US",
    "publisher": {
      "@type": "Person",
      "name": "Taizun Kaptan",
      "url": "https://taizun.site"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://medinotes.live/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "audience": {
      "@type": "EducationalAudience",
      "educationalRole": "student"
    },
    "keywords": "MediNotes, medicaps notes, medicaps nites, Medicaps University, study materials, engineering notes, B.Tech notes, PYQ papers, formula sheets, AI tutoring"
  }

  const educationalSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "MediNotes",
    "alternateName": "MediNotes - Medicaps University Study Platform",
    "url": "https://medinotes.live",
    "description": "Leading educational platform providing free study materials, notes, PYQs, and AI tutoring for Medicaps University students",
    "foundingDate": "2024",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN",
      "addressRegion": "Madhya Pradesh",
      "addressLocality": "Indore"
    },
    "sameAs": [
      "https://taizun.site"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Free Study Materials for Medicaps University",
      "itemListElement": [
        {
          "@type": "Course",
          "name": "B.Tech Engineering Notes",
          "description": "Comprehensive study materials for B.Tech students including CSE, ECE, Civil, Mechanical, Electrical branches",
          "educationalLevel": "UndergraduateLevel",
          "provider": {
            "@type": "Organization",
            "name": "MediNotes"
          }
        },
        {
          "@type": "Course", 
          "name": "Previous Year Questions (PYQs)",
          "description": "Previous year question papers for exam preparation across all subjects and branches",
          "educationalLevel": "UndergraduateLevel",
          "provider": {
            "@type": "Organization",
            "name": "MediNotes"
          }
        },
        {
          "@type": "Course",
          "name": "Formula Sheets & Quick References",
          "description": "Comprehensive formula sheets and quick reference materials for engineering subjects",
          "educationalLevel": "UndergraduateLevel",
          "provider": {
            "@type": "Organization",
            "name": "MediNotes"
          }
        },
        {
          "@type": "Course",
          "name": "AI Tutoring Support",
          "description": "Instant AI-powered tutoring help for any subject or topic",
          "educationalLevel": "UndergraduateLevel",
          "provider": {
            "@type": "Organization",
            "name": "MediNotes"
          }
        }
      ]
    },
    "audience": {
      "@type": "EducationalAudience",
      "educationalRole": "student",
      "audienceType": "Medicaps University Students"
    }
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://medinotes.live"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Study Materials",
        "item": "https://medinotes.live/notes"
      }
    ]
  }

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "MediNotes",
    "url": "https://medinotes.live",
    "logo": "https://medinotes.live/icon.png",
    "description": description,
    "founder": {
      "@type": "Person",
      "name": "Taizun Kaptan",
      "url": "https://taizun.site"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": ["English", "Hindi"]
    }
  }

  return (
    <>
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema)
        }}
      />
      <Script
        id="educational-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(educationalSchema)
        }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema)
        }}
      />
    </>
  )
}