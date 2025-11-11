// Import search data with fallback for development
let searchJson: SearchDocument[] = []
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  searchJson = require("@/public/search-data/documents.json")
} catch (error) {
  console.warn("Search data not available:", error)
  searchJson = []
}
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { Paths } from "@/lib/pageroutes"

interface SearchMeta {
  cleanContent: string
  headings: string[]
  keywords: string[]
}

interface SearchDocument {
  slug: string
  title: string
  content: string
  description: string
  _searchMeta: SearchMeta
}

export type search = {
  title: string
  href: string
  snippet?: string
  description?: string
  relevance?: number
}

const searchData = searchJson

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>()

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args)

    if (cache.has(key)) {
      const cachedResult = cache.get(key)
      if (cachedResult !== undefined) {
        return cachedResult
      }
    }

    const result = fn(...args)

    if (result !== "" && result != null) {
      cache.set(key, result)
    }

    return result
  }) as T
}

const memoizedSearchMatch = memoize(searchMatch)

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function isRoute(
  node: Paths
): node is Extract<Paths, { href: string; title: string }> {
  return "href" in node && "title" in node
}

export function helperSearch(
  query: string,
  node: Paths,
  prefix: string,
  currentLevel: number,
  maxLevel?: number
) {
  const res: Paths[] = []
  let parentHas = false
  const lowerQuery = query.toLowerCase()

  if (isRoute(node)) {
    const nextLink = `${prefix}${node.href}`

    const titleMatch = node.title.toLowerCase().includes(lowerQuery)
    const titleDistance = memoizedSearchMatch(
      lowerQuery,
      node.title.toLowerCase()
    )

    if (titleMatch || titleDistance <= 2) {
      res.push({ ...node, items: undefined, href: nextLink })
      parentHas = true
    }

    const goNext = maxLevel ? currentLevel < maxLevel : true

    if (goNext && node.items) {
      node.items.forEach((item) => {
        const innerRes = helperSearch(
          query,
          item,
          nextLink,
          currentLevel + 1,
          maxLevel
        )
        if (innerRes.length && !parentHas && !node.noLink) {
          res.push({ ...node, items: undefined, href: nextLink })
          parentHas = true
        }
        res.push(...innerRes)
      })
    }
  }

  return res
}

function searchMatch(a: string, b: string): number {
  if (typeof a !== "string" || typeof b !== "string") return 0

  const aLen = a.length
  const bLen = b.length

  if (aLen === 0) return bLen
  if (bLen === 0) return aLen

  if (aLen > bLen) [a, b] = [b, a]

  const maxDistance = Math.min(Math.max(Math.floor(aLen / 2), 2), 5)

  let prevRow = Array(aLen + 1).fill(0)
  let currRow = Array(aLen + 1).fill(0)

  for (let i = 0; i <= aLen; i++) prevRow[i] = i

  for (let j = 1; j <= bLen; j++) {
    currRow[0] = j
    for (let i = 1; i <= aLen; i++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      currRow[i] = Math.min(
        prevRow[i] + 1,
        currRow[i - 1] + 1,
        prevRow[i - 1] + cost
      )

      if (currRow[i] > maxDistance) {
        return maxDistance
      }
    }
    ;[prevRow, currRow] = [currRow, prevRow]
  }

  return Math.min(prevRow[aLen], maxDistance)
}

