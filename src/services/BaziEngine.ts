// src/services/BaziEngine.ts
// 四柱推命（BaZi / Four Pillars of Destiny）計算エンジン

// 十干（天干）
export const TEN_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const;

// 十二支（地支）
export const TWELVE_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const;

// 五行
export const FIVE_ELEMENTS = ['木', '火', '土', '金', '水'] as const;

// 十干の五行と陰陽
export const STEM_ELEMENTS: Record<string, { element: string; polarity: 'yang' | 'yin' }> = {
  '甲': { element: '木', polarity: 'yang' },
  '乙': { element: '木', polarity: 'yin' },
  '丙': { element: '火', polarity: 'yang' },
  '丁': { element: '火', polarity: 'yin' },
  '戊': { element: '土', polarity: 'yang' },
  '己': { element: '土', polarity: 'yin' },
  '庚': { element: '金', polarity: 'yang' },
  '辛': { element: '金', polarity: 'yin' },
  '壬': { element: '水', polarity: 'yang' },
  '癸': { element: '水', polarity: 'yin' },
};

// 十二支の五行
export const BRANCH_ELEMENTS: Record<string, string> = {
  '子': '水', '丑': '土', '寅': '木', '卯': '木',
  '辰': '土', '巳': '火', '午': '火', '未': '土',
  '申': '金', '酉': '金', '戌': '土', '亥': '水',
};

// 五行相生相克
export const ELEMENT_RELATIONS = {
  generating: {
    '木': '火',
    '火': '土',
    '土': '金',
    '金': '水',
    '水': '木',
  },
  controlling: {
    '木': '土',
    '土': '水',
    '水': '火',
    '火': '金',
    '金': '木',
  },
};

// 節気データ（立春を年の始まりとする）
export const SOLAR_TERMS = [
  { name: '立春', month: 2, day: 4 },
  { name: '雨水', month: 2, day: 19 },
  { name: '啓蟄', month: 3, day: 6 },
  { name: '春分', month: 3, day: 21 },
  { name: '清明', month: 4, day: 5 },
  { name: '穀雨', month: 4, day: 20 },
  { name: '立夏', month: 5, day: 6 },
  { name: '小満', month: 5, day: 21 },
  { name: '芒種', month: 6, day: 6 },
  { name: '夏至', month: 6, day: 21 },
  { name: '小暑', month: 7, day: 7 },
  { name: '大暑', month: 7, day: 23 },
  { name: '立秋', month: 8, day: 8 },
  { name: '処暑', month: 8, day: 23 },
  { name: '白露', month: 9, day: 8 },
  { name: '秋分', month: 9, day: 23 },
  { name: '寒露', month: 10, day: 8 },
  { name: '霜降', month: 10, day: 23 },
  { name: '立冬', month: 11, day: 7 },
  { name: '小雪', month: 11, day: 22 },
  { name: '大雪', month: 12, day: 7 },
  { name: '冬至', month: 12, day: 21 },
  { name: '小寒', month: 1, day: 6 },
  { name: '大寒', month: 1, day: 20 },
];

export interface BaziPillar {
  stem: string;
  branch: string;
  element: string;
  polarity: 'yang' | 'yin';
  stemElement: string;
  branchElement: string;
}

export interface BaziChart {
  year: BaziPillar;
  month: BaziPillar;
  day: BaziPillar;
  hour: BaziPillar;
  dayMaster: string;
  dayMasterElement: string;
  dayMasterPolarity: 'yang' | 'yin';
  elements: Record<string, number>;
  strength: Record<string, number>;
  usefulGod: string;
  avoidGod: string;
  luckyElements: string[];
  unluckyElements: string[];
}

export interface BaziReading {
  chart: BaziChart;
  personality: string;
  career: string;
  relationships: string;
  health: string;
  wealth: string;
  overall: string;
  advice: string;
  luckyColors: string[];
  luckyNumbers: number[];
  luckyDirections: string[];
}

