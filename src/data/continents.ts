/**
 * 七大洲元数据
 */

export type ContinentId =
  | 'asia'
  | 'africa'
  | 'europe'
  | 'northAmerica'
  | 'southAmerica'
  | 'oceania'
  | 'antarctica'
  | 'arctic';

export interface ContinentMeta {
  id: ContinentId;
  name: string;        // 中文名
  nameEn: string;
  stamp: string;       // 印章字符
  centerLat: number;
  centerLon: number;
  /** 大洲在地球上的可见性权重（南极洲等较低，相机拉远） */
  visibility: number;
}

export const CONTINENTS: ContinentMeta[] = [
  { id: 'asia',         name: '亚洲',     nameEn: 'Asia',         stamp: '亚', centerLat:  35, centerLon:  100, visibility: 1.0 },
  { id: 'africa',       name: '非洲',     nameEn: 'Africa',       stamp: '非', centerLat:   5, centerLon:   20, visibility: 1.0 },
  { id: 'europe',       name: '欧洲',     nameEn: 'Europe',       stamp: '欧', centerLat:  52, centerLon:   15, visibility: 1.0 },
  { id: 'northAmerica', name: '北美洲',   nameEn: 'North America', stamp: '北', centerLat:  45, centerLon: -100, visibility: 1.0 },
  { id: 'southAmerica', name: '南美洲',   nameEn: 'South America', stamp: '南', centerLat: -15, centerLon:  -60, visibility: 1.0 },
  { id: 'oceania',      name: '大洋洲',   nameEn: 'Oceania',      stamp: '洋', centerLat: -25, centerLon:  135, visibility: 1.0 },
  // 南极洲：相机/拾取中心定在南极圈外缘 -72°，避免极点纹理畸变；
  // visibility 调低，相机聚焦时会自动拉远，让整个南极洲入画
  { id: 'antarctica',   name: '南极洲',   nameEn: 'Antarctica',   stamp: '极', centerLat: -72, centerLon:    0, visibility: 0.6 },
  // 北极：第 8 区，作为可拾取区域（不再仅做装饰文字）。
  // centerLat=72 同样避开 |lat|>75° 的横向纹理挤压；
  // visibility 0.6 与南极洲对称，相机聚焦时自动拉远。
  // stamp 选「凛」字避免与北美洲「北」、南极洲「极」冲突。
  { id: 'arctic',       name: '北极',     nameEn: 'Arctic',       stamp: '凛', centerLat:  72, centerLon:    0, visibility: 0.6 }
];

export function getContinent(id: ContinentId): ContinentMeta | undefined {
  return CONTINENTS.find((c) => c.id === id);
}