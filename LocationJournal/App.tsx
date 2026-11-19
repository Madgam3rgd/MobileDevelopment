
import React, { useEffect, useState } from 'react';

import {
  View,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';

import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from './screens/HomeScreen';
import CreateEntryScreen from './screens/CreateEntryScreen';
import JournalScreen from './screens/JournalScreen';

import { JournalEntry } from './types/JournalEntry';

import {
  loadEntries,
  saveEntries,
  deletePhoto,
} from './utils/journalStorage';

type Screen = 'home' | 'create' | 'journal';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Load saved entries when the app starts
  useEffect(() => {
    async function initialize() {
      try {
        const savedEntries = await loadEntries();

        setEntries(savedEntries);

        console.log(
          'Loaded journal entries:',
          savedEntries.length
        );
      } catch (error) {
        console.error('Load error:', error);

        Alert.alert(
          'Load Error',
          error instanceof Error
            ? error.message
            : 'Unable to load journal entries.'
        );
      } finally {
        setLoading(false);
      }
    }

    initialize();
  }, []);

  // Add a new journal entry
  async function addEntry(entry: JournalEntry) {
    try {
      const updatedEntries = [entry, ...entries];

      await saveEntries(updatedEntries);

      setEntries(updatedEntries);
      setScreen('journal');

      Alert.alert(
        'Success',
        'Journal entry saved successfully!'
      );
    } catch (error) {
      console.error('Add entry error:', error);
      throw error;
    }
  }

  // Update an existing journal note
  async function updateEntry(
    id: string,
    newNote: string
  ) {
    try {
      const updatedEntries = entries.map(entry =>
        entry.id === id
          ? {
              ...entry,
              note: newNote,
            }
          : entry
      );

      await saveEntries(updatedEntries);

      setEntries(updatedEntries);

      console.log(
        'Journal entry updated successfully:',
        id
      );
    } catch (error) {
      console.error('Update entry error:', error);
      throw error;
    }
  }

  // Delete a journal entry
  async function removeEntry(id: string) {
    try {
      const entry = entries.find(
        item => item.id === id
      );

      if (!entry) {
        return;
      }

      const updatedEntries = entries.filter(
        item => item.id !== id
      );

      // Save updated list first
      await saveEntries(updatedEntries);

      setEntries(updatedEntries);

      // Delete stored photo
      try {
        await deletePhoto(entry.photoUri);
      } catch (error) {
        console.warn(
          'Photo deletion error:',
          error
        );
      }

      console.log(
        'Journal entry deleted successfully:',
        id
      );
    } catch (error) {
      console.error('Delete entry error:', error);
      throw error;
    }
  }

  // Display the selected screen
  function renderScreen() {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color="#A78BFA"
          />
        </View>
      );
    }

    if (screen === 'home') {
      return (
        <HomeScreen
          entryCount={entries.length}
          onCreate={() => setScreen('create')}
          onJournal={() => setScreen('journal')}
        />
      );
    }

    if (screen === 'create') {
      return (
        <CreateEntryScreen
          onBack={() => setScreen('home')}
          onSave={addEntry}
        />
      );
    }

    return (
      <JournalScreen
        entries={entries}
        onBack={() => setScreen('home')}
        onDelete={removeEntry}
        onUpdate={updateEntry}
      />
    );
  }

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="light" />
        {renderScreen()}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1020',
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: '#0F1020',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
