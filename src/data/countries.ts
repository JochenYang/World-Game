/**
 * 世界各国历史 — 主要文明/国家编年
 *
 * 按大陆分组，覆盖人类文明史的代表性国家/文明。
 * 每个文明含 5-8 条关键事件，按时间顺序排列。
 */

import type { ContinentId } from './continents';
import type { OriginEvent } from './content';

export interface CountryHistory {
  id: string;            // 唯一标识，如 'china'
  name: string;          // 中文名，如「中华文明」
  nameEn: string;        // 英文名，如 'Chinese Civilization'
  stamp: string;         // 印章字符
  continent: ContinentId;
  startYear: number;     // 起始年份（用于排序）
  region: string;        // 区域简述，如「东亚黄河流域」
  overview: string;
  timeline: OriginEvent[];
}

export const COUNTRIES: CountryHistory[] = [
  /* ============================================================
   * 亚洲
   * ============================================================ */
  {
    id: 'china',
    name: '中华文明',
    nameEn: 'Chinese Civilization',
    stamp: '华',
    continent: 'asia',
    startYear: -2070,
    region: '东亚 · 黄河与长江流域',
    overview: '世界唯一未曾中断的古老文明。从夏商周三代礼乐，到秦汉一统、唐宋繁华、明清帝国，中华文明以儒家伦理为根，融儒释道，留下了长城、丝绸、瓷器、四大发明等不朽遗产。',
    timeline: [
      { year: -2070, era: '上古', title: '夏朝建立',
        description: '相传大禹治水后，其子启建立夏朝，开启中国「家天下」世袭王朝之始。二里头遗址或为夏都所在。',
        artifacts: ['二里头遗址 青铜爵、绿松石龙形器'],
        location: { lat: 34, lon: 112 } },
      { year: -1250, era: '商', title: '甲骨文',
        description: '商王武丁时期的甲骨文，是中国最早的成熟文字，刻于龟甲兽骨用于占卜，奠定了汉字系统的根基。',
        artifacts: ['殷墟甲骨文'],
        location: { lat: 36, lon: 114 } },
      { year: -551, era: '春秋', title: '孔子诞生',
        description: '孔子创立儒家学派，倡导「仁」「礼」，其思想深刻影响东亚两千余年。同期老子、墨子、庄子等百家争鸣。',
        location: { lat: 35, lon: 117 } },
      { year: -221, era: '秦', title: '秦统一六国',
        description: '秦始皇嬴政灭六国，建立中国第一个中央集权大一统帝国，统一文字、度量衡、货币，修筑万里长城。',
        artifacts: ['秦始皇陵兵马俑'],
        location: { lat: 34, lon: 109 } },
      { year: 618, era: '唐', title: '盛唐气象',
        description: '唐朝长安成为世界最大都市，丝绸之路繁盛，佛教、诗歌、艺术登峰造极，万国来朝。',
        location: { lat: 34, lon: 109 } },
      { year: 1271, era: '元', title: '忽必烈建元',
        description: '蒙古铁骑横扫欧亚，忽必烈建立元朝，马可·波罗游记让西方神往东方的富庶。',
        location: { lat: 40, lon: 116 } },
      { year: 1421, era: '明', title: '迁都北京',
        description: '明成祖朱棣迁都北京，营建紫禁城。此前郑和七下西洋，远达非洲东岸。',
        artifacts: ['紫禁城'],
        location: { lat: 39, lon: 116 } }
    ]
  },
  {
    id: 'india',
    name: '印度文明',
    nameEn: 'Indian Civilization',
    stamp: '梵',
    continent: 'asia',
    startYear: -2500,
    region: '南亚 · 印度河流域与恒河流域',
    overview: '从印度河谷的摩亨佐-达罗，到吠陀时代、孔雀帝国、笈多黄金时代，印度孕育了佛教、印度教、阿拉伯数字、瑜伽等影响世界的思想与发明。',
    timeline: [
      { year: -2500, era: '印度河文明', title: '摩亨佐-达罗',
        description: '印度河谷出现高度城市规划的青铜文明，砖砌街道、下水道、公共浴池，规模与组织令人惊叹。',
        artifacts: ['摩亨佐-达罗遗址'],
        location: { lat: 27, lon: 68 } },
      { year: -1500, era: '吠陀时代', title: '雅利安人迁入',
        description: '雅利安人迁入印度，编纂《吠陀》经典，种姓制度萌芽，奠定印度教文化基础。' },
      { year: -563, era: '列国时代', title: '释迦牟尼诞生',
        description: '悉达多·乔达摩诞生于蓝毗尼，创立佛教，以「四谛」「八正道」普度众生。',
        location: { lat: 27, lon: 83 } },
      { year: -322, era: '孔雀王朝', title: '阿育王时代',
        description: '阿育王统一印度次大陆，皈依佛教，派遣传教团至中亚、东南亚，使佛教成为世界宗教。',
        location: { lat: 25, lon: 85 } },
      { year: 320, era: '笈多王朝', title: '黄金时代',
        description: '笈多王朝时期，印度数学家发明「零」的概念，阿拉伯数字体系成型；文学、艺术繁荣。' },
      { year: 1526, era: '莫卧儿', title: '莫卧儿帝国',
        description: '巴布尔建立莫卧儿帝国，沙贾汗为爱妻修建泰姬陵，融合波斯与印度艺术。',
        artifacts: ['泰姬陵'],
        location: { lat: 27, lon: 78 } }
    ]
  },
  {
    id: 'persia',
    name: '波斯文明',
    nameEn: 'Persian Civilization',
    stamp: '波',
    continent: 'asia',
    startYear: -550,
    region: '西亚 · 伊朗高原',
    overview: '从居鲁士的阿契美尼德帝国，到萨珊王朝、波斯伊斯兰化、萨非王朝，波斯是连接东西方的桥梁，孕育了琐罗亚斯德教、波斯诗歌与细密画。',
    timeline: [
      { year: -550, era: '阿契美尼德', title: '居鲁士大帝',
        description: '居鲁士建立阿契美尼德波斯帝国，疆域横跨亚非欧，是人类第一个「世界帝国」。',
        artifacts: ['波斯波利斯遗址'],
        location: { lat: 30, lon: 53 } },
      { year: -522, era: '阿契美尼德', title: '大流士一世',
        description: '大流士一世改革行政、修建御道、统一货币，其贝希斯敦铭文记录了帝国伟业。' },
      { year: -330, era: '希腊化', title: '亚历山大征服',
        description: '亚历山大大帝击败大流士三世，波斯进入希腊化时代，东西文化深度交融。' },
      { year: 224, era: '萨珊', title: '萨珊复兴',
        description: '萨珊王朝复兴波斯传统，以琐罗亚斯德教为国教，与罗马帝国、拜占庭长期对峙。' },
      { year: 637, era: '伊斯兰化', title: '阿拉伯征服',
        description: '阿拉伯帝国击败萨珊，波斯逐步伊斯兰化，但保留波斯语言与文化。' },
      { year: 1501, era: '萨非', title: '萨非王朝',
        description: '萨非王朝确立什叶派为国教，定都伊斯法罕，波斯细密画、建筑达到巅峰。' }
    ]
  },
  {
    id: 'mesopotamia',
    name: '美索不达米亚',
    nameEn: 'Mesopotamia',
    stamp: '美',
    continent: 'asia',
    startYear: -3500,
    region: '西亚 · 两河流域',
    overview: '人类最早的城市文明。苏美尔人发明楔形文字与车轮，巴比伦颁布《汉谟拉比法典》，亚述建立军事帝国——两河流域是人类文明的摇篮。',
    timeline: [
      { year: -3500, era: '乌鲁克', title: '城市革命',
        description: '苏美尔人在两河流域建立乌鲁克等城市，发明楔形文字、车轮、灌溉农业。',
        artifacts: ['乌鲁克石膏瓶'],
        location: { lat: 31, lon: 45 } },
      { year: -2100, era: '乌尔', title: '乌尔第三王朝',
        description: '乌尔纳姆颁布已知最早的成文法典《乌尔纳姆法典》，早于汉谟拉比三百年。' },
      { year: -1792, era: '古巴比伦', title: '汉谟拉比',
        description: '汉谟拉比统一两河流域，颁布《汉谟拉比法典》，以「以眼还眼」闻名于世。',
        artifacts: ['汉谟拉比法典石碑'],
        location: { lat: 33, lon: 44 } },
      { year: -883, era: '亚述', title: '亚述帝国',
        description: '亚述以铁制武器和强大军队建立军事帝国，尼尼微图书馆藏有数万块泥板文献。' },
      { year: -626, era: '新巴比伦', title: '空中花园',
        description: '尼布甲尼撒二世修建传说中的空中花园，巴比伦成为古代世界奇迹之城。' }
    ]
  },
  {
    id: 'japan',
    name: '日本文明',
    nameEn: 'Japanese Civilization',
    stamp: '和',
    continent: 'asia',
    startYear: -660,
    region: '东亚 · 日本列岛',
    overview: '从绳文、弥生到飞鸟奈良，日本吸收中华文明又发展出独特的和风文化。武士道、禅宗、浮世绘、茶道，构成日本独特的精神世界。',
    timeline: [
      { year: -660, era: '神话', title: '神武天皇',
        description: '相传神武天皇于公元前 660 年建国，日本天皇制延续至今，是世界最长的王朝世系。',
        location: { lat: 34, lon: 135 } },
      { year: 710, era: '奈良', title: '奈良建都',
        description: '元明天皇迁都平城京（奈良），全面学习唐朝制度与文化，佛教兴盛。',
        location: { lat: 34, lon: 136 } },
      { year: 1192, era: '镰仓', title: '幕府时代',
        description: '源赖朝建立镰仓幕府，开启武家政权。此后近七百年，天皇大权旁落，幕府统治日本。',
        location: { lat: 35, lon: 140 } },
      { year: 1603, era: '江户', title: '德川幕府',
        description: '德川家康建立江户幕府，锁国两百余载，浮世绘、歌舞伎、茶道繁荣，武士道成熟。' },
      { year: 1868, era: '近代', title: '明治维新',
        description: '明治天皇「富国强兵」「脱亚入欧」，日本迅速近代化，跻身世界强国。',
        location: { lat: 35, lon: 139 } }
    ]
  },
  {
    id: 'southeastasia',
    name: '东南亚文明',
    nameEn: 'Southeast Asian Civilizations',
    stamp: '南',
    continent: 'asia',
    startYear: 200,
    region: '东南亚 · 中南半岛与南洋群岛',
    overview: '扶南、真腊、高棉、室利佛逝、满者伯夷……东南亚在印度与中国两大文明影响下，发展出独特的佛塔文明与海洋贸易网络。',
    timeline: [
      { year: 200, era: '扶南', title: '扶南王国',
        description: '湄公河三角洲的扶南王国成为东南亚最早的海港国，连接中印贸易。',
        location: { lat: 11, lon: 105 } },
      { year: 802, era: '高棉', title: '吴哥王朝',
        description: '阇耶跋摩二世建立高棉帝国，苏耶跋摩二世修建吴哥窟，成为世界最大宗教建筑。',
        artifacts: ['吴哥窟'],
        location: { lat: 13, lon: 103 } },
      { year: 1293, era: '满者伯夷', title: '海上帝国',
        description: '满者伯夷帝国统御印尼群岛，控制香料贸易，其首相哈耶·乌鲁克编纂法律大典。' },
      { year: 1350, era: '阿瑜陀耶', title: '暹罗王国',
        description: '阿瑜陀耶王朝崛起于泰国，建立强大的泰族王国，与明朝、欧洲频繁贸易。' }
    ]
  },

  /* ============================================================
   * 欧洲
   * ============================================================ */
  {
    id: 'greece',
    name: '希腊文明',
    nameEn: 'Greek Civilization',
    stamp: '希',
    continent: 'europe',
    startYear: -800,
    region: '南欧 · 爱琴海沿岸',
    overview: '民主、哲学、戏剧、奥运、几何——古希腊奠定了西方文明的根基。苏格拉底、柏拉图、亚里士多德的思想影响至今。',
    timeline: [
      { year: -800, era: '古风', title: '城邦兴起',
        description: '希腊城邦如雅典、斯巴达、科林斯兴起，开启独特的城邦政治传统。',
        location: { lat: 38, lon: 24 } },
      { year: -508, era: '古典', title: '雅典民主',
        description: '克里斯提尼改革确立雅典民主制，公民大会决定国家大事，开创人类政治史先河。' },
      { year: -480, era: '古典', title: '希波战争',
        description: '马拉松战役、温泉关三百斯巴达勇士、萨拉米斯海战——希腊联军击败波斯入侵。',
        location: { lat: 38, lon: 24 } },
      { year: -447, era: '古典', title: '帕特农神庙',
        description: '伯里克利时代修建帕特农神庙，菲狄亚斯雕刻雅典娜神像，希腊艺术达到巅峰。',
        artifacts: ['帕特农神庙'],
        location: { lat: 38, lon: 24 } },
      { year: -399, era: '古典', title: '苏格拉底之死',
        description: '苏格拉底因「毒害青年」被雅典判处饮鸩，其弟子柏拉图、再传弟子亚里士多德奠定西方哲学。' },
      { year: -336, era: '希腊化', title: '亚历山大东征',
        description: '亚历山大大帝征服波斯、埃及、印度，开启希腊化时代，东西文明交融。' }
    ]
  },
  {
    id: 'rome',
    name: '罗马文明',
    nameEn: 'Roman Civilization',
    stamp: '罗',
    continent: 'europe',
    startYear: -753,
    region: '南欧 · 地中海沿岸',
    overview: '从台伯河畔的小村庄，发展为横跨欧亚非的超级帝国。罗马法、拉丁语、基督教、引水渠、圆形剧场，塑造了整个西方世界。',
    timeline: [
      { year: -753, era: '王政', title: '罗马建城',
        description: '相传罗慕路斯与雷穆斯于公元前 753 年建立罗马城，开启罗马千年史。',
        location: { lat: 42, lon: 12 } },
      { year: -509, era: '共和', title: '罗马共和国',
        description: '驱逐王政，建立共和国，由执政官、元老院、公民大会共治，逐步统一意大利。' },
      { year: -27, era: '帝国', title: '奥古斯都',
        description: '屋大维获「奥古斯都」称号，罗马帝国建立，开启两百年「罗马和平」（Pax Romana）。',
        location: { lat: 42, lon: 12 } },
      { year: 80, era: '帝国', title: '罗马斗兽场',
        description: '弗拉维圆形剧场（斗兽场）建成，可容五万观众，是罗马工程学的杰作。',
        artifacts: ['罗马斗兽场'],
        location: { lat: 42, lon: 12 } },
      { year: 313, era: '晚期', title: '米兰敕令',
        description: '君士坦丁大帝颁布米兰敕令，承认基督教合法地位，基督教从此走向世界宗教。' },
      { year: 476, era: '灭亡', title: '西罗马灭亡',
        description: '日耳曼人奥多亚塞废黜西罗马末代皇帝，西罗马帝国灭亡，欧洲进入中世纪。' }
    ]
  },
  {
    id: 'britain',
    name: '英国文明',
    nameEn: 'British Civilization',
    stamp: '英',
    continent: 'europe',
    startYear: -3000,
    region: '西欧 · 不列颠群岛',
    overview: '从巨石阵、罗马不列颠、盎格鲁-撒克逊、诺曼征服，到大宪章、工业革命、日不落帝国，英国深刻塑造了现代世界。',
    timeline: [
      { year: -3000, era: '新石器', title: '巨石阵',
        description: '索尔兹伯里平原的巨石阵开始建造，是欧洲最重要的史前天文与宗教遗址。',
        image: '/generated/stonehenge_001.jpg',
        artifacts: ['巨石阵'],
        location: { lat: 51, lon: -2 } },
      { year: 1066, era: '中世纪', title: '诺曼征服',
        description: '诺曼底公爵威廉击败盎格鲁-撒克逊国王哈罗德，开启英国封建集权时代。',
        location: { lat: 51, lon: 0 } },
      { year: 1215, era: '中世纪', title: '大宪章',
        description: '约翰王被迫签署《大宪章》，王权受限，成为宪政与法治传统的源头。' },
      { year: 1688, era: '近代', title: '光荣革命',
        description: '不流血的光荣革命确立君主立宪制，议会主权取代王权专制。' },
      { year: 1769, era: '近代', title: '工业革命',
        description: '瓦特改良蒸汽机，英国率先开启工业革命，机械化生产改变世界。' },
      { year: 1815, era: '帝国', title: '日不落帝国',
        description: '拿破仑战争后，英国成为全球霸主，殖民地遍布全球，「日不落帝国」鼎盛。' }
    ]
  },
  {
    id: 'france',
    name: '法兰西文明',
    nameEn: 'French Civilization',
    stamp: '法',
    continent: 'europe',
    startYear: -52,
    region: '西欧 · 法兰西平原',
    overview: '高卢、法兰克、卡佩、波旁、革命、共和国——法国是欧洲文化的中心之一，启蒙运动、大革命、印象派深刻影响人类精神史。',
    timeline: [
      { year: -52, era: '高卢', title: '阿莱西亚之战',
        description: '凯撒击败高卢首领维钦托利，高卢并入罗马，开启拉丁化的法兰西文明。',
        location: { lat: 47, lon: 4 } },
      { year: 481, era: '法兰克', title: '墨洛温王朝',
        description: '克洛维建立法兰克王国，皈依天主教，奠定法国天主教传统。' },
      { year: 800, era: '加洛林', title: '查理曼加冕',
        description: '查理曼于罗马圣诞节由教皇加冕为「罗马人皇帝」，复兴西欧帝国。',
        location: { lat: 49, lon: 2 } },
      { year: 1789, era: '大革命', title: '法国大革命',
        description: '攻占巴士底狱，颁布《人权宣言》，推翻波旁王朝，「自由、平等、博爱」传遍世界。',
        location: { lat: 49, lon: 2 } },
      { year: 1804, era: '帝国', title: '拿破仑加冕',
        description: '拿破仑称帝，颁布《拿破仑法典》，横扫欧洲，重塑近代欧洲版图。' }
    ]
  },
  {
    id: 'russia',
    name: '俄罗斯文明',
    nameEn: 'Russian Civilization',
    stamp: '俄',
    continent: 'europe',
    startYear: 862,
    region: '东欧 · 俄罗斯平原',
    overview: '从基辅罗斯、莫斯科公国、沙皇俄国，到俄罗斯帝国、苏联、俄罗斯联邦——横跨欧亚的庞大文明，东正教是其精神内核。',
    timeline: [
      { year: 862, era: '基辅罗斯', title: '留里克建国',
        description: '维京人留里克建立诺夫哥罗德，开启基辅罗斯王朝，俄罗斯国家之始。',
        location: { lat: 58, lon: 31 } },
      { year: 988, era: '基辅罗斯', title: '弗拉基米尔受洗',
        description: '弗拉基米尔大公接受东正教，俄罗斯从此与拜占庭文化圈结缘。' },
      { year: 1547, era: '沙俄', title: '伊凡雷帝',
        description: '伊凡四世自称「沙皇」，扩张疆域，俄罗斯进入沙皇专制时代。' },
      { year: 1682, era: '沙俄', title: '彼得大帝',
        description: '彼得大帝全面西化改革，迁都圣彼得堡，建立俄罗斯帝国，跻身欧洲列强。',
        location: { lat: 59, lon: 30 } },
      { year: 1917, era: '现代', title: '十月革命',
        description: '列宁领导布尔什维克夺取政权，建立苏维埃，开创人类第一个社会主义国家。' }
    ]
  },

  /* ============================================================
   * 非洲
   * ============================================================ */
  {
    id: 'egypt',
    name: '古埃及文明',
    nameEn: 'Ancient Egypt',
    stamp: '埃',
    continent: 'africa',
    startYear: -3100,
    region: '北非 · 尼罗河流域',
    overview: '尼罗河的赠礼。法老、金字塔、象形文字、木乃伊——古埃及延续了三千年，留下了人类最壮丽的早期文明遗产。',
    timeline: [
      { year: -3100, era: '早王朝', title: '上下埃及统一',
        description: '美尼斯统一上下埃及，建立第一王朝，开启法老时代。尼罗河滋养了人类最悠久的文明之一。',
        location: { lat: 26, lon: 32 } },
      { year: -2560, era: '古王国', title: '胡夫金字塔',
        description: '胡夫法老修建吉萨大金字塔，高 146 米，是世界七大奇迹唯一存世者。',
        artifacts: ['吉萨金字塔群'],
        location: { lat: 30, lon: 31 } },
      { year: -1332, era: '新王国', title: '图坦卡蒙',
        description: '少年法老图坦卡蒙的陵墓于 1922 年被发现，黄金面具震撼世界。',
        artifacts: ['图坦卡蒙黄金面具'],
        location: { lat: 26, lon: 33 } },
      { year: -1279, era: '新王国', title: '拉美西斯二世',
        description: '拉美西斯二世在位 66 年，修建阿布辛贝神庙，是埃及最后一位伟大法老。' },
      { year: -332, era: '希腊化', title: '亚历山大征服',
        description: '亚历山大大帝征服埃及，建立亚历山大港，希腊化时代开启。' },
      { year: -30, era: '罗马', title: '克娄巴特拉',
        description: '末代法老克娄巴特拉七世自杀，埃及并入罗马帝国，法老时代终结。' }
    ]
  },
  {
    id: 'mali',
    name: '马里与西非帝国',
    nameEn: 'Mali & West African Empires',
    stamp: '马',
    continent: 'africa',
    startYear: 300,
    region: '西非 · 萨赫勒地带',
    overview: '加纳、马里、桑海——西非的黄金帝国通过撒哈拉贸易致富，廷巴克图的清真寺与大学是伊斯兰学术重镇。',
    timeline: [
      { year: 300, era: '加纳', title: '加纳帝国',
        description: '加纳帝国控制撒哈拉黄金与盐的贸易，被誉为「黄金之国」。',
        location: { lat: 15, lon: -8 } },
      { year: 1235, era: '马里', title: '松迪亚塔',
        description: '松迪亚塔建立马里帝国，其继承者曼萨·穆萨赴麦加朝觐，挥金如土震惊开罗。' },
      { year: 1325, era: '马里', title: '廷巴克图',
        description: '廷巴克图成为伊斯兰学术中心，桑科雷大学藏书数十万卷，吸引北非、中东学者。',
        artifacts: ['廷巴克图清真寺'],
        location: { lat: 17, lon: 0 } },
      { year: 1493, era: '桑海', title: '桑海帝国',
        description: '桑海帝国取代马里，统治西非两百年，达于鼎盛。' }
    ]
  },
  {
    id: 'ethiopia',
    name: '埃塞俄比亚文明',
    nameEn: 'Ethiopian Civilization',
    stamp: '塞',
    continent: 'africa',
    startYear: 100,
    region: '东非 · 埃塞俄比亚高原',
    overview: '非洲唯一未被殖民的古老基督教文明。阿克苏姆、拉利贝拉岩石教堂、所罗门王朝——埃塞俄比亚是非洲独特的文明孤岛。',
    timeline: [
      { year: 100, era: '阿克苏姆', title: '阿克苏姆王国',
        description: '阿克苏姆王国崛起于红海贸易，铸造非洲最早的货币，立巨型方尖碑。',
        location: { lat: 14, lon: 39 } },
      { year: 330, era: '阿克苏姆', title: '皈依基督教',
        description: '埃扎纳国王皈依基督教，埃塞俄比亚成为世界上最早的基督教国家之一。' },
      { year: 1200, era: '扎格维', title: '拉利贝拉',
        description: '拉利贝拉国王从整块岩石凿出十一座教堂，被誉为「非洲的耶路撒冷」。',
        artifacts: ['拉利贝拉岩石教堂'],
        location: { lat: 12, lon: 39 } },
      { year: 1270, era: '所罗门', title: '所罗门王朝',
        description: '自称所罗门王与示巴女王后裔的王朝建立，统治埃塞俄比亚直至 1974 年。' }
    ]
  },

  /* ============================================================
   * 美洲
   * ============================================================ */
  {
    id: 'maya',
    name: '玛雅文明',
    nameEn: 'Maya Civilization',
    stamp: '玛',
    continent: 'northAmerica',
    startYear: -1000,
    region: '中美洲 · 尤卡坦半岛与危地马拉',
    overview: '玛雅人发明独立于旧大陆的文字、数学（含零）、卓尔金历法，建造蒂卡尔、帕伦克、奇琴伊察等城邦，是中美洲最灿烂的古典文明。',
    timeline: [
      { year: -1000, era: '前古典', title: '前古典期',
        description: '玛雅人在尤卡坦与危地马拉高地建立早期村落，发展玉米农业。',
        location: { lat: 17, lon: -89 } },
      { year: 250, era: '古典', title: '古典期鼎盛',
        description: '蒂卡尔、帕伦克、科潘等城邦繁荣，玛雅文字、历法、天文学达到巅峰。',
        artifacts: ['蒂卡尔金字塔'],
        location: { lat: 17, lon: -89 } },
      { year: 615, era: '古典', title: '帕卡尔王',
        description: '帕伦克国王帕卡尔葬于铭文神庙，其玉石面具与石棺盖成为玛雅艺术杰作。' },
      { year: 900, era: '古典晚期', title: '古典期崩溃',
        description: '南部低地玛雅城邦相继衰落废弃，原因至今成谜（旱灾、战争、人口压力？）。' },
      { year: 987, era: '后古典', title: '奇琴伊察',
        description: '托尔特克影响的奇琴伊察崛起，库库尔坎金字塔的「蛇影奇观」延续至今。',
        artifacts: ['奇琴伊察金字塔'],
        location: { lat: 21, lon: -88 } }
    ]
  },
  {
    id: 'aztec',
    name: '阿兹特克文明',
    nameEn: 'Aztec Civilization',
    stamp: '阿',
    continent: 'northAmerica',
    startYear: 1325,
    region: '中美洲 · 墨西哥谷地',
    overview: '墨西哥谷地的军事帝国，以特诺奇蒂特兰（今墨西哥城）为都。金字塔、人祭、可可货币——阿兹特克是中美洲最后的霸主，1521 年毁于西班牙征服。',
    timeline: [
      { year: 1325, era: '建国', title: '特诺奇蒂特兰',
        description: '阿兹特克人于特斯科科湖中建立特诺奇蒂特兰，传说见「鹰啄蛇立仙人掌」处建城。',
        location: { lat: 19, lon: -99 } },
      { year: 1428, era: '同盟', title: '三国同盟',
        description: '特诺奇蒂特兰、特斯科科、特拉科潘结成同盟，建立阿兹特克帝国，称霸中美洲。' },
      { year: 1487, era: '帝国', title: '大神庙',
        description: '阿兹特克重建大神庙（Templo Mayor），祭祀雨神与战神，是帝国宗教中心。' },
      { year: 1519, era: '征服', title: '科尔特斯登陆',
        description: '西班牙征服者科尔特斯登陆墨西哥，利用原住民矛盾与天花，两年内摧毁阿兹特克帝国。' }
    ]
  },
  {
    id: 'inca',
    name: '印加帝国',
    nameEn: 'Inca Empire',
    stamp: '印',
    continent: 'southAmerica',
    startYear: 1438,
    region: '南美 · 安第斯山脉',
    overview: '前哥伦布时代美洲最大的帝国。从库斯科到马丘比丘，印加以结绳记事、梯田农业、精密道路网统治安第斯四千万臣民。',
    timeline: [
      { year: 1438, era: '建国', title: '帕查库蒂',
        description: '帕查库蒂击败昌卡人，开启印加扩张，建立塔万廷苏尤（印加帝国）。',
        location: { lat: -13, lon: -72 } },
      { year: 1450, era: '帝国', title: '马丘比丘',
        description: '帕查库蒂修建马丘比丘山顶行宫，印加石砌工艺登峰造极，至今无灰浆而屹立。',
        image: '/generated/inca_001.jpg',
        artifacts: ['马丘比丘'],
        location: { lat: -13, lon: -72 } },
      { year: 1493, era: '鼎盛', title: '瓦伊纳·卡帕克',
        description: '印加帝国达到鼎盛，疆域从哥伦比亚延伸至智利，统御安第斯四千万臣民。' },
      { year: 1532, era: '征服', title: '皮萨罗征服',
        description: '西班牙征服者皮萨罗俘虏印加皇帝阿塔瓦尔帕，勒索满屋黄金后将其处死，印加帝国灭亡。',
        location: { lat: -13, lon: -72 } }
    ]
  },
  {
    id: 'usa',
    name: '美国',
    nameEn: 'United States',
    stamp: '美',
    continent: 'northAmerica',
    startYear: 1607,
    region: '北美 · 大西洋沿岸至太平洋',
    overview: '从五月花号、独立战争、西部拓荒，到南北战争、工业崛起、二战霸权，美国是近代世界最具影响力的国家之一。',
    timeline: [
      { year: 1607, era: '殖民', title: '詹姆斯敦',
        description: '英国人在弗吉尼亚建立第一个永久殖民地詹姆斯敦，开启英属北美殖民史。',
        location: { lat: 37, lon: -77 } },
      { year: 1776, era: '独立', title: '独立宣言',
        description: '杰斐逊起草《独立宣言》，「人人生而平等」，美国独立战争开始。',
        location: { lat: 40, lon: -74 } },
      { year: 1787, era: '建国', title: '宪法',
        description: '费城制宪会议通过美国宪法，确立三权分立、联邦制，是世界上最早的成文宪法。' },
      { year: 1861, era: '内战', title: '南北战争',
        description: '林肯领导北方击败南方邦联，废除奴隶制，维护国家统一。',
        location: { lat: 39, lon: -77 } },
      { year: 1945, era: '二战后', title: '超级大国',
        description: '二战后美国成为超级大国，主导布雷顿森林体系、联合国、北约，开启冷战。' },
      { year: 1969, era: '太空', title: '阿波罗登月',
        description: '阿姆斯特朗踏上月球，「人类的一大步」，美国赢得太空竞赛。',
        location: { lat: 28, lon: -80 } }
    ]
  },

  /* ============================================================
   * 大洋洲
   * ============================================================ */
  {
    id: 'maori',
    name: '毛利文明',
    nameEn: 'Māori Civilization',
    stamp: '毛',
    continent: 'oceania',
    startYear: 1280,
    region: '大洋洲 · 新西兰（奥特亚罗瓦）',
    overview: '波利尼西亚航海者的最南端杰作。毛利人于 13 世纪抵达新西兰，发展出独特的部落社会、哈卡战舞、木雕艺术与口传史诗。',
    timeline: [
      { year: 1280, era: '迁徙', title: '登陆奥特亚罗瓦',
        description: '东波利尼西亚航海者循星象、洋流抵达新西兰，自称「毛利」，将这片土地命名为「奥特亚罗瓦」（长白云之乡）。',
        location: { lat: -41, lon: 174 } },
      { year: 1350, era: '古典', title: '部落社会',
        description: '毛利形成数十个 iwi（部落），以 marae（议事堂）为中心，发展木雕、绿石工艺、哈卡战舞。' },
      { year: 1642, era: '接触', title: '塔斯曼初见',
        description: '荷兰航海家塔斯曼首次抵达新西兰，与毛利人发生冲突，欧洲人称之为「杀人者之湾」。' },
      { year: 1840, era: '殖民', title: '怀唐伊条约',
        description: '英国与毛利酋长签订《怀唐伊条约》，新西兰成为英国殖民地，但条约解释至今仍有争议。',
        location: { lat: -35, lon: 174 } }
    ]
  },
  {
    id: 'polynesian',
    name: '波利尼西亚航海',
    nameEn: 'Polynesian Voyaging',
    stamp: '洋',
    continent: 'oceania',
    startYear: -1500,
    region: '太平洋 · 波利尼西亚大三角',
    overview: '人类最伟大的海洋史诗。凭借双体独木舟、星象导航，波利尼西亚人征服了地球三分之一的洋面，从夏威夷到复活节岛，从新西兰到塔希提。',
    timeline: [
      { year: -1500, era: '拉皮塔', title: '拉皮塔陶工',
        description: '拉皮塔文化从俾斯麦群岛向太平洋扩张，带印纹陶器与芋头、薯蓣、猪、鸡，奠定波利尼西亚文化基础。',
        artifacts: ['拉皮塔印纹陶器'],
        location: { lat: -4, lon: 152 } },
      { year: 300, era: '扩张', title: '发现夏威夷',
        description: '波利尼西亚航海者凭借星象、洋流、鸟踪，跨越数千公里发现并定居夏威夷。',
        location: { lat: 20, lon: -157 } },
      { year: 900, era: '扩张', title: '复活节岛',
        description: '波利尼西亚人抵达世界最孤立的有人岛——拉帕努伊（复活节岛），雕凿巨型摩艾石像。',
        artifacts: ['复活节岛摩艾石像'],
        location: { lat: -27, lon: -109 } },
      { year: 1976, era: '复兴', title: 'Hōkūleʻa',
        description: '夏威夷人重建传统航海独木舟 Hōkūleʻa，无现代仪器航行至塔希提，复兴波利尼西亚航海传统。' }
    ]
  }
];

/** 按大陆筛选文明 */
export function getCountriesByContinent(continent: ContinentId): CountryHistory[] {
  return COUNTRIES.filter((c) => c.continent === continent).sort((a, b) => a.startYear - b.startYear);
}

/** 根据 ID 获取文明 */
export function getCountry(id: string): CountryHistory | undefined {
  return COUNTRIES.find((c) => c.id === id);
}
