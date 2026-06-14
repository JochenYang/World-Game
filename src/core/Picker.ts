/**
 * Picker - 大陆拾取
 *
 * 通过隐藏的 ID mesh + ID 纹理，从点击的屏幕坐标反查大洲。
 * - 用 Raycaster 与 idMesh 求交得到 UV
 * - 用 Canvas2D 读取对应像素颜色
 * - 与 REGION_ID_COLORS 比对，得出大陆 ID
 */

import * as THREE from 'three';
import { REGION_ID_COLORS } from '../utils/colors';
import { colorDistance } from '../utils/geo';
import type { ContinentId } from '../data/continents';

export class Picker {
  private idMesh: THREE.Mesh;
  private raycaster = new THREE.Raycaster();
  private camera: THREE.PerspectiveCamera;
  private domElement: HTMLElement;
  private idCanvas: HTMLCanvasElement;

  constructor(idMesh: THREE.Mesh, camera: THREE.PerspectiveCamera, domElement: HTMLElement) {
    this.idMesh = idMesh;
    this.camera = camera;
    this.domElement = domElement;
    // 从 ID mesh 的 CanvasTexture 中获取底层 canvas
    const mat = idMesh.material as THREE.MeshBasicMaterial;
    const tex = mat.map as THREE.CanvasTexture | undefined;
    this.idCanvas = (tex?.image as HTMLCanvasElement) ?? document.createElement('canvas');
  }

  /** 把屏幕像素坐标转 NDC */
  private ndcFromPixel(x: number, y: number): THREE.Vector2 {
    const rect = this.domElement.getBoundingClientRect();
    const localX = x - rect.left;
    const localY = y - rect.top;
    return new THREE.Vector2(
      (localX / rect.width) * 2 - 1,
      -(localY / rect.height) * 2 + 1
    );
  }

  /** 屏幕坐标 → 大洲 ID（null = 海洋 / 未命中） */
  pick(screenX: number, screenY: number): ContinentId | null {
    const ndc = this.ndcFromPixel(screenX, screenY);
    this.raycaster.setFromCamera(ndc, this.camera);
    const hits = this.raycaster.intersectObject(this.idMesh, false);
    if (hits.length === 0) return null;
    const uv = hits[0].uv;
    if (!uv) return null;

    const pixelX = Math.floor(uv.x * this.idCanvas.width);
    const pixelY = Math.floor((1 - uv.y) * this.idCanvas.height);
    if (pixelX < 0 || pixelY < 0 || pixelX >= this.idCanvas.width || pixelY >= this.idCanvas.height) {
      return null;
    }

    const ctx = this.idCanvas.getContext('2d');
    if (!ctx) return null;
    const data = ctx.getImageData(pixelX, pixelY, 1, 1).data;
    const r = data[0], g = data[1], b = data[2];

    // 海洋（黑色）不命中
    if (r < 10 && g < 10 && b < 10) return null;

    // 找最近的大洲
    let best: { id: ContinentId; dist: number } | null = null;
    for (const [id, c] of Object.entries(REGION_ID_COLORS) as [ContinentId, { r: number; g: number; b: number }][]) {
      const d = colorDistance(r, g, b, c.r, c.g, c.b);
      if (!best || d < best.dist) {
        best = { id, dist: d };
      }
    }
    if (!best) return null;
    // 距离过大视为无效
    if (best.dist > 60) return null;
    return best.id;
  }
}