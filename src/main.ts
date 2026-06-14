/**
 * 主入口 - 全球人类起源史 · 中国风 3D 交互展示
 */

import * as THREE from 'three';
import './styles/main.css';

import { createRenderer } from './core/Renderer';
import { Globe } from './core/Globe';
import { CameraController } from './core/Camera';
import { Picker } from './core/Picker';
import { PostFX } from './core/PostFX';
import { TitleScreen } from './ui/TitleScreen';
import { ScrollPanel } from './ui/ScrollPanel';
import { RegionTooltip, RegionHud } from './ui/Tooltip';
import { CONTINENTS } from './data/continents';
import type { ContinentId } from './data/continents';

async function bootstrap() {
  const canvas = document.getElementById('globe-canvas') as HTMLCanvasElement;
  if (!canvas) throw new Error('Canvas not found');

  // 1. 渲染器
  const { renderer, label } = await createRenderer(canvas);
  const modeEl = document.getElementById('render-mode');
  if (modeEl) {
    modeEl.textContent = label;
    if (label.includes('WebGL')) modeEl.classList.add('is-fallback');
  }

  // 2. 场景 & 相机
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0c0f10);
  scene.fog = new THREE.FogExp2(0x0c0f10, 0.025);

  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 2, 8);

  // 3. 灯光（柔和的暖色主光 + 冷色补光）
  const ambient = new THREE.AmbientLight(0xffffff, 0.55);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0xfff1d6, 1.1);
  keyLight.position.set(5, 6, 4);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0x6db4d0, 0.45);
  fillLight.position.set(-6, 2, -3);
  scene.add(fillLight);

  const rimLight = new THREE.PointLight(0xecaf1e, 0.6, 30);
  rimLight.position.set(0, 8, -10);
  scene.add(rimLight);

  // 4. 地球
  const globe = new Globe(2);
  scene.add(globe.group);

  // 5. 相机控制
  const controller = new CameraController({
    domElement: canvas,
    camera,
    target: new THREE.Vector3(0, 0, 0),
    minDistance: 3.5,
    maxDistance: 18
  });

  // 6. 拾取
  const picker = new Picker(globe.idMesh, camera, canvas);

  // 7. 后期处理（仅 WebGL 模式启用，因为 EffectComposer 基于 WebGL）
  let postfx: PostFX | null = null;
  if (renderer.constructor.name === 'WebGLRenderer') {
    try {
      postfx = new PostFX(renderer as THREE.WebGLRenderer, scene, camera);
    } catch (err) {
      console.warn('[PostFX] 初始化失败，使用直接渲染：', err);
    }
  }

  // 8. UI
  const titleScreen = new TitleScreen();
  const scrollPanel = new ScrollPanel();
  const tooltip = new RegionTooltip();
  const hud = new RegionHud();

  // 启动
  titleScreen.setOnStart(() => {
    // 进入主舞台时让相机略微拉近
    controller.resetView(1.4);
  });

  // 卷轴关闭后复位
  scrollPanel.setOnClose(() => {
    hud.set(null);
    controller.resetView(1.2);
  });

  // 9. 交互：tap（点击）→ 大陆识别 → 聚焦 + 打开卷轴
  let currentHover: ContinentId | null = null;
  controller.setOnTap((x, y) => {
    const id = picker.pick(x, y);
    if (!id) return;
    const c = CONTINENTS.find((c) => c.id === id);
    if (!c) return;

    // 暂停自转，相机聚焦
    globe.setAutoRotate(false);
    controller.focusTo(c.centerLat, c.centerLon, 5, 1.6);
    scrollPanel.open(id);
    hud.set(id);
    tooltip.hide();
  });

  // 悬停检测（移动指针）
  canvas.addEventListener('pointermove', (e) => {
    const id = picker.pick(e.clientX, e.clientY);
    if (id !== currentHover) {
      currentHover = id;
      if (id) {
        canvas.classList.add('is-hovering');
        tooltip.show(id, e.clientX, e.clientY);
        hud.set(id);
      } else {
        canvas.classList.remove('is-hovering');
        tooltip.hide();
        if (!scrollPanel.isOpen()) hud.set(null);
      }
    } else if (id) {
      tooltip.show(id, e.clientX, e.clientY);
    }
  });

  canvas.addEventListener('pointerleave', () => {
    currentHover = null;
    tooltip.hide();
    canvas.classList.remove('is-hovering');
  });

  // 10. 渲染循环
  const clock = new THREE.Clock();
  let frameId = 0;

  function animate() {
    frameId = requestAnimationFrame(animate);
    const delta = clock.getDelta();
    globe.tick(delta);
    controller.update();

    if (postfx) {
      postfx.render();
    } else {
      (renderer as THREE.WebGLRenderer).render(scene, camera);
    }
  }
  animate();

  // 11. 窗口尺寸适配
  function onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    if (postfx) postfx.setSize(w, h);
  }
  window.addEventListener('resize', onResize);
  onResize();

  // 调试暴露
  if ((import.meta as unknown as { env?: { DEV?: boolean } }).env?.DEV) {
    (window as unknown as { __worldGame?: unknown }).__worldGame = {
      scene, camera, globe, controller, picker, postfx
    };
  }
}

bootstrap().catch((err) => {
  console.error('[Bootstrap] 启动失败：', err);
  const root = document.getElementById('app');
  if (root) {
    const errBox = document.createElement('div');
    errBox.style.cssText = `
      position: fixed; inset: 0; display: flex; align-items: center; justify-content: center;
      background: #1a2225; color: #e2231a; font-family: 'Noto Serif SC', serif; padding: 2rem;
      text-align: center; z-index: 100;
    `;
    errBox.innerHTML = `
      <div>
        <h2 style="margin-bottom: 1rem;">启动失败</h2>
        <pre style="white-space: pre-wrap; opacity: 0.8;">${String(err)}</pre>
      </div>
    `;
    root.appendChild(errBox);
  }
});