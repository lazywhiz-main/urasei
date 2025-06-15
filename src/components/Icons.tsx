import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import Svg, { 
  Defs, 
  LinearGradient, 
  RadialGradient, 
  Stop, 
  Rect, 
  Circle, 
  Ellipse, 
  Polygon, 
  Path
} from 'react-native-svg';

interface IconProps {
  size?: number;
  style?: any;
}

// 神殿アイコン
export const TempleIcon: React.FC<IconProps> = ({ size = 40, style }) => {
  const starOpacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(starOpacity, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(starOpacity, {
          toValue: 0.5,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    );
    pulseAnimation.start();
    return () => pulseAnimation.stop();
  }, []);

  return (
    <View style={style}>
      <Svg width={size} height={size} viewBox="0 0 40 40">
        <Defs>
          <LinearGradient id="templeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#a855f7"/>
            <Stop offset="50%" stopColor="#ec4899"/>
            <Stop offset="100%" stopColor="#f59e0b"/>
          </LinearGradient>
        </Defs>
        {/* 神殿の柱 */}
        <Rect x="8" y="15" width="3" height="20" fill="url(#templeGrad)" opacity="0.8"/>
        <Rect x="14" y="12" width="3" height="23" fill="url(#templeGrad)"/>
        <Rect x="20" y="10" width="3" height="25" fill="url(#templeGrad)"/>
        <Rect x="26" y="12" width="3" height="23" fill="url(#templeGrad)"/>
        <Rect x="32" y="15" width="3" height="20" fill="url(#templeGrad)" opacity="0.8"/>
        {/* 屋根 */}
        <Polygon points="5,15 20,5 35,15" fill="url(#templeGrad)" opacity="0.9"/>
        {/* 基礎 */}
        <Rect x="6" y="35" width="28" height="3" fill="url(#templeGrad)" opacity="0.7"/>
      </Svg>
      {/* アニメーション付き星の装飾 */}
      <Animated.View
        style={{
          position: 'absolute',
          top: size * 0.625,
          left: size * 0.5 - 2,
          opacity: starOpacity,
        }}
      >
        <View
          style={{
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: '#fff',
            shadowColor: '#fff',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 1,
            shadowRadius: 4,
            elevation: 4,
          }}
        />
      </Animated.View>
    </View>
  );
};

// 占いアイコン（水晶球）
export const DivinationIcon: React.FC<IconProps> = ({ size = 40, style }) => {
  const starRotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const rotateAnimation = Animated.loop(
      Animated.timing(starRotation, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
      })
    );
    rotateAnimation.start();
    return () => rotateAnimation.stop();
  }, []);

  const rotateInterpolated = starRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={style}>
      <Svg width={size} height={size} viewBox="0 0 40 40">
        <Defs>
          <RadialGradient id="crystalGrad" cx="50%" cy="30%">
            <Stop offset="0%" stopColor="#fff" stopOpacity="0.8"/>
            <Stop offset="40%" stopColor="#a855f7"/>
            <Stop offset="100%" stopColor="#1a0f3d"/>
          </RadialGradient>
          <LinearGradient id="templeGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#a855f7"/>
            <Stop offset="50%" stopColor="#ec4899"/>
            <Stop offset="100%" stopColor="#f59e0b"/>
          </LinearGradient>
        </Defs>
        {/* 水晶球の台 */}
        <Ellipse cx="20" cy="32" rx="12" ry="4" fill="url(#templeGrad2)" opacity="0.6"/>
        {/* 水晶球 */}
        <Circle cx="20" cy="20" r="12" fill="url(#crystalGrad)" stroke="#a855f7" strokeWidth="1" opacity="0.9"/>
        {/* ハイライト */}
        <Ellipse cx="17" cy="16" rx="3" ry="2" fill="#fff" opacity="0.4"/>
      </Svg>
      {/* 回転する内部の星 */}
      <Animated.View
        style={{
          position: 'absolute',
          top: size * 0.35,
          left: size * 0.5 - 4,
          transform: [{ rotate: rotateInterpolated }],
        }}
      >
        <View
          style={{
            width: 8,
            height: 8,
          }}
        >
          <Svg width={8} height={8} viewBox="0 0 8 8">
            <Polygon points="4,0 4.5,2.5 7,2.5 5.25,4 5.75,6.5 4,5.5 2.25,6.5 2.75,4 1,2.5 3.5,2.5" fill="#f59e0b" opacity="0.8"/>
          </Svg>
        </View>
      </Animated.View>
    </View>
  );
};

