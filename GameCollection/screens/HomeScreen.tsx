
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

function HomeScreen({ navigation }: Props) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <View style={styles.hero}>
        <Text style={styles.icon}>🎮</Text>

        <Text style={styles.title}>
          Game Collection
        </Text>

        <Text style={styles.subtitle}>
          Discover some of my favorite games.
        </Text>

        <Text style={styles.description}>
          Browse the collection and select a game to
          learn more about its genre, developer, and
          gameplay. You can also save your own games!
        </Text>
      </View>

      <View style={styles.buttonArea}>
        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => navigation.navigate('Games')}
        >
          <Text style={styles.primaryButtonText}>
            🎮 Browse Games
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.secondaryButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => navigation.navigate('About')}
        >
          <Text style={styles.secondaryButtonText}>
            About the App
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.collectionButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => navigation.navigate('Collection')}
        >
          <Text style={styles.primaryButtonText}>
            ⭐ My Saved Collection
          </Text>
        </Pressable>
      </View>

      <Text style={styles.footer}>
        React Native Game Collection
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1020',
  },
  content: {
    flexGrow: 1,
    padding: 25,
    justifyContent: 'center',
  },
  hero: {
    backgroundColor: '#17182B',
    padding: 30,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#292A40',
    marginBottom: 30,
  },
  icon: {
    fontSize: 60,
    textAlign: 'center',
    marginBottom: 15,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    color: '#A78BFA',
    fontSize: 19,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
  description: {
    color: '#B8B9C9',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginTop: 20,
  },
  buttonArea: {
    width: '100%',
  },
  primaryButton: {
    backgroundColor: '#7C3AED',
    padding: 17,
    borderRadius: 12,
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: '#1E2038',
    padding: 17,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#7C3AED',
    marginBottom: 12,
  },
  secondaryButtonText: {
    color: '#C4B5FD',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  collectionButton: {
    backgroundColor: '#6D28D9',
    padding: 17,
    borderRadius: 12,
    marginTop: 5,
  },
  buttonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  footer: {
    color: '#686A80',
    textAlign: 'center',
    marginTop: 30,
    fontSize: 13,
  },
});

export default HomeScreen;
