// Verify the arctic label is visible from various user views by simulating drag
const puppeteer = require('puppeteer-core');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--use-angle=swiftshader', '--window-size=1280,800']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0', timeout: 30000 });
  await sleep(800);
  await page.click('#start-btn');
  await sleep(1500);

  // Drag up to tilt the view towards north pole
  // In the camera controller, mouse Y increasing typically tilts phi (towards pole)
  // Drag Y from 200 to 600 (move mouse down) - this should expose the north pole
  await page.mouse.move(640, 200);
  await page.mouse.down();
  await page.mouse.move(640, 600, { steps: 20 });
  await page.mouse.up();
  await sleep(1500);
  await page.screenshot({ path: 'D:\\codes\\Game\\world game\\audit-output\\view-arctic-drag.png' });
  console.log('saved drag-down view');

  // Also capture the default view to see what's there
  await page.reload({ waitUntil: 'networkidle0' });
  await sleep(800);
  await page.click('#start-btn');
  await sleep(2000);
  await page.screenshot({ path: 'D:\\codes\\Game\\world game\\audit-output\\view-default.png' });
  console.log('saved default view');

  await browser.close();
})();
