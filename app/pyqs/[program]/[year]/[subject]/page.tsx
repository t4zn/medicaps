import { notFound } from 'next/navigation'
import SubjectPage from '@/components/SubjectPage'

// Import the same configurations
interface SubjectConfig {
  name: string
  description: string
  code?: string
}

const subjectConfigs: Record<string, SubjectConfig> = {
  'chemistry': {
    name: 'Chemistry',
    description: 'Previous year question papers for Chemistry covering all important topics and exam patterns.',
    code: 'CHEM-101'
  },
  'physics': {
    name: 'Physics',
    description: 'Previous year question papers for Physics with solutions and marking schemes.',
    code: 'PHYS-101'
  },
  'maths-1': {
    name: 'Mathematics I',
    description: 'Previous year question papers for Mathematics I with detailed solutions and exam patterns.',
    code: 'MATH-101'
  },
  'maths-2': {
    name: 'Mathematics II',
    description: 'Previous year question papers for Mathematics II covering advanced topics.',
    code: 'MATH-102'
  },
  'c-programming': {
    name: 'C Programming',
    description: 'Previous year question papers for C Programming with coding problems and solutions.',
    code: 'CS-101'
  },
  // Add more subjects as needed
}

const programConfigs: Record<string, string> = {
  'btech': 'B.Tech',
  'bsc': 'B.Sc',
  'bba': 'BBA',
  'bcom': 'B.Com',
  'mtech': 'M.Tech',
  'mba': 'MBA'
}

type PageProps = {
  params: Promise<{
    program: string
    year: string
    subject: string
  }>
}

export default async function DynamicPYQPage({ params }: PageProps) {
  const { program, year, subject } = await params
  
  if (!programConfigs[program]) {
    notFound()
  }
  
  const subjectConfig = subjectConfigs[subject] || {
    name: subject.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' '),
    description: `Previous year question papers for ${subject.replace('-', ' ')} with solutions and exam patterns.`,
  }
  
  const subjectData = {
    name: subjectConfig.name,
    description: subjectConfig.description,
    program: program,
    year: year,
    category: 'pyqs',
    code: subjectConfig.code
  }

  return <SubjectPage subject={subjectData} />
}

export function generateStaticParams() {
  const programs = ['btech', 'bsc', 'bba', 'bcom']
  const years = ['1st-year', '2nd-year', '3rd-year', '4th-year']
  const subjects = Object.keys(subjectConfigs)
  
  const params = []
  
  for (const program of programs) {
    for (const year of years) {
      if (year === '4th-year' && !['btech', 'bcom'].includes(program)) {
        continue
      }
      
      for (const subject of subjects) {
        params.push({
          program,
          year,
          subject
        })
      }
    }
  }
  
  return params
}

export async function generateMetadata({ params }: PageProps) {
  const { program, year, subject } = await params
  
  const subjectConfig = subjectConfigs[subject] || {
    name: subject.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }
  
  const programName = programConfigs[program] || program.toUpperCase()
  const yearName = year.replace('-', ' ')
  
  return {
    title: `${subjectConfig.name} PYQs - ${programName} ${yearName}`,
    description: subjectConfig.description || `Previous year questions for ${subjectConfig.name}`,
    keywords: [
      subjectConfig.name,
      'PYQs',
      'previous year questions',
      programName,
      yearName,
      'exam papers',
      'question bank'
    ].join(', ')
  }
}