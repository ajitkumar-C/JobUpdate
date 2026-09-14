# JobUpdate Workspace Rules

## Scraper Execution and Automated Deployment
When the user asks to run the scraper or scrape new job postings:
1. **Run All Scrapers**: Execute the national scraper, Maharashtra deep-scraper, 33-states scraper, and sitemap generator using direct node execution to bypass system restrictions:
   ```powershell
   node scripts/run-all-scrapers.js
   ```
2. **Verify Output**: Confirm that `scraped-jobs.json`, `public/states/`, and `sitemap.xml` have been updated.
3. **Commit & Push**: Automatically stage all changed files, commit them with a message like `chore: update all national and state scraped jobs and sitemap`, and push them to the remote branch (`origin main` or current branch) so Cloudflare Pages automatically rebuilds and deploys the updates.
