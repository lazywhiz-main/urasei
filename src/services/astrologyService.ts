import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  UserProfile, 
  ZodiacFortune, 
  CompatibilityResult, 
  ZodiacSign, 
  STORAGE_KEYS 
} from '../types/astrology';
import { 
  ZODIAC_MASTERS, 
  FORTUNE_TEMPLATES, 
  LUCKY_COLORS, 
  getTodayString 
} from '../data/zodiacData';

export class AstrologyService {
  // ユーザープロフィールの保存
  static async saveUserProfile(profile: UserProfile): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    } catch (error) {
      console.error('Failed to save user profile:', error);
      throw error;
    }
  }

  // ユーザープロフィールの取得
  static async getUserProfile(): Promise<UserProfile | null> {
    try {
      const profileData = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return profileData ? JSON.parse(profileData) : null;
    } catch (error) {
      console.error('Failed to get user profile:', error);
      return null;
    }
  }

  // 今日の運勢生成
  static async generateTodaysFortune(zodiacSign: ZodiacSign): Promise<ZodiacFortune> {
    const today = getTodayString();
    const template = FORTUNE_TEMPLATES[zodiacSign];
    
    // ランダムメッセージ選択
    const getRandomMessage = (messages: string[]) => 
      messages[Math.floor(Math.random() * messages.length)];

    // 運勢スコア生成（1-5）
    const generateScore = () => Math.floor(Math.random() * 5) + 1;

    // ラッキーカラー選択
    const luckyColor = LUCKY_COLORS[Math.floor(Math.random() * LUCKY_COLORS.length)];

    // ラッキーナンバー生成（1-99）
    const luckyNumber = Math.floor(Math.random() * 99) + 1;

    const fortune: ZodiacFortune = {
      id: `fortune_${zodiacSign}_${today}`,
      date: today,
      zodiacSign,
      overall: generateScore(),
      love: generateScore(),
      work: generateScore(),
      money: generateScore(),
      health: generateScore(),
      message: getRandomMessage(template.overallMessages),
      luckyColor,
      luckyNumber,
      createdAt: new Date().toISOString()
    };

    // 保存
    await this.saveFortune(fortune);
    
    return fortune;
  }

  // 運勢の保存
  static async saveFortune(fortune: ZodiacFortune): Promise<void> {
    try {
      const existingData = await AsyncStorage.getItem(STORAGE_KEYS.ZODIAC_FORTUNES);
      const fortunes: ZodiacFortune[] = existingData ? JSON.parse(existingData) : [];
      
      // 同じ日付の運勢があれば置き換え
      const updatedFortunes = fortunes.filter(f => f.date !== fortune.date);
      updatedFortunes.push(fortune);
      
      await AsyncStorage.setItem(STORAGE_KEYS.ZODIAC_FORTUNES, JSON.stringify(updatedFortunes));
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_FORTUNE_DATE, fortune.date);
    } catch (error) {
      console.error('Failed to save fortune:', error);
      throw error;
    }
  }

  // 今日の運勢取得（既に生成済みならそれを返す）
  static async getTodaysFortune(zodiacSign: ZodiacSign): Promise<ZodiacFortune> {
    const today = getTodayString();
    
    try {
      const lastFortuneDate = await AsyncStorage.getItem(STORAGE_KEYS.LAST_FORTUNE_DATE);
      
      if (lastFortuneDate === today) {
        // 今日の運勢が既に生成済み
        const fortunesData = await AsyncStorage.getItem(STORAGE_KEYS.ZODIAC_FORTUNES);
        if (fortunesData) {
          const fortunes: ZodiacFortune[] = JSON.parse(fortunesData);
          const todaysFortune = fortunes.find(f => f.date === today && f.zodiacSign === zodiacSign);
          if (todaysFortune) {
            return todaysFortune;
          }
        }
      }
      
      // 新しい運勢を生成
      return await this.generateTodaysFortune(zodiacSign);
    } catch (error) {
      console.error('Failed to get todays fortune:', error);
      // エラーの場合は新しい運勢を生成
      return await this.generateTodaysFortune(zodiacSign);
    }
  }

  // 今日運勢を引いたかチェック
  static async hasDrawnTodaysFortune(): Promise<boolean> {
    try {
      const lastFortuneDate = await AsyncStorage.getItem(STORAGE_KEYS.LAST_FORTUNE_DATE);
      return lastFortuneDate === getTodayString();
    } catch (error) {
      console.error('Failed to check if drawn today:', error);
      return false;
    }
  }

  // 相性診断
  static calculateCompatibility(userSign: ZodiacSign, partnerSign: ZodiacSign): {
    compatibility: number;
    analysis: string;
    advice: string;
  } {
    const userMaster = ZODIAC_MASTERS[userSign];
    const partnerMaster = ZODIAC_MASTERS[partnerSign];
    
    let compatibility: number;
    let analysis: string;
    let advice: string;

    if (userMaster.compatibility.best.includes(partnerSign)) {
      compatibility = Math.floor(Math.random() * 15) + 85; // 85-99%
      analysis = `${userMaster.name}と${partnerMaster.name}は最高の相性です！お互いの特性がとても良く合い、素晴らしいパートナーシップを築けるでしょう。`;
      advice = '自然体で接することで、より深い絆を築いていけます。お互いの良いところを積極的に褒め合いましょう。';
    } else if (userMaster.compatibility.good.includes(partnerSign)) {
      compatibility = Math.floor(Math.random() * 15) + 70; // 70-84%
      analysis = `${userMaster.name}と${partnerMaster.name}は良い相性です。お互いを理解し合うことで、充実した関係を築けます。`;
      advice = 'コミュニケーションを大切にして、お互いの価値観を尊重することが関係発展の鍵となります。';
    } else if (userMaster.compatibility.challenging.includes(partnerSign)) {
      compatibility = Math.floor(Math.random() * 15) + 40; // 40-54%
      analysis = `${userMaster.name}と${partnerMaster.name}は少し挑戦的な組み合わせです。違いを認め合うことで成長できる関係です。`;
      advice = '違いをネガティブに捉えず、お互いから学ぶ姿勢を持つことで、ユニークで刺激的な関係を築けます。';
    } else {
      compatibility = Math.floor(Math.random() * 15) + 55; // 55-69%
      analysis = `${userMaster.name}と${partnerMaster.name}は普通の相性です。お互いの努力次第で素敵な関係を築いていけます。`;
      advice = '相手の良いところを見つけて、積極的に関わっていくことで親密度を高めていけるでしょう。';
    }

    return { compatibility, analysis, advice };
  }

  // 相性診断結果の保存
  static async saveCompatibilityResult(result: CompatibilityResult): Promise<void> {
    try {
      const existingData = await AsyncStorage.getItem(STORAGE_KEYS.COMPATIBILITY_RESULTS);
      const results: CompatibilityResult[] = existingData ? JSON.parse(existingData) : [];
      
      results.push(result);
      
      await AsyncStorage.setItem(STORAGE_KEYS.COMPATIBILITY_RESULTS, JSON.stringify(results));
    } catch (error) {
      console.error('Failed to save compatibility result:', error);
      throw error;
    }
  }

  // 運勢履歴の取得
  static async getFortuneHistory(limit: number = 10): Promise<ZodiacFortune[]> {
    try {
      const fortunesData = await AsyncStorage.getItem(STORAGE_KEYS.ZODIAC_FORTUNES);
      if (!fortunesData) return [];
      
      const fortunes: ZodiacFortune[] = JSON.parse(fortunesData);
      return fortunes
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, limit);
    } catch (error) {
      console.error('Failed to get fortune history:', error);
      return [];
    }
  }

  // 相性診断履歴の取得
  static async getCompatibilityHistory(limit: number = 10): Promise<CompatibilityResult[]> {
    try {
      const resultsData = await AsyncStorage.getItem(STORAGE_KEYS.COMPATIBILITY_RESULTS);
      if (!resultsData) return [];
      
      const results: CompatibilityResult[] = JSON.parse(resultsData);
      return results
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit);
    } catch (error) {
      console.error('Failed to get compatibility history:', error);
      return [];
    }
  }

  // データリセット（開発用）
  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER_PROFILE,
        STORAGE_KEYS.ZODIAC_FORTUNES,
        STORAGE_KEYS.COMPATIBILITY_RESULTS,
        STORAGE_KEYS.MOON_PHASES,
        STORAGE_KEYS.LAST_FORTUNE_DATE
      ]);
    } catch (error) {
      console.error('Failed to clear astrology data:', error);
      throw error;
    }
  }
} 