import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://sarkariavedan.info';

// Define static page slugs
const staticPages = [
  '',
  'about',
  'contact',
  'disclaimer',
  'privacy'
];

// Define category slugs matching mockData.ts and syncCategories
const defaultCategories = [
  'latest-jobs',
  'admit-card',
  'result',
  'answer-key',
  'syllabus',
  'admission',
  'certificate',
  'outsourcing-offline',
  'important'
];

function generateSitemap() {
  console.log('🌐 Generating sitemap.xml...');

  const urls = [];

  // 1. Add static pages
  staticPages.forEach(page => {
    const urlPath = page ? `/${page}` : '';
    urls.push({
      loc: `${BASE_URL}${urlPath}`,
      changefreq: 'daily',
      priority: page ? '0.7' : '1.0'
    });
  });

  // 2. Add category pages
  defaultCategories.forEach(catId => {
    urls.push({
      loc: `${BASE_URL}/${catId}`,
      changefreq: 'daily',
      priority: '0.8'
    });
  });

  // 3. Load scraped jobs to extract individual job pages
  const jobsPath = path.join(__dirname, '..', 'public', 'scraped-jobs.json');
  if (fs.existsSync(jobsPath)) {
    try {
      const data = fs.readFileSync(jobsPath, 'utf-8');
      const jobs = JSON.parse(data);
      
      if (Array.isArray(jobs)) {
        jobs.forEach(job => {
          let jobId = job.id;
          // Fallback if ID is somehow missing in JSON
          if (!jobId) {
            const titleSlug = job.title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '');
            jobId = `${job.category.toLowerCase().replace(/\s+/g, '-')}-${titleSlug.substring(0, 50)}`;
          }

          urls.push({
            loc: `${BASE_URL}/job/${jobId}`,
            changefreq: 'weekly',
            priority: '0.6'
          });
        });
        console.log(`✅ Loaded ${jobs.length} jobs from scraped-jobs.json.`);
      }
    } catch (err) {
      console.error('❌ Error reading/parsing scraped-jobs.json for sitemap:', err.message);
    }
  } else {
    console.warn('⚠️ No scraped-jobs.json found in public directory. Sitemap will only contain static and category URLs.');
  }

  // 4. Generate XML content
  const xmlUrls = urls.map(url => `
  <url>
    <loc>${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('');

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlUrls}
</urlset>`;

  // 5. Write to public/sitemap.xml
  const publicDir = path.join(__dirname, '..', 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  const outputPath = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(outputPath, sitemapXml.trim(), 'utf-8');
  console.log(`💾 Sitemap generated successfully at: ${outputPath}`);
}

generateSitemap();
