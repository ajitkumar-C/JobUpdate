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
  'gate-preparation-roadmap.png': 'careers-indian-air-force.png',
  'upsc-cse-preparation-guide.png': 'ssc-cgl-exam-guide.png',
  'ibps-po-exam-strategy.png': 'railway-station-master-ntpc.png',
  'ssc-chsl-preparation-strategy.png': 'ssc-cgl-exam-guide.png',
  'rrb-alp-technician-guide.png': 'railway-group-d-recruitment.png',
  'state-pcs-preparation-strategy.png': 'police-constable-bharti.png',
  'ctet-exam-preparation-guide.png': 'gate-preparation-roadmap.png',
  'cds-exam-defense-roadmap.png': 'careers-indian-army.png',
  'rpf-constable-si-recruitment.png': 'police-constable-bharti.png',
  'indian-coast-guard-navik-yantrik.png': 'careers-indian-navy.png',
  'afcat-air-force-entry-guide.png': 'careers-indian-air-force.png',
  'rrb-ntpc-group-d-preparation-strategy-books.png': 'rrb-ntpc-syllabus-exam-pattern.png',
  'ssc-cgl-chsl-90-day-strategy-booklist.png': 'ssc-cgl-exam-guide.png',
  'maharashtra-police-bharti-prep-guide-books.png': 'police-constable-bharti.png',
  'rpf-si-constable-revision-strategy-gk.png': 'rpf-constable-si-recruitment.png',
  'rrb-ntpc-technician-admit-card-exam-date.png': 'rrb-ntpc-syllabus-exam-pattern.png',
  'ssc-gd-cgl-admit-card-exam-shifts-tracker.png': 'ssc-gd-constable-syllabus-guide.png',
  'maharashtra-police-bharti-admit-card-exam-date.png': 'maharashtra-police-bharti-prep-guide-books.png',
  'up-police-constable-clerk-exam-date-admit-card.png': 'police-constable-bharti.png'
};

Object.entries(fallbacks).forEach(([target, source]) => {
  const srcPath = path.join(imgDir, source);
  const destPath = path.join(imgDir, target);
  if (fs.existsSync(destPath)) {
    console.log(`Skipping ${target} - dedicated image already exists.`);
  } else if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${source} to ${target}`);
  } else {
    console.error(`Source ${source} not found!`);
  }
});
