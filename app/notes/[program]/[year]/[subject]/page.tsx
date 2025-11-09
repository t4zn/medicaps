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
    name: 'Engineering Chemistry',
    description: 'Fundamental concepts of chemistry including atomic structure, chemical bonding, thermodynamics, and organic chemistry basics. Essential foundation for engineering students covering molecular theory, chemical reactions, and laboratory techniques.',
    code: 'EN3BS14'
  },
  'physics': {
    name: 'Engineering Physics',
    description: 'Classical mechanics, thermodynamics, waves, optics, and modern physics concepts. Mathematical foundations and practical applications for engineering disciplines.',
    code: 'EN3BS16'
  },
  'maths-1': {
    name: 'Engineering Mathematics-I',
    description: 'Differential calculus, integral calculus, limits, continuity, and applications. Foundation mathematics for engineering problem-solving and analysis.',
    code: 'EN3BS11'
  },
  'maths-2': {
    name: 'Engineering Mathematics-II',
    description: 'Multivariable calculus, differential equations, linear algebra, and vector calculus. Advanced mathematical tools for engineering applications.',
    code: 'EN3BS12'
  },
  'c-programming': {
    name: 'Basic Programming with C',
    description: 'Introduction to programming concepts, C language syntax, data structures, algorithms, and problem-solving techniques. Foundation for software development.',
    code: 'EN3ES27'
  },
  'communication-skills': {
    name: 'Communication Skills',
    description: 'Technical writing, presentation skills, professional communication, and soft skills development for engineering professionals.',
    code: 'EN3HS10'
  },
  'electrical': {
    name: 'Basic Electrical Engineering',
    description: 'Basic electrical circuits, network analysis, electrical machines, and power systems. Introduction to electrical engineering principles.',
    code: 'EN3ES17'
  },
  'mechanical': {
    name: 'Basic Civil Engineering & Mechanics',
    description: 'Engineering mechanics, thermodynamics, fluid mechanics, and machine design fundamentals. Core mechanical engineering concepts.',
    code: 'EN3ES18'
  },
  'civil': {
    name: 'Basic Civil Engineering & Mechanics',
    description: 'Structural analysis, construction materials, surveying, and environmental engineering basics. Foundation of civil engineering principles.',
    code: 'EN3ES30'
  },
  'electronics': {
    name: 'Basic Electronics Engineering',
    description: 'Electronic devices, circuits, digital systems, and microprocessors. Introduction to modern electronics and communication systems.',
    code: 'EN3ES16'
  },
  'graphics': {
    name: 'Engineering Graphics',
    description: 'Technical drawing, CAD fundamentals, orthographic projections, and engineering visualization techniques.',
    code: 'EN3ES26'
  },
  'workshop': {
    name: 'Workshop Practice',
    description: 'Manufacturing processes, machine tools, welding, casting, and hands-on engineering practices. Practical engineering skills development.',
    code: 'EN3ES29'
  },
  'discrete-mathematics': {
    name: 'Discrete Mathematics',
    description: 'Mathematical structures, logic, set theory, graph theory, and combinatorics. Foundation for computer science and algorithm analysis.',
    code: 'CS3BS04'
  },
  'data-communication': {
    name: 'Data Communication',
    description: 'Network protocols, data transmission, communication systems, and network architecture fundamentals.',
    code: 'CS3CO28'
  },
  'object-oriented-programming': {
    name: 'Object Oriented Programming',
    description: 'OOP concepts, classes, objects, inheritance, polymorphism, and design patterns.',
    code: 'CS3CO30'
  },
  'data-structures': {
    name: 'Data Structures',
    description: 'Arrays, linked lists, stacks, queues, trees, graphs, and algorithm complexity analysis.',
    code: 'CS3CO31'
  },
  'java-programming': {
    name: 'Java Programming',
    description: 'Java language fundamentals, object-oriented programming in Java, and application development.',
    code: 'CS3CO32'
  },
  'digital-electronics': {
    name: 'Digital Electronics',
    description: 'Boolean algebra, logic gates, combinational and sequential circuits, and digital system design.',
    code: 'CS3CO33'
  },
  'computer-system-architecture': {
    name: 'Computer System Architecture',
    description: 'CPU design, memory systems, instruction sets, and computer organization principles.',
    code: 'CS3CO34'
  },
  'soft-skills-1': {
    name: 'Soft Skills-I',
    description: 'Communication skills, teamwork, leadership, and professional development fundamentals.',
    code: 'EN3NG03'
  },
  'microprocessor-and-interfacing': {
    name: 'Microprocessor and Interfacing',
    description: 'Microprocessor architecture, assembly language programming, and hardware interfacing.',
    code: 'CS3CO35'
  },
  'advanced-java-programming': {
    name: 'Advanced Java Programming',
    description: 'Advanced Java concepts, frameworks, web development, and enterprise applications.',
    code: 'CS3CO37'
  },
  'database-management-systems': {
    name: 'Database Management Systems',
    description: 'Database design, SQL, normalization, transactions, and database administration.',
    code: 'CS3CO39'
  },
  'theory-of-computation': {
    name: 'Theory of Computation',
    description: 'Automata theory, formal languages, computability, and complexity theory.',
    code: 'CS3CO46'
  },
  'operating-systems': {
    name: 'Operating Systems',
    description: 'Process management, memory management, file systems, and system programming.',
    code: 'CS3CO47'
  },
  'soft-skills-2': {
    name: 'Soft Skills-II',
    description: 'Advanced communication, presentation skills, and professional ethics.',
    code: 'EN3NG10'
  },
  'software-engineering': {
    name: 'Software Engineering',
    description: 'Software development lifecycle, project management, testing, and quality assurance methodologies.',
    code: 'CS3CO40'
  },
  'computer-networks': {
    name: 'Computer Networks',
    description: 'Network protocols, TCP/IP, routing, switching, and network security fundamentals.',
    code: 'CS3CO43'
  },
  'economics': {
    name: 'Economics',
    description: 'Microeconomics, macroeconomics, market structures, and economic principles for engineers.',
    code: 'EN3HS04'
  },
  'soft-skills-3': {
    name: 'Soft Skills-III',
    description: 'Advanced professional skills, leadership development, and workplace communication.',
    code: 'EN3NG09'
  },
  'compiler-design': {
    name: 'Compiler Design',
    description: 'Lexical analysis, parsing, code generation, and optimization techniques in compiler construction.',
    code: 'CS3CO44'
  },
  'design-and-analysis-of-algorithms': {
    name: 'Design and Analysis of Algorithms',
    description: 'Algorithm design techniques, complexity analysis, sorting, searching, and graph algorithms.',
    code: 'CS3CO45'
  },
  'research-methodology': {
    name: 'Research Methodology',
    description: 'Research methods, data collection, analysis techniques, and academic writing principles.',
    code: 'CS3ES15'
  },
  'soft-skills-4': {
    name: 'Soft Skills-IV',
    description: 'Professional excellence, career development, and advanced interpersonal skills.',
    code: 'EN3NG08'
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