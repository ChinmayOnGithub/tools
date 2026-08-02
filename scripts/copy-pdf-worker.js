/**
 * copy-pdf-worker.js
 *
 * Postinstall helper: copies the pdfjs-dist worker bundle from node_modules
 * into /public so the API version and worker version always stay in sync.
 *
 * Run automatically via package.json "postinstall" hook.
 * Can also be triggered manually: node scripts/copy-pdf-worker.js
 */
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('node:fs');
const path = require('node:path');

const SRC = path.resolve(__dirname, '../node_modules/pdfjs-dist/build/pdf.worker.min.mjs');
const DEST_JS  = path.resolve(__dirname, '../public/pdf.worker.min.js');
const DEST_MJS = path.resolve(__dirname, '../public/pdf.worker.min.mjs');

if (!fs.existsSync(SRC)) {
  console.warn('⚠️  pdfjs-dist worker not found — skipping copy. Run `npm install` first.');
  process.exit(0);
}

fs.copyFileSync(SRC, DEST_JS);
fs.copyFileSync(SRC, DEST_MJS);

// Read version from pdfjs-dist package.json for confirmation log
const pkgPath = path.resolve(__dirname, '../node_modules/pdfjs-dist/package.json');
const version = JSON.parse(fs.readFileSync(pkgPath, 'utf8')).version ?? 'unknown';

console.log(`✅ PDF.js worker v${version} copied to /public (pdf.worker.min.js + pdf.worker.min.mjs)`);
