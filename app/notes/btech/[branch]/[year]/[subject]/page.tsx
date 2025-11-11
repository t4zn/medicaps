import { notFound } from 'next/navigation'
import SubjectPage from '@/components/SubjectPage'
import { validateSubjectExists, getSubjectRequestUrl } from '@/lib/subject-validator'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

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
  },
  'industrial-training': {
    name: 'Industrial Training',
    description: 'Practical industry experience, internship reports, and professional skill development in real-world environments.',
    code: 'CS3PC03'
  },
  'principles-of-artificial-intelligence': {
    name: 'Principles of Artificial Intelligence',
    description: 'AI fundamentals, search algorithms, knowledge representation, and intelligent agent design.',
    code: 'CS3CO35'
  },
  'machine-learning-fundamentals': {
    name: 'Machine Learning Fundamentals',
    description: 'ML algorithms, supervised and unsupervised learning, neural networks, and data preprocessing.',
    code: 'CS3CO40'
  },
  'advanced-java-or-python-programming': {
    name: 'Advanced Java or Python Programming',
    description: 'Advanced programming concepts in Java or Python for AI and ML applications.',
    code: 'CS3CO37'
  },
  // Civil Engineering 2nd Year
  'building-maintenance-and-repairs': {
    name: 'Building Maintenance & Repairs',
    description: 'Building maintenance techniques, repair methods, and structural rehabilitation practices.',
    code: 'CE3EL04'
  },
  'building-planning-and-drawing': {
    name: 'Building Planning & Drawing',
    description: 'Architectural planning, building codes, and technical drawing for construction projects.',
    code: 'CE3CO21'
  },
  'concrete-technology': {
    name: 'Concrete Technology',
    description: 'Concrete mix design, properties, testing, and quality control in construction.',
    code: 'CE3ES05'
  },
  'construction-material-and-techniques': {
    name: 'Construction Materials & Techniques',
    description: 'Properties of construction materials, testing methods, and construction techniques.',
    code: 'CE3CO05'
  },
  'engineering-mathematics-3': {
    name: 'Engineering Mathematics-III',
    description: 'Advanced mathematical concepts including differential equations and numerical methods.',
    code: 'EN3BS15'
  },
  'engineering-surveying': {
    name: 'Engineering Surveying',
    description: 'Land surveying techniques, instruments, and mapping for civil engineering projects.',
    code: 'CE3CO01'
  },
  'environment-and-energy-studies': {
    name: 'Environment & Energy Studies',
    description: 'Environmental impact assessment and sustainable energy systems in engineering.',
    code: 'CE3EE03'
  },
  'environmental-engineering-1': {
    name: 'Environmental Engineering-I',
    description: 'Water supply, wastewater treatment, and environmental pollution control systems.',
    code: 'CE3CO20'
  },
  'fluid-mechanics': {
    name: 'Fluid Mechanics',
    description: 'Fluid properties, flow analysis, and applications in civil engineering systems.',
    code: 'CE3CO19'
  },
  'geotechnical-engineering-1': {
    name: 'Geotechnical Engineering-I',
    description: 'Soil mechanics, foundation engineering, and earth structure analysis.',
    code: 'CE3CO27'
  },
  'hydraulic-engineering': {
    name: 'Hydraulic Engineering',
    description: 'Open channel flow, hydraulic structures, and water resource management.',
    code: 'CE3CO24'
  },
  'fundamentals-of-management-economics-and-accountancy': {
    name: 'Management & Economics',
    description: 'Business management principles, economics, and accounting for engineers.',
    code: 'EN3HS04'
  },
  'python-for-civil-engineering': {
    name: 'Python for Civil Engineering',
    description: 'Programming with Python for civil engineering applications and data analysis.',
    code: 'CE3ES12'
  },
  'quantity-surveying-and-estimation': {
    name: 'Quantity Surveying & Estimation',
    description: 'Cost estimation, quantity measurement, and project economics in construction.',
    code: 'CE3CO32'
  },
  'rcc-design': {
    name: 'RCC Design',
    description: 'Reinforced concrete design principles, analysis, and structural applications.',
    code: 'CE3CO28'
  },
  'strength-of-materials': {
    name: 'Strength of Materials',
    description: 'Stress, strain, and deformation analysis of structural materials and members.',
    code: 'CE3ES11'
  },
  'structural-analysis-1': {
    name: 'Structural Analysis-I',
    description: 'Analysis of statically determinate structures and basic structural principles.',
    code: 'CE3CO23'
  },
  'transportation-bridges-and-tunnels': {
    name: 'Transportation Bridges & Tunnels',
    description: 'Design and construction of transportation infrastructure including bridges and tunnels.',
    code: 'CE3EL07'
  },
  // Civil Engineering 3rd Year
  'advance-geotechnical-engineering': {
    name: 'Advanced Geotechnical Engineering',
    description: 'Advanced soil mechanics, slope stability, and geotechnical design principles.',
    code: 'CE3ES01'
  },
  'advance-rcc-design': {
    name: 'Advanced RCC Design',
    description: 'Advanced reinforced concrete design for complex structures and special applications.',
    code: 'CE3CO35'
  },
  'design-of-steel-structures': {
    name: 'Design of Steel Structures',
    description: 'Steel structure design, connections, and analysis of steel building systems.',
    code: 'CE3CO31'
  },
  'environmental-engineering': {
    name: 'Environmental Engineering',
    description: 'Environmental systems, pollution control, and sustainable engineering practices.',
    code: 'CE3EL01'
  },
  'environmental-engineering-2': {
    name: 'Environmental Engineering-II',
    description: 'Advanced environmental engineering topics and treatment technologies.',
    code: 'CE3CO26'
  },
  'experimental-stress-analysis': {
    name: 'Experimental Stress Analysis',
    description: 'Experimental methods for stress measurement and structural testing techniques.',
    code: 'CE3ES07'
  },
  'geotechnical-engineering-2': {
    name: 'Geotechnical Engineering-II',
    description: 'Advanced geotechnical analysis, deep foundations, and earth retaining structures.',
    code: 'CE3CO33'
  },
  'prestressed-concrete': {
    name: 'Prestressed Concrete',
    description: 'Prestressed concrete design principles, analysis, and construction techniques.',
    code: 'CE3ES08'
  },
  'structural-analysis-2': {
    name: 'Structural Analysis-II',
    description: 'Analysis of indeterminate structures using advanced methods and computer applications.',
    code: 'CE3CO25'
  },
  'transportation-engineering-1': {
    name: 'Transportation Engineering-I',
    description: 'Highway engineering, traffic analysis, and transportation planning principles.',
    code: 'CE3CO30'
  },
  'water-resources-engineering': {
    name: 'Water Resources Engineering',
    description: 'Hydrology, water resource planning, and management of water systems.',
    code: 'CE3CO29'
  },
  // Civil Engineering 4th Year
  'advanced-design-of-rcc-structures': {
    name: 'Advanced Design of RCC Structures',
    description: 'Complex reinforced concrete structures, high-rise buildings, and special structures.',
    code: 'CE3ES02'
  },
  'advanced-design-of-steel-structures': {
    name: 'Advanced Design of Steel Structures',
    description: 'Advanced steel design, composite structures, and industrial building systems.',
    code: 'CE3ES03'
  },
  'bridge-engineering': {
    name: 'Bridge Engineering',
    description: 'Bridge design, analysis, construction methods, and maintenance of bridge structures.',
    code: 'CE3ES04'
  },
  'earthquake-resistant-design': {
    name: 'Earthquake Resistant Design',
    description: 'Seismic analysis, earthquake-resistant design principles, and structural dynamics.',
    code: 'CE3ES06'
  },
  // Electrical Engineering 2nd Year
  'analog-and-digital-circuits': {
    name: 'Analog & Digital Circuits',
    description: 'Analog and digital circuit analysis, design, and applications in electrical systems.',
    code: 'EE3CO57'
  },
  'electrical-circuit-analysis': {
    name: 'Electrical Circuit Analysis',
    description: 'Circuit analysis techniques, network theorems, and electrical circuit fundamentals.',
    code: 'EE3CO49'
  },
  'data-structures-through-c': {
    name: 'Data Structures Through C',
    description: 'Data structures implementation using C programming language and algorithm analysis.',
    code: 'EE3CO59'
  },
  'microprocessors-and-microcontrollers': {
    name: 'Microprocessors & Microcontrollers',
    description: 'Microprocessor architecture, programming, and interfacing with microcontrollers.',
    code: 'EE3CO53'
  },
  'power-system-engineering': {
    name: 'Power System Engineering',
    description: 'Power generation, transmission, distribution, and electrical power system analysis.',
    code: 'EE3CO63'
  },
  'computational-statistics': {
    name: 'Computational Statistics',
    description: 'Statistical methods, probability theory, and computational techniques for data analysis.',
    code: 'EE3CO62'
  },
  // Electrical Engineering 3rd Year
  'control-systems': {
    name: 'Control Systems',
    description: 'Control theory, feedback systems, stability analysis, and control system design.',
    code: 'EE3CO34'
  },
  'electrical-machines': {
    name: 'Electrical Machines',
    description: 'AC and DC machines, transformers, motor control, and electrical machine design.',
    code: 'EE3CO66'
  },
  'electromagnetic-theory': {
    name: 'Electromagnetic Theory',
    description: 'Electromagnetic fields, wave propagation, and electromagnetic applications.',
    code: 'EE3CO29'
  },
  'information-theory-and-data-communication': {
    name: 'Information Theory & Data Communication',
    description: 'Information theory principles, coding techniques, and data communication systems.',
    code: 'EE3CO65'
  },
  'power-electronics': {
    name: 'Power Electronics',
    description: 'Power semiconductor devices, converters, inverters, and power electronic systems.',
    code: 'EE3CO42'
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
  'robotics-automation': 'Robotics & Automation'
}

