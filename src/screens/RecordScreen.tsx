import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StarNavContainer } from '../components/StarNavContainer';
import { BackIcon } from '../components/Icons';

interface RecordScreenProps {
  navigation: any;
}

const RecordScreen: React.FC<RecordScreenProps> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0a0a0a', '#1a3b4c', '#4c6b95', '#0f0f23']}
        locations={[0, 0.3, 0.6, 1]}
        style={styles.background}
      >
        <StarNavContainer 
          currentStar="record"
        />

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <BackIcon size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>記録惑星</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          <View style={styles.comingSoonContainer}>
            <Text style={styles.planetIcon}>🪐</Text>
            <Text style={styles.comingSoonTitle}>記録惑星</Text>
            <Text style={styles.comingSoonSubtitle}>Coming Soon...</Text>
            <Text style={styles.comingSoonDescription}>
              ここでは占いの履歴や、{'\n'}
              わるいこノートの記録を{'\n'}
              美しい星座として表示する予定です
            </Text>
          </View>
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
    backgroundColor: 'rgba(66, 153, 225, 0.2)',
  },
  headerTitle: {
    fontSize: 18,
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  comingSoonContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(66, 153, 225, 0.1)',
    borderRadius: 20,
    padding: 40,
    borderWidth: 1,
    borderColor: 'rgba(66, 153, 225, 0.3)',
  },
  planetIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  comingSoonTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4299E1',
    marginBottom: 10,
  },
  comingSoonSubtitle: {
    fontSize: 18,
    color: '#B0E0E6',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  comingSoonDescription: {
    fontSize: 14,
    color: '#E0E1DD',
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.8,
  },
});

export default RecordScreen; 