function calculateRelevance(
  query: string,
  title: string,
  content: string,
  headings: string[],
  keywords: string[]
): number {
  const lowerQuery = query.toLowerCase().trim()
  const lowerTitle = title.toLowerCase()
  const queryWords = lowerQuery.split(/\s+/)

  let score = 0

  if (lowerTitle === lowerQuery) {
    score += 50
  } else if (lowerTitle.includes(lowerQuery)) {
    score += 30
  }

  queryWords.forEach((word) => {
    if (lowerTitle.includes(word)) {
      score += 15
    }
  })

  const lowerHeadings = headings.map((h) => h.toLowerCase())
  if (lowerHeadings.some((h) => h === lowerQuery)) {
    score += 40
  }
  lowerHeadings.forEach((heading) => {
    if (heading.includes(lowerQuery)) {
      score += 25
    }
  })

  const lowerKeywords = keywords.map((k) => k.toLowerCase())
  if (lowerKeywords.some((k) => k === lowerQuery)) {
    score += 35
  }
  lowerKeywords.forEach((keyword) => {
    if (keyword.includes(lowerQuery)) {
      score += 20
    }
  })

  const exactMatches = content
    .toLowerCase()
    .match(new RegExp(`\\b${lowerQuery}\\b`, "gi"))
  if (exactMatches) {
    score += exactMatches.length * 10
  }

  queryWords.forEach((word) => {
    if (content.toLowerCase().includes(word)) {
      score += 5
    }
  })

  const proximityScore = calculateProximityScore(
    lowerQuery,
    content.toLowerCase()
  )
  score += proximityScore * 2

  return score / Math.log(content.length + 1)
}

function calculateProximityScore(query: string, content: string): number {
  if (typeof query !== "string" || typeof content !== "string") return 0

  const words = content.split(/\s+/)
  const queryWords = query.split(/\s+/)

  let proximityScore = 0
  let firstIndex = -1

  queryWords.forEach((queryWord, queryIndex) => {
    const wordIndex = words.indexOf(queryWord, firstIndex + 1)

    if (wordIndex !== -1) {
      if (queryIndex === 0) {
        proximityScore += 30
      } else if (wordIndex - firstIndex <= 3) {
        proximityScore += 20 - (wordIndex - firstIndex)
      }

      firstIndex = wordIndex
    } else {
      firstIndex = -1
    }
  })

  return proximityScore
}

function extractSnippet(content: string, query: string): string {
  const indices: number[] = []
  const words = query.split(/\s+/)

  words.forEach((word) => {
    const index = content.indexOf(word)
    if (index !== -1) {
      indices.push(index)
    }
  })

  if (indices.length === 0) {
    return content.slice(0, 100)
  }

  const avgIndex = Math.floor(indices.reduce((a, b) => a + b) / indices.length)
  const snippetLength = 160
  const contextLength = Math.floor(snippetLength / 2)
  const start = Math.max(0, avgIndex - contextLength)
  const end = Math.min(avgIndex + contextLength, content.length)

  let snippet = content.slice(start, end)
  if (start > 0) snippet = `...${snippet}`
  if (end < content.length) snippet += "..."

  return snippet
}

