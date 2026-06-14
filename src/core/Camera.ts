/**
 * Camera - 轨道控制 + 点击聚焦
 *
 * 手写轻量级控制器，避免引入 OrbitControls 的额外开销。
 * 鼠标左键拖拽旋转、滚轮缩放、点击后聚焦到大陆。
 */

import * as THREE from 'three';
import gsap from 'gsap';
import { latLonToVector3 } from '../utils/geo';

export interface CameraControllerOptions {
  domElement: HTMLElement;
  camera: THREE.PerspectiveCamera;
  target: THREE.Vector3;
  minDistance?: number;
  maxDistance?: number;
  enableDamping?: number;
}

export class CameraController {
  private camera: THREE.PerspectiveCamera;
  private target: THREE.Vector3;
  private dom: HTMLElement;

  private spherical = new THREE.Spherical(8, Math.PI / 2.5, 0);
  private targetSpherical = new THREE.Spherical(8, Math.PI / 2.5, 0);
  private damping = 0.12;

  private minDistance: number;
  private maxDistance: number;

  // 交互状态
  private isDragging = false;
  private lastPointerX = 0;
  private lastPointerY = 0;
  private pointerDownX = 0;
  private pointerDownY = 0;
  private dragMoved = false;
  private rotateSpeed = 0.005;
  private zoomSpeed = 0.5;

  // 点击事件回调（如果 dragMoved 为 false）
  private onTap: ((x: number, y: number) => void) | null = null;

  constructor(opts: CameraControllerOptions) {
    this.camera = opts.camera;
    this.target = opts.target;
    this.dom = opts.domElement;
    this.minDistance = opts.minDistance ?? 3.5;
    this.maxDistance = opts.maxDistance ?? 18;

    this.bindEvents();
    this.applyToCamera();
  }

  setOnTap(cb: (x: number, y: number) => void) {
    this.onTap = cb;
  }

  private bindEvents() {
    const dom = this.dom;
    dom.addEventListener('pointerdown', this.onPointerDown);
    dom.addEventListener('pointermove', this.onPointerMove);
    dom.addEventListener('pointerup', this.onPointerUp);
    dom.addEventListener('pointercancel', this.onPointerUp);
    dom.addEventListener('pointerleave', this.onPointerUp);
    dom.addEventListener('wheel', this.onWheel, { passive: false });
  }

  dispose() {
    const dom = this.dom;
    dom.removeEventListener('pointerdown', this.onPointerDown);
    dom.removeEventListener('pointermove', this.onPointerMove);
    dom.removeEventListener('pointerup', this.onPointerUp);
    dom.removeEventListener('pointercancel', this.onPointerUp);
    dom.removeEventListener('pointerleave', this.onPointerUp);
    dom.removeEventListener('wheel', this.onWheel);
  }

  private onPointerDown = (e: PointerEvent) => {
    if (e.button !== 0) return;
    this.isDragging = true;
    this.dragMoved = false;
    this.lastPointerX = e.clientX;
    this.lastPointerY = e.clientY;
    this.pointerDownX = e.clientX;
    this.pointerDownY = e.clientY;
    this.dom.setPointerCapture?.(e.pointerId);
  };

  private onPointerMove = (e: PointerEvent) => {
    if (!this.isDragging) return;
    const dx = e.clientX - this.lastPointerX;
    const dy = e.clientY - this.lastPointerY;
    this.lastPointerX = e.clientX;
    this.lastPointerY = e.clientY;

    if (Math.abs(e.clientX - this.pointerDownX) > 4 || Math.abs(e.clientY - this.pointerDownY) > 4) {
      this.dragMoved = true;
    }

    this.targetSpherical.theta -= dx * this.rotateSpeed;
    this.targetSpherical.phi -= dy * this.rotateSpeed;
    // 限制 phi 范围防止翻转
    this.targetSpherical.phi = Math.max(0.25, Math.min(Math.PI - 0.25, this.targetSpherical.phi));
  };

  private onPointerUp = (e: PointerEvent) => {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.dom.releasePointerCapture?.(e.pointerId);

    // 点击 vs 拖拽的判定
    if (!this.dragMoved && this.onTap) {
      const rect = this.dom.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.onTap(x, y);
    }
  };

  private onWheel = (e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * 0.005 * this.zoomSpeed;
    this.targetSpherical.radius = Math.max(
      this.minDistance,
      Math.min(this.maxDistance, this.targetSpherical.radius * (1 + delta))
    );
  };

  private applyToCamera() {
    this.spherical.theta += (this.targetSpherical.theta - this.spherical.theta) * this.damping;
    this.spherical.phi += (this.targetSpherical.phi - this.spherical.phi) * this.damping;
    this.spherical.radius += (this.targetSpherical.radius - this.spherical.radius) * this.damping;

    const offset = new THREE.Vector3().setFromSpherical(this.spherical);
    this.camera.position.copy(this.target).add(offset);
    this.camera.lookAt(this.target);
  }

  update() {
    this.applyToCamera();
  }

  /**
   * 平滑聚焦到指定经纬度
   */
  focusTo(lat: number, lon: number, distance = 5, duration = 1.5) {
    const targetPos = latLonToVector3(lat, lon, distance);
    // 球坐标：从相机相对 target 的偏移反推
    const offset = new THREE.Vector3(targetPos.x, targetPos.y, targetPos.z);
    const newSpherical = new THREE.Spherical().setFromVector3(offset);

    // 同时也需要让地球自转 + 经度匹配到目标视角
    // 地球实际方向由 group.rotation 控制；这里旋转相机
    const sphericalProxy = {
      theta: newSpherical.theta,
      phi: newSpherical.phi,
      radius: newSpherical.radius
    };

    gsap.to(this.targetSpherical, {
      theta: sphericalProxy.theta,
      phi: sphericalProxy.phi,
      radius: sphericalProxy.radius,
      duration,
      ease: 'power3.inOut'
    });

    gsap.to(this.target, {
      x: 0,
      y: 0,
      z: 0,
      duration,
      ease: 'power3.inOut'
    });
  }

  /**
   * 复位到全景视角
   */
  resetView(duration = 1.2) {
    gsap.to(this.targetSpherical, {
      theta: 0,
      phi: Math.PI / 2.5,
      radius: 8,
      duration,
      ease: 'power3.inOut'
    });
    gsap.to(this.target, {
      x: 0, y: 0, z: 0,
      duration,
      ease: 'power3.inOut'
    });
  }
}