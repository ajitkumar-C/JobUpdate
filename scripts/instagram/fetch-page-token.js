import axios from 'axios';
import fs from 'fs';
import path from 'path';

const userToken = 'PLACEHOLDER_USER_TOKEN';

async function fetchPageToken() {
    try {
        console.log('Fetching Page Access Tokens using the User Token...');
        const response = await axios.get(`https://graph.facebook.com/v20.0/me/accounts?access_token=${userToken}`);
        
        const pages = response.data.data;
        if (pages.length === 0) {
            console.log('❌ No pages found. The user token does not have pages_show_list permission or no pages are linked.');
            return;
        }

        // Find Sarkari Job Updates
        let targetPage = pages[0]; // Default to the first one
        for (let page of pages) {
            if (page.name === 'Sarkari Job Updates') {
                targetPage = page;
                break;
            }
        }

        const pageToken = targetPage.access_token;
        const pageId = targetPage.id;
        const pageName = targetPage.name;

        console.log(`✅ Found Page: ${pageName} (ID: ${pageId})`);
        console.log(`✅ Page Access Token: ${pageToken.substring(0, 15)}...`);

        // Save it to .env
        const envPath = path.resolve(process.cwd(), '.env');
        let envContent = fs.readFileSync(envPath, 'utf8');
        
        // Replace the IG_ACCESS_TOKEN line
        envContent = envContent.replace(/IG_ACCESS_TOKEN=".*"/, `IG_ACCESS_TOKEN="${pageToken}"`);
        fs.writeFileSync(envPath, envContent);
        
        console.log('✅ Successfully updated .env file with the Official Page Access Token!');

    } catch (error) {
        console.error('❌ API Error:', error.response?.data || error.message);
    }
}

fetchPageToken();