// Subject data for search
const subjectData = [
  // 1st Year subjects
  { title: "Engineering Mathematics-I", href: "/notes/btech/1st-year/maths-1", code: "EN3BS11", category: "1st Year" },
  { title: "Engineering Mathematics-II", href: "/notes/btech/1st-year/maths-2", code: "EN3BS12", category: "1st Year" },
  { title: "Engineering Physics", href: "/notes/btech/1st-year/physics", code: "EN3BS16", category: "1st Year" },
  { title: "Engineering Chemistry", href: "/notes/btech/1st-year/chemistry", code: "EN3BS14", category: "1st Year" },
  { title: "Basic Electrical Engineering", href: "/notes/btech/1st-year/electrical", code: "EN3ES17", category: "1st Year" },
  { title: "Basic Electronics Engineering", href: "/notes/btech/1st-year/electronics", code: "EN3ES16", category: "1st Year" },
  { title: "Engineering Graphics", href: "/notes/btech/1st-year/graphics", code: "EN3ES26", category: "1st Year" },
  { title: "Basic Programming with C", href: "/notes/btech/1st-year/c-programming", code: "EN3ES27", category: "1st Year" },
  { title: "Basic Civil Engineering & Mechanics", href: "/notes/btech/1st-year/civil", code: "EN3ES30", category: "1st Year" },
  { title: "Workshop Practice", href: "/notes/btech/1st-year/workshop", code: "EN3ES29", category: "1st Year" },
  { title: "Communication Skills", href: "/notes/btech/1st-year/communication-skills", code: "EN3HS10", category: "1st Year" },
  
  // CSE 2nd Year subjects
  { title: "Discrete Mathematics", href: "/notes/btech/cse/2nd-year/discrete-mathematics", code: "CS3BS04", category: "CSE 2nd Year" },
  { title: "Data Communication", href: "/notes/btech/cse/2nd-year/data-communication", code: "CS3CO28", category: "CSE 2nd Year" },
  { title: "Object Oriented Programming", href: "/notes/btech/cse/2nd-year/object-oriented-programming", code: "CS3CO30", category: "CSE 2nd Year" },
  { title: "Data Structures", href: "/notes/btech/cse/2nd-year/data-structures", code: "CS3CO31", category: "CSE 2nd Year" },
  { title: "Java Programming", href: "/notes/btech/cse/2nd-year/java-programming", code: "CS3CO32", category: "CSE 2nd Year" },
  { title: "Digital Electronics", href: "/notes/btech/cse/2nd-year/digital-electronics", code: "CS3CO33", category: "CSE 2nd Year" },
  { title: "Computer System Architecture", href: "/notes/btech/cse/2nd-year/computer-system-architecture", code: "CS3CO34", category: "CSE 2nd Year" },
  { title: "Soft Skills-I", href: "/notes/btech/cse/2nd-year/soft-skills-1", code: "EN3NG03", category: "CSE 2nd Year" },
  { title: "Microprocessor and Interfacing", href: "/notes/btech/cse/2nd-year/microprocessor-and-interfacing", code: "CS3CO35", category: "CSE 2nd Year" },
  { title: "Advanced Java Programming", href: "/notes/btech/cse/2nd-year/advanced-java-programming", code: "CS3CO37", category: "CSE 2nd Year" },
  { title: "Database Management Systems", href: "/notes/btech/cse/2nd-year/database-management-systems", code: "CS3CO39", category: "CSE 2nd Year" },
  { title: "Theory of Computation", href: "/notes/btech/cse/2nd-year/theory-of-computation", code: "CS3CO46", category: "CSE 2nd Year" },
  { title: "Operating Systems", href: "/notes/btech/cse/2nd-year/operating-systems", code: "CS3CO47", category: "CSE 2nd Year" },
  { title: "Soft Skills-II", href: "/notes/btech/cse/2nd-year/soft-skills-2", code: "EN3NG10", category: "CSE 2nd Year" },
  
  // CSE 3rd Year subjects
  { title: "Software Engineering", href: "/notes/btech/cse/3rd-year/software-engineering", code: "CS3CO40", category: "CSE 3rd Year" },
  { title: "Computer Networks", href: "/notes/btech/cse/3rd-year/computer-networks", code: "CS3CO43", category: "CSE 3rd Year" },
  { title: "Economics", href: "/notes/btech/cse/3rd-year/economics", code: "EN3HS04", category: "CSE 3rd Year" },
  { title: "Soft Skills-III", href: "/notes/btech/cse/3rd-year/soft-skills-3", code: "EN3NG09", category: "CSE 3rd Year" },
  { title: "Compiler Design", href: "/notes/btech/cse/3rd-year/compiler-design", code: "CS3CO44", category: "CSE 3rd Year" },
  { title: "Design and Analysis of Algorithms", href: "/notes/btech/cse/3rd-year/design-and-analysis-of-algorithms", code: "CS3CO45", category: "CSE 3rd Year" },
  { title: "Research Methodology", href: "/notes/btech/cse/3rd-year/research-methodology", code: "CS3ES15", category: "CSE 3rd Year" },
  { title: "Soft Skills-IV", href: "/notes/btech/cse/3rd-year/soft-skills-4", code: "EN3NG08", category: "CSE 3rd Year" },
  
  // CSE 4th Year subjects
  { title: "Industrial Training", href: "/notes/btech/cse/4th-year/industrial-training", code: "CS3PC03", category: "CSE 4th Year" },
  
  // CSE AI 2nd Year subjects
  { title: "Discrete Mathematics", href: "/notes/btech/cse-ai/2nd-year/discrete-mathematics", code: "CS3BS04", category: "CSE AI 2nd Year" },
  { title: "Data Communication", href: "/notes/btech/cse-ai/2nd-year/data-communication", code: "CS3CO28", category: "CSE AI 2nd Year" },
  { title: "Data Structures", href: "/notes/btech/cse-ai/2nd-year/data-structures", code: "CS3CO31", category: "CSE AI 2nd Year" },
  { title: "Digital Electronics", href: "/notes/btech/cse-ai/2nd-year/digital-electronics", code: "CS3CO33", category: "CSE AI 2nd Year" },
  { title: "Computer System Architecture", href: "/notes/btech/cse-ai/2nd-year/computer-system-architecture", code: "CS3CO34", category: "CSE AI 2nd Year" },
  { title: "Principles of Artificial Intelligence", href: "/notes/btech/cse-ai/2nd-year/principles-of-artificial-intelligence", code: "CS3CO35", category: "CSE AI 2nd Year" },
  { title: "Soft Skills-I", href: "/notes/btech/cse-ai/2nd-year/soft-skills-1", code: "EN3NG03", category: "CSE AI 2nd Year" },
  { title: "Operating Systems", href: "/notes/btech/cse-ai/2nd-year/operating-systems", code: "CS3CO47", category: "CSE AI 2nd Year" },
  { title: "Advanced Java/Python Programming", href: "/notes/btech/cse-ai/2nd-year/advanced-java-or-python-programming", code: "CS3CO37", category: "CSE AI 2nd Year" },
  { title: "Theory of Computation", href: "/notes/btech/cse-ai/2nd-year/theory-of-computation", code: "CS3CO46", category: "CSE AI 2nd Year" },
  { title: "Database Management Systems", href: "/notes/btech/cse-ai/2nd-year/database-management-systems", code: "CS3CO39", category: "CSE AI 2nd Year" },
  { title: "Machine Learning Fundamentals", href: "/notes/btech/cse-ai/2nd-year/machine-learning-fundamentals", code: "CS3CO40", category: "CSE AI 2nd Year" },
  { title: "Soft Skills-II", href: "/notes/btech/cse-ai/2nd-year/soft-skills-2", code: "EN3NG10", category: "CSE AI 2nd Year" },
  
  // CSE DS 2nd Year subjects
  { title: "Data Science Fundamentals", href: "/notes/btech/cse-ds/2nd-year/data-science-fundamentals", code: "CS3CO50", category: "CSE DS 2nd Year" },
  
  // CSE Networks 2nd Year subjects  
  { title: "Network Fundamentals", href: "/notes/btech/cse-networks/2nd-year/network-fundamentals", code: "CS3CO60", category: "CSE Networks 2nd Year" },
  
  // CSE AI&ML 2nd Year subjects
  { title: "AI and ML Basics", href: "/notes/btech/cse-aiml/2nd-year/ai-ml-basics", code: "CS3CO70", category: "CSE AI&ML 2nd Year" },
  
  // CSE IoT 2nd Year subjects
  { title: "IoT Fundamentals", href: "/notes/btech/cse-iot/2nd-year/iot-fundamentals", code: "CS3CO80", category: "CSE IoT 2nd Year" },
]

