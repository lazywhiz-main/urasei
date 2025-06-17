import { ZodiacSign, ZodiacMaster, FortuneTemplate } from '../types/astrology';

// 星座マスターデータ
export const ZODIAC_MASTERS: Record<ZodiacSign, ZodiacMaster> = {
  aries: {
    sign: 'aries',
    name: 'おひつじ座',
    symbol: '♈',
    period: '3/21-4/19',
    element: 'fire',
    characteristic: '情熱的で行動力があり、リーダーシップを発揮します',
    strongPoints: ['積極性', '勇気', 'エネルギッシュ', '正直'],
    compatibility: {
      best: ['leo', 'sagittarius'],
      good: ['gemini', 'aquarius'],
      normal: ['aries', 'taurus', 'cancer', 'virgo', 'scorpio', 'capricorn'],
      challenging: ['libra', 'pisces']
    }
  },
  taurus: {
    sign: 'taurus',
    name: 'おうし座',
    symbol: '♉',
    period: '4/20-5/20',
    element: 'earth',
    characteristic: '安定感があり、美しいものを愛する芸術的な感性を持ちます',
    strongPoints: ['安定性', '忍耐力', '芸術的センス', '誠実'],
    compatibility: {
      best: ['virgo', 'capricorn'],
      good: ['cancer', 'pisces'],
      normal: ['taurus', 'gemini', 'leo', 'libra', 'sagittarius', 'aquarius'],
      challenging: ['aries', 'scorpio']
    }
  },
  gemini: {
    sign: 'gemini',
    name: 'ふたご座',
    symbol: '♊',
    period: '5/21-6/21',
    element: 'air',
    characteristic: '好奇心旺盛で知的、コミュニケーション能力に長けています',
    strongPoints: ['知性', 'コミュニケーション力', '適応力', '機転'],
    compatibility: {
      best: ['libra', 'aquarius'],
      good: ['aries', 'leo'],
      normal: ['taurus', 'gemini', 'cancer', 'virgo', 'scorpio', 'capricorn'],
      challenging: ['sagittarius', 'pisces']
    }
  },
  cancer: {
    sign: 'cancer',
    name: 'かに座',
    symbol: '♋',
    period: '6/22-7/22',
    element: 'water',
    characteristic: '優しく共感力が高く、家族や仲間を大切にします',
    strongPoints: ['優しさ', '共感力', '家族愛', '直感力'],
    compatibility: {
      best: ['scorpio', 'pisces'],
      good: ['taurus', 'virgo'],
      normal: ['aries', 'gemini', 'cancer', 'leo', 'libra', 'sagittarius'],
      challenging: ['capricorn', 'aquarius']
    }
  },
  leo: {
    sign: 'leo',
    name: 'しし座',
    symbol: '♌',
    period: '7/23-8/22',
    element: 'fire',
    characteristic: '堂々とした存在感があり、創造力と表現力に富んでいます',
    strongPoints: ['自信', '創造力', '表現力', '寛大さ'],
    compatibility: {
      best: ['aries', 'sagittarius'],
      good: ['gemini', 'libra'],
      normal: ['taurus', 'cancer', 'leo', 'virgo', 'scorpio', 'capricorn'],
      challenging: ['aquarius', 'pisces']
    }
  },
  virgo: {
    sign: 'virgo',
    name: 'おとめ座',
    symbol: '♍',
    period: '8/23-9/22',
    element: 'earth',
    characteristic: '完璧主義で分析力があり、細やかな気配りができます',
    strongPoints: ['完璧主義', '分析力', '気配り', '実用性'],
    compatibility: {
      best: ['taurus', 'capricorn'],
      good: ['cancer', 'scorpio'],
      normal: ['aries', 'gemini', 'leo', 'virgo', 'sagittarius', 'aquarius'],
      challenging: ['libra', 'pisces']
    }
  },
  libra: {
    sign: 'libra',
    name: 'てんびん座',
    symbol: '♎',
    period: '9/23-10/23',
    element: 'air',
    characteristic: 'バランス感覚に優れ、調和と美を重視します',
    strongPoints: ['バランス感覚', '協調性', '美的センス', '公平性'],
    compatibility: {
      best: ['gemini', 'aquarius'],
      good: ['leo', 'sagittarius'],
      normal: ['taurus', 'cancer', 'virgo', 'libra', 'scorpio', 'capricorn'],
      challenging: ['aries', 'pisces']
    }
  },
  scorpio: {
    sign: 'scorpio',
    name: 'さそり座',
    symbol: '♏',
    period: '10/24-11/22',
    element: 'water',
    characteristic: '深い洞察力と集中力があり、神秘的な魅力を持ちます',
    strongPoints: ['洞察力', '集中力', '情熱', '神秘性'],
    compatibility: {
      best: ['cancer', 'pisces'],
      good: ['virgo', 'capricorn'],
      normal: ['aries', 'gemini', 'leo', 'libra', 'scorpio', 'sagittarius'],
      challenging: ['taurus', 'aquarius']
    }
  },
  sagittarius: {
    sign: 'sagittarius',
    name: 'いて座',
    symbol: '♐',
    period: '11/23-12/21',
    element: 'fire',
    characteristic: '自由を愛し、冒険心があり、哲学的な思考を持ちます',
    strongPoints: ['自由さ', '冒険心', '楽観性', '哲学的思考'],
    compatibility: {
      best: ['aries', 'leo'],
      good: ['libra', 'aquarius'],
      normal: ['taurus', 'cancer', 'virgo', 'scorpio', 'sagittarius', 'capricorn'],
      challenging: ['gemini', 'pisces']
    }
  },
  capricorn: {
    sign: 'capricorn',
    name: 'やぎ座',
    symbol: '♑',
    period: '12/22-1/19',
    element: 'earth',
    characteristic: '責任感が強く、目標に向かって着実に努力を重ねます',
    strongPoints: ['責任感', '努力家', '現実的', '忍耐力'],
    compatibility: {
      best: ['taurus', 'virgo'],
      good: ['scorpio', 'pisces'],
      normal: ['aries', 'gemini', 'leo', 'libra', 'sagittarius', 'capricorn'],
      challenging: ['cancer', 'aquarius']
    }
  },
  aquarius: {
    sign: 'aquarius',
    name: 'みずがめ座',
    symbol: '♒',
    period: '1/20-2/18',
    element: 'air',
    characteristic: '独創性があり、未来志向で人道的な精神を持ちます',
    strongPoints: ['独創性', '未来志向', '人道的', '自由な発想'],
    compatibility: {
      best: ['gemini', 'libra'],
      good: ['aries', 'sagittarius'],
      normal: ['taurus', 'cancer', 'virgo', 'scorpio', 'capricorn', 'aquarius'],
      challenging: ['leo', 'pisces']
    }
  },
  pisces: {
    sign: 'pisces',
    name: 'うお座',
    symbol: '♓',
    period: '2/19-3/20',
    element: 'water',
    characteristic: '感受性豊かで直感力があり、芸術的な才能を持ちます',
    strongPoints: ['感受性', '直感力', '芸術性', '共感力'],
    compatibility: {
      best: ['cancer', 'scorpio'],
      good: ['taurus', 'capricorn'],
      normal: ['gemini', 'leo', 'virgo', 'libra', 'sagittarius', 'pisces'],
      challenging: ['aries', 'aquarius']
    }
  }
};

