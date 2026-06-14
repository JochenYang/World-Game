/**
 * 调试脚本：测试多个屏幕点的拾取结果
 */

const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--enable-webgpu', '--disable-dev-shm-usage', '--window-size=1280,800']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  page.on('console', (msg) => {
    if (msg.type() === 'error') console.log('[ERR]', msg.text());
  });

  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));
  await page.click('#start-btn');
  await new Promise(r => setTimeout(r, 1500));

  // 注入调试钩子：暴露 picker
  const debugResult = await page.evaluate(() => {
    const w = window;
    if (!w.__worldGame) return { error: 'no __worldGame' };
    return { hasGame: true, globeRotY: w.__worldGame.globe.group.rotation.y };
  });
  console.log('调试钩子：', debugResult);

  // 测试多个点
  const points = [];
  for (let yp = 0.2; yp <= 0.8; yp += 0.1) {
    for (let xp = 0.2; xp <= 0.8; xp += 0.1) {
      points.push([xp, yp]);
    }
  }

  const results = await page.evaluate(async (pts) => {
    const w = window;
    if (!w.__worldGame) return [];
    const out = [];
    for (const [xp, yp] of pts) {
      const x = xp * window.innerWidth;
      const y = yp * window.innerHeight;
      const id = w.__worldGame.picker.pick(x, y);
      out.push({ xp: xp.toFixed(2), yp: yp.toFixed(2), id });
    }
    return out;
  }, points);

  // 输出网格
  const grid = {};
  results.forEach(({ xp, yp, id }) => {
    if (!grid[yp]) grid[yp] = {};
    grid[yp][xp] = id || '·';
  });
  console.log('\n拾取网格（行为归一化y，列为归一化x）：');
  console.log('     ' + Object.keys(Object.values(grid)[0]).join(' '));
  for (const yp of Object.keys(grid).sort()) {
    const row = grid[yp];
    console.log(`${yp}  ` + Object.keys(row).sort().map(xp => (row[xp] || '·').padEnd(8)).join(''));
  }

  await browser.close();
})();