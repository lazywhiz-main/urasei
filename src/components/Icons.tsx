import React from 'react';
import { View } from 'react-native';
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
export const TempleIcon: React.FC<IconProps> = ({ size = 40, style }) => (
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
      {/* 星の装飾 */}
      <Circle cx="20" cy="25" r="2" fill="#fff" opacity="0.8"/>
    </Svg>
  </View>
);

// 占いアイコン（水晶球）
export const DivinationIcon: React.FC<IconProps> = ({ size = 40, style }) => (
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
      {/* 内部の星 */}
      <Polygon points="20,14 21,17 24,17 21.5,19 22.5,22 20,20 17.5,22 18.5,19 16,17 19,17" fill="#f59e0b" opacity="0.8"/>
      {/* ハイライト */}
      <Ellipse cx="17" cy="16" rx="3" ry="2" fill="#fff" opacity="0.4"/>
    </Svg>
  </View>
);

// わるいこアイコン
export const WaruikoIcon: React.FC<IconProps> = ({ size = 40, style }) => (
  <View style={style}>
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
      {/* パーティクル */}
      <Circle cx="10" cy="15" r="1" fill="#ec4899" opacity="0.6"/>
      <Circle cx="30" cy="18" r="1.5" fill="#f59e0b" opacity="0.7"/>
    </Svg>
  </View>
);

// 記録アイコン（星座）
export const RecordIcon: React.FC<IconProps> = ({ size = 40, style }) => (
  <View style={style}>
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
  </View>
);

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