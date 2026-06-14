/**
 * PostFX - 后期处理
 *
 *  渲染管线：Scene → RenderPass → UnrealBloomPass → OutputPass → Screen
 *  适度 Bloom 让大气层与高光呈现"水墨晕染"质感
 *
 *  WebGPU 模式下，部分 EffectComposer 模块仍在演进；
 *  此处统一使用 Three.js 标准 EffectComposer 路径。
 */

import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

export class PostFX {
  composer: EffectComposer;
  bloom: UnrealBloomPass;

  constructor(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
    const size = new THREE.Vector2();
    renderer.getSize(size);

    this.composer = new EffectComposer(renderer);
    this.composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.composer.setSize(size.x, size.y);

    this.composer.addPass(new RenderPass(scene, camera));

    this.bloom = new UnrealBloomPass(
      new THREE.Vector2(size.x, size.y),
      0.45, // strength - 适中，模拟墨晕
      0.6,  // radius
      0.85  // threshold - 仅亮处发光
    );
    this.composer.addPass(this.bloom);
    this.composer.addPass(new OutputPass());
  }

  setSize(width: number, height: number) {
    this.composer.setSize(width, height);
    this.bloom.setSize(width, height);
  }

  render() {
    this.composer.render();
  }
}