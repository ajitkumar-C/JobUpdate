import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateInstagramImage } from './generate-image.js';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jobsFile = path.resolve(process.cwd(), 'public/scraped-jobs.json');

async function getInstagramAccountId(accessToken) {
    try {
        const response = await axios.get(`https://graph.facebook.com/v20.0/me?fields=accounts{instagram_business_account}&access_token=${accessToken}`);
        const accounts = response.data.accounts.data;
        for (let account of accounts) {
            if (account.instagram_business_account) {
                return account.instagram_business_account.id;
            }
        }
        throw new Error('No linked Instagram Business Account found on your Facebook Pages.');
    } catch (error) {
        console.error('Error fetching Instagram Account ID:', error.response?.data || error.message);
        throw error;
    }
}

async function postToInstagramAPI(imagePath, caption) {
    const IG_ACCESS_TOKEN = process.env.IG_ACCESS_TOKEN;
    let IG_ACCOUNT_ID = process.env.IG_ACCOUNT_ID;

    if (!IG_ACCESS_TOKEN) {
        console.warn('⚠️ Instagram credentials not found in .env file.');
        return;
    }

    // Auto-fetch IG Account ID if missing
    if (!IG_ACCOUNT_ID || IG_ACCOUNT_ID === 'your_instagram_business_account_id_here') {
        console.log('Fetching Instagram Account ID automatically...');
        IG_ACCOUNT_ID = await getInstagramAccountId(IG_ACCESS_TOKEN);
        console.log(`✅ Found IG Account ID: ${IG_ACCOUNT_ID}`);
    }

    console.log('🚀 Publishing to Instagram Graph API...');
    
    // Note: The image must be hosted on a public URL for Meta to download it.
    // Since this script generates it locally, we need to upload it somewhere public first,
    // OR push it to github pages and use that raw URL.
    // For this example, we'll assume it will be available via Cloudflare Pages once pushed.
    
    const publicImageUrl = `https://sarkariavedan.info/ig_post_output.jpg`; 
    // ^ In a real robust setup, you'd push the image or use an image hosting API like Imgur/AWS S3 before posting.
    
    try {
        // 1. Create Media Container
        console.log('Creating Media Container...');
        const containerRes = await axios.post(`https://graph.facebook.com/v20.0/${IG_ACCOUNT_ID}/media`, {
            image_url: publicImageUrl,
            caption: caption,
            access_token: IG_ACCESS_TOKEN
        });
        const creationId = containerRes.data.id;
        console.log(`Media Container Created: ${creationId}`);

        // 2. Publish the Media
        console.log('Publishing Media...');
        const publishRes = await axios.post(`https://graph.facebook.com/v20.0/${IG_ACCOUNT_ID}/media_publish`, {
            creation_id: creationId,
            access_token: IG_ACCESS_TOKEN
        });
        
        console.log(`🎉 Successfully published to Instagram! Post ID: ${publishRes.data.id}`);
    } catch (error) {
        console.error('❌ Error publishing to Instagram:', error.response?.data || error.message);
    }
}

function generateCaption(jobTitle, category) {
    // Extract potential acronyms (all-caps words) for targeted hashtags (e.g., BPSC, SSC, UPSC)
    const acronymsMatch = jobTitle.match(/\b[A-Z]{3,}\b/g) || [];
    // Only take the first unique acronym found, if any
    const targetedAcronym = acronymsMatch.length > 0 ? `#${acronymsMatch[0]} ` : '';
    
    // Format category without spaces for a hashtag
    const categoryTag = category ? `#${category.replace(/[^a-zA-Z0-9]/g, '')}` : '';

    return `🚨 NEW VACANCY ALERT! 🚨\n\n` +
           `📌 ${jobTitle}\n\n` +
           `Click the link in our bio to read the full details and apply instantly! 👆\n\n` +
           `👉 Visit: Sarkariavedan.info\n\n` +
           `${targetedAcronym}#SarkariAvedan #SarkariJobs #GovtJobs #SarkariNaukri #SarkariExam #SarkariAvedan2026 ${categoryTag} #UPGovtJobs #LatestJobs`;
}

async function runAutoPost() {
    console.log('--- Starting Instagram Auto-Poster ---');

    if (!fs.existsSync(jobsFile)) {
        console.error('❌ Jobs file not found!');
        process.exit(1);
    }
    
    const jobsData = JSON.parse(fs.readFileSync(jobsFile, 'utf8'));
    if (jobsData.length === 0) {
        console.error('❌ No jobs available to post.');
        process.exit(1);
    }

    const selectedJob = jobsData[0]; 
    console.log(`✅ Selected Job: ${selectedJob.title}`);

    // Generate the Image
    const imagePath = await generateInstagramImage(selectedJob);
    
    // Move the generated image to public folder so it gets hosted when we push to Cloudflare
    const publicImagePath = path.join(process.cwd(), 'public', 'ig_post_output.jpg');
    fs.renameSync(imagePath, publicImagePath);
    console.log(`Moved image to public folder for hosting.`);

    const caption = generateCaption(selectedJob.title, selectedJob.category || 'Latest Jobs');

    // Wait for the public URL to be live? Normally we'd push to git, wait for cloudflare, then post.
    // For this prototype, we'll try posting right away (it will fail if the URL isn't live yet).
    console.log('\n--- Generated Caption ---');
    console.log(caption);
    
    await postToInstagramAPI(publicImagePath, caption);
    
    console.log('--- Auto-Poster Finished ---');
}

runAutoPost().catch(console.error);
