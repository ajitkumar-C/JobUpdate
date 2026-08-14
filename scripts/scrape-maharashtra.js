/**
 * scripts/scrape-maharashtra.js
 *
 * Scrapes Maharashtra government job listings from mh.indgovtjobs.net.
 * - Phase 1: Scrape listing page → collect job slugs
 * - Phase 2: Deep-scrape each job's detail page → extract official links,
 *            short description, last date, official website, notification PDF
 *
 * Output: public/states/mh/scraped-jobs.json
 *
 * Modular architecture: each state has its own scraper saving to public/states/{code}/
 */

import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR  = path.join(__dirname, '../public/states/mh');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'scraped-jobs.json');
const BASE_URL    = 'https://mh.indgovtjobs.net';

// ─── Config ──────────────────────────────────────────────────────────────────

const CATEGORY_META = {
  'Maharashtra Police Jobs':     { icon: '🛡️', marathi: 'महाराष्ट्र पोलीस भरती' },
  'Teaching Jobs':               { icon: '📚', marathi: 'शिक्षक भरती' },
  'Medical & Health Jobs':       { icon: '🏥', marathi: 'आरोग्य नोकऱ्या' },
  'Engineering Jobs':            { icon: '⚙️', marathi: 'अभियांत्रिकी नोकऱ्या' },
  'Anganwadi Jobs':              { icon: '👶', marathi: 'अंगणवाडी भरती' },
  'Railway Jobs':                { icon: '🚂', marathi: 'रेल्वे भरती' },
  'Bank Jobs':                   { icon: '🏦', marathi: 'बँक नोकऱ्या' },
  'Defence Jobs':                { icon: '🎖️', marathi: 'संरक्षण भरती' },
  'Research & University Jobs':  { icon: '🔬', marathi: 'संशोधन / विद्यापीठ' },
  'Central Government Jobs':     { icon: '🏢', marathi: 'केंद्र सरकारी नोकऱ्या' },
  'MPSC Jobs':                   { icon: '🏛️', marathi: 'एमपीएससी भरती' },
  'MH Govt Jobs':                { icon: '🌏', marathi: 'महाराष्ट्र सरकारी नोकऱ्या' },
};

const SLUG_TO_CATEGORY = {
  'maharashtra-police-jobs':     'Maharashtra Police Jobs',
  'teaching-jobs':               'Teaching Jobs',
  'medical-health-jobs':         'Medical & Health Jobs',
  'medical--health-jobs':        'Medical & Health Jobs',
  'engineering-jobs':            'Engineering Jobs',
  'anganwadi-jobs':              'Anganwadi Jobs',
  'railway-jobs':                'Railway Jobs',
  'bank-jobs':                   'Bank Jobs',
  'defence-jobs':                'Defence Jobs',
  'research-university-jobs':    'Research & University Jobs',
  'research--university-jobs':   'Research & University Jobs',
  'central-government-jobs':     'Central Government Jobs',
  'mpsc-jobs':                   'MPSC Jobs',
  'mh-govt-jobs':                'MH Govt Jobs',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fetchUrl(url, retries = 2) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.get(
      url,
      { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SarkariAavedanBot/1.0)' }, timeout: 10000 },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const loc = res.headers.location.startsWith('http') ? res.headers.location : BASE_URL + res.headers.location;
          return fetchUrl(loc, retries).then(resolve).catch(reject);
        }
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(data));
      }
    );
    req.on('error', err => {
      if (retries > 0) return fetchUrl(url, retries - 1).then(resolve).catch(reject);
      reject(err);
    });
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function extractDistrict(title) {
  const districts = [
    'Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Thane', 'Aurangabad', 'Solapur',
    'Kolhapur', 'Amravati', 'Nanded', 'Sangli', 'Jalgaon', 'Akola', 'Latur',
    'Dhule', 'Ahmednagar', 'Chandrapur', 'Parbhani', 'Jalna', 'Ratnagiri',
    'Satara', 'Beed', 'Osmanabad', 'Buldhana', 'Washim', 'Yavatmal', 'Wardha',
    'Gondia', 'Bhandara', 'Gadchiroli', 'Sindhudurg', 'Raigad', 'Hingoli',
    'Nandurbar', 'Palghar', 'Alandi', 'Khamgaon', 'Chhatrapati Sambhajinagar',
    'Ahilyanagar', 'PCMC', 'BMC', 'NMC', 'TMC', 'Konkan'
  ];
  for (const d of districts) {
    if (title.includes(d)) return d;
  }
  return 'Maharashtra';
}

