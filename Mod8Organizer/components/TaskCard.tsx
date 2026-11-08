
import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { Task } from '../types/Tasks';

type Props = {
  task: Task;
  onPress: () => void;
};

export default function TaskCard({ task, onPress }: Props) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`View task ${task.title}, ${
        task.completed ? 'completed' : 'not completed'
      }`}
    >
      <View style={styles.row}>
        <Ionicons
          name={
            task.completed
              ? 'checkmark-circle'
              : 'ellipse-outline'
          }
          size={25}
          color={task.completed ? '#34D399' : '#A78BFA'}
        />

        <View style={styles.content}>
          <Text
            style={[
              styles.title,
              task.completed && styles.completed,
            ]}
          >
            {task.title}
          </Text>

          <Text style={styles.description} numberOfLines={2}>
            {task.description || 'No description'}
          </Text>

          <Text style={styles.status}>
            {task.completed ? 'Completed' : 'Not completed'}
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={20}
          color="#A78BFA"
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#17182B',
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#292A40',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginHorizontal: 12,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#AAAAAA',
  },
  description: {
    color: '#CCCCCC',
    marginTop: 5,
  },
  status: {
    color: '#A78BFA',
    marginTop: 8,
    fontSize: 12,
  },
});
