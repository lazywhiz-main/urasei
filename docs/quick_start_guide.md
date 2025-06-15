# 🚀 裏星アプリ クイックスタート

## 🎯 目標
今日中に「裏星アプリが起動する」状態を作る

## ⚡ 30分で始める手順

### Step 1: 環境確認
```bash
# Node.js バージョン確認
node --version  # v18以上推奨

# React Native CLI インストール
npm install -g @react-native-community/cli

# iOS開発環境確認（Macの場合）
xcode-select --install
sudo gem install cocoapods
```

### Step 2: プロジェクト作成
```bash
# プロジェクト作成
npx react-native@latest init UraseiApp --template react-native-template-typescript

# ディレクトリ移動
cd UraseiApp

# 依存関係インストール
npm install
```

### Step 3: 基本ライブラリ追加
```bash
# ナビゲーション
npm install @react-navigation/native @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context

# アニメーション・デザイン
npm install react-native-reanimated react-native-vector-icons
npm install react-native-linear-gradient react-native-svg

# iOS追加設定
cd ios && pod install && cd ..
```

### Step 4: 起動確認
```bash
# Metro サーバー起動
npm start

# 別ターミナルでアプリ起動
# iOS
npm run ios

# Android  
npm run android
```

---

## 📱 次に作る「ホーム画面」デザイン

HTMLデザインを参考に、まずはこんな感じのホーム画面を作ってみましょう：

```typescript
// src/screens/HomeScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

export const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#2d1b69', '#1a0f3d', '#0d0621', '#030014']}
        style={styles.background}
      >
        {/* 月のアニメーション部分 */}
        <View style={styles.moonContainer}>
          <View style={styles.moonPhase}>
            <Text style={styles.moonStar}>⭐</Text>
          </View>
        </View>

        {/* メインカード */}
        <View style={styles.todayCard}>
          <Text style={styles.cardTitle}>裏星からの便り</Text>
          <Text style={styles.cardDescription}>
            夜空の向こうの占い師が、あなたの本音を読み取ろうと待っています。
            心の奥に秘めた想いを、星々に託してみませんか。
          </Text>
        </View>

        {/* アクションボタン */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.buttonText}>🔮 占い師と語る</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.buttonText}>🌙 わるいこを預ける</Text>
          </TouchableOpacity>
        </View>
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  moonContainer: {
    marginBottom: 50,
  },
  moonPhase: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#a855f7',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 25,
    elevation: 25,
  },
  moonStar: {
    fontSize: 24,
    color: '#fff',
  },
  todayCard: {
    backgroundColor: 'rgba(45, 27, 105, 0.3)',
    borderRadius: 20,
    padding: 32,
    marginBottom: 50,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.2)',
  },
  cardTitle: {
    fontSize: 28,
    color: '#f59e0b',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '300',
  },
  cardDescription: {
    fontSize: 16,
    color: '#E0E1DD',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '300',
  },
  actionButtons: {
    width: '100%',
    gap: 20,
  },
  primaryButton: {
    backgroundColor: 'rgba(168, 85, 247, 0.7)',
    borderRadius: 50,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  secondaryButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.6)',
    borderRadius: 50,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '500',
  },
});
```

---

## 🎯 今日の作業内容

1. **環境セットアップ** (30分)
2. **プロジェクト作成＋起動確認** (30分)  
3. **ホーム画面の基本実装** (60分)
4. **実機/シミュレータで確認** (30分)

**合計: 約2.5時間**で最初の画面が完成します！

---

## 🤔 質問・相談

途中で詰まったり、「ここはどうしよう？」となったら、いつでも聞いてください：

- **技術的な問題**: エラーメッセージやコード
- **デザインの判断**: 「この色どう思う？」「この配置は？」  
- **機能の優先度**: 「次は何を作る？」
- **方向性の相談**: 「このやり方で大丈夫？」

---

## 🎊 最初の一歩

**今すぐ始めて、今日中に「裏星アプリが起動する」状態を作ってみませんか？**

準備ができましたら：
1. 上記コマンドを実行
2. 画面に何か表示されたら成功報告
3. 次のステップの相談

一緒に素晴らしいアプリを作りましょう！ 