# JobUpdate Workspace Rules

## Scraper Execution and Automated Deployment
When the user asks to run the scraper or scrape new job postings:
1. **Run All Scrapers**: Execute the national scraper, Maharashtra deep-scraper, 33-states scraper, and sitemap generator using direct node execution to bypass system restrictions:
   ```powershell
   node scripts/run-all-scrapers.js
   ```
2. **Verify Output**: Confirm that `scraped-jobs.json`, `public/states/`, and `sitemap.xml` have been updated.
3. **Commit & Push**: Automatically stage all changed files, commit them with a message like `chore: update all national and state scraped jobs and sitemap`, and push them to the remote branch (`origin main` or current branch) so Cloudflare Pages automatically rebuilds and deploys the updates.

## "Success Rate" Content & Growth Strategy
Codename: **Success Rate** (Detailed guide at `docs/SUCCESS_RATE_STRATEGY.md`).

Whenever the user logs in, finishes running scrapers, or asks what to create/work on:
1. **Identify Current Day of Week**: Check the local day of the week (Monday through Sunday).
2. **Proactively Remind & Suggest**: Remind the user of the "Success Rate" day theme and suggest 3–4 specific high-impact titles ready for creation:
   - **Monday**: **Mega Exam Syllabus & Exam Pattern** (e.g. RRB NTPC, SSC CGL/CHSL, RPF, UPSC, IBPS).
   - **Tuesday**: **State-Specific Recruitment Hub** (Focus: Maharashtra, UP, Bihar, Rajasthan, MP Police/Clerk/Talathi).
   - **Wednesday**: **Salary & Job Profile Teardown** (Post-wise in-hand salary slips, allowances, 8th Pay Comm. impact).
   - **Thursday**: **Admit Card & Exam Date Tracker** (Direct hall ticket links, exam city slips, checklists).
   - **Friday**: **Preparation Strategy & Books List** (60/90-day study blueprints, top recommended books).
   - **Saturday**: **Answer Key & Expected Cut-Off** (Shift analysis, past 3-year cutoff comparisons by category).
   - **Sunday**: **Scraper Run, Sitemap Verification & Community Alerts** (WhatsApp/Telegram broadcast).
3. **Execute High-Value Posts**: Write complete, well-researched, schema-rich, 2,000+ word guides with tables, official PDF links, and cross-links to scraped jobs.

