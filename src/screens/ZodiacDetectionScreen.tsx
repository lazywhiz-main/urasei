import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Dimensions,
  Alert,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
// Pickerの代わりにScrollViewとTouchableOpacityを使用
import { StackNavigationProp } from '@react-navigation/stack';
import { AstrologyService } from '../services/astrologyService';
import { getZodiacSign, ZODIAC_MASTERS } from '../data/zodiacData';
import { UserProfile } from '../types/astrology';

type RootStackParamList = {
  AstrologyMenu: undefined;
  DailyZodiacFortune: undefined;
};

type ZodiacDetectionScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'AstrologyMenu'>;
};

const { width, height } = Dimensions.get('window');

const ZodiacDetectionScreen: React.FC<ZodiacDetectionScreenProps> = ({ navigation }) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(1);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
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
  const zodiacRevealAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    generateStars();
    startAnimations();
  }, []);

  const generateStars = () => {
    const starArray = [];
    for (let i = 0; i < 40; i++) {
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
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // 星の点滅
    stars.forEach((star, index) => {
      const twinkle = () => {
        Animated.timing(star.opacity, {
          toValue: Math.random() * 0.8 + 0.2,
          duration: Math.random() * 2000 + 1000,
          useNativeDriver: true,
        }).start(() => twinkle());
      };
      setTimeout(() => twinkle(), index * 100);
    });
  };

  const getDaysInMonth = (month: number): number => {
    const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return daysInMonth[month - 1];
  };

  const handleDetectZodiac = async () => {
    setIsProcessing(true);

    try {
      // 星座判定
      const zodiacSign = getZodiacSign(selectedMonth, selectedDay);
      const zodiacInfo = ZODIAC_MASTERS[zodiacSign];

      // 星座判定アニメーション
      Animated.timing(zodiacRevealAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();

      // プロフィール保存
      const profile: UserProfile = {
        birthMonth: selectedMonth,
        birthDay: selectedDay,
        zodiacSign,
      };

      await AstrologyService.saveUserProfile(profile);

      // 結果表示
      setTimeout(() => {
        Alert.alert(
          '✨ 星座判定完了 ✨',
          `あなたは${zodiacInfo.symbol} ${zodiacInfo.name}です！\n\n${zodiacInfo.characteristic}`,
          [
            {
              text: '運勢を見る',
              onPress: () => navigation.navigate('DailyZodiacFortune'),
            },
            {
              text: 'メニューに戻る',
              onPress: () => navigation.navigate('AstrologyMenu'),
            },
          ]
        );
      }, 1500);
    } catch (error) {
      console.error('Failed to detect zodiac:', error);
      Alert.alert('エラー', '星座の判定に失敗しました。');
    } finally {
      setIsProcessing(false);
    }
  };

  const months = Array.from({ length: 12 }, (_, i) => ({
    label: `${i + 1}月`,
    value: i + 1,
  }));

  const days = Array.from({ length: getDaysInMonth(selectedMonth) }, (_, i) => ({
    label: `${i + 1}日`,
    value: i + 1,
  }));

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
            <Text style={styles.title}>🔮 星座判定 🔮</Text>
            <Text style={styles.subtitle}>
              あなたの誕生日を教えてください{'\n'}星々があなたの運命を読み解きます
            </Text>
          </View>

          {/* 誕生日選択 */}
          <View style={styles.birthdayContainer}>
            <Text style={styles.sectionTitle}>誕生日</Text>
            
            <View style={styles.selectorsContainer}>
              {/* 月選択 */}
              <View style={styles.selectorWrapper}>
                <Text style={styles.selectorLabel}>月</Text>
                <TouchableOpacity style={styles.selectorButton}>
                  <Text style={styles.selectorButtonText}>{selectedMonth}月</Text>
                  <View style={styles.selectorDropdown}>
                    <ScrollView style={styles.selectorScrollView} showsVerticalScrollIndicator={false}>
                      {months.map((month) => (
                        <TouchableOpacity
                          key={month.value}
                          style={[
                            styles.selectorOption,
                            selectedMonth === month.value && styles.selectorOptionSelected
                          ]}
                          onPress={() => {
                            setSelectedMonth(month.value);
                            // 月が変わったら日を調整
                            const maxDay = getDaysInMonth(month.value);
                            if (selectedDay > maxDay) {
                              setSelectedDay(maxDay);
                            }
                          }}
                        >
                          <Text style={[
                            styles.selectorOptionText,
                            selectedMonth === month.value && styles.selectorOptionTextSelected
                          ]}>
                            {month.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </TouchableOpacity>
              </View>

              {/* 日選択 */}
              <View style={styles.selectorWrapper}>
                <Text style={styles.selectorLabel}>日</Text>
                <TouchableOpacity style={styles.selectorButton}>
                  <Text style={styles.selectorButtonText}>{selectedDay}日</Text>
                  <View style={styles.selectorDropdown}>
                    <ScrollView style={styles.selectorScrollView} showsVerticalScrollIndicator={false}>
                      {days.map((day) => (
                        <TouchableOpacity
                          key={day.value}
                          style={[
                            styles.selectorOption,
                            selectedDay === day.value && styles.selectorOptionSelected
                          ]}
                          onPress={() => setSelectedDay(day.value)}
                        >
                          <Text style={[
                            styles.selectorOptionText,
                            selectedDay === day.value && styles.selectorOptionTextSelected
                          ]}>
                            {day.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* 星座判定ボタン */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.detectButton, isProcessing && styles.buttonDisabled]}
              onPress={handleDetectZodiac}
              disabled={isProcessing}
            >
              <LinearGradient
                colors={isProcessing ? ['#666', '#444'] : ['#FFD700', '#FFA500', '#FF6B47']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>
                  {isProcessing ? '✨ 星座を読み取り中... ✨' : '⭐ 星座を判定する ⭐'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* 星座判定結果アニメーション */}
          {isProcessing && (
            <Animated.View
              style={[
                styles.zodiacRevealContainer,
                {
                  opacity: zodiacRevealAnim,
                  transform: [
                    {
                      scale: zodiacRevealAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.8, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.zodiacRevealText}>
                🌟 星々が語りかけています... 🌟
              </Text>
            </Animated.View>
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
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: '#E8E8E8',
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 22,
  },
  birthdayContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 30,
  },
  selectorsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  selectorWrapper: {
    alignItems: 'center',
  },
  selectorLabel: {
    fontSize: 16,
    color: '#E8E8E8',
    marginBottom: 10,
    fontWeight: '600',
  },
  selectorButton: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    paddingVertical: 15,
    paddingHorizontal: 25,
    minWidth: 100,
    alignItems: 'center',
  },
  selectorButtonText: {
    fontSize: 18,
    color: '#FFD700',
    fontWeight: '600',
  },
  selectorDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'rgba(26, 15, 61, 0.95)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    maxHeight: 120,
    zIndex: 1000,
  },
  selectorScrollView: {
    maxHeight: 120,
  },
  selectorOption: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.1)',
  },
  selectorOptionSelected: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
  },
  selectorOptionText: {
    fontSize: 16,
    color: '#E8E8E8',
    textAlign: 'center',
  },
  selectorOptionTextSelected: {
    color: '#FFD700',
    fontWeight: '600',
  },
  buttonContainer: {
    paddingVertical: 30,
  },
  detectButton: {
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  zodiacRevealContainer: {
    position: 'absolute',
    top: '50%',
    left: 20,
    right: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 20,
    padding: 30,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  zodiacRevealText: {
    fontSize: 18,
    color: '#FFD700',
    textAlign: 'center',
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: '#B8B8B8',
    textAlign: 'center',
  },
});

export default ZodiacDetectionScreen; 