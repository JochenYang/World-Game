/**
 * 地球生命史 · 七大洲内容
 *
 * 涵盖范围：
 *  - 地球形成与早期演化（46 亿年前）
 *  - 生命起源与寒武纪大爆发
 *  - 奥陶纪、泥盆纪、石炭纪、二叠纪
 *  - 三叠纪、侏罗纪、白垩纪（恐龙时代）
 *  - 第三纪（哺乳动物兴起）
 *  - 第四纪冰河时代
 *  - 人类演化与文明起源
 *  - 历史时期（南极探险等）
 */

import type { ContinentId } from './continents';

export interface OriginEvent {
  year: number;                 // 距今（负数 = 公元前）
  era: string;                  // 地质年代标签
  title: string;
  description: string;
  artifacts?: string[];
  location?: { lat: number; lon: number };
}

export interface ContinentContent {
  overview: string;
  timeline: OriginEvent[];
}

/* ============================================================
 * 非洲 — 人类起源的摇篮 / 生命起源之地
 * ============================================================ */
const AFRICA: ContinentContent = {
  overview:
    '非洲东部大裂谷，被誉为"人类摇篮"。但非洲的故事远不止于此：南非巴伯顿绿岩带保留了 35 亿年前最早的微生物岩；寒武纪的埃迪卡拉生物群、罗迪尼亚古陆的裂解，都发生于此；侏罗纪的坦桑尼亚马特瓦拉曾有大型蜥脚类恐龙；更新世的奥杜瓦伊峡谷，是人类学家科里亚夫妇发现"能人"的圣地。三十万年前，智人于摩洛哥杰贝尔伊罗德诞生，并向全球扩散。',
  timeline: [
    { year: -4_540_000_000, era: '冥古宙', title: '地球形成',
      description: '原始地球由太阳星云吸积而成，地表为炽热岩浆海。月球的形成或与一次火星大小天体"忒伊亚"的撞击有关。',
      location: { lat: 0, lon: 20 } },
    { year: -3_500_000_000, era: '太古宙', title: '最早的微生物岩',
      description: '南非巴伯顿绿岩带与西澳大利亚的叠层石，是已知最古老的生命痕迹，揭示 35 亿年前蓝细菌已开始光合作用并释放氧气。',
      artifacts: ['巴伯顿绿岩带叠层石'],
      location: { lat: -26, lon: 31 } },
    { year: -635_000_000, era: '成冰纪', title: '雪球地球',
      description: '罗迪尼亚超大陆裂解后，全球冰川从两极延伸至赤道，地球几成"雪球"。其后火山喷发与生物演化共同推动气候解冻。',
      location: { lat: -20, lon: 25 } },
    { year: -541_000_000, era: '寒武纪', title: '寒武纪大爆发',
      description: '在相对短暂的窗口期，几乎所有现代动物门类突然出现。摩洛哥早寒武世化石库见证了这场演化壮举。',
      location: { lat: 31, lon: -7 } },
    { year: -250_000_000, era: '二叠纪', title: '卡鲁盆地兽孔类',
      description: '南非卡鲁盆地出土的兽孔类（如 Lystrosaurus）化石，记录了二叠纪大灭绝后生物复苏的景象，哺乳动物的远祖已现端倪。',
      artifacts: ['卡鲁盆地 Lystrosaurus 化石'],
      location: { lat: -32, lon: 23 } },
    { year: -200_000_000, era: '侏罗纪', title: '坦桑尼亚恐龙',
      description: '坦桑尼亚马特瓦拉(Mtwara)与坦达古鲁(Tendaguru)地层出土了腕龙、剑龙等恐龙，证明非洲曾是冈瓦纳大陆恐龙群的重要栖息地。',
      artifacts: ['坦达古鲁 腕龙 Giraffatitan 化石'],
      location: { lat: -10, lon: 39 } },
    { year: -66_000_000, era: '白垩纪末', title: '希克苏鲁伯陨石',
      description: '墨西哥湾希克苏鲁伯陨石撞击事件虽发生在美洲，但非洲同期地层（如突尼斯 El Kef）的 K-Pg 界线，记录了白垩纪末大灭绝与恐龙时代的终结。',
      location: { lat: 36, lon: 9 } },
    { year: -7_000_000, era: '新近纪', title: '乍得沙赫人',
      description: '乍得出土的"图迈"(Sahelanthropus tchadensis)，已知最早的人科成员之一，已具备直立行走的雏形，开启人类与黑猩猩的分化。',
      location: { lat: 16, lon: 18 } },
    { year: -3_200_000, era: '上新世', title: '露西 · 南方古猿',
      description: '埃塞俄比亚阿法低谷的"露西"(AL 288-1)，完整度达 40%，是人类首次直观认识"直立行走的祖先"。',
      artifacts: ['阿法低谷 AL 288-1 骨架'],
      location: { lat: 11, lon: 40 } },
    { year: -2_600_000, era: '更新世', title: '奥杜瓦伊石器',
      description: '坦桑尼亚奥杜瓦伊峡谷出土最早的可识别石器组合——奥杜瓦伊文化，标志着人类"制造工具"行为的开始。',
      artifacts: ['奥杜瓦伊峡谷石器'],
      location: { lat: -3, lon: 35 } },
    { year: -300_000, era: '更新世', title: '智人诞生',
      description: '摩洛哥杰贝尔伊罗德出土的智人头骨，将现代人类起源时间大幅前推，确证非洲为智人唯一起源地。',
      artifacts: ['杰贝尔伊罗德 Jebel Irhoud 头骨'],
      location: { lat: 31, lon: -8 } },
    { year: -70_000, era: '更新世晚期', title: '走出非洲',
      description: '约七万年前，智人沿红海南端的"南线"或黎凡特的"北线"走出非洲，扩散至欧亚大陆，开启人类全球化的序幕。',
      location: { lat: 12, lon: 43 } }
  ]
};

