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

  // ==========================================
  // B. PRE-RENDER INDIVIDUAL JOBS
  // ==========================================
  const jobsPath = path.join(rootDir, 'public', 'scraped-jobs.json');
  if (fs.existsSync(jobsPath)) {
    try {
      const jobs = JSON.parse(fs.readFileSync(jobsPath, 'utf8'));
      console.log(`📑 Pre-rendering ${jobs.length} job pages for search engines and WhatsApp cards...`);

      jobs.forEach((job) => {
        if (!job.id || !job.title) return;

        const cleanDesc = job.shortDescription 
          ? job.shortDescription.substring(0, 158)
          : `${job.title}. Check total vacancies (${job.totalVacancy || 'Various'}), eligibility criteria, important dates, and official apply link on Sarkari Aavedan.`;

        const jobCanonical = `${BASE_URL}/job/${job.id}`;

        const jobSchema = {
          '@context': 'https://schema.org',
          '@type': 'JobPosting',
          'title': job.title,
          'description': cleanDesc,
          'datePosted': job.postDate || '2026-01-01',
          'validThrough': job.lastDate ? '2026-12-31' : undefined,
          'employmentType': 'FULL_TIME',
          'hiringOrganization': {
            '@type': 'Organization',
            'name': 'Government Recruitment Board / Commission',
            'sameAs': BASE_URL
          },
          'jobLocation': {
            '@type': 'Place',
            'address': {
              '@type': 'PostalAddress',
              'addressCountry': 'IN'
            }
          }
        };

        const breadcrumbSchema = {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': BASE_URL },
            { '@type': 'ListItem', 'position': 2, 'name': job.category || 'Jobs', 'item': `${BASE_URL}/latest-jobs` },
            { '@type': 'ListItem', 'position': 3, 'name': job.title, 'item': jobCanonical }
          ]
        };

        const bodyContent = `
          <main style="max-width: 900px; margin: 2rem auto; padding: 1rem; font-family: sans-serif; line-height: 1.6; color: #1e293b;">
            <nav style="font-size: 0.85rem; margin-bottom: 1rem; color: #64748b;">
              <a href="${BASE_URL}" style="color: #2563eb; text-decoration: none;">Home</a> &raquo;
              <span>${escapeHtml(job.category || 'Recruitment')}</span> &raquo;
              <span>${escapeHtml(job.title)}</span>
            </nav>
            <h1 style="font-size: 1.8rem; font-weight: 800; margin-bottom: 0.75rem;">${escapeHtml(job.title)}</h1>
            <div style="background: #f1f5f9; padding: 0.75rem 1rem; border-radius: 6px; margin-bottom: 1.5rem; font-size: 0.9rem;">
              <span><strong>Category:</strong> ${escapeHtml(job.category || 'Latest Job')}</span> |
              <span><strong>Posted Date:</strong> ${escapeHtml(job.postDate || '2026')}</span>
              ${job.totalVacancy ? ` | <span><strong>Total Vacancy:</strong> ${escapeHtml(job.totalVacancy)}</span>` : ''}
              ${job.lastDate ? ` | <span><strong>Last Date:</strong> ${escapeHtml(job.lastDate)}</span>` : ''}
            </div>
            ${job.shortDescription ? `<p style="font-size: 1rem; margin-bottom: 1.5rem;">${escapeHtml(job.shortDescription)}</p>` : ''}
            <div style="margin-top: 1.5rem; padding: 1rem; background: #e0f2fe; border-radius: 8px;">
              <p style="margin: 0; font-weight: 600; color: #0369a1;">
                Loading full interactive specification card, application fee tables, and direct authority apply links...
              </p>
            </div>
          </main>
        `;

        writePrerenderedPage(
          `job/${job.id}`,
          {
            title: `${job.title} - Sarkari Aavedan (सरकारी आवेदन)`,
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
  // D. PRE-RENDER DEFAULT CATEGORIES
  // ==========================================
  const categories = [
    { id: 'latest-jobs', name: 'Latest Jobs (नवीनतम नौकरियां)' },
    { id: 'admit-card', name: 'Admit Card (प्रवेश पत्र)' },
    { id: 'result', name: 'Result (परीक्षा परिणाम)' },
    { id: 'answer-key', name: 'Answer Key (उत्तर कुंजी)' },
    { id: 'syllabus', name: 'Syllabus (पाठ्यक्रम)' },
    { id: 'admission', name: 'Admission (प्रवेश)' },
    { id: 'certificate', name: 'Certificate Verification' },
    { id: 'outsourcing-offline', name: 'Outsourcing & Offline Jobs' },
    { id: 'important', name: 'Important Updates' }
  ];

  categories.forEach((cat) => {
    writePrerenderedPage(
      cat.id,
      {
        title: `${cat.name} 2026 | Sarkari Aavedan (सरकारी आवेदन)`,
        description: `Browse all active ${cat.name} notifications, official exam schedules, application links, and cutoffs on Sarkari Aavedan.`,
        canonical: `${BASE_URL}/${cat.id}`,
        image: `${BASE_URL}/logos/og_banner.png`
      },
      null,
      `<main style="max-width: 900px; margin: 2rem auto; padding: 1rem; font-family: sans-serif;">
        <h1>${escapeHtml(cat.name)} - Sarkari Aavedan 2026</h1>
        <p>Real-time notifications, official dates, and application portals for ${escapeHtml(cat.name)}.</p>
      </main>`
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
