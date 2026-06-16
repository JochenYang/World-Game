// verify-final.mjs - 最终验证：截图给用户看
import puppeteer from 'puppeteer-core';

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: 'new',
  args: ['--no-sandbox', '--disable-gpu']
});

const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080 });
await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0', timeout: 30000 });
await new Promise(r => setTimeout(r, 1500));
await page.click('#start-btn');
// 等动画启动 + 飘移 5s
await new Promise(r => setTimeout(r, 5000));
await page.screenshot({ path: 'verify-final.png' });
console.log('saved verify-final.png');

await browser.close();