/* ============================================================
 * 亚洲 — 板块碰撞 / 直立人的第一片新天地 / 稻作起源
 * ============================================================ */
const ASIA: ContinentContent = {
  overview:
    '亚洲是欧亚板块与印度洋板块碰撞的产物，喜马拉雅造山带由此抬升。侏罗纪—白垩纪，新疆吐鲁番的硅化木森林曾繁茂；第四纪冰河时代，西伯利亚冻土封存了猛犸、毛犀牛。180 万年前，格鲁吉亚德马尼西的化石证明人属已抵达高加索；周口店"北京人"、印尼爪哇"爪哇人"，见证了直立人在旧大陆的繁盛。一万年前，长江中下游率先驯化野生稻，孕育出东亚最早的农业文明。',
  timeline: [
    { year: -200_000_000, era: '侏罗纪', title: '吐鲁番硅化木森林',
      description: '新疆吐鲁番盆地出土的硅化木森林，包含水杉、银杏等远古树种，完整保存了侏罗纪生态——恐龙时代亚欧大陆内部也曾郁郁葱葱。',
      artifacts: ['吐鲁番硅化木'],
      location: { lat: 42, lon: 89 } },
    { year: -125_000_000, era: '白垩纪', title: '热河生物群',
      description: '中国辽西热河生物群保存了带羽毛的恐龙(如中华龙鸟)、早期哺乳动物与早期被子植物，是白垩纪陆地生态的"庞贝城"。',
      artifacts: ['热河生物群 中华龙鸟化石'],
      location: { lat: 41, lon: 120 } },
    { year: -55_000_000, era: '古近纪', title: '印度板块撞欧亚',
      description: '约 5500 万年前，印度板块以年 15 厘米的速度撞上欧亚板块，特提斯洋关闭，喜马拉雅山脉开始隆起，青藏高原逐步抬升。',
      location: { lat: 28, lon: 87 } },
    { year: -1_800_000, era: '更新世', title: '德马尼西人',
      description: '格鲁吉亚德马尼西遗址出土的直立人头骨，距今约 180 万年，是非洲以外最早的人属化石。',
      artifacts: ['德马尼西 Dmanisi 头骨 D2280'],
      location: { lat: 41, lon: 44 } },
    { year: -1_700_000, era: '更新世', title: '爪哇直立人',
      description: '印尼爪哇桑吉兰出土的"爪哇人"(Pithecanthropus erectus)，荷兰人类学家杜布瓦 1891 年发现，亚洲直立人的代表。',
      artifacts: ['桑吉兰 Sangiran 头盖骨'],
      location: { lat: -7, lon: 111 } },
    { year: -700_000, era: '更新世', title: '元谋人',
      description: '云南元谋出土的两颗牙齿化石，被认为属于直立人，是迄今为止中国境内已知最早的古人类。',
      artifacts: ['元谋人牙齿化石'],
      location: { lat: 25, lon: 102 } },
    { year: -500_000, era: '更新世', title: '北京人',
      description: '周口店龙骨山出土的"北京人"(Homo erectus pekinensis)，使用石制工具、可能最早用火，是东亚旧石器时代的标志。',
      artifacts: ['周口店第一地点石器、用火遗迹'],
      location: { lat: 39, lon: 116 } },
    { year: -40_000, era: '更新世晚期', title: '山顶洞人',
      description: '周口店山顶洞人已具备现代人特征，掌握磨制骨针、缝制衣物，并出现最早的丧葬习俗。',
      location: { lat: 39, lon: 116 } },
    { year: -20_000, era: '末次冰盛期', title: '猛犸象栖息',
      description: '西伯利亚冻土层保存了大量猛犸象(Mammuthus primigenius)遗骸——冰河时代西伯利亚是猛犸的家园，与人类同期。',
      location: { lat: 67, lon: 105 } },
    { year: -10_000, era: '全新世', title: '稻作起源',
      description: '长江中下游的彭头山、贾湖等遗址显示，万年前中国先民已开始驯化野生稻，开启东亚农业社会。',
      artifacts: ['贾湖遗址 碳化稻米、龟甲符号'],
      location: { lat: 33, lon: 114 } },
    { year: -3500, era: '青铜时代', title: '二里头夏都',
      description: '河南偃师二里头遗址被普遍认为是夏代中晚期都城，奠定了"中国"概念的物质基础。',
      artifacts: ['二里头 青铜爵、绿松石龙形器'],
      location: { lat: 34, lon: 112 } }
  ]
};

