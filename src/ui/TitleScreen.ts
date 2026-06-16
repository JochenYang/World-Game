/**
 * UI - 启动封面
 */

export class TitleScreen {
  private el: HTMLElement;
  private onStart: (() => void) | null = null;
  private started = false;

  constructor() {
    this.el = document.getElementById('title-screen')!;
    const btn = document.getElementById('start-btn')!;
    btn.addEventListener('click', () => this.start());
  }

  setOnStart(cb: () => void) {
    this.onStart = cb;
  }

  isStarted(): boolean {
    return this.started;
  }

  private start() {
    this.started = true;
    this.el.classList.add('is-hidden');
    document.getElementById('stage')?.classList.add('is-active');
    document.getElementById('stage')?.setAttribute('aria-hidden', 'false');
    this.onStart?.();
  }
}