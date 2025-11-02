import axios from 'axios';

const USE_MOCK_AI = true;

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Keywords that indicate user wants a roadmap
const ROADMAP_KEYWORDS = [
  'roadmap',
  'syllabus',
  'study plan',
  'curriculum',
  'learning path',
  'course outline',
  'preparation plan',
  'study guide',
  'topics to study',
  'what to learn',
  'prepare for',
  'crack',
  'interview',
  'exam',
  'board',
  'entrance',
  'competitive',
];

// Check if message is asking for roadmap
const isRoadmapRequest = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();
  return ROADMAP_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
};

// ✅ COMPREHENSIVE DETECTION including SCHOOL EXAMS
const detectCompanyOrExam = (message: string): { name: string; type: string; category: string } => {
  const lowerMessage = message.toLowerCase();
  
  // ✅ SCHOOL BOARD EXAMS (NEW!)
  const schoolExams: { [key: string]: string } = {
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
  const competitiveExams: { [key: string]: string } = {
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
  const techCompanies: { [key: string]: string } = {
    'google': 'Google',
    'microsoft': 'Microsoft',
    'amazon': 'Amazon',
    'facebook': 'Facebook/Meta',
    'meta': 'Facebook/Meta',
    'apple': 'Apple',
    'netflix': 'Netflix',
    'tesla': 'Tesla',
    'uber': 'Uber',
    'airbnb': 'Airbnb',
    'salesforce': 'Salesforce',
    'oracle': 'Oracle',
    'adobe': 'Adobe',
    'intel': 'Intel',
    'nvidia': 'NVIDIA',
    'ibm': 'IBM',
    'cisco': 'Cisco',
    'vmware': 'VMware',
    'samsung': 'Samsung',
    'sony': 'Sony',
    'tcs': 'TCS (Tata Consultancy Services)',
    'infosys': 'Infosys',
    'wipro': 'Wipro',
    'cognizant': 'Cognizant',
    'accenture': 'Accenture',
    'deloitte': 'Deloitte',
    'capgemini': 'Capgemini',
    'hcl': 'HCL Technologies',
    'tech mahindra': 'Tech Mahindra',
  };

  // Financial Companies
  const financialCompanies: { [key: string]: string } = {
    'goldman sachs': 'Goldman Sachs',
    'jp morgan': 'JP Morgan Chase',
    'morgan stanley': 'Morgan Stanley',
    'bank of america': 'Bank of America',
    'wells fargo': 'Wells Fargo',
    'citigroup': 'Citigroup',
    'hsbc': 'HSBC',
    'barclays': 'Barclays',
  };

  // Certifications & Professional Exams
  const certifications: { [key: string]: string } = {
    'ccna': 'CCNA (Cisco Certified Network Associate)',
    'ccnp': 'CCNP (Cisco Certified Network Professional)',
    'ccie': 'CCIE (Cisco Certified Internetwork Expert)',
    'aws': 'AWS Certification',
    'azure': 'Microsoft Azure Certification',
    'gcp': 'Google Cloud Platform Certification',
    'pmp': 'PMP (Project Management Professional)',
    'cissp': 'CISSP (Certified Information Systems Security Professional)',
    'comptia': 'CompTIA Certification',
    'ceh': 'CEH (Certified Ethical Hacker)',
    'cfa': 'CFA (Chartered Financial Analyst)',
    'frm': 'FRM (Financial Risk Manager)',
    'ca': 'CA (Chartered Accountant)',
    'cpa': 'CPA (Certified Public Accountant)',
    'gre': 'GRE Exam',
    'gmat': 'GMAT Exam',
  };

  // Technical Skills
  const technicalSkills: { [key: string]: string } = {
    'python': 'Python Programming',
    'java': 'Java Programming',
    'javascript': 'JavaScript',
    'react': 'React.js',
    'angular': 'Angular',
    'vue': 'Vue.js',
    'node': 'Node.js',
    'django': 'Django',
    'flask': 'Flask',
    'spring': 'Spring Framework',
    'dsa': 'Data Structures & Algorithms',
    'data structures': 'Data Structures & Algorithms',
    'algorithms': 'Data Structures & Algorithms',
    'machine learning': 'Machine Learning',
    'deep learning': 'Deep Learning',
    'artificial intelligence': 'Artificial Intelligence',
    'data science': 'Data Science',
    'web development': 'Web Development',
    'mobile development': 'Mobile Development',
    'android': 'Android Development',
    'ios': 'iOS Development',
    'flutter': 'Flutter',
    'react native': 'React Native',
    'devops': 'DevOps',
    'cloud computing': 'Cloud Computing',
    'cybersecurity': 'Cybersecurity',
    'blockchain': 'Blockchain',
  };

  // ✅ CHECK SCHOOL EXAMS FIRST (highest priority)
  for (const [keyword, fullName] of Object.entries(schoolExams)) {
    if (lowerMessage.includes(keyword)) {
      return { name: fullName, type: 'school_exam', category: 'academic' };
    }
  }

  // ✅ CHECK COMPETITIVE EXAMS
  for (const [keyword, fullName] of Object.entries(competitiveExams)) {
    if (lowerMessage.includes(keyword)) {
      return { name: fullName, type: 'competitive_exam', category: 'entrance' };
    }
  }

  // Check Tech Companies
  for (const [keyword, fullName] of Object.entries(techCompanies)) {
    if (lowerMessage.includes(keyword)) {
      return { name: fullName, type: 'company', category: 'tech' };
    }
  }

  // Check Financial Companies
  for (const [keyword, fullName] of Object.entries(financialCompanies)) {
    if (lowerMessage.includes(keyword)) {
      return { name: fullName, type: 'company', category: 'finance' };
    }
  }

  // Check Certifications
  for (const [keyword, fullName] of Object.entries(certifications)) {
    if (lowerMessage.includes(keyword)) {
      return { name: fullName, type: 'certification', category: 'exam' };
    }
  }

  // Check Technical Skills
  for (const [keyword, fullName] of Object.entries(technicalSkills)) {
    if (lowerMessage.includes(keyword)) {
      return { name: fullName, type: 'skill', category: 'technical' };
    }
  }

  return { name: 'General Software Engineering', type: 'general', category: 'tech' };
};

// ✅ GENERATE ROADMAP with SCHOOL EXAM support
const generateDynamicRoadmap = (detection: { name: string; type: string; category: string }): string => {
  const { name, type, category } = detection;

  // ✅ SCHOOL BOARD EXAMS (NEW!)
  if (type === 'school_exam') {
    return generateSchoolExamRoadmap(name);
  }

  // ✅ COMPETITIVE EXAMS (NEW!)
  if (type === 'competitive_exam') {
    return generateCompetitiveExamRoadmap(name);
  }

  // Tech Company Interview Roadmap
  if (type === 'company' && category === 'tech') {
    return generateTechCompanyRoadmap(name);
  }

  // Finance Company Roadmap
  if (type === 'company' && category === 'finance') {
    return generateFinanceCompanyRoadmap(name);
  }

  // Certification Roadmap
  if (type === 'certification') {
    return generateCertificationRoadmap(name);
  }

  // Technical Skill Roadmap
  if (type === 'skill') {
    return generateTechnicalSkillRoadmap(name);
  }

  return generateGeneralRoadmap();
};

// ✅ NEW: School Board Exam Roadmap Generator
const generateSchoolExamRoadmap = (exam: string): string => {
  if (exam.includes('10th ICSE')) {
    return `📝 **10th ICSE Board Exam - Complete Preparation Roadmap**

Comprehensive 8-month study plan for ICSE board exams!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**📚 8-Month Study Plan**

**Month 1-2: Foundation Building**
1. Mathematics
   - Complete NCERT/Selina textbook
   - All exercise questions
   - Theorems and proofs
   - Sample paper patterns

2. Science (Physics, Chemistry, Biology)
   - Chapter-wise theory understanding
   - Formula sheets preparation
   - Numerical problem practice
   - Diagram practice

3. English Language & Literature
   - Prescribed books (complete reading)
   - Grammar rules mastery
   - Essay and letter writing practice
   - Comprehension passages

4. Second Language
   - Grammar foundations
   - Literature pieces
   - Composition practice
   - Previous year questions

**Month 3-4: Subject Deep Dive**
1. Social Studies
   - History: Dates, events, timeline
   - Geography: Maps, diagrams, concepts
   - Civics: Important topics, Constitution
   - Economics: Basic concepts
   - Mind map creation

2. Mathematics Advanced
   - Advanced problems
   - Trigonometry focus
   - Coordinate geometry
   - Statistics & probability

3. Science Practicals
   - All experiments
   - Viva questions
   - Observation skills
   - Record book completion

**Month 5-6: Practice Phase**
1. Previous Year Papers
   - Last 10 years solved
   - Pattern analysis
   - Time management practice
   - Marking scheme understanding

2. Sample Papers
   - CISCE specimen papers
   - Publisher sample papers
   - Mock test series
   - Self-evaluation

3. Weak Area Focus
   - Identify problem topics
   - Extra practice on weak areas
   - Conceptual clarity
   - Teacher consultation

**Month 7: Intensive Revision**
1. Complete Syllabus Revision
   - Subject-wise quick revision
   - Formula and concept sheets
   - Important questions
   - Short notes review

2. Mock Tests (Weekly)
   - Full syllabus tests
   - Timed practice
   - Performance analysis
   - Strategy improvement

**Month 8: Final Preparation**
1. Last Month Strategy
   - Light revision (no new topics)
   - Previous years (last 5 years again)
   - Important questions focus
   - Formula/concept revision

2. Exam Technique
   - Time management per question
   - Question selection strategy
   - Presentation & handwriting
   - Stress management techniques

3. Health & Wellness
   - Proper sleep schedule
   - Regular exercise
   - Healthy diet
   - Relaxation techniques

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**📖 Key Resources:**
✅ Selina Publishers (All subjects)
✅ ICSE Specimen Papers (CISCE website)
✅ Oswaal/Arihant Sample Papers
✅ Previous 10 years question papers
✅ S. Chand/Frank Brothers reference books
✅ YouTube channels (ICSE focused)

**🎯 Subject-wise Study Hours (Daily):**
📌 Mathematics: 1.5 hours
📌 Science: 1.5 hours
📌 English: 1 hour
📌 Social Studies: 1 hour
📌 Second Language: 1 hour
📌 Revision: 1 hour
**Total: 7 hours/day**

**🎯 Success Tips:**
✅ Maintain a study timetable
✅ Take 10-min breaks every hour
✅ Practice writing answers (timed)
✅ Make subject-wise short notes
✅ Revise weekly, not just before exams
✅ Sleep 7-8 hours daily
✅ Stay positive and confident

**📅 Exam Strategy:**
✅ Read questions carefully (twice)
✅ Attempt known questions first
✅ Allocate time per question
✅ Write neat and legible
✅ Draw diagrams with pencil & ruler
✅ Review answers (5-10 min at end)
✅ Don't panic if question is difficult

**💪 Remember:**
- ICSE exams test understanding, not memorization
- Focus on concepts, not rote learning
- Practice is key for Math & Science
- Read literature books multiple times
- Map work is important in Geography

**🎉 You've got this! Need help with specific subjects? Just ask!**`;
  }

  if (exam.includes('12th CBSE') || exam.includes('12th Board')) {
    return `📝 **12th Board Exam - Complete Preparation Roadmap**

Strategic 10-month preparation plan for 12th boards!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**📚 10-Month Study Plan**

**Month 1-3: Foundation Phase**
1. Core Subjects Deep Dive
2. NCERT Mastery (Complete)
3. Chapter-wise notes
4. Formula sheets

**Month 4-6: Practice Phase**
1. Previous Years (15 years)
2. Sample Papers (50+)
3. Numerical Problems
4. Theory Questions

**Month 7-8: Intensive Revision**
1. Complete syllabus revision (twice)
2. Mock tests (weekly)
3. Weak area focus
4. Speed practice

**Month 9-10: Final Preparation**
1. Important questions only
2. Quick revision notes
3. Formula sheets memorization
4. Exam strategy refinement

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**📖 Resources:**
✅ NCERT Textbooks (primary)
✅ NCERT Exemplar
✅ Previous 15 years papers
✅ Oswaal/Arihant sample papers
✅ Reference books (if needed)

**🎯 Success Tips:**
✅ NCERT is Bible - master it
✅ Solve numericals daily
✅ Practice graph/diagram drawing
✅ Time management crucial
✅ Board pattern understanding

**💪 Target: 90%+ Score!**`;
  }

  // Generic board exam roadmap
  return `📝 **${exam} - Board Exam Preparation Roadmap**

Complete preparation strategy for board exams!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**📚 Study Plan**

**Phase 1: Foundation (3 months)**
- Complete syllabus coverage
- Textbook mastery
- Concept clarity

**Phase 2: Practice (3 months)**
- Previous year papers
- Sample papers
- Mock tests

**Phase 3: Revision (2 months)**
- Complete syllabus revision
- Important questions
- Quick notes review

**Phase 4: Final Prep (1 month)**
- Light revision
- Exam strategy
- Confidence building

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**🎯 Success Tips:**
✅ Consistent daily study
✅ Proper time management
✅ Regular revision
✅ Practice writing
✅ Stay healthy

**💪 You can ace this! Ask for subject-specific help!**`;
};

// ✅ NEW: Competitive Exam Roadmap Generator
const generateCompetitiveExamRoadmap = (exam: string): string => {
  if (exam.includes('JEE')) {
    return `🎯 **JEE Main & Advanced - Complete Preparation Roadmap**

Comprehensive 1-year strategy to crack JEE!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**📅 12-Month Preparation Plan**

**Month 1-3: Foundation Phase**

**Physics:**
1. Mechanics
   - Kinematics & Dynamics
   - Work, Energy & Power
   - Rotational Motion
   - Gravitation

2. Heat & Thermodynamics
   - Heat Transfer
   - Laws of Thermodynamics
   - Kinetic Theory

**Chemistry:**
1. Physical Chemistry
   - Atomic Structure
   - Chemical Bonding
   - Mole Concept
   - States of Matter

2. Inorganic Chemistry Basics
   - Periodic Table
   - Chemical Reactions
   - s-block elements

**Mathematics:**
1. Algebra
   - Complex Numbers
   - Quadratic Equations
   - Sequences & Series
   - Binomial Theorem

2. Coordinate Geometry Basics
   - Straight Lines
   - Circles

**Month 4-6: Advanced Concepts**

**Physics:**
1. Electrodynamics
   - Electrostatics
   - Current Electricity
   - Magnetism
   - Electromagnetic Induction

2. Optics & Modern Physics
   - Ray Optics
   - Wave Optics
   - Dual Nature
   - Atoms & Nuclei

**Chemistry:**
1. Organic Chemistry
   - Hydrocarbons
   - Haloalkanes
   - Alcohols & Phenols
   - Aldehydes & Ketones

2. Inorganic (Advanced)
   - d & f block
   - Coordination Compounds
   - Metallurgy

**Mathematics:**
1. Calculus
   - Limits & Continuity
   - Differentiation
   - Integration
   - Differential Equations

2. Vector & 3D Geometry
   - Vectors
   - 3D Coordinate System
   - Planes & Lines

**Month 7-9: Problem Solving & Application**

1. Topic-wise Advanced Problems
   - JEE Main level (1000+)
   - JEE Advanced level (500+)
   - Olympiad level (100+)

2. Formula Sheets & Short Tricks
   - Physics formulas
   - Chemistry reactions
   - Math formulas & theorems

3. Mock Tests (Weekly)
   - Full syllabus tests
   - Chapter tests
   - Time management practice

**Month 10-11: Previous Years & Mocks**

1. JEE Main Papers (2015-2024)
   - All shifts solved
   - Pattern analysis
   - Topic-wise classification

2. JEE Advanced Papers (2010-2024)
   - Paper 1 & 2
   - Detailed solutions
   - Error analysis

3. Mock Test Series
   - 20+ Full-length JEE Main
   - 15+ Full-length JEE Advanced
   - Performance tracking

**Month 12: Final Preparation**

1. Revision Strategy
   - Formula sheets (daily)
   - Important questions only
   - Previous years (recent 3 years)
   - Error log review

2. Exam Day Strategy
   - Time allocation per question
   - Question selection technique
   - Guessing strategy (JEE Main)
   - Stress management

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**📖 Best Books:**

**Physics:**
✅ NCERT (11th & 12th)
✅ H.C. Verma (Concepts of Physics)
✅ D.C. Pandey (Understanding Physics)
✅ I.E. Irodov (for JEE Advanced)

**Chemistry:**
✅ NCERT (11th & 12th)
✅ O.P. Tandon (Physical Chemistry)
✅ Morrison & Boyd (Organic Chemistry)
✅ J.D. Lee (Inorganic Chemistry)

**Mathematics:**
✅ NCERT (11th & 12th)
✅ R.D. Sharma
✅ Cengage Series (G. Tewani)
✅ TMH (Tata McGraw Hill)

**🎯 Daily Study Schedule:**
📌 Physics: 3 hours
📌 Chemistry: 3 hours
📌 Mathematics: 3 hours
📌 Revision: 1 hour
📌 Mock Test/Analysis: 1 hour
**Total: 11 hours/day**

**🎯 Success Tips:**
✅ NCERT is the foundation - master it first
✅ Solve numerical daily (minimum 20)
✅ Revise formulas before sleeping
✅ Analyze every mock test
✅ Focus on weak topics weekly
✅ Join online test series
✅ Doubt clearing is crucial
✅ Stay physically active
✅ 7-8 hours sleep mandatory

**📊 Target Score:**
🎯 JEE Main: 250+ (99+ percentile)
🎯 JEE Advanced: 200+ (for top IITs)

**💪 Remember:**
- Consistency > Intensity
- Conceptual clarity > Rote learning
- Practice > Theory
- Speed + Accuracy = Success

**🎉 IIT is achievable! Need subject-specific help? Ask me!**`;
  }

  if (exam.includes('NEET')) {
    return `🩺 **NEET - Complete Preparation Roadmap**

Comprehensive strategy to crack NEET!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**📅 12-Month Preparation Plan**

**Month 1-4: Foundation Phase**

**Biology (Priority #1)**
1. Botany
   - Plant Physiology
   - Plant Reproduction
   - Genetics & Evolution
   - Biotechnology

2. Zoology
   - Human Physiology
   - Reproduction
   - Ecology & Environment
   - Animal Diversity

**Physics**
1. Mechanics & Properties
2. Optics & Modern Physics
3. Electricity & Magnetism
4. Thermodynamics

**Chemistry**
1. Physical Chemistry basics
2. Organic Chemistry foundations
3. Inorganic Chemistry (NCERT)

**Month 5-8: Advanced Phase**
1. Advanced Biology topics
2. Difficult chapters (Genetics, Evolution)
3. Human Anatomy (detailed)
4. Physics numericals mastery
5. Organic reactions & mechanisms
6. Inorganic chemistry completion

**Month 9-11: Practice & Mocks**
1. NEET Previous Years (2015-2024)
2. Mock Test Series (50+)
3. Chapter-wise tests
4. Speed & accuracy improvement
5. Biology MCQs practice (5000+)

**Month 12: Final Preparation**
1. Biology revision (priority)
2. Important topics only
3. Formula sheets
4. Previous 5 years again
5. Exam strategy

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**📖 Best Books:**
✅ NCERT (11th & 12th) - Biology is Bible
✅ Trueman's Biology
✅ H.C. Verma (Physics)
✅ Morrison & Boyd (Organic)
✅ NCERT Exemplar

**🎯 Daily Study Hours:**
📌 Biology: 5 hours (50% weightage)
📌 Physics: 2.5 hours
📌 Chemistry: 2.5 hours
**Total: 10 hours/day**

**🎯 Success Strategy:**
✅ Biology is 50% - master it first
✅ Diagrams practice daily
✅ Memorize all reactions
✅ NCERT is enough (read 3 times)
✅ Solve 100 MCQs daily
✅ Speed matters (3.5 hours for 180 Q)

**📊 Target Score:**
🎯 NEET: 650+ (for top medical colleges)

**💪 You can do this! Biology doubts? Ask me!**`;
  }

  if (exam.includes('GATE')) {
    return `💻 **GATE - Complete Preparation Roadmap**

Strategic plan to crack GATE with top rank!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**📅 8-Month Preparation Plan**

**Month 1-2: Core Subjects Foundation**
1. Engineering Mathematics
2. Digital Logic
3. Computer Organization
4. Programming & Data Structures

**Month 3-4: Advanced Subjects**
1. Algorithms
2. Operating Systems
3. Database Management
4. Computer Networks

**Month 5-6: Theory Subjects**
1. Theory of Computation
2. Compiler Design
3. Software Engineering
4. Web Technologies

**Month 7: Practice Phase**
1. Previous Years (15 years)
2. Standard books problems
3. Mock test series
4. Weak area focus

**Month 8: Final Preparation**
1. Quick revision
2. Formula sheets
3. Previous years (recent 5)
4. Exam strategy

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**📖 Best Resources:**
✅ Previous 20 years papers
✅ Made Easy/ACE notes
✅ Cormen (Algorithms)
✅ Tanenbaum (OS, Networks)
✅ Ullman (Compilers)

**🎯 Success Tips:**
✅ Previous years are gold
✅ Practice MCQs daily
✅ Revision is key
✅ Mock tests mandatory
✅ Formulas memorization

**📊 Target: 60+ marks (Top 100 AIR)

**💪 GATE is your gateway! Ask doubts!**`;
  }

  // Generic competitive exam
  return `🎯 **${exam} - Preparation Roadmap**

Strategic plan to ace ${exam}!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Study Plan:**

**Phase 1: Foundation (3-4 months)**
- Complete syllabus coverage
- NCERT/Standard books
- Concept clarity

**Phase 2: Practice (3-4 months)**
- Previous year papers
- Mock tests
- Topic-wise practice

**Phase 3: Revision (2 months)**
- Complete revision
- Important topics focus
- Speed improvement

**Phase 4: Final Prep (1 month)**
- Recent previous years
- Formula sheets
- Exam strategy

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**🎯 Success Tips:**
✅ Consistent daily study
✅ Previous years are important
✅ Mock tests regularly
✅ Revision weekly
✅ Stay motivated

**💪 You can crack this! Need specific help? Ask!**`;
};

// Tech Company Interview Preparation (existing - keep as is)
const generateTechCompanyRoadmap = (company: string): string => {
  return `🎯 **${company} - Complete Interview Preparation Roadmap**

I've created a comprehensive preparation plan for cracking ${company} interviews!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**📅 8-Week Preparation Plan**

**Week 1-2: Foundation & Data Structures**
1. Arrays & Strings
   - Two pointers technique
   - Sliding window problems
   - String manipulation

2. Linked Lists
   - Reversal techniques
   - Cycle detection
   - Merge operations

3. Stacks & Queues
   - Implementation
   - Applications
   - Monotonic stack/queue

**Week 3-4: Advanced Data Structures**
1. Trees & Binary Search Trees
   - Traversals (inorder, preorder, postorder)
   - BST operations
   - Tree construction

2. Graphs
   - DFS & BFS
   - Shortest path algorithms
   - Topological sorting

3. Heaps & Priority Queues
   - Min/Max heap
   - Heap sort
   - Top K problems

**Week 5: Algorithms & Problem Solving**
1. Sorting & Searching
   - Quick sort, Merge sort
   - Binary search variations
   - Two pointer technique

2. Dynamic Programming
   - 1D DP problems
   - 2D DP problems
   - Optimization techniques

3. Greedy Algorithms
   - Activity selection
   - Interval problems
   - Huffman coding

**Week 6: System Design Fundamentals**
1. Scalability Concepts
   - Load balancing
   - Caching strategies
   - Database sharding

2. Common System Designs
   - URL shortener
   - Design Twitter/Facebook
   - Design messaging system

3. ${company}-Specific Systems
   ${getCompanySpecificSystems(company)}

**Week 7: Behavioral & Company Research**
1. STAR Method Preparation
   - Leadership examples
   - Conflict resolution
   - Project achievements

2. ${company} Culture & Values
   ${getCompanyValues(company)}

3. Mock Interviews
   - Practice with peers
   - Record yourself
   - Get feedback

**Week 8: Final Preparation**
1. Top 50 LeetCode Problems
   - Company-specific questions
   - High-frequency problems
   - Time complexity optimization

2. Mock Interviews
   - Technical rounds (3-4)
   - System design (2)
   - Behavioral (2)

3. Revision & Rest
   - Review weak areas
   - Light practice
   - Mental preparation

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**📚 Key Resources:**
✅ LeetCode Premium (${company} tagged questions)
✅ "Cracking the Coding Interview" book
✅ System Design Interview by Alex Xu
✅ ${company}'s engineering blog
✅ Glassdoor interview experiences

**🎯 Success Tips:**
✅ Solve 2-3 problems daily (minimum)
✅ Focus on understanding, not memorizing
✅ Practice explaining your approach aloud
✅ Review ${company}'s recent projects/products
✅ Network with current employees (LinkedIn)

**💪 You've got this! Need help with any specific topic? Just ask!**`;
};

// Finance Company Roadmap (existing - keep as is)
const generateFinanceCompanyRoadmap = (company: string): string => {
  return `💼 **${company} - Complete Interview Preparation Roadmap**

Comprehensive preparation plan for ${company} roles!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**📅 10-Week Preparation Plan**

**Week 1-2: Financial Fundamentals**
1. Financial Markets
2. Corporate Finance
3. Investment Banking Basics
4. Trading & Risk Management

**Week 3-4: Quantitative Skills**
1. Mental Math & Calculations
2. Probability & Statistics
3. Financial Modeling
4. Valuation Techniques

**Week 5-6: Technical Knowledge**
1. Accounting Principles
2. Financial Statements Analysis
3. Derivatives & Options
4. Portfolio Management

**Week 7-8: Case Studies & Brainteasers**
1. Market Sizing
2. Investment Analysis
3. M&A Case Studies
4. Consulting-style Questions

**Week 9: Behavioral & Fit**
1. STAR Method Stories
2. ${company} Culture Fit
3. Why Finance? Why ${company}?
4. Career Goals

**Week 10: Mock Interviews & Polish**
1. Technical Rounds (3-4)
2. Case Interviews (2-3)
3. Behavioral (2)
4. Final Revision

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**📚 Resources:**
✅ Wall Street Prep courses
✅ CapitalIQ/Bloomberg Terminal practice
✅ Vault Finance guides
✅ ${company} annual reports

**🎯 Need specific help? Ask me!**`;
};

// Certification Roadmap (existing - keep with CCNA example)
const generateCertificationRoadmap = (cert: string): string => {
  if (cert.includes('CCNA')) {
    return `🎓 **${cert} - Complete Certification Roadmap**

8-week structured plan to pass CCNA exam!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Week 1: Network Fundamentals**
1. OSI Model & TCP/IP Model
2. Network Topologies & Architectures
3. IP Addressing & Subnetting
4. Binary/Hex Conversion

**Week 2: Ethernet & Switching**
1. Ethernet Technology
2. Switch Operations & MAC Tables
3. VLANs Configuration
4. Trunking & Inter-VLAN Routing

**Week 3: Routing Fundamentals**
1. Static Routing Configuration
2. Dynamic Routing Protocols
3. RIP & EIGRP
4. OSPF Single-Area

**Week 4: IP Services**
1. DHCP & DNS
2. NAT & PAT Configuration
3. Access Control Lists (ACLs)
4. SNMP & Syslog

**Week 5: Network Security**
1. Security Fundamentals
2. AAA & RADIUS/TACACS+
3. VPNs & IPSec
4. Zone-Based Firewall

**Week 6: Wireless Networking**
1. WLAN Standards & Frequencies
2. Wireless Security (WPA2/WPA3)
3. Controller vs Autonomous APs
4. FlexConnect & Roaming

**Week 7: Automation & Programmability**
1. Network Automation Basics
2. REST APIs & RESTCONF
3. JSON & YAML
4. Python for Network Engineers

**Week 8: Practice & Review**
1. Packet Tracer Labs (20+)
2. Practice Exams (Boson)
3. Weak Area Review
4. Exam Strategy

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**📚 Study Materials:**
✅ Official Cert Guide (OCG)
✅ Cisco Networking Academy
✅ Jeremy's IT Lab (YouTube)
✅ Packet Tracer (free simulator)
✅ Boson Practice Exams

**🎯 Exam Tips:**
✅ 120 minutes, 100-120 questions
✅ Passing score: ~825/1000
✅ Focus on hands-on labs
✅ Time management crucial
✅ Read questions carefully

**💪 Ready to start? Ask me about any topic!**`;
  }

  // AWS Certification
  if (cert.includes('AWS')) {
    return `☁️ **${cert} - AWS Certification Roadmap**

Complete guide to AWS certification success!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Week 1-2: AWS Fundamentals**
1. Cloud Computing Basics
2. AWS Global Infrastructure
3. IAM & Security Fundamentals
4. Billing & Cost Management

**Week 3-4: Core Services**
1. EC2 (Compute)
2. S3 (Storage)
3. RDS & DynamoDB (Databases)
4. VPC (Networking)

**Week 5-6: Advanced Services**
1. Lambda & Serverless
2. ECS & EKS (Containers)
3. CloudFormation (IaC)
4. CloudWatch (Monitoring)

**Week 7-8: Practice & Review**
1. Hands-on Labs (50+)
2. Practice Exams
3. Whitepapers Review
4. Weak Areas

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**📚 Resources:**
✅ AWS Training & Certification
✅ A Cloud Guru courses
✅ AWS Free Tier (hands-on)
✅ Practice exams (Tutorials Dojo)

**🎯 Ready to learn? Ask specific questions!**`;
  }

  return `🎓 **${cert} - Certification Roadmap**

Structured plan to pass ${cert}!

**8-Week Plan:**
- Weeks 1-2: Fundamentals
- Weeks 3-4: Core Topics
- Weeks 5-6: Advanced Concepts
- Weeks 7-8: Practice & Review

**Resources:** Official guides, practice exams, hands-on labs

**💪 Ask me for detailed breakdown!**`;
};

// Technical Skill Roadmap (existing - keep as is)
const generateTechnicalSkillRoadmap = (skill: string): string => {
  return `🚀 **${skill} - Complete Learning Roadmap**

Master ${skill} with this structured path!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Week 1-2: Foundations**
1. Core Concepts & Syntax
2. Basic Operations
3. Simple Projects
4. Best Practices

**Week 3-4: Intermediate**
1. Advanced Features
2. Common Patterns
3. Real-world Applications
4. Mini Projects

**Week 5-6: Advanced**
1. Complex Scenarios
2. Optimization Techniques
3. Production Practices
4. Major Project

**Week 7-8: Mastery**
1. Expert-level Concepts
2. System Design
3. Portfolio Projects
4. Interview Prep

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**📚 Resources:**
✅ Official Documentation
✅ Online Courses (Udemy/Coursera)
✅ Practice Platforms
✅ Community Forums

**💪 Let's start learning! What topic first?**`;
};

// Helper functions (keep existing)
const getCompanySpecificSystems = (company: string): string => {
  const systems: { [key: string]: string } = {
    'Google': '- Google Search architecture\n      - YouTube streaming\n      - Gmail infrastructure',
    'Amazon': '- Amazon.com product catalog\n      - AWS services\n      - Order management system',
    'Microsoft': '- Azure cloud services\n      - Office 365 architecture\n      - Windows ecosystem',
    'Facebook/Meta': '- News feed algorithm\n      - Instagram photo storage\n      - WhatsApp messaging',
    'Cisco': '- Network management systems\n      - Router/Switch architecture\n      - WebEx infrastructure',
  };
  return systems[company] || '- Distributed systems\n      - Microservices\n      - API design';
};

const getCompanyValues = (company: string): string => {
  const values: { [key: string]: string } = {
    'Google': '- Innovation & moonshot thinking\n      - User-first approach\n      - Technical excellence',
    'Amazon': '- Customer obsession\n      - Leadership principles (14)\n      - Ownership mentality',
    'Microsoft': '- Growth mindset\n      - Diversity & inclusion\n      - Innovation culture',
    'Cisco': '- Networking expertise\n      - Customer success\n      - Innovation in infrastructure',
  };
  return values[company] || '- Team collaboration\n      - Technical excellence\n      - Growth mindset';
};

const generateGeneralRoadmap = (): string => {
  return `🎯 **Software Engineering - General Preparation Roadmap**

Complete guide for software engineering roles!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Week 1-4: Data Structures & Algorithms**
**Week 5-6: System Design**
**Week 7: Behavioral Prep**
**Week 8: Mock Interviews**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**💪 Specify a company/exam for customized roadmap!**

**Examples:**
- "10th ICSE board exam roadmap"
- "JEE Main preparation roadmap"
- "Google interview roadmap"
- "CCNA certification roadmap"`;
};

// Generate smart mock response
const generateSmartMockResponse = (message: string, conversationHistory: Message[]): string => {
  // If asking for roadmap - DETECT & GENERATE
  if (isRoadmapRequest(message)) {
    const detection = detectCompanyOrExam(message);
    console.log(`🗺️ Detected: ${detection.name} (${detection.type}, ${detection.category})`);
    return generateDynamicRoadmap(detection);
  }
  
  // Regular conversation
  const responses = [
    `Great question! I'm here to help you succeed. 

**I can create roadmaps for:**
📌 **School Exams:** 10th/12th ICSE, CBSE boards
📌 **Competitive Exams:** JEE, NEET, GATE, CAT
📌 **Tech Companies:** Google, Amazon, Microsoft
📌 **Certifications:** CCNA, AWS, Azure
📌 **Skills:** Python, Java, DSA, Web Development

**Just ask:** "10th ICSE board exam preparation roadmap"

What would you like to prepare for?`,

    `I'm your personal study assistant! 

**Popular requests:**
🎯 "10th ICSE board exam roadmap"
🎯 "JEE Main preparation roadmap"
🎯 "Google interview roadmap"
🎯 "CCNA certification roadmap"
🎯 "Python learning roadmap"

Ask me anything specific or request a roadmap!`,
  ];

  return responses[Math.floor(Math.random() * responses.length)];
};

export const getChatResponse = async (
  message: string,
  conversationHistory: Message[]
): Promise<string> => {
  try {
    if (USE_MOCK_AI) {
      console.log('🤖 [MOCK MODE] Generating smart response');
      await new Promise(resolve => setTimeout(resolve, 1000));
      return generateSmartMockResponse(message, conversationHistory);
    }

    // Real OpenAI API (if USE_MOCK_AI = false)
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('OpenAI API key not configured');

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an AI study assistant specialized in creating detailed roadmaps for school exams, competitive exams, certifications, and technical interviews.',
          },
          ...conversationHistory,
          { role: 'user', content: message },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    return generateSmartMockResponse(message, conversationHistory);
  }
};