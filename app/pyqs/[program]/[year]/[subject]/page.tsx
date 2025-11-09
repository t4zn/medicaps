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
    name: 'Engineering Chemistry',
    description: 'Previous year question papers for Chemistry covering all important topics and exam patterns.',
    code: 'EN3BS14'
  },
  'physics': {
    name: 'Engineering Physics',
    description: 'Previous year question papers for Physics with solutions and marking schemes.',
    code: 'EN3BS16'
  },
  'maths-1': {
    name: 'Engineering Mathematics-I',
    description: 'Previous year question papers for Mathematics I with detailed solutions and exam patterns.',
    code: 'EN3BS11'
  },
  'maths-2': {
    name: 'Engineering Mathematics-II',
    description: 'Previous year question papers for Mathematics II covering advanced topics.',
    code: 'EN3BS12'
  },
  'c-programming': {
    name: 'Basic Programming with C',
    description: 'Previous year question papers for C Programming with coding problems and solutions.',
    code: 'EN3ES27'
  },
  'communication-skills': {
    name: 'Communication Skills',
    description: 'Previous year question papers for Communication Skills covering technical writing and presentation.',
    code: 'EN3HS10'
  },
  'electrical': {
    name: 'Basic Electrical Engineering',
    description: 'Previous year question papers for Electrical Engineering with circuit analysis and solutions.',
    code: 'EN3ES17'
  },
  'mechanical': {
    name: 'Basic Civil Engineering & Mechanics',
    description: 'Previous year question papers for Mechanical Engineering covering core concepts.',
    code: 'EN3ES18'
  },
  'civil': {
    name: 'Basic Civil Engineering & Mechanics',
    description: 'Previous year question papers for Civil Engineering with structural analysis problems.',
    code: 'EN3ES30'
  },
  'electronics': {
    name: 'Basic Electronics Engineering',
    description: 'Previous year question papers for Electronics Engineering with circuit design problems.',
    code: 'EN3ES16'
  },
  'graphics': {
    name: 'Engineering Graphics',
    description: 'Previous year question papers for Engineering Graphics with drawing and CAD problems.',
    code: 'EN3ES26'
  },
  'workshop': {
    name: 'Workshop Practice',
    description: 'Previous year question papers for Workshop Practice covering manufacturing processes.',
    code: 'EN3ES29'
  },
  'discrete-mathematics': {
    name: 'Discrete Mathematics',
    description: 'Previous year question papers for Discrete Mathematics with logic and set theory problems.',
    code: 'CS3BS04'
  },
  'data-communication': {
    name: 'Data Communication',
    description: 'Previous year question papers for Data Communication covering network protocols.',
    code: 'CS3CO28'
  },
  'object-oriented-programming': {
    name: 'Object Oriented Programming',
    description: 'Previous year question papers for OOP with programming problems and solutions.',
    code: 'CS3CO30'
  },
  'data-structures': {
    name: 'Data Structures',
    description: 'Previous year question papers for Data Structures with algorithm implementation problems.',
    code: 'CS3CO31'
  },
  'java-programming': {
    name: 'Java Programming',
    description: 'Previous year question papers for Java Programming with coding exercises.',
    code: 'CS3CO32'
  },
  'digital-electronics': {
    name: 'Digital Electronics',
    description: 'Previous year question papers for Digital Electronics with circuit design problems.',
    code: 'CS3CO33'
  },
  'computer-system-architecture': {
    name: 'Computer System Architecture',
    description: 'Previous year question papers for Computer Architecture covering system design.',
    code: 'CS3CO34'
  },
  'soft-skills-1': {
    name: 'Soft Skills-I',
    description: 'Previous year question papers for Soft Skills covering communication and teamwork.',
    code: 'EN3NG03'
  },
  'microprocessor-and-interfacing': {
    name: 'Microprocessor and Interfacing',
    description: 'Previous year question papers for Microprocessor with assembly programming problems.',
    code: 'CS3CO35'
  },
  'advanced-java-programming': {
    name: 'Advanced Java Programming',
    description: 'Previous year question papers for Advanced Java with framework problems.',
    code: 'CS3CO37'
  },
  'database-management-systems': {
    name: 'Database Management Systems',
    description: 'Previous year question papers for DBMS with SQL and database design problems.',
    code: 'CS3CO39'
  },
  'theory-of-computation': {
    name: 'Theory of Computation',
    description: 'Previous year question papers for Theory of Computation with automata problems.',
    code: 'CS3CO46'
  },
  'operating-systems': {
    name: 'Operating Systems',
    description: 'Previous year question papers for Operating Systems covering process management.',
    code: 'CS3CO47'
  },
  'soft-skills-2': {
    name: 'Soft Skills-II',
    description: 'Previous year question papers for Advanced Soft Skills and professional ethics.',
    code: 'EN3NG10'
  },
  'software-engineering': {
    name: 'Software Engineering',
    description: 'Previous year question papers for Software Engineering covering SDLC and project management.',
    code: 'CS3CO40'
  },
  'computer-networks': {
    name: 'Computer Networks',
    description: 'Previous year question papers for Computer Networks with protocol and routing problems.',
    code: 'CS3CO43'
  },
  'economics': {
    name: 'Economics',
    description: 'Previous year question papers for Economics covering micro and macroeconomic concepts.',
    code: 'EN3HS04'
  },
  'soft-skills-3': {
    name: 'Soft Skills-III',
    description: 'Previous year question papers for Advanced Soft Skills and leadership development.',
    code: 'EN3NG09'
  },
  'compiler-design': {
    name: 'Compiler Design',
    description: 'Previous year question papers for Compiler Design with parsing and code generation problems.',
    code: 'CS3CO44'
  },
  'design-and-analysis-of-algorithms': {
    name: 'Design and Analysis of Algorithms',
    description: 'Previous year question papers for Algorithm Design with complexity analysis problems.',
    code: 'CS3CO45'
  },
  'research-methodology': {
    name: 'Research Methodology',
    description: 'Previous year question papers for Research Methodology covering research methods and analysis.',
    code: 'CS3ES15'
  },
  'soft-skills-4': {
    name: 'Soft Skills-IV',
    description: 'Previous year question papers for Professional Excellence and career development.',
    code: 'EN3NG08'
  },
  'industrial-training': {
    name: 'Industrial Training',
    description: 'Previous year question papers for Industrial Training covering internship evaluation and reports.',
    code: 'CS3PC03'
  }
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