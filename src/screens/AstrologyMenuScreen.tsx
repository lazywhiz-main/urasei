import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';
import { AstrologyService } from '../services/astrologyService';
import { UserProfile } from '../types/astrology';
import { ZODIAC_MASTERS } from '../data/zodiacData';
import { StarNavContainer } from '../components/StarNavContainer';

type RootStackParamList = {
  StarSanctuary: undefined;
  AstrologyMenu: undefined;
  ZodiacDetection: undefined;
  DailyZodiacFortune: undefined;
  ZodiacCompatibility: undefined;
  Horoscope: undefined;
  MoonPhase: undefined;
};

type AstrologyMenuScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'AstrologyMenu'>;
};

const { width, height } = Dimensions.get('window');

const AstrologyMenuScreen: React.FC<AstrologyMenuScreenProps> = ({ navigation }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [stars, setStars] = useState<Array<{
    id: number;
    left: number;
    top: number;
    size: number;
    opacity: Animated.Value;
  }>>([]);

  // アニメーション値
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    loadUserProfile();
    generateStars();
    startAnimations();
  }, []);

  const loadUserProfile = async () => {
    try {
      const profile = await AstrologyService.getUserProfile();
      setUserProfile(profile);
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  };

  const generateStars = () => {
    const starArray = [];
    for (let i = 0; i < 80; i++) {
      starArray.push({
        id: i,
        left: Math.random() * width,
        top: Math.random() * height,
        size: Math.random() * 3 + 1,
        opacity: new Animated.Value(Math.random() * 0.8 + 0.2),
      });
    }
    setStars(starArray);
  };

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // 星の点滅
    stars.forEach((star, index) => {
      const twinkle = () => {
        Animated.timing(star.opacity, {
          toValue: Math.random() * 0.8 + 0.2,
          duration: Math.random() * 3000 + 1000,
          useNativeDriver: true,
        }).start(() => twinkle());
      };
      setTimeout(() => twinkle(), index * 80);
    });
  };

  const renderMenuItem = (
    title: string,
    description: string,
    icon: string,
    screenName: keyof RootStackParamList,
    isComingSoon = false
  ) => (
    <TouchableOpacity
      key={title}
      style={[styles.menuItem, isComingSoon && styles.menuItemDisabled]}
      onPress={() => {
        if (!isComingSoon) {
          navigation.navigate(screenName);
        }
      }}
      disabled={isComingSoon}
    >
      <LinearGradient
        colors={
          isComingSoon
            ? ['rgba(100, 100, 100, 0.3)', 'rgba(60, 60, 60, 0.3)']
            : ['rgba(255, 215, 0, 0.1)', 'rgba(255, 140, 0, 0.1)']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.menuItemGradient}
      >
        <View style={styles.menuItemContent}>
          <Text style={styles.menuItemIcon}>{icon}</Text>
          <View style={styles.menuItemText}>
            <Text style={[
              styles.menuItemTitle,
              isComingSoon && styles.menuItemTitleDisabled
            ]}>
              {title}
              {isComingSoon && ' (準備中)'}
            </Text>
            <Text style={[
              styles.menuItemDescription,
              isComingSoon && styles.menuItemDescriptionDisabled
            ]}>
              {description}
            </Text>
          </View>
          <Text style={[
            styles.menuItemArrow,
            isComingSoon && styles.menuItemArrowDisabled
          ]}>
            {isComingSoon ? '⏳' : '→'}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.outerContainer}>
      {/* 全画面背景 */}
      <LinearGradient
        colors={['#0f0f23', '#1a0f3d', '#2d1b69', '#1a0f3d']}
        locations={[0, 0.3, 0.7, 1]}
        style={styles.fullScreenBackground}
      />

      {/* 星々 */}
      {stars.map((star) => (
        <Animated.View
          key={star.id}
          style={[
            styles.star,
            {
              left: star.left,
              top: star.top,
              opacity: star.opacity,
              width: star.size,
              height: star.size,
            },
          ]}
        />
      ))}

      <SafeAreaView style={styles.container}>
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
            <Text style={styles.title}>✨ 占星術の間 ✨</Text>
            <Text style={styles.subtitle}>
              星座の神秘的な力があなたを導きます
            </Text>
            
            {userProfile && (
              <View style={styles.userCard}>
                <Text style={styles.userCardTitle}>あなたの星座</Text>
                <View style={styles.zodiacInfo}>
                  <Text style={styles.zodiacSymbol}>
                    {ZODIAC_MASTERS[userProfile.zodiacSign].symbol}
                  </Text>
                  <Text style={styles.zodiacName}>
                    {ZODIAC_MASTERS[userProfile.zodiacSign].name}
                  </Text>
                </View>
                <Text style={styles.zodiacCharacteristic}>
                  {ZODIAC_MASTERS[userProfile.zodiacSign].characteristic}
                </Text>
              </View>
            )}
          </View>

          {/* メニュー */}
          <View style={styles.menuContainer}>
            {renderMenuItem(
              '星座を調べる',
              '誕生日から星座を判定',
              '🔮',
              'ZodiacDetection'
            )}
            
            {renderMenuItem(
              '今日の星座運勢',
              '12星座の日々の運勢',
              '⭐',
              'DailyZodiacFortune'
            )}
            
            {renderMenuItem(
              '星座相性診断',
              '2つの星座の相性をチェック',
              '💕',
              'ZodiacCompatibility'
            )}
            
            {renderMenuItem(
              'ホロスコープ',
              '詳細な出生図と日運',
              '🌌',
              'Horoscope'
            )}
            
            {renderMenuItem(
              '月の満ち欠け',
              '月齢に基づく運勢',
              '🌙',
              'MoonPhase',
              true // Phase 3で実装予定
            )}
          </View>

          {/* フッター */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              古より伝わる星座の智慧があなたを導きます
            </Text>
          </View>
        </Animated.View>

        {/* StarNav */}
        <StarNavContainer 
          currentStar="sanctuary" 
        />
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
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#E8E8E8',
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 22,
  },
  userCard: {
    marginTop: 20,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  userCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 10,
  },
  zodiacInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  zodiacSymbol: {
    fontSize: 24,
    marginRight: 10,
  },
  zodiacName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  zodiacCharacteristic: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
  },
  menuItem: {
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  menuItemDisabled: {
    opacity: 0.5,
  },
  menuItemGradient: {
    padding: 20,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  menuItemTitleDisabled: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  menuItemDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  menuItemDescriptionDisabled: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  menuItemArrow: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  menuItemArrowDisabled: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#B8B8B8',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default AstrologyMenuScreen; 