/**
 * src/data/blog.ts
 * 
 * Static database containing rich, SEO-optimized career articles for the Blog section.
 * Each article meets the 100 to 1000 word count criteria and covers specified domains.
 */

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string; // Markdown format content
  category: 'Defense' | 'Exams' | 'Career Guide';
  author: string;
  publishedDate: string;
  readTime: string;
  keywords: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'indian-defense-careers-after-10th-12th',
    title: 'Comprehensive Guide to Indian Defense Careers After 10th and 12th',
    summary: 'Explore career entry schemes in the Indian Army, Navy, and Air Force after completing 10th or 12th. Learn about NDA, Agniveer, and Technical Entry Schemes.',
    category: 'Defense',
    author: 'Sarkari Aavedan Editorial Team',
    publishedDate: '2026-08-15',
    readTime: '6 min read',
    keywords: ['Indian Army', 'Navy', 'Air Force', 'NDA Entry', 'Agniveer recruitment', '10th 12th defense jobs'],
    content: `## Careers in the Indian Armed Forces

Serving in the Indian Armed Forces—comprising the **Indian Army, Indian Navy, and Indian Air Force**—is one of the most prestigious career paths in India. It offers job security, an adventurous lifestyle, and a profound sense of patriotism. Opportunities are available immediately after completing the 10th or 12th standards.

---

### 1. Career Opportunities After 10th Standard (Agniveer Schemes)

Under the **Agniveer (Agnipath) Recruitment Scheme**, young candidates can join the defense forces directly after high school for a 4-year tenure, with 25% of the batch selected for permanent service.

#### A. Indian Army (Agniveer GD & Tradesmen)
- **Agniveer General Duty (GD):** Requires a 10th pass with minimum 45% aggregate marks. Candidates must meet the physical height, chest, and weight criteria specific to their state.
- **Agniveer Tradesmen (10th Pass):** Offers support roles such as Chef, Steward, Dresser, and Artisan. Requires simple matriculation pass without strict percentage cutoffs.

#### B. Indian Navy (Agniveer MR)
- **Musician & Steward/Chef/Hygienist (Matric Recruit - MR):** Recruits are responsible for preparing food, managing mess halls, maintaining hygiene standards on board, or joining naval bands. Simple 10th pass qualification is required.

---

### 2. Career Opportunities After 12th Standard

Completing 12th standard (especially with Physics, Chemistry, and Mathematics - PCM) unlocks premium officer-level entry schemes.

#### A. National Defence Academy (NDA)
The NDA exam, conducted twice a year by the **Union Public Service Commission (UPSC)**, is the premier officer entry point.
- **Eligibility:** 12th pass (Any stream for Army; PCM mandatory for Air Force and Navy). Open to candidates aged 16.5 to 19.5 years.
- **Selection Process:** Written Examination (Mathematics + General Ability Test) followed by a 5-day Service Selection Board (SSB) Interview and Medical Examination.

#### B. 10+2 Technical Entry Scheme (TES) - Army & Navy
Candidates who want to become engineers in the military can apply without a written exam based on their academic scores.
- **Eligibility:** 12th PCM pass with minimum 60% aggregate. Candidates must also have appeared in the **JEE Main** exam.
- **Selection:** Direct shortlisting for SSB interviews based on cut-off percentages. Selected candidates undergo a 4-year B.Tech training program at military colleges.

#### C. Air Force Agniveer Vayu (Science & Non-Science)
- **Science Subjects (formerly Group X):** Requires 12th pass with PCM and English (min 50% marks). Offers technical technician roles.
- **Other than Science (formerly Group Y):** Requires 12th pass in any stream (min 50% marks). Offers admin, accounts, and police duties.

---

### 💡 Strategy to Crack Defense Exams
1. **Physical Fitness:** Start running (1.6 km under 6 minutes), practice pushups, pullups, and maintain a body mass index (BMI) within normal ranges.
2. **Written Preparation:** For NDA, build a strong foundation in 11th and 12th Class Mathematics, English grammar, and General Knowledge (History, Geography, and current events).
3. **SSB Interview Preparation:** Focus on communication skills, logical reasoning, and developing Officer Like Qualities (OLQs) such as leadership, cooperation, and courage.`
  },
  {
    id: 'government-jobs-competitive-exams-after-12th',
    title: 'Top Government Jobs & Competitive Exams to Crack After 12th Science & Arts',
    summary: 'A detailed breakdown of popular non-defense government job entries like SSC CHSL, Railway Group D, and State Police constables after completing 12th.',
    category: 'Career Guide',
    author: 'Sarkari Aavedan Editorial Team',
    publishedDate: '2026-08-14',
    readTime: '5 min read',
    keywords: ['Govt jobs after 12th', 'SSC CHSL', 'Railway Group D', 'Police Constable exam', 'Competitive exams guide'],
    content: `## Government Job Sectors After 12th

For students who do not want to pursue long-term degree courses immediately after school, the government sector offers many entry-level administrative, clerk, and field job roles. These posts are filled through competitive national and state examinations.

---

### 1. Staff Selection Commission (SSC) Entries

The SSC is the main recruiting agency for central government ministries and departments.

#### A. SSC Combined Higher Secondary Level (CHSL)
- **Posts Offered:** Lower Divisional Clerk (LDC), Junior Secretariat Assistant (JSA), and Data Entry Operators (DEO).
- **Eligibility:** 12th standard pass (Any stream).
- **Exam Pattern:** Two tiers of computerized examinations testing English Language, Quantitative Aptitude, General Intelligence (Reasoning), and General Awareness, followed by a typing skill test.

#### B. SSC Multi-Tasking Staff (MTS) & Havaldar
- **Posts Offered:** Support staff in central offices and Havaldars in Customs/GST departments.
- **Eligibility:** 10th or 12th pass.
- **Benefits:** An excellent stepping stone to enter central services with departmental promotion opportunities.

---

### 2. Railway Recruitment Board (RRB) Entries

The Indian Railways is one of the largest employers in the world, offering robust benefits and medical facilities.

#### A. RRB Group D (Level 1)
- **Posts:** Track Maintainer, Assistants in Electrical, Mechanical, and Signal departments.
- **Eligibility:** 10th pass or ITI certificate.
- **Exam Pattern:** Single-stage Computer Based Test (CBT) followed by a Physical Efficiency Test (PET).

#### B. RRB NTPC (Undergraduate Categories)
- **Posts:** Junior Clerk cum Typist, Accounts Clerk, Trains Clerk, and Commercial cum Ticket Clerk.
- **Eligibility:** 12th pass with minimum 50% marks.
- **Exam:** Two stages of written tests testing arithmetic ability and general knowledge.

---

### 3. State Police Constable Recruitments

Every state government conducts annual recruitment drives to fill thousands of vacancies in their police departments.
- **Examples:** Maharashtra Police Bharti, Uttar Pradesh Police Constable, Bihar Police, and Delhi Police.
- **Eligibility:** 12th pass, age between 18 and 25 (with relaxations for reserved categories).
- **Selection:** Consists of physical performance tests (running, long jump, shot put) and a written objective exam on local language, reasoning, and basic mathematics.

---

### 📈 Actionable Study Blueprint
- **Quantitative Aptitude:** Focus on arithmetic topics like Percentages, Profit & Loss, Ratio & Proportion, and Simple Interest.
- **General Awareness:** Read daily current affairs booklets, and build a basic knowledge of Indian Polity, History, and Geography.
- **Practice Mock Tests:** Solve at least 20 previous years' question papers under timed conditions to improve speed and accuracy.`
  },
  {
    id: 'neet-gate-preparation-strategy-opportunities',
    title: 'NEET & GATE Exam Preparation: Actionable Success Strategy & Opportunities',
    summary: 'Learn the exact preparation roadmap, syllabus highlights, and career choices for NEET-UG and GATE examinations in India.',
    category: 'Exams',
    author: 'Sarkari Aavedan Editorial Team',
    publishedDate: '2026-08-13',
    readTime: '5 min read',
    keywords: ['NEET preparation', 'GATE exam syllabus', 'PSU recruitment through GATE', 'Competitive exams strategy'],
    content: `## Cracking NEET and GATE

The **NEET (National Eligibility cum Entrance Test)** and **GATE (Graduate Aptitude Test in Engineering)** are two of India's most competitive examinations, serving as gateways to careers in Medicine and Engineering/Research.

---

### 1. NEET-UG: Preparation Strategy & Career Scope

NEET-UG is the sole medical entrance exam for admission to MBBS, BDS, BAMS, BHMS, and Veterinary sciences in Indian colleges.

#### A. Core Syllabus Weightage
- **Biology (50%):** The most scoring section. Focus heavily on Human Physiology, Genetics, Plant Physiology, and Ecology.
- **Chemistry (25%):** Divided into Physical (formulas and calculations), Organic (reaction mechanisms), and Inorganic (periodic table trends).
- **Physics (25%):** Heavily numerical. Key units include Mechanics, Electrodynamics, Optics, and Modern Physics.

#### B. Success Strategy
1. **NCERT is King:** Over 90% of Biology questions are framed directly from lines in the Class 11 & 12 NCERT textbooks. Read these books multiple times.
2. **Concept Building in Physics:** Instead of memorizing formulas, practice deriving them to understand the underlying principles. Solve at least 50 numericals daily.
3. **Negative Marking Management:** NEET penalizes incorrect answers with a -1 mark. Learn to leave highly doubtful questions unattempted during mock sessions.

---

### 2. GATE: Exam Strategy & Career Opportunities

GATE evaluates the comprehensive understanding of undergraduate subjects in engineering and science.

#### A. Key Career Pathways
- **Higher Education:** Admission to M.Tech, MS, and Ph.D. programs at premier institutes like **IITs, IISc, and NITs**, accompanied by monthly stipends.
- **Public Sector Undertaking (PSU) Jobs:** Top PSUs like **ONGC, IOCL, NTPC, BHEL, GAIL, and BARC** recruit Executive Trainees directly based on GATE scores, offering high salaries and government allowances.

#### B. GATE Exam Structure
- **General Aptitude (15 marks):** Testing language and basic numerical analysis.
- **Engineering Mathematics (13 marks):** Standard calculus, linear algebra, and probability.
- **Subject Core Paper (72 marks):** High-level engineering concepts.

#### C. Success Blueprint
- **Focus on Concept Depth:** GATE questions are conceptual and test application skills rather than rote memory.
- **Master Numerical Answer Type (NAT):** These questions have no options and require keyboard input, meaning there is no room for guesswork.
- **Virtual Calculator Practice:** Since physical calculators are barred, practice calculations using the official online virtual calculator to build speed.

---

### 📅 Ideal Daily Study Schedule
- **Morning (3 Hours):** High-focus analytical topics (Physics numericals or Engineering Mathematics).
- **Afternoon (3 Hours):** Revision, solving mock papers, and analyzing mistakes.
- **Evening (2 Hours):** Theory reading, reading NCERT textbooks, or revising formula notebooks.`
  }
];