function extractVacancies(title) {
  const match = title.match(/[–\-]\s*(\d[\d,]*)\s*(Posts?|Vacancies|Seats?)/i);
  return match ? match[1].replace(/,/g, '') : null;
}

// ─── Phase 1: Scrape listing page ────────────────────────────────────────────

function parseListings(html) {
  const jobLinkPattern = /<a\s+href="(\/[a-z0-9][a-z0-9-]+-\d{4}[^"]*\/)"[^>]*data-astro-cid[^>]*>([^<]{15,})<\/a>/g;
  const categoryLinkPattern = /<a\s+href="\/category\/([a-z0-9-]+)\/"[^>]*data-astro-cid[^>]*>([^<]+)<\/a>/g;

  let match;
  const rawLinks = [];
  const seen = new Set();

  while ((match = jobLinkPattern.exec(html)) !== null) {
    const slug = match[1].replace(/^\/|\/$/g, '');
    const title = match[2].trim().replace(/&amp;/g, '&').replace(/&#039;/g, "'");
    if (!seen.has(slug) && title.length > 10 && title !== 'Apply Now') {
      seen.add(slug);
      rawLinks.push({ slug, title });
    }
  }

  const catSlugs = [];
  while ((match = categoryLinkPattern.exec(html)) !== null) {
    catSlugs.push(match[1]);
  }

  return rawLinks.map((link, i) => {
    const catSlug = catSlugs[i] || 'mh-govt-jobs';
    const categoryName = SLUG_TO_CATEGORY[catSlug] || 'MH Govt Jobs';
    const meta = CATEGORY_META[categoryName] || { icon: '🌏', marathi: 'महाराष्ट्र भरती' };
    return {
      slug: link.slug,
      title: link.title,
      category: categoryName,
      categoryIcon: meta.icon,
      categoryMarathi: meta.marathi,
      district: extractDistrict(link.title),
      vacancies: extractVacancies(link.title),
    };
  });
}

// ─── Phase 2: Deep-scrape each detail page ───────────────────────────────────

function extractOfficialLinks(html) {
  /**
   * The MH portal's detail page contains links like:
   *   [Click Here](https://cdn.indgovtjobs.net/...)   ← Notification PDF
   *   [Click Here](https://armyareapune.kvs.ac.in/)   ← Official Website
   *
   * Strategy: collect all external href links that are NOT:
   *   - mh.indgovtjobs.net (their own domain)
   *   - indgovtjobs.net sub-sites (tools, cdn — except cdn which IS the PDF)
   *   - telegram, play.google.com, amazon
   * Then classify them as notification PDF vs official website.
   */
  const linkPattern = /href="(https?:\/\/[^"]+)"[^>]*>([^<]*(?:Click Here|Apply|Notification|Official|Download|Form|Register)[^<]*)<\/a>/gi;
  const allLinkPattern = /href="(https?:\/\/(?!mh\.indgovtjobs\.net|tools\.indgovtjobs\.net|t\.me|play\.google\.com|amazon)[^"]+)"/gi;

  let match;
  const candidates = [];
  const seen = new Set();

  while ((match = allLinkPattern.exec(html)) !== null) {
    const href = match[1];
    if (seen.has(href)) continue;
    // Skip CDN links used for internal purposes & known ad/affiliate domains
    if (href.includes('cdn-cgi') || href.includes('amazon') || href.includes('t.me')) continue;
    seen.add(href);
    candidates.push(href);
  }

  let notificationLink  = null;
  let applyOnlineLink   = null;
  let officialWebsite   = null;

  for (const href of candidates) {
    // PDFs → notification
    if (href.endsWith('.pdf') || href.includes('/pdf') || href.includes('cdn.indgovtjobs.net')) {
      notificationLink = notificationLink || href;
    }
    // Apply / online form patterns
    else if (
      href.includes('apply') || href.includes('register') ||
      href.includes('apply.') || href.includes('/form')
    ) {
      applyOnlineLink = applyOnlineLink || href;
    }
    // Everything else = official website (first external gov/org domain)
    else if (!officialWebsite && (
      href.includes('.gov.in') || href.includes('.ac.in') ||
      href.includes('.org') || href.includes('.nic.in') ||
      href.includes('.edu') || href.includes('.co.in')
    )) {
      officialWebsite = href;
    }
  }

  // If no apply link found but official website found, use official site
  if (!applyOnlineLink && officialWebsite) {
    applyOnlineLink = officialWebsite;
  }

  return { notificationLink, applyOnlineLink, officialWebsite };
}

