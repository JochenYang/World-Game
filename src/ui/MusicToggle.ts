/**
 * 音乐开关 UI - 印章风格按钮
 *
 * 设计：圆形朱红印章 + "乐" 字；按下后变灰，aria-pressed 反映状态
 * 默认根据 MusicManager 的初始 muted 状态显示
 */

import type { MusicManager } from '../core/MusicManager';

const STORAGE_KEY = 'wg.music.muted';

export class MusicToggle {
  private btn: HTMLButtonElement;

  constructor(private music: MusicManager, parent: HTMLElement) {
    this.btn = document.createElement('button');
    this.btn.id = 'music-toggle';
    this.btn.className = 'music-toggle';
    this.btn.type = 'button';
    this.btn.setAttribute('aria-label', '背景音乐');
    this.btn.setAttribute('aria-pressed', 'true');
    this.btn.title = '背景音乐（点击开关）';
    this.btn.innerHTML = `
      <span class="music-toggle__label">乐乐</span>
    `;

    // 初始状态
    this.applyState(this.music.isMuted());

    this.btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const next = !this.music.isMuted();
      this.music.setMuted(next);
      this.applyState(next);
    });

    parent.appendChild(this.btn);
  }

  private applyState(muted: boolean): void {
    this.btn.classList.toggle('is-muted', muted);
    this.btn.setAttribute('aria-pressed', muted ? 'false' : 'true');
    this.btn.title = muted ? '背景音乐已关闭（点击开启）' : '背景音乐已开启（点击关闭）';
    const label = this.btn.querySelector('.music-toggle__label');
    if (label) label.textContent = muted ? '寂' : '乐乐';
  }
}

// 暴露一个纯函数给 main.ts 在初始化前读取持久化状态，避免闪烁
export function loadInitialMuted(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}
