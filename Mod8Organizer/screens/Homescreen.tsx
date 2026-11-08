
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { useTasks } from '../context/Taskcontext';
import type { TabParamList } from '../types/Navigation';

type Props = BottomTabScreenProps<TabParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  // Get saved tasks from TaskContext
  const { tasks, loading } = useTasks();

  // Calculate task statistics
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    task => task.completed
  ).length;

  const pendingTasks = totalTasks - completedTasks;

  const progress =
    totalTasks > 0
      ? (completedTasks / totalTasks) * 100
      : 0;

  const progressPercent = Math.round(progress);

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top']}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        {/* Dashboard heading */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.smallTitle}>
              PERSONAL ORGANIZER
            </Text>

            <Text style={styles.title}>
              My Dashboard
            </Text>

            <Text style={styles.subtitle}>
              Stay organized and track your progress.
            </Text>
          </View>

          <Ionicons
            name="grid-outline"
            size={32}
            color="#A78BFA"
          />
        </View>

        {/* Task statistics */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons
              name="list-outline"
              size={26}
              color="#A78BFA"
            />

            <Text style={styles.statNumber}>
              {totalTasks}
            </Text>

            <Text style={styles.statLabel}>
              Total
            </Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons
              name="time-outline"
              size={26}
              color="#FBBF24"
            />

            <Text style={styles.statNumber}>
              {pendingTasks}
            </Text>

            <Text style={styles.statLabel}>
              Pending
            </Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons
              name="checkmark-circle-outline"
              size={26}
              color="#34D399"
            />

            <Text style={styles.statNumber}>
              {completedTasks}
            </Text>

            <Text style={styles.statLabel}>
              Completed
            </Text>
          </View>
        </View>

        {/* Progress card */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>
              Task Progress
            </Text>

            <Text style={styles.progressPercent}>
              {progressPercent}%
            </Text>
          </View>

          <View style={styles.progressBackground}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress}%` },
              ]}
            />
          </View>

          <Text style={styles.progressDescription}>
            {completedTasks} of {totalTasks} tasks completed
          </Text>
        </View>

        {/* Welcome message */}
        <View style={styles.messageCard}>
          <Ionicons
            name="sparkles-outline"
            size={28}
            color="#A78BFA"
          />

          <Text style={styles.messageTitle}>
            {totalTasks === 0
              ? 'Ready to get organized?'
              : pendingTasks === 0
              ? 'Great job!'
              : 'Keep going!'}
          </Text>

          <Text style={styles.messageText}>
            {totalTasks === 0
              ? 'Start by adding your first task.'
              : pendingTasks === 0
              ? 'You have completed all your tasks!'
              : `You still have ${pendingTasks} task(s) to complete.`}
          </Text>
        </View>

        {/* Navigation button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Tasks')}
          accessibilityRole="button"
          accessibilityLabel="View my tasks"
        >
          <Ionicons
            name="checkbox-outline"
            size={22}
            color="#FFFFFF"
          />

          <Text style={styles.buttonText}>
            View My Tasks
          </Text>
        </TouchableOpacity>

        {loading && (
          <Text style={styles.loadingText}>
            Loading saved tasks...
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1020',
  },

  scrollView: {
    flex: 1,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },

  headerText: {
    flex: 1,
    paddingRight: 12,
  },

  smallTitle: {
    fontSize: 12,
    color: '#A78BFA',
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 8,
  },

  title: {
    fontSize: 30,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    color: '#CCCCCC',
  },

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  statCard: {
    backgroundColor: '#17182B',
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 8,
    alignItems: 'center',
    width: '31%',
    borderWidth: 1,
    borderColor: '#292A40',
  },

  statNumber: {
    fontSize: 26,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: 10,
  },

  statLabel: {
    fontSize: 12,
    color: '#CCCCCC',
    marginTop: 5,
  },

  progressCard: {
    backgroundColor: '#17182B',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#292A40',
  },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  progressTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  progressPercent: {
    fontSize: 18,
    color: '#A78BFA',
    fontWeight: 'bold',
  },

  progressBackground: {
    height: 12,
    backgroundColor: '#292A40',
    borderRadius: 10,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 10,
  },

  progressDescription: {
    fontSize: 13,
    color: '#CCCCCC',
    marginTop: 12,
  },

  messageCard: {
    backgroundColor: '#17182B',
    padding: 20,
    borderRadius: 12,
    marginBottom: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#292A40',
  },

  messageTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
  },

  messageText: {
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: 22,
  },

  button: {
    backgroundColor: '#8B5CF6',
    padding: 18,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },

  buttonText: {
    fontSize: 17,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  loadingText: {
    color: '#A78BFA',
    textAlign: 'center',
    marginTop: 20,
  },
});