function extractShortInfo(html) {
  // Extract the first meaningful paragraph from the article body
  const paraMatch = html.match(/<p[^>]*data-astro-cid[^>]*>([^<]{60,400})<\/p>/);
  if (paraMatch) {
    return paraMatch[1].replace(/&amp;/g, '&').replace(/&#039;/g, "'").trim();
  }
  return null;
}

function extractLastDate(html) {
  // Look for date patterns in "Important Dates" section
  const patterns = [
    /Last\s+Date[:\s]+([0-9]{1,2}[-\/][A-Za-z0-9]{1,3}[-\/]\d{2,4})/i,
    /Walk[-\s]?in\s+Interview\s+Date[:\s]+([^\n<]{5,30})/i,
    /Last\s+Date[:\s]+([A-Za-z]+\s+\d{1,2},?\s+\d{4})/i,
    /(\d{1,2}(?:st|nd|rd|th)?\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4})/i,
    /(\d{1,2}-[A-Za-z]{3}-\d{4})/i,
  ];
  for (const p of patterns) {
    const m = html.match(p);
    if (m) return m[1].trim();
  }
  return null;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌏 Phase 1: Scraping Maharashtra Govt Jobs listing...');

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const listingHtml = await fetchUrl(`${BASE_URL}/`);
  const listings = parseListings(listingHtml);

  if (listings.length === 0) {
    console.error('❌ No listings found. Aborting.');
    process.exit(1);
  }

  console.log(`✅ Found ${listings.length} job listings.`);
  console.log(`🔍 Phase 2: Deep-scraping ${listings.length} detail pages for official links...\n`);

  const jobs = [];
  for (let i = 0; i < listings.length; i++) {
    const listing = listings[i];
    const url = `${BASE_URL}/${listing.slug}/`;
    process.stdout.write(`  [${i + 1}/${listings.length}] ${listing.title.substring(0, 60)}... `);

    try {
      const detailHtml = await fetchUrl(url);
      const { notificationLink, applyOnlineLink, officialWebsite } = extractOfficialLinks(detailHtml);
      const shortInfo = extractShortInfo(detailHtml);
      const lastDate  = extractLastDate(detailHtml);

      jobs.push({
        id: listing.slug,
        title: listing.title,
        shortInfo,
        category: listing.category,
        categoryIcon: listing.categoryIcon,
        categoryMarathi: listing.categoryMarathi,
        district: listing.district,
        vacancies: listing.vacancies,
        lastDate,
        officialWebsite,
        notificationLink,
        applyOnlineLink,
        state: 'Maharashtra',
        stateCode: 'mh',
        scrapedAt: new Date().toISOString().split('T')[0],
      });

      const hasLinks = notificationLink || applyOnlineLink || officialWebsite;
      console.log(hasLinks ? '✅' : '⚠️  (no official links)');
    } catch (err) {
      console.log(`❌ ${err.message}`);
      // Still add listing with basic data, just no deep details
      jobs.push({
        id: listing.slug,
        title: listing.title,
        shortInfo: null,
        category: listing.category,
        categoryIcon: listing.categoryIcon,
        categoryMarathi: listing.categoryMarathi,
        district: listing.district,
        vacancies: listing.vacancies,
        lastDate: null,
        officialWebsite: null,
        notificationLink: null,
        applyOnlineLink: null,
        state: 'Maharashtra',
        stateCode: 'mh',
        scrapedAt: new Date().toISOString().split('T')[0],
      });
    }

    // Polite delay to avoid hammering their server
    if (i < listings.length - 1) await sleep(400);
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(jobs, null, 2));

  const withLinks = jobs.filter(j => j.officialWebsite || j.notificationLink || j.applyOnlineLink).length;
  console.log(`\n🎉 Scraping complete!`);
  console.log(`💾 Saved to: ${OUTPUT_FILE}`);
  console.log(`📊 Total jobs: ${jobs.length}`);
  console.log(`🔗 Jobs with official links: ${withLinks}/${jobs.length}`);
}

main();
