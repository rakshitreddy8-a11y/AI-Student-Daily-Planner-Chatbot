interface RoadmapTopic {
  week: number;
  title: string;
  subtopics: string[];
  completedSubtopics?: string[];
}

interface GenerateRoadmapParams {
  type: 'exam' | 'placement';
  subject: string;
}

// ✅ COMPREHENSIVE DETECTION including SCHOOL EXAMS
const detectTarget = (subject: string): { name: string; category: string } => {
  const lowerSubject = subject.toLowerCase();
  
  // ✅ SCHOOL BOARD EXAMS (NEW!)
  const schoolExams: Record<string, string> = {
    '10th icse': '10th ICSE Board Exam',
    '10 icse': '10th ICSE Board Exam',
    'icse 10': '10th ICSE Board Exam',
    'class 10 icse': '10th ICSE Board Exam',
    '12th icse': '12th ICSE Board Exam',
    '12 icse': '12th ICSE Board Exam',
    'icse 12': '12th ICSE Board Exam',
    'class 12 icse': '12th ICSE Board Exam',
    '10th cbse': '10th CBSE Board Exam',
    '10 cbse': '10th CBSE Board Exam',
    'cbse 10': '10th CBSE Board Exam',
    'class 10 cbse': '10th CBSE Board Exam',
    '12th cbse': '12th CBSE Board Exam',
    '12 cbse': '12th CBSE Board Exam',
    'cbse 12': '12th CBSE Board Exam',
    'class 12 cbse': '12th CBSE Board Exam',
    'icse board': 'ICSE Board Exam',
    'cbse board': 'CBSE Board Exam',
    '10th board': '10th Board Exam',
    '12th board': '12th Board Exam',
    'class 10': 'Class 10 Board Exam',
    'class 12': 'Class 12 Board Exam',
  };

  // ✅ COMPETITIVE EXAMS (NEW!)
  const competitiveExams: Record<string, string> = {
    'jee main': 'JEE Main',
    'jee advanced': 'JEE Advanced',
    'jee': 'JEE Main & Advanced',
    'neet': 'NEET',
    'neet ug': 'NEET UG',
    'gate': 'GATE',
    'gate cse': 'GATE Computer Science',
    'cat': 'CAT MBA Entrance',
    'cat exam': 'CAT MBA Entrance',
    'upsc': 'UPSC Civil Services',
    'ias': 'UPSC IAS',
    'ssc': 'SSC Exams',
    'ssc cgl': 'SSC CGL',
    'banking': 'Banking Exams',
    'ibps': 'IBPS Banking Exams',
    'clat': 'CLAT Law Entrance',
  };

  // Tech Companies
  const techCompanies: Record<string, string> = {
    'google': 'Google',
    'microsoft': 'Microsoft',
    'amazon': 'Amazon',
    'facebook': 'Facebook/Meta',
    'meta': 'Meta',
    'apple': 'Apple',
    'netflix': 'Netflix',
    'cisco': 'Cisco',
    'tcs': 'TCS',
    'infosys': 'Infosys',
    'wipro': 'Wipro',
    'cognizant': 'Cognizant',
    'accenture': 'Accenture',
    'ibm': 'IBM',
    'oracle': 'Oracle',
    'tesla': 'Tesla',
    'uber': 'Uber',
  };

  // Certifications
  const certifications: Record<string, string> = {
    'ccna': 'CCNA',
    'ccnp': 'CCNP',
    'aws': 'AWS',
    'azure': 'Microsoft Azure',
    'gcp': 'Google Cloud',
    'comptia': 'CompTIA',
    'ceh': 'CEH',
    'cissp': 'CISSP',
  };

  // Technical Skills
  const skills: Record<string, string> = {
    'python': 'Python Programming',
    'java': 'Java Programming',
    'javascript': 'JavaScript',
    'react': 'React.js',
    'dsa': 'Data Structures & Algorithms',
    'machine learning': 'Machine Learning',
    'web development': 'Web Development',
    'data science': 'Data Science',
  };

  // ✅ CHECK SCHOOL EXAMS FIRST (highest priority)
  for (const [key, value] of Object.entries(schoolExams)) {
    if (lowerSubject.includes(key)) {
      return { name: value, category: 'school_exam' };
    }
  }

  // ✅ CHECK COMPETITIVE EXAMS
  for (const [key, value] of Object.entries(competitiveExams)) {
    if (lowerSubject.includes(key)) {
      return { name: value, category: 'competitive_exam' };
    }
  }

  // Check companies
  for (const [key, value] of Object.entries(techCompanies)) {
    if (lowerSubject.includes(key)) {
      return { name: value, category: 'company' };
    }
  }

  // Check certifications
  for (const [key, value] of Object.entries(certifications)) {
    if (lowerSubject.includes(key)) {
      return { name: value, category: 'certification' };
    }
  }

  // Check skills
  for (const [key, value] of Object.entries(skills)) {
    if (lowerSubject.includes(key)) {
      return { name: value, category: 'skill' };
    }
  }

  return { name: subject, category: 'general' };
};