export class BaziEngine {
  // 年柱計算（立春基準）
  static calculateYearPillar(date: Date): BaziPillar {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // 立春前は前年扱い
    let baziYear = year;
    if (month < 2 || (month === 2 && day < 4)) {
      baziYear = year - 1;
    }
    
    // 年干支計算（1984年甲子を基準）
    const baseYear = 1984; // 甲子年
    const yearOffset = (baziYear - baseYear) % 60;
    let stemIndex = yearOffset % 10;
    let branchIndex = yearOffset % 12;
    
    if (stemIndex < 0) stemIndex += 10;
    if (branchIndex < 0) branchIndex += 12;
    
    const stem = TEN_STEMS[stemIndex];
    const branch = TWELVE_BRANCHES[branchIndex];
    
    return this.createPillar(stem, branch);
  }

  // 月柱計算（節気基準）
  static calculateMonthPillar(date: Date, yearStem: string): BaziPillar {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // 節気による月の決定
    let baziMonth = month;
    const monthTerms = SOLAR_TERMS.filter(term => term.month === month);
    
    if (monthTerms.length > 0 && day < monthTerms[0].day) {
      baziMonth = month === 1 ? 12 : month - 1;
    }
    
    // 月干計算（年干によって決まる）
    const yearStemIndex = TEN_STEMS.indexOf(yearStem);
    const monthStemTable = [
      [2, 4, 6, 8, 0, 2, 4, 6, 8, 0, 2, 4], // 甲年・己年
      [4, 6, 8, 0, 2, 4, 6, 8, 0, 2, 4, 6], // 乙年・庚年
      [6, 8, 0, 2, 4, 6, 8, 0, 2, 4, 6, 8], // 丙年・辛年
      [8, 0, 2, 4, 6, 8, 0, 2, 4, 6, 8, 0], // 丁年・壬年
      [0, 2, 4, 6, 8, 0, 2, 4, 6, 8, 0, 2], // 戊年・癸年
    ];
    
    const tableIndex = yearStemIndex >= 5 ? yearStemIndex - 5 : yearStemIndex;
    const monthIndex = baziMonth === 12 ? 11 : baziMonth - 1;
    const stemIndex = monthStemTable[tableIndex][monthIndex];
    
    const stem = TEN_STEMS[stemIndex];
    const branch = TWELVE_BRANCHES[(baziMonth + 1) % 12]; // 寅月から始まる
    
    return this.createPillar(stem, branch);
  }

