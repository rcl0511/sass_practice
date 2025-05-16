// utils/htmlToPdf.js
const puppeteer = require('puppeteer');

async function htmlToPdf(html, outputPath) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.pdf({ path: outputPath, format: 'A4' });
  await browser.close();
}

module.exports = { htmlToPdf };
