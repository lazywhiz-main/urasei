// 占星術システムの型定義

// 星座タイプ
export type ZodiacSign = 
  | 'aries'       // おひつじ座
  | 'taurus'      // おうし座  
  | 'gemini'      // ふたご座
  | 'cancer'      // かに座
  | 'leo'         // しし座
  | 'virgo'       // おとめ座
  | 'libra'       // てんびん座
  | 'scorpio'     // さそり座
  | 'sagittarius' // いて座
  | 'capricorn'   // やぎ座
  | 'aquarius'    // みずがめ座
  | 'pisces';     // うお座

// ユーザープロフィール
export interface UserProfile {
  birthMonth: number;        // 1-12
  birthDay: number;         // 1-31
  zodiacSign: ZodiacSign;   // 判定済み星座
  name?: string;            // オプション
  birthDate?: string;       // ISO日付文字列 (ホロスコープ用)
  birthTime?: string;       // 出生時刻 "HH:MM" (ホロスコープ用)
  birthLocation?: {         // 出生地 (ホロスコープ用)
    latitude: number;
    longitude: number;
    timezone: string;
    place?: string;
  };
}

// 運勢データ
export interface ZodiacFortune {
  id: string;
  date: string;              // YYYY-MM-DD
  zodiacSign: ZodiacSign;
  overall: number;           // 総合運 1-5
  love: number;             // 恋愛運 1-5
  work: number;             // 仕事運 1-5
  money: number;            // 金運 1-5
  health: number;           // 健康運 1-5
  message: string;          // 今日のメッセージ
  luckyColor: string;       // ラッキーカラー
  luckyNumber: number;      // ラッキーナンバー 1-99
  createdAt: string;
}

// 相性診断結果
export interface CompatibilityResult {
  id: string;
  userSign: ZodiacSign;
  partnerSign: ZodiacSign;
  compatibility: number;    // 相性度 0-100
  analysis: string;         // 相性分析
  advice: string;          // アドバイス
  createdAt: string;
}

// 月相データ
export interface MoonPhase {
  id: string;
  date: string;
  phase: 'new' | 'waxing' | 'full' | 'waning';
  daysSinceNew: number;     // 新月からの日数
  message: string;          // 月相メッセージ
  advice: string;          // 月相アドバイス
  createdAt: string;
}

// 星座マスターデータ
export interface ZodiacMaster {
  sign: ZodiacSign;
  name: string;             // 日本語名
  symbol: string;           // Unicode シンボル ♈♉♊...
  period: string;           // 期間 "3/21-4/19"
  element: 'fire' | 'earth' | 'air' | 'water';
  characteristic: string;   // 特徴
  strongPoints: string[];   // 長所
  compatibility: {         // 相性
    best: ZodiacSign[];
    good: ZodiacSign[];
    normal: ZodiacSign[];
    challenging: ZodiacSign[];
  };
}

// 運勢メッセージテンプレート
export interface FortuneTemplate {
  zodiacSign: ZodiacSign;
  overallMessages: string[];
  loveMessages: string[];
  workMessages: string[];
  moneyMessages: string[];
  healthMessages: string[];
}

// ストレージキー
export const STORAGE_KEYS = {
  USER_PROFILE: '@urasei_user_profile',
  ZODIAC_FORTUNES: '@urasei_zodiac_fortunes',
  COMPATIBILITY_RESULTS: '@urasei_compatibility_results',
  MOON_PHASES: '@urasei_moon_phases',
  LAST_FORTUNE_DATE: '@urasei_last_fortune_date',
} as const; 