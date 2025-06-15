-- 裏星アプリ データベース設計
-- PostgreSQL用スキーマ

-- ユーザーテーブル
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    profile_data JSONB, -- 生年月日、出生地、性別など占いに必要な情報
    subscription_tier VARCHAR(20) DEFAULT 'free', -- free, premium, pro
    subscription_expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- ユーザープロフィール詳細（占い用データ）
CREATE TABLE user_birth_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    birth_date DATE NOT NULL,
    birth_time TIME,
    birth_location JSONB, -- 緯度経度、都市名
    timezone VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 占いセッション
CREATE TABLE divination_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_type VARCHAR(20) NOT NULL, -- astrology, tarot, shichusuimei
    question TEXT,
    context JSONB, -- 占い時の設定や状況
    result JSONB NOT NULL, -- 占い結果の詳細データ
    display_result TEXT NOT NULL, -- ユーザー向け表示テキスト
    created_at TIMESTAMP DEFAULT NOW(),
    is_premium BOOLEAN DEFAULT false
);

-- タロットカード管理
CREATE TABLE tarot_cards (
    id SERIAL PRIMARY KEY,
    name_ja VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    major_arcana BOOLEAN NOT NULL,
    card_number INTEGER,
    upright_meaning TEXT NOT NULL,
    reversed_meaning TEXT NOT NULL,
    keywords JSONB, -- キーワード配列
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- わるいこノート
CREATE TABLE waruiko_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    entry_text TEXT NOT NULL,
    emotion_analysis JSONB, -- AI分析結果（感情タグ、強度など）
    monster_response TEXT, -- わるいこモンスターの応答
    purification_message TEXT, -- 浄化後のアファメーション
    is_purified BOOLEAN DEFAULT false,
    purified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- わるいこモンスター種類
CREATE TABLE monster_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    personality_traits JSONB, -- 性格特性
    response_patterns JSONB, -- 応答パターン
    unlock_condition JSONB, -- 解放条件
    is_premium BOOLEAN DEFAULT false,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ユーザーが解放したモンスター
CREATE TABLE user_monsters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    monster_type_id INTEGER REFERENCES monster_types(id),
    unlocked_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT false -- 現在使用中かどうか
);

-- 占い師との対話履歴
CREATE TABLE fortune_teller_chats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id UUID, -- 関連する占いセッションがあれば
    user_message TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    context JSONB, -- 対話の文脈情報
    created_at TIMESTAMP DEFAULT NOW()
);

-- ユーザーの感情トラッキング
CREATE TABLE emotion_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    mood_score INTEGER CHECK (mood_score >= 1 AND mood_score <= 10),
    emotions JSONB, -- 複数の感情とその強度
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- 決済履歴
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL, -- 金額（円）
    currency VARCHAR(3) DEFAULT 'JPY',
    payment_method VARCHAR(50),
    stripe_payment_id VARCHAR(255),
    status VARCHAR(20) NOT NULL, -- pending, completed, failed, refunded
    product_type VARCHAR(50), -- subscription, premium_reading, monster_unlock
    product_details JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- アプリ設定・統計
CREATE TABLE app_settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ユーザー統計（日次更新）
CREATE TABLE user_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    divinations_count INTEGER DEFAULT 0,
    waruiko_entries_count INTEGER DEFAULT 0,
    purifications_count INTEGER DEFAULT 0,
    chat_messages_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- インデックス作成
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_subscription ON users(subscription_tier, subscription_expires_at);
CREATE INDEX idx_divination_sessions_user_date ON divination_sessions(user_id, created_at DESC);
CREATE INDEX idx_waruiko_entries_user_date ON waruiko_entries(user_id, created_at DESC);
CREATE INDEX idx_emotion_tracking_user_date ON emotion_tracking(user_id, date DESC);
CREATE INDEX idx_fortune_teller_chats_user_date ON fortune_teller_chats(user_id, created_at DESC);

-- 基本データの挿入
INSERT INTO app_settings (key, value, description) VALUES 
('daily_free_divinations', '3', '1日の無料占い回数'),
('premium_price_monthly', '980', '月額プレミアム価格（円）'),
('monster_unlock_price', '250', 'モンスター解放価格（円）');

-- わるいこモンスターの基本タイプ
INSERT INTO monster_types (name, personality_traits, response_patterns, unlock_condition, is_premium) VALUES 
('むしゃくん', '{"traits": ["empathetic", "gentle", "supportive"]}', '{"responses": ["わかるよ〜", "そっか、辛かったね", "一緒にいるからね"]}', '{"condition": "default"}', false),
('ぷんぷんちゃん', '{"traits": ["energetic", "direct", "honest"]}', '{"responses": ["めっちゃわかる！", "ほんとそれ！", "キーッ！って感じだよね"]}', '{"condition": "anger_entries", "count": 10}', false),
('しくしくさん', '{"traits": ["understanding", "calm", "nurturing"]}', '{"responses": ["泣いていいよ", "無理しなくていいからね", "ゆっくりでいいよ"]}', '{"condition": "sad_entries", "count": 15}', true); 