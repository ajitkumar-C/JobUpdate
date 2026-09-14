import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

// Mask our User Agent to look like a standard web browser
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

// Throttling delay helper to prevent rate-limiting or IP block
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to unwrap SarkariResult redirect wrappers
function unwrapUrl(url) {
  if (!url) return url;
  try {
    if (url.includes('?url=') || url.includes('&url=')) {
      const parsedUrl = new URL(url);
      const targetUrl = parsedUrl.searchParams.get('url');
      if (targetUrl) {
        return decodeURIComponent(targetUrl);
      }
    }
  } catch (e) {
    const match = url.match(/[?&]url=([^&]+)/);
    if (match && match[1]) {
      try {
        return decodeURIComponent(match[1]);
      } catch (err) {
        return match[1];
      }
    }
  }
  return url;
}

// Helper to extract clean age string from potentially noisy FAQ text
function cleanAgeString(val, type = 'min') {
  if (!val) return undefined;
  const str = String(val).trim();
  if (!str || str.toLowerCase() === 'na' || str.toLowerCase() === 'n/a') return undefined;

  // Check if string contains FAQ boilerplate
  if (str.toLowerCase().includes('what is the age limit') || str.toLowerCase().includes('answer:') || str.length > 40) {
    if (type === 'min') {
      const minMatch = str.match(/minimum\s*age\s*(?:is|:)?\s*(\d{1,2}\s*(?:years?|yrs?)?)/i);
      if (minMatch) {
        return minMatch[1].trim() + (minMatch[1].toLowerCase().includes('year') ? '' : ' Years');
      }
      const genericMin = str.match(/(\d{1,2})\s*(?:years?|yrs?)/i);
      if (genericMin) return `${genericMin[1]} Years`;
    } else {
      const maxMatch = str.match(/maximum\s*age\s*(?:is|:)?\s*(\d{1,2}(?:\s*[-–]\s*\d{1,2})?\s*(?:years?|yrs?)?)/i);
      if (maxMatch) {
        return maxMatch[1].trim() + (maxMatch[1].toLowerCase().includes('year') ? '' : ' Years');
      }
      const genericMax = str.match(/(?:to|[-–])\s*(\d{1,2})\s*(?:years?|yrs?)/i) || str.match(/(\d{1,2})\s*(?:years?|yrs?)/gi);
      if (genericMax && genericMax.length) {
        const last = genericMax[genericMax.length - 1];
        return last.replace(/^(?:to|[-–])\s*/i, '').trim() + (last.toLowerCase().includes('year') ? '' : ' Years');
      }
    }
  }

  // Normal clean string
  const clean = str.replace(/\s+/g, ' ').trim();
  return clean.length <= 35 ? clean : clean.substring(0, 35);
}

// Helper to sanitize fee strings and discard erroneous text (like "50% marks", "annual income")
function cleanFeeString(val) {
  if (!val) return undefined;
  const lower = String(val).toLowerCase();
  const blacklisted = ['mark', 'income', 'passed', 'lakh', 'eligib', 'matric', 'student', 'qualif', '%'];
  if (blacklisted.some(w => lower.includes(w))) {
    return undefined;
  }
  const clean = String(val).replace(/\s+/g, ' ').trim();
  return clean;
}

// Helper to extract or infer salary / pay scale
function extractSalary(contentHtml, title = '') {
  const text = cheerio.load(contentHtml || '').text();
  const patterns = [
    /pay\s*scale\s*[:\-]?\s*([^\n\r<]{5,70})/i,
    /salary\s*[:\-]?\s*([^\n\r<]{5,70})/i,
    /remuneration\s*[:\-]?\s*([^\n\r<]{5,70})/i,
    /(?:pay\s*matrix\s*level\s*[-–]?\s*\d+[^\n\r<]{0,40})/i,
    /(?:level\s*[-–]?\s*\d+\s*\([^\)]+\))/i,
    /(?:₹|rs\.?)\s*[\d,]+\s*[-–to]+\s*(?:₹|rs\.?)?\s*[\d,]+\s*(?:\/-\s*per\s*month)?/i
  ];
  for (const regex of patterns) {
    const m = text.match(regex);
    if (m) {
      let res = (m[1] || m[0]).replace(/\s+/g, ' ').trim();
      res = res.replace(/[;,\.]$/, '');
      if (res.length >= 4 && res.length <= 75) return res;
    }
  }
  return 'As per Government Rules / Pay Matrix';
}

