'use client'

import Script from 'next/script'

interface StructuredDataProps {
  type?: 'website' | 'educational' | 'article'
  title?: string
  description?: string
  url?: string
}

export function StructuredData({ 
  type = 'website', 
  title = 'MediNotes',
  description = 'Free study materials, notes, PYQs, and formula sheets for Medicaps University students',
  url = 'https://medinotes.live'
}: StructuredDataProps) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "MediNotes",
    "alternateName": ["Medicaps Notes", "Medicaps Resources"],
    "url": "https://medinotes.live",
    "description": description,
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
    }
  }

  const educationalSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "MediNotes",
    "url": "https://medinotes.live",
    "description": description,
    "sameAs": [
      "https://taizun.site"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Study Materials",
      "itemListElement": [
        {
          "@type": "Course",
          "name": "B.Tech Engineering Notes",
          "description": "Comprehensive study materials for B.Tech students",
          "provider": {
            "@type": "Organization",
            "name": "MediNotes"
          }
        },
        {
          "@type": "Course", 
          "name": "Previous Year Questions (PYQs)",
          "description": "Previous year question papers for exam preparation",
          "provider": {
            "@type": "Organization",
            "name": "MediNotes"
          }
        }
      ]
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