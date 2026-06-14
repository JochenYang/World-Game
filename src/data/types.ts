/**
 * 共享类型 — 内容视图模式
 *
 * 三种内容分类，用户可切换：
 *  - continent: 大陆溯源（按大陆显示地质+人类演化时间轴）
 *  - chronicle: 地球编年史（全球地质/生命/人类编年）
 *  - country:   列国史（按国家/文明显示其历史）
 */

export type ContentView = 'continent' | 'chronicle' | 'country';
