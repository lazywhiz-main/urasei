import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  SafeAreaView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BackIcon, PurificationIcon } from '../components/Icons';
import { getNotes, updateNotePurificationStatus, WaruikoNote } from '../utils/storage';

const { width, height } = Dimensions.get('window');

interface PurificationScreenProps {
  navigation: any;
}

const PurificationScreen: React.FC<PurificationScreenProps> = ({ navigation }) => {
  const [unpurifiedNotes, setUnpurifiedNotes] = useState<WaruikoNote[]>([]);
  const [isPurifying, setIsPurifying] = useState(false);
  const [purificationProgress, setPurificationProgress] = useState(0);

  // アニメーション
  const [purificationScale] = useState(new Animated.Value(0));
  const [progressAnimation] = useState(new Animated.Value(0));
  
  // 星々のアニメーション
  const [stars] = useState(() => 
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * width,
      top: Math.random() * height * 0.8,
      opacity: new Animated.Value(Math.random()),
      size: Math.random() * 3 + 1,
    }))
  );

  useEffect(() => {
    loadUnpurifiedNotes();
    
    // 星のきらめき
    stars.forEach((star, index) => {
      const animate = () => {
        Animated.sequence([
          Animated.timing(star.opacity, {
            toValue: Math.random() * 0.9 + 0.1,
            duration: 1000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
          Animated.timing(star.opacity, {
            toValue: Math.random() * 0.4 + 0.1,
            duration: 1000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
        ]).start(() => animate());
      };
      setTimeout(() => animate(), index * 200);
    });
  }, []);

  const loadUnpurifiedNotes = async () => {
    try {
      const allNotes = await getNotes();
      const unpurified = allNotes.filter(note => !note.isPurified);
      setUnpurifiedNotes(unpurified);
    } catch (error) {
      console.error('Failed to load notes:', error);
    }
  };

  const startPurification = async () => {
    if (unpurifiedNotes.length === 0) {
      Alert.alert('お知らせ', '浄化するノートがありません');
      return;
    }

    setIsPurifying(true);
    setPurificationProgress(0);
    console.log('浄化アニメーション開始');
    
    // アニメーション値をリセット
    purificationScale.setValue(0);
    progressAnimation.setValue(0);

    // 浄化エフェクトを表示
    Animated.timing(purificationScale, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // プログレスアニメーション
    Animated.timing(progressAnimation, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start();

    // 段階的に浄化を実行
    for (let i = 0; i < unpurifiedNotes.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      try {
        await updateNotePurificationStatus(unpurifiedNotes[i].id, true);
        setPurificationProgress(((i + 1) / unpurifiedNotes.length) * 100);
      } catch (error) {
        console.error('Failed to purify note:', error);
      }
    }

    // 浄化完了
    setTimeout(() => {
      setIsPurifying(false);
      
      // アニメーション終了
      Animated.timing(purificationScale, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start();

      Alert.alert(
        '浄化完了 ✨',
        `${unpurifiedNotes.length}個のノートが浄化されました。\nわるいこたちが重い気持ちを受け取りました。`,
        [
          {
            text: 'ありがとう',
            onPress: () => {
              loadUnpurifiedNotes();
            },
          },
        ]
      );
    }, 3500);
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

        {/* ヘッダー */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <BackIcon size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>浄化の間</Text>
          <View style={styles.placeholder} />
        </View>

        {/* メインコンテンツ */}
        <View style={styles.content}>
          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>浄化待ちのわるいこノート</Text>
            <Text style={styles.infoCount}>{unpurifiedNotes.length}件</Text>
          </View>

          {unpurifiedNotes.length > 0 && (
            <View style={styles.notesPreview}>
              {unpurifiedNotes.slice(0, 3).map((note, index) => (
                <View key={note.id} style={styles.notePreviewCard}>
                  <Text style={styles.notePreviewText} numberOfLines={2}>
                    {note.text}
                  </Text>
                  <Text style={styles.notePreviewDate}>
                    {new Date(note.timestamp).toLocaleDateString('ja-JP')}
                  </Text>
                </View>
              ))}
              {unpurifiedNotes.length > 3 && (
                <Text style={styles.moreNotesText}>
                  他 {unpurifiedNotes.length - 3}件...
                </Text>
              )}
            </View>
          )}

          {/* プログレスバー */}
          {isPurifying && (
            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>浄化進行中...</Text>
              <View style={styles.progressBar}>
                <Animated.View
                  style={[
                    styles.progressFill,
                    {
                      width: progressAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%'],
                      }),
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressPercentage}>
                {Math.round(purificationProgress)}%
              </Text>
            </View>
          )}

          {/* 浄化ボタン */}
          <TouchableOpacity
            style={[styles.purificationButton, isPurifying && styles.purificationButtonDisabled]}
            onPress={startPurification}
            disabled={isPurifying || unpurifiedNotes.length === 0}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={
                isPurifying || unpurifiedNotes.length === 0
                  ? ['#666', '#888']
                  : ['#ec4899', '#f59e0b', '#a855f7']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.purificationButtonGradient}
            >
              <Text style={styles.purificationButtonText}>
                {isPurifying
                  ? '✨ 浄化の光が働いています...'
                  : unpurifiedNotes.length === 0
                  ? '浄化するノートがありません'
                  : `✨ ${unpurifiedNotes.length}件のノートを浄化する`}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* 浄化エフェクト */}
        {isPurifying && (
          <Animated.View
            style={[
              styles.purificationEffect,
              {
                transform: [{ scale: purificationScale }],
              },
            ]}
          >
            <PurificationIcon size={150} />
          </Animated.View>
        )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e0e1dd',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  infoTitle: {
    fontSize: 18,
    color: '#e0e1dd',
    marginBottom: 10,
  },
  infoCount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#f59e0b',
  },
  notesPreview: {
    marginBottom: 30,
  },
  notePreviewCard: {
    backgroundColor: 'rgba(224, 225, 221, 0.1)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(147, 51, 234, 0.3)',
  },
  notePreviewText: {
    color: '#e0e1dd',
    fontSize: 14,
    marginBottom: 8,
  },
  notePreviewDate: {
    color: 'rgba(224, 225, 221, 0.6)',
    fontSize: 12,
  },
  moreNotesText: {
    color: 'rgba(224, 225, 221, 0.7)',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  progressContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  progressText: {
    color: '#e0e1dd',
    fontSize: 16,
    marginBottom: 10,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(224, 225, 221, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#f59e0b',
    borderRadius: 4,
  },
  progressPercentage: {
    color: '#f59e0b',
    fontSize: 14,
    fontWeight: 'bold',
  },
  purificationButton: {
    marginTop: 'auto',
    marginBottom: 30,
  },
  purificationButtonDisabled: {
    opacity: 0.6,
  },
  purificationButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
  },
  purificationButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  purificationEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PurificationScreen; 