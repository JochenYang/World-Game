/**
 * UI - 卷轴面板与时间轴
 */

import gsap from 'gsap';
import { CONTENT } from '../data/content';
import type { ContinentId } from '../data/continents';
import { CONTINENTS } from '../data/continents';
import { formatYear } from '../utils/geo';

export class ScrollPanel {
  private panel: HTMLElement;
  private titleEl: HTMLElement;
  private subtitleEl: HTMLElement;
  private stampEl: HTMLElement;
  private overviewEl: HTMLElement;
  private timelineEl: HTMLElement;
  private closeBtn: HTMLElement;
  private onClose: (() => void) | null = null;

  constructor() {
    this.panel = document.getElementById('scroll-panel')!;
    this.titleEl = document.getElementById('scroll-title')!;
    this.subtitleEl = document.getElementById('scroll-subtitle')!;
    this.stampEl = document.getElementById('scroll-stamp')!;
    this.overviewEl = document.getElementById('scroll-overview')!;
    this.timelineEl = document.getElementById('timeline')!;
    this.closeBtn = document.getElementById('close-scroll')!;

    this.closeBtn.addEventListener('click', () => this.close());
  }

  setOnClose(cb: () => void) {
    this.onClose = cb;
  }

  open(continentId: ContinentId) {
    const continent = CONTINENTS.find((c) => c.id === continentId);
    const content = CONTENT[continentId];
    if (!continent || !content) return;

    this.titleEl.textContent = continent.name;
    this.subtitleEl.textContent = continent.nameEn;
    this.stampEl.textContent = continent.stamp;
    this.overviewEl.textContent = content.overview;

    // 时间轴 - 按时间从早到晚
    const sorted = [...content.timeline].sort((a, b) => a.year - b.year);
    this.timelineEl.innerHTML = sorted
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

    this.panel.classList.remove('is-closed');
    this.panel.setAttribute('aria-hidden', 'false');
    this.panel.classList.add('is-open');

    // 滚动到顶
    const body = this.panel.querySelector('.scroll-panel__body') as HTMLElement | null;
    if (body) body.scrollTop = 0;
  }

  /** 强制立即显示（跳过动画） */
  showImmediate(continentId: ContinentId) {
    this.open(continentId);
    this.panel.style.transition = 'none';
    this.panel.style.transform = 'translateX(0)';
    requestAnimationFrame(() => {
      this.panel.style.transition = '';
    });
  }

  close() {
    this.panel.classList.remove('is-open');
    this.panel.classList.add('is-closed');
    this.panel.setAttribute('aria-hidden', 'true');
    gsap.delayedCall(0.85, () => {
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