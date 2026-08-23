import { generateInstagramImage } from './generate-image.js';
import fs from 'fs';
import path from 'path';

async function testGen() {
    const jobsFile = path.resolve(process.cwd(), 'public/scraped-jobs.json');
    const jobsData = JSON.parse(fs.readFileSync(jobsFile, 'utf8'));
    const selectedJob = jobsData[0];
    
    await generateInstagramImage(selectedJob);
    console.log("Done");
}

testGen();
