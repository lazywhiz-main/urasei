import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DivinationIcon, BackIcon } from '../components/Icons';
import { drawRandomCard, generateDailyReading, TarotCard } from '../data/tarotCards';
import {
  hasPerformedTodaysDivination,
  saveDivinationResult,
  getTodaysDivination,
  DivinationResult,
} from '../utils/divinationStorage';

const { width, height } = Dimensions.get('window');

interface DivinationScreenProps {
  navigation: any;
}

const DivinationScreen: React.FC<DivinationScreenProps> = ({ navigation }) => {
  const [currentResult, setCurrentResult] = useState<DivinationResult | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawnToday, setHasDrawnToday] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // アニメーション値
  const cardScale = useRef(new Animated.Value(1)).current;
  const cardRotation = useRef(new Animated.Value(0)).current;
  const resultOpacity = useRef(new Animated.Value(0)).current;
  const resultTranslateY = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    checkTodaysStatus();
  }, []);

  const checkTodaysStatus = async () => {
    try {
      const hasDrawn = await hasPerformedTodaysDivination();
      setHasDrawnToday(hasDrawn);

      if (hasDrawn) {
        const todaysResult = await getTodaysDivination();
        if (todaysResult) {
          setCurrentResult(todaysResult);
          setShowResult(true);
          // 結果表示アニメーション
          Animated.parallel([
            Animated.timing(resultOpacity, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(resultTranslateY, {
              toValue: 0,
              duration: 800,
              useNativeDriver: true,
            }),
          ]).start();
        }
      }
    } catch (error) {
      console.error('Error checking today\'s status:', error);
    }
  };

  const handleDrawCard = async () => {
    if (hasDrawnToday) {
      Alert.alert(
        '今日の占いは完了しています',
        '1日1回の占いは既に実行済みです。明日また新しいカードを引いてください。',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsDrawing(true);

    // カード引きアニメーション
    Animated.sequence([
      // カードが回転しながら縮小
      Animated.parallel([
        Animated.timing(cardScale, {
          toValue: 0.8,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(cardRotation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
      // カードが元のサイズに戻る
      Animated.timing(cardScale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(async () => {
      // カードを引く
      const { card, isReversed } = drawRandomCard();
      const reading = generateDailyReading(card, isReversed);
      
      const result: DivinationResult = {
        id: Date.now().toString(),
        card,
        isReversed,
        reading,
        date: new Date().toLocaleDateString('ja-JP'),
        timestamp: Date.now(),
      };

      try {
        await saveDivinationResult(result);
        setCurrentResult(result);
        setHasDrawnToday(true);
        setShowResult(true);
        setIsDrawing(false);

        // 結果表示アニメーション
        Animated.parallel([
          Animated.timing(resultOpacity, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(resultTranslateY, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ]).start();
      } catch (error) {
        console.error('Error saving divination result:', error);
        setIsDrawing(false);
        Alert.alert('エラー', '占い結果の保存に失敗しました。');
      }
    });
  };

  const cardRotateInterpolated = cardRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <LinearGradient
      colors={['#1a0f3d', '#2d1b69', '#4c1d95']}
      style={styles.container}
    >
      {/* ヘッダー */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <BackIcon size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>今日の占い</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* タイトル */}
        <View style={styles.titleContainer}>
          <DivinationIcon size={60} style={styles.titleIcon} />
          <Text style={styles.title}>タロット占い</Text>
          <Text style={styles.subtitle}>
            {hasDrawnToday ? '今日のあなたのカード' : '今日のカードを引いてみましょう'}
          </Text>
        </View>

        {/* カード表示エリア */}
        <View style={styles.cardContainer}>
          <Animated.View
            style={[
              styles.card,
              {
                transform: [
                  { scale: cardScale },
                  { rotate: cardRotateInterpolated },
                ],
              },
            ]}
          >
            <LinearGradient
              colors={['#6366f1', '#8b5cf6', '#a855f7']}
              style={styles.cardGradient}
            >
              {showResult && currentResult ? (
                <View style={styles.cardContent}>
                  <Text style={styles.cardName}>{currentResult.card.name}</Text>
                  <Text style={styles.cardPosition}>
                    {currentResult.isReversed ? '逆位置' : '正位置'}
                  </Text>
                  <View style={styles.cardKeywords}>
                    {currentResult.card.keywords.map((keyword, index) => (
                      <Text key={index} style={styles.keyword}>
                        {keyword}
                      </Text>
                    ))}
                  </View>
                </View>
              ) : (
                <View style={styles.cardBack}>
                  <DivinationIcon size={80} />
                  <Text style={styles.cardBackText}>
                    {isDrawing ? '運命を読み取り中...' : 'タップしてカードを引く'}
                  </Text>
                </View>
              )}
            </LinearGradient>
          </Animated.View>
        </View>

        {/* カード引きボタン */}
        {!hasDrawnToday && (
          <TouchableOpacity
            style={[styles.drawButton, isDrawing && styles.drawButtonDisabled]}
            onPress={handleDrawCard}
            disabled={isDrawing}
          >
            <LinearGradient
              colors={['#f59e0b', '#ec4899', '#a855f7']}
              style={styles.drawButtonGradient}
            >
              <Text style={styles.drawButtonText}>
                {isDrawing ? 'カードを引いています...' : 'カードを引く'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* 占い結果 */}
        {showResult && currentResult && (
          <Animated.View
            style={[
              styles.resultContainer,
              {
                opacity: resultOpacity,
                transform: [{ translateY: resultTranslateY }],
              },
            ]}
          >
            <View style={styles.resultCard}>
              <Text style={styles.resultTitle}>今日のメッセージ</Text>
              <Text style={styles.resultText}>{currentResult.reading}</Text>
              <View style={styles.resultFooter}>
                <Text style={styles.resultDate}>{currentResult.date}</Text>
              </View>
            </View>
          </Animated.View>
        )}

        {/* 再占いの説明 */}
        {hasDrawnToday && (
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              占いは1日1回です。明日の午前4時以降に新しいカードを引くことができます。
            </Text>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  titleIcon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#d1d5db',
    textAlign: 'center',
  },
  cardContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  card: {
    width: width * 0.7,
    height: width * 0.9,
    borderRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  cardGradient: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    alignItems: 'center',
  },
  cardName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  cardPosition: {
    fontSize: 18,
    color: '#fbbf24',
    marginBottom: 20,
  },
  cardKeywords: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  keyword: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    fontSize: 14,
    color: '#fff',
  },
  cardBack: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBackText: {
    fontSize: 16,
    color: '#fff',
    marginTop: 16,
    textAlign: 'center',
  },
  drawButton: {
    marginBottom: 30,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  drawButtonDisabled: {
    opacity: 0.6,
  },
  drawButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: 'center',
  },
  drawButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  resultContainer: {
    marginBottom: 30,
  },
  resultCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fbbf24',
    marginBottom: 16,
    textAlign: 'center',
  },
  resultText: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 24,
    marginBottom: 16,
  },
  resultFooter: {
    alignItems: 'center',
  },
  resultDate: {
    fontSize: 14,
    color: '#9ca3af',
  },
  infoContainer: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  infoText: {
    fontSize: 14,
    color: '#93c5fd',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default DivinationScreen; 