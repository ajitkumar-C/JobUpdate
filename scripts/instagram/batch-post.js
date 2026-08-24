import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateInstagramImage } from './generate-image.js';
import dotenv from 'dotenv';
import axios from 'axios';
import FormData from 'form-data';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jobsFile = path.resolve(process.cwd(), 'scraped-jobs.json'); // Main JSON file

// The 6 Jobs requested to be batch posted
const TARGET_JOBS = [
    "NTPC Sail Power Company Limited",
    "NTPC Green Energy Limited Recruitment 2026",
    "SSC Selection Post 14th Recruitment 2026",
    "BMC Recruitment 2026 – 612 Apprentice Posts"
];

// Helper to delay execution (for scheduling 2-3 mins apart)
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function generateCaption(jobTitle, category) {
    const acronymsMatch = jobTitle.match(/\b[A-Z]{3,}\b/g) || [];
    const targetedAcronym = acronymsMatch.length > 0 ? `#${acronymsMatch[0]} ` : '';
    const categoryTag = category ? `#${category.replace(/[^a-zA-Z0-9]/g, '')}` : '';

    return `🚨 NEW VACANCY ALERT! 🚨\n\n` +
           `📌 ${jobTitle}\n\n` +
           `Click the link in our bio to read the full details and apply instantly! 👆\n\n` +
           `👉 Visit: Sarkariavedan.info\n\n` +
           `${targetedAcronym}#SarkariAvedan #SarkariJobs #GovtJobs #SarkariNaukri #SarkariExam #SarkariAvedan2026 ${categoryTag} #UPGovtJobs #LatestJobs`;
}

async function uploadImageToTempHost(imagePath) {
    console.log(`[Upload] Uploading image temporarily to host for Meta API...`);
    const form = new FormData();
    // Using a free anonymous API key for freeimage.host
    form.append('key', '6d207e02198a847aa98d0a2a901485a5');
    form.append('action', 'upload');
    form.append('source', fs.createReadStream(imagePath));
    form.append('format', 'json');
    
    const res = await axios.post('https://freeimage.host/api/1/upload', form, {
        headers: form.getHeaders()
    });
    return res.data.image.url;
}

async function postToMeta(publicImageUrl, caption) {
    const IG_ACCESS_TOKEN = process.env.IG_ACCESS_TOKEN;
    const FB_PAGE_ID = process.env.FB_PAGE_ID;
    const IG_ACCOUNT_ID = process.env.IG_ACCOUNT_ID;

    // 1. Post to Facebook Page
    console.log('  -> Posting to Facebook Page...');
    const fbPublishRes = await axios.post(`https://graph.facebook.com/v20.0/${FB_PAGE_ID}/photos`, {
        url: publicImageUrl,
        message: caption,
        access_token: IG_ACCESS_TOKEN
    });
    console.log(`  ✅ Live on Facebook! ID: ${fbPublishRes.data.id}`);

    // 2. Post to Instagram
    console.log('  -> Posting to Instagram...');
    const igContainerRes = await axios.post(`https://graph.facebook.com/v20.0/${IG_ACCOUNT_ID}/media`, {
        image_url: publicImageUrl,
        caption: caption,
        access_token: IG_ACCESS_TOKEN
    });
    const igPublishRes = await axios.post(`https://graph.facebook.com/v20.0/${IG_ACCOUNT_ID}/media_publish`, {
        creation_id: igContainerRes.data.id,
        access_token: IG_ACCESS_TOKEN
    });
    console.log(`  ✅ Live on Instagram! ID: ${igPublishRes.data.id}`);
}

async function runBatchPost() {
    console.log('--- Starting Scheduled Batch Poster ---');
    
    // Allow reading from root scraped-jobs.json
    let jobsData = [];
    if (fs.existsSync(jobsFile)) {
        jobsData = JSON.parse(fs.readFileSync(jobsFile, 'utf8'));
    } else {
        console.error('❌ scraped-jobs.json not found!');
        return;
    }

    // Find the matching jobs
    const jobsToPost = [];
    for (const target of TARGET_JOBS) {
        const job = jobsData.find(j => j.title.toLowerCase().includes(target.toLowerCase()));
        if (job) {
            jobsToPost.push(job);
        } else {
            console.warn(`⚠️ Could not find job matching: "${target}" in JSON data.`);
        }
    }

    console.log(`Found ${jobsToPost.length} jobs to post. Scheduled 2 minutes apart.`);

    for (let i = 0; i < jobsToPost.length; i++) {
        const job = jobsToPost[i];
        console.log(`\n==========================================`);
        console.log(`[${i+1}/${jobsToPost.length}] Processing: ${job.title}`);
        
        try {
            // 1. Generate Image
            const imagePath = await generateInstagramImage(job);
            
            // 2. Upload to temporary public host
            const publicUrl = await uploadImageToTempHost(imagePath);
            console.log(`[Upload] Success: ${publicUrl}`);
            
            // 3. Generate Caption
            const caption = generateCaption(job.title, job.category);
            
            // 4. Post to Meta
            await postToMeta(publicUrl, caption);
            
            // 5. Clean up local image so it doesn't get tracked
            fs.unlinkSync(imagePath);
            console.log(`[Cleanup] Deleted local image.`);
            
        } catch (error) {
            console.error(`❌ Failed to post job: ${job.title}`);
            console.error(error.response?.data || error.message);
        }

        // Wait 2 minutes (120,000 ms) before the next post, unless it's the last one
        if (i < jobsToPost.length - 1) {
            console.log(`\n⏳ Scheduled Delay: Waiting 2 minutes before the next post to prevent spam...`);
            await sleep(2 * 60 * 1000); 
        }
    }
    
    console.log('\n✅ All scheduled posts have been completed!');
}

runBatchPost();