/* ============================================================
 * 欧洲 — 冰河雕刻 / 尼安德特人的故乡 / 古典文明
 * ============================================================ */
const EUROPE: ContinentContent = {
  overview:
    '欧洲是尼安德特人的故乡——他们适应了冰期欧洲的严寒，留下莫斯特文化的石器。第四纪冰河时代，斯堪的纳维亚冰盖多次南下，雕刻出今日的北欧峡湾与阿尔卑斯山。约四万五千年前，来自非洲的智人踏入欧洲，与尼安德特人共存数千年并留下基因痕迹。智人随后创造拉斯科、阿尔塔米拉、肖维岩洞的璀璨壁画，迎来旧石器时代晚期的艺术高峰。',
  timeline: [
    { year: -400_000_000, era: '泥盆纪', title: '苏格兰老红砂岩',
      description: '欧洲最早的陆生植物化石之一出现在苏格兰老红砂岩层——泥盆纪的欧洲已从海洋走向绿色大陆。',
      location: { lat: 57, lon: -4 } },
    { year: -300_000_000, era: '石炭纪', title: '煤森林',
      description: '今日欧洲丰富的煤矿资源源自石炭纪的"煤森林"——欧洲北部低地的热带沼泽森林，后被埋藏、压实、变质为煤。',
      location: { lat: 51, lon: 6 } },
    { year: -200_000_000, era: '侏罗纪', title: '索伦霍芬石灰岩',
      description: '德国索伦霍芬(Solnhofen)石灰岩保存了始祖鸟化石——恐龙与鸟类之间过渡形态的代表，证明鸟类起源于兽脚亚目恐龙。',
      artifacts: ['索伦霍芬始祖鸟化石'],
      location: { lat: 48, lon: 11 } },
    { year: -400_000, era: '更新世', title: '海德堡人',
      description: '德国海德堡附近的莫尔出土的下颌骨，是欧洲早期人属代表，被视为尼安德特人与智人的共同祖先。',
      artifacts: ['莫尔 Mauer 下颌骨'],
      location: { lat: 49, lon: 9 } },
    { year: -200_000, era: '更新世', title: '尼安德特人',
      description: '尼安德特人遍布欧洲、近东，脑量甚至超过现代人，专精于寒带狩猎，留下莫斯特文化。',
      location: { lat: 51, lon: 6 } },
    { year: -115_000, era: '伊米间冰期', title: '伊米亚冰期',
      description: '末次间冰期(伊米亚)气候温暖，欧洲北部布满橡树、榉树森林；尼安德特人在此繁盛。',
      location: { lat: 50, lon: 10 } },
    { year: -26_500, era: '末次冰盛期', title: '冰盖鼎盛',
      description: '末次冰盛期(LGM)斯堪的纳维亚冰盖向南推进至德国北部，欧洲大部分被苔原覆盖。',
      location: { lat: 55, lon: 10 } },
    { year: -45_000, era: '更新世晚期', title: '智人踏入欧洲',
      description: '携带奥瑞纳文化的智人从近东进入欧洲，与尼安德特人共存，最终取代后者成为欧洲的主人。',
      location: { lat: 45, lon: 25 } },
    { year: -37_000, era: '更新世晚期', title: '肖维岩洞壁画',
      description: '法国肖维岩洞(Grotte Chauvet)出土超过千幅壁画，包括狮子、犀牛、猛犸等，画艺精湛，被誉为"史前西斯廷"。',
      artifacts: ['肖维岩洞壁画'],
      location: { lat: 44, lon: 4 } },
    { year: -17_000, era: '更新世晚期', title: '拉斯科壁画',
      description: '法国多尔多涅的拉斯科岩洞被誉为"史前卢浮宫"，其野马与中国水墨有异曲同工的写意之美。',
      artifacts: ['拉斯科岩洞壁画'],
      location: { lat: 45, lon: 1 } },
    { year: -9_000, era: '全新世', title: '近东农业扩散',
      description: '西亚"新月沃土"的小麦、大麦传入欧洲，多瑙河畔的线性陶文化(Linear Pottery)开启欧洲新石器时代。',
      location: { lat: 48, lon: 18 } },
    { year: -3000, era: '青铜时代', title: '巨石阵',
      description: '英国索尔兹伯里平原的巨石阵(Stonehenge)开始建造，标志欧洲进入青铜时代，也是人类天文学最早的纪念碑。',
      artifacts: ['巨石阵'],
      location: { lat: 51, lon: -2 } }
  ]
};

