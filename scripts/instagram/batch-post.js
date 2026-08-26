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
const jobsFile = path.resolve(process.cwd(), 'public', 'scraped-jobs.json'); // Updated to read from public/

const TARGET_JOBS = [
    "Bihar STET",
    "SBI ",
    "UPSSSC PET",
    "NTPC ",
    "SAIL ",
    "IBPS "
];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function generateCaption(jobTitle, category) {
    const acronymsMatch = jobTitle.match(/\b[A-Z]{3,}\b/g) || [];
    const targetedAcronym = acronymsMatch.length > 0 ? `#${acronymsMatch[0]} ` : '';
    const categoryTag = category ? `#${category.replace(/[^a-zA-Z0-9]/g, '')}` : '';

    return `🚨 NEW VACANCY ALERT! 🚨\n\n` +
           `📌 ${jobTitle}\n\n` +
           `👉 Swipe left to see all details! ➡️\n\n` +
           `Click the link in our bio to read the full details and apply instantly! 👆\n\n` +
           `🔗 Visit: Sarkariavedan.info\n\n` +
           `${targetedAcronym}#SarkariAvedan #SarkariJobs #GovtJobs #SarkariNaukri #SarkariExam #SarkariAvedan2026 ${categoryTag} #UPGovtJobs #LatestJobs`;
}

async function uploadImageToTempHost(imagePath) {
    const form = new FormData();
    form.append('key', '6d207e02198a847aa98d0a2a901485a5');
    form.append('action', 'upload');
    form.append('source', fs.createReadStream(imagePath));
    form.append('format', 'json');
    
    const res = await axios.post('https://freeimage.host/api/1/upload', form, {
        headers: form.getHeaders()
    });
    return res.data.image.url;
}

async function postCarouselToMeta(publicImageUrls, caption) {
    const IG_ACCESS_TOKEN = process.env.IG_ACCESS_TOKEN;
    const FB_PAGE_ID = process.env.FB_PAGE_ID;
    const IG_ACCOUNT_ID = process.env.IG_ACCOUNT_ID;

    // 1. Post to Facebook Page as Carousel/Multi-Photo
    console.log('  -> Posting to Facebook Page (Multi-Photo)...');
    const photoIds = [];
    for (const url of publicImageUrls) {
        const res = await axios.post(`https://graph.facebook.com/v20.0/${FB_PAGE_ID}/photos`, {
            url: url,
            published: false,
            access_token: IG_ACCESS_TOKEN
        });
        photoIds.push(res.data.id);
    }
    
    const attachedMedia = photoIds.map(id => ({ media_fbid: id }));
    const fbPublishRes = await axios.post(`https://graph.facebook.com/v20.0/${FB_PAGE_ID}/feed`, {
        message: caption,
        attached_media: JSON.stringify(attachedMedia),
        access_token: IG_ACCESS_TOKEN
    });
    console.log(`  ✅ Live on Facebook! Feed ID: ${fbPublishRes.data.id}`);

    // 2. Post to Instagram as Carousel
    console.log('  -> Posting to Instagram (Carousel)...');
    const itemIds = [];
    for (const url of publicImageUrls) {
        const res = await axios.post(`https://graph.facebook.com/v20.0/${IG_ACCOUNT_ID}/media`, {
            image_url: url,
            is_carousel_item: true,
            access_token: IG_ACCESS_TOKEN
        });
        itemIds.push(res.data.id);
    }

    const igContainerRes = await axios.post(`https://graph.facebook.com/v20.0/${IG_ACCOUNT_ID}/media`, {
        media_type: 'CAROUSEL',
        children: itemIds.join(','),
        caption: caption,
        access_token: IG_ACCESS_TOKEN
    });
    
    const igPublishRes = await axios.post(`https://graph.facebook.com/v20.0/${IG_ACCOUNT_ID}/media_publish`, {
        creation_id: igContainerRes.data.id,
        access_token: IG_ACCESS_TOKEN
    });
    console.log(`  ✅ Live on Instagram! ID: ${igPublishRes.data.id}`);
}

async function run() {
    console.log("--- Starting Scheduled Carousel Batch Poster ---");
    
    if (!fs.existsSync(jobsFile)) {
        console.error("❌ scraped-jobs.json not found!");
        return;
    }
    
    const jobs = JSON.parse(fs.readFileSync(jobsFile, 'utf8'));
    
    const matchedJobs = [];
    for (const target of TARGET_JOBS) {
        const found = jobs.find(j => j.title.toLowerCase().includes(target.toLowerCase()));
        if (found) matchedJobs.push(found);
        else console.log(`⚠️ Could not find job matching: "${target}" in JSON data.`);
    }

    if (matchedJobs.length === 0) {
        console.log("No jobs matched. Exiting.");
        return;
    }

    console.log(`Found ${matchedJobs.length} jobs to post. Scheduled 3 minutes apart.`);

    for (let i = 0; i < matchedJobs.length; i++) {
        const job = matchedJobs[i];
        console.log(`\n==========================================`);
        console.log(`[${i+1}/${matchedJobs.length}] Processing Carousel: ${job.title}`);
        
        try {
            // Generate 5 slide paths
            const imagePaths = await generateInstagramImage(job);
            
            // Upload to temporary host
            console.log(`  [Upload] Uploading 5 images to temporary host...`);
            const publicUrls = [];
            for (const localPath of imagePaths) {
                const pUrl = await uploadImageToTempHost(localPath);
                publicUrls.push(pUrl);
            }
            console.log(`  [Upload] Success! Hosted 5 images.`);
            
            const caption = generateCaption(job.title, job.category);
            
            // Publish Meta Carousel
            await postCarouselToMeta(publicUrls, caption);
            
            // Cleanup local images
            for (const localPath of imagePaths) {
                if (fs.existsSync(localPath)) fs.unlinkSync(localPath);
            }
            console.log(`  [Cleanup] Deleted local carousel images.`);

        } catch (error) {
            console.error(`❌ Failed to post job: ${job.title}`);
            console.error(error.response ? error.response.data : error);
        }

        if (i < matchedJobs.length - 1) {
            console.log(`\n⏳ Scheduled Delay: Waiting 3 minutes before the next post to prevent spam...`);
            await sleep(3 * 60 * 1000); 
        }
    }
    console.log(`\n✅ All scheduled carousel posts have been completed!`);
}

run();
