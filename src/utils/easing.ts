/**
 * 国风缓动函数
 * "写意" — 笔走龙蛇，不刻意追求匀速
 * "工笔" — 工整对称，节奏分明
 */

import gsap from 'gsap';

/** 写意 - 类似毛笔起笔重、行笔轻、收笔稳 */
export const xieyi = (t: number): number => {
  // 模拟笔锋：起笔慢、中段快、收笔慢
  if (t < 0.3) return (t / 0.3) * 0.4;
  if (t < 0.7) return 0.4 + ((t - 0.3) / 0.4) * 0.55;
  return 0.95 + (t - 0.7) / 0.3 * 0.05;
};

/** 工笔 - 平滑对称，类似 easeInOut */
export const gongbi = (t: number): number => {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
};

/** 卷轴展开 - 类似 Ease Expo Out */
export const scrollEase = 'power3.out';

/** 卷轴收起 - 类似 Ease Expo In */
export const scrollCloseEase = 'power3.in';

/** 时间轴事件交错入场 */
export const timelineStagger = (selector: string, baseDelay = 0): gsap.core.Timeline => {
  const tl = gsap.timeline({ delay: baseDelay });
  tl.from(selector, {
    opacity: 0,
    x: 30,
    duration: 0.7,
    ease: 'power2.out',
    stagger: 0.12
  });
  return tl;
};