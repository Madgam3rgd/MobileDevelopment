import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

function AboutScreen() {
  return (
    <View style={styles.container}>

      <Text style={styles.icon}>👾</Text>

      <Text style={styles.title}>
        About
      </Text>

      <View style={styles.card}>

        <Text style={styles.heading}>
          Created By
        </Text>

        <Text style={styles.name}>
          David Owusu
        </Text>

        <View style={styles.divider} />

        <Text style={styles.heading}>
          About the App
        </Text>

        <Text style={styles.text}>
          Game Collection is a React Native application
          that allows users to browse a collection of
          video games and view information about each game.
        </Text>

        <View style={styles.divider} />

        <Text style={styles.heading}>
          Purpose
        </Text>

        <Text style={styles.text}>
          This application demonstrates multi-screen
          navigation, stack navigation, styling, and
          passing information between screens using
          React Navigation.
        </Text>

      </View>

      <Text style={styles.footer}>
        Built with React Native
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1020',
    padding: 25,
  },

  icon: {
    fontSize: 55,
    textAlign: 'center',
    marginTop: 20,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 25,
  },

  card: {
    backgroundColor: '#17182B',
    padding: 22,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#292A40',
  },

  heading: {
    color: '#A78BFA',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 7,
  },

  name: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },

  text: {
    color: '#C7C8D5',
    fontSize: 16,
    lineHeight: 24,
  },

  divider: {
    height: 1,
    backgroundColor: '#292A40',
    marginVertical: 18,
  },

  footer: {
    color: '#686A80',
    textAlign: 'center',
    marginTop: 25,
  },
});

export default AboutScreen;