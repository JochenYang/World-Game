/**
 * 地球编年史 — 全球地质 · 生命 · 人类编年
 *
 * 按地质纪元从老到新分段，每段含 3-5 个全球关键事件。
 * 与大陆溯源不同，编年史视角为"全球同步演化"，强调地球史的整体性。
 */

import type { OriginEvent } from './content';

export interface ChronicleEra {
  eraName: string;        // 中文名，如「冥古宙」
  eraNameEn: string;      // 英文名，如「Hadean」
  startYear: number;      // 该纪元起始距今年数（负数）
  summary: string;        // 该纪元简介
  events: OriginEvent[];
}

export const CHRONICLE: ChronicleEra[] = [
  /* ===== 冥古宙 ===== */
  {
    eraName: '冥古宙',
    eraNameEn: 'Hadean',
    startYear: -4_600_000_000,
    summary: '地球诞生之初。岩浆沸腾，星体撞击频繁，月球的起源与此时一次巨大撞击有关。',
    events: [
      { year: -4_540_000_000, era: '冥古宙', title: '地球形成',
        description: '太阳星云吸积形成原始地球，地表为炽热岩浆海。约 45 亿年前，一颗火星大小天体「忒伊亚」撞击地球，飞溅物凝聚形成月球。',
        image: '/generated/hadean_001.jpg',
        location: { lat: 0, lon: 0 } },
      { year: -4_400_000_000, era: '冥古宙', title: '原始海洋',
        description: '地球冷却，水蒸气凝结降落，形成原始海洋。最古老的锆石晶体（澳大利亚杰克山）显示此时已有液态水存在。' }
    ]
  },

  /* ===== 太古宙 ===== */
  {
    eraName: '太古宙',
    eraNameEn: 'Archean',
    startYear: -4_000_000_000,
    summary: '生命的黎明。最早的微生物在热泉与浅海中出现，蓝细菌开始光合作用，逐步改变大气。',
    events: [
      { year: -3_800_000_000, era: '太古宙', title: '生命起源',
        description: '格陵兰伊苏阿组发现可能的最古老生命化学痕迹。生命或许起源于深海热泉，以化学能为能源。',
        location: { lat: 65, lon: -38 } },
      { year: -3_500_000_000, era: '太古宙', title: '最早微生物岩',
        description: '南非巴伯顿绿岩带与西澳皮尔巴拉克拉通的叠层石，记录了蓝细菌的光合作用——这是地球大气氧化的序幕。',
        image: '/generated/snowball_001.jpg',
        location: { lat: -26, lon: 31 } },
      { year: -3_000_000_000, era: '太古宙', title: '大陆地壳稳定',
        description: '稳定的大陆核（克拉通）形成，今日加拿大、西澳、南非的古老岩石可追溯至此。' }
    ]
  },

  /* ===== 元古宙 ===== */
  {
    eraName: '元古宙',
    eraNameEn: 'Proterozoic',
    startYear: -2_500_000_000,
    summary: '大氧化事件改变了大气，真核生命出现。罗迪尼亚超大陆聚而又散，地球几度冰封为「雪球」。',
    events: [
      { year: -2_400_000_000, era: '古元古代', title: '大氧化事件',
        description: '蓝细菌释放的氧气累积至大气，造成大规模氧化，灭绝大量厌氧生物，同时为有氧生命铺平道路。',
        location: { lat: 0, lon: 0 } },
      { year: -2_100_000_000, era: '古元古代', title: '真核生物诞生',
        description: '加蓬弗朗斯维尔生物群显示复杂多细胞结构。最早的真核细胞通过内共生获得线粒体与叶绿体。' },
      { year: -750_000_000, era: '新元古代', title: '罗迪尼亚超大陆',
        description: '罗迪尼亚超大陆聚合后又裂解，其分裂改变了洋流与气候，触发「雪球地球」事件。' },
      { year: -635_000_000, era: '成冰纪', title: '雪球地球',
        description: '全球冰川从两极延伸至赤道，地球几成「雪球」。火山喷发积累的 CO₂ 最终引发剧烈温室效应，让地球解冻。',
        image: '/generated/snowball_001.jpg',
        location: { lat: -20, lon: 25 } }
    ]
  },

  /* ===== 显生宙 · 古生代 ===== */
  {
    eraName: '古生代',
    eraNameEn: 'Paleozoic',
    startYear: -541_000_000,
    summary: '寒武纪大爆发开启显生宙，生命从软体走向硬壳，从海洋走向陆地。鱼、两栖、爬行动物相继出现。',
    events: [
      { year: -541_000_000, era: '寒武纪', title: '寒武纪大爆发',
        description: '在地质学意义的「瞬间」内，几乎所有现代动物门类突然出现。中国澄江、加拿大布尔吉斯、摩洛哥化石库共同见证这场演化壮举。',
        image: '/generated/cambrian_001.jpg',
        location: { lat: 25, lon: 102 } },
      { year: -470_000_000, era: '奥陶纪', title: '生物大辐射',
        description: '海洋生物多样性大幅增加，三叶虫、笔石、头足类繁盛。奥陶纪末发生首次大灭绝。' },
      { year: -400_000_000, era: '泥盆纪', title: '登陆',
        description: '苏格兰老红砂岩保存了最早的陆生植物与四足动物（如提塔利克鱼）——生命从海洋征服陆地。',
        location: { lat: 57, lon: -4 } },
      { year: -300_000_000, era: '石炭纪', title: '煤森林',
        description: '欧洲与北美的热带沼泽森林繁茂，鳞木、封印木高达 30 米。这些森林日后被埋藏、压实，成为今日的煤层。',
        location: { lat: 51, lon: 6 } },
      { year: -252_000_000, era: '二叠纪末', title: '大灭绝（最大规模）',
        description: '西伯利亚超级火山喷发，导致 96% 海洋物种灭绝。这是地球史上最严重的生物大灭绝。' }
    ]
  },

  /* ===== 显生宙 · 中生代 ===== */
  {
    eraName: '中生代',
    eraNameEn: 'Mesozoic',
    startYear: -252_000_000,
    summary: '恐龙时代。盘古大陆分裂，恐龙称霸陆海空，鸟类与早期哺乳动物在阴影中演化。',
    events: [
      { year: -225_000_000, era: '三叠纪', title: '恐龙登场',
        description: '最早的恐龙（如始盗龙）出现于南美。同期，犬颌兽等兽孔类在冈瓦纳大陆分布——它们是哺乳动物的远祖。',
        image: '/generated/karoo_001.jpg',
        location: { lat: -30, lon: -53 } },
      { year: -200_000_000, era: '侏罗纪', title: '恐龙盛世',
        description: '蜥脚类（腕龙、梁龙）称霸陆地，德国索伦霍芬石灰岩保存了始祖鸟化石——恐龙向鸟类演化的关键证据。',
        image: '/generated/jurassic_001.jpg',
        artifacts: ['索伦霍芬始祖鸟化石'],
        location: { lat: 48, lon: 11 } },
      { year: -125_000_000, era: '白垩纪', title: '热河生物群',
        description: '中国辽西热河生物群保存了大量带羽毛恐龙（中华龙鸟、小盗龙）与早期被子植物——白垩纪陆地生态的「庞贝城」。',
        image: '/generated/jehol_001.jpg',
        location: { lat: 41, lon: 120 } },
      { year: -66_000_000, era: '白垩纪末', title: '希克苏鲁伯撞击',
        description: '墨西哥湾尤卡坦半岛的希克苏鲁伯陨石撞击地球，造成 75% 物种灭绝（含非鸟恐龙），恐龙时代终结。',
        image: '/generated/impact_001.jpg',
        artifacts: ['希克苏鲁伯撞击坑'],
        location: { lat: 21, lon: -89 } }
    ]
  },

  /* ===== 显生宙 · 新生代（哺乳动物时代）===== */
  {
    eraName: '新生代',
    eraNameEn: 'Cenozoic',
    startYear: -66_000_000,
    summary: '恐龙灭绝后，哺乳动物辐射演化。南极孤立、冰盖形成；灵长类从树上走向草原，最终诞生人类。',
    events: [
      { year: -55_000_000, era: '古近纪', title: '印度撞欧亚',
        description: '印度板块以年 15 厘米的速度撞上欧亚板块，特提斯洋关闭，喜马拉雅山脉开始隆起。',
        location: { lat: 28, lon: 87 } },
      { year: -34_000_000, era: '渐新世', title: '南极冰盖形成',
        description: '南极与南美之间的德雷克海峡打开，南极环流形成，南极孤立冷却，冰盖大规模形成，开启「冰室地球」。',
        image: '/generated/icesheet_001.jpg',
        location: { lat: -85, lon: 0 } },
      { year: -7_000_000, era: '新近纪', title: '人科分化',
        description: '乍得出土的「图迈」（Sahelanthropus tchadensis）已具备直立行走雏形，是人科与黑猩猩分化的最早代表。',
        location: { lat: 16, lon: 18 } },
      { year: -2_580_000, era: '第四纪', title: '冰河时代开启',
        description: '第四纪冰河时代开始，全球反复经历冰期—间冰期循环。猛犸、剑齿虎等巨型哺乳动物称霸冰原。',
        image: '/generated/iceage_001.jpg',
        location: { lat: 60, lon: 100 } }
    ]
  },

  /* ===== 人类演化 ===== */
  {
    eraName: '人类演化',
    eraNameEn: 'Human Evolution',
    startYear: -2_580_000,
    summary: '从能人到智人，人类用 250 万年完成从非洲草原到全球扩散的壮举，掌握火、语言、艺术与农业。',
    events: [
      { year: -2_600_000, era: '更新世', title: '奥杜瓦伊石器',
        description: '坦桑尼亚奥杜瓦伊峡谷出土最早的可识别石器组合——奥杜瓦伊文化，标志着「制造工具」行为的开始。',
        artifacts: ['奥杜瓦伊峡谷石器'],
        location: { lat: -3, lon: 35 } },
      { year: -1_800_000, era: '更新世', title: '直立人走出非洲',
        description: '格鲁吉亚德马尼西遗址的直立人头骨，证明人属约 180 万年前已离开非洲，扩散至欧亚大陆。',
        location: { lat: 41, lon: 44 } },
      { year: -300_000, era: '更新世', title: '智人诞生',
        description: '摩洛哥杰贝尔伊罗德出土的智人头骨，将现代人类起源时间大幅前推，确证非洲为智人唯一起源地。',
        image: '/generated/sapiens_001.jpg',
        artifacts: ['杰贝尔伊罗德 Jebel Irhoud 头骨'],
        location: { lat: 31, lon: -8 } },
      { year: -65_000, era: '更新世晚期', title: '走出非洲',
        description: '智人沿「南线」或「北线」走出非洲，扩散至欧亚、澳大利亚、美洲，成为全球唯一的人属物种。' },
      { year: -40_000, era: '更新世晚期', title: '艺术诞生',
        description: '法国肖维、拉斯科岩洞壁画，以及印尼苏拉威西洞穴艺术，见证了人类精神世界的觉醒。',
        image: '/generated/lascaux_001.jpg',
        location: { lat: 45, lon: 1 } },
      { year: -12_000, era: '全新世', title: '农业革命',
        description: '冰期结束，全球气候转暖。近东驯化小麦、长江驯化稻、墨西哥驯化玉米——人类从狩猎采集转向定居农业。' }
    ]
  }
];