/* ============================================================
 * 北美洲 — 白令陆桥 / 冰河走廊 / 人类最后的迁徙
 * ============================================================ */
const NORTH_AMERICA: ContinentContent = {
  overview:
    '北美洲是地球上地质活动最丰富的大陆之一：科罗拉多大峡谷记录了 18 亿年的地层；白垩纪末期的小行星撞击终结了恐龙时代；第四纪冰河时代，劳伦泰冰盖雕出五大湖。北美洲也是人类抵达最晚的大陆——约两万年前至一万五千年前，亚洲狩猎者经白令陆桥进入阿拉斯加；克洛维斯文化、福尔瑟姆文化与普韦布洛文明，书写了北美史前的精彩篇章。',
  timeline: [
    { year: -1_700_000_000, era: '古元古代', title: '大峡谷基底',
      description: '科罗拉多大峡谷最底部的"毗湿奴片岩"距今约 17 亿年，是北美大陆最古老岩石之一。',
      artifacts: ['大峡谷 毗湿奴片岩'],
      location: { lat: 36, lon: -113 } },
    { year: -75_000_000, era: '白垩纪', title: '西部内陆海道',
      description: '晚白垩世北美大陆被一条南北向的浅海一分为二——西部内陆海道(WIS)，从北冰洋延伸至墨西哥湾。',
      location: { lat: 40, lon: -100 } },
    { year: -66_000_000, era: '白垩纪末', title: '希克苏鲁伯撞击',
      description: '墨西哥湾希克苏鲁伯陨石撞击事件造成白垩纪末大灭绝，恐龙时代终结。北美同时代地层保存了清晰的铱异常与冲击石英。',
      artifacts: ['希克苏鲁伯撞击坑'],
      location: { lat: 21, lon: -89 } },
    { year: -55_000_000, era: '古近纪', title: '怀俄明湖相',
      description: '怀俄明绿河组(Green River Formation)的湖相沉积，保存了始新世鱼类、昆虫、鸟类的精美化石，被誉为"始新世化石库"。',
      location: { lat: 41, lon: -109 } },
    { year: -20_000, era: '末次冰盛期', title: '白令陆桥',
      description: '末次冰盛期海平面下降，连接西伯利亚与阿拉斯加的白令陆桥暴露，亚洲狩猎者循此进入美洲。',
      location: { lat: 65, lon: -168 } },
    { year: -15_000, era: '更新世晚期', title: '克洛维斯文化',
      description: '北美最早被广泛认同的文化之一，以双面打制的克洛维斯尖状器为代表，狩猎乳齿象、猛犸等大型动物。',
      artifacts: ['克洛维斯尖状器'],
      location: { lat: 36, lon: -107 } },
    { year: -13_000, era: '更新世晚期', title: '梅多克罗夫特岩棚',
      description: '宾夕法尼亚州梅多克罗夫特岩棚遗址出土石器，年代可能早于克洛维斯，提出"克洛维斯优先"模型之外的争议。',
      location: { lat: 40, lon: -80 } },
    { year: -10_000, era: '更新世末', title: '猛犸灭绝',
      description: '伴随人类扩散与气候变暖，北美猛犸、乳齿象、剑齿虎等大型动物相继灭绝，狩猎文化转向多样化生计。',
      location: { lat: 40, lon: -100 } },
    { year: -3_000, era: '新石器', title: '普韦布洛农耕',
      description: '美国西南部原住民驯化玉米、南瓜、豆类("三姐妹")，出现普韦布洛式定居村落与精致陶器。',
      artifacts: ['普韦布洛陶器'],
      location: { lat: 36, lon: -107 } },
    { year: -1500, era: '密西西比期', title: '卡霍基亚',
      description: '密西西比河下游的卡霍基亚土墩群见证北美最大史前城市，1200 年前鼎盛期人口近两万。',
      artifacts: ['卡霍基亚 Monk\'s Mound'],
      location: { lat: 38, lon: -90 } }
  ]
};

