import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StarNavContainer } from '../components/StarNavContainer';
import { BackIcon } from '../components/Icons';

interface SettingsScreenProps {
  navigation: any;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0a0a0a', '#1a4c1a', '#4c954c', '#0f230f']}
        locations={[0, 0.3, 0.6, 1]}
        style={styles.background}
      >
        <StarNavContainer 
          currentStar="settings"
        />

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <BackIcon size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>設定星雲</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          <View style={styles.comingSoonContainer}>
            <Text style={styles.nebulaeIcon}>🌌</Text>
            <Text style={styles.comingSoonTitle}>設定星雲</Text>
            <Text style={styles.comingSoonSubtitle}>Coming Soon...</Text>
            <Text style={styles.comingSoonDescription}>
              ここではアプリの設定や、{'\n'}
              占いの精度調整、{'\n'}
              星座テーマの変更などを{'\n'}
              行う予定です
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
    backgroundColor: 'rgba(72, 187, 120, 0.2)',
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
    backgroundColor: 'rgba(72, 187, 120, 0.1)',
    borderRadius: 20,
    padding: 40,
    borderWidth: 1,
    borderColor: 'rgba(72, 187, 120, 0.3)',
  },
  nebulaeIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  comingSoonTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#48BB78',
    marginBottom: 10,
  },
  comingSoonSubtitle: {
    fontSize: 18,
    color: '#C6F6D5',
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

export default SettingsScreen; 