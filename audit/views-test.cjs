/**
 * 三视图功能验证脚本
 *
 * 测试：
 *  1. 默认「大陆溯源」模式
 *  2. 切换到「地球编年」→ 卷轴自动展开
 *  3. 切换到「列国史」→ 点击大陆 → 显示文明卡片 → 点击卡片 → 显示国史
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

    // 1. 打开 + 启动
    await page.goto(URL, { waitUntil: 'networkidle0', timeout: 30000 });
    await sleep(800);
    await page.click('#start-btn');
    await sleep(1200);
    console.log('▶ 1. 启动完成');

    // 2. 验证切换器存在
    const switcherExists = await page.evaluate(() => {
      const btns = document.querySelectorAll('.view-switcher__btn');
      return Array.from(btns).map((b) => ({
        view: b.dataset.view,
        text: b.textContent.trim(),
        active: b.classList.contains('is-active')
      }));
    });
    console.log('▶ 2. 切换器按钮:', JSON.stringify(switcherExists));
    results.push({ check: 'switcher has 3 buttons', pass: switcherExists.length === 3 });
    results.push({ check: 'continent is active by default', pass: switcherExists[0]?.active === true && switcherExists[0]?.view === 'continent' });

    // 3. 切换到「地球编年」→ 卷轴应自动展开
    await page.click('.view-switcher__btn[data-view="chronicle"]');
    await sleep(1500);
    const chronicleState = await page.evaluate(() => {
      const panel = document.getElementById('scroll-panel');
      const title = document.getElementById('scroll-title')?.textContent.trim();
      const events = document.querySelectorAll('.timeline__item').length;
      const divider = document.querySelector('.scroll-panel__divider span')?.textContent.trim();
      const activeBtn = document.querySelector('.view-switcher__btn.is-active')?.dataset.view;
      const isOpen = panel?.classList.contains('is-open');
      return { title, events, divider, activeBtn, isOpen };
    });
    console.log('▶ 3. 编年史视图:', JSON.stringify(chronicleState));
    await page.screenshot({ path: path.join(OUT_DIR, 'view-chronicle.png') });
    results.push({ check: 'chronicle auto-opens panel', pass: chronicleState.isOpen === true });
    results.push({ check: 'chronicle title is 地球编年', pass: chronicleState.title === '地球编年' });
    results.push({ check: 'chronicle has events', pass: chronicleState.events > 0 });
    results.push({ check: 'chronicle divider is 地质纪元', pass: chronicleState.divider === '地质纪元' });
    results.push({ check: 'chronicle btn is active', pass: chronicleState.activeBtn === 'chronicle' });

    // 4. 切换到「列国史」→ 卷轴应关闭，等待点击大陆
    await page.click('.view-switcher__btn[data-view="country"]');
    await sleep(1200);
    const countryInitState = await page.evaluate(() => {
      const panel = document.getElementById('scroll-panel');
      const activeBtn = document.querySelector('.view-switcher__btn.is-active')?.dataset.view;
      const region = document.getElementById('hud-region')?.textContent.trim();
      return {
        activeBtn,
        panelClosed: !panel?.classList.contains('is-open'),
        region
      };
    });
    console.log('▶ 4. 列国史初始:', JSON.stringify(countryInitState));
    results.push({ check: 'country btn is active', pass: countryInitState.activeBtn === 'country' });
    results.push({ check: 'country panel closed initially', pass: countryInitState.panelClosed === true });

    // 5. 扫描命中点（找亚洲点击点）
    const asiaPoint = await page.evaluate(() => {
      const wg = window.__worldGame;
      if (!wg) return null;
      const { picker } = wg;
      // 从屏幕中心向四周扫描找亚洲
      for (let y = 0.2; y < 0.8; y += 0.04) {
        for (let x = 0.2; x < 0.85; x += 0.04) {
          const id = picker.pick(
            x * window.innerWidth,
            y * window.innerHeight
          );
          if (id === 'asia') return { x, y };
        }
      }
      return null;
    });

    if (asiaPoint) {
      console.log('▶ 5. 找到亚洲点:', JSON.stringify(asiaPoint));
      // 点击亚洲 → 应显示文明卡片
      await page.mouse.click(
        asiaPoint.x * 1280,
        asiaPoint.y * 800
      );
      await sleep(1800);

      const countryListState = await page.evaluate(() => {
        const title = document.getElementById('scroll-title')?.textContent.trim();
        const cards = document.querySelectorAll('.country-card').length;
        const cardNames = Array.from(document.querySelectorAll('.country-card__name')).map((e) => e.textContent.trim());
        const divider = document.querySelector('.scroll-panel__divider span')?.textContent.trim();
        return { title, cards, cardNames, divider };
      });
      console.log('▶ 6. 亚洲文明卡片:', JSON.stringify(countryListState));
      await page.screenshot({ path: path.join(OUT_DIR, 'view-country-list.png') });
      results.push({ check: 'country list shows cards', pass: countryListState.cards > 0 });
      results.push({ check: 'country list divider is 文明纪要', pass: countryListState.divider === '文明纪要' });
      results.push({ check: 'asia has china card', pass: countryListState.cardNames.some((n) => n.includes('中华')) });

      // 7. 点击第一张卡片 → 应显示该国历史
      const firstCardCountryId = await page.evaluate(() => {
        const card = document.querySelector('.country-card');
        return card?.getAttribute('data-country-id');
      });
      if (firstCardCountryId) {
        await page.click('.country-card');
        await sleep(1200);
        const countryDetailState = await page.evaluate(() => {
          const title = document.getElementById('scroll-title')?.textContent.trim();
          const events = document.querySelectorAll('.timeline__item').length;
          const divider = document.querySelector('.scroll-panel__divider span')?.textContent.trim();
          return { title, events, divider };
        });
        console.log('▶ 7. 国史详情:', JSON.stringify(countryDetailState));
        await page.screenshot({ path: path.join(OUT_DIR, 'view-country-detail.png') });
        results.push({ check: 'country detail shows events', pass: countryDetailState.events > 0 });
        results.push({ check: 'country detail divider is 国史纪要', pass: countryDetailState.divider === '国史纪要' });
      }
    } else {
      console.log('▶ 5. 未找到亚洲命中点（跳过列国史点击测试）');
      results.push({ check: 'asia point found', pass: false });
    }

    // 8. 切回大陆溯源
    await page.click('.view-switcher__btn[data-view="continent"]');
    await sleep(1000);
    const backState = await page.evaluate(() => {
      const activeBtn = document.querySelector('.view-switcher__btn.is-active')?.dataset.view;
      const region = document.getElementById('hud-region')?.textContent.trim();
      return { activeBtn, region };
    });
    console.log('▶ 8. 切回大陆溯源:', JSON.stringify(backState));
    results.push({ check: 'back to continent view', pass: backState.activeBtn === 'continent' });

  } catch (err) {
    console.error('❌ 测试异常:', err);
    results.push({ check: 'no exception', pass: false });
  } finally {
    await browser.close();
  }

  // 汇总
  console.log('\n========= 检查汇总 =========');
  let allPass = true;
  for (const r of results) {
    const mark = r.pass ? '✅' : '❌';
    console.log(`  ${mark} ${r.check}`);
    if (!r.pass) allPass = false;
  }
  console.log('\n控制台错误数:', consoleErrors.length);
  if (consoleErrors.length) console.log(consoleErrors);
  console.log(allPass ? '\n✅ 全部检查通过' : '\n❌ 有未通过项');
  process.exit(allPass ? 0 : 1);
})();
