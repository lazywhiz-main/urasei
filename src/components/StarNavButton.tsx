import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { Svg, Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

export interface StarConfig {
  id: string;
  color: string;
  glowColor: string;
  pulseSpeed: number;
  glowIntensity: number;
}

interface StarNavButtonProps {
  starType: 'sanctuary' | 'divination' | 'waruiko' | 'record' | 'settings';
  onPress: () => void;
  size?: number;
}

const STAR_CONFIGS: Record<string, StarConfig> = {
  sanctuary: {
    id: 'sanctuary',
    color: '#E8D5FF',
    glowColor: '#B794F6',
    pulseSpeed: 2000,
    glowIntensity: 0.8,
  },
  divination: {
    id: 'divination',
    color: '#FFE4B5',
    glowColor: '#F6AD55',
    pulseSpeed: 1800,
    glowIntensity: 0.7,
  },
  waruiko: {
    id: 'waruiko',
    color: '#FFCCCB',
    glowColor: '#F56565',
    pulseSpeed: 1600,
    glowIntensity: 0.6,
  },
  record: {
    id: 'record',
    color: '#B0E0E6',
    glowColor: '#4299E1',
    pulseSpeed: 2200,
    glowIntensity: 0.7,
  },
  settings: {
    id: 'settings',
    color: '#C6F6D5',
    glowColor: '#48BB78',
    pulseSpeed: 2400,
    glowIntensity: 0.6,
  },
};

export const StarNavButton: React.FC<StarNavButtonProps> = ({
  starType,
  onPress,
  size = 50,
}) => {
  const config = STAR_CONFIGS[starType];
  
  // 設定が見つからない場合のフォールバック
  if (!config) {
    console.error(`StarNavButton: Invalid starType "${starType}"`);
    return null;
  }
  
  const pulseAnim = useRef(new Animated.Value(0.6)).current;
  const glowAnim = useRef(new Animated.Value(0.4)).current;
  const rotationAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // パルスアニメーション
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: config.pulseSpeed / 2,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.6,
          duration: config.pulseSpeed / 2,
          useNativeDriver: true,
        }),
      ])
    );

    // グロウアニメーション
    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: config.glowIntensity,
          duration: config.pulseSpeed * 0.7,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.2,
          duration: config.pulseSpeed * 0.3,
          useNativeDriver: true,
        }),
      ])
    );

    // 回転アニメーション
    const rotationLoop = Animated.loop(
      Animated.timing(rotationAnim, {
        toValue: 1,
        duration: config.pulseSpeed * 4,
        useNativeDriver: true,
      })
    );

    pulseLoop.start();
    glowLoop.start();
    rotationLoop.start();

    return () => {
      pulseLoop.stop();
      glowLoop.stop();
      rotationLoop.stop();
    };
  }, [config]);

  const handlePress = () => {
    console.log(`StarNav円形メニューを開く - ${starType}から`);
    onPress();
  };

  const rotation = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <TouchableOpacity
      style={[styles.container, { width: size, height: size }]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {/* 外側のグロウエフェクト */}
      <Animated.View
        style={[
          styles.outerGlow,
          {
            width: size * 1.6,
            height: size * 1.6,
            borderRadius: (size * 1.6) / 2,
            backgroundColor: config.glowColor,
            opacity: glowAnim,
            transform: [{ scale: pulseAnim }],
          },
        ]}
      />

      {/* 回転する星の本体 */}
      <Animated.View
        style={[
          styles.starBody,
          {
            width: size,
            height: size,
            transform: [{ rotate: rotation }],
          },
        ]}
      >
        <Svg width={size} height={size} viewBox="0 0 50 50">
          <Defs>
            <RadialGradient id={`starGradient-${starType}`} cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={config.color} stopOpacity="1" />
              <Stop offset="70%" stopColor={config.color} stopOpacity="0.8" />
              <Stop offset="100%" stopColor={config.glowColor} stopOpacity="0.6" />
            </RadialGradient>
          </Defs>
          
          <Circle
            cx="25"
            cy="25"
            r="20"
            fill={`url(#starGradient-${starType})`}
            stroke={config.glowColor}
            strokeWidth="1"
            strokeOpacity="0.6"
          />
          
          {/* 内側の輝き */}
          <Circle
            cx="25"
            cy="25"
            r="12"
            fill={config.color}
            opacity="0.8"
          />
          
          {/* 中心の光点 */}
          <Circle
            cx="25"
            cy="25"
            r="4"
            fill="#ffffff"
            opacity="0.9"
          />
        </Svg>
      </Animated.View>

      {/* 内側のパルスエフェクト */}
      <Animated.View
        style={[
          styles.innerPulse,
          {
            width: size * 0.8,
            height: size * 0.8,
            borderRadius: (size * 0.8) / 2,
            borderColor: config.glowColor,
            opacity: pulseAnim.interpolate({
              inputRange: [0.6, 1],
              outputRange: [0, 0.6],
            }),
            transform: [{ scale: pulseAnim }],
          },
        ]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  outerGlow: {
    position: 'absolute',
    zIndex: 1,
  },
  starBody: {
    zIndex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerPulse: {
    position: 'absolute',
    borderWidth: 2,
    zIndex: 2,
  },
}); 