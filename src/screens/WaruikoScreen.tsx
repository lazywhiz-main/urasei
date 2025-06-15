import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { WaruikoIcon, BackIcon, RecordIcon } from '../components/Icons';

const { width, height } = Dimensions.get('window');

interface WaruikoScreenProps {
  navigation: any;
}

const WaruikoScreen: React.FC<WaruikoScreenProps> = ({ navigation }) => {
  const [stars] = useState(() => 
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: Math.random() * width,
      top: Math.random() * height * 0.8,
      opacity: new Animated.Value(Math.random()),
      size: Math.random() * 2 + 1,
    }))
  );

  const [monsterScale] = useState(new Animated.Value(1));
  const [particles] = useState(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      translateY: new Animated.Value(0),
      opacity: new Animated.Value(0.7),
    }))
  );

  useEffect(() => {
    // 星のきらめきアニメーション
    stars.forEach((star, index) => {
      const animate = () => {
        Animated.sequence([
          Animated.timing(star.opacity, {
            toValue: Math.random() * 0.8 + 0.2,
            duration: 1500 + Math.random() * 2000,
            useNativeDriver: true,
          }),
          Animated.timing(star.opacity, {
            toValue: Math.random() * 0.3 + 0.1,
            duration: 1500 + Math.random() * 2000,
            useNativeDriver: true,
          }),
        ]).start(() => animate());
      };
      setTimeout(() => animate(), index * 300);
    });

    // わるいこの呼吸アニメーション
    const breatheAnimation = () => {
      Animated.sequence([
        Animated.timing(monsterScale, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(monsterScale, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]).start(() => breatheAnimation());
    };
    breatheAnimation();

    // パーティクルアニメーション
    particles.forEach((particle, index) => {
      const animateParticle = () => {
        Animated.parallel([
          Animated.timing(particle.translateY, {
            toValue: -50,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(particle.opacity, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(particle.opacity, {
              toValue: 0,
              duration: 2500,
              useNativeDriver: true,
            }),
          ]),
        ]).start(() => {
          particle.translateY.setValue(0);
          particle.opacity.setValue(0.7);
          setTimeout(() => animateParticle(), Math.random() * 2000);
        });
      };
      setTimeout(() => animateParticle(), index * 500);
    });
  }, []);

  const handleWriteNote = () => {
    navigation.navigate('WriteNote');
  };

  const handleViewRecords = () => {
    navigation.navigate('NotesHistory');
  };

  const handlePurification = () => {
    navigation.navigate('Purification');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0f0f23', '#1a0f3d', '#2d1b69', '#1a0f3d']}
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

        {/* パーティクル */}
        {particles.map((particle, index) => (
          <Animated.View
            key={particle.id}
            style={[
              styles.particle,
              {
                left: width * 0.2 + (index % 3) * (width * 0.2),
                top: height * 0.4 + Math.floor(index / 3) * 100,
                transform: [{ translateY: particle.translateY }],
                opacity: particle.opacity,
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
          <Text style={styles.headerTitle}>わるいこノート</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* メインコンテンツ */}
          <View style={styles.content}>
            <View style={styles.monsterContainer}>
              <Animated.View
                style={[
                  styles.monsterWrapper,
                  {
                    transform: [{ scale: monsterScale }],
                  },
                ]}
              >
                <WaruikoIcon size={100} />
              </Animated.View>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.title}>心の重荷を預けましょう</Text>
              <Text style={styles.subtitle}>
                わるいこたちが優しく受け止めて{'\n'}
                浄化のお手伝いをします
              </Text>
            </View>

            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleWriteNote}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#9333ea', '#3b82f6', '#a855f7']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.primaryButtonText}>今日の気持ちを書く</Text>
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.secondaryButtonsContainer}>
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={handleViewRecords}
                  activeOpacity={0.8}
                >
                  <RecordIcon size={24} />
                  <Text style={styles.secondaryButtonText}>記録を見る</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={handlePurification}
                  activeOpacity={0.8}
                >
                  <View style={styles.purificationIcon}>
                    <Text style={styles.purificationEmoji}>✨</Text>
                  </View>
                  <Text style={styles.secondaryButtonText}>浄化する</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.infoContainer}>
              <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>わるいこノートとは？</Text>
                <Text style={styles.infoText}>
                  ネガティブな感情や出来事を書き留めることで、{'\n'}
                  心の整理をお手伝いします。{'\n'}
                  わるいこたちが優しく受け止めて、{'\n'}
                  浄化の力で心を軽やかにします。
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
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
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: '#ec4899',
    borderRadius: 2,
  },
  scrollView: {
    flex: 1,
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
    backgroundColor: 'rgba(147, 51, 234, 0.2)',
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
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingBottom: 50,
  },
  monsterContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
  monsterWrapper: {
    shadowColor: '#9333ea',
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
    marginBottom: 15,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#9333ea',
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 24,
  },
  actionsContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  primaryButton: {
    width: width * 0.8,
    height: 60,
    borderRadius: 30,
    marginBottom: 30,
    shadowColor: '#3b82f6',
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
  primaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },
  secondaryButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 20,
    backgroundColor: 'rgba(147, 51, 234, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(147, 51, 234, 0.4)',
    minWidth: 120,
  },
  secondaryButtonText: {
    color: '#9333ea',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  purificationIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  purificationEmoji: {
    fontSize: 20,
  },
  infoContainer: {
    width: '100%',
  },
  infoCard: {
    backgroundColor: 'rgba(45, 27, 105, 0.3)',
    borderRadius: 20,
    padding: 25,
    borderWidth: 1,
    borderColor: 'rgba(147, 51, 234, 0.3)',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ec4899',
    marginBottom: 15,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#E0E1DD',
    lineHeight: 22,
    textAlign: 'center',
    opacity: 0.8,
  },
});

export default WaruikoScreen; 