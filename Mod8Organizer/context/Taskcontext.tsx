
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Task } from '../types/Tasks';

// Options for sorting tasks
export type SortOption = 'newest' | 'oldest' | 'az';

type TaskContextType = {
  tasks: Task[];
  loading: boolean;
  error: string | null;

  showCompleted: boolean;
  sortOption: SortOption;

  addTask: (
    title: string,
    description: string
  ) => Promise<void>;

  updateTask: (
    id: string,
    title: string,
    description: string
  ) => Promise<void>;

  toggleTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  clearAllTasks: () => Promise<void>;

  setShowCompleted: (value: boolean) => Promise<void>;
  setSortOption: (value: SortOption) => Promise<void>;
};

const TaskContext = createContext<
  TaskContextType | undefined
>(undefined);

const TASKS_KEY = '@personal_task_organizer_tasks';
const SETTINGS_KEY = '@personal_task_organizer_settings';

type SavedSettings = {
  showCompleted: boolean;
  sortOption: SortOption;
};

export function TaskProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showCompletedState, setShowCompletedState] =
    useState(true);

  const [sortOptionState, setSortOptionState] =
    useState<SortOption>('newest');

  // References keep the latest saved values available
  const tasksRef = useRef<Task[]>([]);
  const taskQueueRef = useRef<Promise<void>>(
    Promise.resolve()
  );

  const settingsRef = useRef<SavedSettings>({
    showCompleted: true,
    sortOption: 'newest',
  });

  const settingsQueueRef = useRef<Promise<void>>(
    Promise.resolve()
  );

  // Load tasks and settings when the app starts
  useEffect(() => {
    async function loadData() {
      try {
        const [savedTasks, savedSettings] =
          await Promise.all([
            AsyncStorage.getItem(TASKS_KEY),
            AsyncStorage.getItem(SETTINGS_KEY),
          ]);

        const parsedTasks: Task[] = savedTasks
          ? JSON.parse(savedTasks)
          : [];

        if (!Array.isArray(parsedTasks)) {
          throw new Error('Invalid task data');
        }

        tasksRef.current = parsedTasks;
        setTasks(parsedTasks);

        if (savedSettings) {
          const parsed: SavedSettings =
            JSON.parse(savedSettings);

          const validSettings: SavedSettings = {
            showCompleted:
              typeof parsed.showCompleted === 'boolean'
                ? parsed.showCompleted
                : true,
            sortOption:
              ['newest', 'oldest', 'az'].includes(
                parsed.sortOption
              )
                ? parsed.sortOption
                : 'newest',
          };

          settingsRef.current = validSettings;
          setShowCompletedState(
            validSettings.showCompleted
          );
          setSortOptionState(validSettings.sortOption);
        }
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Could not load saved data.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Save task changes in order
  const persistTasks = (
    change: (current: Task[]) => Task[]
  ) => {
    const operation = taskQueueRef.current
      .catch(() => {})
      .then(async () => {
        const next = change(tasksRef.current);

        await AsyncStorage.setItem(
          TASKS_KEY,
          JSON.stringify(next)
        );

        tasksRef.current = next;
        setTasks(next);
        setError(null);
      });

    taskQueueRef.current = operation;
    return operation;
  };

  // Save settings changes in order
  const persistSettings = (
    change: (current: SavedSettings) => SavedSettings
  ) => {
    const operation = settingsQueueRef.current
      .catch(() => {})
      .then(async () => {
        const next = change(settingsRef.current);

        await AsyncStorage.setItem(
          SETTINGS_KEY,
          JSON.stringify(next)
        );

        settingsRef.current = next;
        setShowCompletedState(next.showCompleted);
        setSortOptionState(next.sortOption);
        setError(null);
      });

    settingsQueueRef.current = operation;
    return operation;
  };

  // Create a new task
  const addTask = (
    title: string,
    description: string
  ) =>
    persistTasks(current => [
      ...current,
      {
        id: `${Date.now()}-${Math.random()}`,
        title,
        description,
        completed: false,
        createdAt: new Date().toISOString(),
      },
    ]);

  // Edit an existing task
  const updateTask = (
    id: string,
    title: string,
    description: string
  ) =>
    persistTasks(current =>
      current.map(task =>
        task.id === id
          ? { ...task, title, description }
          : task
      )
    );

  // Mark a task completed or incomplete
  const toggleTask = (id: string) =>
    persistTasks(current =>
      current.map(task =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
            }
          : task
      )
    );

  // Delete one task
  const deleteTask = (id: string) =>
    persistTasks(current =>
      current.filter(task => task.id !== id)
    );

  // Delete all saved tasks
  const clearAllTasks = () =>
    persistTasks(() => []);

  // Save show/hide preference
  const setShowCompleted = (value: boolean) =>
    persistSettings(current => ({
      ...current,
      showCompleted: value,
    }));

  // Save sorting preference
  const setSortOption = (value: SortOption) =>
    persistSettings(current => ({
      ...current,
      sortOption: value,
    }));

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
        showCompleted: showCompletedState,
        sortOption: sortOptionState,
        addTask,
        updateTask,
        toggleTask,
        deleteTask,
        clearAllTasks,
        setShowCompleted,
        setSortOption,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

// Hook used by all screens
export function useTasks() {
  const context = useContext(TaskContext);

  if (!context) {
    throw new Error(
      'useTasks must be used inside TaskProvider'
    );
  }

  return context;
}
