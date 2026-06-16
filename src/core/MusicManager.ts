/**
 * 音乐管理器 - 负责加载/切换/淡入淡出
 *
 * 设计：
 *  - 维护 4 条独立音轨（封面/大陆/编年/列国），全部预加载
 *  - 切换时旧音淡出（1.5s）+ 新音淡入（1.5s），避免突兀
 *  - 全局静音通过 volume 控制而非 pause，确保淡入淡出逻辑统一
 *  - 持久化静音状态到 localStorage
 *  - 浏览器自动播放策略：仅在用户首次交互后启动播放
 */

const STORAGE_KEY = 'wg.music.muted';
const FADE_MS = 1500;
const TARGET_VOLUME = 0.45;

export type Scene =
  | 'cover'
  | 'asia'
  | 'africa'
  | 'europe'
  | 'northAmerica'
  | 'southAmerica'
  | 'oceania'
  | 'antarctica'
  | 'arctic';

const TRACKS: Record<Scene, string> = {
  cover: '/music/cover.mp3',
  asia: '/music/asia.mp3',
  africa: '/music/africa.mp3',
  europe: '/music/europe.mp3',
  northAmerica: '/music/northAmerica.mp3',
  southAmerica: '/music/southAmerica.mp3',
  oceania: '/music/oceania.mp3',
  antarctica: '/music/antarctica.mp3',
  arctic: '/music/arctic.mp3'
};

export class MusicManager {
  private audios: Partial<Record<Scene, HTMLAudioElement>> = {};
  private currentScene: Scene | null = null;
  private muted = false;
  private fadeFrame: number | null = null;
  private userInteracted = false;

  constructor() {
    this.muted = this.loadMuted();
    // 预创建 4 条音轨（不自动播放）
    for (const [scene, src] of Object.entries(TRACKS) as [Scene, string][]) {
      const audio = new Audio(src);
      audio.loop = true;
      audio.preload = 'auto';
      audio.volume = 0;
      audio.crossOrigin = 'anonymous';
      this.audios[scene] = audio;
    }

    // 监听首次交互，触发自动播放解锁
    const onFirstInteract = () => {
      this.userInteracted = true;
      window.removeEventListener('pointerdown', onFirstInteract);
      window.removeEventListener('keydown', onFirstInteract);
      // 若此时已有 currentScene 但还没真正播放，补播
      if (this.currentScene && !this.muted) {
        this.fadeTo(this.currentScene, 0);
      }
    };
    window.addEventListener('pointerdown', onFirstInteract, { once: true });
    window.addEventListener('keydown', onFirstInteract, { once: true });
  }

  /** 切换到指定场景的音乐（淡入淡出） */
  switchTo(scene: Scene): void {
    if (this.currentScene === scene) return;
    const next = this.audios[scene];
    if (!next) return;
    this.currentScene = scene;
    // 用户未交互时立即尝试播放（试探浏览器 autoplay 策略）：
    //  - 若浏览器允许（用户此前与该域名有过交互），立即出声
    //  - 若浏览器拒绝（全新会话），失败被吞掉，等首次 pointerdown/keydown 解锁
    // 音量保持 0，由首次交互后的补播或下一次 fadeTo 推到目标音量。
    const probe = next.play();
    if (probe && typeof probe.catch === 'function') {
      probe.catch(() => { /* 等待用户交互解锁 */ });
    }
    if (!this.userInteracted || this.muted) {
      return;
    }
    this.fadeTo(scene, FADE_MS);
  }

  /** 全局静音切换 */
  setMuted(muted: boolean): void {
    this.muted = muted;
    this.saveMuted(muted);
    if (muted) {
      // 立即停止所有音轨淡入逻辑，并把当前音淡出至 0
      this.cancelFade();
      const cur = this.currentScene ? this.audios[this.currentScene] : null;
      if (cur) this.fadeVolume(cur, cur.volume, 0, 400);
    } else {
      // 取消静音：若已有 currentScene，重新淡入
      if (this.currentScene && this.userInteracted) {
        this.fadeTo(this.currentScene, 600);
      }
    }
  }

  isMuted(): boolean {
    return this.muted;
  }

  /** 销毁（清理音轨引用） */
  destroy(): void {
    this.cancelFade();
    for (const audio of Object.values(this.audios)) {
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    }
    this.audios = {};
  }

  // ============ 内部 ============

  private fadeTo(scene: Scene, durationMs: number): void {
    this.cancelFade();
    const next = this.audios[scene];
    if (!next) return;

    // 旧音淡出
    const targets: Array<{ audio: HTMLAudioElement; target: number }> = [];
    for (const [s, audio] of Object.entries(this.audios) as [Scene, HTMLAudioElement][]) {
      if (!audio) continue;
      if (s === scene) continue;
      if (audio.volume > 0.001) {
        targets.push({ audio, target: 0 });
      } else if (!audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }
    }

    // 新音从 0 淡入到 TARGET_VOLUME
    if (next.paused) {
      next.currentTime = 0;
      const playPromise = next.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          /* 自动播放被拒绝时静默忽略，等待用户交互 */
        });
      }
    }
    targets.push({ audio: next, target: TARGET_VOLUME });

    this.runFade(targets, durationMs);
  }

  private fadeVolume(audio: HTMLAudioElement, from: number, to: number, durationMs: number): void {
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      audio.volume = from + (to - from) * t;
      if (t < 1) {
        requestAnimationFrame(step);
      } else if (to <= 0.001) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
    requestAnimationFrame(step);
  }

  private runFade(
    targets: Array<{ audio: HTMLAudioElement; target: number }>,
    durationMs: number
  ): void {
    const starts = targets.map((t) => t.audio.volume);
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      for (let i = 0; i < targets.length; i++) {
        const tg = targets[i];
        tg.audio.volume = starts[i] + (tg.target - starts[i]) * t;
        if (t >= 1 && tg.target <= 0.001) {
          tg.audio.pause();
          tg.audio.currentTime = 0;
        }
      }
      if (t < 1) {
        this.fadeFrame = requestAnimationFrame(step);
      } else {
        this.fadeFrame = null;
      }
    };
    this.fadeFrame = requestAnimationFrame(step);
  }

  private cancelFade(): void {
    if (this.fadeFrame !== null) {
      cancelAnimationFrame(this.fadeFrame);
      this.fadeFrame = null;
    }
  }

  private loadMuted(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  }

  private saveMuted(muted: boolean): void {
    try {
      localStorage.setItem(STORAGE_KEY, muted ? '1' : '0');
    } catch {
      /* localStorage 不可用时静默忽略 */
    }
  }
}
