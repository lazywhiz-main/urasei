// src/components/BaziChart.tsx
// 四柱推命の命式表示コンポーネント

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path, Text as SvgText, Defs, RadialGradient, Stop } from 'react-native-svg';
import { BaziChart as BaziChartType, BaziPillar } from '../services/BaziEngine';

const { width, height } = Dimensions.get('window');

interface BaziChartProps {
  chart: BaziChartType;
  showElements?: boolean;
  animated?: boolean;
}

// 五行の色
const ELEMENT_COLORS = {
  '木': ['#4ade80', '#22c55e'] as const, // 緑
  '火': ['#ef4444', '#dc2626'] as const, // 赤
  '土': ['#fbbf24', '#f59e0b'] as const, // 黄
  '金': ['#f3f4f6', '#d1d5db'] as const, // 白/銀
  '水': ['#3b82f6', '#1d4ed8'] as const, // 青
};

// 五行の文字色
const ELEMENT_TEXT_COLORS = {
  '木': '#ffffff',
  '火': '#ffffff', 
  '土': '#1f2937',
  '金': '#1f2937',
  '水': '#ffffff',
};

export const BaziChart: React.FC<BaziChartProps> = ({ 
  chart, 
  showElements = true, 
  animated = true 
}) => {
  // 柱のレンダリング
  const renderPillar = (pillar: BaziPillar, title: string, index: number) => {
    const stemColors = ELEMENT_COLORS[pillar.stemElement as keyof typeof ELEMENT_COLORS];
    const branchColors = ELEMENT_COLORS[pillar.branchElement as keyof typeof ELEMENT_COLORS];
    
    return (
      <View key={title} style={styles.pillarContainer}>
        <Text style={styles.pillarTitle}>{title}</Text>
        
        {/* 天干 */}
        <LinearGradient
          colors={stemColors}
          style={styles.stemBox}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={[
            styles.stemText, 
            { color: ELEMENT_TEXT_COLORS[pillar.stemElement as keyof typeof ELEMENT_TEXT_COLORS] }
          ]}>
            {pillar.stem}
          </Text>
          <Text style={[
            styles.elementText,
            { color: ELEMENT_TEXT_COLORS[pillar.stemElement as keyof typeof ELEMENT_TEXT_COLORS] }
          ]}>
            {pillar.stemElement}
          </Text>
        </LinearGradient>
        
        {/* 地支 */}
        <LinearGradient
          colors={branchColors}
          style={styles.branchBox}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={[
            styles.branchText,
            { color: ELEMENT_TEXT_COLORS[pillar.branchElement as keyof typeof ELEMENT_TEXT_COLORS] }
          ]}>
            {pillar.branch}
          </Text>
          <Text style={[
            styles.elementText,
            { color: ELEMENT_TEXT_COLORS[pillar.branchElement as keyof typeof ELEMENT_TEXT_COLORS] }
          ]}>
            {pillar.branchElement}
          </Text>
        </LinearGradient>
      </View>
    );
  };

  // 五行バランスの可視化
  const renderElementsBalance = () => {
    const maxValue = Math.max(...Object.values(chart.elements));
    
    return (
      <View style={styles.elementsContainer}>
        <Text style={styles.elementsTitle}>五行バランス</Text>
        <View style={styles.elementsGrid}>
          {Object.entries(chart.elements).map(([element, value]) => {
            const colors = ELEMENT_COLORS[element as keyof typeof ELEMENT_COLORS];
            const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
            
            return (
              <View key={element} style={styles.elementItem}>
                <LinearGradient
                  colors={colors}
                  style={[styles.elementBar, { width: `${Math.max(percentage, 10)}%` }]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={[
                    styles.elementBarText,
                    { color: ELEMENT_TEXT_COLORS[element as keyof typeof ELEMENT_TEXT_COLORS] }
                  ]}>
                    {element}
                  </Text>
                </LinearGradient>
                <Text style={styles.elementValue}>{value.toFixed(1)}</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  // 五行相生相克の円形図
  const renderWuXingCircle = () => {
    const centerX = 120;
    const centerY = 120;
    const radius = 80;
    const elements = ['木', '火', '土', '金', '水'];
    
    return (
      <View style={styles.wuxingContainer}>
        <Text style={styles.wuxingTitle}>五行相生相克</Text>
        <Svg width={240} height={240} style={styles.wuxingSvg}>
          <Defs>
            {elements.map(element => {
              const colors = ELEMENT_COLORS[element as keyof typeof ELEMENT_COLORS];
              return (
                <RadialGradient
                  key={`gradient-${element}`}
                  id={`gradient-${element}`}
                  cx="50%"
                  cy="50%"
                  r="50%"
                >
                  <Stop offset="0%" stopColor={colors[0]} stopOpacity="0.8" />
                  <Stop offset="100%" stopColor={colors[1]} stopOpacity="1" />
                </RadialGradient>
              );
            })}
          </Defs>
          
          {/* 五行の円 */}
          {elements.map((element, index) => {
            const angle = (index * 72 - 90) * (Math.PI / 180);
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            const intensity = chart.elements[element] || 0;
            const circleRadius = 15 + intensity * 5;
            
            return (
              <React.Fragment key={element}>
                <Circle
                  cx={x}
                  cy={y}
                  r={circleRadius}
                  fill={`url(#gradient-${element})`}
                  stroke="#1f2937"
                  strokeWidth="2"
                />
                <SvgText
                  x={x}
                  y={y + 2}
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="bold"
                  fill={ELEMENT_TEXT_COLORS[element as keyof typeof ELEMENT_TEXT_COLORS]}
                >
                  {element}
                </SvgText>
              </React.Fragment>
            );
          })}
          
          {/* 相生の線（外側の五角形） */}
          {elements.map((element, index) => {
            const currentAngle = (index * 72 - 90) * (Math.PI / 180);
            const nextAngle = (((index + 1) % 5) * 72 - 90) * (Math.PI / 180);
            
            const x1 = centerX + radius * Math.cos(currentAngle);
            const y1 = centerY + radius * Math.sin(currentAngle);
            const x2 = centerX + radius * Math.cos(nextAngle);
            const y2 = centerY + radius * Math.sin(nextAngle);
            
            return (
              <Path
                key={`generating-${index}`}
                d={`M ${x1} ${y1} L ${x2} ${y2}`}
                stroke="#10b981"
                strokeWidth="2"
                strokeOpacity="0.6"
              />
            );
          })}
          
          {/* 相克の線（内側の五芒星） */}
          {elements.map((element, index) => {
            const currentAngle = (index * 72 - 90) * (Math.PI / 180);
            const nextAngle = (((index + 2) % 5) * 72 - 90) * (Math.PI / 180);
            
            const x1 = centerX + radius * Math.cos(currentAngle);
            const y1 = centerY + radius * Math.sin(currentAngle);
            const x2 = centerX + radius * Math.cos(nextAngle);
            const y2 = centerY + radius * Math.sin(nextAngle);
            
            return (
              <Path
                key={`controlling-${index}`}
                d={`M ${x1} ${y1} L ${x2} ${y2}`}
                stroke="#ef4444"
                strokeWidth="2"
                strokeOpacity="0.4"
                strokeDasharray="5,5"
              />
            );
          })}
        </Svg>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* 四柱表示 */}
      <LinearGradient
        colors={['#1e1b4b', '#312e81', '#1e1b4b']}
        style={styles.chartContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.chartTitle}>四柱推命</Text>
        <View style={styles.pillarsRow}>
          {renderPillar(chart.year, '年柱', 0)}
          {renderPillar(chart.month, '月柱', 1)}
          {renderPillar(chart.day, '日柱', 2)}
          {renderPillar(chart.hour, '時柱', 3)}
        </View>
        
        {/* 日主情報 */}
        <View style={styles.dayMasterContainer}>
          <Text style={styles.dayMasterLabel}>日主</Text>
          <LinearGradient
            colors={ELEMENT_COLORS[chart.dayMasterElement as keyof typeof ELEMENT_COLORS]}
            style={styles.dayMasterBox}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={[
              styles.dayMasterText,
              { color: ELEMENT_TEXT_COLORS[chart.dayMasterElement as keyof typeof ELEMENT_TEXT_COLORS] }
            ]}>
              {chart.dayMaster}
            </Text>
            <Text style={[
              styles.dayMasterElement,
              { color: ELEMENT_TEXT_COLORS[chart.dayMasterElement as keyof typeof ELEMENT_TEXT_COLORS] }
            ]}>
              {chart.dayMasterElement}・{chart.dayMasterPolarity === 'yang' ? '陽' : '陰'}
            </Text>
          </LinearGradient>
        </View>
      </LinearGradient>

      {/* 五行分析 */}
      {showElements && (
        <View style={styles.analysisContainer}>
          {renderElementsBalance()}
          {renderWuXingCircle()}
          
          {/* 用神・忌神 */}
          <View style={styles.godsContainer}>
            <View style={styles.godItem}>
              <Text style={styles.godLabel}>用神</Text>
              <LinearGradient
                colors={ELEMENT_COLORS[chart.usefulGod as keyof typeof ELEMENT_COLORS]}
                style={styles.godBox}
              >
                <Text style={[
                  styles.godText,
                  { color: ELEMENT_TEXT_COLORS[chart.usefulGod as keyof typeof ELEMENT_TEXT_COLORS] }
                ]}>
                  {chart.usefulGod}
                </Text>
              </LinearGradient>
            </View>
            
            <View style={styles.godItem}>
              <Text style={styles.godLabel}>忌神</Text>
              <LinearGradient
                colors={ELEMENT_COLORS[chart.avoidGod as keyof typeof ELEMENT_COLORS]}
                style={[styles.godBox, styles.avoidGodBox]}
              >
                <Text style={[
                  styles.godText,
                  { color: ELEMENT_TEXT_COLORS[chart.avoidGod as keyof typeof ELEMENT_TEXT_COLORS] }
                ]}>
                  {chart.avoidGod}
                </Text>
              </LinearGradient>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  chartContainer: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  chartTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fbbf24',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  pillarsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  pillarContainer: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  pillarTitle: {
    fontSize: 12,
    color: '#e5e7eb',
    marginBottom: 8,
    fontWeight: '600',
  },
  stemBox: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  branchBox: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  stemText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  branchText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  elementText: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  dayMasterContainer: {
    alignItems: 'center',
  },
  dayMasterLabel: {
    fontSize: 14,
    color: '#e5e7eb',
    marginBottom: 8,
    fontWeight: '600',
  },
  dayMasterBox: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  dayMasterText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  dayMasterElement: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  analysisContainer: {
    gap: 20,
  },
  elementsContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  elementsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  elementsGrid: {
    gap: 8,
  },
  elementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  elementBar: {
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 60,
    paddingHorizontal: 12,
  },
  elementBarText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  elementValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
    minWidth: 30,
  },
  wuxingContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  wuxingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  wuxingSvg: {
    marginTop: 8,
  },
  godsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  godItem: {
    alignItems: 'center',
  },
  godLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  godBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  avoidGodBox: {
    opacity: 0.7,
  },
  godText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
}); 