// Helper to infer or extract selection process stages
function inferSelectionProcess(title = '', category = '') {
  const t = title.toLowerCase();
  const c = category.toLowerCase();
  
  if (c.includes('admit')) {
    return [
      'Download Online Admit Card / Hall Ticket',
      'Appear for Written / Online Computer Based Test (CBT)',
      'Check Answer Key & Result'
    ];
  }
  if (c.includes('result')) {
    return [
      'Written / CBT Preliminary Examination',
      'Mains / Secondary Stage Examination',
      'Document Verification & Final Merit List'
    ];
  }
  if (c.includes('answer key')) {
    return [
      'View Response Sheet & Question Paper',
      'Raise Objections / Challenge Answer Key Online',
      'Final Answer Key & Scorecard Declaration'
    ];
  }
  if (t.includes('police') || t.includes('constable') || t.includes('si ') || t.includes('sub inspector') || t.includes('bsf') || t.includes('crpf') || t.includes('cisf') || t.includes('army') || t.includes('agniveer')) {
    return [
      'Written Examination (CBT / OMR)',
      'Physical Efficiency & Measurement Test (PET / PST)',
      'Document Verification (DV)',
      'Detailed Medical Examination (DME)'
    ];
  }
  if (t.includes('clerk') || t.includes('assistant') || t.includes('deo') || t.includes('steno') || t.includes('typist')) {
    return [
      'Computer Based Written Test (CBT)',
      'Typing / Skill / Shorthand Test',
      'Document Verification (DV)',
      'Final Merit List'
    ];
  }
  if (t.includes('teacher') || t.includes('tgt') || t.includes('pgt') || t.includes('prt') || t.includes('professor')) {
    return [
      'Written Competitive Examination',
      'Interview / Demo Class (if applicable)',
      'Document Verification (DV)'
    ];
  }
  if (t.includes('engineer') || t.includes('je ') || t.includes('junior engineer') || t.includes('technician')) {
    return [
      'Stage-1 CBT Examination',
      'Stage-2 Technical Paper CBT',
      'Document Verification & Medical Fitness'
    ];
  }
  return [
    'Written Examination (CBT / OMR)',
    'Skill / Trade Test (if applicable)',
    'Document Verification (DV)',
    'Medical Examination (As per Rules)'
  ];
}

// Helper to build structured candidate application checklist
function buildHowToApply(title = '', category = '') {
  const c = category.toLowerCase();
  if (c.includes('admit')) {
    return [
      'Click on the direct "Download Admit Card / Hall Ticket" link provided below.',
      'Enter your Registration Number / Roll Number and Date of Birth (DOB) or Password.',
      'Click on "Submit" or "Login" to view your Hall Ticket on screen.',
      'Check all details thoroughly: Exam Center, Reporting Time, Shift, and Roll Number.',
      'Download and print at least 2 clear copies of the Admit Card along with the official instructions.'
    ];
  }
  if (c.includes('result')) {
    return [
      'Click on the direct "Check Result / Download Merit List" link below.',
      'Open the PDF or enter your Roll Number / Registration Number and DOB on the result portal.',
      'Search for your Roll Number / Name in the qualified candidates list (using Ctrl + F on PC).',
      'Check category-wise cut-off marks and your qualifying score.',
      'Download and save a copy of the Scorecard / Merit List for subsequent stages.'
    ];
  }
  return [
    'Check your eligibility, educational qualifications, and age criteria from the official notification.',
    'Visit the official website and complete One-Time Registration (OTR) if you are a new applicant.',
    'Carefully fill in your personal details, educational qualifications, and address in the online form.',
    'Upload required scanned documents, recent passport-size photograph, and signature in specified sizes.',
    'Pay the prescribed examination fee through Net Banking, Debit/Credit Card, or UPI (if applicable).',
    'Review the filled application form preview, submit, and take a printout of the final confirmation receipt.'
  ];
}

