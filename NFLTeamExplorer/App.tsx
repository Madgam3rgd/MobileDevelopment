
import React from 'react';
import { StatusBar } from 'expo-status-bar';

// Import Favorites Context
import { FavoritesProvider } from './context/FavoritesContext';

// Import App Navigator
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  return (
    <FavoritesProvider>
      {/* Set status bar to light for dark theme */}
      <StatusBar style="light" />

      {/* Main application navigation */}
      <AppNavigator />
    </FavoritesProvider>
  );
}
