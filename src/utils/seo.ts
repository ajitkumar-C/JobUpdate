import type { JobPost } from '../types';

export function updateSEO(
  job?: JobPost | null, 
  categoryName?: string | null, 
  pageName?: string | null
) {
  if (typeof window === 'undefined') return;

  // 1. Setup metadata values
  const defaultTitle = 'Sarkari Aavedan (सरकारी आवेदन) | Govt Jobs 2026';
  const defaultDesc = 'Sarkari Aavedan (सरकारी आवेदन) provides the latest government jobs, exam results, admit cards, answer keys, syllabus, and admissions. Stay updated in 2026.';

  let finalTitle = defaultTitle;
  let finalDesc = defaultDesc;

  if (job) {
    finalTitle = `${job.title} - Apply Online | सरकारी आवेदन`;
    finalDesc = `${job.shortInfo.substring(0, 155)}...`;
  } else if (categoryName) {
    finalTitle = `${categoryName} (सरकारी आवेदन) | Exam Results & Admit Cards 2026`;
    finalDesc = `Find all latest updates, job notifications, exam dates, admit cards, answer keys, and syllabus for ${categoryName} online on Sarkari Aavedan.`;
  } else if (pageName) {
    const formattedPageName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
    finalTitle = `${formattedPageName} - Sarkari Aavedan (सरकारी आवेदन)`;
    finalDesc = `${formattedPageName} details, candidate tools, and resources on Sarkari Aavedan.`;
  }

  // 2. Update Title
  document.title = finalTitle;

  // 3. Update Meta Description
  let descriptionEl = document.querySelector('meta[name="description"]');
  if (!descriptionEl) {
    descriptionEl = document.createElement('meta');
    descriptionEl.setAttribute('name', 'description');
    document.head.appendChild(descriptionEl);
  }
  descriptionEl.setAttribute('content', finalDesc);

  // Helper to set or create meta properties
  const setMetaProperty = (selector: string, keyName: string, keyValue: string, value: string) => {
    let el = document.querySelector(selector);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(keyName, keyValue);
      document.head.appendChild(el);
    }
    el.setAttribute('content', value);
  };

  // 4. Update Open Graph & Twitter Social Metadata
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://sarkariavedan.info/';
  const bannerUrl = 'https://sarkariavedan.info/logos/og_banner.png';

  setMetaProperty('meta[property="og:title"]', 'property', 'og:title', finalTitle);
  setMetaProperty('meta[property="og:description"]', 'property', 'og:description', finalDesc);
  setMetaProperty('meta[property="og:url"]', 'property', 'og:url', currentUrl);
  setMetaProperty('meta[property="og:type"]', 'property', 'og:type', 'website');
  setMetaProperty('meta[property="og:image"]', 'property', 'og:image', bannerUrl);
  setMetaProperty('meta[property="og:image:width"]', 'property', 'og:image:width', '1200');
  setMetaProperty('meta[property="og:image:height"]', 'property', 'og:image:height', '630');

  setMetaProperty('meta[property="twitter:title"]', 'property', 'twitter:title', finalTitle);
  setMetaProperty('meta[property="twitter:description"]', 'property', 'twitter:description', finalDesc);
  setMetaProperty('meta[property="twitter:url"]', 'property', 'twitter:url', currentUrl);
  setMetaProperty('meta[property="twitter:card"]', 'property', 'twitter:card', 'summary_large_image');
  setMetaProperty('meta[property="twitter:image"]', 'property', 'twitter:image', bannerUrl);

  // 5. Inject JobPosting JSON-LD Schema
  // Remove existing job schema scripts
  const existingSchemaEl = document.getElementById('seo-job-schema');
  if (existingSchemaEl) {
    existingSchemaEl.remove();
  }

  if (job) {
    // Generate Google JobPosting schema if we have vacancy rows
    const primaryVacancy = job.vacancies[0];
    const postName = primaryVacancy ? primaryVacancy.postName : job.title;
    
    // Default values if dates are not fully specified
    const validDate = (dateStr: string) => {
      // Basic check if it's YYYY-MM-DD
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return dateStr;
      }
      return new Date().toISOString().split('T')[0]; // fallback
    };

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      'title': postName,
      'description': `<p>${job.shortInfo}</p><p><strong>Eligibility:</strong> ${primaryVacancy?.eligibility || 'See details'}</p>`,
      'datePosted': validDate(job.postDate),
      'validThrough': validDate(job.applicationLastDate) + 'T23:59:59Z',
      'employmentType': 'FULL_TIME',
      'hiringOrganization': {
        '@type': 'Organization',
        'name': 'Sarkari Aavedan',
        'sameAs': job.importantLinks.officialWebsite || 'https://sarkariresult.com'
      },
      'jobLocation': {
        '@type': 'Place',
        'address': {
          '@type': 'PostalAddress',
          'addressCountry': 'IN',
          'addressRegion': 'India'
        }
      },
      'baseSalary': {
        '@type': 'MonetaryAmount',
        'currency': 'INR',
        'value': {
          '@type': 'QuantitativeValue',
          'value': 25000,
          'unitText': 'MONTH'
        }
      }
    };

    const scriptEl = document.createElement('script');
    scriptEl.id = 'seo-job-schema';
    scriptEl.type = 'application/ld+json';
    scriptEl.innerHTML = JSON.stringify(schema);
    document.head.appendChild(scriptEl);
  }
}