// わるいこアイコン
export const WaruikoIcon: React.FC<IconProps> = ({ size = 40, style }) => {
  const breatheScale = useRef(new Animated.Value(1)).current;
  const particleY1 = useRef(new Animated.Value(0)).current;
  const particleY2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 呼吸アニメーション
    const breatheAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(breatheScale, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(breatheScale, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    // パーティクルアニメーション
    const createParticleAnimation = (animatedValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: -15,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );
    };

    breatheAnimation.start();
    setTimeout(() => createParticleAnimation(particleY1, 0).start(), 0);
    setTimeout(() => createParticleAnimation(particleY2, 1500).start(), 1500);

    return () => {
      breatheAnimation.stop();
    };
  }, []);

  return (
    <Animated.View style={[style, { transform: [{ scale: breatheScale }] }]}>
      <Svg width={size} height={size} viewBox="0 0 40 40">
        <Defs>
          <LinearGradient id="monsterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#9333ea"/>
            <Stop offset="50%" stopColor="#3b82f6"/>
            <Stop offset="100%" stopColor="#a855f7"/>
          </LinearGradient>
        </Defs>
        {/* わるいこの体 */}
        <Ellipse cx="20" cy="25" rx="13" ry="10" fill="url(#monsterGrad)" opacity="0.9"/>
        {/* 目 */}
        <Circle cx="16" cy="22" r="2" fill="#1f2937"/>
        <Circle cx="24" cy="22" r="2" fill="#1f2937"/>
        {/* 瞳 */}
        <Circle cx="16.5" cy="21.5" r="0.8" fill="#fff"/>
        <Circle cx="24.5" cy="21.5" r="0.8" fill="#fff"/>
        {/* 口 */}
        <Path d="M 15 28 Q 20 32 25 28" stroke="#1f2937" strokeWidth="2" fill="none"/>
        {/* 小さな角 */}
        <Polygon points="17,12 19,8 21,12" fill="url(#monsterGrad)" opacity="0.7"/>
        <Polygon points="19,11 21,7 23,11" fill="url(#monsterGrad)" opacity="0.7"/>
      </Svg>
      {/* アニメーション付きパーティクル */}
      <Animated.View
        style={{
          position: 'absolute',
          top: size * 0.375,
          left: size * 0.25,
          transform: [{ translateY: particleY1 }],
        }}
      >
        <View
          style={{
            width: 2,
            height: 2,
            borderRadius: 1,
            backgroundColor: '#ec4899',
            opacity: 0.6,
          }}
        />
      </Animated.View>
      <Animated.View
        style={{
          position: 'absolute',
          top: size * 0.45,
          left: size * 0.75,
          transform: [{ translateY: particleY2 }],
        }}
      >
        <View
          style={{
            width: 3,
            height: 3,
            borderRadius: 1.5,
            backgroundColor: '#f59e0b',
            opacity: 0.7,
          }}
        />
      </Animated.View>
    </Animated.View>
  );
};

