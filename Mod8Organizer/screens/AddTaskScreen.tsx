
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useTasks } from '../context/Taskcontext';
import type { RootStackParamList } from '../types/Navigation';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'AddTask'
>;

export default function AddTaskScreen({ navigation }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const { addTask } = useTasks();

  const handleAddTask = async () => {
    if (!title.trim()) {
      setError('Please enter a task title.');
      Alert.alert('Missing Title', 'Please enter a task title.');
      return;
    }

    setError('');
    setSaving(true);

    try {
      await addTask(title.trim(), description.trim());

      Alert.alert('Success', 'Your task has been saved!');
      navigation.goBack();
    } catch {
      setError('Could not save your task. Please try again.');
      Alert.alert('Error', 'Could not save your task.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Task</Text>

      <Text style={styles.label}>Task Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter task title"
        placeholderTextColor="#888888"
        value={title}
        onChangeText={setTitle}
        accessibilityLabel="Task title"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Enter task description"
        placeholderTextColor="#888888"
        value={description}
        onChangeText={setDescription}
        multiline
        accessibilityLabel="Task description"
      />

      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : null}

      <TouchableOpacity
        style={[
          styles.button,
          saving && { opacity: 0.6 },
        ]}
        onPress={handleAddTask}
        disabled={saving}
        accessibilityRole="button"
        accessibilityLabel="Save new task"
      >
        <Text style={styles.buttonText}>
          {saving ? 'Saving...' : 'Save Task'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1020',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    color: '#A78BFA',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#17182B',
    color: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#292A40',
  },
  textArea: {
    height: 110,
    textAlignVertical: 'top',
  },
  error: {
    color: '#FCA5A5',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#8B5CF6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
});
