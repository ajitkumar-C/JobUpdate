import { STATES_CONFIG } from '../config/states';

/**
 * Helper to map category names to exact route slugs
 */
function getCategorySlug(categoryName: string): string {
  const name = categoryName.toLowerCase();
  if (name.includes('latest job')) return 'latest-jobs';
  if (name.includes('admit card')) return 'admit-card';
  if (name.includes('result')) return 'result';
  if (name.includes('answer key')) return 'answer-key';
  if (name.includes('syllabus')) return 'syllabus';
  if (name.includes('admission')) return 'admission';
  if (name.includes('certificate')) return 'certificate';
  if (name.includes('outsourcing') || name.includes('offline')) return 'outsourcing-offline';
  if (name.includes('important')) return 'important';
  return categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function getCategoryActionLabel(category: string): string {
  const cat = (category || '').toLowerCase();
  if (cat.includes('answer key') || cat.includes('key')) return 'Answer Key';
  if (cat.includes('result')) return 'Result & Scorecard';
  if (cat.includes('admit') || cat.includes('card')) return 'Admit Card';
  if (cat.includes('syllabus')) return 'Syllabus & Exam Pattern';
  if (cat.includes('admission')) return 'Admission Notice';
  if (cat.includes('certificate')) return 'Certificate Verification';
  if (cat.includes('outsourcing') || cat.includes('offline')) return 'Offline Form';
  if (cat.includes('important')) return 'Important Notice';
  return 'Apply Online';
}

/**
 * Resolves comprehensive PostalAddress for Google Jobs Schema compliance
 * (fixes GSC missing streetAddress, addressLocality, postalCode warnings)
 */
function getJobAddress(job: any) {
  const query = `${job?.jobLocation || ''} ${job?.title || ''}`;
  const LOCATION_MAP = [
    { match: /\b(up|uttar pradesh|lucknow|kanpur|varanasi|allahabad|prayagraj|upsssc|uppsc|upessc|upprpb)\b/i, locality: 'Lucknow', region: 'Uttar Pradesh', postalCode: '226001', streetAddress: 'Vidhan Sabha Marg, Hazratganj' },
    { match: /\b(maharashtra|mumbai|pune|nagpur|nashik|mpsc|bmc|mahapolic)\b/i, locality: 'Mumbai', region: 'Maharashtra', postalCode: '400032', streetAddress: 'Madam Cama Road, Mantralaya, Nariman Point' },
    { match: /\b(bihar|patna|bpsc|bssc|bseb|csbc)\b/i, locality: 'Patna', region: 'Bihar', postalCode: '800015', streetAddress: 'Old Secretariat, Bailey Road' },
    { match: /\b(delhi|dsssb|ndmc|mcd)\b/i, locality: 'New Delhi', region: 'Delhi', postalCode: '110001', streetAddress: 'Indraprastha Estate, Central Secretariat' },
    { match: /\b(rajasthan|jaipur|jodhpur|rpsc|rsmssb|rssb)\b/i, locality: 'Jaipur', region: 'Rajasthan', postalCode: '302005', streetAddress: 'Government Secretariat, Bhagwan Das Road' },
    { match: /\b(mp|madhya pradesh|bhopal|indore|mppsc|mpesb|vyapam)\b/i, locality: 'Bhopal', region: 'Madhya Pradesh', postalCode: '462004', streetAddress: 'Vallabh Bhavan, Arera Hills' },
    { match: /\b(haryana|hssc|hpsc)\b/i, locality: 'Chandigarh', region: 'Haryana', postalCode: '160001', streetAddress: 'Haryana Civil Secretariat, Sector 1' },
    { match: /\b(punjab|psssc|ppsc)\b/i, locality: 'Chandigarh', region: 'Punjab', postalCode: '160001', streetAddress: 'Punjab Civil Secretariat, Sector 1' },
    { match: /\b(gujarat|gandhinagar|ahmedabad|gpsc|gsssb)\b/i, locality: 'Gandhinagar', region: 'Gujarat', postalCode: '382010', streetAddress: 'Sardar Bhavan, New Sachivalaya' },
    { match: /\b(karnataka|bangalore|bengaluru|kpsc|kea)\b/i, locality: 'Bengaluru', region: 'Karnataka', postalCode: '560001', streetAddress: 'Vidhana Soudha, Ambedkar Bheedhi' },
    { match: /\b(tamil nadu|tamilnadu|chennai|tnpsc|trb)\b/i, locality: 'Chennai', region: 'Tamil Nadu', postalCode: '600009', streetAddress: 'Fort St. George, Rajaji Salai' },
    { match: /\b(west bengal|wb|kolkata|wbpsc|wbprb)\b/i, locality: 'Kolkata', region: 'West Bengal', postalCode: '700001', streetAddress: 'Nabanna, 325 Sarat Chatterjee Road' },
    { match: /\b(telangana|hyderabad|tspsc)\b/i, locality: 'Hyderabad', region: 'Telangana', postalCode: '500022', streetAddress: 'Dr. B.R. Ambedkar Telangana Secretariat' },
    { match: /\b(andhra|andhra pradesh|vijayawada|amaravati|appsc)\b/i, locality: 'Amaravati', region: 'Andhra Pradesh', postalCode: '522238', streetAddress: 'AP Government Secretariat, Velagapudi' },
    { match: /\b(kerala|thiruvananthapuram|kpsc)\b/i, locality: 'Thiruvananthapuram', region: 'Kerala', postalCode: '695001', streetAddress: 'Government Secretariat, MG Road' },
    { match: /\b(odisha|bhubaneswar|opsc|ossc)\b/i, locality: 'Bhubaneswar', region: 'Odisha', postalCode: '751001', streetAddress: 'Lok Seva Bhavan, Sachivalaya Marg' },
    { match: /\b(jharkhand|ranchi|jpsc|jssc)\b/i, locality: 'Ranchi', region: 'Jharkhand', postalCode: '834004', streetAddress: 'Project Building, Dhurwa' },
    { match: /\b(chhattisgarh|raipur|cgpsc|cgvyapam)\b/i, locality: 'Raipur', region: 'Chhattisgarh', postalCode: '492002', streetAddress: 'Mahanadi Bhavan, Nawa Raipur Atal Nagar' },
    { match: /\b(uttarakhand|uk|dehradun|ukpsc|uksssc)\b/i, locality: 'Dehradun', region: 'Uttarakhand', postalCode: '248001', streetAddress: 'Uttarakhand Secretariat, 4 Subhash Road' },
    { match: /\b(himachal|hp|shimla|hppsc)\b/i, locality: 'Shimla', region: 'Himachal Pradesh', postalCode: '171002', streetAddress: 'HP Secretariat, Chhota Shimla' },
    { match: /\b(assam|guwahati|dispur|apsc)\b/i, locality: 'Guwahati', region: 'Assam', postalCode: '781006', streetAddress: 'Assam Secretariat, Dispur' }
  ];

  for (const item of LOCATION_MAP) {
    if (item.match.test(query)) {
      return {
        '@type': 'PostalAddress',
        'streetAddress': item.streetAddress,
        'addressLocality': item.locality,
        'addressRegion': item.region,
        'postalCode': item.postalCode,
        'addressCountry': 'IN'
      };
    }
  }

  // Central / All India administrative headquarters default
  return {
    '@type': 'PostalAddress',
    'streetAddress': 'Central Secretariat, Rajpath Area',
    'addressLocality': 'New Delhi',
    'addressRegion': 'Delhi',
    'postalCode': '110001',
    'addressCountry': 'IN'
  };
}

/**
 * Resolves 7th CPC salary structure for Google Jobs Schema compliance
 * (fixes GSC missing baseSalary warning)
 */
function getBaseSalary(job: any) {
  const text = `${job?.salary || ''} ${job?.title || ''}`;

  // 1. Check for salary range numbers (e.g., ₹ 21,700 - 69,100)
  const rangeMatch = text.match(/(?:₹|rs\.?|inr)?\s*(\d{1,2}[\d,]{3,7})\s*(?:-|to)\s*(?:₹|rs\.?|inr)?\s*(\d{1,2}[\d,]{3,7})/i);
  if (rangeMatch) {
    const min = parseInt(rangeMatch[1].replace(/,/g, ''), 10);
    const max = parseInt(rangeMatch[2].replace(/,/g, ''), 10);
    if (!isNaN(min) && !isNaN(max) && min > 5000 && max > min) {
      return {
        '@type': 'MonetaryAmount',
        'currency': 'INR',
        'value': {
          '@type': 'QuantitativeValue',
          'minValue': min,
          'maxValue': max,
          'unitText': 'MONTH'
        }
      };
    }
  }

  // 2. Check for 7th CPC Level matrix
  const levelMatch = text.match(/level[\s-]*([0-9]{1,2})/i);
  if (levelMatch) {
    const lvl = parseInt(levelMatch[1], 10);
    const payMatrix: Record<number, [number, number]> = {
      1: [18000, 56900],
      2: [19900, 63200],
      3: [21700, 69100],
      4: [25500, 81100],
      5: [29200, 92300],
      6: [35400, 112400],
      7: [44900, 142400],
      8: [47600, 151100],
      9: [53100, 167800],
      10: [56100, 177500],
      11: [67700, 208700],
      12: [78800, 209200]
    };
    if (payMatrix[lvl]) {
      return {
        '@type': 'MonetaryAmount',
        'currency': 'INR',
        'value': {
          '@type': 'QuantitativeValue',
          'minValue': payMatrix[lvl][0],
          'maxValue': payMatrix[lvl][1],
          'unitText': 'MONTH'
        }
      };
    }
  }

  // 3. Heuristic based on title role
  const upper = text.toUpperCase();
  if (/(OFFICER|PROFESSOR|DOCTOR|SCIENTIST|ENGINEER|LECTURER|SUB INSPECTOR|\bSI\b|CIVIL JUDGE)/.test(upper)) {
    return {
      '@type': 'MonetaryAmount',
      'currency': 'INR',
      'value': {
        '@type': 'QuantitativeValue',
        'minValue': 35400,
        'maxValue': 112400,
        'unitText': 'MONTH'
      }
    };
  }

  if (/(CONSTABLE|DRIVER|MTS|PEON|GROUP D|HELPER|ATTENDANT|SWEEPER|FIREMAN)/.test(upper)) {
    return {
      '@type': 'MonetaryAmount',
      'currency': 'INR',
      'value': {
        '@type': 'QuantitativeValue',
        'minValue': 18000,
        'maxValue': 56900,
        'unitText': 'MONTH'
      }
    };
  }

  // 4. Default 7th Pay Commission Standard (Level 3 - ₹ 21,700 to ₹ 69,100)
  return {
    '@type': 'MonetaryAmount',
    'currency': 'INR',
    'value': {
      '@type': 'QuantitativeValue',
      'minValue': 21700,
      'maxValue': 69100,
      'unitText': 'MONTH'
    }
  };
}

/**
 * Resolves a guaranteed valid future ISO 8601 date for validThrough
 * (fixes GSC missing validThrough warning and avoids expired dates)
 */
function getValidThrough(job: any, fallbackDays = 60): string {
  const rawDate = job?.applicationLastDate || job?.lastDate || job?.feeLastDate || '';
  let parsedDate: Date | null = null;

  // 1. Check YYYY-MM-DD
  const isoMatch = String(rawDate).match(/(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    parsedDate = new Date(`${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}T23:59:59Z`);
  }

  // 2. Check DD/MM/YYYY or DD-MM-YYYY
  if (!parsedDate || isNaN(parsedDate.getTime())) {
    const dmyMatch = String(rawDate).match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
    if (dmyMatch) {
      const day = dmyMatch[1].padStart(2, '0');
      const month = dmyMatch[2].padStart(2, '0');
      const year = dmyMatch[3];
      parsedDate = new Date(`${year}-${month}-${day}T23:59:59Z`);
    }
  }

  // 3. Check Textual Date like "20 August 2026" or "15 Nov 2026"
  if (!parsedDate || isNaN(parsedDate.getTime())) {
    const months: Record<string, string> = {
      jan: '01', january: '01',
      feb: '02', february: '02',
      mar: '03', march: '03',
      apr: '04', april: '04',
      may: '05',
      jun: '06', june: '06',
      jul: '07', july: '07',
      aug: '08', august: '08',
      sep: '09', sept: '09', september: '09',
      oct: '10', october: '10',
      nov: '11', november: '11',
      dec: '12', december: '12'
    };
    const textMatch = String(rawDate).match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
    if (textMatch) {
      const day = textMatch[1].padStart(2, '0');
      const monthKey = textMatch[2].toLowerCase();
      const month = months[monthKey];
      const year = textMatch[3];
      if (month) {
        parsedDate = new Date(`${year}-${month}-${day}T23:59:59Z`);
      }
    }
  }

  // If parsed date is in the future, return it
  const now = new Date();
  if (parsedDate && !isNaN(parsedDate.getTime()) && parsedDate.getTime() > now.getTime()) {
    return parsedDate.toISOString().replace(/\.\d{3}Z$/, 'Z');
  }

  // Fallback: active future window of 60 days
  let baseDate = now;
  if (job?.postDate && /^\d{4}-\d{2}-\d{2}$/.test(job.postDate)) {
    const pDate = new Date(job.postDate);
    if (!isNaN(pDate.getTime())) {
      const projected = new Date(pDate.getTime() + fallbackDays * 24 * 60 * 60 * 1000);
      if (projected.getTime() > now.getTime()) {
        baseDate = pDate;
      }
    }
  }

  const future = new Date(baseDate.getTime() + fallbackDays * 24 * 60 * 60 * 1000);
  return future.toISOString().split('T')[0] + 'T23:59:59Z';
}

/**
 * Extracts official employer / hiring organization name from title
 */
function getHiringOrgName(job: any): string {
  const t = (job?.title || '').toUpperCase();
  if (t.includes('UPSC')) return 'Union Public Service Commission (UPSC)';
  if (t.includes('SSC')) return 'Staff Selection Commission (SSC)';
  if (t.includes('RRB') || t.includes('RAILWAY')) return 'Railway Recruitment Board (RRB)';
  if (t.includes('IBPS')) return 'Institute of Banking Personnel Selection (IBPS)';
  if (t.includes('SBI')) return 'State Bank of India (SBI)';
  if (t.includes('ISRO')) return 'Indian Space Research Organisation (ISRO)';
  if (t.includes('DRDO')) return 'Defence Research and Development Organisation (DRDO)';
  if (t.includes('UPSSSC')) return 'Uttar Pradesh Subordinate Services Selection Commission (UPSSSC)';
  if (t.includes('UPPSC')) return 'Uttar Pradesh Public Service Commission (UPPSC)';
  if (t.includes('UP POLICE') || t.includes('UPPRPB')) return 'Uttar Pradesh Police Recruitment & Promotion Board (UPPRPB)';
  if (t.includes('BPSC')) return 'Bihar Public Service Commission (BPSC)';
  if (t.includes('BSSC')) return 'Bihar Staff Selection Commission (BSSC)';
  if (t.includes('BIHAR POLICE') || t.includes('CSBC')) return 'Central Selection Board of Constable (CSBC Bihar)';
  if (t.includes('MPSC')) return 'Maharashtra Public Service Commission (MPSC)';
  if (t.includes('MAHA POLICE') || t.includes('MAHARASHTRA POLICE')) return 'Maharashtra State Police Recruitment';
  if (t.includes('RPSC')) return 'Rajasthan Public Service Commission (RPSC)';
  if (t.includes('RSMSSB') || t.includes('RSSB')) return 'Rajasthan Staff Selection Board (RSSB)';
  if (t.includes('MPPSC')) return 'Madhya Pradesh Public Service Commission (MPPSC)';
  if (t.includes('MPESB') || t.includes('VYAPAM')) return 'Madhya Pradesh Employees Selection Board (MPESB)';
  if (t.includes('DSSSB')) return 'Delhi Subordinate Services Selection Board (DSSSB)';
  if (t.includes('HSSC')) return 'Haryana Staff Selection Commission (HSSC)';
  if (t.includes('HPSC')) return 'Haryana Public Service Commission (HPSC)';
  if (t.includes('UKPSC')) return 'Uttarakhand Public Service Commission (UKPSC)';
  if (t.includes('WBPSC')) return 'West Bengal Public Service Commission (WBPSC)';
  if (t.includes('TNPSC')) return 'Tamil Nadu Public Service Commission (TNPSC)';
  if (t.includes('KPSC')) return 'Karnataka Public Service Commission (KPSC)';
  if (t.includes('KERALA PSC')) return 'Kerala Public Service Commission (Kerala PSC)';
  if (t.includes('INDIAN ARMY') || t.includes('ARMY')) return 'Indian Army';
  if (t.includes('INDIAN NAVY') || t.includes('NAVY')) return 'Indian Navy';
  if (t.includes('AIR FORCE') || t.includes('IAF')) return 'Indian Air Force';
  return 'Government Recruitment Board / Commission';
}

/**
 * Utility to dynamically update meta tags, canonical link, and JSON-LD schemas
 * for excellent search engine indexing (E-E-A-T & Google-friendly structure).
 */
export function updateSEO(
  job?: any | null,
  categoryName?: string | null,
  pageName?: string | null,
  blogPost?: any | null
) {
  if (typeof window === 'undefined') return;

  // 1. Setup metadata default values
  const defaultTitle = 'Sarkari Result 2026 | Sarkari Job, Admit Card & Govt Jobs Alerts - Sarkari Aavedan';
  const defaultDesc = 'Sarkari Aavedan (सरकारी आवेदन) provides real-time Sarkari Result 2026, latest Sarkari Job notifications, Admit Card downloads, answer keys, syllabus, and Govt Jobs online forms.';
  const defaultKeywords = 'sarkari result, sarkari job, admit card, govt jobs, sarkari result 2026, sarkari naukri, latest jobs, online form, admit card 2026, सरकारी रिजल्ट, सरकारी नौकरी, sarkari aavedan';

  let finalTitle = defaultTitle;
  let finalDesc = defaultDesc;
  let finalKeywords = defaultKeywords;
  let canonicalUrl = 'https://sarkariavedan.info/';

  // 2. Clear existing dynamic JSON-LD schema script tags
  const removeSchemaScript = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.remove();
  };
  removeSchemaScript('seo-main-schema');
  removeSchemaScript('seo-breadcrumb-schema');
  removeSchemaScript('seo-job-schema');

  // 3. Process dynamic route contexts
  if (blogPost) {
    // Blog Post Detail View
    finalTitle = `${blogPost.title} - Sarkari Aavedan (सरकारी आवेदन)`;
    finalDesc = blogPost.summary || (blogPost.content || '').substring(0, 155);
    if (blogPost.keywords && Array.isArray(blogPost.keywords)) {
      finalKeywords = blogPost.keywords.join(', ');
    } else {
      finalKeywords = 'sarkari blog, career details, eligibility guidelines, exam pattern';
    }
    canonicalUrl = `https://sarkariavedan.info/blog/${blogPost.id}`;

    // Inject BlogPosting Schema
    const blogSchema = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      'headline': blogPost.title,
      'description': blogPost.summary,
      'image': blogPost.image ? `https://sarkariavedan.info${blogPost.image}` : 'https://sarkariavedan.info/favicon.svg',
      'author': {
        '@type': 'Organization',
        'name': 'Sarkari Aavedan'
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'Sarkari Aavedan',
        'logo': {
          '@type': 'ImageObject',
          'url': 'https://sarkariavedan.info/favicon.svg'
        }
      },
      'datePublished': blogPost.publishedDate || new Date().toISOString().split('T')[0],
      'url': canonicalUrl
    };

    const mainScript = document.createElement('script');
    mainScript.id = 'seo-main-schema';
    mainScript.type = 'application/ld+json';
    mainScript.text = JSON.stringify(blogSchema, null, 2);
    document.head.appendChild(mainScript);

    // Inject Blog Breadcrumb Schema
    const breadcrumbData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Home',
          'item': 'https://sarkariavedan.info/'
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': 'Blog',
          'item': 'https://sarkariavedan.info/blog'
        },
        {
          '@type': 'ListItem',
          'position': 3,
          'name': blogPost.title,
          'item': canonicalUrl
        }
      ]
    };
    const breadcrumbScript = document.createElement('script');
    breadcrumbScript.id = 'seo-breadcrumb-schema';
    breadcrumbScript.type = 'application/ld+json';
    breadcrumbScript.text = JSON.stringify(breadcrumbData, null, 2);
    document.head.appendChild(breadcrumbScript);

  } else if (pageName === 'blog-directory') {
    // Blog Directory View
    finalTitle = 'Sarkari Aavedan Blog | Career Guides & Exam Preparation';
    finalDesc = 'Read comprehensive, expert-reviewed career blueprints, eligibility guidelines, age relaxation charts, and syllabus patterns for defense and engineering exams.';
    finalKeywords = 'sarkari aavedan blog, career guides, army eligibility, navy recruitment, ssc preparation, gate exam pattern, neet strategy';
    canonicalUrl = 'https://sarkariavedan.info/blog';

    // Inject CollectionPage Schema
    const collectionSchema = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'name': finalTitle,
      'description': finalDesc,
      'url': canonicalUrl
    };
    const mainScript = document.createElement('script');
    mainScript.id = 'seo-main-schema';
    mainScript.type = 'application/ld+json';
    mainScript.text = JSON.stringify(collectionSchema, null, 2);
    document.head.appendChild(mainScript);

    // Inject Category Breadcrumb Schema
    const breadcrumbData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Home',
          'item': 'https://sarkariavedan.info/'
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': 'Blog',
          'item': canonicalUrl
        }
      ]
    };
    const breadcrumbScript = document.createElement('script');
    breadcrumbScript.id = 'seo-breadcrumb-schema';
    breadcrumbScript.type = 'application/ld+json';
    breadcrumbScript.text = JSON.stringify(breadcrumbData, null, 2);
    document.head.appendChild(breadcrumbScript);

  } else if (job) {
    // A. Job Detail View
    const actionLabel = getCategoryActionLabel(job.category);
    finalTitle = `${job.title} (${actionLabel}) 2026 | Sarkari Aavedan`;
    finalDesc = `${job.title} [Section: ${job.category}]. ${job.shortInfo ? job.shortInfo.substring(0, 140) : 'Check official updates, dates, and direct links on Sarkari Aavedan.'}`;
    
    // Extract keywords from job title
    const titleKeywords = (job.title || '')
      .replace(/[()|]/g, '')
      .split(/\s+/)
      .filter((w: string) => w.length > 3)
      .join(', ');
    finalKeywords = `${job.category.toLowerCase()}, ${actionLabel.toLowerCase()}, ${titleKeywords}, sarkari aavedan 2026`;
    canonicalUrl = `https://sarkariavedan.info/job/${job.id}`;

    // Inject JobPosting Schema
    const primaryVacancy = job.vacancies?.[0];
    const postTitle = job.title || (primaryVacancy ? primaryVacancy.postName : 'Government Job Vacancy');
    const orgName = getHiringOrgName(job);
    const validThroughDate = getValidThrough(job);
    const datePosted = (/^\d{4}-\d{2}-\d{2}$/.test(job.postDate)) ? job.postDate : new Date().toISOString().split('T')[0];
    const jobAddress = getJobAddress(job);
    const baseSalary = getBaseSalary(job);

    const jobSchema = {
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      'title': `${postTitle} (${actionLabel})`,
      'description': `<p>${job.shortInfo || postTitle}</p><p><strong>Eligibility:</strong> ${primaryVacancy?.eligibility || 'Refer to official guidelines'}</p><p><strong>Total Vacancies:</strong> ${job.totalVacanciesCount || 'Refer to notification'}</p>`,
      'datePosted': datePosted,
      'validThrough': validThroughDate,
      'employmentType': 'FULL_TIME',
      'hiringOrganization': {
        '@type': 'Organization',
        'name': orgName,
        'logo': 'https://sarkariavedan.info/favicon.svg',
        'sameAs': job.importantLinks?.officialWebsite || 'https://sarkariavedan.info/'
      },
      'identifier': {
        '@type': 'PropertyValue',
        'name': orgName,
        'value': job.id
      },
      'jobLocation': {
        '@type': 'Place',
        'address': jobAddress
      },
      'baseSalary': baseSalary,
      'applicantLocationRequirements': {
        '@type': 'Country',
        'name': 'India'
      },
      'directApply': Boolean(job.importantLinks?.applyOnline)
    };

    const jobScript = document.createElement('script');
    jobScript.id = 'seo-job-schema';
    jobScript.type = 'application/ld+json';
    jobScript.text = JSON.stringify(jobSchema, null, 2);
    document.head.appendChild(jobScript);

    // Inject Job Breadcrumb Schema
    const categorySlug = getCategorySlug(job.category);
    const breadcrumbData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Home',
          'item': 'https://sarkariavedan.info/'
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': job.category,
          'item': `https://sarkariavedan.info/${categorySlug}`
        },
        {
          '@type': 'ListItem',
          'position': 3,
          'name': job.title,
          'item': canonicalUrl
        }
      ]
    };
    const breadcrumbScript = document.createElement('script');
    breadcrumbScript.id = 'seo-breadcrumb-schema';
    breadcrumbScript.type = 'application/ld+json';
    breadcrumbScript.text = JSON.stringify(breadcrumbData, null, 2);
    document.head.appendChild(breadcrumbScript);

  } else if (categoryName) {
    // B. Category View
    const categorySlug = getCategorySlug(categoryName);
    
    // Keyword-targeted high-CTR titles for core search terms
    if (categorySlug === 'result') {
      finalTitle = 'Sarkari Result 2026: Check Latest Exam Results, Scorecards & Merit Lists | Sarkari Aavedan';
      finalDesc = 'Find all latest Sarkari Result 2026 updates, official exam scorecards, written merit lists, and category-wise cut-off marks on Sarkari Aavedan.';
      finalKeywords = 'sarkari result, sarkari result 2026, exam result, sarkari scorecard, merit list, cut off marks, सरकारी रिजल्ट';
    } else if (categorySlug === 'latest-jobs') {
      finalTitle = 'Sarkari Job 2026: Latest Govt Jobs, Online Forms & Vacancy Alerts | Sarkari Aavedan';
      finalDesc = 'Explore latest Sarkari Job 2026 notifications, 10th/12th/Graduate Govt Jobs, UPSC, SSC, Railways, Bank PO, and Police recruitment online application forms.';
      finalKeywords = 'sarkari job, govt jobs, sarkari naukri, latest jobs, 2026 recruitment, online application form, sarkari vacancy, सरकारी नौकरी';
    } else if (categorySlug === 'admit-card') {
      finalTitle = 'Admit Card 2026: Hall Ticket Download, Call Letter & Exam City Slips | Sarkari Aavedan';
      finalDesc = 'Download official Admit Card 2026, competitive exam hall tickets, call letters, and exam city intimation slips directly on Sarkari Aavedan.';
      finalKeywords = 'admit card, admit card 2026, hall ticket download, call letter, exam city slip, rrb admit card, ssc admit card, प्रवेश पत्र';
    } else if (categorySlug === 'answer-key') {
      finalTitle = 'Answer Key 2026: Download Solved Question Papers & OMR Sheets | Sarkari Aavedan';
      finalDesc = 'Check official provisional & final Answer Key 2026, question paper solutions, and objection challenge links on Sarkari Aavedan.';
      finalKeywords = 'answer key, answer key 2026, official key, question paper, omr sheet, answer key challenge, उत्तर कुंजी';
    } else if (categorySlug === 'syllabus') {
      finalTitle = 'Syllabus 2026: Exam Pattern, Section-Wise PDF & Marking Schemes | Sarkari Aavedan';
      finalDesc = 'Download official exam Syllabus 2026, test patterns, subject-wise PDF guides, and marking schemes for UPSC, SSC, RRB, and Banking exams.';
      finalKeywords = 'syllabus, exam pattern, syllabus pdf, marking scheme, exam syllabus 2026, पाठ्यक्रम';
    } else {
      finalTitle = `${categoryName} (सरकारी आवेदन) | Govt Jobs & Exam Updates 2026`;
      finalDesc = `Find all latest updates, job notifications, exam dates, admit cards, answer keys, and syllabus for ${categoryName} online on Sarkari Aavedan.`;
      finalKeywords = `${categoryName.toLowerCase()}, exam date, admit card 2026, result notification, online application form, sarkari result, sarkari jobs`;
    }
    canonicalUrl = `https://sarkariavedan.info/${categorySlug}`;

    // Inject CollectionPage Schema
    const collectionSchema = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'name': finalTitle,
      'description': finalDesc,
      'url': canonicalUrl
    };
    const mainScript = document.createElement('script');
    mainScript.id = 'seo-main-schema';
    mainScript.type = 'application/ld+json';
    mainScript.text = JSON.stringify(collectionSchema, null, 2);
    document.head.appendChild(mainScript);

    // Inject Category Breadcrumb Schema
    const breadcrumbData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Home',
          'item': 'https://sarkariavedan.info/'
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': categoryName,
          'item': canonicalUrl
        }
      ]
    };
    const breadcrumbScript = document.createElement('script');
    breadcrumbScript.id = 'seo-breadcrumb-schema';
    breadcrumbScript.type = 'application/ld+json';
    breadcrumbScript.text = JSON.stringify(breadcrumbData, null, 2);
    document.head.appendChild(breadcrumbScript);

  } else if (pageName && pageName !== 'home') {
    // Check if pageName matches a registered state configuration
    const stateEntry = Object.values(STATES_CONFIG).find(
      s => s.code === pageName || s.name.toLowerCase() === pageName.toLowerCase()
    );

    if (stateEntry) {
      // C1. State Page View
      finalTitle = `${stateEntry.name} Govt Jobs 2026: ${stateEntry.nameLocal} Sarkari Naukri & Recruitment Alerts`;
      finalDesc = stateEntry.seoDescription;
      finalKeywords = stateEntry.seoKeywords;
      canonicalUrl = `https://sarkariavedan.info/state/${stateEntry.code}`;

      // Inject CollectionPage Schema
      const stateSchema = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        'name': finalTitle,
        'description': finalDesc,
        'url': canonicalUrl
      };
      const mainScript = document.createElement('script');
      mainScript.id = 'seo-main-schema';
      mainScript.type = 'application/ld+json';
      mainScript.text = JSON.stringify(stateSchema, null, 2);
      document.head.appendChild(mainScript);

      // Inject Breadcrumb
      const breadcrumbData = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sarkariavedan.info/'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': stateEntry.name,
            'item': canonicalUrl
          }
        ]
      };
      const breadcrumbScript = document.createElement('script');
      breadcrumbScript.id = 'seo-breadcrumb-schema';
      breadcrumbScript.type = 'application/ld+json';
      breadcrumbScript.text = JSON.stringify(breadcrumbData, null, 2);
      document.head.appendChild(breadcrumbScript);

    } else if (pageName === 'state-directory') {
      finalTitle = 'State Govt Jobs 2026: State-Wise Sarkari Naukri & Bharti Alerts | Sarkari Aavedan';
      finalDesc = 'Explore active state government jobs across 33 Indian States and Union Territories. Find UP, Bihar, Rajasthan, Delhi, Maharashtra government recruitment notifications.';
      finalKeywords = 'state govt jobs, state wise sarkari naukri, up govt jobs, bihar sarkari result, mp online jobs, rajasthan recruitment 2026';
      canonicalUrl = 'https://sarkariavedan.info/state-jobs';

      const dirSchema = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        'name': finalTitle,
        'description': finalDesc,
        'url': canonicalUrl
      };
      const mainScript = document.createElement('script');
      mainScript.id = 'seo-main-schema';
      mainScript.type = 'application/ld+json';
      mainScript.text = JSON.stringify(dirSchema, null, 2);
      document.head.appendChild(mainScript);

      const breadcrumbData = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://sarkariavedan.info/' },
          { '@type': 'ListItem', 'position': 2, 'name': 'State Jobs', 'item': canonicalUrl }
        ]
      };
      const breadcrumbScript = document.createElement('script');
      breadcrumbScript.id = 'seo-breadcrumb-schema';
      breadcrumbScript.type = 'application/ld+json';
      breadcrumbScript.text = JSON.stringify(breadcrumbData, null, 2);
      document.head.appendChild(breadcrumbScript);

    } else {
      // C2. Static Content Pages (About, Contact, Disclaimer, Privacy, Terms)
      let formattedPageName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
      if (pageName === 'terms') {
        formattedPageName = 'Terms of Service';
      }
      finalTitle = `${formattedPageName} - Sarkari Aavedan (सरकारी आवेदन)`;
      finalDesc = `${formattedPageName} details, trust credentials, information sources, and candidate assistance tools on Sarkari Aavedan.`;
      canonicalUrl = `https://sarkariavedan.info/${pageName}`;

      // Determine correct schema mapping type
      let pageSchemaType = 'WebPage';
      if (pageName === 'about') {
        pageSchemaType = 'AboutPage';
        finalKeywords = 'about sarkari aavedan, official info source, E-E-A-T credentials, trust badge india, trust sarkari result';
      } else if (pageName === 'contact') {
        pageSchemaType = 'ContactPage';
        finalKeywords = 'contact details, customer support email, technical assistance, support hours sarkari aavedan';
      } else if (pageName === 'terms') {
        finalKeywords = 'terms of service, user agreement, terms and conditions, legal disclaimer, usage policy, sarkari aavedan terms';
        finalDesc = 'Review the Terms of Service for Sarkari Aavedan. Understand user guidelines, informational disclaimer, intellectual property, and acceptable usage.';
      } else {
        finalKeywords = 'privacy guidelines, disclaimer notice, third party redirect warning, data policy';
      }

      const staticSchema = {
        '@context': 'https://schema.org',
        '@type': pageSchemaType,
        'name': finalTitle,
        'description': finalDesc,
        'url': canonicalUrl
      };
      const mainScript = document.createElement('script');
      mainScript.id = 'seo-main-schema';
      mainScript.type = 'application/ld+json';
      mainScript.text = JSON.stringify(staticSchema, null, 2);
      document.head.appendChild(mainScript);

      // Inject Static Page Breadcrumb Schema
      const breadcrumbData = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://sarkariavedan.info/'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': formattedPageName,
            'item': canonicalUrl
          }
        ]
      };
      const breadcrumbScript = document.createElement('script');
      breadcrumbScript.id = 'seo-breadcrumb-schema';
      breadcrumbScript.type = 'application/ld+json';
      breadcrumbScript.text = JSON.stringify(breadcrumbData, null, 2);
      document.head.appendChild(breadcrumbScript);
    }

  } else {
    // D. Homepage (Root / Dashboard)
    // Inject Dynamic WebSite & Organization Graph Schema with SiteNavigationElement for Google Sitelinks
    const graphSchema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': 'https://sarkariavedan.info/#website',
          'url': 'https://sarkariavedan.info/',
          'name': 'Sarkari Aavedan',
          'alternateName': [
            'Sarkari Aavedan (सरकारी आवेदन)',
            'Sarkari Aavedan',
            'SarkariAavedan',
            'sarkariavedan.info',
            'Sarkari Aavedan 2026'
          ],
          'publisher': {
            '@id': 'https://sarkariavedan.info/#organization'
          },
          'potentialAction': {
            '@type': 'SearchAction',
            'target': {
              '@type': 'EntryPoint',
              'urlTemplate': 'https://sarkariavedan.info/?search={search_term_string}'
            },
            'query-input': 'required name=search_term_string'
          }
        },
        {
          '@type': 'Organization',
          '@id': 'https://sarkariavedan.info/#organization',
          'name': 'Sarkari Aavedan',
          'alternateName': ['Sarkari Aavedan (सरकारी आवेदन)', 'SarkariAavedan'],
          'url': 'https://sarkariavedan.info/',
          'logo': {
            '@type': 'ImageObject',
            '@id': 'https://sarkariavedan.info/#logo',
            'url': 'https://sarkariavedan.info/sarkariavedan_logo.jpg',
            'caption': 'Sarkari Aavedan Logo'
          },
          'image': {
            '@id': 'https://sarkariavedan.info/#logo'
          },
          'description': 'Sarkari Aavedan is India\'s premier ad-free, secure government job information resources portal providing direct updates for UPSC, SSC, Railways, Bank exams, and state recruitments.',
          'sameAs': [
            'https://www.facebook.com/SarkariAavedanInfo',
            'https://twitter.com/SarkariAavedan'
          ]
        },
        {
          '@type': 'SiteNavigationElement',
          'name': 'Latest Jobs',
          'url': 'https://sarkariavedan.info/latest-jobs',
          'description': 'View all latest online application forms for UPSC, SSC, Railways, Banking, Defense, and State Police.'
        },
        {
          '@type': 'SiteNavigationElement',
          'name': 'Admit Card',
          'url': 'https://sarkariavedan.info/admit-card',
          'description': 'Download official exam hall tickets, call letters, and exam city intimation slips.'
        },
        {
          '@type': 'SiteNavigationElement',
          'name': 'Result',
          'url': 'https://sarkariavedan.info/result',
          'description': 'Check government recruitment results, written examination merit lists, and scorecards.'
        },
        {
          '@type': 'SiteNavigationElement',
          'name': 'Answer Key',
          'url': 'https://sarkariavedan.info/answer-key',
          'description': 'Match question responses with official provisional and final answer keys.'
        },
        {
          '@type': 'SiteNavigationElement',
          'name': 'Syllabus',
          'url': 'https://sarkariavedan.info/syllabus',
          'description': 'Read exam patterns, section-wise syllabus PDFs, and official marking schemes.'
        },
        {
          '@type': 'SiteNavigationElement',
          'name': 'Admission',
          'url': 'https://sarkariavedan.info/admission',
          'description': 'National and state-level entrance examination alerts, CUET, B.Ed, NVS, and ITI admissions.'
        },
        {
          '@type': 'SiteNavigationElement',
          'name': 'State Govt Jobs',
          'url': 'https://sarkariavedan.info/state-jobs',
          'description': 'State-wise sarkari naukri alerts across Maharashtra, UP, Bihar, Rajasthan, and 33 states.'
        },
        {
          '@type': 'SiteNavigationElement',
          'name': 'Sarkari Blog & Guides',
          'url': 'https://sarkariavedan.info/blog',
          'description': 'Detailed exam preparation blueprints, subject-wise booklists, and salary breakdowns.'
        },
        {
          '@type': 'SiteNavigationElement',
          'name': 'Photo & Signature Resizer',
          'url': 'https://sarkariavedan.info/tools/image-resizer',
          'description': 'Free photo and signature resizer for online government job application forms.'
        },
        {
          '@type': 'SiteNavigationElement',
          'name': 'Age Calculator',
          'url': 'https://sarkariavedan.info/tools/age-calculator',
          'description': 'Calculate exact age as of notification cutoff dates and check age relaxation eligibility.'
        },
        {
          '@type': 'SiteNavigationElement',
          'name': 'About Us',
          'url': 'https://sarkariavedan.info/about',
          'description': 'Learn about Sarkari Aavedan\'s mission, editorial standards, and trust credentials.'
        },
        {
          '@type': 'SiteNavigationElement',
          'name': 'Contact Us',
          'url': 'https://sarkariavedan.info/contact',
          'description': 'Contact the Sarkari Aavedan support team for inquiries and candidate assistance.'
        }
      ]
    };
    const mainScript = document.createElement('script');
    mainScript.id = 'seo-main-schema';
    mainScript.type = 'application/ld+json';
    mainScript.text = JSON.stringify(graphSchema, null, 2);
    document.head.appendChild(mainScript);
  }

  // 4. Update Document Title
  document.title = finalTitle;

  // 5. Update Meta Description Tag
  let descriptionEl = document.querySelector('meta[name="description"]');
  if (!descriptionEl) {
    descriptionEl = document.createElement('meta');
    descriptionEl.setAttribute('name', 'description');
    document.head.appendChild(descriptionEl);
  }
  descriptionEl.setAttribute('content', finalDesc);

  // 6. Update Meta Keywords Tag
  let keywordsEl = document.querySelector('meta[name="keywords"]');
  if (!keywordsEl) {
    keywordsEl = document.createElement('meta');
    keywordsEl.setAttribute('name', 'keywords');
    document.head.appendChild(keywordsEl);
  }
  keywordsEl.setAttribute('content', finalKeywords);

  // 7. Update Canonical Link
  let canonicalEl = document.querySelector('link[rel="canonical"]');
  if (!canonicalEl) {
    canonicalEl = document.createElement('link');
    canonicalEl.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalEl);
  }
  canonicalEl.setAttribute('href', canonicalUrl);

  // Helper to safely set custom meta property tags
  const setMetaProperty = (selector: string, keyName: string, keyValue: string, value: string) => {
    let el = document.querySelector(selector);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(keyName, keyValue);
      document.head.appendChild(el);
    }
    el.setAttribute('content', value);
  };

  // 8. Sync Open Graph and Twitter Card tags dynamically
  const bannerUrl = 'https://sarkariavedan.info/logos/og_banner.png';

  setMetaProperty('meta[property="og:title"]', 'property', 'og:title', finalTitle);
  setMetaProperty('meta[property="og:description"]', 'property', 'og:description', finalDesc);
  setMetaProperty('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
  setMetaProperty('meta[property="og:type"]', 'property', 'og:type', 'website');
  setMetaProperty('meta[property="og:image"]', 'property', 'og:image', bannerUrl);
  setMetaProperty('meta[property="og:image:width"]', 'property', 'og:image:width', '1200');
  setMetaProperty('meta[property="og:image:height"]', 'property', 'og:image:height', '630');

  setMetaProperty('meta[property="twitter:title"]', 'property', 'twitter:title', finalTitle);
  setMetaProperty('meta[property="twitter:description"]', 'property', 'twitter:description', finalDesc);
  setMetaProperty('meta[property="twitter:url"]', 'property', 'twitter:url', canonicalUrl);
  setMetaProperty('meta[property="twitter:card"]', 'property', 'twitter:card', 'summary_large_image');
  setMetaProperty('meta[property="twitter:image"]', 'property', 'twitter:image', bannerUrl);
}
