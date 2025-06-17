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
import { ZodiacSign, CompatibilityResult, UserProfile } from '../types/astrology';

const { width, height } = Dimensions.get('window');

type RootStackParamList = {
  AstrologyMenu: undefined;
  ZodiacDetection: undefined;
};

type ZodiacCompatibilityScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'AstrologyMenu'>;
};

const ZodiacCompatibilityScreen: React.FC<ZodiacCompatibilityScreenProps> = ({ navigation }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [selectedPartnerSign, setSelectedPartnerSign] = useState<ZodiacSign | null>(null);
  const [compatibilityResult, setCompatibilityResult] = useState<CompatibilityResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; opacity: Animated.Value }>>([]);

  // アニメーション値
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const analysisRevealAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    checkUserProfile();
    generateStars();
    startAnimations();
  }, []);

  const generateStars = () => {
    const newStars = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height,
      opacity: new Animated.Value(Math.random()),
    }));
    setStars(newStars);
  };

  const startAnimations = () => {
    // フェードインアニメーション
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // 星の瞬きアニメーション
    stars.forEach((star, index) => {
      const twinkle = () => {
        Animated.sequence([
          Animated.timing(star.opacity, {
            toValue: Math.random(),
            duration: 1000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
        ]).start(() => twinkle());
      };
      setTimeout(() => twinkle(), index * 100);
    });
  };

  const checkUserProfile = async () => {
    try {
      const profile = await AstrologyService.getUserProfile();
      if (profile) {
        setUserProfile(profile);
      } else {
        Alert.alert(
          '星座が未設定です',
          '先に星座を判定してください',
          [
            {
              text: '星座判定へ',
              onPress: () => navigation.navigate('ZodiacDetection'),
            },
            {
              text: 'メニューに戻る',
              onPress: () => navigation.navigate('AstrologyMenu'),
            },
          ]
        );
      }
    } catch (error) {
      console.error('プロフィールの取得に失敗:', error);
    }
  };

  const analyzeCompatibility = async () => {
    if (!userProfile || !selectedPartnerSign) return;

    setIsAnalyzing(true);
    
    // 分析アニメーション開始
    Animated.timing(analysisRevealAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    try {
      setTimeout(async () => {
        const result = AstrologyService.calculateCompatibility(
          userProfile.zodiacSign,
          selectedPartnerSign
        );

        const compatibilityResult: CompatibilityResult = {
          id: `compatibility_${Date.now()}`,
          userSign: userProfile.zodiacSign,
          partnerSign: selectedPartnerSign,
          compatibility: result.compatibility,
          analysis: result.analysis,
          advice: result.advice,
          createdAt: new Date().toISOString(),
        };

        await AstrologyService.saveCompatibilityResult(compatibilityResult);
        setCompatibilityResult(compatibilityResult);
        setIsAnalyzing(false);
        
        // 分析アニメーション終了
        Animated.timing(analysisRevealAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }, 1500);
    } catch (error) {
      console.error('相性診断に失敗:', error);
      setIsAnalyzing(false);
      Animated.timing(analysisRevealAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  };

  const getCompatibilityColor = (score: number): string => {
    if (score >= 85) return '#FF69B4'; // ピンク
    if (score >= 70) return '#FFD700'; // ゴールド
    if (score >= 55) return '#87CEEB'; // スカイブルー
    return '#DDA0DD'; // プラム
  };

  const zodiacSigns: ZodiacSign[] = [
    'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
    'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
  ];

  return (
    <View style={styles.outerContainer}>
      {/* フルスクリーン背景 */}
      <LinearGradient
        colors={['#0F0C29', '#24243e', '#2E1B69', '#24243e']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.fullScreenBackground}
      />

      {/* 星の背景 */}
      {stars.map((star) => (
        <Animated.View
          key={star.id}
          style={[
            styles.star,
            {
              left: star.x,
              top: star.y,
              opacity: star.opacity,
            },
          ]}
        />
      ))}

      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* ヘッダー */}
            <View style={styles.header}>
              <Text style={styles.title}>💕 星座相性診断 💕</Text>
              {userProfile && (
                <View style={styles.userInfo}>
                  <Text style={styles.userInfoText}>
                    あなた: {ZODIAC_MASTERS[userProfile.zodiacSign].symbol} {ZODIAC_MASTERS[userProfile.zodiacSign].name}
                  </Text>
                </View>
              )}
            </View>

            {/* パートナー星座選択 */}
            {!compatibilityResult && (
              <View style={styles.selectionSection}>
                <Text style={styles.sectionTitle}>相手の星座を選んでください</Text>
                <View style={styles.zodiacGrid}>
                  {zodiacSigns.map((sign) => (
                    <TouchableOpacity
                      key={sign}
                      style={[
                        styles.zodiacButton,
                        selectedPartnerSign === sign && styles.zodiacButtonSelected
                      ]}
                      onPress={() => setSelectedPartnerSign(sign)}
                      disabled={isAnalyzing}
                    >
                      <Text style={styles.zodiacSymbol}>
                        {ZODIAC_MASTERS[sign].symbol}
                      </Text>
                      <Text style={styles.zodiacName}>
                        {ZODIAC_MASTERS[sign].name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {selectedPartnerSign && (
                  <TouchableOpacity
                    style={styles.analyzeButton}
                    onPress={analyzeCompatibility}
                    disabled={isAnalyzing}
                  >
                    <LinearGradient
                      colors={isAnalyzing ? ['#666', '#444'] : ['#FF69B4', '#FF1493', '#DC143C']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.analyzeButtonGradient}
                    >
                      <Text style={styles.analyzeButtonText}>
                        {isAnalyzing ? '💫 分析中... 💫' : '💕 相性を診断する 💕'}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* 相性結果 */}
            {compatibilityResult && (
              <View style={styles.resultSection}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultTitle}>相性診断結果</Text>
                  <View style={styles.resultPair}>
                    <View style={styles.signInfo}>
                      <Text style={styles.signSymbol}>
                        {ZODIAC_MASTERS[compatibilityResult.userSign].symbol}
                      </Text>
                      <Text style={styles.signName}>
                        {ZODIAC_MASTERS[compatibilityResult.userSign].name}
                      </Text>
                    </View>
                    <Text style={styles.heartSymbol}>💕</Text>
                    <View style={styles.signInfo}>
                      <Text style={styles.signSymbol}>
                        {ZODIAC_MASTERS[compatibilityResult.partnerSign].symbol}
                      </Text>
                      <Text style={styles.signName}>
                        {ZODIAC_MASTERS[compatibilityResult.partnerSign].name}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.scoreCard}>
                  <Text style={styles.scoreLabel}>相性度</Text>
                  <Text style={[
                    styles.scoreValue,
                    { color: getCompatibilityColor(compatibilityResult.compatibility) }
                  ]}>
                    {compatibilityResult.compatibility}%
                  </Text>
                </View>

                <View style={styles.analysisCard}>
                  <Text style={styles.analysisTitle}>相性分析</Text>
                  <Text style={styles.analysisText}>
                    {compatibilityResult.analysis}
                  </Text>
                </View>

                <View style={styles.adviceCard}>
                  <Text style={styles.adviceTitle}>アドバイス</Text>
                  <Text style={styles.adviceText}>
                    {compatibilityResult.advice}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={() => {
                    setCompatibilityResult(null);
                    setSelectedPartnerSign(null);
                  }}
                >
                  <Text style={styles.resetButtonText}>別の星座で診断する</Text>
                </TouchableOpacity>
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
          </Animated.View>
        </ScrollView>

        {/* 分析アニメーション */}
        {isAnalyzing && (
          <Animated.View
            style={[
              styles.analysisRevealContainer,
              {
                opacity: analysisRevealAnim,
                transform: [
                  {
                    scale: analysisRevealAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.analysisRevealText}>
              💫 星々が二人の相性を分析しています... 💫
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
    color: '#FF69B4',
    textAlign: 'center',
    marginBottom: 20,
  },
  userInfo: {
    backgroundColor: 'rgba(255, 105, 180, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 105, 180, 0.3)',
  },
  userInfoText: {
    fontSize: 16,
    color: '#FF69B4',
    fontWeight: '600',
  },
  selectionSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#E8E8E8',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  zodiacGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  zodiacButton: {
    width: (width - 60) / 3,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  zodiacButtonSelected: {
    backgroundColor: 'rgba(255, 105, 180, 0.2)',
    borderColor: '#FF69B4',
  },
  zodiacSymbol: {
    fontSize: 20,
    marginBottom: 5,
  },
  zodiacName: {
    fontSize: 12,
    color: '#E8E8E8',
    textAlign: 'center',
    fontWeight: '500',
  },
  analyzeButton: {
    borderRadius: 25,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  analyzeButtonGradient: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  analyzeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  resultSection: {
    marginBottom: 30,
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 20,
    color: '#FF69B4',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  resultPair: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInfo: {
    alignItems: 'center',
    marginHorizontal: 15,
  },
  signSymbol: {
    fontSize: 24,
    marginBottom: 5,
  },
  signName: {
    fontSize: 14,
    color: '#E8E8E8',
    fontWeight: '600',
  },
  heartSymbol: {
    fontSize: 20,
    marginHorizontal: 10,
  },
  scoreCard: {
    backgroundColor: 'rgba(255, 105, 180, 0.1)',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 105, 180, 0.3)',
  },
  scoreLabel: {
    fontSize: 16,
    color: '#E8E8E8',
    marginBottom: 10,
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  analysisCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
  },
  analysisTitle: {
    fontSize: 16,
    color: '#FF69B4',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  analysisText: {
    fontSize: 14,
    color: '#E8E8E8',
    lineHeight: 20,
  },
  adviceCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  adviceTitle: {
    fontSize: 16,
    color: '#87CEEB',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  adviceText: {
    fontSize: 14,
    color: '#E8E8E8',
    lineHeight: 20,
  },
  resetButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  resetButtonText: {
    color: '#E8E8E8',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  backButton: {
    backgroundColor: 'rgba(255, 105, 180, 0.2)',
    borderRadius: 25,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 105, 180, 0.4)',
  },
  backButtonText: {
    color: '#FF69B4',
    fontSize: 16,
    fontWeight: '600',
  },
  analysisRevealContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  analysisRevealText: {
    fontSize: 18,
    color: '#FF69B4',
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default ZodiacCompatibilityScreen; 