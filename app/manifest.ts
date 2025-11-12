import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MediNotes - Study Materials for Medicaps University',
    short_name: 'MediNotes',
    description: 'Free study materials, notes, PYQs, and formula sheets for Medicaps University students with AI-powered tutoring',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    orientation: 'portrait',
    scope: '/',
    lang: 'en',
    categories: ['education', 'productivity', 'reference'],
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icon.png',
        sizes: '48x48',
        type: 'image/png'
      }
    ],
    shortcuts: [
      {
        name: 'Browse Notes',
        short_name: 'Notes',
        description: 'Browse study notes by program and year',
        url: '/notes/btech',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }]
      },
      {
        name: 'Previous Year Questions',
        short_name: 'PYQs',
        description: 'Access previous year question papers',
        url: '/pyqs/btech',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }]
      },
      {
        name: 'Formula Sheets',
        short_name: 'Formulas',
        description: 'Quick access to formula sheets',
        url: '/formula-sheets/btech',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }]
      },
      {
        name: 'Upload Files',
        short_name: 'Upload',
        description: 'Upload study materials',
        url: '/upload',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }]
      }
    ]
  }
}