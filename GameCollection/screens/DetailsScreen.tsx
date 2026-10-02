import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

function DetailsScreen({ route }: any) {
  const {
    title,
    genre,
    developer,
    description,
  } = route.params;

  return (
    <View style={styles.container}>

      <Text style={styles.smallTitle}>
        GAME DETAILS
      </Text>

      <Text style={styles.title}>
        {title}
      </Text>

      <View style={styles.card}>

        <View style={styles.section}>
          <Text style={styles.label}>
            🎮 Genre
          </Text>

          <Text style={styles.text}>
            {genre}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.label}>
            🛠️ Developer
          </Text>

          <Text style={styles.text}>
            {developer}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.label}>
            📖 Description
          </Text>

          <Text style={styles.description}>
            {description}
          </Text>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1020',
    padding: 25,
  },

  smallTitle: {
    color: '#8B5CF6',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 2,
    textAlign: 'center',
    marginTop: 20,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 30,
  },

  card: {
    backgroundColor: '#17182B',
    padding: 22,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#292A40',
  },

  section: {
    paddingVertical: 10,
  },

  label: {
    color: '#A78BFA',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  text: {
    color: '#FFFFFF',
    fontSize: 17,
  },

  description: {
    color: '#C7C8D5',
    fontSize: 16,
    lineHeight: 25,
  },

  divider: {
    height: 1,
    backgroundColor: '#292A40',
    marginVertical: 10,
  },
});

export default DetailsScreen;