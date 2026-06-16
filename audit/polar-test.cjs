/**
 * Polar & country-history flow verification script
 *
 * Verifies:
 *   1. Antarctic label is drawn at -68 (outside polar-distortion band)
 *   2. Arctic label exists at 78 (mirror of antarctic)
 *   3. The pre-fix polar centre -82 no longer hosts the text (only icecap)
 *   4. Chronicle timeline contains >=3 arctic-related events
 *   5. Country-history pop-back: detail -> close -> country list -> close -> fully closed
 */

const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const URL = 'http://127.0.0.1:5173/';
const OUT_DIR = path.join(__dirname, '..', 'audit-output');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

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
  const results = [];

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => consoleErrors.push(String(err)));

    await page.goto(URL, { waitUntil: 'networkidle0', timeout: 30000 });
    await sleep(800);
    await page.click('#start-btn');
    await sleep(1200);

    // 1. Single-pixel anchor sampling
    const labelCheck = await page.evaluate(() => {
      const wg = window.__worldGame;
      if (!wg) return { ok: false };
      const tex = wg.globe.earthMesh.material.map;
      const canvas = tex && tex.image;
      if (!canvas || !canvas.getContext) return { ok: false };
      const ctx = canvas.getContext('2d');
      const W = canvas.width, H = canvas.height;
      // Sweep a small grid around each anchor to find ANY paper-color pixel -
      // text glyphs are not at exact centre but within a ~30px radius.
      function findTextPixel(lon, lat, r) {
        const cx = Math.floor(((lon + 180) / 360) * W);
        const cy = Math.floor(((90 - lat) / 180) * H);
        for (let dy = -r; dy <= r; dy++) {
          for (let dx = -r; dx <= r; dx++) {
            const px = cx + dx, py = cy + dy;
            if (px < 0 || py < 0 || px >= W || py >= H) continue;
            const d = ctx.getImageData(px, py, 1, 1).data;
            // tight paper check
            if (d[0] >= 235 && d[1] >= 230 && d[2] >= 220 && d[2] <= 245) return { r: d[0], g: d[1], b: d[2] };
          }
        }
        return null;
      }
      return {
        ok: true,
        antarcticPx: findTextPixel(0, -68, 25),
        arcticPx: findTextPixel(0, 78, 20),
        oldPolePx: findTextPixel(0, -82, 15)  // expected: null (only icecap)
      };
    });
    console.log('1. anchor pixels:', JSON.stringify(labelCheck));
    if (labelCheck.ok) {
      results.push({ check: 'antarctic anchor has text fill (paper color)', pass: labelCheck.antarcticPx !== null });
      results.push({ check: 'arctic anchor has text fill (paper color)', pass: labelCheck.arcticPx !== null });
    }

    // 2. Region-based sampling: count "text-like" pixels in 3 regions
    const labelPixels = await page.evaluate(() => {
      const wg = window.__worldGame;
      if (!wg) return { ok: false };
      const tex = wg.globe.earthMesh.material.map;
      const canvas = tex && tex.image;
      if (!canvas || !canvas.getContext) return { ok: false };
      const ctx = canvas.getContext('2d');
      const W = canvas.width, H = canvas.height;
      function sampleRegion(lon, lat, r) {
        const cx = Math.floor(((lon + 180) / 360) * W);
        const cy = Math.floor(((90 - lat) / 180) * H);
        let text = 0, ice = 0, total = 0;
        for (let dy = -r; dy <= r; dy++) {
          for (let dx = -r; dx <= r; dx++) {
            const px = cx + dx, py = cy + dy;
            if (px < 0 || py < 0 || px >= W || py >= H) continue;
            const d = ctx.getImageData(px, py, 1, 1).data;
            total++;
            // Icecap first (d6ecf0 = 214, 236, 240) -- it is a bright blue-white that
            // would otherwise be mis-classified as paper. Exclude it from "text".
            const isIcecap = d[0] >= 200 && d[0] <= 225 && d[1] >= 225 && d[2] >= 230;
            if (isIcecap) { ice++; continue; }
            // Text fill is paper #f5f0e8 = (245, 240, 232) - very close to white.
            // Tighten range to avoid the bright ocean gradient stop #1a3338 / 0f1e22 false positives.
            const isPaper = d[0] >= 235 && d[1] >= 230 && d[2] >= 220 && d[2] <= 245;
            // English sub-label is xiang #ecaf1e = (236, 175, 30) - amber, distinct.
            const isXiang = d[0] >= 220 && d[1] >= 150 && d[1] <= 200 && d[2] <= 80;
            if (isPaper || isXiang) text++;
          }
        }
        return { text, ice, total };
      }
      return {
        ok: true,
        antarctic: sampleRegion(0, -68, 18),  // label area
        arctic: sampleRegion(0, 78, 14),      // label area
        oldPole: sampleRegion(0, -82, 10)     // icecap only, no text
      };
    });
    console.log('2. region samples:', JSON.stringify(labelPixels));
    if (labelPixels.ok) {
      results.push({ check: 'antarctic region has text pixels', pass: labelPixels.antarctic.text > 0 });
      results.push({ check: 'arctic region has text pixels', pass: labelPixels.arctic.text > 0 });
      // Old pole should be mostly icecap, very few text pixels
      results.push({
        check: 'old pole -82 has no label (text count near 0)',
        pass: labelPixels.oldPole.text < 5
      });
    }

    // 3. Chronicle contains arctic events
    await page.click('.view-switcher__btn[data-view="chronicle"]');
    await sleep(1500);
    const chronText = await page.evaluate(() =>
      Array.from(document.querySelectorAll('.timeline__title, .timeline__desc'))
        .map((e) => e.textContent).join(' || ')
    );
    const arcticKeywords = ['\u5317\u6781', '\u5317\u51b0\u6d0b', '\u76ae\u91cc', '\u5357\u68ee', '\u897f\u5317\u822a\u9053', '\u65af\u74e6\u5c14\u5df4', '\u56e0\u7ebd\u7279', '\u7ef4\u4eac', '\u6f02\u6d41\u7ad9'];
    const matched = arcticKeywords.filter((k) => chronText.includes(k));
    console.log('3. chronicle arctic keyword hits:', JSON.stringify(matched));
    results.push({ check: 'chronicle has >= 3 arctic events', pass: matched.length >= 3 });
    await page.screenshot({ path: path.join(OUT_DIR, 'view-chronicle-arctic.png') });

    // 4. Country-history pop-back flow
    // 先关闭当前打开的编年面板，再切到 country
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('.view-switcher__btn'))
        .find((b) => b.getAttribute('data-view') === 'country');
      if (btn) btn.click();
    });
    await sleep(1200);
    // Diagnostic: picker distribution
    const pickStats = await page.evaluate(() => {
      const wg = window.__worldGame;
      if (!wg) return { ok: false };
      const counts = {};
      for (let y = 0.05; y < 0.95; y += 0.03) {
        for (let x = 0.05; x < 0.95; x += 0.03) {
          const id = wg.picker.pick(x * window.innerWidth, y * window.innerHeight);
          if (id) counts[id] = (counts[id] || 0) + 1;
        }
      }
      return { ok: true, counts };
    });
    console.log('4. picker distribution:', JSON.stringify(pickStats));

    const asiaPoint = await page.evaluate(() => {
      const wg = window.__worldGame;
      if (!wg) return null;
      for (let y = 0.1; y < 0.9; y += 0.025) {
        for (let x = 0.05; x < 0.95; x += 0.025) {
          if (wg.picker.pick(x * window.innerWidth, y * window.innerHeight) === 'asia') return { x, y };
        }
      }
      return null;
    });
    console.log('4. asia point:', JSON.stringify(asiaPoint));
    results.push({ check: 'asia point found', pass: !!asiaPoint });

    if (asiaPoint) {
      // 诊断：点击前的当前 view + panel 状态
      const beforeClick = await page.evaluate(() => ({
        activeView: document.querySelector('.view-switcher__btn.is-active') && document.querySelector('.view-switcher__btn.is-active').dataset.view,
        panelOpen: document.getElementById('scroll-panel').classList.contains('is-open'),
        currentTitle: document.getElementById('scroll-title') && document.getElementById('scroll-title').textContent.trim()
      }));
      console.log('4-pre. before click:', JSON.stringify(beforeClick));

      await page.mouse.click(asiaPoint.x * 1280, asiaPoint.y * 800);
      await sleep(1500);
      const afterClick = await page.evaluate(() => ({
        panelOpen: document.getElementById('scroll-panel').classList.contains('is-open'),
        title: document.getElementById('scroll-title') && document.getElementById('scroll-title').textContent.trim(),
        divider: document.querySelector('.scroll-panel__divider span') && document.querySelector('.scroll-panel__divider span').textContent.trim(),
        cardCount: document.querySelectorAll('.country-card').length,
        timelineItemCount: document.querySelectorAll('.timeline__item').length,
        activeView: document.querySelector('.view-switcher__btn.is-active') && document.querySelector('.view-switcher__btn.is-active').dataset.view
      }));
      console.log('4a. after click asia:', JSON.stringify(afterClick));

      const hasCard = afterClick.cardCount > 0;
      results.push({ check: 'country card clickable (list opens)', pass: hasCard });
      results.push({ check: 'country list divider = civil-yuan-yao', pass: afterClick.divider === '\u6587\u660e\u7eaa\u8981' });

      if (hasCard) {
        await page.click('.country-card');
        await sleep(1200);
        const inDetail = await page.evaluate(() => ({
          closeLabel: document.querySelector('#close-scroll span') && document.querySelector('#close-scroll span').textContent.trim(),
          divider: document.querySelector('.scroll-panel__divider span') && document.querySelector('.scroll-panel__divider span').textContent.trim()
        }));
        console.log('4b. in country detail:', JSON.stringify(inDetail));
        results.push({ check: 'country detail close label = back-to-upper', pass: inDetail.closeLabel === '\u8fd4\u56de\u4e0a\u5c42' });
        results.push({ check: 'country detail divider = guo-shi-ji-yao', pass: inDetail.divider === '\u56fd\u53f2\u7eaa\u8981' });

        // First close: should pop back to country list
        await page.click('#close-scroll');
        await sleep(1200);
        const afterPop = await page.evaluate(() => ({
          closeLabel: document.querySelector('#close-scroll span') && document.querySelector('#close-scroll span').textContent.trim(),
          cardCount: document.querySelectorAll('.country-card').length,
          divider: document.querySelector('.scroll-panel__divider span') && document.querySelector('.scroll-panel__divider span').textContent.trim(),
          panelOpen: document.getElementById('scroll-panel').classList.contains('is-open')
        }));
        console.log('4c. after 1st close:', JSON.stringify(afterPop));
        results.push({
          check: 'pop returns to country list',
          pass: afterPop.divider === '\u6587\u660e\u7eaa\u8981' && afterPop.cardCount > 0 && afterPop.panelOpen
        });

        // Second close: should fully close panel
        await page.click('#close-scroll');
        await sleep(800);
        const finalClosed = await page.evaluate(() => !document.getElementById('scroll-panel').classList.contains('is-open'));
        results.push({ check: '2nd close fully closes panel', pass: finalClosed });
      }
    }

  } catch (err) {
    console.error('test exception:', err);
    results.push({ check: 'no exception', pass: false });
  } finally {
    await browser.close();
  }

  console.log('\n========= Summary =========');
  let allPass = true;
  for (const r of results) {
    const mark = r.pass ? 'OK' : 'FAIL';
    console.log('  ' + mark + ' ' + r.check);
    if (!r.pass) allPass = false;
  }
  console.log('\nconsole errors:', consoleErrors.length);
  if (consoleErrors.length) console.log(consoleErrors);
  console.log(allPass ? '\nALL PASS' : '\nSOME FAILED');
  process.exit(allPass ? 0 : 1);
})();
