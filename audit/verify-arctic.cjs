// Final verification: render the new arctic label position and crop around it
const puppeteer = require('puppeteer-core');
const fs = require('fs');
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

  // 1. Extract the full texture to see the polar caps
  const full = await page.evaluate(() => {
    const wg = window.__worldGame;
    const tex = wg.globe.earthMesh.material.map;
    return tex.image.toDataURL('image/png');
  });
  fs.writeFileSync('D:\\codes\\Game\\world game\\audit-output\\earth-texture-v2.png', Buffer.from(full.split(',')[1], 'base64'));
  console.log('saved full texture');

  // 2. Crop around new arctic position (lat=70, lon=120)
  const crop = await page.evaluate(() => {
    const wg = window.__worldGame;
    const src = wg.globe.earthMesh.material.map.image;
    const W = src.width, H = src.height;
    const cx = ((120 + 180) / 360) * W;
    const cy = ((90 - 70) / 180) * H;
    const c = document.createElement('canvas');
    c.width = 500; c.height = 400;
    c.getContext('2d').drawImage(src, cx - 250, cy - 200, 500, 400, 0, 0, 500, 400);
    return c.toDataURL('image/png');
  });
  fs.writeFileSync('D:\\codes\\Game\\world game\\audit-output\\arctic-crop-v2.png', Buffer.from(crop.split(',')[1], 'base64'));
  console.log('saved arctic crop');

  // 3. Also crop south pole for comparison
  const cropS = await page.evaluate(() => {
    const wg = window.__worldGame;
    const src = wg.globe.earthMesh.material.map.image;
    const W = src.width, H = src.height;
    const cx = ((0 + 180) / 360) * W;
    const cy = ((90 - (-68)) / 180) * H;
    const c = document.createElement('canvas');
    c.width = 500; c.height = 400;
    c.getContext('2d').drawImage(src, cx - 250, cy - 200, 500, 400, 0, 0, 500, 400);
    return c.toDataURL('image/png');
  });
  fs.writeFileSync('D:\\codes\\Game\\world game\\audit-output\\antarctic-crop.png', Buffer.from(cropS.split(',')[1], 'base64'));
  console.log('saved antarctic crop');

  await browser.close();
})();
