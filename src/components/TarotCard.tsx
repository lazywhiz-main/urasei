import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TarotCard as TarotCardData } from '../data/tarotCards';

interface TarotCardProps {
  card: TarotCardData;
  isReversed?: boolean;
  width?: number;
  height?: number;
  showBack?: boolean;
  style?: any;
}

export const TarotCard: React.FC<TarotCardProps> = ({
  card,
  isReversed = false,
  width = 200,
  height = 300,
  showBack = false,
  style,
}) => {
  const cardStyle = {
    width,
    height,
    transform: [{ rotate: isReversed ? '180deg' : '0deg' }],
  };

  if (showBack) {
    return (
      <View style={[styles.card, cardStyle, style]}>
        <LinearGradient
          colors={['#6366f1', '#8b5cf6', '#a855f7']}
          style={styles.cardBack}
        >
          <View style={styles.cardBackPattern}>
            <Text style={styles.cardBackText}>URASEI</Text>
            <Text style={styles.cardBackSubtext}>TAROT</Text>
          </View>
        </LinearGradient>
      </View>
    );
  }



  return (
    <View style={[styles.card, cardStyle, style]}>
      {/* 背景画像（AI生成） */}
      <View style={styles.cardImageContainer}>
        {/* 一時的なグラデーション背景（画像準備完了まで） */}
        <LinearGradient
          colors={['#6366f1', '#8b5cf6', '#a855f7']}
          style={styles.cardImage}
        />
        
        {/* TODO: AI生成画像が準備できたら以下のコメントを外してください
        <Image
          source={getCardImageSource(card.id, card.name)}
          style={styles.cardImage}
          onError={() => console.log(`Failed to load image for card: ${card.name}`)}
        />
        */}
        
        {/* グラデーションオーバーレイ */}
        <LinearGradient
          colors={['transparent', 'rgba(26, 15, 61, 0.8)']}
          style={styles.gradientOverlay}
        />
      </View>

      {/* テキストオーバーレイ（コード描画） */}
      <View style={styles.textOverlay}>
        {/* カード番号 */}
        <View style={styles.cardNumber}>
          <Text style={styles.cardNumberText}>{card.id}</Text>
        </View>

        {/* カード名 */}
        <View style={styles.cardNameContainer}>
          <Text style={styles.cardName}>{card.name}</Text>
          {isReversed && (
            <Text style={styles.reversedIndicator}>逆位置</Text>
          )}
        </View>

        {/* 元素アイコン */}
        {card.element && (
          <View style={styles.elementContainer}>
            <Text style={styles.elementText}>{getElementSymbol(card.element)}</Text>
          </View>
        )}

        {/* キーワード */}
        <View style={styles.keywordsContainer}>
          {card.keywords.slice(0, 2).map((keyword, index) => (
            <View key={index} style={styles.keywordBadge}>
              <Text style={styles.keywordText}>{keyword}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* カード枠 */}
      <View style={styles.cardBorder} />
    </View>
  );
};

const getElementSymbol = (element: string): string => {
  const symbols = {
    '火': '🔥',
    '水': '💧',
    '風': '💨',
    '地': '🌍',
  };
  return symbols[element as keyof typeof symbols] || '';
};

// 画像が準備完了まで、getCardImageSource関数は一時的にコメントアウト
/*
const getCardImageSource = (id: number, name: string) => {
  // AI生成画像が配置されたら、この関数を有効化
  // 現在は一時的にグラデーション背景を使用
};
*/

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    overflow: 'hidden',
  },
  cardImageContainer: {
    flex: 1,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  textOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    justifyContent: 'space-between',
  },
  cardNumber: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardNumberText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a0f3d',
  },
  cardNameContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  cardName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  reversedIndicator: {
    fontSize: 12,
    color: '#fbbf24',
    marginTop: 4,
    fontWeight: '600',
  },
  elementContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  elementText: {
    fontSize: 12,
  },
  keywordsContainer: {
    position: 'absolute',
    bottom: 60,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  keywordBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  keywordText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  cardBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 16,
    pointerEvents: 'none',
  },
  cardBack: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBackPattern: {
    alignItems: 'center',
  },
  cardBackText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 4,
  },
  cardBackSubtext: {
    fontSize: 16,
    color: '#d1d5db',
    letterSpacing: 2,
    marginTop: 8,
  },
}); 