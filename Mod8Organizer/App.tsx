
import React from 'react';
import { StatusBar } from 'expo-status-bar';

// Main task context
import { TaskProvider } from './context/Taskcontext';

// Main navigation
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  return (
    <TaskProvider>
      <StatusBar style="light" />
      <AppNavigator />
    </TaskProvider>
  );
}
