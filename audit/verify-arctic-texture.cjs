// Capture polar screenshots via direct canvas texture read to confirm "北极" is rendered
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

  // Extract the earth texture canvas as PNG and save to disk for inspection
  const result = await page.evaluate(() => {
    const wg = window.__worldGame;
    if (!wg) return { ok: false };
    const tex = wg.globe.earthMesh.material.map;
    const canvas = tex && tex.image;
    if (!canvas || !canvas.getContext) return { ok: false };
    // Convert canvas to data URL
    return {
      ok: true,
      width: canvas.width,
      height: canvas.height,
      dataUrl: canvas.toDataURL('image/png')
    };
  });
  if (!result.ok) { console.log('no canvas'); process.exit(1); }
  const base64 = result.dataUrl.split(',')[1];
  fs.writeFileSync('D:\\codes\\Game\\world game\\audit-output\\earth-texture.png', Buffer.from(base64, 'base64'));
  console.log('saved earth-texture.png', result.width, 'x', result.height);

  // Also save a CROPPED region around the arctic label (lat=72, lon=30):
  // texture x = ((30+180)/360)*W = 0.583*W; y = ((90-72)/180)*H = 0.1*H
  // Crop 400x300 centred there
  const cropResult = await page.evaluate(() => {
    const wg = window.__worldGame;
    const tex = wg.globe.earthMesh.material.map;
    const src = tex.image;
    const c = document.createElement('canvas');
    c.width = 600; c.height = 400;
    const ctx = c.getContext('2d');
    // Centre on the arctic label
    const W = src.width, H = src.height;
    const cx = ((30 + 180) / 360) * W;
    const cy = ((90 - 72) / 180) * H;
    ctx.drawImage(src, cx - 300, cy - 200, 600, 400, 0, 0, 600, 400);
    return c.toDataURL('image/png');
  });
  fs.writeFileSync('D:\\codes\\Game\\world game\\audit-output\\arctic-crop.png', Buffer.from(cropResult.split(',')[1], 'base64'));
  console.log('saved arctic-crop.png');

  await browser.close();
  console.log('done');
})();
