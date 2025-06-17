import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { Svg, Circle, Line, Text as SvgText, G, Defs, RadialGradient, Stop, Path } from 'react-native-svg';
import { BirthChart, PlanetPosition, Aspect, Planet, AspectType } from '../services/AstrologyEngine';
import { ZODIAC_MASTERS } from '../data/zodiacData';

const { width, height } = Dimensions.get('window');
const CHART_SIZE = Math.min(width, height) * 0.85;
const CENTER_X = CHART_SIZE / 2;
const CENTER_Y = CHART_SIZE / 2;
const OUTER_RADIUS = CHART_SIZE * 0.45;
const INNER_RADIUS = CHART_SIZE * 0.25;
const PLANET_RADIUS = CHART_SIZE * 0.35;

interface HoroscopeChartProps {
  birthChart?: BirthChart;
  transitPlanets?: PlanetPosition[];
  showAspects?: boolean;
  showTransits?: boolean;
  style?: any;
}

// 天体記号データ
const PLANET_SYMBOLS = {
  sun: '☉',
  moon: '☽',
  mercury: '☿',
  venus: '♀',
  mars: '♂',
  jupiter: '♃',
  saturn: '♄',
  uranus: '♅',
  neptune: '♆',
  pluto: '♇'
};

// アスペクトの色とスタイル
const ASPECT_STYLES = {
  conjunction: { color: '#FFD700', strokeWidth: 3, opacity: 0.9 },
  opposition: { color: '#FF6B6B', strokeWidth: 2, opacity: 0.8 },
  trine: { color: '#4ECDC4', strokeWidth: 2, opacity: 0.8 },
  square: { color: '#FF8E53', strokeWidth: 2, opacity: 0.7 },
  sextile: { color: '#95E1D3', strokeWidth: 1.5, opacity: 0.7 },
  quincunx: { color: '#C4C4C4', strokeWidth: 1, opacity: 0.6 }
};

