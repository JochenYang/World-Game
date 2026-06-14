/**
 * 端到端审查脚本 (v2)
 *
 * 1. 打开应用 → 截屏启动封面
 * 2. 点击「启卷」 → 截屏舞台
 * 3. 直接通过 picker API 验证拾取；通过模拟鼠标点击触发卷轴
 * 4. 截屏卷轴面板 + 验证大洲名、时间轴
 * 5. 控制台错误汇总
 */

const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const URL = 'http://127.0.0.1:5173/';
const OUT_DIR = path.join(__dirname, '..', 'audit-output');

async function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}
async function snap(page, name) {
  const file = path.join(OUT_DIR, `${name}.png`);
  await page.screenshot({ path: file, fullPage: false });
  console.log(`  📸 ${file}`);
  return file;
}
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

(async () => {
  await ensureDir(OUT_DIR);
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: [
      '--no-sandbox', '--disable-setuid-sandbox',
      '--enable-webgpu', '--enable-unsafe-webgpu',
      '--use-angle=swiftshader',
      '--disable-dev-shm-usage',
      '--window-size=1280,800'
    ]
  });

  const consoleErrors = [];
  const consoleAll = [];
  const pageErrors = [];

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    page.on('console', (msg) => {
      const entry = `[${msg.type()}] ${msg.text()}`;
      consoleAll.push(entry);
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => pageErrors.push(String(err)));

    console.log('▶ 1. 打开应用');
    await page.goto(URL, { waitUntil: 'networkidle0', timeout: 30000 });
    await sleep(800);

    console.log('▶ 2. 验证启动封面');
    const titleVisible = await page.$eval('#title-screen', (el) => {
      const cs = getComputedStyle(el);
      return cs.opacity !== '0' && cs.visibility !== 'hidden';
    });
    const btnText = await page.$eval('#start-btn', (el) => el.textContent.trim());
    console.log(`  封面可见：${titleVisible}，按钮："${btnText}"`);
    await snap(page, '01-title-screen');

    console.log('▶ 3. 点击启卷印章');
    await page.click('#start-btn');
    await sleep(1800);
    const stageActive = await page.$eval('#stage', (el) => el.classList.contains('is-active'));
    const canvasBox = await page.$eval('#globe-canvas', (el) => {
      const r = el.getBoundingClientRect();
      return { x: r.left, y: r.top, width: r.width, height: r.height };
    });
    console.log(`  舞台激活：${stageActive}，canvas: ${canvasBox.width}x${canvasBox.height}`);
    await snap(page, '02-stage-active');

    // 拾取网格验证
    console.log('▶ 4. 拾取网格扫描');
    const grid = await page.evaluate(() => {
      const w = window;
      if (!w.__worldGame) return null;
      const points = [];
      for (let yp = 0.2; yp <= 0.8; yp += 0.05) {
        for (let xp = 0.2; xp <= 0.8; xp += 0.05) {
          const x = xp * window.innerWidth;
          const y = yp * window.innerHeight;
          const id = w.__worldGame.picker.pick(x, y);
          if (id) points.push({ xp: Math.round(xp * 100) / 100, yp: Math.round(yp * 100) / 100, id });
        }
      }
      return { points, rotY: w.__worldGame.globe.group.rotation.y };
    });
    console.log(`  自转角度：${grid.rotY.toFixed(3)}`);
    console.log(`  命中点数：${grid.points.length}`);
    const byContinent = {};
    grid.points.forEach(p => {
      byContinent[p.id] = (byContinent[p.id] || 0) + 1;
    });
    console.log(`  各大陆命中数：`, byContinent);

    await snap(page, '03-globe-rotate');

    // 找到亚洲的中心点 (屏幕坐标)
    const asiaPoint = grid.points.find(p => p.id === 'asia');
    console.log(`  亚洲屏幕中心：(${asiaPoint.xp}, ${asiaPoint.yp})`);

    // 模拟鼠标移动到亚洲中心并悬停
    console.log('▶ 5. 悬停亚洲');
    const targetX = canvasBox.x + asiaPoint.xp * canvasBox.width;
    const targetY = canvasBox.y + asiaPoint.yp * canvasBox.height;
    await page.mouse.move(targetX, targetY);
    await sleep(800);
    const hudText = await page.$eval('#hud-region', (el) => el.textContent.trim());
    console.log(`  HUD 提示：${hudText}`);
    await snap(page, '04-hover-asia');

    // 模拟 click
    console.log('▶ 6. 点击亚洲');
    await page.mouse.click(targetX, targetY);
    await sleep(2000); // 等待相机动画 + 卷轴展开

    const panelOpen = await page.$eval('#scroll-panel', (el) => el.classList.contains('is-open'));
    const titleText = await page.$eval('#scroll-title', (el) => el.textContent.trim());
    const subtitleText = await page.$eval('#scroll-subtitle', (el) => el.textContent.trim());
    const stampText = await page.$eval('#scroll-stamp', (el) => el.textContent.trim());
    const overviewText = await page.$eval('#scroll-overview', (el) => el.textContent.trim().slice(0, 80));
    const timelineCount = await page.$$eval('.timeline__item', (els) => els.length);

    console.log(`  卷轴已展开：${panelOpen}`);
    console.log(`  标题：${titleText}（${subtitleText}），印章字：${stampText}`);
    console.log(`  概述预览：${overviewText}…`);
    console.log(`  时间轴事件数：${timelineCount}`);

    const firstTwo = await page.$$eval('.timeline__item', (els) =>
      els.slice(0, 3).map((el) => ({
        year: el.querySelector('.timeline__year')?.textContent?.trim(),
        title: el.querySelector('.timeline__title')?.textContent?.trim(),
        descLen: el.querySelector('.timeline__desc')?.textContent?.trim()?.length || 0
      }))
    );
    console.log(`  前三个事件：`, JSON.stringify(firstTwo, null, 2));

    await snap(page, '05-scroll-open');

    // 关闭卷轴
    console.log('▶ 7. 关闭卷轴');
    await page.click('#close-scroll');
    await sleep(1200);
    const panelClosed = await page.$eval('#scroll-panel', (el) => !el.classList.contains('is-open'));
    console.log(`  卷轴已关闭：${panelClosed}`);
    await snap(page, '06-scroll-closed');

    // 拖拽旋转到欧洲，然后点击
    console.log('▶ 8. 拖拽旋转地球');
    await page.mouse.move(canvasBox.x + 700, canvasBox.y + 400);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 500, canvasBox.y + 400, { steps: 25 });
    await page.mouse.up();
    await sleep(1500);
    await snap(page, '07-rotated');

    // 找欧洲的命中点
    const newGrid = await page.evaluate(() => {
      const w = window;
      const points = [];
      for (let yp = 0.2; yp <= 0.8; yp += 0.05) {
        for (let xp = 0.2; xp <= 0.8; xp += 0.05) {
          const x = xp * window.innerWidth;
          const y = yp * window.innerHeight;
          const id = w.__worldGame.picker.pick(x, y);
          if (id) points.push({ xp: xp, yp: yp, id });
        }
      }
      return points;
    });
    const newByCont = {};
    newGrid.forEach(p => { newByCont[p.id] = (newByCont[p.id] || 0) + 1; });
    console.log(`  旋转后命中：`, newByCont);

    const europe = newGrid.find(p => p.id === 'europe');
    if (europe) {
      console.log('▶ 9. 点击欧洲');
      const ex = canvasBox.x + europe.xp * canvasBox.width;
      const ey = canvasBox.y + europe.yp * canvasBox.height;
      await page.mouse.move(ex, ey);
      await sleep(500);
      await page.mouse.click(ex, ey);
      await sleep(2000);
      const euroTitle = await page.$eval('#scroll-title', (el) => el.textContent.trim());
      const euroCount = await page.$$eval('.timeline__item', (els) => els.length);
      console.log(`  欧洲标题：${euroTitle}，事件数：${euroCount}`);
      await snap(page, '08-europe-scroll');
    } else {
      console.log('  未找到欧洲命中点（地球自转到了不包含欧洲的位置）');
    }

    // 控制台错误汇总
    console.log('\n========= 控制台汇总 =========');
    console.log(`总消息数：${consoleAll.length}`);
    console.log(`错误数：${consoleErrors.length}`);
    console.log(`页面错误：${pageErrors.length}`);
    if (consoleErrors.length) {
      console.log('错误详情：');
      consoleErrors.forEach((e, i) => console.log(`  [${i + 1}] ${e}`));
    }
    if (pageErrors.length) {
      console.log('页面错误：');
      pageErrors.forEach((e, i) => console.log(`  [${i + 1}] ${e}`));
    }

    const report = {
      url: URL,
      timestamp: new Date().toISOString(),
      checks: {
        titleScreenVisible: titleVisible,
        startButtonText: btnText,
        stageActive,
        canvasSize: `${canvasBox.width}x${canvasBox.height}`,
        globeRotY: grid.rotY,
        pickerCoverage: byContinent,
        hudOnHover: hudText,
        scrollPanelOpen: panelOpen,
        firstContinent: { title: titleText, subtitle: subtitleText, stamp: stampText, timelineCount },
        overviewPreview: overviewText,
        firstThreeEvents: firstTwo,
        scrollPanelClosed: panelClosed,
        consoleErrors,
        pageErrors
      }
    };
    fs.writeFileSync(path.join(OUT_DIR, 'audit-report.json'), JSON.stringify(report, null, 2));
    console.log(`\n📋 报告：${path.join(OUT_DIR, 'audit-report.json')}`);

    const allPassed =
      titleVisible &&
      btnText === '启卷' &&
      stageActive &&
      byContinent.asia >= 1 &&
      panelOpen &&
      titleText === '亚洲' &&
      timelineCount >= 5 &&
      consoleErrors.length === 0 &&
      pageErrors.length === 0;

    console.log(`\n${allPassed ? '✅ 全部检查通过' : '❌ 有未通过项'}`);
    process.exit(allPassed ? 0 : 1);
  } catch (err) {
    console.error('审查脚本出错：', err);
    process.exit(2);
  } finally {
    await browser.close();
  }
})();