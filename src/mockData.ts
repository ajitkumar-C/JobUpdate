import type { JobPost, Category } from './types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'latest-jobs', name: 'Latest Jobs' },
  { id: 'admit-card', name: 'Admit Card' },
  { id: 'result', name: 'Result' },
  { id: 'answer-key', name: 'Answer Key' },
  { id: 'syllabus', name: 'Syllabus' },
  { id: 'admission', name: 'Admission' },
  { id: 'certificate', name: 'Certificate' },
  { id: 'outsourcing-offline', name: 'Outsourcing / Offline Jobs' },
  { id: 'important', name: 'Important' }
];

export const MOCK_JOBS: JobPost[] = [
  {
    id: 'upsc-cse-2026',
    title: 'UPSC Civil Services (IAS/IFS) Recruitment 2026 Online Form',
    category: 'Latest Jobs',
    postDate: '2026-06-25',
    shortInfo: 'Union Public Service Commission (UPSC) has released the notification for Civil Services Examination (CSE) 2026. Interested candidates can apply online from June 25, 2026 to July 20, 2026. Read the notification for syllabus, age limit, selection procedure, and details.',
    applicationStart: '2026-06-25',
    applicationLastDate: '2026-07-20',
    feeLastDate: '2026-07-20',
    examDate: '2026-10-12',
    admitCardDate: '2026-09-28',
    fees: {
      generalObc: 'Rs. 100/-',
      scStPh: 'Rs. 0/- (Exempted)',
      female: 'Rs. 0/- (Exempted)',
      paymentMode: 'Pay the examination fee through Debit Card, Credit Card, Net Banking or E-Challan offline mode.'
    },
    ageLimit: {
      min: '21 Years',
      max: '32 Years',
      relaxationText: 'Age relaxation is applicable as per UPSC Civil Services rules.'
    },
    vacancies: [
      {
        postName: 'Civil Services IAS (Administrative Services)',
        totalPost: '1056',
        eligibility: 'Bachelor Degree in any stream from any recognized university in India.'
      },
      {
        postName: 'Indian Forest Service (IFS)',
        totalPost: '150',
        eligibility: 'Bachelor Degree with at least one of the subjects namely Animal Husbandry & Veterinary Science, Botany, Chemistry, Geology, Mathematics, Physics, Statistics and Zoology or Agriculture, Forestry.'
      }
    ],
    importantLinks: {
      applyOnline: 'https://upsconline.nic.in/',
      downloadNotification: 'https://upsc.gov.in/notifications/cse-2026',
      officialWebsite: 'https://upsc.gov.in/'
    },
    status: 'active'
  },
  {
    id: 'sbi-clerk-2026',
    title: 'SBI Junior Associates (Clerk) Recruitment 2026 Online Form',
    category: 'Latest Jobs',
    postDate: '2026-06-28',
    shortInfo: 'State Bank of India (SBI) invites online applications for the recruitment of Junior Associates (Customer Support & Sales) in Clerical Cadre in State Bank of India. Candidates can apply online for 8000+ posts.',
    applicationStart: '2026-06-28',
    applicationLastDate: '2026-07-18',
    feeLastDate: '2026-07-18',
    examDate: '2026-09-05',
    admitCardDate: '2026-08-25',
    fees: {
      generalObc: 'Rs. 750/-',
      scStPh: 'Rs. 0/-',
      female: 'Rs. 750/-',
      paymentMode: 'Online through Net Banking, Debit Card, Credit Card or UPI.'
    },
    ageLimit: {
      min: '20 Years',
      max: '28 Years',
      relaxationText: 'Standard government norms apply for OBC (3 years) and SC/ST (5 years).'
    },
    vacancies: [
      {
        postName: 'SBI Junior Associate (Clerk) - Regular',
        totalPost: '8200',
        eligibility: 'Graduation in any discipline from a recognized University or any equivalent qualification recognized as such by the Central Government.'
      },
      {
        postName: 'SBI Junior Associate (Clerk) - Backlog',
        totalPost: '250',
        eligibility: 'Graduation in any discipline from a recognized University.'
      }
    ],
    importantLinks: {
      applyOnline: 'https://ibpsonline.ibps.in/sbijajun26/',
      downloadNotification: 'https://sbi.co.in/careers',
      officialWebsite: 'https://sbi.co.in/'
    },
    status: 'active'
  },
  {
    id: 'ssc-cgl-admit-card-2026',
    title: 'SSC CGL Tier-I Exam Admit Card 2026 Download',
    category: 'Admit Card',
    postDate: '2026-06-30',
    shortInfo: 'Staff Selection Commission (SSC) has uploaded the regional Tier I admit cards and application status for Combined Graduate Level Examination (CGL) 2026.',
    applicationStart: '2026-04-10',
    applicationLastDate: '2026-05-10',
    feeLastDate: '2026-05-10',
    examDate: '2026-07-15 to 2026-07-28',
    admitCardDate: '2026-07-01',
    fees: {
      generalObc: 'Rs. 100/-',
      scStPh: 'Rs. 0/-',
      paymentMode: 'Online'
    },
    ageLimit: {
      min: '18 Years',
      max: '32 Years'
    },
    vacancies: [
      {
        postName: 'Combined Graduate Level CGL Posts',
        totalPost: '17727',
        eligibility: 'Bachelor Degree in any stream. For Assistant Audit Officer: Bachelor Degree with CA/CS/MBA/M.Com.'
      }
    ],
    importantLinks: {
      admitCardUrl: 'https://ssc.gov.in/admitcard',
      downloadNotification: 'https://ssc.gov.in/notifications/cgl-2026',
      officialWebsite: 'https://ssc.gov.in/'
    },
    status: 'active'
  },
  {
    id: 'ibps-po-result-2026',
    title: 'IBPS PO XII Mains Exam Result 2026 declared',
    category: 'Result',
    postDate: '2026-06-29',
    shortInfo: 'Institute of Banking Personnel Selection (IBPS) has declared the Mains Examination result for the Probationary Officer (PO/MT) recruitment XII. Candidates who appeared can check their result link below.',
    applicationStart: '2026-02-01',
    applicationLastDate: '2026-02-25',
    feeLastDate: '2026-02-25',
    examDate: '2026-05-20',
    admitCardDate: '2026-05-10',
    resultDate: '2026-06-29',
    fees: {
      generalObc: 'Rs. 850/-',
      scStPh: 'Rs. 175/-',
      paymentMode: 'Online'
    },
    ageLimit: {
      min: '20 Years',
      max: '30 Years'
    },
    vacancies: [
      {
        postName: 'Probationary Officer (PO/MT) XII',
        totalPost: '6432',
        eligibility: 'Bachelor Degree in any stream from a recognized university.'
      }
    ],
    importantLinks: {
      resultUrl: 'https://ibps.in/po-result-mains',
      officialWebsite: 'https://ibps.in/'
    },
    status: 'active'
  },
  {
    id: 'rrb-alp-syllabus-2026',
    title: 'Railway RRB Assistant Loco Pilot (ALP) Exam Syllabus 2026',
    category: 'Syllabus',
    postDate: '2026-06-15',
    shortInfo: 'Railway Recruitment Board (RRB) has released the detailed syllabus and exam pattern for Assistant Loco Pilot (ALP) Recruitment 2026. Download the PDF and view the exam pattern.',
    applicationStart: '2026-05-01',
    applicationLastDate: '2026-06-01',
    feeLastDate: '2026-06-01',
    examDate: '2026-08-20',
    admitCardDate: '2026-08-10',
    fees: {
      generalObc: 'Rs. 500/-',
      scStPh: 'Rs. 250/-',
      paymentMode: 'Refundable fee of Rs 400 for General/OBC and Rs 250 for SC/ST after appearing in Stage 1 CBT.'
    },
    ageLimit: {
      min: '18 Years',
      max: '30 Years'
    },
    vacancies: [
      {
        postName: 'Assistant Loco Pilot (ALP)',
        totalPost: '18799',
        eligibility: '10th Class pass with ITI from recognized NCVT/SCVT institutions, OR Diploma in Mechanical/Electrical/Electronics/Automobile Engineering.'
      }
    ],
    importantLinks: {
      syllabusUrl: 'https://indianrailways.gov.in/rrb-alp-syllabus-pdf',
      downloadNotification: 'https://indianrailways.gov.in/rrb-alp-notification',
      officialWebsite: 'https://indianrailways.gov.in/'
    },
    status: 'active'
  },
  {
    id: 'neet-ug-result-2026',
    title: 'NTA NEET UG Entrance Exam Result 2026 Declared',
    category: 'Result',
    postDate: '2026-06-20',
    shortInfo: 'National Testing Agency (NTA) has declared the result and scorecard for the National Eligibility cum Entrance Test (NEET UG) 2026. Check top scores and cut-off marks.',
    applicationStart: '2026-02-15',
    applicationLastDate: '2026-03-20',
    feeLastDate: '2026-03-20',
    examDate: '2026-05-05',
    admitCardDate: '2026-04-28',
    resultDate: '2026-06-20',
    fees: {
      generalObc: 'Rs. 1700/- (General), Rs. 1600/- (OBC-NCL)',
      scStPh: 'Rs. 1000/-',
      paymentMode: 'Online via Net Banking, Card, UPI'
    },
    ageLimit: {
      min: '17 Years',
      relaxationText: 'Minimum age should be 17 years on or before 31st December 2026. No upper age limit.'
    },
    vacancies: [
      {
        postName: 'NEET UG Admission 2026',
        totalPost: 'Admission',
        eligibility: 'Passed or appearing 10+2 Intermediate Exam with Physics, Chemistry, Biology (PCB) group subjects.'
      }
    ],
    importantLinks: {
      resultUrl: 'https://exams.nta.ac.in/NEET/',
      officialWebsite: 'https://nta.ac.in/'
    },
    status: 'active'
  },
  {
    id: 'up-bed-jee-admission-2026',
    title: 'UP B.Ed Joint Entrance Exam JEE 2026 Online Counseling',
    category: 'Admission',
    postDate: '2026-06-27',
    shortInfo: 'Bundelkhand University (BU Jhansi) has started the online counseling process for UP B.Ed Joint Entrance Examination JEE 2026. Candidates who cleared the entrance exam can participate in counseling.',
    applicationStart: '2026-02-10',
    applicationLastDate: '2026-03-31',
    feeLastDate: '2026-04-05',
    examDate: '2026-06-09',
    admitCardDate: '2026-05-30',
    fees: {
      generalObc: 'Rs. 1400/-',
      scStPh: 'Rs. 700/-',
      paymentMode: 'Online'
    },
    ageLimit: {
      min: '15 Years',
      relaxationText: 'No upper age limit for UP B.Ed Admission Course.'
    },
    vacancies: [
      {
        postName: 'UP B.Ed Admission Course (2 Year Duration)',
        totalPost: 'Seats in Govt & Private Colleges',
        eligibility: 'Bachelor or Master Degree with minimum 50% Marks (55% for Engineering/Technology candidates).'
      }
    ],
    importantLinks: {
      applyOnline: 'https://bujhansi.ac.in/bed-counseling',
      officialWebsite: 'https://bujhansi.ac.in/'
    },
    status: 'active'
  }
];