/* ============================================================
 * 南美洲 — 冈瓦纳遗存 / 安第斯文明
 * ============================================================ */
const SOUTH_AMERICA: ContinentContent = {
  overview:
    '南美洲是冈瓦纳超大陆的核心碎片，至今仍可见到与非洲、澳大利亚的化石亲缘。三叠纪的巴西犬颌兽、南美有袋类延续到新生代；安第斯高原的崛起为冰河期巨型动物(如雕齿兽)提供了多样生境。智人在一万四千年内穿越整块大陆，在智利蒙特维尔德留下美洲最早确凿足迹；其后在安第斯高原驯化马铃薯、藜麦，孕育印加帝国。',
  timeline: [
    { year: -260_000_000, era: '二叠纪', title: '伊拉蒂组',
      description: '巴西南里奥格兰德州的伊拉蒂组(Irati Formation)保存了中二叠世海相爬行类 Mesosaurus 化石，与南非同期化石一一对应，证明两大陆曾相连。',
      artifacts: ['伊拉蒂组 Mesosaurus'],
      location: { lat: -29, lon: -53 } },
    { year: -225_000_000, era: '三叠纪', title: '巴西犬颌兽',
      description: '巴西南部圣玛丽亚组(Santa Maria Formation)出土的犬颌兽(Cynognathus)，是冈瓦纳大陆分布的标志性三叠纪兽孔类。',
      artifacts: ['圣玛丽亚组 Cynognathus'],
      location: { lat: -30, lon: -53 } },
    { year: -70_000_000, era: '白垩纪', title: '阿根廷龙',
      description: '阿根廷巴塔哥尼亚出土的阿根廷龙(Argentinosaurus huinculensis)，是已知最大的蜥脚类恐龙之一，体长超过 30 米。',
      artifacts: ['阿根廷龙 Argentinosaurus'],
      location: { lat: -39, lon: -69 } },
    { year: -20_000, era: '末次冰盛期', title: '更新世巨型动物',
      description: '南美更新世晚期曾有雕齿兽(Glyptodon)、大地懒、剑齿虎等巨型动物，与早期人类共存。',
      location: { lat: -34, lon: -64 } },
    { year: -14_000, era: '更新世晚期', title: '蒙特维尔德足迹',
      description: '智利蒙特维尔德遗址出土的木质工具与足印，年代早于克洛维斯，是美洲最早的人类活动证据之一。',
      artifacts: ['蒙特维尔德木制工具'],
      location: { lat: -41, lon: -73 } },
    { year: -13_000, era: '更新世晚期', title: '拉戈阿圣塔之殉',
      description: '巴西拉戈阿圣塔(Lagoa Santa)的"露西亚"等女性头骨揭示了最早进入南美的美洲人形态。',
      location: { lat: -19, lon: -44 } },
    { year: -11_000, era: '更新世末', title: '克洛维斯扩散',
      description: '克洛维斯猎人越过巴拿马地峡，在南美北部留下鱼叉与火塘遗迹，狩猎乳齿象与原始骆驼。',
      location: { lat: -8, lon: -65 } },
    { year: -8_000, era: '全新世', title: '玉米传入',
      description: '墨西哥驯化的玉米沿安第斯传入南美，南美先民开始尝试种植，奠定前印加农业基础。',
      location: { lat: -13, lon: -72 } },
    { year: -5_500, era: '全新世', title: '卡拉尔遗址',
      description: '秘鲁卡拉尔(Caral)古城被认为是美洲最早的城市文明之一，与埃及金字塔同时期。',
      artifacts: ['卡拉尔金字塔'],
      location: { lat: -10, lon: -77 } },
    { year: -1500, era: '历史时期', title: '印加帝国',
      description: '印加人以库斯科为中心，建立起从厄瓜多尔到智利的庞大帝国，修建马丘比丘、太阳节(Inti Raymi)。',
      location: { lat: -13, lon: -72 } }
  ]
};

