
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';

import {
  useTasks,
  type SortOption,
} from '../context/Taskcontext';

export default function SettingsScreen() {
  const {
    sortOption,
    setSortOption,
    showCompleted,
    setShowCompleted,
    clearAllTasks,
    tasks,
    loading,
  } = useTasks();

  const [busy, setBusy] = useState(false);

  const sortOptions: {
    label: string;
    value: SortOption;
  }[] = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Oldest First', value: 'oldest' },
    { label: 'Alphabetical (A-Z)', value: 'az' },
  ];

  // Show or hide completed tasks
  const handleShowCompleted = async (value: boolean) => {
    try {
      await setShowCompleted(value);
    } catch {
      Alert.alert(
        'Error',
        'Could not save this setting.'
      );
    }
  };

  // Change task sorting
  const handleSortChange = async (value: SortOption) => {
    try {
      await setSortOption(value);
    } catch {
      Alert.alert(
        'Error',
        'Could not save sorting preference.'
      );
    }
  };

  // Clear all saved tasks
  const handleClearTasks = () => {
    if (tasks.length === 0) {
      Alert.alert(
        'No Tasks',
        'There are no tasks to delete.'
      );
      return;
    }

    Alert.alert(
      'Clear All Tasks',
      'Are you sure you want to permanently delete all tasks?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            setBusy(true);

            try {
              await clearAllTasks();

              Alert.alert(
                'Success',
                'All tasks have been deleted.'
              );
            } catch {
              Alert.alert(
                'Error',
                'Could not delete all tasks.'
              );
            } finally {
              setBusy(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Ionicons
            name="settings-outline"
            size={32}
            color="#A78BFA"
          />

          <Text style={styles.title}>
            Settings
          </Text>
        </View>

        {/* Task management */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            TASK MANAGEMENT
          </Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>
                Show Completed Tasks
              </Text>

              <Text style={styles.description}>
                Display finished tasks in your task list.
              </Text>
            </View>

            <Switch
              value={showCompleted}
              onValueChange={handleShowCompleted}
              disabled={loading || busy}
              trackColor={{
                false: '#44445A',
                true: '#8B5CF6',
              }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.divider} />

          <Text style={styles.settingTitle}>
            Sort Tasks
          </Text>

          <Text style={styles.description}>
            Choose how tasks appear in your list.
          </Text>

          {sortOptions.map(option => (
            <TouchableOpacity
              key={option.value}
              style={styles.sortRow}
              onPress={() =>
                handleSortChange(option.value)
              }
              disabled={loading || busy}
              activeOpacity={0.75}
            >
              <Text style={styles.sortText}>
                {option.label}
              </Text>

              <Ionicons
                name={
                  sortOption === option.value
                    ? 'radio-button-on'
                    : 'radio-button-off'
                }
                size={25}
                color="#A78BFA"
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Data management */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            DATA MANAGEMENT
          </Text>

          <Text style={styles.description}>
            Manage your saved tasks.
          </Text>

          <Text style={styles.taskCount}>
            Total Saved Tasks: {tasks.length}
          </Text>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleClearTasks}
            disabled={busy || loading}
            activeOpacity={0.8}
          >
            {busy ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons
                  name="trash-outline"
                  size={22}
                  color="#FFFFFF"
                />

                <Text style={styles.deleteButtonText}>
                  Clear All Tasks
                </Text>
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.warning}>
            Warning: This action cannot be undone.
          </Text>
        </View>

        {/* About */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            ABOUT
          </Text>

          <Text style={styles.aboutTitle}>
            Personal Task Organizer
          </Text>

          <Text style={styles.description}>
            Version 1.0
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1020',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  card: {
    backgroundColor: '#1A1A30',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#30304B',
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#A78BFA',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginBottom: 22,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingInfo: {
    flex: 1,
    paddingRight: 12,
  },
  settingTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  description: {
    color: '#B5B5C5',
    fontSize: 14,
    marginTop: 7,
    lineHeight: 21,
  },
  divider: {
    height: 1,
    backgroundColor: '#30304B',
    marginVertical: 22,
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  sortText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  taskCount: {
    color: '#FFFFFF',
    fontSize: 15,
    marginTop: 16,
  },
  deleteButton: {
    backgroundColor: '#B91C1C',
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  warning: {
    color: '#FCA5A5',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 14,
  },
  aboutTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 12,
  },
});
