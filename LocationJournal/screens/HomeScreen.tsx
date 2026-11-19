
import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
} from 'react-native';

type Props = {
  onCreate: () => void;
  onJournal: () => void;
  entryCount: number;
};

export default function HomeScreen({
  onCreate, onJournal, entryCount,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>📍</Text>
      <Text style={styles.title}>My Location Journal</Text>
      <Text style={styles.subtitle}>
        Capture memories, explore places, and save your adventures.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Your Adventures</Text>
        <Text style={styles.count}>{entryCount}</Text>
        <Text style={styles.muted}>Saved journal entries</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={onCreate}>
        <Text style={styles.buttonText}>+ Create New Entry</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondary} onPress={onJournal}>
        <Text style={styles.buttonText}>View Saved Journal</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#0F1020',
    padding: 24, justifyContent: 'center',
  },
  icon: { fontSize: 60, textAlign: 'center', marginBottom: 16 },
  title: {
    fontSize: 30, fontWeight: 'bold',
    color: '#FFFFFF', textAlign: 'center',
  },
  subtitle: {
    fontSize: 15, color: '#B5B4C8',
    textAlign: 'center', marginTop: 12, marginBottom: 30,
    lineHeight: 23,
  },
  card: {
    backgroundColor: '#1A1A30', borderRadius: 18,
    padding: 26, alignItems: 'center',
    borderWidth: 1, borderColor: '#292A40',
    marginBottom: 25,
  },
  cardTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  count: {
    fontSize: 44, fontWeight: 'bold',
    color: '#A78BFA', marginVertical: 8,
  },
  muted: { color: '#B5B4C8' },
  button: {
    backgroundColor: '#8B5CF6', padding: 17,
    borderRadius: 12, alignItems: 'center', marginBottom: 12,
  },
  secondary: {
    backgroundColor: '#292A40', padding: 17,
    borderRadius: 12, alignItems: 'center',
  },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});
