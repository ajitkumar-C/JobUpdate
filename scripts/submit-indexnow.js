import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const HOST = 'sarkariavedan.info';
const KEY = '79c46ad41d844f4698973d449f093115';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const INDEXNOW_API = 'https://api.indexnow.org/indexnow';

/**
 * Extracts all URLs from public/sitemap.xml
 */
function extractUrlsFromSitemap() {
  const sitemapPath = path.join(rootDir, 'public', 'sitemap.xml');
  if (!fs.existsSync(sitemapPath)) {
    console.warn('⚠️  public/sitemap.xml not found! Run scripts/generate-sitemap.js first.');
    return [];
  }

  const content = fs.readFileSync(sitemapPath, 'utf8');
  const locRegex = /<loc>(https:\/\/sarkariavedan\.info[^<]*)<\/loc>/g;
  const urls = [];
  let match;

  while ((match = locRegex.exec(content)) !== null) {
    if (match[1]) {
      urls.push(match[1]);
    }
  }

  return [...new Set(urls)];
}

/**
 * Splits array into chunks of given size
 */
function chunkArray(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

async function submitToIndexNow(urlList, batchIndex, totalBatches) {
  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urlList
  };

  console.log(`📤 Submitting batch ${batchIndex + 1}/${totalBatches} (${urlList.length} URLs) to IndexNow...`);

  try {
    const response = await fetch(INDEXNOW_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    const status = response.status;
    const statusText = response.statusText;

    if (status === 200 || status === 202) {
      console.log(`✅ Batch ${batchIndex + 1}: IndexNow accepted (${status} ${statusText || 'OK'}). URLs queued for real-time indexing!`);
      return true;
    } else if (status === 403) {
      console.warn(`⚠️ Batch ${batchIndex + 1}: IndexNow returned 403 Forbidden.`);
      console.warn(`   Reason: Search engines cannot verify key at ${KEY_LOCATION} yet.`);
      console.warn(`   👉 Make sure the new key file is committed and deployed to Cloudflare Pages.`);
      return false;
    } else {
      const responseBody = await response.text().catch(() => '');
      console.error(`❌ Batch ${batchIndex + 1} failed: HTTP ${status} ${statusText}`);
      if (responseBody) console.error(`   Details: ${responseBody}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Network error submitting batch ${batchIndex + 1}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('======================================================');
  console.log('🚀 IndexNow Real-Time Search Engine URL Submitter');
  console.log('======================================================');
  console.log(`Host:        ${HOST}`);
  console.log(`Key:         ${KEY}`);
  console.log(`KeyLocation: ${KEY_LOCATION}\n`);

  const urls = extractUrlsFromSitemap();
  if (urls.length === 0) {
    console.log('ℹ️  No URLs found to submit.');
    return;
  }

  console.log(`📋 Found ${urls.length} URLs in sitemap.xml.`);

  // IndexNow allows up to 10,000 URLs per request. We'll batch by 2,000 for maximum reliability.
  const BATCH_SIZE = 2000;
  const batches = chunkArray(urls, BATCH_SIZE);

  for (let i = 0; i < batches.length; i++) {
    await submitToIndexNow(batches[i], i, batches.length);
    if (i < batches.length - 1) {
      // Small pause between batches
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  console.log('\n✨ IndexNow submission step finished!');
}

main().catch(err => {
  console.error('Fatal error in submit-indexnow:', err);
});
