// src/screens/BaziScreen.tsx
// 四柱推命メイン画面

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
// import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BaziEngine, BaziReading } from '../services/BaziEngine';
import { BaziChart } from '../components/BaziChart';
import { StarNavContainer } from '../components/StarNavContainer';

interface BaziScreenProps {
  navigation: any;
}

export const BaziScreen: React.FC<BaziScreenProps> = ({ navigation }) => {
  const [birthDate, setBirthDate] = useState(new Date());
  const [birthTime, setBirthTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [baziReading, setBaziReading] = useState<BaziReading | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [currentView, setCurrentView] = useState<'input' | 'chart' | 'reading'>('input');

  // 四柱推命の計算
  const calculateBazi = async () => {
    try {
      setIsCalculating(true);
      
      // 時間を時のみに変換（分は無視）
      const hour = birthTime.getHours();
      
      // 四柱推命チャート計算
      const chart = BaziEngine.calculateBaziChart(birthDate, hour);
      const reading = BaziEngine.generateBaziReading(chart);
      
      setBaziReading(reading);
      setCurrentView('chart');
      
      console.log('四柱推命計算完了:', {
        date: birthDate.toDateString(),
        hour: hour,
        dayMaster: chart.dayMaster,
        usefulGod: chart.usefulGod
      });
      
    } catch (error) {
      console.error('四柱推命計算エラー:', error);
      Alert.alert('エラー', '四柱推命の計算中にエラーが発生しました。');
    } finally {
      setIsCalculating(false);
    }
  };

  // 日付変更ハンドラ
  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || birthDate;
    setShowDatePicker(Platform.OS === 'ios');
    setBirthDate(currentDate);
  };

  // 時間変更ハンドラ
  const onTimeChange = (event: any, selectedTime?: Date) => {
    const currentTime = selectedTime || birthTime;
    setShowTimePicker(Platform.OS === 'ios');
    setBirthTime(currentTime);
  };

  // 入力画面のレンダリング
  const renderInputForm = () => (
    <View style={styles.formContainer}>
      <LinearGradient
        colors={['#1e1b4b', '#312e81', '#1e1b4b']}
        style={styles.formGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.formTitle}>四柱推命</Text>
        <Text style={styles.formSubtitle}>
          あなたの生年月日と生まれた時間を入力してください
        </Text>

        {/* 生年月日入力 */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>生年月日</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <LinearGradient
              colors={['#fbbf24', '#f59e0b']}
              style={styles.dateButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.dateButtonText}>
                {birthDate.toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'short'
                })}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* 生まれた時間入力 */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>生まれた時間</Text>
          <TouchableOpacity
            style={styles.timeButton}
            onPress={() => setShowTimePicker(true)}
          >
            <LinearGradient
              colors={['#10b981', '#059669']}
              style={styles.timeButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.timeButtonText}>
                {birthTime.toLocaleTimeString('ja-JP', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false
                })}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          <Text style={styles.timeNote}>
            ※ 正確な時間が分からない場合は、おおよその時間を入力してください
          </Text>
        </View>

        {/* 計算ボタン */}
        <TouchableOpacity
          style={styles.calculateButton}
          onPress={calculateBazi}
          disabled={isCalculating}
        >
          <LinearGradient
            colors={isCalculating ? ['#6b7280', '#4b5563'] : ['#ef4444', '#dc2626']}
            style={styles.calculateButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.calculateButtonText}>
              {isCalculating ? '計算中...' : '四柱推命を見る'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* 日付・時間ピッカー */}
        {/* TODO: Add DateTimePicker component when dependency is available */}
      </LinearGradient>
    </View>
  );

  // 詳細解釈のレンダリング
  const renderDetailedReading = () => {
    if (!baziReading) return null;

    const sections = [
      { title: '性格・特徴', content: baziReading.personality, icon: '🌟' },
      { title: 'キャリア・適職', content: baziReading.career, icon: '💼' },
      { title: '恋愛・人間関係', content: baziReading.relationships, icon: '💕' },
      { title: '健康運', content: baziReading.health, icon: '🏥' },
      { title: '金運・財運', content: baziReading.wealth, icon: '💰' },
      { title: '総合運勢', content: baziReading.overall, icon: '🔮' },
      { title: 'アドバイス', content: baziReading.advice, icon: '✨' },
    ];

    return (
      <View style={styles.readingContainer}>
        {/* ラッキーアイテム */}
        <LinearGradient
          colors={['#f9fafb', '#ffffff']}
          style={styles.luckySection}
        >
          <Text style={styles.luckySectionTitle}>開運アイテム</Text>
          
          <View style={styles.luckyGrid}>
            <View style={styles.luckyItem}>
              <Text style={styles.luckyLabel}>ラッキーカラー</Text>
              <View style={styles.colorsContainer}>
                {baziReading.luckyColors.map((color, index) => (
                  <View
                    key={index}
                    style={[styles.colorDot, { backgroundColor: color }]}
                  />
                ))}
              </View>
              <Text style={styles.luckyText}>
                {baziReading.luckyColors.join('・')}
              </Text>
            </View>
            
            <View style={styles.luckyItem}>
              <Text style={styles.luckyLabel}>ラッキーナンバー</Text>
              <Text style={styles.luckyNumbers}>
                {baziReading.luckyNumbers.join(' • ')}
              </Text>
            </View>
            
            <View style={styles.luckyItem}>
              <Text style={styles.luckyLabel}>ラッキー方角</Text>
              <Text style={styles.luckyText}>
                {baziReading.luckyDirections.join('・')}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* 詳細解釈 */}
        {sections.map((section, index) => (
          <LinearGradient
            key={section.title}
            colors={['#f9fafb', '#ffffff']}
            style={styles.readingSection}
          >
            <View style={styles.readingSectionHeader}>
              <Text style={styles.readingSectionIcon}>{section.icon}</Text>
              <Text style={styles.readingSectionTitle}>{section.title}</Text>
            </View>
            <Text style={styles.readingSectionContent}>{section.content}</Text>
          </LinearGradient>
        ))}
      </View>
    );
  };

  // ナビゲーションバー
  const renderNavigationBar = () => (
    <View style={styles.navigationBar}>
      <TouchableOpacity
        style={[styles.navButton, currentView === 'input' && styles.activeNavButton]}
        onPress={() => setCurrentView('input')}
      >
        <Text style={[styles.navButtonText, currentView === 'input' && styles.activeNavButtonText]}>
          入力
        </Text>
      </TouchableOpacity>
      
      {baziReading && (
        <>
          <TouchableOpacity
            style={[styles.navButton, currentView === 'chart' && styles.activeNavButton]}
            onPress={() => setCurrentView('chart')}
          >
            <Text style={[styles.navButtonText, currentView === 'chart' && styles.activeNavButtonText]}>
              命式
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.navButton, currentView === 'reading' && styles.activeNavButton]}
            onPress={() => setCurrentView('reading')}
          >
            <Text style={[styles.navButtonText, currentView === 'reading' && styles.activeNavButtonText]}>
              詳細
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );

  return (
    <LinearGradient
      colors={['#0f0a2e', '#1e1b4b', '#312e81']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StarNavContainer currentStar="divination" />
      <SafeAreaView style={styles.safeArea}>
        {renderNavigationBar()}
        
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {currentView === 'input' && renderInputForm()}
          {currentView === 'chart' && baziReading && (
            <BaziChart chart={baziReading.chart} showElements={true} />
          )}
          {currentView === 'reading' && renderDetailedReading()}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  navButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  activeNavButton: {
    backgroundColor: 'rgba(251,191,36,0.3)',
  },
  navButtonText: {
    color: '#e5e7eb',
    fontSize: 14,
    fontWeight: '600',
  },
  activeNavButtonText: {
    color: '#fbbf24',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  formContainer: {
    margin: 20,
  },
  formGradient: {
    borderRadius: 20,
    padding: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  formTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fbbf24',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  formSubtitle: {
    fontSize: 16,
    color: '#e5e7eb',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fbbf24',
    marginBottom: 12,
  },
  dateButton: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  dateButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  dateButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  timeButton: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  timeButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  timeButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  timeNote: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 8,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  calculateButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  calculateButtonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  calculateButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  readingContainer: {
    padding: 16,
    gap: 16,
  },
  luckySection: {
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  luckySectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 16,
  },
  luckyGrid: {
    gap: 16,
  },
  luckyItem: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  luckyLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  colorsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
    gap: 8,
  },
  colorDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  luckyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
  },
  luckyNumbers: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ef4444',
    textAlign: 'center',
  },
  readingSection: {
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  readingSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  readingSectionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  readingSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  readingSectionContent: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
}); 