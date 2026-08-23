import dotenv from 'dotenv';
import axios from 'axios';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function testPostBoth() {
    console.log('--- Running Instagram & Facebook API Test ---');
    const IG_ACCESS_TOKEN = process.env.IG_ACCESS_TOKEN;
    const FB_PAGE_ID = process.env.FB_PAGE_ID;
    const IG_ACCOUNT_ID = process.env.IG_ACCOUNT_ID;
    
    try {
        const testImageUrl = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=1080&auto=format&fit=crop';
        const caption = '🚀 Testing simultaneous cross-posting to Facebook and Instagram!\n\n#SarkariJob #TestPost';

        // --- Post to Facebook Page ---
        console.log('\n1. Posting to Facebook Page...');
        const fbPublishRes = await axios.post(`https://graph.facebook.com/v20.0/${FB_PAGE_ID}/photos`, {
            url: testImageUrl,
            message: caption,
            access_token: IG_ACCESS_TOKEN
        });
        console.log(`🎉 SUCCESS! Post is live on Facebook Page. Post ID: ${fbPublishRes.data.id}`);

        // --- Post to Instagram ---
        console.log('\n2. Posting to Instagram...');
        const igContainerRes = await axios.post(`https://graph.facebook.com/v20.0/${IG_ACCOUNT_ID}/media`, {
            image_url: testImageUrl,
            caption: caption,
            access_token: IG_ACCESS_TOKEN
        });
        const igPublishRes = await axios.post(`https://graph.facebook.com/v20.0/${IG_ACCOUNT_ID}/media_publish`, {
            creation_id: igContainerRes.data.id,
            access_token: IG_ACCESS_TOKEN
        });
        console.log(`🎉 SUCCESS! Post is live on Instagram. Post ID: ${igPublishRes.data.id}`);
        
        console.log('\nCheck both your Instagram and Facebook Page right now to see the cross-posts!');
        
    } catch (error) {
        console.error('❌ API Error:', error.response?.data || error.message);
    }
}

testPostBoth();