type PageProps = {
  params: Promise<{
    branch: string
    year: string
    subject: string
  }>
}

function SubjectNotFoundPage({ branch, year, subject }: { branch: string, year: string, subject: string }) {
  const requestUrl = getSubjectRequestUrl('btech', branch, year, subject)

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h1 className="text-3xl font-semibold mb-4">Subject Not Found</h1>
        <Link href={requestUrl}>
          <Button>Add Subject</Button>
        </Link>
      </div>
    </div>
  )
}

export default async function BTechSubjectPage({ params }: PageProps) {
  const { branch, year, subject } = await params
  
  // Validate branch
  if (!branchConfigs[branch]) {
    notFound()
  }
  
  // Check if subject exists in documents.ts
  const subjectExists = validateSubjectExists('btech', branch, year, subject)
  
  if (!subjectExists) {
    return <SubjectNotFoundPage branch={branch} year={year} subject={subject} />
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
    program: 'btech',
    branch: branch,
    year: year,
    category: 'notes',
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
    title: `${subjectConfig.name} - B.Tech ${branchName} ${yearName} Notes`,
    description: subjectConfig.description || `Study materials for ${subjectConfig.name}`,
    keywords: [
      subjectConfig.name,
      'B.Tech',
      branchName,
      yearName,
      'notes',
      'study materials',
      'engineering',
      'education'
    ].join(', ')
  }
}