const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function takeScreenshots() {
  const browser = await puppeteer.launch({ 
    headless: 'new',
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
  });
  const page = await browser.newPage();
  
  // Set a nice desktop viewport
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  
  const screenshotsDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
  }

  const pages = [
    { url: 'http://localhost:3000', name: 'overview_3d.png' },
    { url: 'http://localhost:3000/topology', name: 'topology.png' },
    { url: 'http://localhost:3000/root-cause', name: 'active_incidents.png' },
    { url: 'http://localhost:3000/copilot', name: 'copilot.png' },
    { url: 'http://localhost:3000/metrics', name: 'metrics.png' }
  ];

  for (const item of pages) {
    try {
      console.log(`Navigating to ${item.url}...`);
      await page.goto(item.url, { waitUntil: 'networkidle2', timeout: 30000 });
      // Wait for any animations to finish
      await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 2000)));
      
      const filePath = path.join(screenshotsDir, item.name);
      await page.screenshot({ path: filePath, fullPage: false });
      console.log(`Saved screenshot to ${filePath}`);
    } catch (err) {
      console.error(`Failed to screenshot ${item.name}:`, err.message);
    }
  }

  await browser.close();
}

takeScreenshots();
