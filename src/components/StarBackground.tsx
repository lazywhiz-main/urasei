import React, { useEffect, useState, useRef } from 'react';
import { View, Animated, Dimensions, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface StarBackgroundProps {
  intensity?: 'minimal' | 'normal' | 'intense';
  variant?: 'home' | 'divination' | 'notes' | 'settings';
  children?: React.ReactNode;
}

export const StarBackground: React.FC<StarBackgroundProps> = ({
  intensity = 'normal',
  variant = 'home',
  children,
}) => {
  // 星の数を強度に応じて調整
  const starCount = {
    minimal: 8,
    normal: 15,
    intense: 25,
  }[intensity];

  // バリアントに応じた色調整
  const gradientColors = {
    home: ['#2d1b69', '#1a0f3d', '#0d0621', '#030014'] as const,
    divination: ['#1a0f3d', '#2d1b69', '#4c1d95', '#0f0f23'] as const,
    notes: ['#0f0f23', '#1a0f3d', '#2d1b69', '#1a0f3d'] as const,
    settings: ['#0d0621', '#1a0f3d', '#2d1b69', '#0f0f23'] as const,
  }[variant];

  // 星々の状態
  const [stars] = useState(() => 
    Array.from({ length: starCount }, (_, i) => ({
      id: i,
      left: Math.random() * width,
      top: Math.random() * height * 0.8,
      opacity: new Animated.Value(Math.random() * 0.5 + 0.3),
      size: Math.random() * 2 + 1,
      speed: Math.random() * 2000 + 1000, // アニメーション速度のバリエーション
    }))
  );

  useEffect(() => {
    // 星のきらめきアニメーション
    const animations = stars.map((star, index) => {
      const animate = () => {
        Animated.sequence([
          Animated.timing(star.opacity, {
            toValue: Math.random() * 0.9 + 0.1,
            duration: star.speed,
            useNativeDriver: true,
          }),
          Animated.timing(star.opacity, {
            toValue: Math.random() * 0.4 + 0.1,
            duration: star.speed,
            useNativeDriver: true,
          }),
        ]).start(() => animate());
      };
      
      // ずらして開始
      setTimeout(() => animate(), index * 100);
      
      return animate;
    });

    // コンポーネントアンマウント時にクリーンアップ
    return () => {
      stars.forEach(star => {
        star.opacity.stopAnimation();
      });
    };
  }, [stars]);

  return (
    <View style={styles.container}>
      {/* 背景グラデーション */}
      <LinearGradient
        colors={gradientColors}
        locations={[0, 0.3, 0.7, 1]}
        style={styles.background}
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
      
      {/* 子コンポーネント */}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  background: {
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
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
}); 