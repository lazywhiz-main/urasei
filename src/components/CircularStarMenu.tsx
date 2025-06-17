import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Svg, Circle, Line, Defs, RadialGradient, Stop, G } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const MENU_RADIUS = Math.min(width, height) * 0.35;
const CENTER_X = width / 2;
const CENTER_Y = height / 2;

interface StarMenuItem {
  id: string;
  name: string;
  color: string;
  glowColor: string;
  route: string;
  angle: number;
}

interface CircularStarMenuProps {
  visible: boolean;
  currentStar: string;
  onClose: () => void;
}

const STAR_MENU_ITEMS: StarMenuItem[] = [
  {
    id: 'sanctuary',
    name: '星の聖域',
    color: '#E8D5FF',
    glowColor: '#B794F6',
    route: 'StarSanctuary',
    angle: 0,
  },
  {
    id: 'astrology',
    name: '占星術',
    color: '#FFE4B5',
    glowColor: '#F6AD55',
    route: 'AstrologyMenu',
    angle: 60,
  },
  {
    id: 'divination',
    name: 'タロット占い',
    color: '#DDA0DD',
    glowColor: '#9F7AEA',
    route: 'Divination',
    angle: 120,
  },
  {
    id: 'waruiko',
    name: 'わるいこノート',
    color: '#FFCCCB',
    glowColor: '#F56565',
    route: 'Waruiko',
    angle: 180,
  },
  {
    id: 'record',
    name: '記録惑星',
    color: '#B0E0E6',
    glowColor: '#4299E1',
    route: 'Record',
    angle: 240,
  },
  {
    id: 'settings',
    name: '設定星雲',
    color: '#C6F6D5',
    glowColor: '#48BB78',
    route: 'Settings',
    angle: 300,
  },
];

