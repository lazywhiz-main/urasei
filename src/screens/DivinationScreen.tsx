import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DivinationIcon, BackIcon } from '../components/Icons';

const { width, height } = Dimensions.get('window');

interface DivinationScreenProps {
  navigation: any;
}

const DivinationScreen: React.FC<DivinationScreenProps> = ({ navigation }) => {
  const [stars] = useState(() => 
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * width,
      top: Math.random() * height * 0.7,
      opacity: new Animated.Value(Math.random()),
      size: Math.random() * 3 + 1,
    }))
  );

  const [crystalScale] = useState(new Animated.Value(1));
  const [crystalRotation] = useState(new Animated.Value(0));

  useEffect(() => {
    // 星のきらめきアニメーション
    stars.forEach((star, index) => {
      const animate = () => {
        Animated.sequence([
          Animated.timing(star.opacity, {
            toValue: Math.random() * 0.8 + 0.2,
            duration: 1000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
          Animated.timing(star.opacity, {
            toValue: Math.random() * 0.3 + 0.1,
            duration: 1000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
        ]).start(() => animate());
      };
      setTimeout(() => animate(), index * 200);
    });

    // 水晶球のアニメーション
    const crystalAnimation = () => {
      Animated.parallel([
        Animated.sequence([
          Animated.timing(crystalScale, {
            toValue: 1.1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(crystalScale, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(crystalRotation, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        crystalRotation.setValue(0);
        crystalAnimation();
      });
    };
    crystalAnimation();
  }, []);

  const handleDivination = () => {
    // TODO: 占い機能の実装
    console.log('占いを開始');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1a0f3d', '#2d1b69', '#4c1d95', '#0f0f23']}
        locations={[0, 0.3, 0.7, 1]}
        style={styles.background}
      >
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

        {/* ヘッダー */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <BackIcon size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>神秘の占い</Text>
          <View style={styles.placeholder} />
        </View>

        {/* メインコンテンツ */}
        <View style={styles.content}>
          <View style={styles.crystalContainer}>
            <Animated.View
              style={[
                styles.crystalWrapper,
                {
                  transform: [
                    { scale: crystalScale },
                    {
                      rotate: crystalRotation.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg'],
                      }),
                    },
                  ],
                },
              ]}
            >
              <DivinationIcon size={120} />
            </Animated.View>
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.title}>運命の扉を開きましょう</Text>
            <Text style={styles.subtitle}>
              宇宙の神秘があなたの未来を照らします
            </Text>
          </View>

          <TouchableOpacity
            style={styles.divinationButton}
            onPress={handleDivination}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#a855f7', '#ec4899', '#f59e0b']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>占いを始める</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.optionButton}>
              <Text style={styles.optionText}>今日の運勢</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton}>
              <Text style={styles.optionText}>恋愛運</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton}>
              <Text style={styles.optionText}>仕事運</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  star: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E0E1DD',
    textAlign: 'center',
    letterSpacing: 1,
  },
  placeholder: {
    width: 44,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  crystalContainer: {
    marginBottom: 40,
  },
  crystalWrapper: {
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E0E1DD',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#a855f7',
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 24,
  },
  divinationButton: {
    width: width * 0.7,
    height: 60,
    borderRadius: 30,
    marginBottom: 40,
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 15,
  },
  buttonGradient: {
    flex: 1,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.4)',
  },
  optionText: {
    color: '#a855f7',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default DivinationScreen; 