// 記録アイコン（星座）
export const RecordIcon: React.FC<IconProps> = ({ size = 40, style }) => {
  const constellationRotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const rotateAnimation = Animated.loop(
      Animated.timing(constellationRotation, {
        toValue: 1,
        duration: 15000, // ゆっくりとした回転
        useNativeDriver: true,
      })
    );
    rotateAnimation.start();
    return () => rotateAnimation.stop();
  }, []);

  const rotateInterpolated = constellationRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={style}>
      <Animated.View
        style={{
          transform: [{ rotate: rotateInterpolated }],
        }}
      >
        <Svg width={size} height={size} viewBox="0 0 40 40">
          <Defs>
            <RadialGradient id="starGrad" cx="50%" cy="50%">
              <Stop offset="0%" stopColor="#fff"/>
              <Stop offset="30%" stopColor="#f59e0b"/>
              <Stop offset="100%" stopColor="#ec4899"/>
            </RadialGradient>
            <LinearGradient id="templeGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#a855f7"/>
              <Stop offset="50%" stopColor="#ec4899"/>
              <Stop offset="100%" stopColor="#f59e0b"/>
            </LinearGradient>
          </Defs>
          {/* 星座の線 */}
          <Path d="M 8,12 L 15,8 L 25,15 L 32,10 L 30,20 L 20,25 L 10,22 Z" 
                stroke="url(#templeGrad3)" strokeWidth="1.5" fill="none" opacity="0.6"/>
          {/* 星々 */}
          <Polygon points="8,12 9,9 12,9 9.5,7 10.5,4 8,6 5.5,4 6.5,7 4,9 7,9" fill="url(#starGrad)" opacity="0.8"/>
          <Polygon points="15,8 16,6 18,6 16.5,4.5 17,2 15,3.5 13,2 13.5,4.5 12,6 14,6" fill="url(#starGrad)" opacity="0.9"/>
          <Polygon points="25,15 26,13 28,13 26.5,11.5 27,9 25,10.5 23,9 23.5,11.5 22,13 24,13" fill="url(#starGrad)"/>
          <Polygon points="32,10 33,8 35,8 33.5,6.5 34,4 32,5.5 30,4 30.5,6.5 29,8 31,8" fill="url(#starGrad)" opacity="0.7"/>
          <Polygon points="30,20 31,18 33,18 31.5,16.5 32,14 30,15.5 28,14 28.5,16.5 27,18 29,18" fill="url(#starGrad)" opacity="0.8"/>
          <Polygon points="20,25 21,23 23,23 21.5,21.5 22,19 20,20.5 18,19 18.5,21.5 17,23 19,23" fill="url(#starGrad)" opacity="0.9"/>
          <Polygon points="10,22 11,20 13,20 11.5,18.5 12,16 10,17.5 8,16 8.5,18.5 7,20 9,20" fill="url(#starGrad)" opacity="0.6"/>
        </Svg>
      </Animated.View>
    </View>
  );
};

// 設定アイコン
export const SettingsIcon: React.FC<IconProps> = ({ size = 30, style }) => (
  <View style={style}>
    <Svg width={size} height={size} viewBox="0 0 30 30">
      <Defs>
        <LinearGradient id="settingsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#6366f1"/>
          <Stop offset="100%" stopColor="#a855f7"/>
        </LinearGradient>
      </Defs>
      {/* 星形の設定ギア */}
      <Polygon points="15,2 17,8 23,6 19,12 25,15 19,18 23,24 17,22 15,28 13,22 7,24 11,18 5,15 11,12 7,6 13,8" 
               fill="url(#settingsGrad)" opacity="0.8"/>
      <Circle cx="15" cy="15" r="4" fill="#1a0f3d"/>
      <Circle cx="15" cy="15" r="2" fill="url(#settingsGrad)"/>
    </Svg>
  </View>
);

// 戻るアイコン
export const BackIcon: React.FC<IconProps> = ({ size = 24, style }) => (
  <View style={style}>
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Defs>
        <LinearGradient id="backGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#a855f7"/>
          <Stop offset="100%" stopColor="#ec4899"/>
        </LinearGradient>
      </Defs>
      <Path d="M15 18L9 12L15 6" stroke="url(#backGrad)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  </View>
);

