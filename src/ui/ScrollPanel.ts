/**
 * UI - 卷轴面板与时间轴（支持三种内容视图 + 层级栈）
 *
 * 内部维护一个视图栈 (stack)，每次 openXxx push 一层。
 * 合卷按钮默认 pop 上一层；若栈已空，则彻底关闭面板。
 * 例如：点亚洲 → 文明列表 → 点中华文明 → 点「合卷」→ 回到亚洲文明列表
 */

import gsap from 'gsap';
import { CONTENT } from '../data/content';
import type { OriginEvent } from '../data/content';
import type { ContinentId } from '../data/continents';
import { CONTINENTS } from '../data/continents';
import { CHRONICLE } from '../data/chronicle';
import { getCountriesByContinent, getCountry } from '../data/countries';
import { formatYear } from '../utils/geo';

type StackEntry =
  | { kind: 'continent'; continentId: ContinentId }
  | { kind: 'chronicle' }
  | { kind: 'continentCountries'; continentId: ContinentId }
  | { kind: 'country'; countryId: string };

export class ScrollPanel {
  private panel: HTMLElement;
  private titleEl: HTMLElement;
  private subtitleEl: HTMLElement;
  private stampEl: HTMLElement;
  private overviewEl: HTMLElement;
  private timelineEl: HTMLElement;
  private dividerEl: HTMLElement;
  private closeBtn: HTMLElement;
  private onClose: (() => void) | null = null;
  private onCountrySelect: ((countryId: string) => void) | null = null;

  /** 视图栈：栈顶 = 当前显示的视图 */
  private stack: StackEntry[] = [];

  constructor() {
    this.panel = document.getElementById('scroll-panel')!;
    this.titleEl = document.getElementById('scroll-title')!;
    this.subtitleEl = document.getElementById('scroll-subtitle')!;
    this.stampEl = document.getElementById('scroll-stamp')!;
    this.overviewEl = document.getElementById('scroll-overview')!;
    this.timelineEl = document.getElementById('timeline')!;
    this.dividerEl = document.querySelector('.scroll-panel__divider span') as HTMLElement;
    this.closeBtn = document.getElementById('close-scroll')!;

    this.closeBtn.addEventListener('click', () => this.popOrClose());

    // 卡片点击事件委托（文明列表视图）
    this.timelineEl.addEventListener('click', (e) => {
      const card = (e.target as HTMLElement).closest('[data-country-id]');
      if (card) {
        const id = card.getAttribute('data-country-id');
        if (id) this.onCountrySelect?.(id);
      }
    });
  }

  setOnClose(cb: () => void) {
    this.onClose = cb;
  }

  setOnCountrySelect(cb: (id: string) => void) {
    this.onCountrySelect = cb;
  }

  /* ============================================================
   * 公共 API
   * ============================================================ */

  /** 视图 1：大陆溯源（替换栈 → 单一层） */
  openContinent(continentId: ContinentId) {
    this.stack = [{ kind: 'continent', continentId }];
    this.renderStackTop();
  }

  /** 视图 2：地球编年史（替换栈 → 单一层） */
  openChronicle() {
    this.stack = [{ kind: 'chronicle' }];
    this.renderStackTop();
  }

  /** 视图 3a：某大陆的诸文明列表（替换栈 → 单一层） */
  openContinentCountries(continentId: ContinentId) {
    this.stack = [{ kind: 'continentCountries', continentId }];
    this.renderStackTop();
  }

  /** 视图 3b：单个国家/文明的历史（在栈上 push 新层） */
  openCountry(countryId: string) {
    // 在当前栈上 push；如果栈里已有同 countryId，替换为新位置
    this.stack = this.stack.filter((e) => e.kind !== 'country' || e.countryId !== countryId);
    this.stack.push({ kind: 'country', countryId });
    this.renderStackTop();
  }