/* ============================================================
 * 大洋洲 — 漂浮的冈瓦纳碎片 / 最早的海洋迁徙
 * ============================================================ */
const OCEANIA: ContinentContent = {
  overview:
    '大洋洲由冈瓦纳古陆裂解而成：澳大利亚曾是南极洲与南美洲之间的纽带；新西兰则在 8500 万年前脱离冈瓦纳独立漂移。侏罗纪—白垩纪，澳大利亚内陆仍有恐龙(如敏迷龙)；更新世则有袋狮、巨型袋鼠。距今约六万五千年前，智人乘简易木筏跨越约 100 公里的海面抵达澳大利亚，完成了人类最早的海洋迁徙。',
  timeline: [
    { year: -180_000_000, era: '侏罗纪', title: '澳大利亚恐龙',
      description: '昆士兰州温顿(Winton)出土的蜥脚类 Diamantinasaurus、Australotitan cooperensis 等，证明白垩纪澳大利亚内陆仍有恐龙繁衍生息。',
      artifacts: ['温顿 Australotitan'],
      location: { lat: -22, lon: 143 } },
    { year: -115_000_000, era: '白垩纪', title: '新西兰裂离',
      description: '约 8500-10000 万年前，新西兰从冈瓦纳大陆裂离，成为最古老的孤立岛屿之一——也因此保留了诸多原始物种。',
      location: { lat: -41, lon: 172 } },
    { year: -25_000_000, era: '新近纪', title: '巨型有袋类',
      description: '中新世的澳大利亚仍存有袋狮(Thylacoleo)、双门齿兽(Diprotodon)等巨型有袋类，是有袋类的"黄金时代"。',
      location: { lat: -28, lon: 135 } },
    { year: -65_000, era: '更新世', title: '跨越华莱士线',
      description: '人类首次大规模海上迁徙：从印尼苏拉威西乘竹木筏抵达澳大利亚西北海岸，全程超 100 公里。',
      location: { lat: -22, lon: 114 } },
    { year: -50_000, era: '更新世', title: '巨型动物灭绝',
      description: '澳洲巨型动物群(双门齿兽、巨袋鼠 Genyornis 等)与人类到达后相继灭绝。',
      location: { lat: -25, lon: 135 } },
    { year: -40_000, era: '更新世', title: '蒙戈人足迹',
      description: '澳大利亚新南威尔士蒙戈湖(Mungo Lake)出土的"蒙戈人 1 号"骨架，保留完整火葬仪式。',
      artifacts: ['蒙戈湖 1 号骨架'],
      location: { lat: -34, lon: 143 } },
    { year: -35_000, era: '更新世晚期', title: '岩画繁盛',
      description: '澳大利亚北部卡卡杜国家公园的"动态人物"岩画、X 光风格绘画，记录了四万余年的连续艺术传统。',
      artifacts: ['卡卡杜岩画'],
      location: { lat: -13, lon: 132 } },
    { year: -3500, era: '全新世', title: '拉皮塔文化',
      description: '美拉尼西亚群岛的拉皮塔(Lapita)先民制作带印纹陶器，驾驭独木舟从俾斯麦群岛扩散至斐济、汤加、萨摩亚。',
      artifacts: ['拉皮塔印纹陶器'],
      location: { lat: -4, lon: 152 } },
    { year: -1200, era: '全新世', title: '波利尼西亚扩张',
      description: '波利尼西亚航海者凭借星象、洋流、鸟踪，发现并定居新西兰(约 1250 年)、夏威夷、复活节岛。',
      location: { lat: -21, lon: -159 } },
    { year: -800, era: '全新世', title: '毛利人登陆',
      description: '东波利尼西亚航海者抵达新西兰，发展出独特的毛利文化，至今保留 Haka 战舞、Wharenui 议事堂。',
      location: { lat: -41, lon: 174 } }
  ]
};

