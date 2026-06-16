/**
 * UI - 主舞台「地球生命史长卷」背景
 *
 * 行为：
 * - 在 #history-cards-track 内注入 16 张卡片（8 张原图 + 8 张镜像重复，
 *   让 CSS 关键帧从左向右无缝循环）。
 * - 启动信号：调用 start()，等一帧 RAF 后给 #history-cards 加 .is-active，
 *   触发 1.2s 淡入 + 90s 横向循环。
 * - 视觉层次：history-cards 放在 #globe-canvas 之前的 DOM 节点，3D 地球
 *   会天然遮住卡片，地球放大/缩小时遮罩范围自动适配，无需任何 mask。
 * - 降级：若 bestiary 某张图 404，卡片仍渲染（背景图缺失则显示黛青底色 + 印章），
 *   不阻塞启动。
 * - 性能：纯 CSS 动画 + GPU 合成层（will-change: transform），无 JS 循环。
 */

interface BestiaryCard {
  id: string;
  title: string;
  era: string;
  stamp: string;
  image: string;
}

const CARDS: BestiaryCard[] = [
  { id: 'hadean',              title: '冥古宙·岩浆海',     era: 'Hadean',        stamp: '冥', image: '/bestiary/hadean_001.jpg' },
  { id: 'archean',             title: '太古宙·叠层石',     era: 'Archean',       stamp: '太', image: '/bestiary/archean_001.jpg' },
  { id: 'proterozoic_oxygen',  title: '元古宙·大氧化',     era: 'Proterozoic',   stamp: '元', image: '/bestiary/proterozoic_oxygen_001.jpg' },
  { id: 'snowball',            title: '雪球地球',         era: 'Cryogenian',    stamp: '雪', image: '/bestiary/snowball_001.jpg' },
  { id: 'cambrian',            title: '寒武纪·生命大爆发', era: 'Cambrian',      stamp: '寒', image: '/bestiary/cambrian_001.jpg' },
  { id: 'devonian',            title: '泥盆纪·鱼类时代',   era: 'Devonian',      stamp: '泥', image: '/bestiary/devonian_001.jpg' },
  { id: 'carboniferous',       title: '石炭纪·巨型昆虫',   era: 'Carboniferous', stamp: '炭', image: '/bestiary/carboniferous_001.jpg' },
  { id: 'permian',             title: '二叠纪·盘古大陆',   era: 'Permian',       stamp: '二', image: '/bestiary/red_desert_001.jpg' },
  { id: 'triassic',            title: '三叠纪·恐龙黎明',   era: 'Triassic',      stamp: '三', image: '/bestiary/triassic_001.jpg' },
  { id: 'jurassic',            title: '侏罗纪·恐龙时代',   era: 'Jurassic',      stamp: '侏', image: '/bestiary/jurassic_001.jpg' },
  { id: 'cretaceous',          title: '白垩纪·翼龙翱翔',   era: 'Cretaceous',    stamp: '白', image: '/bestiary/cretaceous_001.jpg' },
  { id: 'paleogene',           title: '古近纪·哺乳兴起',   era: 'Paleogene',     stamp: '近', image: '/bestiary/cenozoic_001.jpg' },
  { id: 'iceage',              title: '冰河时代·猛犸',     era: 'Ice Age',       stamp: '猛', image: '/bestiary/iceage_001.jpg' },
  { id: 'sapiens',             title: '智人·篝火初燃',     era: 'Sapiens',       stamp: '人', image: '/bestiary/sapiens_001.jpg' },
  { id: 'out_of_africa',       title: '智人·走出非洲',     era: 'Out of Africa', stamp: '迁', image: '/bestiary/out_of_africa_001.jpg' },
  { id: 'neolithic',           title: '新石器·农业起源',   era: 'Neolithic',     stamp: '农', image: '/bestiary/farming_001.jpg' },
  { id: 'pyramid',             title: '古文明·金字塔',     era: 'Civilization',  stamp: '文', image: '/bestiary/pyramid_001.jpg' },
  { id: 'rome',                title: '古罗马·帝国崛起',   era: 'Rome',          stamp: '罗', image: '/bestiary/rome_001.jpg' },
  { id: 'medieval',            title: '中世纪·城堡骑士',   era: 'Medieval',      stamp: '骑', image: '/bestiary/medieval_001.jpg' },
  { id: 'industrial',          title: '工业革命·蒸汽时代', era: 'Industrial',    stamp: '工', image: '/bestiary/industrial_001.jpg' },
  { id: 'modern_city',         title: '现代·都市灯火',     era: 'Modern',        stamp: '今', image: '/bestiary/modern_city_001.jpg' }
];

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function cardHtml(c: BestiaryCard): string {
  return `
    <div class="history-cards__card" data-card-id="${escapeHtml(c.id)}">
      <div class="history-cards__card-img" style="background-image:url('${escapeHtml(c.image)}')"></div>
      <span class="history-cards__card-stamp">${escapeHtml(c.stamp)}</span>
      <div class="history-cards__card-body">
        <h3 class="history-cards__card-title">${escapeHtml(c.title)}</h3>
        <div class="history-cards__card-era">${escapeHtml(c.era)}</div>
      </div>
    </div>
  `;
}

export class HistoryCardsBg {
  private root: HTMLElement | null = null;
  private track: HTMLElement | null = null;

  constructor() {
    this.root = document.getElementById('history-cards');
    this.track = document.getElementById('history-cards-track');
    if (this.track) {
      // 注入 8 + 8 = 16 张卡片（重复一份实现无缝循环）
      const html = [...CARDS, ...CARDS].map(cardHtml).join('');
      this.track.innerHTML = html;
    }
  }

  /**
   * 启动背景卡片的淡入与循环动画。
   * 调用时机：titleScreen 合卷之后（#stage.is-active）。
   * 若 DOM 缺失（极早阶段调用），静默 no-op，不抛错。
   */
  start() {
    if (!this.root) return;
    // 等一帧 RAF 后再加 is-active，确保 .stage 的 opacity 过渡先就绪
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.root?.classList.add('is-active');
      });
    });
  }

  /** 暂停/隐藏（用于极端情况，例如卷轴打开时希望背景进一步淡化） */
  pause() {
    this.root?.classList.remove('is-active');
  }
}
