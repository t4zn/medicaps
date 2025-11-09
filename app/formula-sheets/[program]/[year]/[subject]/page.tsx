import { notFound } from 'next/navigation'
import SubjectPage from '@/components/SubjectPage'

interface SubjectConfig {
  name: string
  description: string
  code?: string
}

const subjectConfigs: Record<string, SubjectConfig> = {
  'chemistry': {
    name: 'Chemistry',
    description: 'Essential formulas and equations for Chemistry including organic, inorganic, and physical chemistry.',
    code: 'CHEM-101'
  },
  'physics': {
    name: 'Physics',
    description: 'Important formulas for Physics covering mechanics, thermodynamics, optics, and modern physics.',
    code: 'PHYS-101'
  },
  'maths-1': {
    name: 'Mathematics I',
    description: 'Key formulas for calculus, differentiation, integration, and mathematical analysis.',
    code: 'MATH-101'
  },
  'maths-2': {
    name: 'Mathematics II',
    description: 'Advanced mathematical formulas for differential equations, linear algebra, and vector calculus.',
    code: 'MATH-102'
  },
  'electrical': {
    name: 'Electrical Engineering',
    description: 'Essential formulas for electrical circuits, power systems, and electrical machines.',
    code: 'EE-101'
  },
  'mechanical': {
    name: 'Mechanical Engineering',
    description: 'Key formulas for thermodynamics, fluid mechanics, and mechanical design.',
    code: 'ME-101'
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

export default async function DynamicFormulaSheetPage({ params }: PageProps) {
  const { program, year, subject } = await params
  
  if (!programConfigs[program]) {
    notFound()
  }
  
  const subjectConfig = subjectConfigs[subject] || {
    name: subject.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' '),
    description: `Quick reference formulas and equations for ${subject.replace('-', ' ')}.`,
  }
  
  const subjectData = {
    name: subjectConfig.name,
    description: subjectConfig.description,
    program: program,
    year: year,
    category: 'formula-sheet',
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
    title: `${subjectConfig.name} Formula Sheet - ${programName} ${yearName}`,
    description: subjectConfig.description || `Formula sheet for ${subjectConfig.name}`,
    keywords: [
      subjectConfig.name,
      'formula sheet',
      'formulas',
      'equations',
      programName,
      yearName,
      'quick reference'
    ].join(', ')
  }
}