// 運勢メッセージテンプレート
export const FORTUNE_TEMPLATES: Record<ZodiacSign, FortuneTemplate> = {
  aries: {
    zodiacSign: 'aries',
    overallMessages: [
      '今日は新しいチャレンジに最適な日です。積極的に行動しましょう。',
      'エネルギーに満ち溢れた一日。リーダーシップを発揮する場面がありそう。',
      '直感を信じて行動すると良い結果が得られるでしょう。',
      '周りの人への思いやりを忘れずに、情熱的に取り組みましょう。'
    ],
    loveMessages: [
      '積極的なアプローチが功を奏しそう。素直な気持ちを伝えて。',
      '新しい出会いに期待。明るい笑顔が魅力を引き立てます。',
      'パートナーとの絆が深まる予感。一緒に新しいことに挑戦してみて。'
    ],
    workMessages: [
      'リーダーシップが評価される日。積極的に意見を発信しましょう。',
      '新しいプロジェクトのスタートに最適。エネルギッシュに取り組んで。',
      '協調性を大切にしながら、あなたらしい個性を発揮して。'
    ],
    moneyMessages: [
      '投資や新しい収入源について検討するのに良い日。',
      '計画的な支出を心がけて。衝動買いは控えめに。',
      '金運上昇の兆し。ただし慎重な判断を忘れずに。'
    ],
    healthMessages: [
      '運動やスポーツで体を動かすと良いエネルギーが得られそう。',
      '新鮮な空気を吸って、外での活動を楽しみましょう。',
      'ストレス発散を心がけて。好きなことに時間を使って。'
    ]
  },
  // ... 他の星座も同様に定義
  taurus: {
    zodiacSign: 'taurus',
    overallMessages: [
      '安定感のある行動が幸運を呼びます。焦らず着実に進みましょう。',
      '美しいものに触れることで心が豊かになる一日。',
      '信頼関係を大切にすることで、良い結果が期待できます。',
      'ゆっくりとした時間の中で、新たな発見がありそう。'
    ],
    loveMessages: [
      '誠実な気持ちが相手に伝わりやすい日。素直な表現を心がけて。',
      '安定した関係を築くのに最適。長期的な視点で考えてみて。',
      '美しい場所でのデートが良い思い出になりそう。'
    ],
    workMessages: [
      '丁寧な作業が評価される日。質の高い成果を目指しましょう。',
      '信頼関係を築くことで、新しいチャンスが生まれそう。',
      '創造性を活かせる場面があるかも。センスを発揮して。'
    ],
    moneyMessages: [
      '堅実な投資や貯蓄に向いている日。長期的な視点で考えて。',
      '価値のあるものへの投資が良い結果をもたらしそう。',
      '無駄遣いを控えて、本当に必要なものを見極めて。'
    ],
    healthMessages: [
      'リラックスできる時間を作ることが大切。心の安定を保って。',
      '美味しい食事を楽しんで。ただし食べ過ぎには注意。',
      '自然に触れることで、心身ともにリフレッシュできそう。'
    ]
  },
  // 簡略化のため、残りの星座は基本的なメッセージで実装
  gemini: {
    zodiacSign: 'gemini',
    overallMessages: [
      '知的好奇心が刺激される一日。新しい情報にアンテナを張って。',
      'コミュニケーションが鍵となる日。積極的に人と関わりましょう。'
    ],
    loveMessages: ['会話を楽しむことで距離が縮まりそう。'],
    workMessages: ['アイデアが豊富に浮かぶ日。発信力を活かして。'],
    moneyMessages: ['情報収集が金運アップのカギ。'],
    healthMessages: ['頭の使い過ぎに注意。適度な休息を。']
  },
  cancer: {
    zodiacSign: 'cancer',
    overallMessages: [
      '家族や身近な人との時間を大切にすると良い日。',
      '直感が冴える日。心の声に耳を傾けて。'
    ],
    loveMessages: ['思いやりの気持ちが相手の心に響きそう。'],
    workMessages: ['チームワークが良い結果を生む日。'],
    moneyMessages: ['家計の見直しに良いタイミング。'],
    healthMessages: ['心の健康を大切に。リラックスを心がけて。']
  },
  leo: {
    zodiacSign: 'leo',
    overallMessages: [
      '創造力が輝く一日。自己表現を楽しみましょう。',
      '注目を集める場面がありそう。自信を持って行動を。'
    ],
    loveMessages: ['魅力が最大限に発揮される日。堂々とアプローチを。'],
    workMessages: ['プレゼンや発表に最適な日。'],
    moneyMessages: ['投資センスが光る日。ただし慎重に。'],
    healthMessages: ['活力に満ち溢れた日。エネルギッシュに過ごして。']
  },
  virgo: {
    zodiacSign: 'virgo',
    overallMessages: [
      '細かい作業に集中できる日。完璧を目指して取り組んで。',
      '分析力が冴える一日。データや情報を整理してみて。'
    ],
    loveMessages: ['相手への気配りが好印象を与えそう。'],
    workMessages: ['品質の高い仕事が評価される日。'],
    moneyMessages: ['家計管理に最適な日。収支をチェックして。'],
    healthMessages: ['健康管理を見直すのに良いタイミング。']
  },
  libra: {
    zodiacSign: 'libra',
    overallMessages: [
      'バランス感覚が光る一日。調和を大切にして。',
      '美的センスが冴える日。芸術に触れてみて。'
    ],
    loveMessages: ['協調性が魅力となる日。'],
    workMessages: ['チーム内の調整役として活躍できそう。'],
    moneyMessages: ['収支のバランスを見直す良い機会。'],
    healthMessages: ['心身のバランスを整えることが大切。']
  },
  scorpio: {
    zodiacSign: 'scorpio',
    overallMessages: [
      '深い洞察力が冴える日。物事の本質を見抜いて。',
      '集中力が高まる一日。重要な作業に取り組むのに最適。'
    ],
    loveMessages: ['深い絆を築ける予感。真剣な気持ちを伝えて。'],
    workMessages: ['研究や調査に向いている日。'],
    moneyMessages: ['投資の研究に時間をかけるのに良い日。'],
    healthMessages: ['心の声に耳を傾けて。ストレス解消を。']
  },
  sagittarius: {
    zodiacSign: 'sagittarius',
    overallMessages: [
      '冒険心が刺激される日。新しい体験を求めてみて。',
      '自由な発想が良いアイデアを生みそう。'
    ],
    loveMessages: ['自然体の魅力が光る日。'],
    workMessages: ['新しい分野への挑戦に向いている日。'],
    moneyMessages: ['将来への投資を考えるのに良いタイミング。'],
    healthMessages: ['アウトドア活動で心身をリフレッシュ。']
  },
  capricorn: {
    zodiacSign: 'capricorn',
    overallMessages: [
      '目標に向かって着実に進む日。計画性を大切にして。',
      '責任感が評価される一日。信頼を積み重ねて。'
    ],
    loveMessages: ['誠実な気持ちが相手に伝わる日。'],
    workMessages: ['長期的な視点での計画立てに最適。'],
    moneyMessages: ['堅実な資産形成を考えるのに良い日。'],
    healthMessages: ['規則正しい生活を心がけて。']
  },
  aquarius: {
    zodiacSign: 'aquarius',
    overallMessages: [
      '独創的なアイデアが浮かぶ日。人とは違う視点を大切に。',
      '未来志向の思考が良い方向性を示してくれそう。'
    ],
    loveMessages: ['個性的な魅力が注目される日。'],
    workMessages: ['革新的なアプローチが功を奏しそう。'],
    moneyMessages: ['新しい投資手法について学ぶのに良い日。'],
    healthMessages: ['新しい健康法を試してみるのも良さそう。']
  },
  pisces: {
    zodiacSign: 'pisces',
    overallMessages: [
      '直感力が冴える日。心の声に従って行動してみて。',
      '芸術的な感性が刺激される一日。創作活動に向いています。'
    ],
    loveMessages: ['感情豊かな表現が相手の心に響きそう。'],
    workMessages: ['創造性を活かせる場面がありそう。'],
    moneyMessages: ['直感的な判断が良い結果をもたらすかも。'],
    healthMessages: ['心の健康を大切に。瞑想やヨガもおすすめ。']
  }
};

// 誕生日から星座を判定する関数
export const getZodiacSign = (month: number, day: number): ZodiacSign => {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return 'gemini';
  if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return 'cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) return 'libra';
  if ((month === 10 && day >= 24) || (month === 11 && day <= 22)) return 'scorpio';
  if ((month === 11 && day >= 23) || (month === 12 && day <= 21)) return 'sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'aquarius';
  return 'pisces'; // 2/19-3/20
};

// ラッキーカラーの配列
export const LUCKY_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
  '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43',
  '#C44569', '#F8B500', '#E056FD', '#3742FA', '#2ED573'
];

// 今日の日付文字列を取得
export const getTodayString = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0]; // YYYY-MM-DD
}; 