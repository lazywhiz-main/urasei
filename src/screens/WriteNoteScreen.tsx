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
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#1a0f3d', '#0d0621', '#030014']}
          style={styles.gradient}
        >
          {/* 星々の背景 */}
          {stars.map((star) => (
            <Animated.View
              key={star.id}
              style={[
                styles.star,
                {
                  left: star.left,
                  top: star.top,
                  width: star.size,
                  height: star.size,
                  opacity: star.opacity,
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
            <Text style={styles.headerTitle}>今日の気持ちを書く</Text>
            <View style={styles.placeholder} />
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.content}
          >
            {!showMonsterResponse ? (
              <>
                {/* わるいこ */}
                <View style={styles.monsterContainer}>
                  <Animated.View
                    style={[
                      styles.monster,
                      {
                        transform: [{ scale: monsterScale }],
                      },
                    ]}
                  >
                    <WaruikoIcon size={120} />
                  </Animated.View>
                  
                  {/* 思考バブル */}
                  <View style={styles.thoughtBubble}>
                    <Text style={styles.thoughtText}>
                      今日はどんな気持ち？{'\n'}
                      何でも聞かせて...
                    </Text>
                  </View>
                </View>

                {/* テキスト入力 */}
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    multiline
                    placeholder="今日の気持ちを書いてください..."
                    placeholderTextColor="rgba(224, 225, 221, 0.5)"
                    value={noteText}
                    onChangeText={setNoteText}
                    maxLength={500}
                    textAlignVertical="top"
                  />
                  <Text style={styles.charCount}>
                    {noteText.length}/500
                  </Text>
                </View>

                {/* 固定されたゴミ箱 */}
                <View style={styles.depositContainer}>
                  <View style={styles.depositBoxLid} />
                  <View style={styles.depositBoxBody}>
                    <View style={styles.depositSlot} />
                  </View>
                </View>

                {/* 送信ボタン */}
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    isSubmitting && styles.submitButtonDisabled,
                  ]}
                  onPress={handleSubmitNote}
                  disabled={isSubmitting}
                >
                  <LinearGradient
                    colors={isSubmitting ? ['#666', '#444'] : ['#a855f7', '#ec4899']}
                    style={styles.submitGradient}
                  >
                    <Text style={styles.submitButtonText}>
                      {isSubmitting ? 'わるいこに預けています...' : 'わるいこに預ける'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </>
            ) : (
              /* モンスターの応答表示 */
              <Animated.View
                style={[
                  styles.responseContainer,
                  { opacity: responseOpacity },
                ]}
              >
                <View style={styles.monsterContainer}>
                  <WaruikoIcon size={100} />
                </View>

                <View style={styles.responseBox}>
                  <Text style={styles.responseText}>{monsterResponse}</Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.purifyButton,
                    isPurifying && styles.purifyButtonDisabled,
                  ]}
                  onPress={handlePurification}
                  disabled={isPurifying}
                >
                  <LinearGradient
                    colors={isPurifying ? ['#666', '#444'] : ['#f59e0b', '#ec4899']}
                    style={styles.purifyGradient}
                  >
                    <Text style={styles.purifyButtonText}>
                      {isPurifying ? '浄化中...' : '浄化する'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            )}
          </KeyboardAvoidingView>

          {/* わるいこ落下アニメーション */}
          {isDepositing && (
            <View style={styles.depositAnimationContainer}>
              {/* 落下するわるいこ */}
              <Animated.View
                style={[
                  styles.fallingWaruiko,
                  {
                    opacity: waruikoFallOpacity,
                    transform: [{ translateY: waruikoFallY }],
                  },
                ]}
              >
                <WaruikoIcon size={40} />
              </Animated.View>
            </View>
          )}

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
              <PurificationIcon size={200} />
            </Animated.View>
          )}
        </LinearGradient>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
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
  monster: {
    shadowColor: '#9333ea',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20,
  },
  thoughtBubble: {
    marginTop: 15,
    backgroundColor: 'rgba(147, 51, 234, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(147, 51, 234, 0.4)',
  },
  thoughtText: {
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
  submitGradient: {
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
  responseBox: {
    backgroundColor: 'rgba(45, 27, 105, 0.4)',
    borderRadius: 20,
    padding: 25,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(147, 51, 234, 0.3)',
    width: '100%',
  },
  responseText: {
    fontSize: 16,
    color: '#E0E1DD',
    lineHeight: 24,
    textAlign: 'center',
  },
  purifyButton: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 15,
  },
  purifyButtonDisabled: {
    shadowOpacity: 0.2,
  },
  purifyGradient: {
    flex: 1,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  purifyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.5,
  },
  depositAnimationContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  depositContainer: {
    alignItems: 'center',
    marginVertical: 20,
    height: 60,
    justifyContent: 'center',
  },
  depositBoxLid: {
    width: 52,
    height: 8,
    backgroundColor: '#3b82f6',
    borderRadius: 2,
    marginBottom: 0,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  depositBoxBody: {
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
  depositSlot: {
    width: 20,
    height: 4,
    backgroundColor: '#1a0f3d',
    borderRadius: 1,
    marginTop: 10,
  },
  fallingWaruiko: {
    position: 'absolute',
    top: height * 0.45,
    left: width * 0.5 - 20,
    alignItems: 'center',
    justifyContent: 'center',
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
});

export default WriteNoteScreen; 