/**
 * UI - 大陆悬停提示卡
 */

import { CONTINENTS } from '../data/continents';
import type { ContinentId } from '../data/continents';

export class RegionTooltip {
  private el: HTMLElement;

  constructor() {
    this.el = document.getElementById('region-tooltip')!;
  }

  show(continentId: ContinentId, x: number, y: number) {
    const c = CONTINENTS.find((c) => c.id === continentId);
    if (!c) return;
    this.el.textContent = `${c.name} · ${c.nameEn}`;
    this.el.style.left = `${x}px`;
    this.el.style.top = `${y}px`;
    this.el.hidden = false;
  }

  hide() {
    this.el.hidden = true;
  }
}

export class RegionHud {
  private el: HTMLElement;

  constructor() {
    this.el = document.getElementById('hud-region')!;
  }

  set(continentId: ContinentId | null) {
    if (!continentId) {
      this.el.textContent = '点击大陆以观其详';
      this.el.classList.remove('is-active');
      return;
    }
    const c = CONTINENTS.find((c) => c.id === continentId);
    if (!c) return;
    this.el.textContent = `${c.name} · ${c.nameEn}`;
    this.el.classList.add('is-active');
  }
}