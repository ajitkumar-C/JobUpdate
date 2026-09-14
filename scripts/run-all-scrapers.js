import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const SCRIPTS = [
  { name: '1. National & Central Govt Scraper', file: 'scripts/scrape.js' },
  { name: '2. Maharashtra Deep-Scraper', file: 'scripts/scrape-maharashtra.js' },
  { name: '3. 33 States & UTs Deep-Scraper', file: 'scripts/scrape-all-states.js' },
  { name: '4. XML Sitemap Generator', file: 'scripts/generate-sitemap.js' }
];

function runScript(script) {
  return new Promise((resolve, reject) => {
    console.log(`\n======================================================`);
    console.log(`🚀 RUNNING: ${script.name} (${script.file})`);
    console.log(`======================================================\n`);
    
    const startTime = Date.now();
    const child = spawn('node', [script.file], {
      cwd: rootDir,
      stdio: 'inherit',
      shell: true
    });

    child.on('close', (code) => {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      if (code === 0) {
        console.log(`\n✅ COMPLETED: ${script.name} in ${elapsed}s`);
        resolve();
      } else {
        console.error(`\n❌ FAILED: ${script.name} exited with code ${code}`);
        // We continue even if one fails so other state updates still succeed
        resolve();
      }
    });

    child.on('error', (err) => {
      console.error(`❌ Error starting ${script.name}:`, err.message);
      resolve();
    });
  });
}

async function main() {
  const totalStart = Date.now();
  console.log('======================================================');
  console.log('🌟 Sarkari Aavedan Consolidated All-Scrapers Suite 🌟');
  console.log('======================================================');

  for (const script of SCRIPTS) {
    await runScript(script);
  }

  const totalElapsed = ((Date.now() - totalStart) / 1000).toFixed(1);
  console.log(`\n🎉 All scrapers and sitemap generation completed in ${totalElapsed}s!`);
}

main();
