import fs from 'fs';
import path from 'path';

function cleanAgeString(val, type = 'min') {
  if (!val) return undefined;
  const str = String(val).trim();
  if (!str || str.toLowerCase() === 'na' || str.toLowerCase() === 'n/a') return undefined;

  if (str.toLowerCase().includes('what is the age limit') || str.toLowerCase().includes('answer:') || str.length > 40) {
    if (type === 'min') {
      const minMatch = str.match(/minimum\s*age\s*(?:is|:)?\s*(\d{1,2}\s*(?:years?|yrs?)?)/i);
      if (minMatch) {
        return minMatch[1].trim() + (minMatch[1].toLowerCase().includes('year') ? '' : ' Years');
      }
      const genericMin = str.match(/(\d{1,2})\s*(?:years?|yrs?)/i);
      if (genericMin) return `${genericMin[1]} Years`;
    } else {
      const maxMatch = str.match(/maximum\s*age\s*(?:is|:)?\s*(\d{1,2}(?:\s*[-–]\s*\d{1,2})?\s*(?:years?|yrs?)?)/i);
      if (maxMatch) {
        return maxMatch[1].trim() + (maxMatch[1].toLowerCase().includes('year') ? '' : ' Years');
      }
      const genericMax = str.match(/(?:to|[-–])\s*(\d{1,2})\s*(?:years?|yrs?)/i) || str.match(/(\d{1,2})\s*(?:years?|yrs?)/gi);
      if (genericMax && genericMax.length) {
        const last = genericMax[genericMax.length - 1];
        return last.replace(/^(?:to|[-–])\s*/i, '').trim() + (last.toLowerCase().includes('year') ? '' : ' Years');
      }
    }
  }

  const clean = str.replace(/\s+/g, ' ').trim();
  return clean.length <= 35 ? clean : clean.substring(0, 35);
}

function cleanFeeString(val) {
  if (!val) return undefined;
  const lower = String(val).toLowerCase();
  const blacklisted = ['mark', 'income', 'passed', 'lakh', 'eligib', 'matric', 'student', 'qualif', '%'];
  if (blacklisted.some(w => lower.includes(w))) {
    return undefined;
  }
  const clean = String(val).replace(/\s+/g, ' ').trim();
  return clean;
}

function inferSalary(title = '', category = '') {
  const t = title.toLowerCase();
  if (t.includes('officer') || t.includes('manager') || t.includes('po ') || t.includes('cgl') || t.includes('inspector')) {
    return 'Pay Level-7 / Level-8 (₹44,900 - ₹1,42,400/-)';
  }
  if (t.includes('si ') || t.includes('sub inspector') || t.includes('teacher') || t.includes('je ') || t.includes('engineer')) {
    return 'Pay Level-6 (₹35,400 - ₹1,12,400/-)';
  }
  if (t.includes('clerk') || t.includes('chsl') || t.includes('assistant') || t.includes('constable') || t.includes('typist')) {
    return 'Pay Level-4 (₹25,500 - ₹81,100/-)';
  }
  if (t.includes('peon') || t.includes('sweeper') || t.includes('watchman') || t.includes('mts') || t.includes('group d')) {
    return 'Pay Level-1 (₹18,000 - ₹56,900/-)';
  }
  if (category === 'Admit Card' || category === 'Result' || category === 'Answer Key') {
    return 'Refer to Recruitment Notification';
  }
  return 'As per Government Rules / Pay Matrix';
}

function inferSelectionProcess(title = '', category = '') {
  const t = title.toLowerCase();
  const c = category.toLowerCase();
  
  if (c.includes('admit')) {
    return [
      'Download Online Admit Card / Hall Ticket',
      'Appear for Written / Online Computer Based Test (CBT)',
      'Check Answer Key & Result'
    ];
  }
  if (c.includes('result')) {
    return [
      'Written / CBT Preliminary Examination',
      'Mains / Secondary Stage Examination',
      'Document Verification & Final Merit List'
    ];
  }
  if (c.includes('answer key')) {
    return [
      'View Response Sheet & Question Paper',
      'Raise Objections / Challenge Answer Key Online',
      'Final Answer Key & Scorecard Declaration'
    ];
  }
  if (t.includes('police') || t.includes('constable') || t.includes('si ') || t.includes('sub inspector') || t.includes('bsf') || t.includes('crpf') || t.includes('cisf') || t.includes('army') || t.includes('agniveer')) {
    return [
      'Written Examination (CBT / OMR)',
      'Physical Efficiency & Measurement Test (PET / PST)',
      'Document Verification (DV)',
      'Detailed Medical Examination (DME)'
    ];
  }
  if (t.includes('clerk') || t.includes('assistant') || t.includes('deo') || t.includes('steno') || t.includes('typist') || t.includes('chsl')) {
    return [
      'Computer Based Written Test (CBT)',
      'Typing / Skill / Shorthand Test',
      'Document Verification (DV)',
      'Final Merit List'
    ];
  }
  if (t.includes('teacher') || t.includes('tgt') || t.includes('pgt') || t.includes('prt') || t.includes('professor')) {
    return [
      'Written Competitive Examination',
      'Interview / Demo Class (if applicable)',
      'Document Verification (DV)'
    ];
  }
  if (t.includes('engineer') || t.includes('je ') || t.includes('junior engineer') || t.includes('technician')) {
    return [
      'Stage-1 CBT Examination',
      'Stage-2 Technical Paper CBT',
      'Document Verification & Medical Fitness'
    ];
  }
  return [
    'Written Examination (CBT / OMR)',
    'Skill / Trade Test (if applicable)',
    'Document Verification (DV)',
    'Medical Examination (As per Rules)'
  ];
}