function searchSubjects(query: string, filters?: { year: string; branch: string }): search[] {
  const lowerQuery = query.toLowerCase().trim()
  const queryWords = lowerQuery.split(/\s+/)
  
  return subjectData
    .filter((subject) => {
      // Apply filters if provided
      if (filters) {
        // Filter by year
        if (filters.year !== 'all') {
          const yearMap: Record<string, string> = {
            '1st-year': '1st Year',
            '2nd-year': '2nd Year',
            '3rd-year': '3rd Year',
            '4th-year': '4th Year'
          }
          const yearText = yearMap[filters.year]
          if (yearText && !subject.category.includes(yearText)) {
            return false
          }
        }
        
        // Filter by branch
        if (filters.branch !== 'all') {
          const branchMap: Record<string, string[]> = {
            'cse': ['CSE'],
            'cse-ai': ['CSE AI'],
            'cse-ds': ['CSE DS'],
            'cse-networks': ['CSE Networks'],
            'cse-aiml': ['CSE AI', 'CSE ML'],
            'cyber-security': ['Cyber Security'],
            'cse-iot': ['CSE IoT'],
            'csbs': ['CSBS'],
            'ece': ['ECE'],
            'civil': ['Civil'],
            'electrical': ['Electrical'],
            'mechanical': ['Mechanical'],
            'automobile': ['Automobile'],
            'it': ['IT'],
            'robotics': ['Robotics']
          }
          
          const branchTexts = branchMap[filters.branch]
          if (branchTexts && !branchTexts.some(text => subject.category.includes(text))) {
            // For 1st year subjects, they apply to all branches
            if (!subject.category.includes('1st Year')) {
              return false
            }
          }
        }
      }
      
      return true
    })
    .map((subject) => {
      let relevance = 0
      
      // Exact title match
      if (subject.title.toLowerCase() === lowerQuery) {
        relevance += 100
      } else if (subject.title.toLowerCase().includes(lowerQuery)) {
        relevance += 50
      }
      
      // Code match
      if (subject.code.toLowerCase().includes(lowerQuery)) {
        relevance += 80
      }
      
      // Category match
      if (subject.category.toLowerCase().includes(lowerQuery)) {
        relevance += 30
      }
      
      // Word matches
      queryWords.forEach((word) => {
        if (subject.title.toLowerCase().includes(word)) {
          relevance += 20
        }
        if (subject.code.toLowerCase().includes(word)) {
          relevance += 15
        }
        if (subject.category.toLowerCase().includes(word)) {
          relevance += 10
        }
      })
      
      return {
        title: subject.title,
        href: subject.href,
        snippet: `${subject.code} - ${subject.category}`,
        description: `Course code: ${subject.code}`,
        relevance
      }
    })
    .filter((result) => result.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance)
}

