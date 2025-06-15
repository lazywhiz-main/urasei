import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface OnboardingScreenProps {
  navigation: any;
}

// オンボーディング画面コンポーネント（元のホーム画面デザイン）
const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const moonRotation = useRef(new Animated.Value(0)).current;
  const starOpacity = useRef(new Animated.Value(0.5)).current;
  const cardScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 月の回転アニメーション
    const moonAnimation = Animated.loop(
      Animated.timing(moonRotation, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
      }),
      { iterations: -1 }
    );

    // 星の点滅アニメーション
    const starAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(starOpacity, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(starOpacity, {
          toValue: 0.5,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
      { iterations: -1 }
    );

    // カードの浮遊アニメーション
    const cardAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(cardScale, {
          toValue: 1.02,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(cardScale, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
      ]),
      { iterations: -1 }
    );

    moonAnimation.start();
    starAnimation.start();
    cardAnimation.start();
  }, []);

  const moonRotationInterpolated = moonRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleEnterStarSanctuary = () => {
    navigation.navigate('StarSanctuary');
  };

  const handleDirectDivination = () => {
    navigation.navigate('Divination');
  };

  const handleDirectWaruiko = () => {
    navigation.navigate('Waruiko');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* 宇宙背景グラデーション */}
      <LinearGradient
        colors={['#2d1b69', '#1a0f3d', '#0d0621', '#030014']}
        style={styles.background}
      >
        
        {/* 星々の背景 */}
        <View style={styles.starsContainer}>
          {[...Array(20)].map((_, index) => (
            <Animated.View
              key={index}
              style={[
                styles.star,
                {
                  left: `${Math.random() * 90 + 5}%`,
                  top: `${Math.random() * 80 + 10}%`,
                  opacity: starOpacity,
                },
              ]}
            />
          ))}
        </View>

        {/* メインコンテンツ */}
        <View style={styles.content}>
          {/* 月のアニメーション */}
          <View style={styles.moonContainer}>
            <Animated.View
              style={[
                styles.moonPhase,
                {
                  transform: [{ rotate: moonRotationInterpolated }],
                },
              ]}
            >
              <Animated.Text style={[styles.moonStar, { opacity: starOpacity }]}>
                ⭐
              </Animated.Text>
            </Animated.View>
          </View>

          {/* メインカード */}
          <Animated.View
            style={[
              styles.todayCard,
              {
                transform: [{ scale: cardScale }],
              },
            ]}
          >
            <Text style={styles.cardTitle}>占いの世界へようこそ ✦</Text>
            <Text style={styles.cardDescription}>
              宇宙の神秘があなたを待っています。心の奥に秘めた想いを、星々に託してみませんか。
            </Text>
          </Animated.View>

          {/* アクションボタン */}
          <View style={styles.actionButtons}>
            {/* メインナビゲーションボタン */}
            <TouchableOpacity 
              style={styles.primaryButton}
              activeOpacity={0.8}
              onPress={handleEnterStarSanctuary}
            >
              <LinearGradient
                colors={['#a855f7', '#ec4899', '#f59e0b']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>⭐ 星の聖域へ進む</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            {/* クイックアクセスボタン */}
            <View style={styles.quickActions}>
              <TouchableOpacity 
                style={styles.quickButton}
                activeOpacity={0.8}
                onPress={handleDirectDivination}
              >
                <LinearGradient
                  colors={['#9333ea', '#3b82f6', '#a855f7']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.quickButtonGradient}
                >
                  <Text style={styles.quickButtonText}>🔮 占い</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.quickButton}
                activeOpacity={0.8}
                onPress={handleDirectWaruiko}
              >
                <LinearGradient
                  colors={['#9333ea', '#3b82f6', '#a855f7']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.quickButtonGradient}
                >
                  <Text style={styles.quickButtonText}>🌙 わるいこ</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030014',
  },
  background: {
    flex: 1,
  },
  starsContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  star: {
    position: 'absolute',
    width: 2,
    height: 2,
    backgroundColor: '#a855f7',
    borderRadius: 1,
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 3,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  moonContainer: {
    marginBottom: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moonPhase: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#a855f7',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20,
  },
  moonStar: {
    fontSize: 24,
    color: '#fff',
  },
  todayCard: {
    backgroundColor: 'rgba(45, 27, 105, 0.4)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 40,
    width: width * 0.85,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.3)',
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 15,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E0E1DD',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 1,
  },
  cardDescription: {
    fontSize: 14,
    color: '#E0E1DD',
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.9,
  },
  actionButtons: {
    width: '100%',
    alignItems: 'center',
  },
  primaryButton: {
    width: '100%',
    marginBottom: 20,
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 15,
  },
  quickButton: {
    flex: 1,
  },
  quickButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#9333ea',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  quickButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});

export default OnboardingScreen; 