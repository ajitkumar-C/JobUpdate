import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getCategoryTheme } from './template-matcher.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function generateInstagramImage(jobData) {
    const templatePath = path.join(__dirname, 'template-carousel.html');
    let htmlContent = fs.readFileSync(templatePath, 'utf8');

    const title = jobData.title || 'Latest Update';
    const themeCSS = getCategoryTheme(title);
    
    htmlContent = htmlContent.replace('</head>', `${themeCSS}</head>`);
    
    // Dates
    const startDate = jobData.applicationStart || 'Soon';
    const lastDate = jobData.applicationLastDate || 'Check Web';
    const examDate = jobData.examDate || 'Notify Later';

    // Age Limit
    const ageLimit = jobData.ageLimit ? `${jobData.ageLimit.min} - ${jobData.ageLimit.max} Yrs` : 'Check Notification';

    // Fee Details
    let fee1 = ',10';
    let fee2 = ',10';
    if (jobData.fees) {
        fee1 = `,1${(jobData.fees.generalObc || '0').replace('/-', '')}`;
        fee2 = `,1${(jobData.fees.scStPh || '0').replace('/-', '')}`;
    }

    // Vacancies (Extract up to 2 for Carousel slide 3)
    let p1Name = 'Various Posts', p1Count = 'Check Web';
    let p2Name = '-', p2Count = '-';

    if (jobData.vacancies && jobData.vacancies.length > 0) {
        p1Name = jobData.vacancies[0].postName || p1Name;
        p1Count = jobData.vacancies[0].totalPost || p1Count;
        
        if (jobData.vacancies.length > 1) {
            p2Name = jobData.vacancies[1].postName || p2Name;
            p2Count = jobData.vacancies[1].totalPost || p2Count;
        }
    }
    
    // Cleanup long names for the UI boxes
    p1Name = p1Name.substring(0, 30) + (p1Name.length > 30 ? '...' : '');
    p2Name = p2Name.substring(0, 30) + (p2Name.length > 30 ? '...' : '');
    const shortTitle = title.length > 45 ? title.substring(0, 45) + '...' : title;

    // Replace placeholders
    htmlContent = htmlContent
        .replace('{{TITLE}}', shortTitle)
        .replace('{{POST_1_NAME}}', p1Name).replace('{{POST_1_COUNT}}', p1Count)
        .replace('{{POST_2_NAME}}', p2Name).replace('{{POST_2_COUNT}}', p2Count)
        .replace('{{START_DATE}}', startDate)
        .replace('{{LAST_DATE}}', lastDate) 
        .replace('{{EXAM_DATE}}', examDate)
        .replace('{{AGE_LIMIT}}', ageLimit)
        .replace('{{FEE_GEN}}', fee1)
        .replace('{{FEE_SC}}', fee2);

    // Launch puppeteer
    console.log('Launching puppeteer to generate carousel images...');
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    
    // Set viewport to 1080x1080 for Instagram square carousel posts
    await page.setViewport({ width: 1080, height: 1080 });
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    const outputPaths = [];

    // Capture 5 slides
    for (let i = 1; i <= 5; i++) {
        await page.evaluate((slideIndex) => {
            document.querySelectorAll('.slide').forEach(s => s.style.display = 'none');
            document.getElementById(`slide-${slideIndex}`).style.display = 'flex';
        }, i);

        // Allow layout to settle
        await new Promise(r => setTimeout(r, 100));

        const outputPath = path.join(process.cwd(), 'public', `carousel_slide_${i}.jpg`);
        await page.screenshot({ path: outputPath, type: 'jpeg', quality: 95 });
        outputPaths.push(outputPath);
        console.log(`Generated Slide ${i}`);
    }
    
    await browser.close();
    return outputPaths; // Returns an array of 5 local paths
}