export function advanceSearch(query: string, filters?: { year: string; branch: string }) {
  const lowerQuery = query.toLowerCase().trim()
  const queryWords = lowerQuery.split(/\s+/).filter((word) => word.length >= 2)

  if (queryWords.length === 0) return []

  // Only search subjects, exclude documentation
  const subjectResults = searchSubjects(query, filters)

  return subjectResults.slice(0, 10)
}

function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize))
  }
  return chunks
}

function formatDateHelper(
  dateStr: string,
  options: Intl.DateTimeFormatOptions
): string {
  const [day, month, year] = dateStr.split("-").map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString("en-US", options)
}

export function formatDate(dateStr: string): string {
  return formatDateHelper(dateStr, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function formatDate2(dateStr: string): string {
  return formatDateHelper(dateStr, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function stringToDate(date: string) {
  const [day, month, year] = date.split("-").map(Number)
  return new Date(year, month - 1, day)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null
  let lastArgs: Parameters<T> | null = null
  let rafId: number | null = null
  let lastCallTime: number | null = null

  const later = (time: number) => {
    const remaining = wait - (time - (lastCallTime || 0))
    if (remaining <= 0) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      if (rafId) {
        cancelAnimationFrame(rafId)
        rafId = null
      }
      func(...(lastArgs as Parameters<T>))
      lastArgs = null
      lastCallTime = null
    } else {
      rafId = requestAnimationFrame(later)
    }
  }

  return (...args: Parameters<T>) => {
    lastArgs = args
    lastCallTime = performance.now()
    const callNow = immediate && !timeout
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      rafId = requestAnimationFrame(later)
    }, wait)
    if (callNow) func(...args)
  }
}

export function highlight(snippet: string, searchTerms: string): string {
  if (!snippet || !searchTerms) return snippet

  const terms = searchTerms
    .split(/\s+/)
    .filter((term) => term.trim().length > 0)
    .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))

  if (terms.length === 0) return snippet

  const regex = new RegExp(`(${terms.join("|")})`, "gi")
  return snippet.replace(regex, "<span class='highlight'>$1</span>")
}
