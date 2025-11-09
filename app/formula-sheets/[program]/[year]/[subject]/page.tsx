import { notFound } from 'next/navigation'
import SubjectPage from '@/components/SubjectPage'

interface SubjectConfig {
  name: string
  description: string
  code?: string
}

const subjectConfigs: Record<string, SubjectConfig> = {
  'chemistry': {
    name: 'Engineering Chemistry',
    description: 'Essential formulas and equations for Chemistry including organic, inorganic, and physical chemistry.',
    code: 'EN3BS14'
  },
  'physics': {
    name: 'Engineering Physics',
    description: 'Important formulas for Physics covering mechanics, thermodynamics, optics, and modern physics.',
    code: 'EN3BS16'
  },
  'maths-1': {
    name: 'Engineering Mathematics-I',
    description: 'Key formulas for calculus, differentiation, integration, and mathematical analysis.',
    code: 'EN3BS11'
  },
  'maths-2': {
    name: 'Engineering Mathematics-II',
    description: 'Advanced mathematical formulas for differential equations, linear algebra, and vector calculus.',
    code: 'EN3BS12'
  },
  'c-programming': {
    name: 'Basic Programming with C',
    description: 'Essential syntax, functions, and programming concepts for C language.',
    code: 'EN3ES27'
  },
  'communication-skills': {
    name: 'Communication Skills',
    description: 'Key guidelines and formats for technical writing and professional communication.',
    code: 'EN3HS10'
  },
  'electrical': {
    name: 'Basic Electrical Engineering',
    description: 'Essential formulas for electrical circuits, power systems, and electrical machines.',
    code: 'EN3ES17'
  },
  'mechanical': {
    name: 'Basic Civil Engineering & Mechanics',
    description: 'Key formulas for thermodynamics, fluid mechanics, and mechanical design.',
    code: 'EN3ES18'
  },
  'civil': {
    name: 'Basic Civil Engineering & Mechanics',
    description: 'Essential formulas for structural analysis, construction materials, and civil engineering.',
    code: 'EN3ES30'
  },
  'electronics': {
    name: 'Basic Electronics Engineering',
    description: 'Key formulas for electronic circuits, digital systems, and communication systems.',
    code: 'EN3ES16'
  },
  'graphics': {
    name: 'Engineering Graphics',
    description: 'Essential guidelines for technical drawing, projections, and CAD fundamentals.',
    code: 'EN3ES26'
  },
  'workshop': {
    name: 'Workshop Practice',
    description: 'Key procedures and guidelines for manufacturing processes and workshop practices.',
    code: 'EN3ES29'
  },
  'discrete-mathematics': {
    name: 'Discrete Mathematics',
    description: 'Essential formulas for set theory, logic, graph theory, and combinatorics.',
    code: 'CS3BS04'
  },
  'data-communication': {
    name: 'Data Communication',
    description: 'Key formulas and protocols for data transmission and network communication.',
    code: 'CS3CO28'
  },
  'object-oriented-programming': {
    name: 'Object Oriented Programming',
    description: 'Essential OOP concepts, syntax patterns, and design principles reference.',
    code: 'CS3CO30'
  },
  'data-structures': {
    name: 'Data Structures',
    description: 'Algorithm complexity formulas and data structure implementation patterns.',
    code: 'CS3CO31'
  },
  'java-programming': {
    name: 'Java Programming',
    description: 'Java syntax reference, built-in methods, and programming patterns.',
    code: 'CS3CO32'
  },
  'digital-electronics': {
    name: 'Digital Electronics',
    description: 'Boolean algebra formulas, logic gate truth tables, and circuit design rules.',
    code: 'CS3CO33'
  },
  'computer-system-architecture': {
    name: 'Computer System Architecture',
    description: 'CPU performance formulas, memory calculations, and system design principles.',
    code: 'CS3CO34'
  },
  'soft-skills-1': {
    name: 'Soft Skills-I',
    description: 'Communication guidelines, teamwork principles, and professional development tips.',
    code: 'EN3NG03'
  },
  'microprocessor-and-interfacing': {
    name: 'Microprocessor and Interfacing',
    description: 'Assembly language reference, instruction sets, and interfacing protocols.',
    code: 'CS3CO35'
  },
  'advanced-java-programming': {
    name: 'Advanced Java Programming',
    description: 'Advanced Java APIs, framework syntax, and enterprise development patterns.',
    code: 'CS3CO37'
  },
  'database-management-systems': {
    name: 'Database Management Systems',
    description: 'SQL syntax reference, normalization rules, and database design principles.',
    code: 'CS3CO39'
  },
  'theory-of-computation': {
    name: 'Theory of Computation',
    description: 'Automata definitions, formal language rules, and complexity formulas.',
    code: 'CS3CO46'
  },
  'operating-systems': {
    name: 'Operating Systems',
    description: 'System call reference, scheduling algorithms, and memory management formulas.',
    code: 'CS3CO47'
  },
  'soft-skills-2': {
    name: 'Soft Skills-II',
    description: 'Advanced communication techniques, presentation guidelines, and ethics principles.',
    code: 'EN3NG10'
  },
  'software-engineering': {
    name: 'Software Engineering',
    description: 'SDLC models, project estimation formulas, and software quality metrics reference.',
    code: 'CS3CO40'
  },
  'computer-networks': {
    name: 'Computer Networks',
    description: 'Network protocol specifications, routing algorithms, and performance calculation formulas.',
    code: 'CS3CO43'
  },
  'economics': {
    name: 'Economics',
    description: 'Economic formulas, market analysis equations, and financial calculation methods.',
    code: 'EN3HS04'
  },
  'soft-skills-3': {
    name: 'Soft Skills-III',
    description: 'Leadership principles, team management guidelines, and professional development frameworks.',
    code: 'EN3NG09'
  },
  'compiler-design': {
    name: 'Compiler Design',
    description: 'Grammar rules, parsing algorithms, and code optimization techniques reference.',
    code: 'CS3CO44'
  },
  'design-and-analysis-of-algorithms': {
    name: 'Design and Analysis of Algorithms',
    description: 'Time complexity formulas, algorithm patterns, and optimization techniques reference.',
    code: 'CS3CO45'
  },
  'research-methodology': {
    name: 'Research Methodology',
    description: 'Statistical formulas, research design frameworks, and data analysis techniques.',
    code: 'CS3ES15'
  },
  'soft-skills-4': {
    name: 'Soft Skills-IV',
    description: 'Career development strategies, professional excellence guidelines, and workplace skills.',
    code: 'EN3NG08'
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