  /**
   * 合卷按钮的行为：弹栈。
   *  - 栈深度 > 1：返回上一层
   *  - 栈深度 = 1：彻底关闭面板
   */
  popOrClose() {
    if (this.stack.length > 1) {
      this.stack.pop();
      this.renderStackTop();
    } else {
      this.close();
    }
  }

  /** 强制立即显示（跳过动画） */
  showImmediate(continentId: ContinentId) {
    this.openContinent(continentId);
    this.panel.style.transition = 'none';
    this.panel.style.opacity = '1';
    this.panel.style.visibility = 'visible';
    this.panel.style.transform = 'none';
    requestAnimationFrame(() => {
      this.panel.style.transition = '';
    });
  }

  /** 彻底关闭（清空栈） */
  close() {
    this.stack = [];
    this.panel.classList.remove('is-open');
    this.panel.classList.add('is-closed');
    this.panel.setAttribute('aria-hidden', 'true');
    // 与 CSS transition 0.5s 匹配
    gsap.delayedCall(0.5, () => {
      if (!this.panel.classList.contains('is-open')) {
        this.panel.classList.remove('is-closed');
      }
    });
    this.onClose?.();
  }

  /** 检查 panel 当前是否处于可见状态 */
  isOpen(): boolean {
    return this.panel.classList.contains('is-open');
  }

  isVisible(): boolean {
    return this.panel.classList.contains('is-open');
  }

  /** 当前栈深度（供 main.ts 判断是否需要复位相机等） */
  getDepth(): number {
    return this.stack.length;
  }

  /* ============================================================
   * 渲染
   * ============================================================ */

  /** 渲染栈顶视图 */
  private renderStackTop() {
    const top = this.stack[this.stack.length - 1];
    if (!top) {
      this.close();
      return;
    }
    switch (top.kind) {
      case 'continent':
        this.renderContinent(top.continentId);
        break;
      case 'chronicle':
        this.renderChronicle();
        break;
      case 'continentCountries':
        this.renderContinentCountries(top.continentId);
        break;
      case 'country':
        this.renderCountry(top.countryId);
        break;
    }
    this.show();
  }

  /** 渲染：大陆溯源 */
  private renderContinent(continentId: ContinentId) {
    const continent = CONTINENTS.find((c) => c.id === continentId);
    const content = CONTENT[continentId];
    if (!continent || !content) return;

    this.titleEl.textContent = continent.name;
    this.subtitleEl.textContent = continent.nameEn;
    this.stampEl.textContent = continent.stamp;
    this.overviewEl.textContent = content.overview;
    // 第 8 区北极专属文案
    this.setDivider(continentId === 'arctic' ? '极地纪要' : '史前纪要');
    this.setCloseLabel('合卷');

    const sorted = [...content.timeline].sort((a, b) => a.year - b.year);
    this.renderTimeline(sorted);
  }

  /** 渲染：地球编年史 */
  private renderChronicle() {
    this.titleEl.textContent = '地球编年';
    this.subtitleEl.textContent = 'Earth Chronicle';
    this.stampEl.textContent = '编';
    this.overviewEl.textContent =
      '四十六亿年地球史，从岩浆沸腾的冥古宙，到冰雪覆盖的雪球地球；从寒武纪的生命大爆发，到恐龙的兴衰；从冰河时代的猛犸，到走出非洲的智人。这是一部地球与生命的史诗。';
    this.setDivider('地质纪元');
    this.setCloseLabel('合卷');

    const events: OriginEvent[] = [];
    for (const era of CHRONICLE) {
      events.push(...era.events);
    }
    events.sort((a, b) => a.year - b.year);
    this.renderTimeline(events);
  }