  // 日柱計算
  static calculateDayPillar(date: Date): BaziPillar {
    // 1900年1月1日を甲子日として計算
    const baseDate = new Date(1900, 0, 1);
    const daysDiff = Math.floor((date.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
    
    let stemIndex = daysDiff % 10;
    let branchIndex = daysDiff % 12;
    
    if (stemIndex < 0) stemIndex += 10;
    if (branchIndex < 0) branchIndex += 12;
    
    const stem = TEN_STEMS[stemIndex];
    const branch = TWELVE_BRANCHES[branchIndex];
    
    return this.createPillar(stem, branch);
  }

  // 時柱計算
  static calculateHourPillar(hour: number, dayStem: string): BaziPillar {
    // 時支決定（23-1時: 子時, 1-3時: 丑時, ...）
    const branchIndex = Math.floor((hour + 1) / 2) % 12;
    const branch = TWELVE_BRANCHES[branchIndex];
    
    // 時干計算（日干によって決まる）
    const dayStemIndex = TEN_STEMS.indexOf(dayStem);
    const hourStemTable = [
      [0, 2, 4, 6, 8, 0, 2, 4, 6, 8, 0, 2], // 甲日・己日
      [2, 4, 6, 8, 0, 2, 4, 6, 8, 0, 2, 4], // 乙日・庚日
      [4, 6, 8, 0, 2, 4, 6, 8, 0, 2, 4, 6], // 丙日・辛日
      [6, 8, 0, 2, 4, 6, 8, 0, 2, 4, 6, 8], // 丁日・壬日
      [8, 0, 2, 4, 6, 8, 0, 2, 4, 6, 8, 0], // 戊日・癸日
    ];
    
    const tableIndex = dayStemIndex >= 5 ? dayStemIndex - 5 : dayStemIndex;
    const stemIndex = hourStemTable[tableIndex][branchIndex];
    const stem = TEN_STEMS[stemIndex];
    
    return this.createPillar(stem, branch);
  }

  // 柱の作成
  static createPillar(stem: typeof TEN_STEMS[number], branch: typeof TWELVE_BRANCHES[number]): BaziPillar {
    const stemInfo = STEM_ELEMENTS[stem];
    const branchElement = BRANCH_ELEMENTS[branch];
    
    return {
      stem,
      branch,
      element: stemInfo.element,
      polarity: stemInfo.polarity,
      stemElement: stemInfo.element,
      branchElement,
    };
  }

  // 五行分析
  static analyzeElements(pillars: BaziPillar[]): Record<string, number> {
    const elements: Record<string, number> = {
      '木': 0, '火': 0, '土': 0, '金': 0, '水': 0
    };
    
    pillars.forEach(pillar => {
      elements[pillar.stemElement] += 1;
      elements[pillar.branchElement] += 0.5; // 地支は半分の重み
    });
    
    return elements;
  }

  // 強弱分析
  static analyzeStrength(dayMaster: string, elements: Record<string, number>): Record<string, number> {
    const dayElement = STEM_ELEMENTS[dayMaster].element;
    const strength: Record<string, number> = { ...elements };
    
    // 日主と同じ五行は自身の力
    const selfStrength = elements[dayElement];
    
    // 生じる五行（印星）は自身を助ける
    const supportElement = Object.keys(ELEMENT_RELATIONS.generating).find(
      key => ELEMENT_RELATIONS.generating[key as keyof typeof ELEMENT_RELATIONS.generating] === dayElement
    );
    const supportStrength = supportElement ? elements[supportElement] : 0;
    
    // 剋される五行（官星）は自身を消耗させる
    const controlElement = ELEMENT_RELATIONS.controlling[dayElement as keyof typeof ELEMENT_RELATIONS.controlling];
    const controlStrength = controlElement ? elements[controlElement] : 0;
    
    strength['self'] = selfStrength + supportStrength * 0.5;
    strength['control'] = controlStrength;
    
    return strength;
  }

  // 用神決定
  static determineUsefulGod(dayMaster: string, elements: Record<string, number>): { useful: string; avoid: string } {
    const dayElement = STEM_ELEMENTS[dayMaster].element;
    const strength = this.analyzeStrength(dayMaster, elements);
    
    // 強弱判定
    const isStrong = (strength['self'] || 0) > 2.5;
    
    if (isStrong) {
      // 強い場合は消耗させる五行が用神
      const drainElement = ELEMENT_RELATIONS.generating[dayElement as keyof typeof ELEMENT_RELATIONS.generating];
      const controlElement = ELEMENT_RELATIONS.controlling[dayElement as keyof typeof ELEMENT_RELATIONS.controlling];
      
      return {
        useful: drainElement || controlElement,
        avoid: dayElement
      };
    } else {
      // 弱い場合は助ける五行が用神
      const supportElement = Object.keys(ELEMENT_RELATIONS.generating).find(
        key => ELEMENT_RELATIONS.generating[key as keyof typeof ELEMENT_RELATIONS.generating] === dayElement
      );
      
      return {
        useful: supportElement || dayElement,
        avoid: ELEMENT_RELATIONS.controlling[dayElement as keyof typeof ELEMENT_RELATIONS.controlling]
      };
    }
  }

  // 完全な四柱推命チャート計算
  static calculateBaziChart(birthDate: Date, birthHour: number): BaziChart {
    const yearPillar = this.calculateYearPillar(birthDate);
    const monthPillar = this.calculateMonthPillar(birthDate, yearPillar.stem);
    const dayPillar = this.calculateDayPillar(birthDate);
    const hourPillar = this.calculateHourPillar(birthHour, dayPillar.stem);
    
    const pillars = [yearPillar, monthPillar, dayPillar, hourPillar];
    const elements = this.analyzeElements(pillars);
    const strength = this.analyzeStrength(dayPillar.stem, elements);
    const { useful, avoid } = this.determineUsefulGod(dayPillar.stem, elements);
    
    // 吉凶五行決定
    const luckyElements = [useful];
    const unluckyElements = [avoid];
    
    // 相生関係も考慮
    const usefulGenerating = Object.keys(ELEMENT_RELATIONS.generating).find(
      key => ELEMENT_RELATIONS.generating[key as keyof typeof ELEMENT_RELATIONS.generating] === useful
    );
    if (usefulGenerating) luckyElements.push(usefulGenerating);
    
    return {
      year: yearPillar,
      month: monthPillar,
      day: dayPillar,
      hour: hourPillar,
      dayMaster: dayPillar.stem,
      dayMasterElement: STEM_ELEMENTS[dayPillar.stem].element,
      dayMasterPolarity: STEM_ELEMENTS[dayPillar.stem].polarity,
      elements,
      strength,
      usefulGod: useful,
      avoidGod: avoid,
      luckyElements,
      unluckyElements,
    };
  }

  // 運勢解釈生成
  static generateBaziReading(chart: BaziChart): BaziReading {
    const personality = this.generatePersonalityReading(chart);
    const career = this.generateCareerReading(chart);
    const relationships = this.generateRelationshipReading(chart);
    const health = this.generateHealthReading(chart);
    const wealth = this.generateWealthReading(chart);
    const overall = this.generateOverallReading(chart);
    const advice = this.generateAdvice(chart);
    
    return {
      chart,
      personality,
      career,
      relationships,
      health,
      wealth,
      overall,
      advice,
      luckyColors: this.getLuckyColors(chart.usefulGod),
      luckyNumbers: this.getLuckyNumbers(chart.usefulGod),
      luckyDirections: this.getLuckyDirections(chart.usefulGod),
    };
  }

  // 各種解釈生成メソッド
  static generatePersonalityReading(chart: BaziChart): string {
    const element = chart.dayMasterElement;
    const polarity = chart.dayMasterPolarity;
    
    const personalities = {
      '木': polarity === 'yang' ? '積極的で向上心があり、リーダーシップを発揮します。創造性豊かで新しいことに挑戦することを好みます。' 
                                 : '柔軟性があり、協調性に優れています。芸術的センスがあり、美しいものを愛します。',
      '火': polarity === 'yang' ? '情熱的で行動力があり、明るく社交的な性格です。感情表現が豊かで、人を惹きつける魅力があります。'
                                 : '思慮深く、洞察力に優れています。知性的で、物事の本質を見抜く力があります。',
      '土': polarity === 'yang' ? '安定感があり、責任感が強い性格です。忍耐強く、最後まで物事をやり遂げる力があります。'
                                 : '慎重で思いやりがあり、人を支える力があります。家庭的で、安心できる環境を作ることが得意です。',
      '金': polarity === 'yang' ? '意志が強く、正義感に溢れています。決断力があり、困難な状況でも立ち向かう勇気があります。'
                                 : '繊細で品があり、美的感覚に優れています。細かい作業や技術的なことに才能があります。',
      '水': polarity === 'yang' ? '流動性があり、適応力に優れています。知恵があり、状況に応じて柔軟に対応できます。'
                                 : '深い思考力があり、直感力に優れています。神秘的なものに興味があり、精神性を重視します。',
    };
    
    return personalities[element as keyof typeof personalities] || '独特な個性を持っています。';
  }

  static generateCareerReading(chart: BaziChart): string {
    const useful = chart.usefulGod;
    
    const careers = {
      '木': '教育、出版、環境関連、林業、建築設計などの分野で才能を発揮します。',
      '火': 'エンターテインメント、広告、IT、電気関連、料理などの分野が適しています。',
      '土': '不動産、農業、建設、医療、保険などの安定した分野で成功します。',
      '金': '金融、製造業、機械、宝飾、法律などの分野で力を発揮します。',
      '水': '物流、貿易、水産業、清掃業、学術研究などの分野が向いています。',
    };
    
    return careers[useful as keyof typeof careers] || '多方面で活躍できる可能性があります。';
  }

  static generateRelationshipReading(chart: BaziChart): string {
    const dayElement = chart.dayMasterElement;
    const polarity = chart.dayMasterPolarity;
    
    if (polarity === 'yang') {
      return '積極的にアプローチする傾向があります。パートナーには理解力と包容力を求めます。';
    } else {
      return '慎重に関係を築く傾向があります。深い絆と精神的な繋がりを重視します。';
    }
  }

  static generateHealthReading(chart: BaziChart): string {
    const avoid = chart.avoidGod;
    
    const health = {
      '木': '肝臓や筋肉系に注意が必要です。ストレスを溜めないよう心がけましょう。',
      '火': '心臓や循環器系、目に注意が必要です。興奮しすぎないよう注意しましょう。',
      '土': '消化器系や筋肉に注意が必要です。食生活を規則正しくしましょう。',
      '金': '呼吸器系や皮膚に注意が必要です。乾燥対策を心がけましょう。',
      '水': '腎臓や生殖器系、骨に注意が必要です。冷えすぎないよう注意しましょう。',
    };
    
    return health[avoid as keyof typeof health] || '全体的に健康に恵まれています。';
  }

  static generateWealthReading(chart: BaziChart): string {
    const useful = chart.usefulGod;
    const strength = chart.strength['self'] || 0;
    
    if (strength > 2.5) {
      return '財運は安定しています。計画的な投資や貯蓄で資産を築くことができます。';
    } else {
      return '努力によって財運を開くことができます。協力者の助けも期待できます。';
    }
  }

  static generateOverallReading(chart: BaziChart): string {
    const balance = Object.values(chart.elements).reduce((sum, val) => sum + val, 0) / 5;
    
    if (balance > 2) {
      return '五行のバランスが比較的良く、安定した人生を歩むことができます。';
    } else {
      return '特定の分野で突出した才能を発揮する可能性があります。';
    }
  }

  static generateAdvice(chart: BaziChart): string {
    const useful = chart.usefulGod;
    
    return `用神である${useful}の五行を意識した生活を心がけることで、運気を向上させることができます。色彩、方角、食べ物などで${useful}の要素を取り入れましょう。`;
  }

  // ラッキーアイテム生成
  static getLuckyColors(element: string): string[] {
    const colors = {
      '木': ['緑', '青緑', '青'],
      '火': ['赤', 'ピンク', 'オレンジ'],
      '土': ['黄色', 'ベージュ', '茶色'],
      '金': ['白', 'シルバー', 'ゴールド'],
      '水': ['黒', '紺', '濃紫'],
    };
    
    return colors[element as keyof typeof colors] || ['白'];
  }

  static getLuckyNumbers(element: string): number[] {
    const numbers = {
      '木': [3, 4, 8],
      '火': [2, 7, 9],
      '土': [5, 6, 0],
      '金': [4, 9, 1],
      '水': [1, 6, 7],
    };
    
    return numbers[element as keyof typeof numbers] || [8];
  }

  static getLuckyDirections(element: string): string[] {
    const directions = {
      '木': ['東', '東南'],
      '火': ['南'],
      '土': ['中央', '南西', '北東'],
      '金': ['西', '北西'],
      '水': ['北'],
    };
    
    return directions[element as keyof typeof directions] || ['東'];
  }
} 