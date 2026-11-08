
import React from 'react';
import { StatusBar } from 'expo-status-bar';

// Context providers
import { TaskProvider } from './context/Taskcontext';
import { TaskSettingsProvider } from './context/TaskSettingsContext';

// Main navigation
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  return (
    <TaskProvider>
      <TaskSettingsProvider>
        <StatusBar style="light" />
        <AppNavigator />
      </TaskSettingsProvider>
    </TaskProvider>
  );
}
