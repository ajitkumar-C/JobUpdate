import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getCategoryTheme } from './template-matcher.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function generateInstagramImage(jobData) {
    const templatePath = path.join(__dirname, 'template.html');
    let htmlContent = fs.readFileSync(templatePath, 'utf8');

    const title = jobData.title || 'Latest Update';
    const themeCSS = getCategoryTheme(title);
    
    htmlContent = htmlContent.replace('</head>', `${themeCSS}</head>`);
    
    // Dates
    const startDate = jobData.applicationStart || 'Soon';
    const lastDate = jobData.applicationLastDate || 'Check Web';
    const examDate = jobData.examDate || 'Notify Later';
    const admitCardDate = jobData.admitCardDate || 'Before Exam';

    // Age Limit
    const ageLimit = jobData.ageLimit ? `${jobData.ageLimit.min} - ${jobData.ageLimit.max}` : 'Check Notification';

    // Fee Details split for the box
    let fee1 = 'Gen/OBC: ₹0';
    let fee2 = 'SC/ST: ₹0';
    if (jobData.fees) {
        fee1 = `Gen/OBC: ₹${(jobData.fees.generalObc || '0').replace('/-', '')}`;
        fee2 = `SC/ST: ₹${(jobData.fees.scStPh || '0').replace('/-', '')}`;
    }

    // Vacancies (Extract up to 3)
    let p1Name = 'Various Posts', p1Count = 'Check Web';
    let p2Name = '-', p2Count = '-';
    let p3Name = '-', p3Count = '-';
    let eligibility = 'Check Full Notification';

    if (jobData.vacancies && jobData.vacancies.length > 0) {
        eligibility = jobData.vacancies[0].eligibility || eligibility;
        
        p1Name = jobData.vacancies[0].postName || p1Name;
        p1Count = jobData.vacancies[0].totalPost || p1Count;
        
        if (jobData.vacancies.length > 1) {
            p2Name = jobData.vacancies[1].postName || p2Name;
            p2Count = jobData.vacancies[1].totalPost || p2Count;
        }
        if (jobData.vacancies.length > 2) {
            p3Name = jobData.vacancies[2].postName || p3Name;
            p3Count = jobData.vacancies[2].totalPost || p3Count;
        }
    }
    
    // Cleanup long names for the UI boxes
    p1Name = p1Name.substring(0, 25) + (p1Name.length > 25 ? '...' : '');
    p2Name = p2Name.substring(0, 25) + (p2Name.length > 25 ? '...' : '');
    p3Name = p3Name.substring(0, 25) + (p3Name.length > 25 ? '...' : '');
    eligibility = eligibility.substring(0, 80) + (eligibility.length > 80 ? '...' : '');

    // Dept Name (e.g. ALLAHABAD HIGH COURT RECRUITMENT 2026)
    let deptName = 'LATEST RECRUITMENT 2026';
    if (title.length > 10) {
        const words = title.split(' ');
        deptName = words.slice(0, 5).join(' ').toUpperCase() + ' RECRUITMENT 2026';
    }

    // Replace placeholders
    htmlContent = htmlContent
        .replace('{{DEPT_NAME}}', deptName.substring(0, 45))
        .replace('{{POST_1_NAME}}', p1Name).replace('{{POST_1_COUNT}}', p1Count)
        .replace('{{POST_2_NAME}}', p2Name).replace('{{POST_2_COUNT}}', p2Count)
        .replace('{{POST_3_NAME}}', p3Name).replace('{{POST_3_COUNT}}', p3Count)
        .replace('{{START_DATE}}', startDate)
        .replace(/{{LAST_DATE}}/g, lastDate) // Multiple occurrences
        .replace('{{EXAM_DATE}}', examDate)
        .replace('{{ADMIT_CARD_DATE}}', admitCardDate)
        .replace('{{ELIGIBILITY}}', eligibility)
        .replace('{{AGE_LIMIT}}', ageLimit)
        .replace('{{FEE_DETAILS_1}}', fee1)
        .replace('{{FEE_DETAILS_2}}', fee2);

    // Launch puppeteer
    console.log('Launching puppeteer to generate image...');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Set viewport to 1080x1080 for Instagram square posts
    await page.setViewport({ width: 1080, height: 1080 });
    
    // Load the HTML content
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    // Take screenshot
    const outputPath = path.join(process.cwd(), 'public', 'ig_post_output.jpg');
    await page.screenshot({ path: outputPath, type: 'jpeg', quality: 100 });
    
    await browser.close();
    
    console.log(`✅ Image generated successfully at ${outputPath}`);
    return outputPath;
}
