export interface AgeLimit {
  min?: string;
  max?: string;
  relaxationText?: string;
}

export interface VacancyRow {
  postName: string;
  totalPost: string;
  eligibility: string;
}

export interface ImportantLinks {
  applyOnline?: string;
  downloadNotification?: string;
  officialWebsite?: string;
  syllabusUrl?: string;
  admitCardUrl?: string;
  resultUrl?: string;
}

export interface JobPost {
  id: string;
  title: string;
  category: string; // e.g. "Latest Jobs", "Admit Card", "Result", "Syllabus", "Answer Key", "Admission"
  postDate: string;
  shortInfo: string;
  applicationStart: string;
  applicationLastDate: string;
  feeLastDate: string;
  examDate: string;
  admitCardDate: string;
  resultDate?: string;
  fees: {
    generalObc: string;
    scStPh: string;
    female?: string;
    paymentMode?: string;
  };
  ageLimit: AgeLimit;
  vacancies: VacancyRow[];
  importantLinks: ImportantLinks;
  status: 'active' | 'expired';
}

export interface Category {
  id: string;
  name: string;
}
