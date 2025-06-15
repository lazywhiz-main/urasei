import AsyncStorage from '@react-native-async-storage/async-storage';
import { TarotCard } from '../data/tarotCards';

export interface DivinationResult {
  id: string;
  card: TarotCard;
  isReversed: boolean;
  reading: string;
  date: string;
  timestamp: number;
}

const DIVINATION_STORAGE_KEY = 'divination_results';
const LAST_DIVINATION_DATE_KEY = 'last_divination_date';

// 今日の占いを実行済みかチェック
export const hasPerformedTodaysDivination = async (): Promise<boolean> => {
  try {
    const lastDate = await AsyncStorage.getItem(LAST_DIVINATION_DATE_KEY);
    if (!lastDate) return false;
    
    const today = new Date().toDateString();
    return lastDate === today;
  } catch (error) {
    console.error('Error checking today\'s divination:', error);
    return false;
  }
};

// 占い結果を保存
export const saveDivinationResult = async (result: DivinationResult): Promise<void> => {
  try {
    // 既存の結果を取得
    const existingResults = await getDivinationResults();
    
    // 新しい結果を追加
    const updatedResults = [result, ...existingResults];
    
    // 最新7件のみ保持
    const limitedResults = updatedResults.slice(0, 7);
    
    // 保存
    await AsyncStorage.setItem(DIVINATION_STORAGE_KEY, JSON.stringify(limitedResults));
    
    // 今日の日付を記録
    const today = new Date().toDateString();
    await AsyncStorage.setItem(LAST_DIVINATION_DATE_KEY, today);
  } catch (error) {
    console.error('Error saving divination result:', error);
    throw error;
  }
};

// 占い結果を取得
export const getDivinationResults = async (): Promise<DivinationResult[]> => {
  try {
    const resultsJson = await AsyncStorage.getItem(DIVINATION_STORAGE_KEY);
    if (!resultsJson) return [];
    
    return JSON.parse(resultsJson);
  } catch (error) {
    console.error('Error getting divination results:', error);
    return [];
  }
};

// 今日の占い結果を取得
export const getTodaysDivination = async (): Promise<DivinationResult | null> => {
  try {
    const results = await getDivinationResults();
    const today = new Date().toDateString();
    
    return results.find(result => 
      new Date(result.timestamp).toDateString() === today
    ) || null;
  } catch (error) {
    console.error('Error getting today\'s divination:', error);
    return null;
  }
};

// 占い結果をクリア（デバッグ用）
export const clearDivinationResults = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(DIVINATION_STORAGE_KEY);
    await AsyncStorage.removeItem(LAST_DIVINATION_DATE_KEY);
  } catch (error) {
    console.error('Error clearing divination results:', error);
    throw error;
  }
}; 