// Helper to determine Job Location from Title
function extractJobLocation(title = '') {
  const t = ` ${title} `;
  if (/\b(up|uttar pradesh|upsssc|uppsc|upessc)\b/i.test(t)) return 'Uttar Pradesh';
  if (/\b(bihar|bpsc|bssc|bseb)\b/i.test(t)) return 'Bihar';
  if (/\b(mp|madhya pradesh|mppsc|esb)\b/i.test(t)) return 'Madhya Pradesh';
  if (/\b(rajasthan|rpsc|rsmssb)\b/i.test(t)) return 'Rajasthan';
  if (/\b(delhi|dsssb)\b/i.test(t)) return 'Delhi / NCR';
  if (/\b(haryana|hssc|hpsc)\b/i.test(t)) return 'Haryana';
  if (/\b(maharashtra|mpsc)\b/i.test(t)) return 'Maharashtra';
  if (/\b(uk|uttarakhand|ukpsc|uksssc)\b/i.test(t)) return 'Uttarakhand';
  if (/\b(jharkhand|jssc|jpsc)\b/i.test(t)) return 'Jharkhand';
  if (/\b(ssc|upsc|railway|rrb|ibps|sbi|nta|cbse|airforce|navy|army|bsf|crpf|cisf|itbp|ssb)\b/i.test(t)) return 'All India (Central Govt)';
  return 'All India / State-Wise';
}

// Helper to compute total vacancies count
function extractTotalVacancies(title = '', vacancies = []) {
  let sum = 0;
  for (const v of vacancies) {
    const num = parseInt(String(v.totalPost).replace(/[^0-9]/g, ''), 10);
    if (!isNaN(num) && num > 0) sum += num;
  }
  if (sum > 0) return `${sum.toLocaleString()} Posts`;
  
  const m = title.match(/(\d+)\s*(?:posts?|vacanc(?:y|ies))/i);
  if (m) return `${parseInt(m[1], 10).toLocaleString()} Posts`;
  
  return 'Refer to Notification';
}

