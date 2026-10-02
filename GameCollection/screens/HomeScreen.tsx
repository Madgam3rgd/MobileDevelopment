import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';

function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>

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
          learn more about its genre, developer, and gameplay.
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
            🎮  Browse Games
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
      </View>

      <Text style={styles.footer}>
        React Native Game Collection
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1020',
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
  },

  secondaryButtonText: {
    color: '#C4B5FD',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
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