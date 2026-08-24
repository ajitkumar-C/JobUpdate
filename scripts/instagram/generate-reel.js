import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import FormData from 'form-data';
import dotenv from 'dotenv';
import { getCategoryTheme } from './template-matcher.js';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function sendToTelegram(imagePaths, jobTitle) {
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
    
    if (!BOT_TOKEN || !CHAT_ID) {
        console.log("No Telegram credentials found. Skipping delivery.");
        return;
    }

    console.log(`Sending ${imagePaths.length} images to Telegram...`);
    
    // Telegram expects an array of InputMediaPhoto for albums
    const mediaGroup = imagePaths.map((p, i) => ({
        type: 'photo',
        media: `attach://photo${i}`,
        caption: i === 0 ? `✅ Reel Assets Ready for: ${jobTitle}` : ''
    }));

    const form = new FormData();
    form.append('chat_id', CHAT_ID);
    form.append('media', JSON.stringify(mediaGroup));
    
    imagePaths.forEach((p, i) => {
        form.append(`photo${i}`, fs.createReadStream(p));
    });

    try {
        await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMediaGroup`, form, {
            headers: form.getHeaders()
        });
        console.log("✅ Delivered successfully to Telegram!");
    } catch (e) {
        console.error("❌ Telegram Delivery Failed:", e.response?.data || e.message);
    }
}

async function run() {
    const jobName = process.argv[2] || "NTPC Green Energy";
    
    // Load job data
    let jobs = [];
    const jobsFile1 = path.resolve(process.cwd(), 'public', 'scraped-jobs.json');
    const jobsFile2 = path.resolve(process.cwd(), 'public', 'scraped-jobs-mh.json');
    const jobsFile3 = path.resolve(process.cwd(), 'scraped-jobs.json'); // Legacy path

    if (fs.existsSync(jobsFile1)) jobs = jobs.concat(JSON.parse(fs.readFileSync(jobsFile1, 'utf8')));
    if (fs.existsSync(jobsFile2)) jobs = jobs.concat(JSON.parse(fs.readFileSync(jobsFile2, 'utf8')));
    if (fs.existsSync(jobsFile3)) jobs = jobs.concat(JSON.parse(fs.readFileSync(jobsFile3, 'utf8')));

    if (jobs.length === 0) {
        console.error("No scraped-jobs JSON files found");
        process.exit(1);
    }
    
    const job = jobs.find(j => j.title.toLowerCase().includes(jobName.toLowerCase())) || jobs[0];

    console.log(`Generating Reel for: ${job.title}`);

    // Read Template
    const templatePath = path.join(__dirname, 'template-reel.html');
    let htmlContent = fs.readFileSync(templatePath, 'utf8');
    
    const themeCSS = getCategoryTheme(job.title);
    htmlContent = htmlContent.replace('</head>', `${themeCSS}</head>`);

    // Extract Variables
    let eligibility = 'Check Full Notification';
    let postName = 'Various Posts';
    let totalPosts = '100+';
    if (job.vacancies && job.vacancies.length > 0) {
        eligibility = job.vacancies[0].eligibility || eligibility;
        postName = job.vacancies[0].postName || postName;
        totalPosts = job.vacancies[0].totalPost || totalPosts;
    }

    let feeGen = '₹0', feeSc = '₹0';
    if (job.fees) {
        feeGen = '₹' + (job.fees.generalObc || '0').replace('/-', '');
        feeSc = '₹' + (job.fees.scStPh || '0').replace('/-', '');
    }

    // Replace Variables
    htmlContent = htmlContent
        .replace('{{TITLE}}', job.title.substring(0, 50) + '...')
        .replace('{{START_DATE}}', job.applicationStart || 'Soon')
        .replace('{{LAST_DATE}}', job.applicationLastDate || 'Check Web')
        .replace('{{EXAM_DATE}}', job.examDate || 'Notify Later')
        .replace('{{TOTAL_POSTS}}', totalPosts)
        .replace('{{POST_NAME}}', postName.substring(0, 30))
        .replace('{{ELIGIBILITY}}', eligibility.substring(0, 60) + '...')
        .replace('{{AGE_LIMIT}}', job.ageLimit ? `${job.ageLimit.min} - ${job.ageLimit.max}` : 'Rules Apply')
        .replace('{{FEE_GEN}}', feeGen)
        .replace('{{FEE_SC}}', feeSc);

    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1920 });
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    const generatedImages = [];
    const publicDir = path.join(process.cwd(), 'public');

    // Hide all slides first, then reveal one by one
    await page.evaluate(() => {
        document.querySelectorAll('.slide').forEach(s => s.style.display = 'none');
    });

    for (let i = 1; i <= 5; i++) {
        // Show current slide
        await page.evaluate((index) => {
            document.getElementById(`slide-${index}`).style.display = 'flex';
        }, i);

        const outPath = path.join(publicDir, `reel_slide_${i}.jpg`);
        await page.screenshot({ path: outPath, type: 'jpeg', quality: 90 });
        generatedImages.push(outPath);
        console.log(`Generated Slide ${i}`);

        // Hide it again
        await page.evaluate((index) => {
            document.getElementById(`slide-${index}`).style.display = 'none';
        }, i);
    }

    await browser.close();

    // Send to Telegram
    await sendToTelegram(generatedImages, job.title);
}

run();
