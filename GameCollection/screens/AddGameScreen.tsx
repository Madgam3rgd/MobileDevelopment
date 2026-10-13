
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import type { Game } from '../storage/gameStorage';
import {
  loadGames,
  saveGames,
} from '../storage/gameStorage';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'AddGame'
>;

function AddGameScreen({ navigation }: Props) {
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [platform, setPlatform] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (
      !title.trim() ||
      !genre.trim() ||
      !platform.trim()
    ) {
      Alert.alert(
        'Missing Information',
        'Please fill in all fields before saving.'
      );
      return;
    }

    if (saving) {
      return;
    }

    setSaving(true);

    const newGame: Game = {
      id:
        Date.now().toString() +
        Math.random().toString(36).slice(2),
      title: title.trim(),
      genre: genre.trim(),
      platform: platform.trim(),
    };

    try {
      const currentGames = await loadGames();

      const updatedGames = [
        ...currentGames,
        newGame,
      ];

      await saveGames(updatedGames);

      navigation.goBack();
    } catch {
      Alert.alert(
        'Error',
        'Could not save game.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.heading}>
        🎮 Add New Game
      </Text>

      <Text style={styles.subtitle}>
        Add a game to your personal collection.
      </Text>

      <View style={styles.form}>
        <Text style={styles.label}>
          Game Title
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Example: Destiny 2"
          placeholderTextColor="#77788F"
          value={title}
          onChangeText={setTitle}
          maxLength={100}
        />

        <Text style={styles.label}>
          Genre
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Example: Action RPG"
          placeholderTextColor="#77788F"
          value={genre}
          onChangeText={setGenre}
          maxLength={60}
        />

        <Text style={styles.label}>
          Platform
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Example: PC, PlayStation, Xbox"
          placeholderTextColor="#77788F"
          value={platform}
          onChangeText={setPlatform}
          maxLength={60}
        />

        <Pressable
          style={[
            styles.saveButton,
            saving && styles.disabledButton,
          ]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveText}>
            {saving ? 'Saving...' : 'Save Game'}
          </Text>
        </Pressable>

        <Pressable
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelText}>
            Cancel
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1020',
  },
  content: {
    padding: 25,
  },
  heading: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    color: '#A78BFA',
    fontSize: 16,
    marginBottom: 25,
  },
  form: {
    backgroundColor: '#17182B',
    padding: 22,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#292A40',
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1E2038',
    color: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#383A55',
    fontSize: 16,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#7C3AED',
    padding: 17,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    opacity: 0.5,
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#1E2038',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#7C3AED',
    alignItems: 'center',
    marginTop: 12,
  },
  cancelText: {
    color: '#C4B5FD',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddGameScreen;
