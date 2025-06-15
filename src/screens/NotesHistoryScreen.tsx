import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  SafeAreaView,
  ScrollView,
  FlatList,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BackIcon, RecordIcon } from '../components/Icons';
import { getNotes, deleteNote, WaruikoNote } from '../utils/storage';

const { width, height } = Dimensions.get('window');

interface NotesHistoryScreenProps {
  navigation: any;
}

const NotesHistoryScreen: React.FC<NotesHistoryScreenProps> = ({ navigation }) => {
  const [notes, setNotes] = useState<WaruikoNote[]>([]);
  const [loading, setLoading] = useState(true);

  // 星々のアニメーション
  const [stars] = useState(() => 
    Array.from({ length: 10 }, (_, i) => ({
      id: i,
      left: Math.random() * width,
      top: Math.random() * height * 0.8,
      opacity: new Animated.Value(Math.random()),
      size: Math.random() * 2 + 1,
    }))
  );

  useEffect(() => {
    loadNotes();
    
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
  }, []);

  const loadNotes = async () => {
    try {
      const savedNotes = await getNotes();
      setNotes(savedNotes);
    } catch (error) {
      console.error('Failed to load notes:', error);
      Alert.alert('エラー', 'ノートの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = (noteId: string) => {
    Alert.alert(
      '削除確認',
      'このノートを削除しますか？',
      [
        {
          text: 'キャンセル',
          style: 'cancel',
        },
        {
          text: '削除',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteNote(noteId);
              await loadNotes(); // リロード
            } catch (error) {
              console.error('Failed to delete note:', error);
              Alert.alert('エラー', 'ノートの削除に失敗しました');
            }
          },
        },
      ]
    );
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const renderNoteItem = ({ item }: { item: WaruikoNote }) => (
    <View style={styles.noteCard}>
      <View style={styles.noteHeader}>
        <Text style={styles.noteDate}>{formatDate(item.timestamp)}</Text>
        <View style={styles.noteStatus}>
          {item.isPurified ? (
            <Text style={styles.purifiedStatus}>✨ 浄化済み</Text>
          ) : (
            <Text style={styles.unpurifiedStatus}>💙 受け取り済み</Text>
          )}
        </View>
      </View>
      
      <View style={styles.noteContent}>
        <Text style={styles.noteText} numberOfLines={3}>
          {item.text}
        </Text>
      </View>
      
      <View style={styles.responseSection}>
        <Text style={styles.responseLabel}>わるいこからの返事:</Text>
        <Text style={styles.responseText} numberOfLines={2}>
          {item.monsterResponse}
        </Text>
      </View>
      
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteNote(item.id)}
      >
        <Text style={styles.deleteButtonText}>削除</Text>
      </TouchableOpacity>
    </View>
  );

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
          <Text style={styles.headerTitle}>記録を見る</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <RecordIcon size={40} />
            <Text style={styles.title}>わるいこノートの記録</Text>
            <Text style={styles.subtitle}>
              これまでの気持ちとわるいこたちの返事
            </Text>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>読み込み中...</Text>
            </View>
          ) : notes.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                まだノートがありません{'\n'}
                気持ちを書いてみましょう
              </Text>
            </View>
          ) : (
            <FlatList
              data={notes}
              renderItem={renderNoteItem}
              keyExtractor={(item) => item.id}
              style={styles.notesList}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.notesListContent}
            />
          )}
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
    paddingHorizontal: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#E0E1DD',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#9333ea',
    textAlign: 'center',
    opacity: 0.8,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#E0E1DD',
    opacity: 0.7,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#E0E1DD',
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 24,
  },
  notesList: {
    flex: 1,
  },
  notesListContent: {
    paddingBottom: 20,
  },
  noteCard: {
    backgroundColor: 'rgba(45, 27, 105, 0.3)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(147, 51, 234, 0.3)',
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  noteDate: {
    fontSize: 12,
    color: 'rgba(224, 225, 221, 0.6)',
  },
  noteStatus: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: 'rgba(147, 51, 234, 0.2)',
  },
  purifiedStatus: {
    fontSize: 12,
    color: '#f59e0b',
    fontWeight: '600',
  },
  unpurifiedStatus: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '600',
  },
  noteContent: {
    marginBottom: 15,
  },
  noteText: {
    fontSize: 14,
    color: '#E0E1DD',
    lineHeight: 20,
  },
  responseSection: {
    backgroundColor: 'rgba(147, 51, 234, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  responseLabel: {
    fontSize: 12,
    color: '#ec4899',
    fontWeight: '600',
    marginBottom: 8,
  },
  responseText: {
    fontSize: 13,
    color: '#E0E1DD',
    lineHeight: 18,
    opacity: 0.9,
  },
  deleteButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
  },
  deleteButtonText: {
    fontSize: 12,
    color: '#ef4444',
    fontWeight: '600',
  },
});

export default NotesHistoryScreen; 