/* ============================================================
 * 南极洲 — 冰雪之陆 / 冈瓦纳最后的堡垒
 * ============================================================ */
const ANTARCTICA: ContinentContent = {
  overview:
    '南极洲曾是冈瓦纳超大陆的核心——三叠纪时还覆盖着温带森林，今日却封存着 90% 的世界冰量。中生代的南极是恐龙、植物的家园；三趾马、袋熊的化石证明新生代仍较温暖。3000 万年前，南极与南美洲之间的德雷克海峡打开，南极环流形成，气候急冻，开启"冰雪纪元"。人类对南极的探索始于 19 世纪；1959 年《南极条约》将其永久保留为"和平与科学的圣地"。',
  timeline: [
    { year: -400_000_000, era: '泥盆纪', title: '南极原始森林',
      description: '南极横贯山脉出土的泥盆纪植物化石，证明南极洲当时位于较高纬度、温带气候，曾覆盖原始森林。',
      location: { lat: -85, lon: 0 } },
    { year: -200_000_000, era: '侏罗纪', title: '南极冰鱼龙',
      description: '南极洲出土的侏罗纪鱼龙、蛇颈龙化石，证明当时南极洲虽位于极地但仍为温带海洋，今日南极冰鱼或可追溯至此。',
      location: { lat: -75, lon: 0 } },
    { year: -70_000_000, era: '白垩纪', title: '南极恐龙',
      description: '南极洲詹姆斯罗斯岛出土的恐龙(Antarctopelta、Glacialisaurus)、早期哺乳动物，证明白垩纪南极仍生机盎然。',
      artifacts: ['詹姆斯罗斯岛 冰龙 Glacialisaurus'],
      location: { lat: -64, lon: -58 } },
    { year: -34_000_000, era: '始新世—渐新世', title: '南极冰盖形成',
      description: '约 3400 万年前，全球温度骤降(EOT 事件)，南极冰盖大规模形成，标志"冰室地球"的开始。',
      location: { lat: -85, lon: 0 } },
    { year: -23_000_000, era: '新近纪', title: '德雷克海峡打开',
      description: '南极与南美洲之间的德雷克海峡打开，南极环流(ACC)形成，南极进一步孤立、冷却、永久封冻。',
      location: { lat: -60, lon: -65 } },
    { year: -15_000_000, era: '新近纪', title: '三趾马与袋熊',
      description: '南极洲横断山脉出土的中新世三趾马、南美有蹄类化石，证明中新世南极仍较温暖。',
      location: { lat: -77, lon: 160 } },
    { year: -2_580_000, era: '第四纪', title: '冰河时代',
      description: '第四纪冰河时代开始，南极冰盖进一步扩张——冰河时代并非只有北半球，南极同样是冰河时代的中心。',
      location: { lat: -85, lon: 0 } },
    { year: -1821, era: '历史时期', title: '别林斯高晋初见',
      description: '俄国探险家别林斯高晋(Fabian von Bellingshausen)率船队抵达南极洲海岸，是人类首次确认这片大陆的存在。',
      location: { lat: -69, lon: 90 } },
    { year: -1911, era: '历史时期', title: '阿蒙森抵达南极点',
      description: '挪威人罗阿尔·阿蒙森率队使用狗拉雪橇，于 1911 年 12 月 14 日率先抵达南极点，比英国斯科特队早 35 天。',
      location: { lat: -90, lon: 0 } },
    { year: -1912, era: '历史时期', title: '斯科特悲壮折戟',
      description: '英国海军上校罗伯特·斯科特在归途中遇难，其日记"为上帝的荣光，为祖国的荣光"成为南极探险精神的绝唱。',
      location: { lat: -79, lon: 169 } },
    { year: -1959, era: '现代', title: '南极条约签订',
      description: '12 国签订《南极条约》，冻结一切领土主张，将南极洲永久保留为"和平与科学"的圣地。',
      location: { lat: -75, lon: 123 } }
  ]
};

export const CONTENT: Record<ContinentId, ContinentContent> = {
  africa: AFRICA,
  asia: ASIA,
  europe: EUROPE,
  northAmerica: NORTH_AMERICA,
  southAmerica: SOUTH_AMERICA,
  oceania: OCEANIA,
  antarctica: ANTARCTICA
};

export function getContent(id: ContinentId): ContinentContent | undefined {
  return CONTENT[id];
}