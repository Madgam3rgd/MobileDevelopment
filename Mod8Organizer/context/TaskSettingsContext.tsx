
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

export type SortOption =
  | 'newest'
  | 'oldest'
  | 'alphabetical';

type TaskSettingsContextType = {
  sortBy: SortOption;
  setSortBy: (value: SortOption) => void;
  showCompleted: boolean;
  setShowCompleted: (value: boolean) => void;
};

const TaskSettingsContext =
  createContext<TaskSettingsContextType | undefined>(undefined);

const STORAGE_KEY = '@task_organizer_settings';

export function TaskSettingsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showCompleted, setShowCompleted] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);

        if (saved) {
          const settings = JSON.parse(saved);

          if (
            settings.sortBy === 'newest' ||
            settings.sortBy === 'oldest' ||
            settings.sortBy === 'alphabetical'
          ) {
            setSortBy(settings.sortBy);
          }

          if (typeof settings.showCompleted === 'boolean') {
            setShowCompleted(settings.showCompleted);
          }
        }
      } catch (error) {
        console.error('Failed to load task settings:', error);
      } finally {
        setLoaded(true);
      }
    }

    loadSettings();
  }, []);

  useEffect(() => {
    if (!loaded) return;

    async function saveSettings() {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ sortBy, showCompleted })
        );
      } catch (error) {
        console.error('Failed to save task settings:', error);
      }
    }

    saveSettings();
  }, [sortBy, showCompleted, loaded]);

  return (
    <TaskSettingsContext.Provider
      value={{
        sortBy,
        setSortBy,
        showCompleted,
        setShowCompleted,
      }}
    >
      {children}
    </TaskSettingsContext.Provider>
  );
}

export function useTaskSettings() {
  const context = useContext(TaskSettingsContext);

  if (!context) {
    throw new Error(
      'useTaskSettings must be used inside TaskSettingsProvider'
    );
  }

  return context;
}
