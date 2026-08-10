import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

console.log('🏗️ Starting cross-platform build script...');

// 1. Generate sitemap
console.log('\n--- Step 1: Generating Sitemap ---');
execSync('node scripts/generate-sitemap.js', { stdio: 'inherit', cwd: rootDir });

// 2. TypeScript compilation
console.log('\n--- Step 2: TypeScript Compilation ---');
try {
  execSync('node node_modules/typescript/bin/tsc -b', { stdio: 'inherit', cwd: rootDir });
  console.log('✅ TypeScript compilation succeeded');
} catch (err) {
  console.error('❌ TypeScript compilation failed:', err.message);
  process.exit(1);
}

// 3. Vite Build
console.log('\n--- Step 3: Vite Build ---');
try {
  execSync('node node_modules/vite/bin/vite.js build', { stdio: 'inherit', cwd: rootDir });
  console.log('✅ Vite build succeeded');
} catch (err) {
  console.error('❌ Vite build failed:', err.message);
  process.exit(1);
}

// 4. Copy dist/index.html to dist/200.html
console.log('\n--- Step 4: Copying index.html to 200.html for SPA ---');
const indexHtmlPath = path.join(distDir, 'index.html');
const fallbackHtmlPath = path.join(distDir, '200.html');
if (fs.existsSync(indexHtmlPath)) {
  fs.copyFileSync(indexHtmlPath, fallbackHtmlPath);
  console.log('✅ Successfully copied index.html to 200.html');
} else {
  console.error('❌ dist/index.html not found!');
  process.exit(1);
}

// 5. Delete dist/_redirects if it exists
console.log('\n--- Step 5: Cleaning up dist/_redirects ---');
const redirectsPath = path.join(distDir, '_redirects');
if (fs.existsSync(redirectsPath)) {
  fs.unlinkSync(redirectsPath);
  console.log('🗑️ Successfully deleted dist/_redirects to prevent redirect loops');
} else {
  console.log('ℹ️ No dist/_redirects found in build output. Good.');
}

// 6. Zip dist directory to netlify-bundle.zip
console.log('\n--- Step 6: Packaging netlify-bundle.zip ---');
const zipFile = path.join(rootDir, 'netlify-bundle.zip');
if (fs.existsSync(zipFile)) {
  try {
    fs.unlinkSync(zipFile);
  } catch (err) {
    console.warn('⚠️ Could not delete existing netlify-bundle.zip:', err.message);
  }
}

try {
  execSync('tar -a -c -f netlify-bundle.zip -C dist .', { stdio: 'inherit', cwd: rootDir });
  console.log('📦 Created netlify-bundle.zip successfully');
} catch (err) {
  console.error('❌ Failed to package zip bundle:', err.message);
}

console.log('\n🎉 Build complete!');