export const CircularStarMenu: React.FC<CircularStarMenuProps> = ({
  visible,
  currentStar,
  onClose,
}) => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const starAnimations = useRef(
    STAR_MENU_ITEMS.map(() => ({
      scale: new Animated.Value(0),
      opacity: new Animated.Value(0),
      glow: new Animated.Value(0),
    }))
  ).current;
  const orbitalLineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      console.log('円形メニューを開く');
      // メニュー全体のフェードイン
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        // 軌道線の描画アニメーション
        Animated.timing(orbitalLineAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: false,
        }),
      ]).start();

      // 星々の順次出現アニメーション
      const starAnimationSequence = starAnimations.map((anim, index) => {
        return Animated.parallel([
          Animated.timing(anim.opacity, {
            toValue: 1,
            duration: 400,
            delay: index * 100,
            useNativeDriver: true,
          }),
          Animated.spring(anim.scale, {
            toValue: 1,
            tension: 120,
            friction: 8,
            delay: index * 100,
            useNativeDriver: true,
          }),
          Animated.loop(
            Animated.sequence([
              Animated.timing(anim.glow, {
                toValue: 1,
                duration: 1000 + Math.random() * 500,
                useNativeDriver: true,
              }),
              Animated.timing(anim.glow, {
                toValue: 0.3,
                duration: 1000 + Math.random() * 500,
                useNativeDriver: true,
              }),
            ])
          ),
        ]);
      });

      Animated.parallel(starAnimationSequence).start();
    } else {
      console.log('円形メニューを閉じる');
      // メニューを閉じるアニメーション
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.3,
          duration: 200,
          useNativeDriver: true,
        }),
        ...starAnimations.map(anim =>
          Animated.parallel([
            Animated.timing(anim.opacity, {
              toValue: 0,
              duration: 150,
              useNativeDriver: true,
            }),
            Animated.timing(anim.scale, {
              toValue: 0,
              duration: 150,
              useNativeDriver: true,
            }),
          ])
        ),
      ]).start();
    }
  }, [visible]);

  const handleStarPress = (item: StarMenuItem) => {
    if (item.id === currentStar) {
      // 現在の星を選択した場合はメニューを閉じるだけ
      onClose();
      return;
    }

    console.log(`${item.name}へワープ`);
    
    // ワープエフェクトのアニメーション
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // ナビゲーション実行
      navigation.navigate(item.route as never);
      onClose();
    });
  };

  const renderOrbitalLines = () => {
    return (
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            opacity: orbitalLineAnim,
          },
        ]}
      >
        <Svg width={width} height={height} style={StyleSheet.absoluteFillObject}>
          <Defs>
            <RadialGradient id="orbitalGradient" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <Stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
            </RadialGradient>
          </Defs>
          
          {/* 中央軌道円 */}
          <Circle
            cx={CENTER_X}
            cy={CENTER_Y}
            r={MENU_RADIUS}
            fill="none"
            stroke="url(#orbitalGradient)"
            strokeWidth="1"
            strokeDasharray="5,10"
          />
          
          {/* 星々への軌道線 */}
          {STAR_MENU_ITEMS.map((item, index) => {
            const angleRad = (item.angle * Math.PI) / 180;
            const starX = CENTER_X + MENU_RADIUS * Math.cos(angleRad);
            const starY = CENTER_Y + MENU_RADIUS * Math.sin(angleRad);
            
            return (
              <G key={`orbital-${item.id}`}>
                <Line
                  x1={CENTER_X}
                  y1={CENTER_Y}
                  x2={starX}
                  y2={starY}
                  stroke="url(#orbitalGradient)"
                  strokeWidth="0.5"
                  strokeDasharray="3,6"
                />
              </G>
            );
          })}
        </Svg>
      </Animated.View>
    );
  };

  const renderStarItems = () => {
    return STAR_MENU_ITEMS.map((item, index) => {
      const angleRad = (item.angle * Math.PI) / 180;
      const starX = CENTER_X + MENU_RADIUS * Math.cos(angleRad);
      const starY = CENTER_Y + MENU_RADIUS * Math.sin(angleRad);
      
      const isCurrentStar = item.id === currentStar;
      const anim = starAnimations[index];

      return (
        <Animated.View
          key={item.id}
          style={[
            styles.starContainer,
            {
              left: starX - 30,
              top: starY - 30,
              opacity: anim.opacity,
              transform: [
                { scale: anim.scale },
                {
                  scale: anim.glow.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, isCurrentStar ? 1.2 : 1.1],
                  }),
                },
              ],
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.starButton,
              {
                backgroundColor: item.color,
                shadowColor: item.glowColor,
                borderColor: isCurrentStar ? item.glowColor : 'transparent',
                borderWidth: isCurrentStar ? 3 : 0,
              },
            ]}
            onPress={() => handleStarPress(item)}
            activeOpacity={0.8}
          >
            <Animated.View
              style={[
                styles.starGlow,
                {
                  backgroundColor: item.glowColor,
                  opacity: anim.glow.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.3, isCurrentStar ? 0.8 : 0.6],
                  }),
                },
              ]}
            />
            <Text style={[styles.starText, { color: isCurrentStar ? '#fff' : '#333' }]}>
              ★
            </Text>
          </TouchableOpacity>
          
          <Text style={[styles.starLabel, { color: item.glowColor }]}>
            {item.name}
          </Text>
        </Animated.View>
      );
    });
  };

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
      
      <Animated.View
        style={[
          styles.menuContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {renderOrbitalLines()}
        {renderStarItems()}
        
        {/* 中央の現在位置インジケーター */}
        <View style={styles.centerIndicator}>
          <Text style={styles.centerText}>現在位置</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 20, 0.8)',
  },
  menuContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  starContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  starButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 15,
    shadowOpacity: 0.8,
    elevation: 10,
  },
  starGlow: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    top: -5,
    left: -5,
  },
  starText: {
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  starLabel: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  centerIndicator: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    top: CENTER_Y - 40,
    left: CENTER_X - 40,
  },
  centerText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
}); 