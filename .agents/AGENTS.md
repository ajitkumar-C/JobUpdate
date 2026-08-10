# JobUpdate Workspace Rules

## Scraper Execution and Automated Deployment
When the user asks to run the scraper or scrape new job postings:
1. **Run Scraper**: Execute the scraping script and sitemap generator using direct node execution to bypass system restrictions:
   ```powershell
   node scripts/scrape.js; node scripts/generate-sitemap.js
   ```
2. **Verify Output**: Confirm that `scraped-jobs.json` and `sitemap.xml` have been updated.
3. **Commit & Push**: Automatically stage the changed files, commit them with a message like `chore: update scraped jobs and sitemap`, and push them to the remote branch (`origin main` or current branch) so Cloudflare Pages automatically rebuilds and deploys the updates.
