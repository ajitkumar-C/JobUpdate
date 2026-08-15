/**
 * scripts/scrape-all-states.js
 * 
 * Scrapes state-wise government job postings from govtjobguru.in/government-jobs-openings/
 * maps them to 33 states/UTs, and writes to public/states/[state-code]/scraped-jobs.json.
 * 
 * Excludes Maharashtra (mh) to prevent overwriting the deep-scraped data from scripts/scrape-maharashtra.js.
 */

import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
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
  // 'maharashtra' is deliberately excluded from scraping here to keep scripts/scrape-maharashtra.js clean
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
    protocol.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function parseStateTable(html, stateCode, stateName) {
  const anchor = `id="${stateCode}"`;
  const idx = html.indexOf(anchor);
  if (idx === -1) return [];

  // Find the next <table> tag after this anchor
  const tableIdx = html.indexOf('<table', idx);
  if (tableIdx === -1) return [];

  // Find the closing </table>
  const tableEndIdx = html.indexOf('</table>', tableIdx);
  if (tableEndIdx === -1) return [];

  const tableHtml = html.substring(tableIdx, tableEndIdx + 8);

  // Parse table rows
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
    // Header rows will be skipped automatically since they contain <th> tags or don't match 6 columns of tds
    if (cols.length >= 6) {
      rows.push(cols);
    }
  }

  return rows.map((cols) => {
    // Column 1: Organization link & Name e.g. <a href="...">UKSCB</a>
    const orgLinkMatch = cols[0].match(/href="([^"]+)"[^>]*>(.*?)<\/a>/i);
    const orgLink = orgLinkMatch ? orgLinkMatch[1] : null;
    const orgName = orgLinkMatch ? orgLinkMatch[2].replace(/<[^>]+>/g, '').trim() : cols[0].replace(/<[^>]+>/g, '').trim();

    // Column 3: Post Name
    const postName = cols[2].replace(/<[^>]+>/g, '').trim();

    // Column 4: Qualification
    const qualification = cols[3].replace(/<[^>]+>/g, '').trim();

    // Column 5: Deadline
    const deadline = cols[4].replace(/<[^>]+>/g, '').trim().split(' ')[0]; // Strip "x days left"

    // Column 6: Details link
    const detailsLinkMatch = cols[5].match(/href="([^"]+)"/i);
    const detailsLink = detailsLinkMatch ? detailsLinkMatch[1] : null;

    // Categorize based on qualification / organization / post title
    let category = 'Others';
    const lowerPost = postName.toLowerCase();
    if (lowerPost.includes('officer') || lowerPost.includes('assistant') || lowerPost.includes('clerk') || lowerPost.includes('manager')) {
      category = 'Latest Jobs';
    } else if (lowerPost.includes('admit') || lowerPost.includes('hall ticket') || lowerPost.includes('call letter')) {
      category = 'Admit Card';
    } else if (lowerPost.includes('result') || lowerPost.includes('marksheet') || lowerPost.includes('merit')) {
      category = 'Result';
    }

    // Unique ID generation for state job
    const cleanTitle = postName.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 50);
    const id = `${stateCode}-${orgName.toLowerCase()}-${cleanTitle}`;

    return {
      id,
      title: `${orgName} Recruitment 2026 – ${postName} Posts`,
      shortInfo: `${orgName} has announced notification for ${postName} posts. Required qualification: ${qualification}. Last date to apply: ${deadline}.`,
      category,
      categoryIcon: category === 'Latest Jobs' ? '📚' : category === 'Admit Card' ? '🛡️' : category === 'Result' ? '🏆' : '🏢',
      categoryMarathi: category, // Fallback for state views
      district: 'State Level',
      vacancies: cols[1].replace(/<[^>]+>/g, '').trim(),
      lastDate: deadline,
      officialWebsite: orgLink || undefined,
      notificationLink: detailsLink || undefined,
      applyOnlineLink: orgLink || undefined,
      state: stateName,
      stateCode: stateCode,
      scrapedAt: new Date().toISOString().split('T')[0]
    };
  });
}

async function main() {
  console.log(`🌏 Scraping multi-state job openings from: ${SOURCE_URL}`);
  try {
    const html = await fetchUrl(SOURCE_URL);
    let totalScraped = 0;

    for (const [code, name] of Object.entries(STATE_ANCHORS)) {
      const stateJobs = parseStateTable(html, code, name);
      if (stateJobs.length === 0) continue;

      // Ensure directory exists
      const stateDir = path.join(BASE_OUTPUT_DIR, code);
      if (!fs.existsSync(stateDir)) {
        fs.mkdirSync(stateDir, { recursive: true });
      }

      const outputFile = path.join(stateDir, 'scraped-jobs.json');
      fs.writeFileSync(outputFile, JSON.stringify(stateJobs, null, 2));

      console.log(` - ✅ ${name} (${code}): ${stateJobs.length} jobs saved to ${outputFile}`);
      totalScraped += stateJobs.length;
    }

    console.log(`\n🎉 Multi-state scraping completed successfully!`);
    console.log(`📊 Total states updated: ${Object.keys(STATE_ANCHORS).length}`);
    console.log(`💼 Total jobs scraped: ${totalScraped}`);
  } catch (err) {
    console.error('❌ Multi-state scraping failed:', err.message);
    process.exit(1);
  }
}

main();
