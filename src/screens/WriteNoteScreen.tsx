import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { WaruikoIcon, BackIcon, PurificationIcon } from '../components/Icons';
import { saveNote, updateNotePurificationStatus, WaruikoNote } from '../utils/storage';

const { width, height } = Dimensions.get('window');

interface WriteNoteScreenProps {
  navigation: any;
}

const WriteNoteScreen: React.FC<WriteNoteScreenProps> = ({ navigation }) => {
  const [noteText, setNoteText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMonsterResponse, setShowMonsterResponse] = useState(false);
  const [monsterResponse, setMonsterResponse] = useState('');
  const [currentNote, setCurrentNote] = useState<WaruikoNote | null>(null);
  const [isPurifying, setIsPurifying] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);
  
  // アニメーション
  const [monsterScale] = useState(new Animated.Value(1));
  const [responseOpacity] = useState(new Animated.Value(0));
  const [purificationScale] = useState(new Animated.Value(0));
  
  // わるいこ落下アニメーション
  const [waruikoFallY] = useState(new Animated.Value(-50));
  const [waruikoFallOpacity] = useState(new Animated.Value(0));

  // 星々のアニメーション
  const [stars] = useState(() => 
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: Math.random() * width,
      top: Math.random() * height * 0.6,
      opacity: new Animated.Value(Math.random()),
      size: Math.random() * 2 + 1,
    }))
  );

  useEffect(() => {
    // 星のきらめき
    stars.forEach((star, index) => {
      const animate = () => {
        Animated.sequence([
          Animated.timing(star.opacity, {
            toValue: Math.random() * 0.8 + 0.2,
            duration: 1500 + Math.random() * 2000,
            useNativeDriver: true,
          }),
          Animated.timing(star.opacity, {
            toValue: Math.random() * 0.3 + 0.1,
            duration: 1500 + Math.random() * 2000,
            useNativeDriver: true,
          }),
        ]).start(() => animate());
      };
      setTimeout(() => animate(), index * 300);
    });

    // わるいこの呼吸
    const breatheAnimation = () => {
      Animated.sequence([
        Animated.timing(monsterScale, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(monsterScale, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]).start(() => breatheAnimation());
    };
    breatheAnimation();
  }, []);

  // モンスター応答のダミーデータ
  const getMonsterResponse = (text: string): string => {
    const responses = [
      "そんな気持ちになったんだね...💙\nとても辛かったと思うよ。でも、ここに書いてくれてありがとう。",
      "うんうん、わかるよ...😌\nそういう日もあるよね。一人じゃないからね。",
      "その気持ち、受け取ったよ✨\n大丈夫、きっと明日はもっと良い日になるから。",
      "よく頑張ったね...🌙\nその重い気持ち、僕が一緒に持つよ。",
      "辛い気持ちを教えてくれてありがとう💜\nわるいこたちが重い気持ちを受け取りました。"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSubmitNote = async () => {
    if (noteText.trim().length === 0) {
      Alert.alert('メッセージ', '気持ちを書いてから送信してください');
      return;
    }

    setIsSubmitting(true);
    setIsDepositing(true);

    // わるいこ落下アニメーション開始
    console.log('わるいこを預けるアニメーション開始');
    
    // アニメーション値をリセット
    waruikoFallY.setValue(-50);
    waruikoFallOpacity.setValue(0);

    // わるいこが落下
    Animated.sequence([
      // わるいこ表示
      Animated.timing(waruikoFallOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      // わるいこ落下
      Animated.timing(waruikoFallY, {
        toValue: 80,
        duration: 2000,
        useNativeDriver: true,
      }),
      // わるいこフェードアウト
      Animated.timing(waruikoFallOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsDepositing(false);
      
      // モンスターの応答を生成・表示
      const response = getMonsterResponse(noteText);
      setMonsterResponse(response);
      
      // ノートを保存
      saveNote({
        text: noteText,
        monsterResponse: response,
        isPurified: false,
      }).then((savedNote) => {
        setCurrentNote(savedNote);
        setShowMonsterResponse(true);
        setIsSubmitting(false);

        // 応答表示アニメーション
        Animated.timing(responseOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }).start();
      }).catch((error) => {
        console.error('Failed to save note:', error);
        Alert.alert('エラー', 'ノートの保存に失敗しました');
        setIsSubmitting(false);
        setIsDepositing(false);
      });
    });
  };

  const handlePurification = async () => {
    if (!currentNote) return;

    setIsPurifying(true);

    try {
      // 浄化ステータスを更新
      await updateNotePurificationStatus(currentNote.id, true);
      
      // 浄化アニメーション開始（光の渦巻きエフェクト）
      Animated.sequence([
        // 浄化エフェクト表示
        Animated.timing(purificationScale, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        // 浄化の光が広がる
        Animated.timing(purificationScale, {
          toValue: 1.3,
          duration: 2000,
          useNativeDriver: true,
        }),
        // フェードアウト
        Animated.timing(purificationScale, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsPurifying(false);
        // 浄化完了後、元の画面に戻る
        Alert.alert(
          '浄化完了 ✨',
          'わるいこたちが重い気持ちを受け取りました。\nまた辛いときはいつでも来てくださいね。',
          [
            {
              text: 'ありがとう',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      });
    } catch (error) {
      console.error('Failed to purify note:', error);
      Alert.alert('エラー', '浄化に失敗しました');
      setIsPurifying(false);
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <View style={styles.outerContainer}>
      {/* 全画面背景 */}
      <LinearGradient
        colors={['#0f0f23', '#1a0f3d', '#2d1b69', '#1a0f3d']}
        locations={[0, 0.3, 0.7, 1]}
        style={styles.fullScreenBackground}
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

      <SafeAreaView style={styles.container}>
        {/* ヘッダー */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <BackIcon size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>今日の気持ちを書く</Text>
          <View style={styles.placeholder} />
        </View>

        <KeyboardAvoidingView 
          style={styles.keyboardAvoid}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View style={styles.content}>
              {/* わるいこのキャラクター */}
              <View style={styles.monsterContainer}>
                <Animated.View
                  style={[
                    styles.monsterWrapper,
                    {
                      transform: [{ scale: monsterScale }],
                    },
                  ]}
                >
                  <WaruikoIcon size={80} />
                </Animated.View>
                
                {/* わるいこからの言葉 */}
                <View style={styles.speechBubble}>
                  <Text style={styles.speechText}>
                    今日はどんな気持ち？{'\n'}
                    何でも聞かせて...
                  </Text>
                </View>
              </View>

              {/* テキスト入力エリア */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="今日の気持ちを書いてください..."
                  placeholderTextColor="rgba(224, 225, 221, 0.5)"
                  value={noteText}
                  onChangeText={setNoteText}
                  multiline
                  maxLength={500}
                  textAlignVertical="top"
                />
                <Text style={styles.charCount}>{noteText.length}/500</Text>
              </View>

              {/* わるいこ預け場所のアイコン */}
              <View style={styles.depositContainer}>
                <Animated.View
                  style={[
                    styles.waruikoDeposit,
                    {
                      transform: [
                        { translateY: waruikoFallY },
                      ],
                      opacity: waruikoFallOpacity,
                    },
                  ]}
                >
                  <Text style={styles.waruikoEmoji}>😈</Text>
                </Animated.View>
                
                <View style={styles.depositBox}>
                  <LinearGradient
                    colors={['#3b82f6', '#6366f1']}
                    style={styles.depositBoxGradient}
                  >
                    <Text style={styles.depositIcon}>📦</Text>
                  </LinearGradient>
                </View>
              </View>

              {/* 送信ボタン */}
              <TouchableOpacity
                style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                onPress={handleSubmitNote}
                disabled={isSubmitting}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={isSubmitting ? ['#6b7280', '#4b5563'] : ['#ec4899', '#8b5cf6', '#3b82f6']}
                  style={styles.submitButtonGradient}
                >
                  <Text style={styles.submitButtonText}>
                    {isDepositing ? 'わるいこに預けています...' : isSubmitting ? '処理中...' : 'わるいこに預ける'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* モンスターからの応答 */}
              {showMonsterResponse && (
                <Animated.View
                  style={[
                    styles.responseContainer,
                    {
                      opacity: responseOpacity,
                    },
                  ]}
                >
                  <Text style={styles.responseText}>{monsterResponse}</Text>
                  
                  {/* 浄化ボタン */}
                  <TouchableOpacity
                    style={styles.purificationButton}
                    onPress={handlePurification}
                    activeOpacity={0.8}
                  >
                    <Animated.View
                      style={[
                        styles.purificationEffect,
                        {
                          transform: [{ scale: purificationScale }],
                        },
                      ]}
                    >
                      <PurificationIcon size={30} />
                    </Animated.View>
                    <Text style={styles.purificationButtonText}>心を浄化する</Text>
                  </TouchableOpacity>
                </Animated.View>
              )}
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  fullScreenBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  container: {
    flex: 1,
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
    backgroundColor: 'rgba(147, 51, 234, 0.2)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E0E1DD',
    textAlign: 'center',
    letterSpacing: 1,
  },
  placeholder: {
    width: 44,
  },
  keyboardAvoid: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  monsterContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  monsterWrapper: {
    shadowColor: '#9333ea',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20,
  },
  speechBubble: {
    marginTop: 15,
    backgroundColor: 'rgba(147, 51, 234, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(147, 51, 234, 0.4)',
  },
  speechText: {
    color: '#9333ea',
    fontSize: 12,
    fontWeight: '600',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 40,
  },
  textInput: {
    backgroundColor: 'rgba(45, 27, 105, 0.3)',
    borderRadius: 15,
    padding: 20,
    color: '#E0E1DD',
    fontSize: 16,
    minHeight: 150,
    borderWidth: 1,
    borderColor: 'rgba(147, 51, 234, 0.3)',
    marginBottom: 10,
  },
  charCount: {
    color: 'rgba(224, 225, 221, 0.6)',
    fontSize: 12,
    textAlign: 'right',
  },
  submitButton: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 15,
    marginBottom: 30,
  },
  submitButtonDisabled: {
    shadowOpacity: 0.2,
  },
  submitButtonGradient: {
    flex: 1,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.5,
  },
  responseContainer: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
  },
  responseText: {
    fontSize: 16,
    color: '#E0E1DD',
    lineHeight: 24,
    textAlign: 'center',
  },
  purificationButton: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 15,
  },
  purificationEffect: {
    position: 'absolute',
    top: height * 0.3,
    left: width * 0.5 - 100,
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  purificationButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.5,
  },
  depositContainer: {
    alignItems: 'center',
    marginVertical: 20,
    height: 60,
    justifyContent: 'center',
  },
  waruikoDeposit: {
    position: 'absolute',
    top: height * 0.45,
    left: width * 0.5 - 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  depositBox: {
    width: 40,
    height: 50,
    backgroundColor: '#9333ea',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#3b82f6',
    alignItems: 'center',
    shadowColor: '#9333ea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
  depositBoxGradient: {
    flex: 1,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  depositIcon: {
    fontSize: 20,
    color: '#fff',
  },
  waruikoEmoji: {
    fontSize: 20,
    color: '#fff',
  },
  star: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 50,
  },
});

export default WriteNoteScreen; 