// ✅ GENERATE TOPICS with SCHOOL EXAM support
const generateTopicsForTarget = (
  target: { name: string; category: string },
  type: 'exam' | 'placement'
): RoadmapTopic[] => {
  const { name, category } = target;

  // ✅ 10th ICSE Board Exam Roadmap
  if (category === 'school_exam' && name.includes('10th ICSE')) {
    return [
      {
        week: 1,
        title: 'Mathematics Fundamentals',
        subtopics: [
          'Algebra - Linear Equations',
          'Geometry - Theorems & Proofs',
          'Trigonometry Basics',
          'Coordinate Geometry',
          'Statistics & Probability',
          'Mensuration Formulas',
        ],
      },
      {
        week: 2,
        title: 'Science - Physics & Chemistry',
        subtopics: [
          'Physics: Laws of Motion',
          'Physics: Light & Reflection',
          'Physics: Electricity & Magnetism',
          'Chemistry: Periodic Table',
          'Chemistry: Chemical Reactions',
          'Chemistry: Acids, Bases & Salts',
        ],
      },
      {
        week: 3,
        title: 'Science - Biology',
        subtopics: [
          'Cell Structure & Functions',
          'Human Anatomy Systems',
          'Plant Biology & Photosynthesis',
          'Reproduction & Genetics',
          'Evolution & Ecology',
          'Human Health & Diseases',
        ],
      },
      {
        week: 4,
        title: 'English Language & Literature',
        subtopics: [
          'Grammar & Composition',
          'Prescribed Books Reading',
          'Essay & Letter Writing',
          'Comprehension Practice',
          'Poetry Analysis',
          'Short Story Analysis',
        ],
      },
      {
        week: 5,
        title: 'Social Studies - History & Civics',
        subtopics: [
          'Indian Freedom Movement',
          'World History Events',
          'Indian Constitution',
          'Government Structure',
          'Fundamental Rights & Duties',
          'Political System',
        ],
      },
      {
        week: 6,
        title: 'Social Studies - Geography',
        subtopics: [
          'Physical Geography',
          'Indian Geography',
          'World Geography',
          'Map Work & Diagrams',
          'Climate & Vegetation',
          'Economic Geography',
        ],
      },
      {
        week: 7,
        title: 'Revision & Practice Papers',
        subtopics: [
          'Previous Year Papers (2020-2024)',
          'Sample Papers Practice',
          'Weak Topic Revision',
          'Time Management Practice',
          'Formula Sheets Review',
          'Important Questions',
        ],
      },
      {
        week: 8,
        title: 'Final Preparation & Mock Tests',
        subtopics: [
          'Full-length Mock Tests',
          'Formula & Concept Sheets',
          'Last-minute Tips',
          'Exam Strategy & Relaxation',
          'Answer Writing Practice',
          'Confidence Building',
        ],
      },
    ];
  }

  // ✅ 12th Board Exam Roadmap
  if (category === 'school_exam' && (name.includes('12th') || name.includes('Class 12'))) {
    return [
      {
        week: 1,
        title: 'Core Subjects - Part 1',
        subtopics: [
          'Mathematics - Calculus',
          'Physics - Mechanics',
          'Chemistry - Physical Chemistry',
          'English - Literature',
          'NCERT Chapter 1-5',
          'Formula Sheets Preparation',
        ],
      },
      {
        week: 2,
        title: 'Core Subjects - Part 2',
        subtopics: [
          'Mathematics - Algebra & Vectors',
          'Physics - Electricity',
          'Chemistry - Organic Chemistry',
          'Second Language',
          'NCERT Chapter 6-10',
          'Numerical Practice',
        ],
      },
      {
        week: 3,
        title: 'Advanced Topics',
        subtopics: [
          'Mathematics - 3D Geometry',
          'Physics - Modern Physics',
          'Chemistry - Inorganic Chemistry',
          'Elective Subject',
          'Theory Understanding',
          'Diagram Practice',
        ],
      },
      {
        week: 4,
        title: 'NCERT Mastery',
        subtopics: [
          'Complete NCERT (All Subjects)',
          'NCERT Examples & Exercises',
          'NCERT Exemplar Problems',
          'Back Exercise Questions',
          'Chapter-end Questions',
          'Intext Questions',
        ],
      },
      {
        week: 5,
        title: 'Previous Years (15 years)',
        subtopics: [
          'Previous Year Papers (2010-2024)',
          'Board Paper Pattern Analysis',
          'Marking Scheme Understanding',
          'High-weightage Topics',
          'Frequently Asked Questions',
          'Solving Strategy',
        ],
      },
      {
        week: 6,
        title: 'Sample Papers & Practice',
        subtopics: [
          'Sample Papers (50+)',
          'Mock Tests (Weekly)',
          'Timed Practice',
          'Answer Sheet Presentation',
          'Speed Improvement',
          'Accuracy Enhancement',
        ],
      },
      {
        week: 7,
        title: 'Complete Revision',
        subtopics: [
          'Subject-wise Quick Revision',
          'Formula Sheets Memorization',
          'Important Derivations',
          'Reactions & Equations',
          'Diagrams & Graphs',
          'Definition & Theorems',
        ],
      },
      {
        week: 8,
        title: 'Final Week Strategy',
        subtopics: [
          'Light Revision (No New Topics)',
          'Last 5 Years Papers Again',
          'Important Questions Focus',
          'Exam Strategy Refinement',
          'Stress Management',
          'Confidence Building',
        ],
      },
    ];
  }

  // ✅ JEE Main/Advanced Roadmap
  if (category === 'competitive_exam' && name.includes('JEE')) {
    return [
      {
        week: 1,
        title: 'Physics - Mechanics',
        subtopics: [
          'Laws of Motion',
          'Work, Energy & Power',
          'Rotational Motion',
          'Gravitation',
          'SHM (Simple Harmonic Motion)',
          'Fluid Mechanics',
        ],
      },
      {
        week: 2,
        title: 'Chemistry - Physical Chemistry',
        subtopics: [
          'Atomic Structure',
          'Chemical Bonding',
          'Thermodynamics',
          'Chemical Kinetics',
          'Equilibrium',
          'Mole Concept',
        ],
      },
      {
        week: 3,
        title: 'Mathematics - Algebra & Calculus',
        subtopics: [
          'Complex Numbers',
          'Quadratic Equations',
          'Differentiation',
          'Integration',
          'Sequences & Series',
          'Binomial Theorem',
        ],
      },
      {
        week: 4,
        title: 'Physics - Electromagnetism',
        subtopics: [
          'Electrostatics',
          'Current Electricity',
          'Magnetic Effects',
          'Electromagnetic Induction',
          'AC Circuits',
          'EM Waves',
        ],
      },
      {
        week: 5,
        title: 'Chemistry - Organic & Inorganic',
        subtopics: [
          'Hydrocarbons',
          'Organic Reactions',
          'd & f Block Elements',
          'Coordination Compounds',
          'Aldehydes & Ketones',
          'Carboxylic Acids',
        ],
      },
      {
        week: 6,
        title: 'Mathematics - Coordinate & Vector',
        subtopics: [
          'Straight Lines & Circles',
          'Parabola & Ellipse',
          'Vectors',
          '3D Geometry',
          'Probability',
          'Matrices & Determinants',
        ],
      },
      {
        week: 7,
        title: 'Mock Tests & Previous Years',
        subtopics: [
          'JEE Main Papers (2019-2024)',
          'JEE Advanced Papers (2015-2024)',
          'Full-length Mocks (20+)',
          'Topic-wise Tests',
          'Error Analysis',
          'Time Management',
        ],
      },
      {
        week: 8,
        title: 'Final Revision & Strategy',
        subtopics: [
          'Formula Sheets (All Subjects)',
          'Important Reactions',
          'Derivations Practice',
          'Quick Revision Notes',
          'Exam Strategy',
          'Stress Management',
        ],
      },
    ];
  }

  // ✅ NEET Roadmap
  if (category === 'competitive_exam' && name.includes('NEET')) {
    return [
      {
        week: 1,
        title: 'Biology - Botany Basics',
        subtopics: [
          'Plant Physiology',
          'Plant Reproduction',
          'Cell Biology',
          'Genetics Fundamentals',
          'Molecular Biology',
          'Biotechnology',
        ],
      },
      {
        week: 2,
        title: 'Biology - Zoology Basics',
        subtopics: [
          'Human Physiology',
          'Animal Diversity',
          'Reproduction',
          'Evolution',
          'Ecology & Environment',
          'Human Health',
        ],
      },
      {
        week: 3,
        title: 'Physics for NEET',
        subtopics: [
          'Mechanics & Motion',
          'Optics',
          'Modern Physics',
          'Electricity & Magnetism',
          'Thermodynamics',
          'Waves & Sound',
        ],
      },
      {
        week: 4,
        title: 'Chemistry - Organic',
        subtopics: [
          'Basic Organic Chemistry',
          'Hydrocarbons',
          'Biomolecules',
          'Polymers',
          'Organic Reactions',
          'Nomenclature',
        ],
      },
      {
        week: 5,
        title: 'Chemistry - Inorganic & Physical',
        subtopics: [
          'Periodic Table',
          'Chemical Bonding',
          'Coordination Compounds',
          'd-block Elements',
          'Thermodynamics',
          'Chemical Kinetics',
        ],
      },
      {
        week: 6,
        title: 'Advanced Biology Topics',
        subtopics: [
          'Ecology in Detail',
          'Biotechnology Applications',
          'Human Health & Disease',
          'Microorganisms',
          'Immunology',
          'Animal Husbandry',
        ],
      },
      {
        week: 7,
        title: 'Practice & Previous Years',
        subtopics: [
          'NEET Papers (2015-2024)',
          'Mock Tests (50+)',
          'Biology MCQs (5000+)',
          'Speed & Accuracy',
          'Diagram Practice',
          'Error Analysis',
        ],
      },
      {
        week: 8,
        title: 'Final Preparation',
        subtopics: [
          'Biology Revision (Priority)',
          'Important Topics Focus',
          'Diagrams & Flowcharts',
          'Formula Sheets',
          'Reactions Memorization',
          'Exam Day Strategy',
        ],
      },
    ];
  }

  // ✅ GATE Roadmap
  if (category === 'competitive_exam' && name.includes('GATE')) {
    return [
      {
        week: 1,
        title: 'Core Subjects - Part 1',
        subtopics: [
          'Engineering Mathematics',
          'Digital Logic',
          'Computer Organization',
          'Programming in C',
          'Data Structures Basics',
          'Algorithm Analysis',
        ],
      },
      {
        week: 2,
        title: 'Core Subjects - Part 2',
        subtopics: [
          'Advanced Data Structures',
          'Algorithms (Sorting, Searching)',
          'Operating Systems',
          'DBMS Fundamentals',
          'Computer Networks',
          'System Calls & Processes',
        ],
      },
      {
        week: 3,
        title: 'Theory Subjects',
        subtopics: [
          'Theory of Computation',
          'Compiler Design',
          'Software Engineering',
          'Automata',
          'Grammars & Parsing',
          'Code Generation',
        ],
      },
      {
        week: 4,
        title: 'Advanced Topics',
        subtopics: [
          'Dynamic Programming',
          'Graph Algorithms',
          'Greedy Algorithms',
          'Divide & Conquer',
          'Backtracking',
          'Branch & Bound',
        ],
      },
      {
        week: 5,
        title: 'Engineering Mathematics',
        subtopics: [
          'Linear Algebra',
          'Calculus',
          'Probability & Statistics',
          'Discrete Mathematics',
          'Graph Theory',
          'Set Theory',
        ],
      },
      {
        week: 6,
        title: 'Practice & Problem Solving',
        subtopics: [
          'Standard Book Problems',
          'Numerical Problems',
          'Concept Questions',
          'Tricky MCQs',
          'Previous Years (Last 5)',
          'Topic-wise Practice',
        ],
      },
      {
        week: 7,
        title: 'Previous Years & Mocks',
        subtopics: [
          'GATE Papers (2010-2024)',
          'Mock Test Series (20+)',
          'Virtual Tests',
          'Time Management',
          'Negative Marking Strategy',
          'Error Analysis',
        ],
      },
      {
        week: 8,
        title: 'Final Revision',
        subtopics: [
          'Formula Sheets',
          'Important Theorems',
          'Algorithms Review',
          'Quick Revision Notes',
          'Last 3 Years Again',
          'Exam Strategy',
        ],
      },
    ];
  }

  // Company Interview Roadmap (existing - keep as is)
  if (category === 'company') {
    return [
      {
        week: 1,
        title: 'Data Structures Basics',
        subtopics: [
          'Arrays & Strings',
          'Linked Lists',
          'Stacks & Queues',
          'Hash Tables',
        ],
      },
      {
        week: 2,
        title: 'Advanced Data Structures',
        subtopics: [
          'Trees & Binary Search Trees',
          'Graphs & Graph Algorithms',
          'Heaps & Priority Queues',
          'Tries & Suffix Trees',
        ],
      },
      {
        week: 3,
        title: 'Algorithms',
        subtopics: [
          'Sorting & Searching',
          'Two Pointers Technique',
          'Sliding Window',
          'Binary Search Variations',
        ],
      },
      {
        week: 4,
        title: 'Dynamic Programming',
        subtopics: [
          '1D DP Problems',
          '2D DP Problems',
          'Memoization & Tabulation',
          'Optimization Techniques',
        ],
      },
      {
        week: 5,
        title: 'System Design Fundamentals',
        subtopics: [
          'Scalability Concepts',
          'Load Balancing',
          'Caching Strategies',
          'Database Design',
        ],
      },
      {
        week: 6,
        title: `${name}-Specific Preparation`,
        subtopics: [
          `${name} Coding Questions`,
          `${name} System Design`,
          'Company Culture Research',
          'Product Knowledge',
        ],
      },
      {
        week: 7,
        title: 'Behavioral Preparation',
        subtopics: [
          'STAR Method Stories',
          'Leadership Examples',
          'Team Collaboration',
          'Conflict Resolution',
        ],
      },
      {
        week: 8,
        title: 'Mock Interviews & Practice',
        subtopics: [
          'Coding Mock Interviews',
          'System Design Practice',
          'Behavioral Rounds',
          'Final Revision',
        ],
      },
    ];
  }

  // CCNA Certification (existing - keep as is)
  if (name === 'CCNA') {
    return [
      {
        week: 1,
        title: 'Network Fundamentals',
        subtopics: [
          'OSI Model & TCP/IP Model',
          'IP Addressing & Subnetting',
          'Network Topologies',
          'Binary & Hexadecimal Conversion',
        ],
      },
      {
        week: 2,
        title: 'Ethernet & Switching',
        subtopics: [
          'Ethernet Technology',
          'Switch Operations',
          'VLANs Configuration',
          'Trunking & DTP',
        ],
      },
      {
        week: 3,
        title: 'Routing Fundamentals',
        subtopics: [
          'Static Routing',
          'Dynamic Routing Protocols',
          'RIP & EIGRP',
          'OSPF Configuration',
        ],
      },
      {
        week: 4,
        title: 'IP Services',
        subtopics: [
          'DHCP Configuration',
          'NAT & PAT',
          'Access Control Lists',
          'DNS Basics',
        ],
      },
      {
        week: 5,
        title: 'Network Security',
        subtopics: [
          'Security Fundamentals',
          'AAA & RADIUS',
          'VPNs & IPSec',
          'Wireless Security',
        ],
      },
      {
        week: 6,
        title: 'Wireless Networking',
        subtopics: [
          'WLAN Standards',
          'Wireless Configuration',
          'Controller Architecture',
          'Troubleshooting',
        ],
      },
      {
        week: 7,
        title: 'Automation & Programmability',
        subtopics: [
          'Network Automation',
          'REST APIs',
          'JSON & YAML',
          'Python Basics',
        ],
      },
      {
        week: 8,
        title: 'Practice & Review',
        subtopics: [
          'Packet Tracer Labs',
          'Practice Exams',
          'Weak Areas Review',
          'Exam Strategy',
        ],
      },
    ];
  }

  // Python Programming (existing - keep as is)
  if (name === 'Python Programming') {
    return [
      {
        week: 1,
        title: 'Python Basics',
        subtopics: [
          'Variables & Data Types',
          'Operators & Expressions',
          'Input/Output Operations',
          'Basic Programs',
        ],
      },
      {
        week: 2,
        title: 'Control Flow',
        subtopics: [
          'If-Else Statements',
          'Loops (for, while)',
          'Break & Continue',
          'Nested Structures',
        ],
      },
      {
        week: 3,
        title: 'Functions & Modules',
        subtopics: [
          'Function Definitions',
          'Parameters & Arguments',
          'Lambda Functions',
          'Module Imports',
        ],
      },
      {
        week: 4,
        title: 'Data Structures',
        subtopics: [
          'Lists & Tuples',
          'Dictionaries & Sets',
          'List Comprehensions',
          'Built-in Functions',
        ],
      },
      {
        week: 5,
        title: 'Object-Oriented Programming',
        subtopics: [
          'Classes & Objects',
          'Inheritance',
          'Polymorphism',
          'Encapsulation',
        ],
      },
      {
        week: 6,
        title: 'File Handling & Exceptions',
        subtopics: [
          'Reading & Writing Files',
          'Exception Handling',
          'Context Managers',
          'Working with CSV/JSON',
        ],
      },
      {
        week: 7,
        title: 'Advanced Topics',
        subtopics: [
          'Decorators',
          'Generators',
          'Regular Expressions',
          'Working with APIs',
        ],
      },
      {
        week: 8,
        title: 'Projects & Practice',
        subtopics: [
          'Mini Project 1',
          'Mini Project 2',
          'LeetCode Problems',
          'Final Project',
        ],
      },
    ];
  }

  // Default General Roadmap
  return [
    {
      week: 1,
      title: 'Week 1: Foundation',
      subtopics: ['Basic Concepts', 'Core Principles', 'Getting Started', 'First Steps'],
    },
    {
      week: 2,
      title: 'Week 2: Building Skills',
      subtopics: ['Intermediate Topics', 'Practice Exercises', 'Common Patterns', 'Best Practices'],
    },
    {
      week: 3,
      title: 'Week 3: Advanced Concepts',
      subtopics: ['Complex Topics', 'Real-world Applications', 'Case Studies', 'Problem Solving'],
    },
    {
      week: 4,
      title: 'Week 4: Specialization',
      subtopics: ['Deep Dive Topics', 'Expert Techniques', 'Industry Standards', 'Project Work'],
    },
    {
      week: 5,
      title: 'Week 5: Practice & Application',
      subtopics: ['Hands-on Projects', 'Practice Problems', 'Code Reviews', 'Optimization'],
    },
    {
      week: 6,
      title: 'Week 6: Advanced Applications',
      subtopics: ['Complex Projects', 'System Design', 'Architecture Patterns', 'Best Practices'],
    },
    {
      week: 7,
      title: 'Week 7: Review & Polish',
      subtopics: ['Comprehensive Review', 'Mock Tests', 'Weak Area Focus', 'Performance Tuning'],
    },
    {
      week: 8,
      title: 'Week 8: Final Preparation',
      subtopics: ['Final Review', 'Strategy & Tips', 'Confidence Building', 'Ready for Success'],
    },
  ];
};

// Main function to generate roadmap
export const generateRoadmap = async (
  type: 'exam' | 'placement',
  subject: string
): Promise<{ title: string; topics: RoadmapTopic[] }> => {
  try {
    console.log(`🗺️ Generating roadmap for: ${subject} (${type})`);

    // Detect target (company/exam/skill)
    const target = detectTarget(subject);
    console.log(`✅ Detected: ${target.name} (${target.category})`);

    // Generate topics
    const topics = generateTopicsForTarget(target, type);

    // ✅ Create title based on category
    let title = '';
    if (target.category === 'school_exam' || target.category === 'competitive_exam') {
      title = `${target.name} - Complete Preparation`;
    } else if (target.category === 'certification') {
      title = `${target.name} - Certification Preparation`;
    } else if (target.category === 'company') {
      title = `${target.name} - Interview Preparation`;
    } else {
      title = `${target.name} - Learning Roadmap`;
    }

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log(`✅ Generated roadmap with ${topics.length} weeks`);

    return {
      title,
      topics,
    };
  } catch (error) {
    console.error('❌ Error generating roadmap:', error);
    throw new Error('Failed to generate roadmap');
  }
};