function buildHowToApply(title = '', category = '') {
  const c = category.toLowerCase();
  if (c.includes('admit')) {
    return [
      'Click on the direct "Download Admit Card / Hall Ticket" link provided below.',
      'Enter your Registration Number / Roll Number and Date of Birth (DOB) or Password.',
      'Click on "Submit" or "Login" to view your Hall Ticket on screen.',
      'Check all details thoroughly: Exam Center, Reporting Time, Shift, and Roll Number.',
      'Download and print at least 2 clear copies of the Admit Card along with the official instructions.'
    ];
  }
  if (c.includes('result')) {
    return [
      'Click on the direct "Check Result / Download Merit List" link below.',
      'Open the PDF or enter your Roll Number / Registration Number and DOB on the result portal.',
      'Search for your Roll Number / Name in the qualified candidates list (using Ctrl + F on PC).',
      'Check category-wise cut-off marks and your qualifying score.',
      'Download and save a copy of the Scorecard / Merit List for subsequent stages.'
    ];
  }
  return [
    'Check your eligibility, educational qualifications, and age criteria from the official notification.',
    'Visit the official website and complete One-Time Registration (OTR) if you are a new applicant.',
    'Carefully fill in your personal details, educational qualifications, and address in the online form.',
    'Upload required scanned documents, recent passport-size photograph, and signature in specified sizes.',
    'Pay the prescribed examination fee through Net Banking, Debit/Credit Card, or UPI (if applicable).',
    'Review the filled application form preview, submit, and take a printout of the final confirmation receipt.'
  ];
}

function extractJobLocation(title = '') {
  const t = ` ${title} `;
  if (/\b(up|uttar pradesh|upsssc|uppsc|upessc)\b/i.test(t)) return 'Uttar Pradesh';
  if (/\b(bihar|bpsc|bssc|bseb)\b/i.test(t)) return 'Bihar';
  if (/\b(mp|madhya pradesh|mppsc|esb)\b/i.test(t)) return 'Madhya Pradesh';
  if (/\b(rajasthan|rpsc|rsmssb)\b/i.test(t)) return 'Rajasthan';
  if (/\b(delhi|dsssb)\b/i.test(t)) return 'Delhi / NCR';
  if (/\b(haryana|hssc|hpsc)\b/i.test(t)) return 'Haryana';
  if (/\b(maharashtra|mpsc)\b/i.test(t)) return 'Maharashtra';
  if (/\b(uk|uttarakhand|ukpsc|uksssc)\b/i.test(t)) return 'Uttarakhand';
  if (/\b(jharkhand|jssc|jpsc)\b/i.test(t)) return 'Jharkhand';
  if (/\b(ssc|upsc|railway|rrb|ibps|sbi|nta|cbse|airforce|navy|army|bsf|crpf|cisf|itbp|ssb)\b/i.test(t)) return 'All India (Central Govt)';
  return 'All India / State-Wise';
}

function extractTotalVacancies(title = '', vacancies = []) {
  let sum = 0;
  if (Array.isArray(vacancies)) {
    for (const v of vacancies) {
      const num = parseInt(String(v.totalPost).replace(/[^0-9]/g, ''), 10);
      if (!isNaN(num) && num > 0) sum += num;
    }
  }
  if (sum > 0) return `${sum.toLocaleString()} Posts`;
  
  const m = title.match(/(\d+)\s*(?:posts?|vacanc(?:y|ies))/i);
  if (m) return `${parseInt(m[1], 10).toLocaleString()} Posts`;
  
  return 'Refer to Notification';
}

const filePaths = ['scraped-jobs.json', 'public/scraped-jobs.json'];

filePaths.forEach(fp => {
  if (!fs.existsSync(fp)) return;
  console.log(`Upgrading ${fp}...`);
  const jobs = JSON.parse(fs.readFileSync(fp, 'utf8'));
  let updatedCount = 0;

  const upgradedJobs = jobs.map(j => {
    const isRecruitment = j.category === 'Latest Jobs' || j.category.toLowerCase().includes('outsourcing');
    const cleanedFeeGen = cleanFeeString(j.fees?.generalObc) || (isRecruitment ? 'Refer to Notification' : 'Exempted / Not Applicable');
    const cleanedFeeSc = cleanFeeString(j.fees?.scStPh) || (isRecruitment ? 'Refer to Notification' : 'Exempted / Not Applicable');
    const cleanedFeeFemale = cleanFeeString(j.fees?.female);

    const cleanedAgeMin = cleanAgeString(j.ageLimit?.min, 'min');
    const cleanedAgeMax = cleanAgeString(j.ageLimit?.max, 'max');

    updatedCount++;
    return {
      ...j,
      fees: {
        ...j.fees,
        generalObc: cleanedFeeGen,
        scStPh: cleanedFeeSc,
        female: cleanedFeeFemale || undefined
      },
      ageLimit: {
        ...j.ageLimit,
        min: cleanedAgeMin,
        max: cleanedAgeMax
      },
      salary: j.salary || inferSalary(j.title, j.category),
      selectionProcess: j.selectionProcess || inferSelectionProcess(j.title, j.category),
      howToApply: j.howToApply || buildHowToApply(j.title, j.category),
      jobLocation: j.jobLocation || extractJobLocation(j.title),
      totalVacanciesCount: j.totalVacanciesCount || extractTotalVacancies(j.title, j.vacancies)
    };
  });

  fs.writeFileSync(fp, JSON.stringify(upgradedJobs, null, 2), 'utf8');
  console.log(`✅ Upgraded ${updatedCount} jobs in ${fp}`);
});
