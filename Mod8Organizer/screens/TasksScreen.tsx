
import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { useTasks } from '../context/Taskcontext';
import { useTaskSettings } from '../context/TaskSettingsContext';
import type { TabParamList } from '../types/Navigation';

type Props = BottomTabScreenProps<TabParamList, 'Tasks'>;

export default function TasksScreen({ navigation }: Props) {
  const { tasks, loading } = useTasks();
  const { sortBy, showCompleted } = useTaskSettings();

  const visibleTasks = useMemo(() => {
    const filtered = tasks.filter(
      task => showCompleted || !task.completed
    );

    return [...filtered].sort((a, b) => {
      if (sortBy === 'alphabetical') {
        return a.title.localeCompare(b.title);
      }

      // Assumes IDs increase when new tasks are created.
      const firstId = Number(a.id);
      const secondId = Number(b.id);

      if (sortBy === 'newest') {
        return secondId - firstId;
      }

      return firstId - secondId;
    });
  }, [tasks, sortBy, showCompleted]);

  const handleAddTask = () => {
    navigation.getParent()?.navigate('AddTask');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Tasks</Text>
        <Text style={styles.subtitle}>
          Manage your daily tasks here.
        </Text>
      </View>

      <FlatList
        data={visibleTasks}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="checkbox-outline"
              size={58}
              color="#A78BFA"
            />
            <Text style={styles.emptyTitle}>
              {loading ? 'Loading tasks...' : 'No tasks yet'}
            </Text>
            {!loading && (
              <Text style={styles.emptyText}>
                Add your first task to get started.
              </Text>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.taskCard}>
            <View style={styles.taskIcon}>
              <Ionicons
                name={
                  item.completed
                    ? 'checkmark-circle'
                    : 'ellipse-outline'
                }
                size={28}
                color="#A78BFA"
              />
            </View>

            <View style={styles.taskInfo}>
              <Text
                style={[
                  styles.taskTitle,
                  item.completed && styles.completedText,
                ]}
              >
                {item.title}
              </Text>

              {!!item.description && (
                <Text style={styles.description}>
                  {item.description}
                </Text>
              )}

              <Text style={styles.status}>
                {item.completed ? 'Completed' : 'Not completed'}
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={24}
              color="#A78BFA"
            />
          </View>
        )}
      />

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddTask}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
          <Text style={styles.addButtonText}>
            Add New Task
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1020',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 18,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 16,
    color: '#A78BFA',
    marginTop: 10,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexGrow: 1,
  },
  taskCard: {
    backgroundColor: '#1A1A30',
    borderWidth: 1,
    borderColor: '#30304B',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskIcon: {
    marginRight: 14,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: 'bold',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#9999AA',
  },
  description: {
    color: '#BBBBCC',
    fontSize: 14,
    marginTop: 6,
  },
  status: {
    color: '#A78BFA',
    fontSize: 13,
    marginTop: 10,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 18,
    backgroundColor: '#0F1020',
  },
  addButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 14,
    paddingVertical: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 50,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptyText: {
    color: '#BBBBCC',
    fontSize: 15,
    marginTop: 8,
    textAlign: 'center',
  },
});
