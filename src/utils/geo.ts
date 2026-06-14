/**
 * 地理工具：经纬度 ↔ 三维坐标转换
 * 地球坐标系：Y 朝上，X-Z 为赤道平面
 */

/** 经纬度 → 球面坐标（半径 1） */
export function latLonToVector3(
  lat: number,
  lon: number,
  radius = 1
): { x: number; y: number; z: number } {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return {
    x: -radius * Math.sin(phi) * Math.cos(theta),
    y: radius * Math.cos(phi),
    z: radius * Math.sin(phi) * Math.sin(theta)
  };
}

/** 球面坐标 → 经纬度 */
export function vector3ToLatLon(x: number, y: number, z: number): { lat: number; lon: number } {
  const r = Math.sqrt(x * x + y * y + z * z);
  const phi = Math.acos(y / r);
  const theta = Math.atan2(z, -x);
  return {
    lat: 90 - phi * (180 / Math.PI),
    lon: theta * (180 / Math.PI) - 180
  };
}

/** 距今格式化（负数 = 公元前） */
export function formatYear(year: number): string {
  if (year === 0) return '公元元年';
  if (year > 0) return `公元 ${year} 年`;
  const y = Math.abs(year);
  // 十亿级（10^9）—— 1 亿 = 10^8，故除以 10^8 得「亿年前」
  if (y >= 100_000_000) return `约 ${(y / 100_000_000).toFixed(2)} 亿年前`;
  // 千万级（10^7）
  if (y >= 10_000_000) return `约 ${(y / 10_000_000).toFixed(1)} 千万年前`;
  // 百万级（10^6）
  if (y >= 1_000_000) return `约 ${(y / 1_000_000).toFixed(2)} 百万年前`;
  // 十万级（10^5）
  if (y >= 100_000) return `约 ${(y / 10_000).toFixed(1)} 万年前`;
  // 万级（10^4）
  if (y >= 10_000) return `约 ${(y / 10_000).toFixed(1)} 万年前`;
  if (y >= 1000) return `约 ${(y / 1000).toFixed(1)} 千年前`;
  return `公元前 ${y} 年`;
}

/** 颜色距离（用于 ID 纹理匹配） */
export function colorDistance(
  r1: number, g1: number, b1: number,
  r2: number, g2: number, b2: number
): number {
  return Math.sqrt(
    (r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2
  );
}