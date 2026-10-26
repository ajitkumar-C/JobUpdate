import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const BASE_URL = 'https://sarkariavedan.info';

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
}

export function prerender() {
  console.log('\n🚀 Starting static pre-rendering (SSG) for Cloudflare Pages...');

  const templatePath = path.join(distDir, 'index.html');
  if (!fs.existsSync(templatePath)) {
    console.error('❌ dist/index.html not found! Run vite build first.');
    return;
  }

  const template = fs.readFileSync(templatePath, 'utf8');
  let totalRendered = 0;

  function writePrerenderedPage(relPath, meta, schemaJson, bodyHtml) {
    const fullPath = path.join(distDir, relPath, 'index.html');
    ensureDirectoryExistence(fullPath);

    // Also write direct clean HTML file (e.g. dist/blog/foo.html) to ensure Cloudflare Pages serves 200 OK directly without 307 redirects
    const directHtmlPath = relPath ? path.join(distDir, `${relPath}.html`) : null;
    if (directHtmlPath) {
      ensureDirectoryExistence(directHtmlPath);
    }

    let html = template;

    // 1. Replace Title
    html = html.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(meta.title)}</title>`);

    // 2. Replace Meta Description
    html = html.replace(
      /<meta\s+name="description"\s+content=".*?"\s*\/?>/i,
      `<meta name="description" content="${escapeHtml(meta.description)}" />`
    );

    // 3. Replace Canonical
    const canonicalTag = `<link rel="canonical" href="${meta.canonical}" />`;
    if (html.includes('<link rel="canonical"')) {
      html = html.replace(/<link\s+rel="canonical"\s+href=".*?"\s*\/?>/i, canonicalTag);
    } else {
      html = html.replace('</head>', `  ${canonicalTag}\n</head>`);
    }

    // 4. Replace Open Graph Tags
    html = html.replace(/<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i, `<meta property="og:title" content="${escapeHtml(meta.title)}" />`);
    html = html.replace(/<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i, `<meta property="og:description" content="${escapeHtml(meta.description)}" />`);
    html = html.replace(/<meta\s+property="og:url"\s+content=".*?"\s*\/?>/i, `<meta property="og:url" content="${meta.canonical}" />`);
    if (meta.image) {
      html = html.replace(/<meta\s+property="og:image"\s+content=".*?"\s*\/?>/i, `<meta property="og:image" content="${meta.image}" />`);
      html = html.replace(/<meta\s+property="twitter:image"\s+content=".*?"\s*\/?>/i, `<meta property="twitter:image" content="${meta.image}" />`);
    }

    // 5. Replace Twitter Cards
    html = html.replace(/<meta\s+property="twitter:title"\s+content=".*?"\s*\/?>/i, `<meta property="twitter:title" content="${escapeHtml(meta.title)}" />`);
    html = html.replace(/<meta\s+property="twitter:description"\s+content=".*?"\s*\/?>/i, `<meta property="twitter:description" content="${escapeHtml(meta.description)}" />`);
    html = html.replace(/<meta\s+property="twitter:url"\s+content=".*?"\s*\/?>/i, `<meta property="twitter:url" content="${meta.canonical}" />`);

    // 6. Inject Schema.org JSON-LD
    if (schemaJson) {
      const schemaScript = `\n    <script type="application/ld+json">\n${JSON.stringify(schemaJson, null, 2)}\n    </script>`;
      html = html.replace('</head>', `${schemaScript}\n</head>`);
    }

    // 7. Inject Pre-rendered Body inside <div id="root">
    if (bodyHtml) {
      const rootOpen = '<div id="root">';
      const rootIdx = html.indexOf(rootOpen);
      if (rootIdx !== -1) {
        const rootClose = '</div>';
        const closeIdx = html.indexOf(rootClose, rootIdx);
        if (closeIdx !== -1) {
          html = html.substring(0, rootIdx + rootOpen.length) + '\n' + bodyHtml + '\n' + html.substring(closeIdx);
        }
      }
    }

    fs.writeFileSync(fullPath, html, 'utf8');
    if (directHtmlPath) {
      fs.writeFileSync(directHtmlPath, html, 'utf8');
    }
    totalRendered++;
  }

  // ==========================================
  // A. PRE-RENDER UTILITY TOOLS
  // ==========================================
  console.log('📦 Pre-rendering high-intent Utility Tools...');
  
  // 1. Photo & Signature Resizer
  writePrerenderedPage(
    'tools/image-resizer',
    {
      title: 'Sarkari Photo & Signature Resizer Online (20KB - 50KB) | Sarkari Aavedan',
      description: 'Easily resize, crop, and compress photo and signature to exact 20 KB - 50 KB and passport dimensions for SSC, UPSC, Banking, and Railway application forms online for free.',
      canonical: `${BASE_URL}/tools/image-resizer`,
      image: `${BASE_URL}/logos/og_banner.png`
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'Sarkari Photo & Signature Resizer',
      'url': `${BASE_URL}/tools/image-resizer`,
      'applicationCategory': 'UtilitiesApplication',
      'operatingSystem': 'All',
      'description': 'Free client-side image resizer to compress photos and signatures to 20-50 KB for Indian government exams.'
    },
    `<main style="max-width: 900px; margin: 2rem auto; padding: 1rem; font-family: sans-serif;">
      <h1>Sarkari Photo & Signature Resizer Online (20 KB – 50 KB)</h1>
      <p>Resize, crop, and compress your passport photograph and signature for SSC CGL, CHSL, MTS, UPSC, and Banking exams directly in your browser with zero server uploads.</p>
    </main>`
  );

  // 2. Age Calculator
  writePrerenderedPage(
    'tools/age-calculator',
    {
      title: 'Sarkari Age Calculator Online (Govt Exam Eligibility) | Sarkari Aavedan',
      description: 'Calculate your exact age as on exam cutoff date with OBC (+3 yrs), SC/ST (+5 yrs), and PwD reservation rules for UPSC, SSC, and Banking exams.',
      canonical: `${BASE_URL}/tools/age-calculator`,
      image: `${BASE_URL}/logos/og_banner.png`
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'Sarkari Age Calculator',
      'url': `${BASE_URL}/tools/age-calculator`,
      'applicationCategory': 'UtilitiesApplication',
      'operatingSystem': 'All',
      'description': 'Interactive age calculation tool for government recruitment exams with caste category reservation relaxations.'
    },
    `<main style="max-width: 900px; margin: 2rem auto; padding: 1rem; font-family: sans-serif;">
      <h1>Sarkari Exam Age Calculator 2026</h1>
      <p>Calculate your exact age in years, months, and days as of any cutoff date with OBC, SC/ST, and PwD age relaxation allowances.</p>
    </main>`
  );

  // 3. Static Legal & Informational Pages
  console.log('📜 Pre-rendering static legal & informational pages (terms, privacy, disclaimer, about, contact)...');
  const staticLegalPages = [
    {
      slug: 'terms',
      title: 'Terms of Service - Sarkari Aavedan (सरकारी आवेदन)',
      description: 'Review the Terms of Service for Sarkari Aavedan. Understand user guidelines, informational disclaimer, intellectual property, and acceptable usage.',
      h1: 'Terms of Service / सेवा की शर्तें',
      content: '<p>Rules, user agreements, and service guidelines for Sarkari Aavedan. We are an independent private educational and informational portal providing verified government job alerts.</p>'
    },
    {
      slug: 'privacy',
      title: 'Privacy Policy - Sarkari Aavedan (सरकारी आवेदन)',
      description: 'Read the Privacy Policy of Sarkari Aavedan. Learn how we handle cookies, log files, third-party redirects, and ensure visitor privacy.',
      h1: 'Privacy Policy / गोपनीयता नीति',
      content: '<p>At Sarkari Aavedan, accessible from sarkariavedan.info, one of our main priorities is the privacy of our visitors. Learn how we handle cookies and candidate data.</p>'
    },
    {
      slug: 'disclaimer',
      title: 'Disclaimer - Sarkari Aavedan (सरकारी आवेदन)',
      description: 'Read the official disclaimer for Sarkari Aavedan. We are an independent educational aggregator not affiliated with any government department.',
      h1: 'Disclaimer / अस्वीकरण',
      content: '<p>Sarkari Aavedan is an independent private educational and informational resource. We are not associated, affiliated, or sponsored by any government department or recruiting agency.</p>'
    },
    {
      slug: 'about',
      title: 'About Us - Sarkari Aavedan (सरकारी आवेदन)',
      description: 'Learn about Sarkari Aavedan, India\'s trusted government job update and exam notification portal.',
      h1: 'About Us / हमारे बारे में',
      content: '<p>Sarkari Aavedan is India\'s premier bilingual portal providing real-time alerts for the latest government jobs, exam results, admit cards, and admissions.</p>'
    },
    {
      slug: 'contact',
      title: 'Contact Us - Sarkari Aavedan (सरकारी आवेदन)',
      description: 'Contact the Sarkari Aavedan editorial and support team for queries, corrections, or recruitment announcements.',
      h1: 'Contact Us / संपर्क करें',
      content: '<p>Have queries regarding a job update, advertisement listings, or suggestions? Feel free to contact our support team at ac962017@gmail.com.</p>'
    }
  ];

  staticLegalPages.forEach(p => {
    writePrerenderedPage(
      p.slug,
      {
        title: p.title,
        description: p.description,
        canonical: `${BASE_URL}/${p.slug}`,
        image: `${BASE_URL}/logos/og_banner.png`
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        'name': p.title,
        'description': p.description,
        'url': `${BASE_URL}/${p.slug}`
      },
      `<main style="max-width: 900px; margin: 2rem auto; padding: 1.5rem; font-family: sans-serif; line-height: 1.6; color: #1e293b;">
        <h1 style="font-size: 1.8rem; font-weight: 800; margin-bottom: 1rem;">${p.h1}</h1>
        ${p.content}
      </main>`
    );
  });

  function getCategoryActionLabel(category) {
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

  function getCategorySlug(category) {
    const cat = (category || '').toLowerCase();
    if (cat.includes('latest')) return 'latest-jobs';
    if (cat.includes('admit')) return 'admit-card';
    if (cat.includes('result')) return 'result';
    if (cat.includes('key')) return 'answer-key';
    if (cat.includes('syllabus')) return 'syllabus';
    if (cat.includes('admission')) return 'admission';
    if (cat.includes('certificate')) return 'certificate';
    if (cat.includes('outsource') || cat.includes('offline')) return 'outsourcing-offline';
    if (cat.includes('important')) return 'important';
    return 'latest-jobs';
  }

  function matchJobCategory(jobCat, catId) {
    const c = (jobCat || '').toLowerCase();
    if (catId === 'latest-jobs') return c.includes('latest');
    if (catId === 'admit-card') return c.includes('admit');
    if (catId === 'result') return c.includes('result');
    if (catId === 'answer-key') return c.includes('key');
    if (catId === 'syllabus') return c.includes('syllabus');
    if (catId === 'admission') return c.includes('admission');
    if (catId === 'certificate') return c.includes('certificate');
    if (catId === 'outsourcing-offline') return c.includes('outsource') || c.includes('offline');
    if (catId === 'important') return c.includes('important');
    return false;
  }

  // ==========================================
  // SCHEMA HELPERS FOR JOB POSTINGS (Google Jobs Compliance)
  // ==========================================
  function getJobAddress(job) {
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

    return {
      '@type': 'PostalAddress',
      'streetAddress': 'Central Secretariat, Rajpath Area',
      'addressLocality': 'New Delhi',
      'addressRegion': 'Delhi',
      'postalCode': '110001',
      'addressCountry': 'IN'
    };
  }

  function getBaseSalary(job) {
    const text = `${job?.salary || ''} ${job?.title || ''}`;

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

    const levelMatch = text.match(/level[\s-]*([0-9]{1,2})/i);
    if (levelMatch) {
      const lvl = parseInt(levelMatch[1], 10);
      const payMatrix = {
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

  function getValidThrough(job, fallbackDays = 60) {
    const rawDate = job?.applicationLastDate || job?.lastDate || job?.feeLastDate || '';
    let parsedDate = null;

    const isoMatch = String(rawDate).match(/(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
      parsedDate = new Date(`${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}T23:59:59Z`);
    }

    if (!parsedDate || isNaN(parsedDate.getTime())) {
      const dmyMatch = String(rawDate).match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
      if (dmyMatch) {
        const day = dmyMatch[1].padStart(2, '0');
        const month = dmyMatch[2].padStart(2, '0');
        const year = dmyMatch[3];
        parsedDate = new Date(`${year}-${month}-${day}T23:59:59Z`);
      }
    }

    if (!parsedDate || isNaN(parsedDate.getTime())) {
      const months = {
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

    const now = new Date();
    if (parsedDate && !isNaN(parsedDate.getTime()) && parsedDate.getTime() > now.getTime()) {
      return parsedDate.toISOString().replace(/\.\d{3}Z$/, 'Z');
    }

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

  function getHiringOrgName(job) {
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

  // ==========================================
  // B. PRE-RENDER INDIVIDUAL JOBS
  // ==========================================
  let allScrapedJobs = [];
  const jobsPath = path.join(rootDir, 'public', 'scraped-jobs.json');
  if (fs.existsSync(jobsPath)) {
    try {
      allScrapedJobs = JSON.parse(fs.readFileSync(jobsPath, 'utf8'));
      console.log(`📑 Pre-rendering ${allScrapedJobs.length} job pages for search engines and WhatsApp cards...`);

      allScrapedJobs.forEach((job) => {
        if (!job.id || !job.title) return;

        const actionLabel = getCategoryActionLabel(job.category);
        const catSlug = getCategorySlug(job.category);

        const cleanDesc = job.shortInfo || job.shortDescription || 
          `${job.title} [${job.category}]. Check total vacancies (${job.totalVacanciesCount || job.totalVacancy || 'Various'}), eligibility criteria, important dates, and official links on Sarkari Aavedan.`;

        const jobCanonical = `${BASE_URL}/job/${job.id}`;
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
          'description': cleanDesc,
          'datePosted': datePosted,
          'validThrough': validThroughDate,
          'employmentType': 'FULL_TIME',
          'hiringOrganization': {
            '@type': 'Organization',
            'name': orgName,
            'sameAs': job.importantLinks?.officialWebsite || BASE_URL,
            'logo': `${BASE_URL}/favicon.svg`
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

        const breadcrumbSchema = {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': BASE_URL },
            { '@type': 'ListItem', 'position': 2, 'name': job.category || 'Section', 'item': `${BASE_URL}/${catSlug}` },
            { '@type': 'ListItem', 'position': 3, 'name': job.title, 'item': jobCanonical }
          ]
        };

        const bodyContent = `
          <main style="max-width: 900px; margin: 2rem auto; padding: 1rem; font-family: sans-serif; line-height: 1.6; color: #1e293b;">
            <nav style="font-size: 0.85rem; margin-bottom: 1rem; color: #64748b;">
              <a href="${BASE_URL}" style="color: #2563eb; text-decoration: none;">Home</a> &raquo;
              <a href="${BASE_URL}/${catSlug}" style="color: #2563eb; text-decoration: none; font-weight: 600;">${escapeHtml(job.category || 'Section')}</a> &raquo;
              <span>${escapeHtml(job.title)}</span>
            </nav>
            <div style="display: inline-block; margin-bottom: 0.75rem; padding: 0.35rem 0.85rem; border-radius: 999px; background: #e0f2fe; color: #0369a1; font-weight: 800; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px;">
              Section: ${escapeHtml(job.category || 'Recruitment')}
            </div>
            <h1 style="font-size: 1.8rem; font-weight: 800; margin-bottom: 0.75rem;">${escapeHtml(job.title)}</h1>
            <div style="background: #f1f5f9; padding: 0.75rem 1rem; border-radius: 6px; margin-bottom: 1.5rem; font-size: 0.9rem;">
              <span><strong>Section:</strong> ${escapeHtml(job.category || 'Latest Job')}</span> |
              <span><strong>Posted Date:</strong> ${escapeHtml(job.postDate || '2026')}</span>
              ${job.totalVacanciesCount || job.totalVacancy ? ` | <span><strong>Total Vacancy:</strong> ${escapeHtml(job.totalVacanciesCount || job.totalVacancy)}</span>` : ''}
              ${job.applicationLastDate || job.lastDate ? ` | <span><strong>Last Date:</strong> ${escapeHtml(job.applicationLastDate || job.lastDate)}</span>` : ''}
            </div>
            ${job.shortInfo || job.shortDescription ? `<p style="font-size: 1rem; margin-bottom: 1.5rem;">${escapeHtml(job.shortInfo || job.shortDescription)}</p>` : ''}
            <div style="margin-top: 1.5rem; padding: 1rem; background: #e0f2fe; border-radius: 8px;">
              <p style="margin: 0; font-weight: 600; color: #0369a1;">
                Loading full interactive specification card, official links, and guidelines for ${escapeHtml(job.category)}...
              </p>
            </div>
          </main>
        `;

        writePrerenderedPage(
          `job/${job.id}`,
          {
            title: `${job.title} (${actionLabel}) 2026 | Sarkari Aavedan`,
            description: cleanDesc,
            canonical: jobCanonical,
            image: `${BASE_URL}/logos/og_banner.png`
          },
          { '@graph': [jobSchema, breadcrumbSchema] },
          bodyContent
        );
      });
    } catch (e) {
      console.error('⚠️ Error reading or pre-rendering scraped jobs:', e.message);
    }
  }

  // ==========================================
  // C. PRE-RENDER BLOG POSTS
  // ==========================================
  const blogIndexPath = path.join(rootDir, 'public', 'blog', 'posts-index.json');
  if (fs.existsSync(blogIndexPath)) {
    try {
      const posts = JSON.parse(fs.readFileSync(blogIndexPath, 'utf8'));
      console.log(`📰 Pre-rendering ${posts.length} blog articles...`);

      posts.forEach((post) => {
        if (!post.id || !post.title) return;

        const postCanonical = `${BASE_URL}/blog/${post.id}`;
        const postDesc = post.summary || post.title;
        const postImg = post.image ? `${BASE_URL}${post.image}` : `${BASE_URL}/logos/og_banner.png`;

        const articleSchema = {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          'headline': post.title,
          'description': postDesc,
          'image': postImg,
          'datePublished': post.publishedDate || '2026-01-01',
          'author': {
            '@type': 'Organization',
            'name': 'Sarkari Aavedan Editorial Team'
          },
          'publisher': {
            '@type': 'Organization',
            'name': 'Sarkari Aavedan',
            'logo': {
              '@type': 'ImageObject',
              'url': `${BASE_URL}/sarkariavedan_logo.jpg`
            }
          },
          'url': postCanonical
        };

        const blogBody = `
          <main style="max-width: 850px; margin: 2rem auto; padding: 1rem; font-family: sans-serif; line-height: 1.6;">
            <nav style="font-size: 0.85rem; margin-bottom: 1rem; color: #64748b;">
              <a href="${BASE_URL}" style="color: #2563eb; text-decoration: none;">Home</a> &raquo;
              <a href="${BASE_URL}/blog" style="color: #2563eb; text-decoration: none;">Blog</a> &raquo;
              <span>${escapeHtml(post.title)}</span>
            </nav>
            <h1 style="font-size: 2rem; font-weight: 800; margin-bottom: 1rem;">${escapeHtml(post.title)}</h1>
            <p style="font-size: 0.9rem; color: #64748b;">Published: ${escapeHtml(post.publishedDate || '2026')} | ${escapeHtml(post.readTime || '5 min read')}</p>
            <p style="font-size: 1.1rem; color: #334155; margin-top: 1rem;">${escapeHtml(postDesc)}</p>
          </main>
        `;

        writePrerenderedPage(
          `blog/${post.id}`,
          {
            title: `${post.title} | Sarkari Aavedan`,
            description: postDesc,
            canonical: postCanonical,
            image: postImg
          },
          articleSchema,
          blogBody
        );
      });
    } catch (e) {
      console.error('⚠️ Error pre-rendering blog posts:', e.message);
    }
  }

  // ==========================================
  // D. PRE-RENDER DEFAULT CATEGORIES WITH REAL JOBS
  // ==========================================
  const categories = [
    {
      id: 'latest-jobs',
      name: 'Latest Jobs',
      hindi: 'नवीनतम नौकरियां',
      customTitle: 'Sarkari Job 2026: Latest Govt Jobs, Online Forms & Vacancy Alerts | Sarkari Aavedan',
      customDesc: 'Explore latest Sarkari Job 2026 notifications, 10th/12th/Graduate Govt Jobs, UPSC, SSC, Railways, Bank PO, and Police recruitment online application forms.',
      h1: 'Sarkari Job 2026 (नवीनतम सरकारी नौकरी) — Online Govt Jobs & Vacancies',
      desc: 'Browse all active government recruitment applications, exams, and vacancies for 2026.'
    },
    {
      id: 'result',
      name: 'Result',
      hindi: 'परीक्षा परिणाम',
      customTitle: 'Sarkari Result 2026: Check Latest Exam Results, Scorecards & Merit Lists | Sarkari Aavedan',
      customDesc: 'Find all latest Sarkari Result 2026 updates, official exam scorecards, written merit lists, and category-wise cut-off marks on Sarkari Aavedan.',
      h1: 'Sarkari Result 2026 (सरकारी रिजल्ट) — Exam Results, Scorecards & Cut-Offs',
      desc: 'Check latest Sarkari results, selection merit lists, and scorecards directly.'
    },
    {
      id: 'admit-card',
      name: 'Admit Card',
      hindi: 'प्रवेश पत्र',
      customTitle: 'Admit Card 2026: Hall Ticket Download, Call Letter & Exam City Slips | Sarkari Aavedan',
      customDesc: 'Download official Admit Card 2026, competitive exam hall tickets, call letters, and exam city intimation slips directly on Sarkari Aavedan.',
      h1: 'Admit Card 2026 (प्रवेश पत्र) — Download Hall Tickets & Call Letters',
      desc: 'Download official competitive exam admit cards, call letters, and hall tickets online.'
    },
    {
      id: 'answer-key',
      name: 'Answer Key',
      hindi: 'उत्तर कुंजी',
      customTitle: 'Answer Key 2026: Download Solved Question Papers & OMR Sheets | Sarkari Aavedan',
      customDesc: 'Check official provisional & final Answer Key 2026, question paper solutions, and objection challenge links on Sarkari Aavedan.',
      h1: 'Answer Key 2026 (उत्तर कुंजी) — Download Solved Question Papers & OMR Sheets',
      desc: 'Download official solved answer keys, question paper PDFs, and response sheets.'
    },
    {
      id: 'syllabus',
      name: 'Syllabus',
      hindi: 'पाठ्यक्रम',
      customTitle: 'Syllabus 2026: Exam Pattern, Section-Wise PDF & Marking Schemes | Sarkari Aavedan',
      customDesc: 'Download official exam Syllabus 2026, test patterns, subject-wise PDF guides, and marking schemes for UPSC, SSC, RRB, and Banking exams.',
      h1: 'Syllabus 2026 (पाठ्यक्रम) — Exam Pattern & Section-Wise PDF Guides',
      desc: 'Download section-wise exam patterns, syllabus PDFs, and marking schemes.'
    },
    { id: 'admission', name: 'Admission', hindi: 'प्रवेश', desc: 'Apply online for school, college, polytechnic, and university entrance examinations.' },
    { id: 'certificate', name: 'Certificate Verification', hindi: 'प्रमाण पत्र सत्यापन', desc: 'Direct verification portals for caste, income, domicile certificates, and scholarship status.' },
    { id: 'outsourcing-offline', name: 'Outsourcing & Offline Jobs', hindi: 'आउटसोर्सिंग एवं संविदा नौकरी', desc: 'Apply for contractual vacancies, Sewa Yojan jobs, and offline application forms.' },
    { id: 'important', name: 'Important Updates', hindi: 'महत्वपूर्ण सूचनाएं', desc: 'Essential citizen services, OTR registrations, Aadhaar, Voter ID, and public utility portals.' }
  ];

  categories.forEach((cat) => {
    const matchingJobs = allScrapedJobs.filter(j => matchJobCategory(j.category, cat.id));
    const topCatJobs = matchingJobs.slice(0, 30);

    const catCanonical = `${BASE_URL}/${cat.id}`;
    const pageTitle = cat.customTitle || `${cat.name} (${cat.hindi}) 2026 | Sarkari Aavedan`;
    const pageDesc = cat.customDesc || `${cat.desc} Verified official links, dates, and guidelines.`;
    const headingH1 = cat.h1 || `${cat.name} (${cat.hindi}) 2026`;

    const catSchema = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'name': pageTitle,
      'description': pageDesc,
      'url': catCanonical
    };

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': BASE_URL },
        { '@type': 'ListItem', 'position': 2, 'name': cat.name, 'item': catCanonical }
      ]
    };

    const jobListHtml = topCatJobs.length > 0 ? `
      <div style="margin-top: 1.5rem;">
        <h2 style="font-size: 1.3rem; margin-bottom: 0.75rem;">Active ${escapeHtml(cat.name)} Notifications (${matchingJobs.length} Total)</h2>
        <ul style="padding-left: 1.25rem;">
          ${topCatJobs.map(j => `
            <li style="margin-bottom: 0.75rem;">
              <a href="${BASE_URL}/job/${j.id}" style="color: #2563eb; font-weight: 700; text-decoration: none;">
                ${escapeHtml(j.title)}
              </a>
              ${j.postDate ? ` <span style="font-size: 0.85rem; color: #64748b;">(Posted: ${escapeHtml(j.postDate)})</span>` : ''}
              ${j.lastDate ? ` — <span style="color: #dc2626; font-size: 0.85rem; font-weight: 600;">Last Date: ${escapeHtml(j.lastDate)}</span>` : ''}
            </li>
          `).join('')}
        </ul>
      </div>
    ` : '<p>No active notifications in this section currently.</p>';

    const catBody = `
      <main style="max-width: 900px; margin: 2rem auto; padding: 1rem; font-family: sans-serif; line-height: 1.6; color: #1e293b;">
        <nav style="font-size: 0.85rem; margin-bottom: 1rem; color: #64748b;">
          <a href="${BASE_URL}" style="color: #2563eb; text-decoration: none;">Home</a> &raquo;
          <span>${escapeHtml(cat.name)}</span>
        </nav>
        <h1 style="font-size: 1.9rem; font-weight: 800; margin-bottom: 0.5rem;">
          ${escapeHtml(headingH1)}
        </h1>
        <p style="font-size: 1.05rem; color: #334155; margin-bottom: 1.5rem;">${escapeHtml(pageDesc)}</p>
        ${jobListHtml}
      </main>
    `;

    writePrerenderedPage(
      cat.id,
      {
        title: pageTitle,
        description: pageDesc,
        canonical: catCanonical,
        image: `${BASE_URL}/logos/og_banner.png`
      },
      { '@graph': [catSchema, breadcrumbSchema] },
      catBody
    );
  });

  // ==========================================
  // E. PRE-RENDER STATE DIRECTORY & STATE HUBS
  // ==========================================
  console.log('🌏 Pre-rendering State Jobs Directory & State Hub Pages...');

  // 1. State Directory
  writePrerenderedPage(
    'state-jobs',
    {
      title: 'State Govt Jobs 2026: State-Wise Sarkari Naukri & Bharti Alerts | Sarkari Aavedan',
      description: 'Explore active state government jobs across 33 Indian States and Union Territories. Find UP, Bihar, Rajasthan, Delhi, Maharashtra government recruitment notifications.',
      canonical: `${BASE_URL}/state-jobs`,
      image: `${BASE_URL}/logos/og_banner.png`
    },
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'name': 'State Govt Jobs 2026: State-Wise Sarkari Naukri & Bharti Alerts',
      'description': 'Explore active state government jobs across 33 Indian States and Union Territories.',
      'url': `${BASE_URL}/state-jobs`
    },
    `<main style="max-width: 900px; margin: 2rem auto; padding: 1rem; font-family: sans-serif; line-height: 1.6;">
      <nav style="font-size: 0.85rem; margin-bottom: 1rem; color: #64748b;">
        <a href="${BASE_URL}" style="color: #2563eb; text-decoration: none;">Home</a> &raquo;
        <span>State Jobs Directory</span>
      </nav>
      <h1>State Government Jobs 2026 (राज्य सरकार भर्ती)</h1>
      <p>Access state-wise government job recruitments, admit cards, and exam results across all 33 Indian States & Union Territories. Select your state to view active public service commission, police bharti, and local departmental vacancies.</p>
      <ul>
        <li><a href="${BASE_URL}/state/up" style="color: #2563eb; font-weight: 600;">Uttar Pradesh (UP) Govt Jobs 2026</a> — UP Police, UPSSSC, UPPSC Vacancies</li>
        <li><a href="${BASE_URL}/state/bihar" style="color: #2563eb; font-weight: 600;">Bihar Govt Jobs 2026</a> — BPSC, BSSC, Bihar Police</li>
        <li><a href="${BASE_URL}/state/delhi" style="color: #2563eb; font-weight: 600;">Delhi Govt Jobs 2026</a> — DSSSB, Delhi Police</li>
        <li><a href="${BASE_URL}/state/rajasthan" style="color: #2563eb; font-weight: 600;">Rajasthan Govt Jobs 2026</a> — RPSC, RSMSSB</li>
        <li><a href="${BASE_URL}/state/mp" style="color: #2563eb; font-weight: 600;">Madhya Pradesh (MP) Govt Jobs 2026</a> — MPPSC, MPESB</li>
        <li><a href="${BASE_URL}/state/mh" style="color: #2563eb; font-weight: 600;">Maharashtra Govt Jobs 2026</a> — MPSC, Police Bharti</li>
      </ul>
    </main>`
  );

  // 2. Individual State Hubs
  const stateMeta = {
    up: {
      name: 'Uttar Pradesh',
      title: 'UP Govt Jobs 2026: Uttar Pradesh Sarkari Naukri, UPSSSC, UP Police Vacancy | Sarkari Aavedan',
      desc: 'UP Govt Jobs 2026: Apply online for UP Police Constable/SI, UPSSSC Lekhpal/PET, UPPSC PCS, UP Basic Education Shikshak Bharti, Admit Cards, and Results in Uttar Pradesh.'
    },
    bihar: {
      name: 'Bihar',
      title: 'Bihar Govt Jobs 2026: BPSC, BSSC, Bihar Police Sarkari Naukri | Sarkari Aavedan',
      desc: 'Latest Bihar Govt Jobs 2026: Apply online for BPSC Civil Services, BSSC CGL/Inter Level, Bihar Police Constable/SI, STET Teacher recruitment, and admit cards.'
    },
    delhi: {
      name: 'Delhi',
      title: 'Delhi Govt Jobs 2026: DSSSB, Delhi Police Recruitment Alerts | Sarkari Aavedan',
      desc: 'Latest Delhi Government Jobs 2026: Apply for DSSSB Teacher, Junior Assistant, Delhi Police Constable/SI, and municipal corporation recruitments.'
    },
    rajasthan: {
      name: 'Rajasthan',
      title: 'Rajasthan Govt Jobs 2026: RPSC, RSMSSB Sarkari Naukri | Sarkari Aavedan',
      desc: 'Rajasthan Govt Jobs 2026: Apply for RPSC RAS, RSMSSB CET, Rajasthan Police Constable, REET, Patwari, and state department vacancies.'
    },
    mp: {
      name: 'Madhya Pradesh',
      title: 'MP Govt Jobs 2026: MPPSC, MPESB Sarkari Naukri & Vyapam Bharti | Sarkari Aavedan',
      desc: 'Latest MP Government Jobs 2026: Apply for MPPSC State Service, MP Police Constable, MP Vyapam/ESB Teacher, and departmental vacancies.'
    },
    mh: {
      name: 'Maharashtra',
      title: 'Maharashtra Govt Jobs 2026: MPSC, Maha Police Bharti (सरकारी नोकऱ्या) | Sarkari Aavedan',
      desc: 'Latest Maharashtra Government Jobs 2026: Apply for MPSC Rajyaseva, Maharashtra Police Bharti, Talathi, Zilla Parishad, and Arogya Vibhag recruitments.'
    }
  };

  const stateDir = path.join(rootDir, 'public', 'states');
  if (fs.existsSync(stateDir)) {
    const states = fs.readdirSync(stateDir).filter(f => fs.statSync(path.join(stateDir, f)).isDirectory());
    console.log(`🗺️ Pre-rendering ${states.length} State Hub pages...`);

    states.forEach(code => {
      const stateInfo = stateMeta[code] || {
        name: code.charAt(0).toUpperCase() + code.slice(1),
        title: `${code.charAt(0).toUpperCase() + code.slice(1)} Govt Jobs 2026: State Recruitment & Sarkari Naukri | Sarkari Aavedan`,
        desc: `Latest government job alerts in ${code.toUpperCase()} 2026. Apply online for State Public Service Commission, Police, and local departmental recruitments.`
      };

      const stateJsonPath = path.join(stateDir, code, 'scraped-jobs.json');
      let jobListHtml = '';
      let jobCount = 0;

      if (fs.existsSync(stateJsonPath)) {
        try {
          const sJobs = JSON.parse(fs.readFileSync(stateJsonPath, 'utf8'));
          if (Array.isArray(sJobs) && sJobs.length > 0) {
            jobCount = sJobs.length;
            const topJobs = sJobs.slice(0, 15);
            jobListHtml = `
              <div style="margin-top: 1.5rem;">
                <h2 style="font-size: 1.3rem; margin-bottom: 0.75rem;">Active ${escapeHtml(stateInfo.name)} Recruitments (${jobCount} Found)</h2>
                <ul style="padding-left: 1.25rem;">
                  ${topJobs.map(j => `
                    <li style="margin-bottom: 0.6rem;">
                      <strong>${escapeHtml(j.title)}</strong>
                      ${j.district ? ` — <em>${escapeHtml(j.district)}</em>` : ''}
                      ${j.lastDate ? ` | <span style="color: #dc2626;">Last Date: ${escapeHtml(j.lastDate)}</span>` : ''}
                    </li>
                  `).join('')}
                </ul>
              </div>
            `;
          }
        } catch (err) {
          // ignore parsing error
        }
      }

      const stateCanonical = `${BASE_URL}/state/${code}`;

      const stateSchema = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        'name': stateInfo.title,
        'description': stateInfo.desc,
        'url': stateCanonical
      };

      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': BASE_URL },
          { '@type': 'ListItem', 'position': 2, 'name': 'State Jobs', 'item': `${BASE_URL}/state-jobs` },
          { '@type': 'ListItem', 'position': 3, 'name': stateInfo.name, 'item': stateCanonical }
        ]
      };

      const stateBody = `
        <main style="max-width: 900px; margin: 2rem auto; padding: 1rem; font-family: sans-serif; line-height: 1.6; color: #1e293b;">
          <nav style="font-size: 0.85rem; margin-bottom: 1rem; color: #64748b;">
            <a href="${BASE_URL}" style="color: #2563eb; text-decoration: none;">Home</a> &raquo;
            <a href="${BASE_URL}/state-jobs" style="color: #2563eb; text-decoration: none;">State Jobs</a> &raquo;
            <span>${escapeHtml(stateInfo.name)}</span>
          </nav>
          <h1 style="font-size: 1.8rem; font-weight: 800; margin-bottom: 0.5rem;">${escapeHtml(stateInfo.name)} Govt Jobs 2026 — Latest Sarkari Bharti</h1>
          <p style="font-size: 1.05rem; color: #334155;">${escapeHtml(stateInfo.desc)}</p>
          ${jobListHtml}
          <div style="margin-top: 2rem; padding: 1rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h3 style="font-size: 1.1rem; margin-top: 0;">Verified ${escapeHtml(stateInfo.name)} Government Job Notifications</h3>
            <p style="font-size: 0.95rem; margin-bottom: 0; color: #475569;">
              Sarkari Aavedan tracks official state recruitment portals, Public Service Commissions, Police recruitment boards, and departmental vacancy circulars to deliver verified job alerts, admit card download links, and exam result scorecards for ${escapeHtml(stateInfo.name)}.
            </p>
          </div>
        </main>
      `;

      writePrerenderedPage(
        `state/${code}`,
        {
          title: stateInfo.title,
          description: stateInfo.desc,
          canonical: stateCanonical,
          image: `${BASE_URL}/logos/og_banner.png`
        },
        { '@graph': [stateSchema, breadcrumbSchema] },
        stateBody
      );
    });
  }

  console.log(`✅ Static Pre-rendering complete! Total pages generated: ${totalRendered}`);
}

// Auto-run if invoked directly via CLI
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  prerender();
}
