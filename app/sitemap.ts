import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://medinotes.live'
  
  // Static pages
  const staticPages = [
    '',
    '/about',
    '/docs',
    '/privacy',
    '/terms',
    '/auth',
    '/profile',
    '/welcome',
  ]

  // Program pages
  const programs = ['btech', 'bsc', 'bba', 'bcom', 'mtech', 'mba']
  const years = ['1st-year', '2nd-year', '3rd-year', '4th-year']
  const branches = [
    'cse', 'cse-ai', 'cse-ds', 'cse-networks', 'cse-aiml', 'cyber-security',
    'cse-iot', 'csbs', 'ece', 'civil', 'electrical', 'automobile-ev',
    'it', 'mechanical', 'robotics-automation'
  ]

  // Common subjects
  const commonSubjects = [
    'c-programming', 'chemistry', 'civil', 'communication-skills',
    'electrical', 'electronics', 'graphics', 'maths-1', 'maths-2',
    'mechanical', 'physics', 'workshop', 'discrete-mathematics',
    'data-communication', 'object-oriented-programming', 'data-structures',
    'java-programming', 'digital-electronics', 'computer-system-architecture',
    'soft-skills-1', 'soft-skills-2', 'soft-skills-3', 'soft-skills-4'
  ]

  const routes: MetadataRoute.Sitemap = []

  // Add static pages
  staticPages.forEach(page => {
    routes.push({
      url: `${baseUrl}${page}`,
      lastModified: new Date(),
      changeFrequency: page === '' ? 'daily' : 'weekly',
      priority: page === '' ? 1 : 0.8,
    })
  })

  // Add program pages
  programs.forEach(program => {
    routes.push({
      url: `${baseUrl}/notes/${program}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    })

    routes.push({
      url: `${baseUrl}/pyqs/${program}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    })

    routes.push({
      url: `${baseUrl}/formula-sheets/${program}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  })

  // Add B.Tech branch pages
  branches.forEach(branch => {
    years.forEach(year => {
      if (year === '4th-year' && !['btech'].includes('btech')) return

      routes.push({
        url: `${baseUrl}/notes/btech/${branch}/${year}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
      })

      routes.push({
        url: `${baseUrl}/pyqs/btech/${branch}/${year}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
      })

      routes.push({
        url: `${baseUrl}/formula-sheets/btech/${branch}/${year}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
      })
    })
  })

  // Add common subject pages
  commonSubjects.forEach(subject => {
    years.forEach(year => {
      routes.push({
        url: `${baseUrl}/notes/btech/${year}/${subject}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      })

      routes.push({
        url: `${baseUrl}/pyqs/btech/${year}/${subject}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      })

      routes.push({
        url: `${baseUrl}/formula-sheets/btech/${year}/${subject}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      })
    })
  })

  return routes
}