async function scrapeSarkariPortal() {
  console.log('🚀 Starting SarkariResult Multi-Portal automated scraper...');
  
  const PORTALS = [
    { url: 'https://www.sarkariresult.com/', name: 'SarkariResult.com (Main)' },
    { url: 'https://sarkariresult.com.cm/', name: 'SarkariResult.com.cm (Secondary)' }
  ];

  const scrapedJobs = [];
  const LIMIT = 6; // Scrape top 6 from each category column to be comprehensive

  try {
    for (const portal of PORTALS) {
      console.log(`\n==================================================`);
      console.log(`🌐 Crawling Portal: ${portal.name} (${portal.url})`);
      console.log(`==================================================`);
      
      try {
        const { data: homeHtml } = await axios.get(portal.url, {
          headers: { 'User-Agent': USER_AGENT },
          timeout: 10000
        });

        const $ = cheerio.load(homeHtml);
        const linksToScrape = [];

        if (portal.url.includes('sarkariresult.com.cm')) {
          // WordPress GeneratePress layout parsing
          $('.gb-headline-text').each((j, el) => {
            const text = $(el).text().trim().toLowerCase();
            let categoryName = '';
            
            if (text === 'results') categoryName = 'Result';
            else if (text === 'admit cards') categoryName = 'Admit Card';
            else if (text === 'latest jobs') categoryName = 'Latest Jobs';
            else if (text === 'answer key') categoryName = 'Answer Key';
            else if (text === 'documents') categoryName = 'Syllabus';
            else if (text === 'admission') categoryName = 'Admission';

            if (categoryName) {
              const ul = $(el).next('ul');
              if (ul.length) {
                let count = 0;
                ul.find('a').each((k, aEl) => {
                  if (count >= LIMIT) return;
                  const href = $(aEl).attr('href');
                  const title = $(aEl).text().trim();
                  
                  if (href && title && !title.toLowerCase().includes('view more') && !title.toLowerCase().includes('click here')) {
                    let absoluteUrl = href;
                    if (!href.startsWith('http')) {
                      absoluteUrl = new URL(href, portal.url).href;
                    }
                    linksToScrape.push({ category: categoryName, rawTitle: title, url: absoluteUrl });
                    count++;
                  }
                });
                console.log(`🔎 Found category: "${categoryName}" with ${count} links in sarkariresult.com.cm`);
              }
            }
          });
        } else {
          // Classic SarkariResult table grid column parsing
          $('.gb-grid-column').each((i, cell) => {
            const text = $(cell).text().trim().toLowerCase();
            let categoryName = '';
            
            if (text.includes('latest job') && $(cell).find('a').length > 3) {
              categoryName = 'Latest Jobs';
            } else if (text.includes('admit card') && $(cell).find('a').length > 3) {
              categoryName = 'Admit Card';
            } else if (text.includes('result') && !text.includes('admit') && $(cell).find('a').length > 3) {
              categoryName = 'Result';
            } else if (text.includes('answer key') && $(cell).find('a').length > 3) {
              categoryName = 'Answer Key';
            } else if (text.includes('syllabus') && $(cell).find('a').length > 3) {
              categoryName = 'Syllabus';
            } else if (text.includes('admission') && $(cell).find('a').length > 3) {
              categoryName = 'Admission';
            } else if (text.includes('certificate') && $(cell).find('a').length > 3) {
              categoryName = 'Certificate';
            } else if ((text.includes('outsourcing') || text.includes('offline')) && $(cell).find('a').length > 3) {
              categoryName = 'Outsourcing / Offline Jobs';
            } else if (text.includes('important') && $(cell).find('a').length > 3) {
              categoryName = 'Important';
            }

            if (categoryName) {
              console.log(`🔎 Found category column: "${categoryName}" with ${$(cell).find('a').length} links.`);
              let count = 0;
              $(cell).find('a').each((j, aEl) => {
                if (count >= LIMIT) return;
                const url = $(aEl).attr('href');
                const title = $(aEl).text().trim();
                
                if (url && title && !url.includes('sarkariresult.com/index') && !title.toLowerCase().includes('view more') && !title.toLowerCase().includes('click here')) {
                  let absoluteUrl = url;
                  if (!url.startsWith('http')) {
                    absoluteUrl = new URL(url, portal.url).href;
                  }
                  
                  // Skip main index/listing pages
                  const indexPages = ['latestjob', 'admitcard', 'result', 'syllabus', 'answerkey', 'admission', 'outsourcing', 'certificate', 'important'];
                  const isIndex = indexPages.some(p => absoluteUrl.endsWith(`/${p}/`) || absoluteUrl.endsWith(`/${p}`));
                  if (isIndex) return;

                  linksToScrape.push({ category: categoryName, rawTitle: title, url: absoluteUrl });
                  count++;
                }
              });
            }
          });
        }

        console.log(`🔗 Portal ${portal.name}: Found ${linksToScrape.length} total listings to crawl.`);

        // Crawl detail pages for this portal
        for (let i = 0; i < linksToScrape.length; i++) {
          const item = linksToScrape[i];
          console.log(`⏳ Crawling (${i + 1}/${linksToScrape.length}): ${item.url}`);
          
          try {
            const { data: detailHtml } = await axios.get(item.url, {
              headers: { 'User-Agent': USER_AGENT },
              timeout: 8000
            });
            
            const $d = cheerio.load(detailHtml);
            $d('br').replaceWith('\n');
            
            // Restrict element selection to the main post content to ignore sidebars and related posts
            let $content = $d('.entry-content');
            if ($content.length === 0) $content = $d('.post-content');
            if ($content.length === 0) $content = $d('article');
            if ($content.length === 0) $content = $d('main');
            if ($content.length === 0) $content = $d('body');

            // 1. Title Extraction
            let title = $d('h1').first().text().trim();
            if (!title) {
              title = $content.find('table tr').first().text().trim();
            }
            if (!title) {
              title = item.rawTitle;
            }
            title = title.replace(/\s+/g, ' ');

            // 2. Short Info Extraction
            let shortInfo = '';
            $content.find('td, p, span').each((idx, el) => {
              const text = $d(el).text().trim();
              const lowerText = text.toLowerCase();
              
              if (lowerText.includes('short information') || lowerText.includes('short info')) {
                let content = text.replace(/short info(rmation)?\s*:?/i, '').trim();
                if (content.length < 15) {
                  const siblingText = $d(el).next('td').text().trim();
                  if (siblingText) {
                    content = siblingText;
                  }
                }
                
                if (content.length > 5 && content.toLowerCase() !== 'short information') {
                  shortInfo = content.replace(/\s+/g, ' ');
                  return false;
                }
              }
            });
            
            if (!shortInfo) {
              shortInfo = `${title}. Read notification for detailed information.`;
            }

            // 3. Dates, Fees & Age extraction (Scans both tables and lists)
            let applicationStart = '';
            let applicationLastDate = '';
            let feeLastDate = '';
            let examDate = '';
            let admitCardDate = '';
            let resultDate = '';
            
            let feeGen = '';
            let feeSc = '';
            let feeFemale = '';
            let paymentMode = 'Online payment mode';
            
            let ageMin = '';
            let ageMax = '';
            let ageRelax = 'Age relaxation applies as per rules.';

            const vacancies = [];
            const importantLinks = {};

            $content.find('td, li').each((idx, el) => {
              const text = $d(el).text().trim();
              const cleanText = text.toLowerCase().replace(/\s+/g, ' ');

              // Check Dates keywords
              if (cleanText.includes('application begin') || cleanText.includes('online apply start') || cleanText.includes('application start')) {
                const val = text.split(':').slice(1).join(':').trim();
                if (val) applicationStart = val;
              }
              if (cleanText.includes('last date for apply') || cleanText.includes('apply last date') || cleanText.includes('last date for registration') || cleanText.includes('online apply last date')) {
                const val = text.split(':').slice(1).join(':').trim();
                if (val) applicationLastDate = val;
              }
              if (cleanText.includes('pay exam fee last') || cleanText.includes('fee payment last date') || cleanText.includes('pay exam fee')) {
                const val = text.split(':').slice(1).join(':').trim();
                if (val) feeLastDate = val;
              }
              if (cleanText.includes('exam date') || cleanText.includes('examination date')) {
                const val = text.split(':').slice(1).join(':').trim();
                if (val) examDate = val;
              }
              if (cleanText.includes('admit card available') || cleanText.includes('admit card date')) {
                const val = text.split(':').slice(1).join(':').trim();
                if (val) admitCardDate = val;
              }
              if (cleanText.includes('result declared') || cleanText.includes('result available')) {
                const val = text.split(':').slice(1).join(':').trim();
                if (val) resultDate = val;
              }

              // Check Fee keywords
              if (cleanText.includes('general, obc') || cleanText.includes('general/obc') || cleanText.includes('general / obc') || cleanText.includes('general,obc,ews')) {
                const val = text.split(':').slice(1).join(':').trim();
                if (val) feeGen = val;
              }
              if (cleanText.includes('sc, st') || cleanText.includes('sc/st') || cleanText.includes('sc / st')) {
                const val = text.split(':').slice(1).join(':').trim();
                if (val) feeSc = val;
              }
              if (cleanText.includes('female')) {
                const val = text.split(':').slice(1).join(':').trim();
                if (val) feeFemale = val;
              }
              if (cleanText.includes('payment mode') || cleanText.includes('pay the exam fee through')) {
                paymentMode = text.trim();
              }

              // Check Age keywords
              if (cleanText.includes('minimum age') || cleanText.includes('min age')) {
                const val = text.split(':').slice(1).join(':').trim();
                if (val) ageMin = val;
              }
              if (cleanText.includes('maximum age') || cleanText.includes('max age')) {
                const val = text.split(':').slice(1).join(':').trim();
                if (val) ageMax = val;
              }
              if (cleanText.includes('age relaxation extra')) {
                ageRelax = text.trim();
              }
            });

            // 4. Parse Vacancy details
            $content.find('tr').each((idx, row) => {
              const cells = $d(row).find('td');
              if (cells.length >= 3) {
                const col1Text = cells.eq(0).text().trim().toLowerCase();
                const col2Text = cells.eq(1).text().trim().toLowerCase();
                const col3Text = cells.eq(2).text().trim().toLowerCase();
                
                // Match 3-column vacancy table (Post Name / Total Post / Eligibility)
                if (col1Text.includes('post name') && col2Text.includes('total') && col3Text.includes('eligibility')) {
                  let nextRow = $d(row).next('tr');
                  while (nextRow.length) {
                    const rCells = nextRow.find('td');
                    if (rCells.length >= 3) {
                      if (rCells.text().toLowerCase().includes('useful') && rCells.text().toLowerCase().includes('links')) {
                        break;
                      }
                      vacancies.push({
                        postName: rCells.eq(0).text().trim().replace(/\s+/g, ' '),
                        totalPost: rCells.eq(1).text().trim().replace(/\s+/g, ' '),
                        eligibility: rCells.eq(2).text().trim().replace(/\s+/g, ' ')
                      });
                    }
                    nextRow = nextRow.next('tr');
                  }
                  return false;
                }
              } else if (cells.length === 2) {
                const col1Text = cells.eq(0).text().trim().toLowerCase();
                const col2Text = cells.eq(1).text().trim().toLowerCase();
                
                // Match 2-column vacancy table fallback (Post Name / No. Of Post)
                if (col1Text.includes('post name') && (col2Text.includes('no. of post') || col2Text.includes('total post') || col2Text.includes('no. of vacancy'))) {
                  let nextRow = $d(row).next('tr');
                  while (nextRow.length) {
                    const rCells = nextRow.find('td');
                    if (rCells.length >= 2) {
                      if (rCells.text().toLowerCase().includes('useful') && rCells.text().toLowerCase().includes('links')) {
                        break;
                      }
                      vacancies.push({
                        postName: rCells.eq(0).text().trim().replace(/\s+/g, ' '),
                        totalPost: rCells.eq(1).text().trim().replace(/\s+/g, ' '),
                        eligibility: 'Refer to official notification details'
                      });
                    }
                    nextRow = nextRow.next('tr');
                  }
                  return false;
                }
              }
            });

            if (vacancies.length === 0) {
              vacancies.push({
                postName: title.split('Recruitment')[0].trim(),
                totalPost: 'Refer to Notification',
                eligibility: 'See official guidelines'
              });
            }

            // 5. Parse Important Links (Direct unwrapped redirects)
            $content.find('tr').each((idx, row) => {
              const cells = $d(row).find('td');
              if (cells.length >= 2) {
                const desc = cells.eq(0).text().trim().toLowerCase();
                const valText = cells.eq(1).text().trim().toLowerCase();
                
                // Skip related posts, sidebars, or generic post lists
                if (desc.includes('latest posts') || desc.includes('related posts') || valText.includes('latest posts') || valText.includes('related posts')) {
                  return;
                }
                if (cells.eq(0).find('a').length > 2 || cells.eq(1).find('a').length > 2) {
                  return;
                }
                
                // Let's find all links in this row (excluding the description cell)
                const rowLinks = [];
                cells.slice(1).each((cIdx, cell) => {
                  $d(cell).find('a').each((aIdx, aEl) => {
                    const href = $d(aEl).attr('href');
                    if (href && href.startsWith('http')) {
                      rowLinks.push(unwrapUrl(href));
                    }
                  });
                });

                if (rowLinks.length > 0) {
                  const targetLink = rowLinks[0]; // Take the first link in the row
                  
                  if (desc.includes('apply online') || desc.includes('online form') || desc.includes('registration')) {
                    importantLinks.applyOnline = targetLink;
                  } else if (desc.includes('download notification') || desc.includes('notification') || desc.includes('check official notification')) {
                    importantLinks.downloadNotification = targetLink;
                  } else if (desc.includes('official website') || desc.includes('authority website')) {
                    importantLinks.officialWebsite = targetLink;
                  } else if (desc.includes('syllabus')) {
                    importantLinks.syllabusUrl = targetLink;
                  } else if (desc.includes('admit card')) {
                    importantLinks.admitCardUrl = targetLink;
                  } else if (desc.includes('result')) {
                    importantLinks.resultUrl = targetLink;
                  }
                }
              }
            });


            // Build job posting object
            const cleanCategory = item.category
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '');

            let titleSlug = (title || item.rawTitle)
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '');

            const words = titleSlug.split('-');
            const stopWords = new Set([
              'apply', 'online', 'for', 'post', 'posts', 'recruitment', 'form', 
              'registration', 'vacancy', 'vacancies', 'notification', 'alert', 
              'free', 'admit-card', 'result', 'syllabus', 'exam', 'admission',
              'certificate', 'outsourcing', 'offline', 'important', 'and', 'with', 
              'the', 'in', 'of', 'at', 'on', 'to', 'by', 'an', 'a', 'is'
            ]);

            const cleanWords = words.filter(w => w.length > 0 && !stopWords.has(w));
            const finalWords = cleanWords.slice(0, 6);
            const finalTitle = finalWords.length > 0 ? finalWords.join('-') : words.slice(0, 5).join('-');
            
            const jobId = `${cleanCategory}-${finalTitle}`;

            // Clean & Sanitize extracted fields
            const isRecruitment = item.category === 'Latest Jobs' || item.category.toLowerCase().includes('outsourcing');
            const cleanedFeeGen = cleanFeeString(feeGen) || (isRecruitment ? 'Refer to Notification' : 'Exempted / Not Applicable');
            const cleanedFeeSc = cleanFeeString(feeSc) || (isRecruitment ? 'Refer to Notification' : 'Exempted / Not Applicable');
            const cleanedFeeFemale = cleanFeeString(feeFemale);

            const cleanedAgeMin = cleanAgeString(ageMin, 'min');
            const cleanedAgeMax = cleanAgeString(ageMax, 'max');

            const postTitle = title || item.rawTitle;
            const salary = extractSalary($content.html(), postTitle);
            const selectionProcess = inferSelectionProcess(postTitle, item.category);
            const howToApply = buildHowToApply(postTitle, item.category);
            const jobLocation = extractJobLocation(postTitle);
            const totalVacanciesCount = extractTotalVacancies(postTitle, vacancies);

            const job = {
              id: jobId,
              title: postTitle,
              category: item.category,
              postDate: new Date().toISOString().split('T')[0],
              shortInfo: shortInfo,
              applicationStart: applicationStart || 'Available soon',
              applicationLastDate: applicationLastDate || 'Refer to notification',
              feeLastDate: feeLastDate || applicationLastDate || 'Refer to notification',
              examDate: examDate || 'To be announced',
              admitCardDate: admitCardDate || 'To be announced',
              resultDate: resultDate || undefined,
              fees: {
                generalObc: cleanedFeeGen,
                scStPh: cleanedFeeSc,
                female: cleanedFeeFemale || undefined,
                paymentMode: paymentMode || 'Online payment'
              },
              ageLimit: {
                min: cleanedAgeMin || undefined,
                max: cleanedAgeMax || undefined,
                relaxationText: ageRelax || 'Age relaxation applies as per rules.'
              },
              vacancies: vacancies,
              importantLinks: {
                applyOnline: importantLinks.applyOnline || importantLinks.officialWebsite || portal.url,
                downloadNotification: importantLinks.downloadNotification || importantLinks.officialWebsite || portal.url,
                officialWebsite: importantLinks.officialWebsite || portal.url,
                syllabusUrl: importantLinks.syllabusUrl,
                admitCardUrl: importantLinks.admitCardUrl,
                resultUrl: importantLinks.resultUrl
              },
              status: 'active',
              salary: salary,
              selectionProcess: selectionProcess,
              howToApply: howToApply,
              jobLocation: jobLocation,
              totalVacanciesCount: totalVacanciesCount
            };

            scrapedJobs.push(job);
            console.log(`✅ Scraped successfully: "${job.title.substring(0, 40)}..."`);

          } catch (err) {
            console.error(`❌ Error crawling detail page ${item.url}:`, err.message);
          }

          // Respectful delay between requests
          await delay(500);
        }
      } catch (portalError) {
        console.error(`❌ Portal error on ${portal.name}:`, portalError.message);
      }
    }

    // --- Merge & Save routine ---
    const publicDir = path.join(process.cwd(), 'public');
    const outputPath = fs.existsSync(publicDir) 
      ? path.join(publicDir, 'scraped-jobs.json')
      : path.join(process.cwd(), 'scraped-jobs.json');
      
    let existingJobs = [];
    try {
      if (fs.existsSync(outputPath)) {
        const rawData = fs.readFileSync(outputPath, 'utf-8');
        const parsed = JSON.parse(rawData);
        if (Array.isArray(parsed)) {
          existingJobs = parsed;
        }
      }
    } catch (err) {
      console.warn('⚠️ Could not load existing scraped-jobs.json for merging:', err.message);
    }
    
    // Merge database by checking titles and deduplicate
    const mergedJobs = [];
    const seenMergedKeys = new Set();
    
    // Add scraped jobs first
    scrapedJobs.forEach(job => {
      const key = `${job.category.toLowerCase().trim()}||${job.title.toLowerCase().trim()}`;
      if (!seenMergedKeys.has(key)) {
        seenMergedKeys.add(key);
        mergedJobs.push(job);
      }
    });
    
    // Add existing jobs
    existingJobs.forEach(oldJob => {
      const key = `${oldJob.category.toLowerCase().trim()}||${oldJob.title.toLowerCase().trim()}`;
      if (!seenMergedKeys.has(key)) {
        seenMergedKeys.add(key);
        mergedJobs.push(oldJob);
      }
    });

    // Write database files
    fs.writeFileSync(outputPath, JSON.stringify(mergedJobs, null, 2), 'utf-8');
    if (fs.existsSync(publicDir)) {
      fs.writeFileSync(path.join(process.cwd(), 'scraped-jobs.json'), JSON.stringify(mergedJobs, null, 2), 'utf-8');
    }
    
    console.log(`\n🎉 Scraping complete!`);
    console.log(`💾 Scraped data saved to: ${outputPath}`);
    console.log(`📊 Scraped in this run: ${scrapedJobs.length}`);
    console.log(`📈 Merged database total: ${mergedJobs.length} records`);

  } catch (error) {
    console.error('❌ Critical scraper error:', error.message);
  }
}

// Run the script
scrapeSarkariPortal();
