import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AstrologyEngine, BirthChart, DailyTransit, PlanetPosition } from '../services/AstrologyEngine';
import { UserProfile } from '../types/astrology';
import { StarNavContainer } from '../components/StarNavContainer';
import HoroscopeChart from '../components/HoroscopeChart';
import { ZODIAC_MASTERS } from '../data/zodiacData';

type RootStackParamList = {
  AstrologyMenu: undefined;
  ZodiacDetection: undefined;
}

type HoroscopeScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'AstrologyMenu'>;
};

const HoroscopeScreen: React.FC<HoroscopeScreenProps> = ({ navigation }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [birthChart, setBirthChart] = useState<BirthChart | null>(null);
  const [dailyTransit, setDailyTransit] = useState<DailyTransit | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState<'birth' | 'daily'>('birth');
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    loadUserProfileAndChart();
  }, []);

  useEffect(() => {
    if (userProfile || birthChart) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [userProfile, birthChart]);

  const loadUserProfileAndChart = async () => {
    try {
      const profile = await AsyncStorage.getItem('userProfile');
      if (profile) {
        const parsedProfile: UserProfile = JSON.parse(profile);
        setUserProfile(parsedProfile);
        
        // 出生チャート生成
        if (parsedProfile.birthDate && parsedProfile.birthLocation) {
          const birthDate = new Date(parsedProfile.birthDate);
          const chart = AstrologyEngine.generateBirthChart(
            birthDate,
            parsedProfile.birthLocation.latitude || 35.6762, // デフォルト: 東京
            parsedProfile.birthLocation.longitude || 139.6503,
            parsedProfile.birthLocation.timezone || 'Asia/Tokyo'
          );
          setBirthChart(chart);
          
          // 今日の日運計算
          const today = new Date();
          const transit = AstrologyEngine.calculateDailyTransit(chart, today);
          setDailyTransit(transit);
        }
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      Alert.alert('エラー', 'プロフィール情報の読み込みに失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  const navigateToZodiacDetection = () => {
    navigation.navigate('ZodiacDetection');
  };

  const renderMoonPhaseIcon = (phase: DailyTransit['moonPhase']) => {
    const moonIcons = {
      'new': '🌑',
      'waxing_crescent': '🌒',
      'first_quarter': '🌓',
      'waxing_gibbous': '🌔',
      'full': '🌕',
      'waning_gibbous': '🌖',
      'last_quarter': '🌗',
      'waning_crescent': '🌘'
    };
    return moonIcons[phase] || '🌙';
  };

  const renderPlanetInfo = (planets: PlanetPosition[]) => {
    return planets.slice(0, 6).map((planet, index) => { // 主要天体のみ表示
      const planetData = AstrologyEngine.getPlanetData(planet.planet);
      const zodiacInfo = ZODIAC_MASTERS[planet.zodiacSign];
      
      return (
        <View key={planet.planet} style={styles.planetRow}>
          <Text style={styles.planetSymbol}>{planetData.symbol}</Text>
          <Text style={styles.planetName}>{planetData.name}</Text>
          <Text style={styles.zodiacSymbol}>{zodiacInfo.symbol}</Text>
          <Text style={styles.degree}>{Math.floor(planet.degree)}°</Text>
          {planet.retrograde && <Text style={styles.retrograde}>R</Text>}
        </View>
      );
    });
  };

  const renderEnergyBar = (energy: number) => {
    return (
      <View style={styles.energyBarContainer}>
        <View style={styles.energyBarBackground}>
          <View style={[styles.energyBarFill, { width: `${energy * 10}%` }]} />
        </View>
        <Text style={styles.energyText}>{energy}/10</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <LinearGradient colors={['#0F0C29', '#24243e', '#2E1B69']} style={styles.container}>
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>星々の配置を読み取り中...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (!userProfile || !birthChart) {
    return (
      <LinearGradient colors={['#0F0C29', '#24243e', '#2E1B69']} style={styles.container}>
        <SafeAreaView style={styles.container}>
          <StarNavContainer currentStar="divination" />
          
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataTitle}>ホロスコープの作成には</Text>
            <Text style={styles.noDataSubtitle}>出生情報が必要です</Text>
            
            <TouchableOpacity
              style={styles.detectionButton}
              onPress={navigateToZodiacDetection}
            >
              <LinearGradient
                colors={['#FFD700', '#FFA500']}
                style={styles.detectionButtonGradient}
              >
                <Text style={styles.detectionButtonText}>出生情報を入力する</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0F0C29', '#24243e', '#2E1B69']} style={styles.container}>
      <SafeAreaView style={styles.container}>
                 <StarNavContainer currentStar="divination" />
        
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
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
              <Text style={styles.title}>ホロスコープチャート</Text>
              <Text style={styles.subtitle}>
                {userProfile.name}の星図 - {ZODIAC_MASTERS[userProfile.zodiacSign].name}座
              </Text>
            </View>

            {/* ビュー切り替えボタン */}
            <View style={styles.viewToggle}>
              <TouchableOpacity
                style={[styles.toggleButton, selectedView === 'birth' && styles.toggleButtonActive]}
                onPress={() => setSelectedView('birth')}
              >
                <Text style={[styles.toggleText, selectedView === 'birth' && styles.toggleTextActive]}>
                  出生図
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, selectedView === 'daily' && styles.toggleButtonActive]}
                onPress={() => setSelectedView('daily')}
              >
                <Text style={[styles.toggleText, selectedView === 'daily' && styles.toggleTextActive]}>
                  今日の運勢
                </Text>
              </TouchableOpacity>
            </View>

            {/* ホロスコープチャート */}
            <View style={styles.chartContainer}>
              <HoroscopeChart
                birthChart={birthChart}
                transitPlanets={selectedView === 'daily' ? dailyTransit?.transitingPlanets : undefined}
                showAspects={true}
                showTransits={selectedView === 'daily'}
              />
            </View>

            {/* 詳細情報 */}
            {selectedView === 'birth' ? (
              <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>天体配置</Text>
                <View style={styles.planetList}>
                  {renderPlanetInfo(birthChart.planets)}
                </View>
                
                <Text style={styles.sectionTitle}>基本情報</Text>
                <View style={styles.basicInfo}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>アセンダント:</Text>
                    <Text style={styles.infoValue}>
                      {ZODIAC_MASTERS[birthChart.ascendant].symbol} {ZODIAC_MASTERS[birthChart.ascendant].name}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>MC:</Text>
                    <Text style={styles.infoValue}>
                      {ZODIAC_MASTERS[birthChart.midheaven].symbol} {ZODIAC_MASTERS[birthChart.midheaven].name}
                    </Text>
                  </View>
                </View>
              </View>
            ) : dailyTransit && (
              <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>今日のエネルギー</Text>
                <View style={styles.energySection}>
                  <Text style={styles.energyLabel}>全体運</Text>
                  {renderEnergyBar(dailyTransit.overallEnergy)}
                </View>
                
                <View style={styles.moonPhaseSection}>
                  <Text style={styles.moonPhaseText}>
                    {renderMoonPhaseIcon(dailyTransit.moonPhase)} 月相: {dailyTransit.moonPhase}
                  </Text>
                </View>
                
                <Text style={styles.sectionTitle}>今日のアドバイス</Text>
                <View style={styles.recommendationsList}>
                  {dailyTransit.recommendations.map((rec, index) => (
                    <Text key={index} style={styles.recommendationText}>
                      • {rec}
                    </Text>
                  ))}
                </View>
                
                {dailyTransit.significantAspects.length > 0 && (
                  <>
                    <Text style={styles.sectionTitle}>重要なアスペクト</Text>
                    <View style={styles.aspectsList}>
                      {dailyTransit.significantAspects.slice(0, 3).map((aspect, index) => {
                        const aspectData = AstrologyEngine.getAspectData(aspect.type);
                        const planet1Data = AstrologyEngine.getPlanetData(aspect.planet1);
                        const planet2Data = AstrologyEngine.getPlanetData(aspect.planet2);
                        
                        return (
                          <View key={index} style={styles.aspectRow}>
                            <Text style={styles.aspectText}>
                              {planet1Data.symbol} {aspectData.symbol} {planet2Data.symbol}
                            </Text>
                            <Text style={styles.aspectName}>
                              {planet1Data.name} {aspectData.name} {planet2Data.name}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  </>
                )}
              </View>
            )}

            {/* フッター */}
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.backButtonText}>占星術メニューに戻る</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#FFD700',
    textAlign: 'center',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  noDataTitle: {
    fontSize: 20,
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 10,
  },
  noDataSubtitle: {
    fontSize: 16,
    color: '#E8E8E8',
    textAlign: 'center',
    marginBottom: 30,
  },
  detectionButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  detectionButtonGradient: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  detectionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#E8E8E8',
    textAlign: 'center',
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    padding: 4,
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 20,
  },
  toggleButtonActive: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
  },
  toggleText: {
    fontSize: 14,
    color: '#E8E8E8',
  },
  toggleTextActive: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  infoSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#FFD700',
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  planetList: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  planetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.2)',
  },
  planetSymbol: {
    fontSize: 18,
    color: '#FFD700',
    width: 30,
  },
  planetName: {
    fontSize: 14,
    color: '#E8E8E8',
    flex: 1,
  },
  zodiacSymbol: {
    fontSize: 16,
    color: '#FFD700',
    width: 30,
  },
  degree: {
    fontSize: 14,
    color: '#E8E8E8',
    width: 40,
    textAlign: 'right',
  },
  retrograde: {
    fontSize: 12,
    color: '#FF6B6B',
    marginLeft: 5,
  },
  basicInfo: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#E8E8E8',
  },
  infoValue: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  energySection: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  energyLabel: {
    fontSize: 16,
    color: '#FFD700',
    marginBottom: 10,
    textAlign: 'center',
  },
  energyBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  energyBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    marginRight: 10,
  },
  energyBarFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 4,
  },
  energyText: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  moonPhaseSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  moonPhaseText: {
    fontSize: 16,
    color: '#E8E8E8',
  },
  recommendationsList: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  recommendationText: {
    fontSize: 14,
    color: '#E8E8E8',
    lineHeight: 20,
    marginBottom: 8,
  },
  aspectsList: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  aspectRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.2)',
  },
  aspectText: {
    fontSize: 16,
    color: '#FFD700',
    marginBottom: 4,
  },
  aspectName: {
    fontSize: 12,
    color: '#E8E8E8',
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
  },
});

export default HoroscopeScreen; 