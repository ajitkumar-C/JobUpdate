/**
 * scripts/scrape-all-states.js
 * 
 * Deep-scrapes state-wise government job postings from govtjobguru.in/government-jobs-openings/
 * maps them to 33 states/UTs, and crawls their individual details pages to extract:
 * - Application fees
 * - Important timelines
 * - Detailed vacancy tables with pay scales
 * - How to apply steps
 * - Dynamic official website, PDF, and application URLs
 * 
 * Excludes Maharashtra (mh) to prevent overwriting the deep-scraped data from scripts/scrape-maharashtra.js.
 */

import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Simple delay helper
const delay = ms => new Promise(res => setTimeout(res, ms));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BASE_OUTPUT_DIR = path.join(__dirname, '../public/states');
const SOURCE_URL = 'https://govtjobguru.in/government-jobs-openings/';

// State ID to config mapping
const STATE_ANCHORS = {
  'an':           'Andaman & Nicobar',
  'arunachal':    'Arunachal Pradesh',
  'andhra':       'Andhra Pradesh',
  'assam':        'Assam',
  'bihar':        'Bihar',
  'chandigarh':   'Chandigarh',
  'chhattisgarh': 'Chhattisgarh',
  'damandiu':     'Daman & Diu',
  'dadar':        'Dadar & Nagar Haveli',
  'delhi':        'Delhi',
  'goa':          'Goa',
  'gujarat':      'Gujarat',
  'haryana':      'Haryana',
  'hp':           'Himachal Pradesh',
  'jk':           'Jammu & Kashmir',
  'jharkhand':    'Jharkhand',
  'karnataka':    'Karnataka',
  'kerala':       'Kerala',
  'mizoram':      'Mizoram',
  'mp':           'Madhya Pradesh',
  // 'maharashtra' is deliberately excluded here
  'manipur':      'Manipur',
  'megha':        'Meghalaya',
  'nagaland':     'Nagaland',
  'odisha':       'Odisha',
  'punjab':       'Punjab',
  'puducherry':   'Puducherry',
  'rajasthan':    'Rajasthan',
  'sikkim':       'Sikkim',
  'tamilnadu':    'Tamil Nadu',
  'telangana':    'Telangana',
  'tripura':      'Tripura',
  'up':           'Uttar Pradesh',
  'uttarakhand':  'Uttarakhand',
  'wb':           'West Bengal'
};

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.get(url, { 
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
      },
      timeout: 15000
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const redirUrl = res.headers.location.startsWith('http') ? res.headers.location : new URL(res.headers.location, url).toString();
        return fetchUrl(redirUrl).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP status ${res.statusCode}`));
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request Timeout'));
    });
  });
}

function parseJobDetailPage(html) {
  const data = {
    fees: [],
    dates: [],
    vacancyList: [],
    howToApply: [],
    officialLinks: {}
  };

  const htmlClean = html.replace(/\s+/g, ' ');

  // 1. Parse Application Fees table
  const feesIdx = htmlClean.indexOf('<h2>Application Fees</h2>');
  if (feesIdx !== -1) {
    const tableIdx = htmlClean.indexOf('<table', feesIdx);
    const tableEndIdx = htmlClean.indexOf('</table>', tableIdx);
    if (tableIdx !== -1 && tableEndIdx !== -1 && tableIdx < tableEndIdx) {
      const tableHtml = htmlClean.substring(tableIdx, tableEndIdx + 8);
      // Row pattern matcher: matches categories and fees
      const rowPattern = /<tr>\s*<td>(.*?)<\/td>\s*<td>(.*?)<\/td>\s*<\/tr>/gi;
      let rowMatch;
      while ((rowMatch = rowPattern.exec(tableHtml)) !== null) {
        const category = rowMatch[1].replace(/<[^>]+>/g, '').trim();
        const fee = rowMatch[2].replace(/<[^>]+>/g, '').trim();
        if (category && category.toLowerCase() !== 'category') {
          data.fees.push({ category, fee });
        }
      }
    }
  }

  // 2. Parse Important Dates table
  const datesIdx = htmlClean.indexOf('<h2>Important Dates</h2>');
  if (datesIdx !== -1) {
    const tableIdx = htmlClean.indexOf('<table', datesIdx);
    const tableEndIdx = htmlClean.indexOf('</table>', tableIdx);
    if (tableIdx !== -1 && tableEndIdx !== -1 && tableIdx < tableEndIdx) {
      const tableHtml = htmlClean.substring(tableIdx, tableEndIdx + 8);
      const rowPattern = /<tr>\s*<td>(.*?)<\/td>\s*<td>(.*?)<\/td>\s*<\/tr>/gi;
      let rowMatch;
      while ((rowMatch = rowPattern.exec(tableHtml)) !== null) {
        const event = rowMatch[1].replace(/<[^>]+>/g, '').trim();
        const date = rowMatch[2].replace(/<[^>]+>/g, '').trim();
        if (event && event.toLowerCase() !== 'event') {
          data.dates.push({ event, date });
        }
      }
    }
  }

  // 3. Parse Vacancies Detail list
  const vacIdx = htmlClean.indexOf('<h2>Vacancies Detail</h2>');
  if (vacIdx !== -1) {
    const olIdx = htmlClean.indexOf('<ol>', vacIdx);
    const olEndIdx = htmlClean.indexOf('</ol>', olIdx);
    if (olIdx !== -1 && olEndIdx !== -1 && olIdx < olEndIdx) {
      const olHtml = htmlClean.substring(olIdx, olEndIdx + 5);
      const liPattern = /<li>\s*<h3>(.*?)<\/h3>(.*?)<\/li>/gi;
      let liMatch;
      while ((liMatch = liPattern.exec(olHtml)) !== null) {
        const postName = liMatch[1].replace(/<[^>]+>/g, '').trim();
        const innerContent = liMatch[2];

        const vacCountMatch = innerContent.match(/No\.\s*of\s*Vacancies:<\/strong>\s*(.*?)\s*<\/li>/i);
        const qualMatch = innerContent.match(/Qualification:<\/strong>\s*(.*?)\s*<\/li>/i);
        const ageMatch = innerContent.match(/Age\s*Limit:<\/strong>\s*(.*?)\s*<\/li>/i);
        const payMatch = innerContent.match(/Pay\s*Scale:<\/strong>\s*(.*?)\s*<\/li>/i);

        data.vacancyList.push({
          postName,
          count: vacCountMatch ? vacCountMatch[1].replace(/<[^>]+>/g, '').trim() : '',
          qualification: qualMatch ? qualMatch[1].replace(/<[^>]+>/g, '').trim() : '',
          ageLimit: ageMatch ? ageMatch[1].replace(/<[^>]+>/g, '').trim() : '',
          payScale: payMatch ? payMatch[1].replace(/<[^>]+>/g, '').trim() : ''
        });
      }
    }
  }

  // 4. Parse How to Apply steps
  const applyIdx = htmlClean.indexOf('<h2>How to Apply</h2>');
  if (applyIdx !== -1) {
    const olIdx = htmlClean.indexOf('<ol>', applyIdx);
    const olEndIdx = htmlClean.indexOf('</ol>', olIdx);
    if (olIdx !== -1 && olEndIdx !== -1 && olIdx < olEndIdx) {
      const olHtml = htmlClean.substring(olIdx, olEndIdx + 5);
      const liPattern = /<li>(.*?)<\/li>/gi;
      let liMatch;
      while ((liMatch = liPattern.exec(olHtml)) !== null) {
        data.howToApply.push(liMatch[1].replace(/<[^>]+>/g, '').trim());
      }
    }
  }

  // 5. Parse Important Links Table
  const linksIdx = htmlClean.indexOf('<h2>Important Links</h2>');
  if (linksIdx !== -1) {
    const tableIdx = htmlClean.indexOf('<table', linksIdx);
    const tableEndIdx = htmlClean.indexOf('</table>', tableIdx);
    if (tableIdx !== -1 && tableEndIdx !== -1 && tableIdx < tableEndIdx) {
      const tableHtml = htmlClean.substring(tableIdx, tableEndIdx + 8);
      const rowPattern = /<tr>\s*<td>(.*?)<\/td>\s*<td>\s*<a\s+href="([^"]+)"/gi;
      let rowMatch;
      while ((rowMatch = rowPattern.exec(tableHtml)) !== null) {
        const desc = rowMatch[1].toLowerCase();
        const url = rowMatch[2];
        if (desc.includes('notification')) {
          data.officialLinks.notificationLink = url;
        } else if (desc.includes('website')) {
          data.officialLinks.officialWebsite = url;
        } else if (desc.includes('apply')) {
          data.officialLinks.applyOnlineLink = url;
        }
      }
    }
  }

  return data;
}

function parseStateTable(html, stateCode, stateName) {
  const anchor = `id="${stateCode}"`;
  const idx = html.indexOf(anchor);
  if (idx === -1) return [];

  const tableIdx = html.indexOf('<table', idx);
  if (tableIdx === -1) return [];

  const tableEndIdx = html.indexOf('</table>', tableIdx);
  if (tableEndIdx === -1) return [];

  const tableHtml = html.substring(tableIdx, tableEndIdx + 8);
  const rowsHtml = tableHtml.replace(/\s+/g, ' ');
  const rowPattern = /<tr[^>]*>(.*?)<\/tr>/gi;
  let rowMatch;
  const rows = [];

  while ((rowMatch = rowPattern.exec(rowsHtml)) !== null) {
    const rowContent = rowMatch[1];
    const tdPattern = /<td[^>]*>(.*?)<\/td>/gi;
    let tdMatch;
    const cols = [];
    while ((tdMatch = tdPattern.exec(rowContent)) !== null) {
      cols.push(tdMatch[1].trim());
    }
    if (cols.length >= 6) {
      rows.push(cols);
    }
  }

  return rows.map((cols) => {
    const orgLinkMatch = cols[0].match(/href="([^"]+)"[^>]*>(.*?)<\/a>/i);
    const orgLink = orgLinkMatch ? orgLinkMatch[1] : null;
    const orgName = orgLinkMatch ? orgLinkMatch[2].replace(/<[^>]+>/g, '').trim() : cols[0].replace(/<[^>]+>/g, '').trim();
    const postName = cols[2].replace(/<[^>]+>/g, '').trim();
    const qualification = cols[3].replace(/<[^>]+>/g, '').trim();
    const deadline = cols[4].replace(/<[^>]+>/g, '').trim().split(' ')[0];
    const detailsLinkMatch = cols[5].match(/href="([^"]+)"/i);
    const detailsLink = detailsLinkMatch ? detailsLinkMatch[1] : null;

    let category = 'Others';
    const lowerPost = postName.toLowerCase();
    if (lowerPost.includes('officer') || lowerPost.includes('assistant') || lowerPost.includes('clerk') || lowerPost.includes('manager')) {
      category = 'Latest Jobs';
    } else if (lowerPost.includes('admit') || lowerPost.includes('hall ticket') || lowerPost.includes('call letter')) {
      category = 'Admit Card';
    } else if (lowerPost.includes('result') || lowerPost.includes('marksheet') || lowerPost.includes('merit')) {
      category = 'Result';
    }

    const cleanTitle = postName.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 50);
    const id = `${stateCode}-${orgName.toLowerCase()}-${cleanTitle}`;

    return {
      id,
      title: `${orgName} Recruitment 2026 – ${postName} Posts`,
      shortInfo: `${orgName} has announced notification for ${postName} posts. Required qualification: ${qualification}. Last date to apply: ${deadline}.`,
      category,
      categoryIcon: category === 'Latest Jobs' ? '📚' : category === 'Admit Card' ? '🛡️' : category === 'Result' ? '🏆' : '🏢',
      categoryMarathi: category,
      district: 'State Level',
      vacancies: cols[1].replace(/<[^>]+>/g, '').trim(),
      lastDate: deadline,
      officialWebsite: orgLink || undefined,
      notificationLink: detailsLink || undefined,
      applyOnlineLink: orgLink || undefined,
      detailsLink,
      state: stateName,
      stateCode: stateCode,
      scrapedAt: new Date().toISOString().split('T')[0]
    };
  });
}

async function main() {
  console.log(`🌏 Scraping multi-state index from: ${SOURCE_URL}`);
  try {
    const html = await fetchUrl(SOURCE_URL);
    
    // Step 1: Collect list of all state jobs
    const stateJobsMap = {};
    let totalJobsCount = 0;

    for (const [code, name] of Object.entries(STATE_ANCHORS)) {
      const stateJobs = parseStateTable(html, code, name);
      if (stateJobs.length > 0) {
        stateJobsMap[code] = stateJobs;
        totalJobsCount += stateJobs.length;
      }
    }

    console.log(`📊 Found ${totalJobsCount} job listings across ${Object.keys(stateJobsMap).length} states.`);
    console.log(`🔍 Starting Phase 2: Deep crawling individual detail pages in batches...\n`);

    // Step 2: Crawl in batches of 10 to protect resources
    const allJobsList = [];
    for (const [code, jobs] of Object.entries(stateJobsMap)) {
      for (const job of jobs) {
        allJobsList.push({ code, job });
      }
    }

    const BATCH_SIZE = 12;
    let completed = 0;

    for (let i = 0; i < allJobsList.length; i += BATCH_SIZE) {
      const batch = allJobsList.slice(i, i + BATCH_SIZE);
      
      await Promise.all(batch.map(async ({ code, job }) => {
        if (job.detailsLink && job.detailsLink.startsWith('https://govtjobguru.in/jobs/')) {
          try {
            const detailHtml = await fetchUrl(job.detailsLink);
            const parsed = parseJobDetailPage(detailHtml);

            // Merge parsed deep details
            job.fees = parsed.fees;
            job.dates = parsed.dates;
            job.vacancyList = parsed.vacancyList;
            job.howToApply = parsed.howToApply;

            // Merge dynamic official links if scraped successfully
            if (parsed.officialLinks.notificationLink) job.notificationLink = parsed.officialLinks.notificationLink;
            if (parsed.officialLinks.officialWebsite) job.officialWebsite = parsed.officialLinks.officialWebsite;
            if (parsed.officialLinks.applyOnlineLink) job.applyOnlineLink = parsed.officialLinks.applyOnlineLink;

            // Extract age limits from vacancy items if any
            if (parsed.vacancyList.length > 0) {
              const ageTerm = parsed.vacancyList.find(v => v.ageLimit)?.ageLimit;
              if (ageTerm) {
                job.ageLimit = ageTerm;
              }
            }
          } catch (err) {
            // Silence error and use current summary information as fallback
          }
        }
      }));

      completed += batch.length;
      process.stdout.write(`  [Progress] Crawled ${completed}/${allJobsList.length} listings...\r`);
      await delay(200); // 200ms delay between batches to respect rate limits
    }
    console.log('\n✅ Deep crawling finished.');

    // Step 3: Save results to state-specific files
    for (const [code, jobs] of Object.entries(stateJobsMap)) {
      const stateDir = path.join(BASE_OUTPUT_DIR, code);
      if (!fs.existsSync(stateDir)) {
        fs.mkdirSync(stateDir, { recursive: true });
      }

      // Cleanup detailsLink property to keep output JSON file size optimized
      const outputJobs = jobs.map(j => {
        const { detailsLink, ...cleaned } = j;
        return cleaned;
      });

      const outputFile = path.join(stateDir, 'scraped-jobs.json');
      fs.writeFileSync(outputFile, JSON.stringify(outputJobs, null, 2));
      console.log(` - Saved ${outputJobs.length} detailed jobs for ${STATE_ANCHORS[code]} (${code})`);
    }

    console.log(`\n🎉 Multi-state deep scraping completed successfully!`);

  } catch (err) {
    console.error('❌ Multi-state deep scraping failed:', err.message);
    process.exit(1);
  }
}

main();
