/**
 * UI - 卷轴面板与时间轴（支持三种内容视图）
 */

import gsap from 'gsap';
import { CONTENT } from '../data/content';
import type { OriginEvent } from '../data/content';
import type { ContinentId } from '../data/continents';
import { CONTINENTS } from '../data/continents';
import { CHRONICLE } from '../data/chronicle';
import { getCountriesByContinent, getCountry } from '../data/countries';
import { formatYear } from '../utils/geo';

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

  constructor() {
    this.panel = document.getElementById('scroll-panel')!;
    this.titleEl = document.getElementById('scroll-title')!;
    this.subtitleEl = document.getElementById('scroll-subtitle')!;
    this.stampEl = document.getElementById('scroll-stamp')!;
    this.overviewEl = document.getElementById('scroll-overview')!;
    this.timelineEl = document.getElementById('timeline')!;
    this.dividerEl = document.querySelector('.scroll-panel__divider span') as HTMLElement;
    this.closeBtn = document.getElementById('close-scroll')!;

    this.closeBtn.addEventListener('click', () => this.close());

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
   * 视图 1：大陆溯源（原有行为）
   * ============================================================ */
  openContinent(continentId: ContinentId) {
    const continent = CONTINENTS.find((c) => c.id === continentId);
    const content = CONTENT[continentId];
    if (!continent || !content) return;

    this.titleEl.textContent = continent.name;
    this.subtitleEl.textContent = continent.nameEn;
    this.stampEl.textContent = continent.stamp;
    this.overviewEl.textContent = content.overview;
    this.setDivider('史前纪要');

    const sorted = [...content.timeline].sort((a, b) => a.year - b.year);
    this.renderTimeline(sorted);
    this.show();
  }

  /* ============================================================
   * 视图 2：地球编年史（全球纪元分段）
   * ============================================================ */
  openChronicle() {
    this.titleEl.textContent = '地球编年';
    this.subtitleEl.textContent = 'Earth Chronicle';
    this.stampEl.textContent = '编';
    this.overviewEl.textContent =
      '四十六亿年地球史，从岩浆沸腾的冥古宙，到冰雪覆盖的雪球地球；从寒武纪的生命大爆发，到恐龙的兴衰；从冰河时代的猛犸，到走出非洲的智人。这是一部地球与生命的史诗。';
    this.setDivider('地质纪元');

    // 编年史：将所有纪元的事件按时间顺序渲染，纪元名作为分组标题
    const events: OriginEvent[] = [];
    for (const era of CHRONICLE) {
      events.push(...era.events);
    }
    events.sort((a, b) => a.year - b.year);
    this.renderTimeline(events);
    this.show();
  }

  /* ============================================================
   * 视图 3a：某大陆的诸文明列表（卡片网格）
   * ============================================================ */
  openContinentCountries(continentId: ContinentId) {
    const continent = CONTINENTS.find((c) => c.id === continentId);
    if (!continent) return;

    const countries = getCountriesByContinent(continentId);

    this.titleEl.textContent = continent.name;
    this.subtitleEl.textContent = continent.nameEn + ' · 文明';
    this.stampEl.textContent = continent.stamp;

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
    this.show();
  }

  /* ============================================================
   * 视图 3b：单个国家/文明的历史
   * ============================================================ */
  openCountry(countryId: string) {
    const country = getCountry(countryId);
    if (!country) return;

    this.titleEl.textContent = country.name;
    this.subtitleEl.textContent = country.nameEn;
    this.stampEl.textContent = country.stamp;
    this.overviewEl.textContent = country.overview;
    this.setDivider('国史纪要');

    const sorted = [...country.timeline].sort((a, b) => a.year - b.year);
    this.renderTimeline(sorted);
    this.show();
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

  /** 通用显示方法 */
  private show() {
    this.panel.classList.remove('is-closed');
    this.panel.setAttribute('aria-hidden', 'false');
    this.panel.classList.add('is-open');
    const body = this.panel.querySelector('.scroll-panel__body') as HTMLElement | null;
    if (body) body.scrollTop = 0;
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

  close() {
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

  /** 检查 panel 当前是否处于可见状态（考虑动画进行中） */
  isVisible(): boolean {
    return this.panel.classList.contains('is-open');
  }

  isOpen(): boolean {
    return this.panel.classList.contains('is-open');
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
