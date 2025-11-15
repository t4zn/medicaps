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
    name: 'Basic Mechanical Engineering',
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
  },
  // CSBS 2nd Year
  'formal-language-and-automata-theory': {
    name: 'Formal Language and Automata Theory',
    description: 'Formal languages, regular expressions, finite automata, context-free grammars, and computational theory.',
    code: 'CB3CO22'
  },
  'computer-organization-and-architecture': {
    name: 'Computer Organization & Architecture',
    description: 'Computer system organization, processor design, memory hierarchy, and instruction set architecture.',
    code: 'EN3ES14'
  },
  'essence-of-indian-traditional-knowledge': {
    name: 'Essence of Indian Traditional Knowledge',
    description: 'Traditional Indian knowledge systems, cultural heritage, and their relevance in modern context.',
    code: 'CB3NG05'
  },
  'open-learning-course': {
    name: 'Open Learning Course',
    description: 'Flexible learning module covering diverse topics based on student interests and career goals.',
    code: 'CB3NG02'
  },
  'indian-constitution': {
    name: 'Indian Constitution',
    description: 'Constitutional principles, fundamental rights, duties, and governance structure of India.',
    code: 'CB3NG03'
  },
  'introduction-to-innovation-ip-management-and-entrepreneurship': {
    name: 'Introduction to Innovation, IP Management & Entrepreneurship',
    description: 'Innovation processes, intellectual property rights, patent management, and entrepreneurial skills.',
    code: 'CB3NG04'
  },
  'design-thinking': {
    name: 'Design Thinking',
    description: 'Human-centered design approach, creative problem-solving, and innovation methodologies.',
    code: 'EN3ES13'
  },
  'operations-research': {
    name: 'Operations Research',
    description: 'Mathematical optimization, linear programming, decision analysis, and operational efficiency.',
    code: 'EN3ES15'
  },
  'marketing-research-and-marketing-management': {
    name: 'Marketing Research & Marketing Management',
    description: 'Market analysis, consumer behavior, marketing strategies, and business development.',
    code: 'OE00092'
  },
  // CSBS 3rd Year
  'software-design-with-uml': {
    name: 'Software Design with UML',
    description: 'Unified Modeling Language, software design patterns, system modeling, and architectural design.',
    code: 'CB3CO25'
  },
  'fundamentals-of-management': {
    name: 'Fundamentals of Management',
    description: 'Management principles, organizational behavior, leadership, and business administration.',
    code: 'CB3CO26'
  },
  'business-strategy': {
    name: 'Business Strategy',
    description: 'Strategic planning, competitive analysis, business models, and strategic management.',
    code: 'OE00090'
  },
  'business-communication-and-value-science': {
    name: 'Business Communication & Value Science – III',
    description: 'Professional communication, business ethics, value systems, and corporate communication.',
    code: 'EN3HS07'
  },
  'machine-learning': {
    name: 'Machine Learning',
    description: 'Machine learning algorithms, supervised and unsupervised learning, neural networks, and AI applications.',
    code: 'CB3EL01'
  },
  'cryptology': {
    name: 'Cryptology',
    description: 'Cryptographic algorithms, network security, encryption techniques, and information security.',
    code: 'CB3EL13'
  },
  'mini-project': {
    name: 'Mini Project',
    description: 'Hands-on project development, research methodology, and practical application of learned concepts.',
    code: 'CB3PC04'
  },
  'usability-design-of-software-applications': {
    name: 'Usability Design of Software Applications',
    description: 'User interface design, user experience principles, human-computer interaction, and software usability.',
    code: 'CB3CO29'
  },
  'artificial-intelligence': {
    name: 'Artificial Intelligence',
    description: 'AI fundamentals, search algorithms, knowledge representation, expert systems, and machine reasoning.',
    code: 'CB3CO14'
  },
  'financial-and-cost-accounting': {
    name: 'Financial & Cost Accounting',
    description: 'Financial accounting principles, cost analysis, budgeting, and financial management for businesses.',
    code: 'OE00086'
  },
  'it-workshop-scilab-matlab': {
    name: 'IT Workshop Scilab / MATLAB',
    description: 'Scientific computing, numerical analysis, data visualization using Scilab and MATLAB tools.',
    code: 'CB3CO27'
  },
  'data-mining-and-analytics': {
    name: 'Data Mining and Analytics',
    description: 'Data mining techniques, statistical analysis, predictive modeling, and business intelligence.',
    code: 'CB3EL08'
  },
  'advance-finance': {
    name: 'Advance Finance',
    description: 'Advanced financial concepts, investment analysis, portfolio management, and financial markets.',
    code: 'CB3EL04'
  },
  // CSBS 4th Year
  'business-communication-and-value-science-iv': {
    name: 'Business Communication & Value Science – IV',
    description: 'Advanced business communication skills, professional ethics, value systems, and corporate governance.',
    code: 'EN3HS11'
  },
  'financial-management': {
    name: 'Financial Management',
    description: 'Corporate finance, capital budgeting, financial planning, and investment decision making.',
    code: 'OE00087'
  },
  'human-resource-management': {
    name: 'Human Resource Management',
    description: 'HR policies, recruitment, performance management, organizational behavior, and employee relations.',
    code: 'OE00091'
  },
  'industrial-psychology': {
    name: 'Industrial Psychology',
    description: 'Workplace psychology, employee motivation, organizational behavior, and human factors in industry.',
    code: 'CB3EL02'
  },
  'advanced-social-text-and-media': {
    name: 'Advanced Social, Text and Media',
    description: 'Social media analytics, digital marketing, content strategy, and multimedia communication.',
    code: 'CB3EL06'
  },
  'services-science-and-service-operational-management': {
    name: 'Services Science & Service Operational Management',
    description: 'Service design, operations management, quality control, and customer relationship management.',
    code: 'CB3CO19'
  },
  // Automobile (EV) 2nd Year
  'mathematical-modelling-for-electric-vehicles': {
    name: 'Mathematical Modelling for Electric Vehicles',
    description: 'Mathematical modeling techniques for electric vehicle systems, battery modeling, and performance analysis.',
    code: 'EN3BS17'
  },
  'introduction-to-automotive-systems': {
    name: 'Introduction to Automotive Systems',
    description: 'Automotive engineering fundamentals, vehicle systems, and automotive technology overview.',
    code: 'AU3CO51'
  },
  'mechanics-of-materials': {
    name: 'Mechanics of Materials',
    description: 'Material properties, stress analysis, deformation, and failure analysis in automotive applications.',
    code: 'AU3CO52'
  },
  'sensors-and-control': {
    name: 'Sensors and Control',
    description: 'Automotive sensors, control systems, electronic control units, and vehicle automation.',
    code: 'AU3CO53'
  },
  'thermal-engineering': {
    name: 'Thermal Engineering',
    description: 'Heat transfer, thermodynamics, thermal management in vehicles, and engine cooling systems.',
    code: 'AU3CO54'
  },
  'python-programming': {
    name: 'Python Programming',
    description: 'Python programming for automotive applications, data analysis, and simulation.',
    code: 'AU3CO55'
  },
  'materials-and-material-testing-lab': {
    name: 'Materials and Material Testing Lab',
    description: 'Laboratory testing of automotive materials, material characterization, and quality assessment.',
    code: 'AU3CO56'
  },
  'manufacturing-technology': {
    name: 'Manufacturing Technology',
    description: 'Manufacturing processes, production techniques, and quality control in automotive industry.',
    code: 'AU3CO57'
  },
  'cnc-machines-and-metrology': {
    name: 'CNC Machines and Metrology',
    description: 'Computer numerical control machining, precision measurement, and quality inspection techniques.',
    code: 'AU3CO58'
  },
  'mechanics-of-machines': {
    name: 'Mechanics of Machines',
    description: 'Machine dynamics, kinematics, vibrations, and mechanical system analysis.',
    code: 'AU3CO59'
  },
  'electric-vehicle-technology': {
    name: 'Electric Vehicle Technology',
    description: 'Electric vehicle systems, battery technology, electric motors, and charging infrastructure.',
    code: 'AU3CO60'
  },
  'engineering-design': {
    name: 'Engineering Design',
    description: 'Design methodology, CAD applications, product development, and engineering design principles.',
    code: 'EN3ES31'
  },
  // Automobile (EV) 3rd Year
  'industrial-engineering-and-operations-research': {
    name: 'Industrial Engineering & Operations Research',
    description: 'Industrial engineering principles, operations research techniques, optimization, and production management.',
    code: 'AU3CO61'
  },
  'automotive-electrical-and-electronics-system': {
    name: 'Automotive Electrical and Electronics System',
    description: 'Vehicle electrical systems, electronic control units, automotive electronics, and electrical troubleshooting.',
    code: 'AU3CO62'
  },
  'vehicular-network-and-communication': {
    name: 'Vehicular Network and Communication',
    description: 'Vehicle communication protocols, CAN bus, automotive networking, and connected vehicle technologies.',
    code: 'AU3CO63'
  },
  'automotive-chassis': {
    name: 'Automotive Chassis',
    description: 'Chassis design, suspension systems, steering mechanisms, and vehicle dynamics.',
    code: 'AU3CO64'
  },
  'design-and-simulation-lab': {
    name: 'Design and Simulation Lab',
    description: 'CAD/CAE tools, vehicle simulation, design validation, and virtual prototyping.',
    code: 'AU3CO65'
  },
  'electric-and-hybrid-vehicles': {
    name: 'Electric and Hybrid Vehicles',
    description: 'Electric vehicle architecture, hybrid powertrains, battery management systems, and charging technologies.',
    code: 'AU3CO66'
  },
  'power-electronics-circuits': {
    name: 'Power Electronics Circuits',
    description: 'Power electronic devices, inverters, converters, motor drives, and power management systems.',
    code: 'AU3CO67'
  },
  'data-science-for-automobile-engineers': {
    name: 'Data Science for Automobile Engineers',
    description: 'Data analytics, machine learning applications in automotive, predictive maintenance, and vehicle data analysis.',
    code: 'AU3CO68'
  },
  // Automobile (EV) 4th Year
  'industrial-training-automotive': {
    name: 'Industrial Training',
    description: 'Practical industry experience, internship reports, and professional skill development in automotive industry.',
    code: 'AU3PC23'
  },
  // Robotics & Automation 2nd Year
  'strength-of-materials-for-mechanical-engineers': {
    name: 'Strength of Materials for Mechanical Engineers',
    description: 'Stress, strain, mechanical properties of materials, and structural analysis for mechanical applications.',
    code: 'RA3CO23'
  },
  'kinematics-and-dynamics-of-machines': {
    name: 'Kinematics and Dynamics of Machines',
    description: 'Machine kinematics, velocity analysis, acceleration analysis, and dynamics of mechanical systems.',
    code: 'RA3CO24'
  },
  'basic-of-thermal-engineering': {
    name: 'Basic of Thermal Engineering',
    description: 'Thermodynamics principles, heat transfer, thermal systems, and energy conversion processes.',
    code: 'RA3CO25'
  },
  'sensors-and-instrumentation': {
    name: 'Sensors and Instrumentation',
    description: 'Sensor technologies, measurement systems, instrumentation principles, and data acquisition.',
    code: 'RA3CO27'
  },
  'cnc-machine-and-metrology': {
    name: 'CNC Machine and Metrology',
    description: 'Computer numerical control machining, precision measurement, and quality control techniques.',
    code: 'RA3CO30'
  },
  'automatic-control-systems': {
    name: 'Automatic Control Systems',
    description: 'Control theory, feedback systems, stability analysis, and control system design.',
    code: 'RA3CO31'
  },
  'python-for-robotics-engineers': {
    name: 'Python for Robotics Engineers',
    description: 'Python programming for robotics applications, automation, and control systems.',
    code: 'RA3CO32'
  },
  'cad-lab': {
    name: 'CAD Lab',
    description: 'Computer-aided design software, 3D modeling, technical drawing, and design visualization.',
    code: 'RA3CO40'
  },
  'design-of-machine-elements-and-transmission-systems': {
    name: 'Design of Machine Elements and Transmission Systems',
    description: 'Mechanical design principles, machine elements, gear systems, and power transmission.',
    code: 'RA3CO43'
  },
  // Robotics & Automation 3rd Year
  'robot-system-design-and-slam': {
    name: 'Robot System Design and SLAM (Simultaneous Localization and Area Mapping)',
    description: 'Robot system architecture, SLAM algorithms, localization techniques, and autonomous navigation.',
    code: 'RA3CO33'
  },
  'electrical-machines-and-power-systems': {
    name: 'Electrical Machines and Power Systems',
    description: 'AC/DC machines, transformers, power system analysis, and electrical power distribution.',
    code: 'RA3CO37'
  },
  'microcontroller-and-programmable-logic-controllers': {
    name: 'Microcontroller and Programmable Logic Controllers',
    description: 'Microcontroller programming, PLC systems, industrial automation, and control applications.',
    code: 'RA3CO38'
  },
  'computer-vision': {
    name: 'Computer Vision',
    description: 'Image processing, pattern recognition, machine vision, and visual perception for robotics.',
    code: 'RA3CO46'
  },
  'embedded-systems': {
    name: 'Embedded Systems',
    description: 'Embedded system design, real-time systems, microprocessor applications, and IoT integration.',
    code: 'RA3CO49'
  },
  'digital-image-processing': {
    name: 'Digital Image Processing',
    description: 'Image enhancement, filtering, feature extraction, and computer vision fundamentals.',
    code: 'RA3CO50'
  },
  'principles-of-robotics': {
    name: 'Principles of Robotics',
    description: 'Robot kinematics, dynamics, control systems, and robotic system fundamentals.',
    code: 'RA3CO51'
  },
  // Robotics & Automation 4th Year
  'industrial-training-robotics': {
    name: 'Industrial Training',
    description: 'Practical industry experience, internship reports, and professional skill development in robotics and automation industry.',
    code: 'RA3PC03'
  },
  // Mechanical Engineering 2nd Year
  'manufacturing-processes-1': {
    name: 'Manufacturing Processes - I',
    description: 'Casting, welding, forming processes, and traditional manufacturing techniques.',
    code: 'ME3CO18'
  },
  'engineering-thermodynamics': {
    name: 'Engineering Thermodynamics',
    description: 'Thermodynamic laws, cycles, heat engines, and energy conversion systems.',
    code: 'ME3CO44'
  },
  'engineering-materials': {
    name: 'Engineering Materials',
    description: 'Material properties, selection criteria, metals, polymers, and composite materials.',
    code: 'EN3ES25'
  },
  'manufacturing-processes-2': {
    name: 'Manufacturing Processes- II',
    description: 'Advanced manufacturing, machining processes, CNC operations, and modern production techniques.',
    code: 'ME3CO45'
  },
  'fluid-mechanics-and-machinery': {
    name: 'Fluid Mechanics and Machinery',
    description: 'Fluid properties, flow analysis, pumps, turbines, and hydraulic machinery.',
    code: 'ME3CO46'
  },
  'kinematics-of-machines': {
    name: 'Kinematics of Machines',
    description: 'Machine kinematics, velocity analysis, acceleration analysis, and mechanism design.',
    code: 'ME3CO47'
  },
  'python-programming-for-mechanical-engineers': {
    name: 'Python Programming for Mechanical Engineers -I',
    description: 'Python programming for mechanical engineering applications, simulation, and data analysis.',
    code: 'ME3CO24'
  },
  // Mechanical Engineering 3rd Year
  'heat-and-mass-transfer': {
    name: 'Heat & Mass Transfer',
    description: 'Heat conduction, convection, radiation, mass transfer phenomena, and thermal system analysis.',
    code: 'ME3CO32'
  },
  'dynamics-of-machine': {
    name: 'Dynamics of Machine',
    description: 'Machine dynamics, vibrations, balancing, and dynamic analysis of mechanical systems.',
    code: 'ME3CO34'
  },
  'thermal-lab': {
    name: 'Thermal Lab',
    description: 'Laboratory experiments in thermodynamics, heat transfer, and thermal engineering applications.',
    code: 'ME3CO35'
  },
  'design-and-simulation-lab-2': {
    name: 'Design and Simulation Lab -II',
    description: 'Advanced CAD/CAE applications, finite element analysis, and design optimization.',
    code: 'ME3CO38'
  },
  'machine-design': {
    name: 'Machine Design',
    description: 'Design of machine elements, mechanical components, and engineering design principles.',
    code: 'ME3CO39'
  },
  'design-and-simulation-lab-1': {
    name: 'Design and Simulation Lab1',
    description: 'CAD modeling, simulation techniques, and computer-aided design applications.',
    code: 'ME3CO41'
  },
  'data-science-for-mechanical-engineers': {
    name: 'Data Science for Mechanical Engineers',
    description: 'Data analytics, machine learning applications in mechanical engineering, and predictive maintenance.',
    code: 'ME3CO48'
  },
  'computer-integrated-manufacturing': {
    name: 'Computer Integrated Manufacturing',
    description: 'CIM systems, automation, robotics in manufacturing, and integrated production systems.',
    code: 'ME3CO49'
  },
  'refrigeration-and-air-conditioning': {
    name: 'Refrigeration & Air Conditioning',
    description: 'Refrigeration cycles, air conditioning systems, HVAC design, and thermal comfort.',
    code: 'ME3CO50'
  },
  // Mechanical Engineering 4th Year
  'industrial-training-mechanical': {
    name: 'Industrial Training',
    description: 'Practical industry experience, internship reports, and professional skill development in mechanical engineering industry.',
    code: 'ME3PC03'
  },
  // IT 2nd Year
  'operating-system': {
    name: 'Operating System',
    description: 'Operating system concepts, process management, memory management, and file systems.',
    code: 'IT3CO21'
  },
  'microprocessor-and-microcontroller': {
    name: 'Microprocessor & Microcontroller',
    description: 'Microprocessor architecture, microcontroller programming, and embedded system applications.',
    code: 'IT3CO32'
  },
  // IT 3rd Year
  'distributed-and-cloud-computing': {
    name: 'Distributed and Cloud Computing',
    description: 'Distributed systems, cloud computing architectures, virtualization, and cloud service models.',
    code: 'IT3CO35'
  },
  'python-programming-it': {
    name: 'Python Programming',
    description: 'Python programming language, data structures, libraries, and application development.',
    code: 'IT3ES03'
  },
  'web-programming': {
    name: 'Web Programming',
    description: 'Web development technologies, HTML, CSS, JavaScript, and web application frameworks.',
    code: 'IT3ES01'
  },
  // IT 4th Year
  'industrial-training-it': {
    name: 'Industrial Training',
    description: 'Practical industry experience, internship reports, and professional skill development in information technology industry.',
    code: 'IT3PC03'
  },
  // ECE 2nd Year
  'electronic-devices-and-circuits': {
    name: 'Electronic Devices and Circuits',
    description: 'Semiconductor devices, diodes, transistors, amplifiers, and electronic circuit analysis.',
    code: 'EC3CO03'
  },
  'circuit-analysis-and-synthesis': {
    name: 'Circuit Analysis and Synthesis',
    description: 'Network analysis, circuit theorems, frequency response, and filter design.',
    code: 'EC3CO05'
  },
  'linear-integrated-circuit-and-applications': {
    name: 'Linear Integrated Circuit and Applications',
    description: 'Operational amplifiers, analog IC design, and linear circuit applications.',
    code: 'EC3CO17'
  },
  'vlsi-design': {
    name: 'VLSI Design',
    description: 'Very Large Scale Integration design, digital IC design, and CMOS technology.',
    code: 'EC3CO20'
  },
  'communication-systems': {
    name: 'Communication Systems',
    description: 'Analog and digital communication, modulation techniques, and signal processing.',
    code: 'EC3COXX'
  },
  'engineering-electromagnetics': {
    name: 'Engineering Electromagnetics',
    description: 'Electromagnetic fields, wave propagation, transmission lines, and antenna theory.',
    code: 'EC3CO08'
  },
  'engineering-workshop-python-programming': {
    name: 'Engineering Workshop II / Python Programming for Electronics Engg',
    description: 'Practical workshop skills and Python programming for electronics engineering applications.',
    code: 'EN3ES23'
  },
  'open-learning-courses': {
    name: 'Open Learning Courses',
    description: 'Flexible learning modules covering diverse topics based on student interests.',
    code: 'EN3NG06'
  },
  // ECE 3rd Year
  'digital-signal-processing': {
    name: 'Digital Signal Processing',
    description: 'Digital signal analysis, filtering, transforms, and signal processing algorithms.',
    code: 'EC3COXX'
  },
  'vlsi-technology': {
    name: 'VLSI Technology',
    description: 'VLSI fabrication processes, semiconductor technology, and integrated circuit manufacturing.',
    code: 'EC3COXX'
  },
  'scripting-languages-and-verification': {
    name: 'Scripting Languages and Verification',
    description: 'Hardware description languages, verification methodologies, and design automation.',
    code: 'EC3COXX'
  },
  'digital-logic-synthesis-using-hdl': {
    name: 'Digital Logic Synthesis using HDL',
    description: 'Hardware description languages, logic synthesis, and digital system design.',
    code: 'EC3COXX'
  },
  'semiconductor-device-modelling': {
    name: 'Semiconductor Device Modelling',
    description: 'Device physics, semiconductor modeling, and electronic device characterization.',
    code: 'EC3COXX'
  },
  'fiber-optic-communication': {
    name: 'Fiber Optic Communication',
    description: 'Optical communication systems, fiber optics, and photonic devices.',
    code: 'EC3CO21'
  },
  // ECE 4th Year
  'industrial-training-ece': {
    name: 'Industrial Training',
    description: 'Practical industry experience, internship reports, and professional skill development in electronics and communication engineering industry.',
    code: 'EC3PC03'
  },
  // Mix subjects for different branches and years
  'mix-1st-year': {
    name: 'Mix',
    description: 'Mixed study materials, miscellaneous resources, and general reference materials for 1st year engineering.',
  },
  'mix-cse-2nd-year': {
    name: 'Mix',
    description: 'Mixed study materials, miscellaneous resources, and general reference materials for CSE 2nd year.',
  },
  'mix-cse-3rd-year': {
    name: 'Mix',
    description: 'Mixed study materials, miscellaneous resources, and general reference materials for CSE 3rd year.',
  },
  'mix-cse-4th-year': {
    name: 'Mix',
    description: 'Mixed study materials, miscellaneous resources, and general reference materials for CSE 4th year.',
  },
  'mix-csbs-2nd-year': {
    name: 'Mix',
    description: 'Mixed study materials, miscellaneous resources, and general reference materials for CSBS 2nd year.',
  },
  'mix-csbs-3rd-year': {
    name: 'Mix',
    description: 'Mixed study materials, miscellaneous resources, and general reference materials for CSBS 3rd year.',
  },
  'mix-csbs-4th-year': {
    name: 'Mix',
    description: 'Mixed study materials, miscellaneous resources, and general reference materials for CSBS 4th year.',
  },
  'mix-ece-2nd-year': {
    name: 'Mix',
    description: 'Mixed study materials, miscellaneous resources, and general reference materials for ECE 2nd year.',
  },
  'mix-ece-3rd-year': {
    name: 'Mix',
    description: 'Mixed study materials, miscellaneous resources, and general reference materials for ECE 3rd year.',
  },
  'mix-ece-4th-year': {
    name: 'Mix',
    description: 'Mixed study materials, miscellaneous resources, and general reference materials for ECE 4th year.',
  },
  'mix-civil-2nd-year': {
    name: 'Mix',
    description: 'Mixed study materials, miscellaneous resources, and general reference materials for Civil 2nd year.',
  },
  'mix-civil-3rd-year': {
    name: 'Mix',
    description: 'Mixed study materials, miscellaneous resources, and general reference materials for Civil 3rd year.',
  },
  'mix-civil-4th-year': {
    name: 'Mix',
    description: 'Mixed study materials, miscellaneous resources, and general reference materials for Civil 4th year.',
  },
  'mix-electrical-2nd-year': {
    name: 'Mix',
    description: 'Mixed study materials, miscellaneous resources, and general reference materials for Electrical 2nd year.',
  },
  'mix-electrical-3rd-year': {
    name: 'Mix',
    description: 'Mixed study materials, miscellaneous resources, and general reference materials for Electrical 3rd year.',
  },
  'mix-electrical-4th-year': {
    name: 'Mix',
    description: 'Mixed study materials, miscellaneous resources, and general reference materials for Electrical 4th year.',
  },
  'mix-automobile-ev-2nd-year': {
    name: 'Mix',
    description: 'Mixed study materials, miscellaneous resources, and general reference materials for Automobile (EV) 2nd year.',
  },
  'mix-automobile-ev-3rd-year': {
    name: 'Mix',
    description: 'Mixed study materials, miscellaneous resources, and general reference materials for Automobile (EV) 3rd year.',
  },
  'mix-automobile-ev-4th-year': {
    name: 'Mix',
    description: 'Mixed study materials, miscellaneous resources, and general reference materials for Automobile (EV) 4th year.',
  },
  'mix-it-2nd-year': {
    name: 'Mix',
    description: 'Mixed study materials, miscellaneous resources, and general reference materials for IT 2nd year.',
  },
  'mix-it-3rd-year': {
    name: 'Mix',
    description: 'Mixed study materials, miscellaneous resources, and general reference materials for IT 3rd year.',
  },
  'mix-it-4th-year': {
    name: 'Mix',
    description: 'Mixed study materials, miscellaneous resources, and general reference materials for IT 4th year.',
  },
  'mix-mechanical-2nd-year': {
    name: 'Mix',
    description: 'Mixed study materials, miscellaneous resources, and general reference materials for Mechanical 2nd year.',
  },
  'mix-mechanical-3rd-year': {
    name: 'Mix',
    description: 'Mixed study materials, miscellaneous resources, and general reference materials for Mechanical 3rd year.',
  },
  'mix-mechanical-4th-year': {
    name: 'Mix',
    description: 'Mixed study materials, miscellaneous resources, and general reference materials for Mechanical 4th year.',
  },
  'mix-robotics-automation-2nd-year': {
    name: 'Mix',
    description: 'Mixed study materials, miscellaneous resources, and general reference materials for Robotics & Automation 2nd year.',
  },
  'mix-robotics-automation-3rd-year': {
    name: 'Mix',
    description: 'Mixed study materials, miscellaneous resources, and general reference materials for Robotics & Automation 3rd year.',
  },
  'mix-robotics-automation-4th-year': {
    name: 'Mix',
    description: 'Mixed study materials, miscellaneous resources, and general reference materials for Robotics & Automation 4th year.',
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



export default async function BTechSubjectPage({ params }: PageProps) {
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