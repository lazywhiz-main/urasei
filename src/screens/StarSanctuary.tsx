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
import { DivinationIcon, WaruikoIcon, RecordIcon, BackIcon } from '../components/Icons';
import { StarNavContainer } from '../components/StarNavContainer';

const { width, height } = Dimensions.get('window');

interface StarSanctuaryProps {
  navigation: any;
}

const StarSanctuary: React.FC<StarSanctuaryProps> = ({ navigation }) => {
  // 惑星の軌道アニメーション
  const [orbitRotation] = useState(new Animated.Value(0));
  const [planetPulse] = useState(() => ({
    divination: new Animated.Value(1),
    waruiko: new Animated.Value(1),
    record: new Animated.Value(1),
  }));

  // 星々のきらめき
  const [stars] = useState(() => 
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: Math.random() * width,
      top: Math.random() * height * 0.8,
      opacity: new Animated.Value(Math.random()),
      size: Math.random() * 2 + 1,
    }))
  );

  useEffect(() => {
    // 軌道回転アニメーション
    const orbitAnimation = Animated.loop(
      Animated.timing(orbitRotation, {
        toValue: 1,
        duration: 30000, // 30秒で1周
        useNativeDriver: true,
      })
    );

    // 惑星の脈動アニメーション
    const createPulseAnimation = (animatedValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1.1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
        { iterations: -1 }
      );
    };

    // 星のきらめきアニメーション
    stars.forEach((star, index) => {
      const animate = () => {
        Animated.sequence([
          Animated.timing(star.opacity, {
            toValue: Math.random() * 0.9 + 0.1,
            duration: 1000 + Math.random() * 3000,
            useNativeDriver: true,
          }),
          Animated.timing(star.opacity, {
            toValue: Math.random() * 0.4 + 0.1,
            duration: 1000 + Math.random() * 3000,
            useNativeDriver: true,
          }),
        ]).start(() => animate());
      };
      setTimeout(() => animate(), index * 100);
    });

    orbitAnimation.start();
    createPulseAnimation(planetPulse.divination, 0).start();
    createPulseAnimation(planetPulse.waruiko, 1000).start();
    createPulseAnimation(planetPulse.record, 2000).start();
  }, []);

  const handlePlanetPress = (planet: string) => {
    // ワープエフェクト後に画面遷移
    switch (planet) {
      case 'divination':
        navigation.navigate('Divination');
        break;
      case 'waruiko':
        navigation.navigate('Waruiko');
        break;
      case 'record':
        // TODO: 記録画面への遷移
        console.log('記録惑星へワープ');
        break;
    }
  };

  const orbitRotationInterpolated = orbitRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.outerContainer}>
      {/* 全画面背景 */}
      <LinearGradient
        colors={['#0a0a0a', '#1a0f3d', '#2d1b69', '#0f0f23']}
        locations={[0, 0.3, 0.6, 1]}
        style={styles.fullScreenBackground}
      />
      
      {/* 星々の背景 */}
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
        {/* ヘッダー */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <BackIcon size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>星の聖域</Text>
          <View style={styles.placeholder} />
        </View>

        {/* 中央の星 */}
        <View style={styles.spaceshipContainer}>
          <Animated.View
            style={[
              styles.spaceship,
              {
                transform: [{ rotate: orbitRotationInterpolated }],
              },
            ]}
          >
            <LinearGradient
              colors={['#4c1d95', '#a855f7', '#ec4899']}
              style={styles.spaceshipCore}
            >
              <Animated.Text style={[styles.centralStar, { opacity: planetPulse.divination }]}>
                ⭐
              </Animated.Text>
            </LinearGradient>
          </Animated.View>
        </View>

        {/* 軌道上の惑星 */}
        <Animated.View
          style={[
            styles.orbitContainer,
            {
              transform: [{ rotate: orbitRotationInterpolated }],
            },
          ]}
        >
          {/* 占いの惑星 */}
          <Animated.View
            style={[
              styles.planet,
              styles.divinationPlanet,
              {
                transform: [{ scale: planetPulse.divination }],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.planetButton}
              onPress={() => handlePlanetPress('divination')}
              activeOpacity={0.8}
            >
              <DivinationIcon size={50} />
              <Text style={styles.planetLabel}>占いの星</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* わるいこの惑星 */}
          <Animated.View
            style={[
              styles.planet,
              styles.waruikoPlanet,
              {
                transform: [{ scale: planetPulse.waruiko }],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.planetButton}
              onPress={() => handlePlanetPress('waruiko')}
              activeOpacity={0.8}
            >
              <WaruikoIcon size={50} />
              <Text style={styles.planetLabel}>わるいこ星</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* 記録の惑星 */}
          <Animated.View
            style={[
              styles.planet,
              styles.recordPlanet,
              {
                transform: [{ scale: planetPulse.record }],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.planetButton}
              onPress={() => handlePlanetPress('record')}
              activeOpacity={0.8}
            >
              <RecordIcon size={50} />
              <Text style={styles.planetLabel}>記録の星座</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>

        {/* 星の聖域情報 */}
        <View style={styles.cockpitInfo}>
          <Text style={styles.infoTitle}>星の聖域</Text>
          <Text style={styles.infoText}>⭐ 中央の星が全ての星座と繋がっています</Text>
          <Text style={styles.infoText}>✨ 宇宙の神秘が満ちています</Text>
          <Text style={styles.infoText}>🌟 導かれたい星を選んでください</Text>
        </View>

        {/* StarNavContainer追加 */}
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
  container: {
    flex: 1,
  },
  fullScreenBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E0E1DD',
    textAlign: 'center',
    letterSpacing: 1,
  },
  placeholder: {
    width: 44,
  },
  spaceshipContainer: {
    position: 'absolute',
    top: height * 0.4,
    left: width * 0.5 - 40,
    zIndex: 10,
  },
  spaceship: {
    width: 80,
    height: 80,
    borderRadius: 40,
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 20,
  },
  spaceshipCore: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centralStar: {
    fontSize: 32,
    color: '#fff',
  },
  orbitContainer: {
    position: 'absolute',
    top: height * 0.4 - 150,
    left: width * 0.5 - 150,
    width: 300,
    height: 300,
  },
  planet: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divinationPlanet: {
    top: 0,
    left: 110,
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(168, 85, 247, 0.5)',
  },
  waruikoPlanet: {
    top: 190,
    left: 30,
    backgroundColor: 'rgba(147, 51, 234, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(147, 51, 234, 0.5)',
  },
  recordPlanet: {
    top: 190,
    left: 190,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(245, 158, 11, 0.5)',
  },
  planetButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  planetLabel: {
    fontSize: 10,
    color: '#E0E1DD',
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '600',
  },
  cockpitInfo: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(45, 27, 105, 0.3)',
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.3)',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ec4899',
    marginBottom: 10,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 12,
    color: '#E0E1DD',
    marginBottom: 5,
    opacity: 0.8,
  },
});

export default StarSanctuary; 