export const HoroscopeChart: React.FC<HoroscopeChartProps> = ({
  birthChart,
  transitPlanets = [],
  showAspects = true,
  showTransits = false,
  style
}) => {
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    // ゆっくりとした回転アニメーション
    const rotationLoop = Animated.loop(
      Animated.timing(rotationAnim, {
        toValue: 1,
        duration: 120000, // 2分で1回転
        useNativeDriver: true,
      })
    );

    // グロウエフェクト
    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    );

    rotationLoop.start();
    glowLoop.start();

    return () => {
      rotationLoop.stop();
      glowLoop.stop();
    };
  }, []);

  /**
   * 角度から座標を計算
   */
  const getCoordinatesFromAngle = (angle: number, radius: number) => {
    const radian = ((angle - 90) * Math.PI) / 180; // -90で12時方向を0度に
    return {
      x: CENTER_X + radius * Math.cos(radian),
      y: CENTER_Y + radius * Math.sin(radian)
    };
  };

  /**
   * 黄道十二宮の描画
   */
  const renderZodiacWheel = () => {
    const signs = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
    const signNames = ['牡羊', '牡牛', '双子', '蟹', '獅子', '乙女', '天秤', '蠍', '射手', '山羊', '水瓶', '魚'];
    
    return (
      <G>
        {/* 外側の円 */}
        <Circle
          cx={CENTER_X}
          cy={CENTER_Y}
          r={OUTER_RADIUS}
          fill="none"
          stroke="rgba(255, 215, 0, 0.3)"
          strokeWidth="2"
        />
        
        {/* 内側の円 */}
        <Circle
          cx={CENTER_X}
          cy={CENTER_Y}
          r={INNER_RADIUS}
          fill="none"
          stroke="rgba(255, 215, 0, 0.2)"
          strokeWidth="1"
        />

        {/* 星座区分線と記号 */}
        {Array.from({ length: 12 }, (_, i) => {
          const angle = i * 30;
          const outerPoint = getCoordinatesFromAngle(angle, OUTER_RADIUS);
          const innerPoint = getCoordinatesFromAngle(angle, INNER_RADIUS);
          const symbolPoint = getCoordinatesFromAngle(angle + 15, OUTER_RADIUS - 20);

          return (
            <G key={i}>
              {/* 区分線 */}
              <Line
                x1={innerPoint.x}
                y1={innerPoint.y}
                x2={outerPoint.x}
                y2={outerPoint.y}
                stroke="rgba(255, 215, 0, 0.2)"
                strokeWidth="1"
              />
              
              {/* 星座記号 */}
              <SvgText
                x={symbolPoint.x}
                y={symbolPoint.y}
                fontSize="24"
                fill="#FFD700"
                textAnchor="middle"
                alignmentBaseline="middle"
                fontWeight="bold"
              >
                {signs[i]}
              </SvgText>
              
              {/* 星座名 */}
              <SvgText
                x={getCoordinatesFromAngle(angle + 15, OUTER_RADIUS - 45).x}
                y={getCoordinatesFromAngle(angle + 15, OUTER_RADIUS - 45).y}
                fontSize="10"
                fill="rgba(255, 215, 0, 0.8)"
                textAnchor="middle"
                alignmentBaseline="middle"
              >
                {signNames[i]}
              </SvgText>
            </G>
          );
        })}
      </G>
    );
  };

  /**
   * 天体の描画
   */
  const renderPlanets = (planets: PlanetPosition[], isTransit: boolean = false) => {
    return planets.map((planet, index) => {
      const planetAngle = planet.absoluteDegree;
      const planetPos = getCoordinatesFromAngle(
        planetAngle, 
        isTransit ? PLANET_RADIUS + 15 : PLANET_RADIUS
      );

      const color = isTransit ? '#FF8E53' : getPlanetColor(planet.planet);
      const symbol = PLANET_SYMBOLS[planet.planet];

      return (
        <G key={`${planet.planet}-${isTransit ? 'transit' : 'natal'}-${index}`}>
          {/* 天体の背景円 */}
          <Circle
            cx={planetPos.x}
            cy={planetPos.y}
            r="12"
            fill={color}
            fillOpacity="0.2"
            stroke={color}
            strokeWidth="1"
          />
          
          {/* 天体記号 */}
          <SvgText
            x={planetPos.x}
            y={planetPos.y}
            fontSize="16"
            fill={color}
            textAnchor="middle"
            alignmentBaseline="middle"
            fontWeight="bold"
          >
            {symbol}
          </SvgText>
          
          {/* 逆行表示 */}
          {planet.retrograde && (
            <SvgText
              x={planetPos.x + 15}
              y={planetPos.y - 10}
              fontSize="8"
              fill="#FF6B6B"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              R
            </SvgText>
          )}
        </G>
      );
    });
  };

  /**
   * アスペクトの描画
   */
  const renderAspects = (aspects: Aspect[], planets: PlanetPosition[]) => {
    if (!showAspects) return null;

    return aspects.slice(0, 10).map((aspect, index) => { // 主要なアスペクトのみ表示
      const planet1 = planets.find(p => p.planet === aspect.planet1);
      const planet2 = planets.find(p => p.planet === aspect.planet2);
      
      if (!planet1 || !planet2) return null;

      const pos1 = getCoordinatesFromAngle(planet1.absoluteDegree, PLANET_RADIUS);
      const pos2 = getCoordinatesFromAngle(planet2.absoluteDegree, PLANET_RADIUS);
      const style = ASPECT_STYLES[aspect.type];

      return (
        <Line
          key={`aspect-${index}`}
          x1={pos1.x}
          y1={pos1.y}
          x2={pos2.x}
          y2={pos2.y}
          stroke={style.color}
          strokeWidth={style.strokeWidth}
          strokeOpacity={style.opacity * aspect.strength}
          strokeDasharray={aspect.isExact ? "none" : "5,5"}
        />
      );
    });
  };

  /**
   * 天体の色を取得
   */
  const getPlanetColor = (planet: Planet): string => {
    const colors = {
      sun: '#FFD700',
      moon: '#E8E8E8',
      mercury: '#FFB347',
      venus: '#FF69B4',
      mars: '#FF6B6B',
      jupiter: '#4ECDC4',
      saturn: '#9370DB',
      uranus: '#00CED1',
      neptune: '#4169E1',
      pluto: '#8B4513'
    };
    return colors[planet] || '#FFFFFF';
  };

  /**
   * 中央の装飾
   */
  const renderCenterDecoration = () => {
    return (
      <G>
        {/* 中央の神秘的な図形 */}
        <Circle
          cx={CENTER_X}
          cy={CENTER_Y}
          r="8"
          fill="none"
          stroke="#FFD700"
          strokeWidth="2"
          strokeOpacity="0.8"
        />
        
        {/* 中央の星 */}
        <SvgText
          x={CENTER_X}
          y={CENTER_Y}
          fontSize="12"
          fill="#FFD700"
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          ✦
        </SvgText>
      </G>
    );
  };

  if (!birthChart) {
    return (
      <View style={[styles.container, style]}>
        <Svg width={CHART_SIZE} height={CHART_SIZE}>
          <Defs>
            <RadialGradient id="cosmicGradient" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="rgba(75, 0, 130, 0.1)" />
              <Stop offset="100%" stopColor="rgba(25, 25, 112, 0.3)" />
            </RadialGradient>
          </Defs>
          
          {/* 背景円 */}
          <Circle
            cx={CENTER_X}
            cy={CENTER_Y}
            r={OUTER_RADIUS}
            fill="url(#cosmicGradient)"
          />
          
          {renderZodiacWheel()}
          {renderCenterDecoration()}
        </Svg>
      </View>
    );
  }

  const rotation = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.chartContainer,
          {
            transform: [{ rotate: rotation }],
          },
        ]}
      >
        <Svg width={CHART_SIZE} height={CHART_SIZE}>
          <Defs>
            <RadialGradient id="cosmicGradient" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="rgba(75, 0, 130, 0.1)" />
              <Stop offset="50%" stopColor="rgba(25, 25, 112, 0.2)" />
              <Stop offset="100%" stopColor="rgba(0, 0, 139, 0.3)" />
            </RadialGradient>
            
            <RadialGradient id="glowGradient" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="rgba(255, 215, 0, 0.1)" />
              <Stop offset="100%" stopColor="rgba(255, 215, 0, 0)" />
            </RadialGradient>
          </Defs>
          
          {/* 背景円 */}
          <Circle
            cx={CENTER_X}
            cy={CENTER_Y}
            r={OUTER_RADIUS}
            fill="url(#cosmicGradient)"
          />
          
          {/* グロウエフェクト */}
          <Animated.View style={{ opacity: glowAnim }}>
            <Circle
              cx={CENTER_X}
              cy={CENTER_Y}
              r={OUTER_RADIUS}
              fill="url(#glowGradient)"
            />
          </Animated.View>
          
          {/* 星座ホイール */}
          {renderZodiacWheel()}
          
          {/* アスペクト線 */}
          {renderAspects(birthChart.aspects, birthChart.planets)}
          
          {/* 出生図の天体 */}
          {renderPlanets(birthChart.planets)}
          
          {/* トランジット天体 */}
          {showTransits && renderPlanets(transitPlanets, true)}
          
          {/* 中央装飾 */}
          {renderCenterDecoration()}
        </Svg>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HoroscopeChart; 