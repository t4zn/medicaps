import { notFound } from 'next/navigation'
import SubjectPage from '@/components/SubjectPage'
import { validateSubjectExists } from '@/lib/subject-validator'

// Subject configurations (same as the main formula sheets page)
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
    name: 'Basic Mechanical Engineering',
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
    description: 'Technical drawing standards, projection methods, and CAD reference.',
    code: 'EN3ES26'
  },
  'workshop': {
    name: 'Workshop Practice',
    description: 'Manufacturing process guidelines, tool specifications, and workshop safety standards.',
    code: 'EN3ES29'
  },
  'discrete-mathematics': {
    name: 'Discrete Mathematics',
    description: 'Logic formulas, set theory equations, and combinatorics reference.',
    code: 'CS3BS04'
  },
  'data-communication': {
    name: 'Data Communication',
    description: 'Network protocol formulas, data transmission calculations, and communication system equations.',
    code: 'CS3CO28'
  },
  'object-oriented-programming': {
    name: 'Object Oriented Programming',
    description: 'OOP syntax reference, design patterns, and programming best practices.',
    code: 'CS3CO30'
  },
  'data-structures': {
    name: 'Data Structures',
    description: 'Algorithm complexity formulas, data structure operations, and performance analysis.',
    code: 'CS3CO31'
  },
  'java-programming': {
    name: 'Java Programming',
    description: 'Java syntax reference, API documentation, and programming patterns.',
    code: 'CS3CO32'
  },
  'digital-electronics': {
    name: 'Digital Electronics',
    description: 'Boolean algebra formulas, logic gate equations, and digital circuit design rules.',
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
  },
  'industrial-training': {
    name: 'Industrial Training',
    description: 'Industry guidelines, internship evaluation criteria, and professional development frameworks.',
    code: 'CS3PC03'
  },
  'principles-of-artificial-intelligence': {
    name: 'Principles of Artificial Intelligence',
    description: 'AI algorithms reference, search techniques, and knowledge representation formulas.',
    code: 'CS3CO35'
  },
  'machine-learning-fundamentals': {
    name: 'Machine Learning Fundamentals',
    description: 'ML algorithm formulas, statistical methods, and neural network equations.',
    code: 'CS3CO40'
  },
  'advanced-java-or-python-programming': {
    name: 'Advanced Java or Python Programming',
    description: 'Advanced programming syntax, libraries reference, and AI/ML framework usage.',
    code: 'CS3CO37'
  },
  'mix': {
    name: 'Mix',
    description: 'Mixed formula sheets and reference materials for various subjects.',
  }
}

// Branch configurations
const branchConfigs: Record<string, string> = {
  'cse': 'Computer Science and Engineering',
  'cse-ai': 'CSE - Artificial Intelligence',
  'cse-ds': 'CSE - Data Science',
  'cse-networks': 'CSE - Networks',
  'cse-aiml': 'CSE - AI & ML',
  'cyber-security': 'Cyber Security',
  'cse-iot': 'CSE - IoT',
  'csbs': 'Computer Science and Business Systems',
  'ece': 'Electronics and Communication Engineering',
  'civil': 'Civil Engineering',
  'electrical': 'Electrical Engineering',
  'automobile-ev': 'Automobile Engineering (EV)',
  'it': 'Information Technology',
  'mechanical': 'Mechanical Engineering',
  'robotics-automation': 'Robotics & Automation',
  'electives': 'Electives'
}

type PageProps = {
  params: Promise<{
    branch: string
    year: string
    subject: string
  }>
}

export default async function BTechFormulaSheetPage({ params }: PageProps) {
  const { branch, year, subject } = await params
  
  // Validate branch
  if (!branchConfigs[branch]) {
    notFound()
  }
  
  // Check if subject exists in documents.ts
  const subjectExists = validateSubjectExists('btech', branch, year, subject)
  
  if (!subjectExists) {
    notFound()
  }
  
  // Get subject config or create default
  const subjectConfig = subjectConfigs[subject] || {
    name: subject.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' '),
    description: `Quick reference formulas and equations for ${subject.replace('-', ' ')}.`,
  }
  
  const subjectData = {
    name: subjectConfig.name,
    description: subjectConfig.description,
    program: 'btech',
    branch: branch,
    year: year,
    category: 'formula-sheet',
    code: subjectConfig.code,
    slug: subject
  }

  return <SubjectPage subject={subjectData} />
}

export async function generateMetadata({ params }: PageProps) {
  const { branch, year, subject } = await params
  
  const subjectConfig = subjectConfigs[subject] || {
    name: subject.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }
  
  const branchName = branchConfigs[branch] || branch.toUpperCase()
  const yearName = year.replace('-', ' ')
  
  return {
    title: `${subjectConfig.name} Formula Sheet - B.Tech ${branchName} ${yearName}`,
    description: subjectConfig.description || `Formula sheet for ${subjectConfig.name}`,
    keywords: [
      subjectConfig.name,
      'formula sheet',
      'formulas',
      'equations',
      'B.Tech',
      branchName,
      yearName,
      'quick reference'
    ].join(', ')
  }
}