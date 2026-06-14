/**
 * Globe - 3D 地球
 *
 * 包含三个 mesh：
 *  1. 主地球（带程序化纹理，水墨风格）
 *  2. 大气层（BackSide + Fresnel 着色器）
 *  3. 大陆高亮层（带各大陆颜色标识的不可见 mesh，用于拾取）
 *
 * 由于依赖外部纹理资源在受限环境下难以下载，这里使用
 * 程序化生成的纹理：地球底色 + 大陆形状按经纬度绘制。
 */

import * as THREE from 'three';
import { REGION_ID_COLORS } from '../utils/colors';
import { CONTINENTS } from '../data/continents';
import type { ContinentId } from '../data/continents';

// 各大陆的简化多边形边界（[lon, lat] 数组）
// 数据为粗略轮廓，足以覆盖大陆主要区域
const CONTINENT_OUTLINES: Record<ContinentId, Array<[number, number]>> = {
  asia: [
    [25, 70], [40, 75], [60, 78], [90, 78], [120, 75], [145, 73], [160, 70],
    [170, 65], [180, 65], [170, 60], [145, 55], [140, 50], [140, 45], [135, 35],
    [125, 35], [120, 30], [108, 22], [100, 20], [100, 12], [95, 5], [85, 8],
    [78, 8], [70, 22], [60, 25], [50, 27], [42, 25], [35, 35], [30, 40],
    [25, 42], [25, 50], [35, 55], [45, 60], [50, 65], [40, 67], [25, 70]
  ],
  africa: [
    [-15, 35], [-10, 33], [0, 35], [10, 35], [15, 32], [25, 32], [33, 30],
    [38, 18], [42, 14], [50, 12], [52, 5], [42, 0], [40, -10], [38, -20],
    [30, -28], [20, -34], [18, -34], [12, -16], [10, -5], [8, 4], [0, 6],
    [-10, 8], [-15, 12], [-17, 22], [-15, 28], [-15, 35]
  ],
  europe: [
    [-10, 36], [-5, 36], [0, 40], [10, 38], [12, 45], [15, 48], [25, 50],
    [30, 55], [40, 60], [50, 65], [60, 68], [40, 70], [30, 72], [25, 70],
    [20, 72], [15, 70], [5, 70], [-5, 65], [-10, 60], [-8, 55], [-10, 50],
    [-10, 42], [-10, 36]
  ],
  northAmerica: [
    [-165, 70], [-150, 72], [-130, 72], [-100, 75], [-80, 75], [-60, 65],
    [-55, 55], [-65, 48], [-75, 42], [-78, 35], [-82, 28], [-90, 28],
    [-95, 18], [-100, 16], [-105, 18], [-110, 25], [-115, 30], [-118, 35],
    [-125, 42], [-130, 55], [-140, 60], [-155, 62], [-165, 65], [-165, 70]
  ],
  southAmerica: [
    [-78, 12], [-70, 12], [-60, 8], [-50, 4], [-45, -2], [-38, -8],
    [-35, -15], [-40, -25], [-50, -32], [-58, -38], [-65, -42], [-70, -50],
    [-72, -55], [-70, -55], [-68, -48], [-72, -40], [-72, -30], [-75, -20],
    [-78, -10], [-80, 0], [-78, 8], [-78, 12]
  ],
  oceania: [
    [110, -8], [120, -10], [130, -12], [140, -10], [145, -15], [150, -25],
    [155, -30], [153, -38], [145, -40], [140, -38], [135, -35], [128, -32],
    [118, -22], [113, -18], [110, -14], [110, -8]
  ],
  antarctica: [
    [-180, -65], [-150, -73], [-120, -75], [-90, -72], [-60, -75], [-30, -73],
    [0, -70], [30, -68], [60, -67], [90, -66], [120, -66], [150, -71],
    [180, -75], [180, -85], [-180, -85], [-180, -65]
  ]
};

const TEXTURE_WIDTH = 2048;
const TEXTURE_HEIGHT = 1024;

/**
 * 程序化生成可见地球纹理：宣纸底色 + 大陆 + 国风细节
 */
function generateEarthTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = TEXTURE_WIDTH;
  canvas.height = TEXTURE_HEIGHT;
  const ctx = canvas.getContext('2d')!;

  // 海洋底色 - 黛青渐变
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, TEXTURE_HEIGHT);
  oceanGrad.addColorStop(0, '#1a3338');
  oceanGrad.addColorStop(0.5, '#0f1e22');
  oceanGrad.addColorStop(1, '#1a3338');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT);

  // 海浪纹理 - 淡淡的横向水波
  ctx.globalAlpha = 0.06;
  ctx.strokeStyle = '#d6ecf0';
  ctx.lineWidth = 1;
  for (let y = 0; y < TEXTURE_HEIGHT; y += 32) {
    ctx.beginPath();
    const amp = 4 + Math.random() * 6;
    for (let x = 0; x < TEXTURE_WIDTH; x += 8) {
      const yy = y + Math.sin(x * 0.02) * amp;
      if (x === 0) ctx.moveTo(x, yy);
      else ctx.lineTo(x, yy);
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // 绘制大陆 - 朱红/缃色/竹青等
  const continentColors: Record<ContinentId, string> = {
    asia: '#c41e1e',
    africa: '#d49b1c',
    europe: '#1e6ba0',
    northAmerica: '#5e7a4a',
    southAmerica: '#a83c4a',
    oceania: '#3b5254',
    antarctica: '#d6ecf0'
  };

  for (const [id, outline] of Object.entries(CONTINENT_OUTLINES) as [ContinentId, Array<[number, number]>][]) {
    ctx.fillStyle = continentColors[id];
    ctx.beginPath();
    outline.forEach(([lon, lat], i) => {
      const x = ((lon + 180) / 360) * TEXTURE_WIDTH;
      const y = ((90 - lat) / 180) * TEXTURE_HEIGHT;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fill();

    // 大陆边缘水墨晕染
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = 8;
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(0,0,0,0.4)';
    ctx.stroke();
    ctx.restore();
  }

  // 经纬网
  ctx.strokeStyle = 'rgba(214, 236, 240, 0.08)';
  ctx.lineWidth = 1;
  for (let lon = -180; lon <= 180; lon += 30) {
    const x = ((lon + 180) / 360) * TEXTURE_WIDTH;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, TEXTURE_HEIGHT);
    ctx.stroke();
  }
  for (let lat = -90; lat <= 90; lat += 30) {
    const y = ((90 - lat) / 180) * TEXTURE_HEIGHT;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(TEXTURE_WIDTH, y);
    ctx.stroke();
  }

  // 赤道加粗
  ctx.strokeStyle = 'rgba(236, 175, 30, 0.25)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, TEXTURE_HEIGHT / 2);
  ctx.lineTo(TEXTURE_WIDTH, TEXTURE_HEIGHT / 2);
  ctx.stroke();

  // 大陆名称标注（中英文）
  drawContinentLabels(ctx);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/**
 * 在地球纹理上绘制各大陆的中英文名称
 * 使用经纬度→纹理坐标映射，文字会贴附在大陆中心
 */
function drawContinentLabels(ctx: CanvasRenderingContext2D) {
  // 每个大陆的标签配置：中文名、英文名、字体大小、可选偏移
  const labels: Array<{
    id: ContinentId;
    name: string;
    nameEn: string;
    fontSize: number;
    offsetLon?: number;
    offsetLat?: number;
  }> = [
    { id: 'asia', name: '亚洲', nameEn: 'ASIA', fontSize: 64 },
    { id: 'africa', name: '非洲', nameEn: 'AFRICA', fontSize: 56 },
    { id: 'europe', name: '欧洲', nameEn: 'EUROPE', fontSize: 44, offsetLat: 4 },
    { id: 'northAmerica', name: '北美洲', nameEn: 'NORTH AMERICA', fontSize: 52 },
    { id: 'southAmerica', name: '南美洲', nameEn: 'SOUTH AMERICA', fontSize: 48 },
    { id: 'oceania', name: '大洋洲', nameEn: 'OCEANIA', fontSize: 42 },
    { id: 'antarctica', name: '南极洲', nameEn: 'ANTARCTICA', fontSize: 44 }
  ];

  for (const label of labels) {
    const meta = CONTINENTS.find((c) => c.id === label.id);
    if (!meta) continue;

    const lon = meta.centerLon + (label.offsetLon ?? 0);
    const lat = meta.centerLat + (label.offsetLat ?? 0);
    const x = ((lon + 180) / 360) * TEXTURE_WIDTH;
    const y = ((90 - lat) / 180) * TEXTURE_HEIGHT;

    // 印章式背景（淡色圆角矩形）让文字在任何角度都清晰
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 中文名 - 描边 + 填充，朱红主色
    ctx.font = `900 ${label.fontSize}px "Noto Serif SC", "SimSun", serif`;
    // 黑色描边（外发光效果）
    ctx.lineWidth = Math.max(6, label.fontSize * 0.14);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.lineJoin = 'round';
    ctx.strokeText(label.name, x, y);
    // 朱红填充
    ctx.fillStyle = '#f5f0e8';
    ctx.fillText(label.name, x, y);

    // 英文名 - 小号，缃色，位于中文下方
    const enFontSize = Math.max(14, label.fontSize * 0.32);
    ctx.font = `600 ${enFontSize}px "Noto Serif SC", serif`;
    ctx.lineWidth = Math.max(2, enFontSize * 0.18);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.strokeText(label.nameEn, x, y + label.fontSize * 0.7);
    ctx.fillStyle = '#ecaf1e';
    ctx.fillText(label.nameEn, x, y + label.fontSize * 0.7);

    ctx.restore();
  }
}

/**
 * 程序化生成"隐藏 ID 纹理" - 每洲一色，用于拾取
 */
function generateIdTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = TEXTURE_WIDTH;
  canvas.height = TEXTURE_HEIGHT;
  const ctx = canvas.getContext('2d')!;

  // 默认海洋 - 黑色
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT);

  for (const [id, outline] of Object.entries(CONTINENT_OUTLINES) as [ContinentId, Array<[number, number]>][]) {
    const c = REGION_ID_COLORS[id];
    ctx.fillStyle = `rgb(${c.r}, ${c.g}, ${c.b})`;
    ctx.beginPath();
    outline.forEach(([lon, lat], i) => {
      const x = ((lon + 180) / 360) * TEXTURE_WIDTH;
      const y = ((90 - lat) / 180) * TEXTURE_HEIGHT;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;
  return tex;
}

/**
 * 大气层 - 通过 MeshBasicMaterial + 自定义 onBeforeCompile 注入 Fresnel
 *   兼容 WebGL / WebGPU（不依赖 ShaderMaterial 的扩展）
 */

function makeAtmosphereMaterial(color: THREE.Color): THREE.MeshBasicMaterial {
  const mat = new THREE.MeshBasicMaterial({
    color: color.clone(),
    transparent: true,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    opacity: 0.7
  });

  // 通过 onBeforeCompile 注入 Fresnel 边缘光
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uPower = { value: 3.0 };
    shader.uniforms.uIntensity = { value: 1.2 };
    shader.vertexShader = shader.vertexShader.replace(
      '#include <common>',
      `#include <common>
       varying vec3 vWorldPosCustom;
       varying vec3 vWorldNormalCustom;`
    );
    shader.vertexShader = shader.vertexShader.replace(
      '#include <fog_vertex>',
      `#include <fog_vertex>
       vec4 wp = modelMatrix * vec4(transformed, 1.0);
       vWorldPosCustom = wp.xyz;
       vWorldNormalCustom = normalize(mat3(modelMatrix) * objectNormal);`
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <common>',
      `#include <common>
       varying vec3 vWorldPosCustom;
       varying vec3 vWorldNormalCustom;
       uniform float uPower;
       uniform float uIntensity;`
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <output_fragment>',
      `vec3 viewDirA = normalize(cameraPosition - vWorldPosCustom);
       float rim = 1.0 - max(dot(viewDirA, vWorldNormalCustom), 0.0);
       float glow = pow(rim, uPower) * uIntensity;
       gl_FragColor.rgb = diffuseColor.rgb * (0.3 + glow * 1.5);
       gl_FragColor.a = clamp(glow, 0.0, 1.0) * diffuseColor.a;
       #include <output_fragment>`
    );
  };

  return mat;
}

export class Globe {
  readonly group: THREE.Group;
  readonly earthMesh: THREE.Mesh;
  readonly atmosphere: THREE.Mesh;
  readonly idMesh: THREE.Mesh;
  private idTexture: THREE.CanvasTexture;

  readonly radius: number;

  constructor(radius = 2) {
    this.radius = radius;
    this.group = new THREE.Group();

    // 1. 主地球 — 使用 MeshBasicMaterial 保证 WebGPU 兼容
    //    颜色直接由纹理决定，再用 emissiveMap 自发光增强亮度
    const earthTex = generateEarthTexture();
    const geometry = new THREE.SphereGeometry(radius, 96, 96);
    const material = new THREE.MeshBasicMaterial({
      map: earthTex
    });
    this.earthMesh = new THREE.Mesh(geometry, material);
    this.group.add(this.earthMesh);

    // 2. 大气层 — 使用 MeshBasicMaterial + onBeforeCompile 注入 Fresnel
    //    兼容 WebGPU
    const atmoGeo = new THREE.SphereGeometry(radius * 1.18, 64, 64);
    const atmoMat = makeAtmosphereMaterial(new THREE.Color(0x6db4d0));
    this.atmosphere = new THREE.Mesh(atmoGeo, atmoMat);
    this.group.add(this.atmosphere);

    // 3. 隐藏 ID mesh（用于拾取，不可见但参与 raycast）
    this.idTexture = generateIdTexture();
    const idGeo = new THREE.SphereGeometry(radius * 1.001, 64, 64);
    const idMat = new THREE.MeshBasicMaterial({
      map: this.idTexture,
      visible: false
    });
    this.idMesh = new THREE.Mesh(idGeo, idMat);
    this.idMesh.userData.isIdMesh = true;
    this.group.add(this.idMesh);

    // 默认朝向
    this.group.rotation.y = Math.PI; // 让中国默认朝向相机
  }

  /**
   * 停止/恢复自转（聚焦时使用）
   */
  setAutoRotate(enabled: boolean) {
    this.autoRotate = enabled;
  }
  private autoRotate = true;
  private autoRotateSpeed = 0.04;

  tick(delta: number) {
    if (this.autoRotate) {
      this.group.rotation.y += delta * this.autoRotateSpeed;
    }
  }

  dispose() {
    this.earthMesh.geometry.dispose();
    (this.earthMesh.material as THREE.Material).dispose();
    this.atmosphere.geometry.dispose();
    (this.atmosphere.material as THREE.Material).dispose();
    this.idMesh.geometry.dispose();
    (this.idMesh.material as THREE.Material).dispose();
    this.idTexture.dispose();
  }
}