// 浄化アイコン（神聖な炎と光の円環）
export const PurificationIcon: React.FC<IconProps> = ({ size = 40, style }) => {
  const flameScale = useRef(new Animated.Value(1)).current;
  const flameOpacity = useRef(new Animated.Value(0.6)).current;
  const innerFlameScale = useRef(new Animated.Value(0.8)).current;
  const baseScale = useRef(new Animated.Value(1)).current;
  const circleRotation = useRef(new Animated.Value(0)).current;
  const innerCircleRotation = useRef(new Animated.Value(0)).current;
  const starOpacity1 = useRef(new Animated.Value(0)).current;
  const starOpacity2 = useRef(new Animated.Value(0)).current;
  const starOpacity3 = useRef(new Animated.Value(0)).current;
  const starTranslateX1 = useRef(new Animated.Value(0)).current;
  const starTranslateY1 = useRef(new Animated.Value(0)).current;
  const starTranslateX2 = useRef(new Animated.Value(0)).current;
  const starTranslateY2 = useRef(new Animated.Value(0)).current;
  const starTranslateX3 = useRef(new Animated.Value(0)).current;
  const starTranslateY3 = useRef(new Animated.Value(0)).current;
  const waruikoOpacity = useRef(new Animated.Value(0.6)).current;
  const waruikoScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 炎の揺らめきアニメーション
    const flameAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(flameScale, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(flameScale, {
          toValue: 0.95,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(flameScale, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    // 炎の透明度アニメーション
    const flameOpacityAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(flameOpacity, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(flameOpacity, {
          toValue: 0.8,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(flameOpacity, {
          toValue: 0.6,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    // 内側の炎アニメーション
    const innerFlameAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(innerFlameScale, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(innerFlameScale, {
          toValue: 0.9,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(innerFlameScale, {
          toValue: 0.8,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    // 炎の基部アニメーション
    const baseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(baseScale, {
          toValue: 1.2,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(baseScale, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    // 外側の円環回転
    const circleAnimation = Animated.loop(
      Animated.timing(circleRotation, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
      })
    );

    // 内側の円環回転（逆方向）
    const innerCircleAnimation = Animated.loop(
      Animated.timing(innerCircleRotation, {
        toValue: 1,
        duration: 6000,
        useNativeDriver: true,
      })
    );

    // 星屑のアニメーション
    const createStarAnimation = (
      opacity: Animated.Value, 
      translateX: Animated.Value, 
      translateY: Animated.Value, 
      delay: number,
      deltaX: number,
      deltaY: number
    ) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(opacity, {
              toValue: 0.8,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(translateX, {
              toValue: deltaX,
              duration: 3000,
              useNativeDriver: true,
            }),
            Animated.timing(translateY, {
              toValue: deltaY,
              duration: 3000,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(opacity, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(translateX, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
            Animated.timing(translateY, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
        ])
      );
    };

    // わるいこの変容アニメーション
    const waruikoAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(waruikoOpacity, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(waruikoScale, {
          toValue: 0.8,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(waruikoOpacity, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(waruikoScale, {
          toValue: 0.5,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(waruikoScale, {
          toValue: 0.3,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(waruikoOpacity, {
          toValue: 0.6,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(waruikoScale, {
          toValue: 1,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    flameAnimation.start();
    flameOpacityAnimation.start();
    innerFlameAnimation.start();
    baseAnimation.start();
    circleAnimation.start();
    innerCircleAnimation.start();
    waruikoAnimation.start();
    createStarAnimation(starOpacity1, starTranslateX1, starTranslateY1, 0, 6, -4).start();
    createStarAnimation(starOpacity2, starTranslateX2, starTranslateY2, 1000, -4, -6).start();
    createStarAnimation(starOpacity3, starTranslateX3, starTranslateY3, 2000, -2, -4).start();

    return () => {
      flameAnimation.stop();
      flameOpacityAnimation.stop();
      innerFlameAnimation.stop();
      baseAnimation.stop();
      circleAnimation.stop();
      innerCircleAnimation.stop();
      waruikoAnimation.stop();
    };
  }, []);

  const circleRotateInterpolated = circleRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const innerCircleRotateInterpolated = innerCircleRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['360deg', '0deg'],
  });

  return (
    <View style={style}>
      <Svg width={size} height={size} viewBox="0 0 50 50">
        <Defs>
          <RadialGradient id="purifyGrad" cx="50%" cy="50%">
            <Stop offset="0%" stopColor="#fff" stopOpacity="0.9"/>
            <Stop offset="30%" stopColor="#f59e0b" stopOpacity="0.8"/>
            <Stop offset="60%" stopColor="#ec4899" stopOpacity="0.6"/>
            <Stop offset="100%" stopColor="#a855f7" stopOpacity="0.4"/>
          </RadialGradient>
          <LinearGradient id="flameGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <Stop offset="0%" stopColor="#f59e0b"/>
            <Stop offset="50%" stopColor="#ec4899"/>
            <Stop offset="100%" stopColor="#a855f7"/>
          </LinearGradient>
        </Defs>
        
        {/* 浄化の炎の基部 */}
        <Animated.View
          style={{
            position: 'absolute',
            top: size * 0.8,
            left: size * 0.34,
            transform: [{ scale: baseScale }],
          }}
        >
          <Svg width={size * 0.32} height={size * 0.12} viewBox="0 0 16 6">
            <Ellipse cx="8" cy="3" rx="8" ry="3" fill="url(#flameGrad)" opacity="0.3"/>
          </Svg>
        </Animated.View>
        
        {/* メインの炎 */}
        <Path d="M 25,40 Q 20,35 22,28 Q 18,25 20,20 Q 25,25 25,15 Q 30,25 30,20 Q 32,25 28,28 Q 30,35 25,40" 
              fill="url(#flameGrad)" opacity="0.8"/>
        
        {/* 内側の白い炎 */}
        <Path d="M 25,35 Q 22,32 23,27 Q 21,25 22,22 Q 25,26 25,18 Q 28,26 28,22 Q 29,25 27,27 Q 28,32 25,35" 
              fill="#fff" opacity="0.7"/>
      </Svg>
      
      {/* 炎の揺らめき */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: size,
          height: size,
          transform: [{ scale: flameScale }],
          opacity: flameOpacity,
        }}
      >
        <Svg width={size} height={size} viewBox="0 0 50 50">
          <Path d="M 25,40 Q 20,35 22,28 Q 18,25 20,20 Q 25,25 25,15 Q 30,25 30,20 Q 32,25 28,28 Q 30,35 25,40" 
                fill="url(#flameGrad)" opacity="0.8"/>
        </Svg>
      </Animated.View>

      {/* 内側の炎の揺らめき */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: size,
          height: size,
          transform: [{ scale: innerFlameScale }],
        }}
      >
        <Svg width={size} height={size} viewBox="0 0 50 50">
          <Path d="M 25,35 Q 22,32 23,27 Q 21,25 22,22 Q 25,26 25,18 Q 28,26 28,22 Q 29,25 27,27 Q 28,32 25,35" 
                fill="#fff" opacity="0.7"/>
        </Svg>
      </Animated.View>
      
      {/* 外側の浄化エネルギー円環 */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: size,
          height: size,
          transform: [{ rotate: circleRotateInterpolated }],
        }}
      >
        <Svg width={size} height={size} viewBox="0 0 50 50">
          <Circle cx="25" cy="25" r="18" fill="none" stroke="url(#purifyGrad)" strokeWidth="2" opacity="0.6"/>
        </Svg>
      </Animated.View>
      
      {/* 内側の円環 */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: size,
          height: size,
          transform: [{ rotate: innerCircleRotateInterpolated }],
        }}
      >
        <Svg width={size} height={size} viewBox="0 0 50 50">
          <Circle cx="25" cy="25" r="12" fill="none" stroke="url(#purifyGrad)" strokeWidth="1.5" opacity="0.4"/>
        </Svg>
      </Animated.View>
      
      {/* 浄化の星屑 */}
      <Animated.View
        style={{
          position: 'absolute',
          top: size * 0.3,
          left: size * 0.2,
          opacity: starOpacity1,
          transform: [
            { translateX: starTranslateX1 },
            { translateY: starTranslateY1 }
          ],
        }}
      >
        <Svg width={8} height={8} viewBox="0 0 8 8">
          <Polygon points="4,0 4.5,2.5 7,2.5 5.25,4 5.75,6.5 4,5.5 2.25,6.5 2.75,4 1,2.5 3.5,2.5" fill="#fff" opacity="0.8"/>
        </Svg>
      </Animated.View>
      
      <Animated.View
        style={{
          position: 'absolute',
          top: size * 0.4,
          left: size * 0.8,
          opacity: starOpacity2,
          transform: [
            { translateX: starTranslateX2 },
            { translateY: starTranslateY2 }
          ],
        }}
      >
        <Svg width={6} height={6} viewBox="0 0 6 6">
          <Polygon points="3,0 3.5,1.5 5,1.5 4,2.5 4.5,4 3,3.5 1.5,4 2,2.5 1,1.5 2.5,1.5" fill="#f59e0b" opacity="0.7"/>
        </Svg>
      </Animated.View>
      
      <Animated.View
        style={{
          position: 'absolute',
          top: size * 0.15,
          left: size * 0.7,
          opacity: starOpacity3,
          transform: [
            { translateX: starTranslateX3 },
            { translateY: starTranslateY3 }
          ],
        }}
      >
        <Svg width={7} height={7} viewBox="0 0 7 7">
          <Polygon points="3.5,0 4,2 6,2 4.5,3 5,5 3.5,4.5 2,5 2.5,3 1,2 3,2" fill="#ec4899" opacity="0.9"/>
        </Svg>
      </Animated.View>

      {/* わるいこ（浄化される前） */}
      <Animated.View
        style={{
          position: 'absolute',
          top: size * 0.56,
          left: size * 0.42,
          opacity: waruikoOpacity,
          transform: [{ scale: waruikoScale }],
        }}
      >
        <Svg width={8} height={6} viewBox="0 0 8 6">
          <Ellipse cx="4" cy="3" rx="4" ry="3" fill="#9333ea" opacity="0.6"/>
        </Svg>
      </Animated.View>
    </View>
  );
}; 