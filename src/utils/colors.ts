/**
 * 中国传统色板
 * 国画颜料参照：以朱砂、石青、藤黄、花青、胭脂为基底
 */

export const COLORS = {
  // 主色
  yaqing: 0x2c3639,    // 鸦青 - 深背景
  zhuhong: 0xe2231a,   // 朱红 - 帝王朱
  xiang: 0xecaf1e,     // 缃色 - 藤黄
  yuebai: 0xd6ecf0,    // 月白
  xuanzhi: 0xf5f0e8,   // 宣纸

  // 大陆专属配色（呼应传统色）
  asia: 0xe2231a,           // 朱红
  africa: 0xecaf1e,         // 缃色
  europe: 0x177cb0,         // 靛蓝
  northAmerica: 0x789262,   // 竹青
  southAmerica: 0xb23c4d,   // 胭脂
  oceania: 0x3b5254,        // 黛青
  antarctica: 0xd6ecf0      // 月白
} as const;

export const CONTINENT_HIGHLIGHT = {
  asia: { r: 0.886, g: 0.137, b: 0.102 },
  africa: { r: 0.925, g: 0.686, b: 0.118 },
  europe: { r: 0.090, g: 0.486, b: 0.690 },
  northAmerica: { r: 0.471, g: 0.572, b: 0.384 },
  southAmerica: { r: 0.698, g: 0.235, b: 0.302 },
  oceania: { r: 0.231, g: 0.322, b: 0.329 },
  antarctica: { r: 0.839, g: 0.925, b: 0.941 }
};

/**
 * 大陆 → 隐藏 ID 纹理的 RGB（每洲一色，精准拾取）
 */
export const REGION_ID_COLORS: Record<string, { r: number; g: number; b: number }> = {
  asia: { r: 226, g: 35, b: 26 },          // 朱红
  africa: { r: 236, g: 175, b: 30 },        // 缃色
  europe: { r: 23, g: 124, b: 176 },        // 靛蓝
  northAmerica: { r: 120, g: 146, b: 98 },  // 竹青
  southAmerica: { r: 178, g: 60, b: 77 },   // 胭脂
  oceania: { r: 59, g: 82, b: 84 },         // 黛青
  antarctica: { r: 214, g: 236, b: 240 }    // 月白
};