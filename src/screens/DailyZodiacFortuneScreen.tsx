import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { ZODIAC_MASTERS } from '../data/zodiacData';
import { AstrologyService } from '../services/astrologyService';
import { ZodiacFortune, UserProfile } from '../types/astrology';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StarNavContainer } from '../components/StarNavContainer';

const { width, height } = Dimensions.get('window');

type RootStackParamList = {
  AstrologyMenu: undefined;
  ZodiacDetection: undefined;
};

type DailyZodiacFortuneScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'AstrologyMenu'>;
};

const DailyZodiacFortuneScreen: React.FC<DailyZodiacFortuneScreenProps> = ({ navigation }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [currentFortune, setCurrentFortune] = useState<ZodiacFortune | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasDrawnToday, setHasDrawnToday] = useState(false);
  const [stars, setStars] = useState<any[]>([]);

  const fortuneRevealAnim = useRef(new Animated.Value(0)).current;
  const starAnimations = useRef<Animated.Value[]>([]).current;

  useEffect(() => {
    generateStars();
    startAnimations();
    checkUserProfileAndLoadFortune();
  }, []);

  const generateStars = () => {
    const newStars = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      opacity: new Animated.Value(Math.random() * 0.5 + 0.3),
    }));
    setStars(newStars);
    starAnimations.length = 0;
    newStars.forEach((star) => {
      starAnimations.push(star.opacity);
    });
  };

  const startAnimations = () => {
    starAnimations.forEach((anim, index) => {
      const animate = () => {
        Animated.sequence([
          Animated.timing(anim, {
            toValue: Math.random() * 0.5 + 0.5,
            duration: 1000 + Math.random() * 2000,
            useNativeDriver: false,
          }),
          Animated.timing(anim, {
            toValue: Math.random() * 0.3 + 0.2,
            duration: 1000 + Math.random() * 2000,
            useNativeDriver: false,
          }),
        ]).start(() => animate());
      };
      
      setTimeout(() => animate(), index * 100);
    });
  };

  const checkUserProfileAndLoadFortune = async () => {
    try {
      const profile = await AstrologyService.getUserProfile();
      if (!profile) {
        Alert.alert(
          '星座情報が必要です',
          '占いをするには、まず星座検出を行ってください。',
          [
            {
              text: '星座検出へ',
              onPress: () => navigation.navigate('ZodiacDetection'),
            },
          ]
        );
        return;
      }

      setUserProfile(profile);
      
      // 今日の運勢があるかチェック
      const today = new Date().toDateString();
      const lastFortuneDate = await AsyncStorage.getItem('lastZodiacFortuneDate');
      const todaysFortune = await AsyncStorage.getItem('todaysZodiacFortune');
      
      if (lastFortuneDate === today && todaysFortune) {
        setCurrentFortune(JSON.parse(todaysFortune));
        setHasDrawnToday(true);
      }
    } catch (error) {
      console.error('プロフィール読み込みエラー:', error);
    }
  };

  const drawTodaysFortune = async () => {
    if (!userProfile) return;

    setIsLoading(true);
    
    // アニメーション開始
    Animated.timing(fortuneRevealAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: false,
    }).start();

    try {
      // 1.5秒後に運勢生成
      setTimeout(async () => {
        const fortune = await AstrologyService.generateTodaysFortune(userProfile.zodiacSign);
        
        // 今日の運勢として保存
        const today = new Date().toDateString();
        await AsyncStorage.setItem('lastZodiacFortuneDate', today);
        await AsyncStorage.setItem('todaysZodiacFortune', JSON.stringify(fortune));
        
        setCurrentFortune(fortune);
        setHasDrawnToday(true);
        setIsLoading(false);
        
        // アニメーション終了
        Animated.timing(fortuneRevealAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }).start();
      }, 1500);
    } catch (error) {
      console.error('運勢生成エラー:', error);
      setIsLoading(false);
      Alert.alert('エラー', '運勢の生成に失敗しました。もう一度お試しください。');
    }
  };

  const renderStarRating = (score: number) => {
    const stars = [];
    const fullStars = Math.floor(score / 20);
    const hasHalfStar = score % 20 >= 10;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Text key={i} style={{ color: '#FFD700', fontSize: 16 }}>★</Text>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Text key={i} style={{ color: '#FFD700', fontSize: 16 }}>☆</Text>);
      } else {
        stars.push(<Text key={i} style={{ color: '#666', fontSize: 16 }}>☆</Text>);
      }
    }
    
    return <View style={styles.starRating}>{stars}</View>;
  };

  const renderFortuneCard = (title: string, score: number, color: string) => (
    <View style={[styles.fortuneCard, { borderLeftColor: color }]}>
      <View style={styles.fortuneCardContent}>
        <Text style={styles.fortuneCardTitle}>{title}</Text>
        {renderStarRating(score)}
      </View>
      <Text style={[styles.fortuneScore, { color }]}>{score}</Text>
    </View>
  );

  return (
    <View style={styles.outerContainer}>
      <LinearGradient
        colors={['#0f0f23', '#1a1a2e', '#16213e']}
        style={styles.fullScreenBackground}
      />
      
      {/* 星のアニメーション */}
      {stars.map((star, index) => (
        <Animated.View
          key={star.id}
          style={[
            styles.star,
            {
              left: `${star.x}%`,
              top: `${star.y}%`,
              opacity: star.opacity,
            },
          ]}
        />
      ))}

      <SafeAreaView style={styles.container}>
                 <StarNavContainer currentStar="divination" />

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
          <View style={styles.content}>
            {/* ヘッダー */}
            <View style={styles.header}>
              <Text style={styles.title}>今日の星座運勢</Text>
                             {userProfile && (
                 <View style={styles.zodiacInfo}>
                   <Text style={styles.zodiacSymbol}>{ZODIAC_MASTERS[userProfile.zodiacSign].symbol}</Text>
                   <Text style={styles.zodiacName}>{ZODIAC_MASTERS[userProfile.zodiacSign].name}</Text>
                 </View>
               )}
            </View>

            {!currentFortune ? (
              // 運勢未抽選時
              <View style={styles.drawSection}>
                <Text style={styles.drawTitle}>今日の運勢を占う</Text>
                <Text style={styles.drawSubtitle}>
                  星々があなたの今日を導きます
                </Text>
                <TouchableOpacity
                  style={styles.drawButton}
                  onPress={drawTodaysFortune}
                  disabled={isLoading}
                >
                  <LinearGradient
                    colors={['#FFD700', '#FFA500', '#FF8C00']}
                    style={styles.drawButtonGradient}
                  >
                    <Text style={styles.drawButtonText}>
                      {isLoading ? '占い中...' : '今日の運勢を占う'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            ) : (
              // 運勢表示
              <View style={styles.fortuneSection}>
                {/* 今日のメッセージ */}
                <View style={styles.messageCard}>
                  <Text style={styles.messageTitle}>今日のメッセージ</Text>
                  <Text style={styles.messageText}>{currentFortune.message}</Text>
                </View>

                {/* 運勢スコア */}
                <View style={styles.scoresContainer}>
                  {renderFortuneCard('総合運', currentFortune.overall, '#FFD700')}
                  {renderFortuneCard('恋愛運', currentFortune.love, '#FF69B4')}
                  {renderFortuneCard('仕事運', currentFortune.work, '#4169E1')}
                  {renderFortuneCard('金運', currentFortune.money, '#32CD32')}
                  {renderFortuneCard('健康運', currentFortune.health, '#FF6347')}
                </View>

                {/* ラッキーアイテム */}
                <View style={styles.luckySection}>
                  <View style={styles.luckyItem}>
                    <Text style={styles.luckyLabel}>ラッキーカラー</Text>
                    <View style={styles.luckyColorContainer}>
                      <View 
                        style={[
                          styles.luckyColorSwatch, 
                          { backgroundColor: currentFortune.luckyColor }
                        ]} 
                      />
                      <Text style={styles.luckyColorText}>{currentFortune.luckyColor}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.luckyItem}>
                    <Text style={styles.luckyLabel}>ラッキーナンバー</Text>
                    <Text style={styles.luckyNumber}>{currentFortune.luckyNumber}</Text>
                  </View>
                </View>
              </View>
            )}

            {/* フッター */}
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.backButtonText}>← メニューに戻る</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* 運勢生成アニメーション */}
        {isLoading && (
          <Animated.View
            style={[
              styles.fortuneRevealContainer,
              {
                opacity: fortuneRevealAnim,
                transform: [
                  {
                    scale: fortuneRevealAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.fortuneRevealText}>
              🌟 星々が今日のあなたを占っています... 🌟
            </Text>
          </Animated.View>
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  fullScreenBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  container: {
    flex: 1,
  },
  star: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 50,
    width: 2,
    height: 2,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 20,
  },
  zodiacInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  zodiacSymbol: {
    fontSize: 24,
    marginRight: 10,
  },
  zodiacName: {
    fontSize: 18,
    color: '#FFD700',
    fontWeight: '600',
  },
  drawSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  drawTitle: {
    fontSize: 20,
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: '600',
  },
  drawSubtitle: {
    fontSize: 16,
    color: '#E8E8E8',
    textAlign: 'center',
    marginBottom: 40,
    opacity: 0.8,
  },
  drawButton: {
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  drawButtonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  drawButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  fortuneSection: {
    flex: 1,
    paddingVertical: 20,
  },
  messageCard: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  messageTitle: {
    fontSize: 18,
    color: '#FFD700',
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  messageText: {
    fontSize: 16,
    color: '#E8E8E8',
    lineHeight: 24,
    textAlign: 'center',
  },
  scoresContainer: {
    marginBottom: 30,
  },
  fortuneCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  fortuneCardContent: {
    flex: 1,
  },
  fortuneCardTitle: {
    fontSize: 16,
    color: '#E8E8E8',
    fontWeight: '600',
    marginBottom: 8,
  },
  starRating: {
    flexDirection: 'row',
  },
  fortuneScore: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  luckySection: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  luckyItem: {
    marginBottom: 15,
  },
  luckyLabel: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: '600',
    marginBottom: 8,
  },
  luckyColorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  luckyColorSwatch: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#fff',
  },
  luckyColorText: {
    fontSize: 16,
    color: '#E8E8E8',
    fontWeight: '500',
  },
  luckyNumber: {
    fontSize: 24,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  backButtonText: {
    color: '#E8E8E8',
    fontSize: 16,
    fontWeight: '500',
  },
  fortuneRevealContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fortuneRevealText: {
    fontSize: 20,
    color: '#FFD700',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default DailyZodiacFortuneScreen; 