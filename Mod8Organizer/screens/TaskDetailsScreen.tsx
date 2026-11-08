
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useTasks } from '../context/Taskcontext';
import type { RootStackParamList } from '../types/Navigation';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'TaskDetails'
>;

export default function TaskDetailsScreen({
  route,
  navigation,
}: Props) {
  const {
    tasks,
    loading,
    updateTask,
    toggleTask,
    deleteTask,
  } = useTasks();

  const task = tasks.find(
    item => item.id === route.params.taskId
  );

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(
    task?.description ?? ''
  );
  const [saving, setSaving] = useState(false);
  const [validationError, setValidationError] = useState('');

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  if (!task) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Task not found</Text>
        <Text style={styles.text}>
          This task may have been deleted.
        </Text>
      </View>
    );
  }

  const handleSave = async () => {
    if (!title.trim()) {
      setValidationError('Task title cannot be empty.');
      return;
    }

    setValidationError('');
    setSaving(true);

    try {
      await updateTask(
        task.id,
        title.trim(),
        description.trim()
      );
      setEditing(false);
      Alert.alert('Success', 'Task updated successfully!');
    } catch {
      Alert.alert('Error', 'Could not save your changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleComplete = async () => {
    setSaving(true);

    try {
      await toggleTask(task.id);
      Alert.alert('Success', 'Task status updated!');
    } catch {
      Alert.alert('Error', 'Could not update task status.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setSaving(true);

            try {
              await deleteTask(task.id);
              navigation.goBack();
            } catch {
              Alert.alert('Error', 'Could not delete task.');
            } finally {
              setSaving(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Text style={styles.title}>Task Details</Text>

      {editing ? (
        <>
          <Text style={styles.label}>Task Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Task title"
            placeholderTextColor="#888888"
            accessibilityLabel="Edit task title"
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            multiline
            placeholder="Task description"
            placeholderTextColor="#888888"
            accessibilityLabel="Edit task description"
          />

          {validationError ? (
            <Text style={styles.error}>{validationError}</Text>
          ) : null}

          <TouchableOpacity
            style={styles.button}
            onPress={handleSave}
            disabled={saving}
            accessibilityRole="button"
            accessibilityLabel="Save task changes"
          >
            <Text style={styles.buttonText}>Save Changes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            disabled={saving}
            onPress={() => {
              setTitle(task.title);
              setDescription(task.description);
              setValidationError('');
              setEditing(false);
            }}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <View style={styles.card}>
            <Text style={styles.taskTitle}>{task.title}</Text>

            <Text style={styles.label}>Description</Text>
            <Text style={styles.text}>
              {task.description || 'No description'}
            </Text>

            <Text style={styles.label}>Status</Text>
            <Text style={styles.text}>
              {task.completed ? 'Completed' : 'Not completed'}
            </Text>

            <Text style={styles.label}>Created</Text>
            <Text style={styles.text}>
              {new Date(task.createdAt).toLocaleDateString()}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.button}
            disabled={saving}
            onPress={() => {
              setTitle(task.title);
              setDescription(task.description);
              setEditing(true);
            }}
            accessibilityRole="button"
            accessibilityLabel="Edit this task"
          >
            <Text style={styles.buttonText}>Edit Task</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            disabled={saving}
            onPress={handleComplete}
            accessibilityRole="button"
            accessibilityLabel={
              task.completed
                ? 'Mark task incomplete'
                : 'Mark task completed'
            }
          >
            <Text style={styles.buttonText}>
              {task.completed
                ? 'Mark as Incomplete'
                : 'Mark as Completed'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            disabled={saving}
            onPress={handleDelete}
            accessibilityRole="button"
            accessibilityLabel="Delete this task"
          >
            <Text style={styles.buttonText}>Delete Task</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
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
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#17182B',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#292A40',
  },
  taskTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#A78BFA',
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 12,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#17182B',
    color: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
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
    marginBottom: 12,
  },
  secondaryButton: {
    backgroundColor: '#474166',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  deleteButton: {
    backgroundColor: '#B91C1C',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
