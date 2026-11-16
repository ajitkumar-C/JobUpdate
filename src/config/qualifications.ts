export interface RecurringExam {
  examName: string;
  conductingBody: string;
  typicalMonth: string;
  approxVacancies: string;
  selectionMode: string;
  officialPortal: string;
}

export interface SalaryBreakdown {
  postRole: string;
  payLevel: string;
  basicPay: string;
  inHandSalary: string;
  allowances: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface QualificationConfig {
  id: '10th-pass' | '12th-pass' | 'graduate';
  slug: string;
  name: string;
  shortName: string;
  qualificationLevel: string;
  heroTitle: string;
  heroSubtitle: string;
  introSnippet: string;
  badge: string;
  regex: RegExp;
  recurringExams: RecurringExam[];
  salaryMatrix: SalaryBreakdown[];
  ageCriteria: {
    minAge: string;
    maxAge: string;
    relaxations: string;
    crucialDateNote: string;
  };
  selectionOverview: string[];
  faqs: FAQItem[];
}

export const QUALIFICATIONS_CONFIG: Record<string, QualificationConfig> = {
  '10th-pass': {
    id: '10th-pass',
    slug: '10th-pass',
    name: '10th Pass Govt Jobs 2026',
    shortName: '10th Pass',
    qualificationLevel: 'Matriculation / Class 10 (Secondary Examination)',
    heroTitle: '10th Pass Govt Jobs 2026: Matric / High School Sarkari Naukri Vacancies',
    heroSubtitle: 'Complete roadmap of central and state government jobs for 10th pass candidates. Explore active vacancies, the annual recurring exam calendar, 7th CPC salary slips, and age relaxation rules.',
    introSnippet: 'Candidates who have passed Class 10 (Matriculation) from any recognized board are eligible for over 100,000+ government vacancies annually across Staff Selection Commission (SSC MTS/Havaldar), Indian Railways (RRC Group D / Level-1), India Post (Gramin Dak Sevak GDS), and Defence Forces (Agniveer GD/Tradesman). In-hand salaries range from ₹22,000 to ₹31,000 per month with complete job security and pension benefits.',
    badge: 'Matriculation Entry',
    regex: /\b(10th|matric|matriculation|high\s*school|highschool|mts|havaldar|gds|gramin dak sevak|group\s*d|agniveer\s*tradesman|safai|peon)\b/i,
    recurringExams: [
      {
        examName: 'SSC MTS & Havaldar',
        conductingBody: 'Staff Selection Commission (SSC)',
        typicalMonth: 'May – July (Annual)',
        approxVacancies: '8,000 – 12,000 Posts',
        selectionMode: 'Computer Based Examination (CBT) only (No Interview)',
        officialPortal: 'https://ssc.gov.in'
      },
      {
        examName: 'India Post Gramin Dak Sevak (GDS)',
        conductingBody: 'Department of Posts (India Post)',
        typicalMonth: 'January & July (Biannual)',
        approxVacancies: '30,000 – 44,000 Posts',
        selectionMode: '10th Board Merit List (Zero Written Exam)',
        officialPortal: 'https://indiapostgdsonline.gov.in'
      },
      {
        examName: 'Railway RRC Group D (Level-1)',
        conductingBody: 'Railway Recruitment Control Board (RRB)',
        typicalMonth: 'As per RRB Annual Calendar',
        approxVacancies: '30,000 – 100,000+ Posts',
        selectionMode: 'CBT Exam + Physical Efficiency Test (PET)',
        officialPortal: 'https://indianrailways.gov.in'
      },
      {
        examName: 'Indian Army Agniveer (General Duty / Tradesman)',
        conductingBody: 'Indian Army',
        typicalMonth: 'Rally Wise Throughout Year',
        approxVacancies: '25,000+ Posts',
        selectionMode: 'Common Entrance Exam (CEE) + Physical Fitness Test',
        officialPortal: 'https://joinindianarmy.nic.in'
      },
      {
        examName: 'State Police Home Guard & Peon / Attendant',
        conductingBody: 'State Police & District Courts',
        typicalMonth: 'Quarterly by State',
        approxVacancies: '15,000+ State Posts',
        selectionMode: 'Written Test / Physical Screening',
        officialPortal: 'https://sarkariavedan.info/state-jobs'
      }
    ],
    salaryMatrix: [
      {
        postRole: 'SSC Multi-Tasking Staff (MTS)',
        payLevel: 'Pay Level 1 (7th CPC)',
        basicPay: '₹18,000',
        inHandSalary: '₹26,500 – ₹31,200',
        allowances: 'DA (53%) + HRA (30%/20%/10%) + Transport Allowance'
      },
      {
        postRole: 'Railway Trackman / Helper (Group D)',
        payLevel: 'Pay Level 1 (7th CPC)',
        basicPay: '₹18,000',
        inHandSalary: '₹27,000 – ₹33,500',
        allowances: 'DA + HRA + Risk & Hardship Allowance + Night Duty'
      },
      {
        postRole: 'India Post GDS (Branch Postmaster)',
        payLevel: 'TRCA Slab 2',
        basicPay: '₹12,000',
        inHandSalary: '₹14,500 – ₹17,000',
        allowances: 'Time Related Continuity Allowance (TRCA) + DA'
      },
      {
        postRole: 'Indian Army Agniveer GD (1st Year)',
        payLevel: 'Customized Package',
        basicPay: '₹30,000 (Gross)',
        inHandSalary: '₹21,000 (In-Hand) + ₹9,000 (Corpus)',
        allowances: 'Free Ration + Uniform + High Altitude Allowances'
      }
    ],
    ageCriteria: {
      minAge: '18 Years (17.5 Years for Defence Agniveer)',
      maxAge: '25 to 27 Years for General (up to 33 Years for Railway)',
      relaxations: 'OBC: +3 Years (Max 30 Yrs) | SC/ST: +5 Years (Max 32 Yrs) | PwD: +10 Years',
      crucialDateNote: 'Age is calculated as of the crucial date specified in the official notification (typically 1st January or 1st August of the exam year).'
    },
    selectionOverview: [
      'Written / Computer Based Test (CBT): Covers 4 subjects: General Intelligence & Reasoning, Numerical Aptitude (Maths), General English/Hindi, and General Awareness.',
      'No Interview Rule: Group C and Group D central government posts have zero interview requirement per DoPT guidelines.',
      'Physical Efficiency Test (PET): Only applicable for uniform posts (SSC Havaldar, Railway Group D, Army Agniveer, Police Constables).',
      'Merit-based Selection: India Post GDS selection is prepared purely based on 10th standard percentage marks.'
    ],
    faqs: [
      {
        question: 'Which is the best government job for 10th pass candidates in 2026?',
        answer: 'The most popular central government jobs for 10th pass candidates are SSC MTS & Havaldar and Railway RRC Group D (Level-1). Both offer Pay Level 1 salary (in-hand ₹26,000–₹32,000), central government medical benefits (CGHS), and regular promotion opportunities.'
      },
      {
        question: 'Can I get a government job after 10th without any written exam?',
        answer: 'Yes. India Post Gramin Dak Sevak (GDS) recruitment for Branch Postmaster (BPM) and Assistant Branch Postmaster (ABPM) does not conduct any written examination. Selection is made directly based on candidate 10th class board examination marks.'
      },
      {
        question: 'What is the age limit for 10th pass sarkari naukri?',
        answer: 'The general age limit is 18 to 25 or 27 years. For Railway Group D, the upper age limit for unreserved candidates is 33 years. Reserved categories receive government relaxations: OBC gets 3 years, SC/ST gets 5 years, and PwD candidates get 10 years.'
      },
      {
        question: 'Is ITI mandatory for Railway Group D recruitment 2026?',
        answer: 'For general Level-1 Railway Group D posts, 10th pass from a recognized board is accepted. However, for specific technical departments (Mechanical, Electrical, S&T workshops), an ITI certificate in relevant engineering trades or National Apprenticeship Certificate (NAC) granted by NCVT may be prescribed.'
      },
      {
        question: 'What documents are required to apply for 10th pass government vacancies?',
        answer: 'You will need: Class 10th Passing Certificate & Marksheet (proof of date of birth), Aadhaar Card or Govt Photo ID, Category Certificate (OBC-NCL / SC / ST / EWS if claiming reservation), recent passport-size photograph (20–50 KB), and scanned signature.'
      }
    ]
  },

  '12th-pass': {
    id: '12th-pass',
    slug: '12th-pass',
    name: '12th Pass Govt Jobs 2026',
    shortName: '12th Pass',
    qualificationLevel: 'Intermediate / Higher Secondary (10+2 Standard)',
    heroTitle: '12th Pass Govt Jobs 2026: Intermediate / 10+2 Sarkari Vacancies',
    heroSubtitle: 'Complete hub for all central and state government jobs for 12th pass applicants. Explore active openings, the annual recruitment calendar, SSC CHSL & Police pay scales, and typing test standards.',
    introSnippet: 'Candidates with a 10+2 (Intermediate / Higher Secondary) qualification from Arts, Science, or Commerce streams can apply for premier clerical, administrative, and defence positions across SSC CHSL (Lower Division Clerk / Data Entry Operator), State Police Constables (UP, MP, Bihar, Maharashtra), Railway Undergraduate Posts (Junior Clerk cum Typist), and National Defence Academy (NDA). Monthly in-hand salaries range from ₹28,000 to ₹42,000.',
    badge: 'Intermediate Entry',
    regex: /\b(12th|10\+2|intermediate|inter\s*pass|senior\s*secondary|chsl|stenographer|steno|clerk|ldc|lower\s*division|junior\s*assistant|constable|head\s*constable|nda)\b/i,
    recurringExams: [
      {
        examName: 'SSC Combined Higher Secondary Level (CHSL)',
        conductingBody: 'Staff Selection Commission (SSC)',
        typicalMonth: 'March – May (Annual)',
        approxVacancies: '4,000 – 6,000 Posts',
        selectionMode: 'Tier 1 (CBT) + Tier 2 (CBT + Typing / Skill Test)',
        officialPortal: 'https://ssc.gov.in'
      },
      {
        examName: 'State Police Constable Recruitment',
        conductingBody: 'State Police Recruitment Boards (UPPRPB, CSBC, Maharashtra Police)',
        typicalMonth: 'State-wise (Bi-annual / Annual)',
        approxVacancies: '60,000+ Multi-State Posts',
        selectionMode: 'Written Examination + Physical Standard & Endurance Test (PET/PST)',
        officialPortal: 'https://sarkariavedan.info/state-jobs'
      },
      {
        examName: 'SSC Stenographer (Grade C & D)',
        conductingBody: 'Staff Selection Commission (SSC)',
        typicalMonth: 'July – September (Annual)',
        approxVacancies: '1,500 – 3,500 Posts',
        selectionMode: 'CBT Exam + Shorthand Dictation & Transcription Test',
        officialPortal: 'https://ssc.gov.in'
      },
      {
        examName: 'Railway RRB NTPC (Undergraduate Posts)',
        conductingBody: 'Railway Recruitment Control Board (RRB)',
        typicalMonth: 'Annual RRB Cycle',
        approxVacancies: '3,500 – 10,000 Posts',
        selectionMode: 'CBT 1 + CBT 2 + Computer-Based Typing Skill Test',
        officialPortal: 'https://indianrailways.gov.in'
      },
      {
        examName: 'UPSC National Defence Academy (NDA & NA)',
        conductingBody: 'Union Public Service Commission (UPSC)',
        typicalMonth: 'NDA I (April) & NDA II (September)',
        approxVacancies: '400+ Commissioned Officer Posts',
        selectionMode: 'Written Exam (Maths + GAT) + 5-Day SSB Interview',
        officialPortal: 'https://upsc.gov.in'
      }
    ],
    salaryMatrix: [
      {
        postRole: 'SSC CHSL Data Entry Operator (DEO)',
        payLevel: 'Pay Level 4 (7th CPC)',
        basicPay: '₹25,500',
        inHandSalary: '₹37,500 – ₹43,200',
        allowances: 'DA (53%) + HRA (30%/20%/10%) + Transport Allowance'
      },
      {
        postRole: 'Lower Division Clerk (LDC) / Junior Assistant',
        payLevel: 'Pay Level 2 (7th CPC)',
        basicPay: '₹19,900',
        inHandSalary: '₹29,000 – ₹34,500',
        allowances: 'DA + HRA + Transport Allowance'
      },
      {
        postRole: 'State Police Constable (UP / Maharashtra / MP)',
        payLevel: 'Pay Level 3 (7th CPC)',
        basicPay: '₹21,700',
        inHandSalary: '₹31,500 – ₹36,800',
        allowances: 'Ration Money Allowance + Uniform Allowance + HRA + DA'
      },
      {
        postRole: 'Railway Junior Clerk cum Typist',
        payLevel: 'Pay Level 2 (7th CPC)',
        basicPay: '₹19,900',
        inHandSalary: '₹30,000 – ₹35,000',
        allowances: 'DA + HRA + Free Railway Pass + Medical'
      }
    ],
    ageCriteria: {
      minAge: '18 Years (16.5 Years for UPSC NDA Entry)',
      maxAge: '25 to 27 Years for Central SSC (up to 28–30 for State Police)',
      relaxations: 'OBC: +3 Years | SC/ST: +5 Years | Ex-Servicemen: Military Service + 3 Years',
      crucialDateNote: 'Typically evaluated as of 1st January or 1st August. For state police recruitments, domicile state candidates often receive additional home-state relaxations.'
    },
    selectionOverview: [
      'Two-Tier Examination: SSC CHSL and Railway NTPC use Tier 1 screening followed by Tier 2 merit ranking.',
      'Typing Speed Test: Most 12th pass clerical jobs mandate typing speed: 35 words per minute (wpm) in English or 30 wpm in Hindi on computer.',
      'Shorthand Test: Stenographer Grade D requires 80 wpm transcription, Grade C requires 100 wpm.',
      'Physical Test for Uniformed Posts: Police and Paramilitary Constables require 5 km run (Male: under 24 mins) and 1.6 km run (Female: under 8.5 mins).'
    ],
    faqs: [
      {
        question: 'Which is the highest-paying government job for 12th pass in India?',
        answer: 'SSC CHSL Data Entry Operator (DEO) Grade A in Pay Level 4 (Basic Pay ₹25,500, in-hand ~₹38,000–₹43,000) and commissioned officer entry through UPSC NDA (Officer Cadet stipend ₹56,100) are the highest-paying career paths for 12th-pass candidates.'
      },
      {
        question: 'Can Arts or Commerce 12th pass students apply for SSC CHSL?',
        answer: 'Yes! 12th pass students from any stream (Arts, Commerce, or Science) are eligible for Lower Division Clerk (LDC), Junior Secretariat Assistant (JSA), and general Data Entry Operator positions in SSC CHSL. Only DEO Grade A in the office of Comptroller and Auditor General (C&AG) requires 12th in Science stream with Mathematics.'
      },
      {
        question: 'Is computer diploma (like CCC) compulsory for 12th pass government jobs?',
        answer: 'For Central SSC CHSL, no computer certificate is required; you only need to clear the practical typing speed test. For specific state government clerk recruitments (such as UPSSSC Junior Assistant or High Court Clerks), a CCC certificate from NIELIT or equivalent recognized diploma is mandatory.'
      },
      {
        question: 'What is the physical eligibility for 12th pass Police Constable vacancies?',
        answer: 'General requirements for male candidates: minimum height 168–170 cm, chest 80 cm (expanded to 85 cm), and 5 km run in 24 minutes. For female candidates: minimum height 152–157 cm and 2.4 km run in 14–16 minutes. Reserved categories receive relaxation in height criteria.'
      },
      {
        question: 'What is the syllabus for 12th pass government exams?',
        answer: 'The syllabus generally comprises: 1) English Language & Comprehension, 2) General Intelligence & Reasoning, 3) Quantitative Aptitude (Arithmetic & Basic Algebra), and 4) General Awareness (Current Affairs, History, Polity, Geography, and Basic Science).'
      }
    ]
  },

  'graduate': {
    id: 'graduate',
    slug: 'graduate',
    name: 'Graduate Govt Jobs 2026',
    shortName: 'Graduate',
    qualificationLevel: 'Bachelor\'s Degree (BA / BSc / BCom / BTech / Any Stream)',
    heroTitle: 'Graduate Govt Jobs 2026: Degree Level Sarkari Naukri Vacancies',
    heroSubtitle: 'Gateway to Group B Gazetted & Non-Gazetted Officer careers. Explore SSC CGL, UPSC Civil Services, Bank PO, State PSCs, and Railway NTPC Graduate positions with Level 6–8 pay structures.',
    introSnippet: 'Graduates holding any Bachelor\'s degree from a recognized university can access India\'s most prestigious officer-level government jobs through SSC CGL (Income Tax Inspector, ASO in Central Ministries, GST Inspector), UPSC Civil Services (IAS, IPS, IRS), Banking (SBI PO, IBPS PO), and State Public Service Commissions (MPSC, UPPSC, BPSC). Starting monthly salaries range from ₹55,000 to ₹95,000 with government accommodation, official transport, and high administrative authority.',
    badge: 'Officer & Graduate Entry',
    regex: /\b(graduate|graduation|degree|bachelor|b\.?a\b|b\.?sc\b|b\.?com\b|b\.?tech\b|b\.?e\b|cgl|probationary\s*officer|\bpo\b|inspector|sub\s*inspector|\bsi\b|assistant\s*manager|officer|civil\s*services|upsc|mpsc|uppsc|bpsc)\b/i,
    recurringExams: [
      {
        examName: 'SSC Combined Graduate Level (CGL)',
        conductingBody: 'Staff Selection Commission (SSC)',
        typicalMonth: 'June – August (Annual)',
        approxVacancies: '12,000 – 18,000 Posts',
        selectionMode: 'Tier 1 (Screening CBT) + Tier 2 (Merit CBT + Typing + CPT)',
        officialPortal: 'https://ssc.gov.in'
      },
      {
        examName: 'UPSC Civil Services Examination (CSE)',
        conductingBody: 'Union Public Service Commission (UPSC)',
        typicalMonth: 'February Notification (May Prelims)',
        approxVacancies: '1,000 – 1,200 Officers',
        selectionMode: 'Prelims (GS + CSAT) + Mains (9 Papers) + Personality Test',
        officialPortal: 'https://upsc.gov.in'
      },
      {
        examName: 'IBPS / SBI Probationary Officer (PO)',
        conductingBody: 'Institute of Banking Personnel Selection & SBI',
        typicalMonth: 'August – October (Annual)',
        approxVacancies: '6,000 – 9,000 Officers',
        selectionMode: 'Prelims + Mains (Objective + Descriptive) + Interview',
        officialPortal: 'https://ibps.in'
      },
      {
        examName: 'Railway RRB NTPC (Graduate Posts)',
        conductingBody: 'Railway Recruitment Control Board (RRB)',
        typicalMonth: 'Annual RRB Calendar',
        approxVacancies: '8,000 – 15,000 Posts',
        selectionMode: 'CBT 1 + CBT 2 + CBAT (Aptitude Test for Station Master)',
        officialPortal: 'https://indianrailways.gov.in'
      },
      {
        examName: 'State Public Service Commission (State PCS)',
        conductingBody: 'State Commissions (UPPSC, MPSC, BPSC, RAS)',
        typicalMonth: 'State-wise Annual Cycles',
        approxVacancies: '500 – 1,500 Officers per State',
        selectionMode: 'Prelims + Mains + Interview (Deputy Collector, DSP, BDO)',
        officialPortal: 'https://sarkariavedan.info/state-jobs'
      }
    ],
    salaryMatrix: [
      {
        postRole: 'Assistant Section Officer (ASO) in MEA / CSS',
        payLevel: 'Pay Level 7 (7th CPC)',
        basicPay: '₹44,900',
        inHandSalary: '₹68,000 – ₹78,500',
        allowances: 'DA (53%) + HRA (30% in Delhi) + Transport Allowance + CGHS'
      },
      {
        postRole: 'Inspector of Income Tax / Central GST',
        payLevel: 'Pay Level 7 (7th CPC)',
        basicPay: '₹44,900',
        inHandSalary: '₹68,000 – ₹78,500',
        allowances: 'DA + HRA + Uniform Allowance + Mobile & Petrol Reimbursement'
      },
      {
        postRole: 'State Bank of India Probationary Officer (SBI PO)',
        payLevel: 'Junior Management Grade Scale I',
        basicPay: '₹41,960 (with 4 advance increments)',
        inHandSalary: '₹65,000 – ₹75,000',
        allowances: 'Leased Accommodation (up to ₹30,000) + Petrol + Medical'
      },
      {
        postRole: 'Railway Station Master / Goods Train Manager',
        payLevel: 'Pay Level 6 (7th CPC)',
        basicPay: '₹35,400',
        inHandSalary: '₹55,000 – ₹67,000',
        allowances: 'DA + HRA + Running Mileage Allowance + Night Duty Allowance'
      }
    ],
    ageCriteria: {
      minAge: '20 or 21 Years',
      maxAge: '30 to 32 Years for General (up to 37–40 Years for State PCS)',
      relaxations: 'OBC: +3 Years (Max 35 Yrs) | SC/ST: +5 Years (Max 37 Yrs) | PwD: +10 Years',
      crucialDateNote: 'For SSC CGL and UPSC, candidates must meet the age limit on 1st August of the notification year.'
    },
    selectionOverview: [
      'Multi-Stage Merit: Graduate recruitments feature comprehensive multi-stage screening ensuring meritocracy.',
      'Computer Proficiency & Typing: SSC CGL mandates a qualifying Data Entry Speed Test (DEST) of 2,000 key depressions in 15 minutes.',
      'Aptitude Test for Railway Operations: Candidates for Station Master must pass the Computer Based Aptitude Test (CBAT) with minimum 42 T-score in all batteries.',
      'Interviews: Abolished for non-gazetted Group B posts in SSC CGL; active for Bank PO, UPSC Civil Services, and State PSC executive posts.'
    ],
    faqs: [
      {
        question: 'Can final year graduate students apply for SSC CGL 2026?',
        answer: 'Yes! Final year Bachelor\'s degree students can apply for SSC CGL, provided they acquire their graduation degree / passing certificate on or before the crucial educational cutoff date specified in the official notification.'
      },
      {
        question: 'Is any minimum percentage required in graduation for government jobs?',
        answer: 'For SSC CGL, UPSC Civil Services, and Railway NTPC, there is no minimum percentage requirement; a simple pass from any UGC-recognized university is eligible. Some specialized banking and PSU recruitments (like RBI Grade B or SEBI Grade A) require a minimum of 60% aggregate marks.'
      },
      {
        question: 'Which graduate government job has the highest authority and salary?',
        answer: 'UPSC Civil Services Examination (IAS/IPS/IRS) offers the highest executive authority and starting Pay Level 10 (Basic Pay ₹56,100, in-hand ₹90,000+). In the non-UPSC sphere, SSC CGL Assistant Section Officer (ASO) in the Ministry of External Affairs (MEA) with foreign postings provides prestigious international postings and diplomatic privileges.'
      },
      {
        question: 'Can B.Tech and Engineering graduates apply for SSC CGL and Bank PO?',
        answer: 'Absolutely! Engineering graduates (B.E. / B.Tech) are fully eligible for all general graduate recruitments including SSC CGL, Bank PO, UPSC, and Railway NTPC. In fact, engineering graduates represent a large proportion of successful candidates in SSC CGL and banking exams.'
      },
      {
        question: 'What is the exam pattern of SSC CGL 2026?',
        answer: 'SSC CGL consists of: Tier 1 (100 questions, 200 marks, 60 minutes covering Reasoning, General Awareness, Quantitative Aptitude, and English Comprehension) and Tier 2 (Section 1: Maths & Reasoning; Section 2: English & General Awareness; Section 3: Computer Knowledge Module + Typing Test). Merit list is prepared exclusively from Tier 2 scores.'
      }
    ]
  }
};
