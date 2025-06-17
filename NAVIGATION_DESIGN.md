# Urasei App - ナビゲーション設計書

## 🗂️ **タブナビゲーション構造**

### **1. メインタブ構成**

#### **🏠 ホームタブ (Home)**
**目的**: アプリのダッシュボード、今日の状況の確認
```
HomeScreen
├── ヘッダー: "今日のUrasei"
├── 今日の占い結果カード
├── わるいこノート統計
├── クイックアクション
│   ├── "わるいこを預ける" → Notes Tab
│   └── "占いをする" → Divination Tab
└── 最近のアクティビティ
```

#### **📝 ノートタブ (Notes)**
**目的**: わるいこノートの管理と浄化
```
NotesTabNavigator (Stack)
├── WriteNoteScreen (デフォルト)
├── NotesHistoryScreen
├── PurificationScreen
└── NoteDetailScreen (新規)
```

#### **🔮 占いタブ (Divination)**
**目的**: タロット占いの実行と履歴
```
DivinationTabNavigator (Stack)
├── DivinationScreen (デフォルト)
├── DivinationHistoryScreen (新規)
└── CardDetailScreen (新規)
```

#### **⚙️ 設定タブ (Settings)**
**目的**: アプリ設定とデータ管理
```
SettingsTabNavigator (Stack)
├── SettingsScreen (デフォルト)
├── NotificationSettingsScreen (新規)
├── DataManagementScreen (新規)
└── AboutScreen (新規)
```

## 🎨 **タブアイコンとデザイン**

### **タブバー仕様**
```
背景色: rgba(26, 15, 61, 0.95) (半透明ダークパープル)
アクティブ色: #fbbf24 (ゴールド)
非アクティブ色: #9ca3af (グレー)
高さ: 80px (iOS)、60px (Android)
```

### **アイコン設計**
```
🏠 ホーム: 神聖な家のアイコン
📝 ノート: 巻物と羽ペン
🔮 占い: 水晶玉とタロットカード
⚙️ 設定: 歯車（神秘的デザイン）
```

## 🔄 **ナビゲーションフロー**

### **主要なユーザージャーニー**

#### **1. 日常的な使用パターン**
```
アプリ起動 
    ↓
ホーム画面 (今日の状況確認)
    ↓
ノートタブ (わるいこを預ける)
    ↓
浄化プロセス
    ↓
ホーム画面に戻る
```

#### **2. 占い中心の使用パターン**
```
アプリ起動
    ↓
占いタブ (直接アクセス)
    ↓
カード引き
    ↓
結果確認
    ↓
履歴で過去の占いチェック
```

#### **3. 設定・管理パターン**
```
設定タブ
    ↓
データ管理 / 通知設定
    ↓
変更保存
    ↓
ホームに戻る
```

## 📱 **画面遷移の詳細**

### **タブ間の状態保持**
- 各タブは独立した状態を保持
- バックグラウンドタブの状態は保持される
- リフレッシュは明示的なアクションでのみ実行

### **ディープリンク対応**
```
urasei://home → ホームタブ
urasei://notes → ノートタブ
urasei://divination → 占いタブ
urasei://settings → 設定タブ
```

### **通知からの遷移**
```
日次リマインダー → ホームタブ
占い結果 → 占いタブ
浄化完了 → ノートタブ
```

## 🎯 **実装優先順位**

### **Phase 1: 基本構造 (Week 3前半)**
1. React Navigation Bottom Tabs導入
2. 4つのタブ画面の基本レイアウト
3. 既存スクリーンのタブ構造への移行

### **Phase 2: ホーム画面充実 (Week 3後半)**
1. ダッシュボード機能
2. 今日の占い結果表示
3. クイックアクション実装

### **Phase 3: 詳細機能 (Week 4)**
1. 履歴画面の実装
2. 詳細設定画面
3. データ管理機能

## 🔧 **技術的な実装詳細**

### **必要な依存関係**
```bash
npm install @react-navigation/bottom-tabs
npm install react-native-vector-icons
```

### **ファイル構造**
```
src/
├── navigation/
│   ├── TabNavigator.tsx (メインタブ)
│   ├── NotesStackNavigator.tsx
│   ├── DivinationStackNavigator.tsx
│   └── SettingsStackNavigator.tsx
├── screens/
│   ├── tabs/
│   │   ├── HomeScreen.tsx
│   │   └── SettingsScreen.tsx
│   └── (既存スクリーン)
└── components/
    ├── TabIcon.tsx
    └── DashboardWidget.tsx
```

### **パフォーマンス考慮**
- 各タブで遅延読み込み (Lazy Loading)
- 画像の最適化
- 不要な再レンダリングの防止

## 🎨 **ユーザーエクスペリエンス**

### **タブ切り替えアニメーション**
- スムーズな遷移アニメーション
- アイコンの色変化アニメーション
- タブバーの神秘的な光エフェクト

### **状態の視覚的フィードバック**
- 今日の占い済み/未済の表示
- わるいこノートの数のバッジ表示
- 設定の変更を示すインジケーター

この設計に基づいて、段階的にタブナビゲーションを実装していきます。 