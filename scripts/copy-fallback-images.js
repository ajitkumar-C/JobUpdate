import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imgDir = path.join(__dirname, '../public/blog/images');

const fallbacks = {
  'agniveer-recruitment-scheme.png': 'careers-indian-army.png',
  'nda-12th-technical-entry.png': 'careers-indian-air-force.png',
  'ssc-cgl-exam-guide.png': 'careers-indian-army.png',
  'railway-group-d-recruitment.png': 'careers-indian-navy.png',
  'railway-station-master-ntpc.png': 'careers-indian-navy.png',
  'police-constable-bharti.png': 'careers-indian-army.png',
  'ssc-mts-havaldar.png': 'careers-indian-army.png',
  'neet-preparation-roadmap.png': 'careers-indian-air-force.png',
  'gate-preparation-roadmap.png': 'careers-indian-air-force.png'
};

Object.entries(fallbacks).forEach(([target, source]) => {
  const srcPath = path.join(imgDir, source);
  const destPath = path.join(imgDir, target);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${source} to ${target}`);
  } else {
    console.error(`Source ${source} not found!`);
  }
});
