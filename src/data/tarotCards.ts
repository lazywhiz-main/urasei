export interface TarotCard {
  id: number;
  name: string;
  meaning: string;
  reversedMeaning: string;
  description: string;
  keywords: string[];
  element?: string;
}

export const majorArcana: TarotCard[] = [
  {
    id: 0,
    name: "愚者",
    meaning: "新しい始まり、自由、冒険",
    reversedMeaning: "軽率、無謀、優柔不断",
    description: "純粋な心で新たな旅路に踏み出す時。直感を信じて行動することで、思わぬ幸運が舞い込むでしょう。",
    keywords: ["新出発", "純粋", "自由", "冒険"],
    element: "風"
  },
  {
    id: 1,
    name: "魔術師",
    meaning: "創造力、意志力、技術",
    reversedMeaning: "悪用、詐欺、未熟",
    description: "あなたの持つ才能と意志の力で、望む現実を創造できる時。集中力を高めて目標に向かいましょう。",
    keywords: ["創造", "意志", "技術", "集中"],
    element: "火"
  },
  {
    id: 2,
    name: "女教皇",
    meaning: "直感、神秘、内なる知恵",
    reversedMeaning: "秘密、隠蔽、直感の欠如",
    description: "内なる声に耳を傾ける時。表面的な情報よりも、心の奥底からの直感を大切にしてください。",
    keywords: ["直感", "神秘", "内面", "知恵"],
    element: "水"
  },
  {
    id: 3,
    name: "女帝",
    meaning: "豊穣、母性、創造性",
    reversedMeaning: "依存、過保護、創造性の欠如",
    description: "愛と豊かさに満ちた時期。創造的なエネルギーが高まり、新しいものを生み出す力に恵まれます。",
    keywords: ["豊穣", "母性", "創造", "愛"],
    element: "地"
  },
  {
    id: 4,
    name: "皇帝",
    meaning: "権威、安定、統率力",
    reversedMeaning: "独裁、頑固、権力の乱用",
    description: "強いリーダーシップと責任感で物事を進める時。計画性と実行力で確実な成果を得られるでしょう。",
    keywords: ["権威", "安定", "統率", "責任"],
    element: "火"
  },
  {
    id: 5,
    name: "教皇",
    meaning: "伝統、教育、精神的指導",
    reversedMeaning: "独断、偏見、伝統への反発",
    description: "師や先輩からの教えを受け入れる時。伝統的な知恵や価値観から学ぶことで成長できます。",
    keywords: ["伝統", "教育", "指導", "学び"],
    element: "地"
  },
  {
    id: 6,
    name: "恋人",
    meaning: "愛、選択、調和",
    reversedMeaning: "不調和、誘惑、間違った選択",
    description: "重要な選択を迫られる時。心の声に従い、愛と調和を基準に決断することで幸せな結果を得られます。",
    keywords: ["愛", "選択", "調和", "結合"],
    element: "風"
  },
  {
    id: 7,
    name: "戦車",
    meaning: "勝利、意志力、前進",
    reversedMeaning: "敗北、自制心の欠如、方向性の迷い",
    description: "強い意志力で困難を乗り越える時。目標に向かって一直線に進むことで勝利を掴めるでしょう。",
    keywords: ["勝利", "意志", "前進", "克服"],
    element: "水"
  },
  {
    id: 8,
    name: "力",
    meaning: "内なる力、勇気、忍耐",
    reversedMeaning: "弱さ、自信の欠如、暴力",
    description: "優しさと強さを兼ね備えた真の力を発揮する時。忍耐と愛情で困難な状況を制御できます。",
    keywords: ["内なる力", "勇気", "忍耐", "制御"],
    element: "火"
  },
  {
    id: 9,
    name: "隠者",
    meaning: "内省、探求、導き",
    reversedMeaning: "孤立、頑固、内向的すぎる",
    description: "一人の時間を大切にし、内面と向き合う時。自分自身の真実を見つけることで新たな道が開けます。",
    keywords: ["内省", "探求", "導き", "真実"],
    element: "地"
  },
  {
    id: 10,
    name: "運命の輪",
    meaning: "運命、変化、チャンス",
    reversedMeaning: "不運、停滞、チャンスの逃失",
    description: "人生の転換点が訪れる時。運命の流れに身を任せ、変化を受け入れることで新たな可能性が開けます。",
    keywords: ["運命", "変化", "チャンス", "転換"],
    element: "火"
  },
  {
    id: 11,
    name: "正義",
    meaning: "公正、バランス、真実",
    reversedMeaning: "不公正、偏見、バランスの欠如",
    description: "公正な判断と正しい行いが求められる時。真実を見極め、バランスの取れた決断を下しましょう。",
    keywords: ["公正", "バランス", "真実", "判断"],
    element: "風"
  },
  {
    id: 12,
    name: "吊られた男",
    meaning: "犠牲、忍耐、新しい視点",
    reversedMeaning: "無駄な犠牲、頑固、視野の狭さ",
    description: "一時的な停滞や犠牲が必要な時。異なる視点から物事を見ることで、新たな理解が得られます。",
    keywords: ["犠牲", "忍耐", "視点", "理解"],
    element: "水"
  },
  {
    id: 13,
    name: "死神",
    meaning: "変容、終了、再生",
    reversedMeaning: "停滞、変化への抵抗、執着",
    description: "古いものが終わり、新しいものが始まる時。変化を恐れず、変容のプロセスを受け入れましょう。",
    keywords: ["変容", "終了", "再生", "変化"],
    element: "水"
  },
  {
    id: 14,
    name: "節制",
    meaning: "調和、バランス、癒し",
    reversedMeaning: "不調和、極端、バランスの欠如",
    description: "心と体、物質と精神のバランスを取る時。穏やかな調和の中で癒しと成長が訪れます。",
    keywords: ["調和", "バランス", "癒し", "統合"],
    element: "火"
  },
  {
    id: 15,
    name: "悪魔",
    meaning: "束縛、誘惑、物質主義",
    reversedMeaning: "解放、自由、束縛からの脱却",
    description: "自分を縛っているものに気づく時。恐れや欲望に支配されず、真の自由を取り戻しましょう。",
    keywords: ["束縛", "誘惑", "解放", "自由"],
    element: "地"
  },
  {
    id: 16,
    name: "塔",
    meaning: "破壊、啓示、突然の変化",
    reversedMeaning: "災難の回避、内的変化、抵抗",
    description: "突然の変化や衝撃的な出来事が起こる時。古い構造が崩れることで、新しい可能性が生まれます。",
    keywords: ["破壊", "啓示", "変化", "解放"],
    element: "火"
  },
  {
    id: 17,
    name: "星",
    meaning: "希望、インスピレーション、癒し",
    reversedMeaning: "絶望、失望、希望の欠如",
    description: "希望の光が差し込む時。直感とインスピレーションに従うことで、理想の未来へと導かれます。",
    keywords: ["希望", "インスピレーション", "癒し", "導き"],
    element: "風"
  },
  {
    id: 18,
    name: "月",
    meaning: "幻想、不安、潜在意識",
    reversedMeaning: "真実の発見、不安の解消、明確化",
    description: "曖昧さや不安に包まれる時。表面的な情報に惑わされず、深層心理からのメッセージを受け取りましょう。",
    keywords: ["幻想", "不安", "潜在意識", "直感"],
    element: "水"
  },
  {
    id: 19,
    name: "太陽",
    meaning: "成功、喜び、活力",
    reversedMeaning: "失敗、悲しみ、エネルギー不足",
    description: "明るい未来と成功が約束される時。ポジティブなエネルギーに満ち、すべてが順調に進むでしょう。",
    keywords: ["成功", "喜び", "活力", "達成"],
    element: "火"
  },
  {
    id: 20,
    name: "審判",
    meaning: "復活、再生、新たな始まり",
    reversedMeaning: "後悔、自己批判、過去への執着",
    description: "過去を清算し、新しい人生を始める時。内なる声の呼びかけに応え、真の自分として生まれ変わりましょう。",
    keywords: ["復活", "再生", "始まり", "覚醒"],
    element: "火"
  },
  {
    id: 21,
    name: "世界",
    meaning: "完成、達成、統合",
    reversedMeaning: "未完成、停滞、目標の未達成",
    description: "長い旅路の完成と大きな達成の時。すべてが調和し、理想的な状態に到達できるでしょう。",
    keywords: ["完成", "達成", "統合", "調和"],
    element: "地"
  }
];

// ランダムにカードを引く関数
export const drawRandomCard = (): { card: TarotCard; isReversed: boolean } => {
  const randomIndex = Math.floor(Math.random() * majorArcana.length);
  const isReversed = Math.random() < 0.5; // 50%の確率で逆位置
  
  return {
    card: majorArcana[randomIndex],
    isReversed
  };
};

// 今日の占い結果を生成する関数
export const generateDailyReading = (card: TarotCard, isReversed: boolean): string => {
  const meaning = isReversed ? card.reversedMeaning : card.meaning;
  const position = isReversed ? "逆位置" : "正位置";
  
  return `今日のあなたに現れたのは「${card.name}」の${position}です。

${card.description}

キーワード: ${card.keywords.join("、")}

今日は${meaning}のエネルギーが強く働きます。このカードからのメッセージを心に留めて、素晴らしい一日をお過ごしください。`;
}; 