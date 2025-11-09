import { notFound } from 'next/navigation'
import SubjectPage from '@/components/SubjectPage'

// Subject configurations
interface SubjectConfig {
  name: string
  description: string
  code?: string
}

const subjectConfigs: Record<string, SubjectConfig> = {
  'chemistry': {
    name: 'Chemistry',
    description: 'Fundamental concepts of chemistry including atomic structure, chemical bonding, thermodynamics, and organic chemistry basics. Essential foundation for engineering students covering molecular theory, chemical reactions, and laboratory techniques.',
    code: 'CHEM-101'
  },
  'physics': {
    name: 'Physics',
    description: 'Classical mechanics, thermodynamics, waves, optics, and modern physics concepts. Mathematical foundations and practical applications for engineering disciplines.',
    code: 'PHYS-101'
  },
  'maths-1': {
    name: 'Mathematics I',
    description: 'Differential calculus, integral calculus, limits, continuity, and applications. Foundation mathematics for engineering problem-solving and analysis.',
    code: 'MATH-101'
  },
  'maths-2': {
    name: 'Mathematics II',
    description: 'Multivariable calculus, differential equations, linear algebra, and vector calculus. Advanced mathematical tools for engineering applications.',
    code: 'MATH-102'
  },
  'c-programming': {
    name: 'C Programming',
    description: 'Introduction to programming concepts, C language syntax, data structures, algorithms, and problem-solving techniques. Foundation for software development.',
    code: 'CS-101'
  },
  'communication-skills': {
    name: 'Communication Skills',
    description: 'Technical writing, presentation skills, professional communication, and soft skills development for engineering professionals.',
    code: 'ENG-101'
  },
  'electrical': {
    name: 'Electrical Engineering',
    description: 'Basic electrical circuits, network analysis, electrical machines, and power systems. Introduction to electrical engineering principles.',
    code: 'EE-101'
  },
  'mechanical': {
    name: 'Mechanical Engineering',
    description: 'Engineering mechanics, thermodynamics, fluid mechanics, and machine design fundamentals. Core mechanical engineering concepts.',
    code: 'ME-101'
  },
  'civil': {
    name: 'Civil Engineering',
    description: 'Structural analysis, construction materials, surveying, and environmental engineering basics. Foundation of civil engineering principles.',
    code: 'CE-101'
  },
  'electronics': {
    name: 'Electronics',
    description: 'Electronic devices, circuits, digital systems, and microprocessors. Introduction to modern electronics and communication systems.',
    code: 'EC-101'
  },
  'graphics': {
    name: 'Engineering Graphics',
    description: 'Technical drawing, CAD fundamentals, orthographic projections, and engineering visualization techniques.',
    code: 'EG-101'
  },
  'workshop': {
    name: 'Workshop Technology',
    description: 'Manufacturing processes, machine tools, welding, casting, and hands-on engineering practices. Practical engineering skills development.',
    code: 'ME-102'
  }
}

// Program configurations
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

export default async function DynamicSubjectPage({ params }: PageProps) {
  const { program, year, subject } = await params
  
  // Validate program
  if (!programConfigs[program]) {
    notFound()
  }
  
  // Get subject config or create default
  const subjectConfig = subjectConfigs[subject] || {
    name: subject.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' '),
    description: `Study materials and resources for ${subject.replace('-', ' ')} course.`,
  }
  
  const subjectData = {
    name: subjectConfig.name,
    description: subjectConfig.description,
    program: program,
    year: year,
    category: 'notes', // Default to notes, can be made dynamic
    code: subjectConfig.code
  }

  return <SubjectPage subject={subjectData} />
}

// Generate static params for known combinations
export function generateStaticParams() {
  const programs = ['btech', 'bsc', 'bba', 'bcom']
  const years = ['1st-year', '2nd-year', '3rd-year', '4th-year']
  const subjects = Object.keys(subjectConfigs)
  
  const params = []
  
  for (const program of programs) {
    for (const year of years) {
      // Skip 4th year for programs that don't have it
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
    title: `${subjectConfig.name} - ${programName} ${yearName} Notes`,
    description: subjectConfig.description || `Study materials for ${subjectConfig.name}`,
    keywords: [
      subjectConfig.name,
      programName,
      yearName,
      'notes',
      'study materials',
      'engineering',
      'education'
    ].join(', ')
  }
}