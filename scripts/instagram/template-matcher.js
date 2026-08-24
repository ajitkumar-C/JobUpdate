import path from 'path';

export function getCategoryTheme(jobTitle) {
    if (!jobTitle) return getDefaultTheme();
    
    const title = jobTitle.toLowerCase();
    
    if (title.includes('rrb') || title.includes('railway') || title.includes('rrc') || title.includes('loco pilot') || title.includes('icf') || title.includes('rcf') || title.includes('nfr')) {
        return getTheme('railway.jpg', 'rgba(139,0,0,0.8)', '#FFD700');
    }
    if (title.includes('upsc') || title.includes('civil services') || title.includes('nda ') || title.includes('cds ')) {
        return getTheme('upsc.jpg', 'rgba(0,43,91,0.8)', '#D4AF37');
    }
    if (title.includes('ssc ') || title.includes('staff selection') || title.includes('cgl') || title.includes('chsl') || title.includes('mts')) {
        return getTheme('ssc.jpg', 'rgba(0,105,92,0.8)', '#FF8C00');
    }
    if (title.includes('army') || title.includes('navy') || title.includes('airforce') || title.includes('coast guard') || title.includes('agniveer') || title.includes('bsf') || title.includes('cisf') || title.includes('nda') || title.includes('cds')) {
        return getTheme('defense.jpg', 'rgba(46,75,41,0.8)', '#A8C9A3');
    }
    if (title.includes('uppsc') || title.includes('upsssc') || title.includes('up police') || title.includes('uttar pradesh') || title.includes('up ')) {
        return getTheme('up-govt.jpg', 'rgba(255,153,51,0.7)', '#138808');
    }
    if (title.includes('ibps') || title.includes('sbi ') || title.includes('rbi ') || title.includes('bank')) {
        return getTheme('banking.jpg', 'rgba(0,51,160,0.8)', '#F2A900');
    }
    
    return getDefaultTheme();
}

function getTheme(bgImage, primaryColor, accentColor) {
    // Determine absolute path to the background image
    const bgPath = path.resolve(process.cwd(), 'public', 'assets', 'templates', bgImage).replace(/\\/g, '/');

    return `
        <style>
            body {
                background: url('file:///${bgPath}') no-repeat center center fixed !important;
                background-size: cover !important;
            }
            .watermark { display: none !important; }

            /* 1:1 Static Post Specific */
            .header { background: ${primaryColor} !important; border-bottom-color: ${accentColor} !important; backdrop-filter: blur(8px); }
            .header h1 { color: ${accentColor} !important; }
            .card { background: rgba(0,0,0,0.7) !important; border-color: ${accentColor} !important; backdrop-filter: blur(12px); box-shadow: 0 15px 35px rgba(0,0,0,0.5) !important; }
            .card-title { background: ${accentColor} !important; color: #000 !important; }
            
            /* 9:16 Reel Specific */
            .info-card { background: rgba(0,0,0,0.75) !important; border-color: ${accentColor} !important; backdrop-filter: blur(12px); box-shadow: 0 15px 35px rgba(0,0,0,0.5); }
            .slide-title { color: ${accentColor} !important; border-bottom-color: ${accentColor} !important; }
            .badge { background: ${accentColor} !important; color: #000 !important; }
            .logo-box { background: ${accentColor} !important; color: #000 !important; border-color: rgba(255,255,255,0.2) !important; }
            .value-highlight { color: ${accentColor} !important; }
            .website-pill { background: ${accentColor} !important; color: #000 !important; }
            .icon { background: rgba(255,255,255,0.1) !important; }
        </style>
    `;
}

function getDefaultTheme() {
    return `
        <style>
            /* Default uses the original gradient defined in the HTML */
        </style>
    `;
}
