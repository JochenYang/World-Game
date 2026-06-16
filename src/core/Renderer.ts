/**
 * Renderer - WebGPU 优先 + WebGL 回退
 * 通过 navigator.gpu 检测能力，自动选择最佳渲染器
 */

import * as THREE from 'three';

/** 渲染器抽象类型：使用基类 Renderer，便于上层统一调用 */
export type AnyRenderer = THREE.Renderer;

export type RenderMode = 'webgpu' | 'webgl';

export interface RendererResult {
  renderer: AnyRenderer;
  mode: RenderMode;
  /** 用于显示的描述 */
  label: string;
}

export async function createRenderer(canvas: HTMLCanvasElement): Promise<RendererResult> {
  const hasWebGPU = 'gpu' in navigator && !!(navigator as Navigator & { gpu?: unknown }).gpu;

  if (hasWebGPU) {
    try {
      // 动态导入，避免部分环境无此模块时崩溃
      const mod = await import('three/webgpu');
      type WebGPURendererCtor = new (opts: object) => AnyRenderer & {
        init(): Promise<void>;
      };
      const Ctor = (mod as { WebGPURenderer: WebGPURendererCtor }).WebGPURenderer;
      const renderer = new Ctor({
        canvas,
        antialias: true,
        // 关键：alpha: true 让 canvas 圆形外透明，背景卡片层可以透出
        alpha: true,
        powerPreference: 'high-performance'
      });
      await renderer.init();
      const r = renderer as unknown as THREE.WebGLRenderer;
      r.setPixelRatio?.(Math.min(window.devicePixelRatio, 2));
      r.setClearColor?.(new THREE.Color(0x0c0f10), 0);
      console.info('[Renderer] WebGPU 已启用');
      return { renderer, mode: 'webgpu', label: 'WebGPU 渲染' };
    } catch (err) {
      console.warn('[Renderer] WebGPU 初始化失败，回退到 WebGL：', err);
    }
  }

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    // 关键：alpha: true 让 canvas 圆形外透明，背景卡片层可以透出
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(new THREE.Color(0x0c0f10), 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  console.info('[Renderer] 使用 WebGLRenderer');
  return { renderer, mode: 'webgl', label: 'WebGL 渲染' };
}