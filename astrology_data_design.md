# 占星術システム データ構造設計

## 1. 基本データ型

```typescript
// ユーザープロフィール
interface UserProfile {
  birthMonth: number;        // 1-12
  birthDay: number;         // 1-31
  zodiacSign: ZodiacSign;   // 判定済み星座
  name?: string;            // オプション
}

// 星座タイプ
type ZodiacSign = 
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

// 運勢データ
interface ZodiacFortune {
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
interface CompatibilityResult {
  id: string;
  userSign: ZodiacSign;
  partnerSign: ZodiacSign;
  compatibility: number;    // 相性度 0-100
  analysis: string;         // 相性分析
  advice: string;          // アドバイス
  createdAt: string;
}

// 月相データ
interface MoonPhase {
  id: string;
  date: string;
  phase: 'new' | 'waxing' | 'full' | 'waning';
  daysSinceNew: number;     // 新月からの日数
  message: string;          // 月相メッセージ
  advice: string;          // 月相アドバイス
  createdAt: string;
}
```

## 2. マスターデータ

```typescript
// 星座マスターデータ
interface ZodiacMaster {
  sign: ZodiacSign;
  name: string;             // 日本語名
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
interface FortuneTemplate {
  zodiacSign: ZodiacSign;
  overallMessages: string[];
  loveMessages: string[];
  workMessages: string[];
  moneyMessages: string[];
  healthMessages: string[];
}
```

## 3. AsyncStorage キー設計

```typescript
// ストレージキー
const STORAGE_KEYS = {
  USER_PROFILE: '@urasei_user_profile',
  ZODIAC_FORTUNES: '@urasei_zodiac_fortunes',
  COMPATIBILITY_RESULTS: '@urasei_compatibility_results',
  MOON_PHASES: '@urasei_moon_phases',
  LAST_FORTUNE_DATE: '@urasei_last_fortune_date',
};
```

## 4. 利用制限ルール

```typescript
// 制限ルール
interface UsageRules {
  dailyFortune: {
    limit: 1;              // 1日1回
    resetTime: '00:00';    // 日本時間午前0時リセット
  };
  compatibility: {
    limit: null;           // 無制限
  };
  moonPhase: {
    limit: null;           // 無制限
  };
}
``` 