  /** 渲染：某大陆的文明列表 */
  private renderContinentCountries(continentId: ContinentId) {
    const continent = CONTINENTS.find((c) => c.id === continentId);
    if (!continent) return;

    const countries = getCountriesByContinent(continentId);

    this.titleEl.textContent = continent.name;
    this.subtitleEl.textContent = continent.nameEn + ' · 文明';
    this.stampEl.textContent = continent.stamp;
    this.setCloseLabel('合卷');

    if (countries.length === 0) {
      this.overviewEl.textContent = `此大陆暂未收录独立文明史，欢迎继续探索其他大陆。`;
      this.setDivider('文明纪要');
      this.timelineEl.innerHTML = `
        <li class="timeline__empty">暂无文明收录</li>
      `;
    } else {
      this.overviewEl.textContent = `${continent.name}的${countries.length}个代表性文明，点击卡片以观其详。`;
      this.setDivider('文明纪要');
      this.renderCountryGrid(countries);
    }
  }

  /** 渲染：单个国家/文明 */
  private renderCountry(countryId: string) {
    const country = getCountry(countryId);
    if (!country) return;

    this.titleEl.textContent = country.name;
    this.subtitleEl.textContent = country.nameEn;
    this.stampEl.textContent = country.stamp;
    this.overviewEl.textContent = country.overview;
    this.setDivider('国史纪要');
    // 处于「国史详情」层时，合卷按钮语义是「返回上层」
    this.setCloseLabel('返回上层');

    const sorted = [...country.timeline].sort((a, b) => a.year - b.year);
    this.renderTimeline(sorted);
  }

  /* ============================================================
   * 渲染辅助方法
   * ============================================================ */

  /** 渲染标准时间轴 */
  private renderTimeline(events: OriginEvent[]) {
    this.timelineEl.innerHTML = events
      .map(
        (ev, i) => `
          <li class="timeline__item" style="animation-delay: ${0.1 + i * 0.06}s">
            <div class="timeline__year">${formatYear(ev.year)}</div>
            ${ev.era ? `<div class="timeline__era">${escapeHtml(ev.era)}</div>` : ''}
            ${ev.image ? `<div class="timeline__image"><img src="${escapeHtml(ev.image)}" alt="${escapeHtml(ev.title)}" loading="lazy" /></div>` : ''}
            <h3 class="timeline__title">${escapeHtml(ev.title)}</h3>
            <p class="timeline__desc">${escapeHtml(ev.description)}</p>
            ${ev.artifacts && ev.artifacts.length
              ? `<div class="timeline__artifacts">
                  <span class="timeline__artifacts-label">遗存</span>
                  ${ev.artifacts.map(escapeHtml).join(' · ')}
                </div>`
              : ''}
          </li>
        `
      )
      .join('');
  }

  /** 渲染文明卡片网格 */
  private renderCountryGrid(countries: ReturnType<typeof getCountriesByContinent>) {
    this.timelineEl.innerHTML = countries
      .map(
        (c, i) => `
          <li class="country-card" data-country-id="${escapeHtml(c.id)}" style="animation-delay: ${0.1 + i * 0.05}s">
            <span class="country-card__stamp">${escapeHtml(c.stamp)}</span>
            <div class="country-card__body">
              <h3 class="country-card__name">${escapeHtml(c.name)}</h3>
              <p class="country-card__nameEn">${escapeHtml(c.nameEn)}</p>
              <p class="country-card__region">${escapeHtml(c.region)}</p>
            </div>
            <span class="country-card__arrow">›</span>
          </li>
        `
      )
      .join('');
  }

  /** 更新分隔符文字 */
  private setDivider(text: string) {
    if (this.dividerEl) this.dividerEl.textContent = text;
  }

  /** 动态切换合卷按钮文字（合卷 / 返回上层） */
  private setCloseLabel(text: string) {
    const span = this.closeBtn.querySelector('span');
    if (span) span.textContent = text;
    this.closeBtn.setAttribute('aria-label', text);
  }

  /** 通用显示方法 */
  private show() {
    this.panel.classList.remove('is-closed');
    this.panel.setAttribute('aria-hidden', 'false');
    this.panel.classList.add('is-open');
    const body = this.panel.querySelector('.scroll-panel__body') as HTMLElement | null;
    if (body) body.scrollTop = 0;
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
