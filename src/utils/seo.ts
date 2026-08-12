import type { JobPost } from '../types';

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

/**
 * Utility to dynamically update meta tags, canonical link, and JSON-LD schemas
 * for excellent search engine indexing (E-E-A-T & Google-friendly structure).
 */
export function updateSEO(
  job?: JobPost | null,
  categoryName?: string | null,
  pageName?: string | null
) {
  if (typeof window === 'undefined') return;

  // 1. Setup metadata default values
  const defaultTitle = 'Sarkari Aavedan (सरकारी आवेदन) | Govt Jobs 2026';
  const defaultDesc = 'Sarkari Aavedan (सरकारी आवेदन) provides the latest government jobs, exam results, admit cards, answer keys, syllabus, and admissions. Stay updated in 2026.';
  const defaultKeywords = 'sarkari aavedan, sarkari result, sarkari exam, govt jobs, admit card, results, latest jobs, 2026 recruitment, sarkari update, government job vacancy, सरकारी आवेदन';

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
  if (job) {
    // A. Job Detail View
    finalTitle = `${job.title} - Apply Online | सरकारी आवेदन`;
    finalDesc = `${job.shortInfo.substring(0, 155)}...`;
    
    // Extract keywords from job title
    const titleKeywords = job.title
      .replace(/[()|]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 3)
      .join(', ');
    finalKeywords = `${job.category.toLowerCase()}, ${titleKeywords}, apply online, exam date, result 2026, free job alert, sarkari aavedan`;
    canonicalUrl = `https://sarkariavedan.info/job/${job.id}`;

    // Inject JobPosting Schema
    const primaryVacancy = job.vacancies[0];
    const postName = primaryVacancy ? primaryVacancy.postName : job.title;
    
    const validDate = (dateStr: string) => {
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
      return new Date().toISOString().split('T')[0]; // fallback to today
    };

    const jobSchema = {
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      'title': postName,
      'description': `<p>${job.shortInfo}</p><p><strong>Eligibility:</strong> ${primaryVacancy?.eligibility || 'Refer to official guidelines'}</p>`,
      'datePosted': validDate(job.postDate),
      'validThrough': validDate(job.applicationLastDate) + 'T23:59:59Z',
      'employmentType': 'FULL_TIME',
      'hiringOrganization': {
        '@type': 'Organization',
        'name': 'Sarkari Aavedan',
        'logo': 'https://sarkariavedan.info/favicon.svg',
        'sameAs': job.importantLinks.officialWebsite || 'https://sarkariavedan.info/'
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
    finalTitle = `${categoryName} (सरकारी आवेदन) | Exam Results & Admit Cards 2026`;
    finalDesc = `Find all latest updates, job notifications, exam dates, admit cards, answer keys, and syllabus for ${categoryName} online on Sarkari Aavedan.`;
    finalKeywords = `${categoryName.toLowerCase()}, exam date, admit card 2026, result notification, online application form, sarkari result, sarkari jobs`;
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
    // C. Static Content Pages (About, Contact, Disclaimer, Privacy)
    const formattedPageName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
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

  } else {
    // D. Homepage (Root / Dashboard)
    // Canonical stays 'https://sarkariavedan.info/'
    
    // Inject Dynamic WebSite & Organization Graph Schema
    const graphSchema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': 'https://sarkariavedan.info/#website',
          'url': 'https://sarkariavedan.info/',
          'name': 'Sarkari Aavedan',
          'alternateName': ['Sarkari Aavedan (सरकारी आवेदन)', 'sarkariavedan.info', 'sarkariavedan'],
          'publisher': {
            '@id': 'https://sarkariavedan.info/#organization'
          }
        },
        {
          '@type': 'Organization',
          '@id': 'https://sarkariavedan.info/#organization',
          'name': 'Sarkari Aavedan',
          'url': 'https://sarkariavedan.info/',
          'logo': {
            '@type': 'ImageObject',
            '@id': 'https://sarkariavedan.info/#logo',
            'url': 'https://sarkariavedan.info/favicon.svg',
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
