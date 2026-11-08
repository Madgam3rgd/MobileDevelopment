
import React from 'react';

import { StatusBar } from 'expo-status-bar';

import {
  NavigationContainer,
} from '@react-navigation/native';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import Ionicons from '@expo/vector-icons/Ionicons';

// Context providers
import { TaskProvider } from './context/Taskcontext';
import { TaskSettingsProvider } from './context/TaskSettingsContext';

// Screens
import HomeScreen from './screens/Homescreen';
import TasksScreen from './screens/TasksScreen';
import SettingsScreen from './screens/SettingsScreen';
import AddTaskScreen from './screens/AddTaskScreen';

// Navigation types
import type { TabParamList } from './types/Navigation';

// Root stack navigation types
type RootStackParamList = {
  MainTabs: undefined;
  AddTask: undefined;
};

// Create navigators
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// App colors
const COLORS = {
  background: '#0F1020',
  card: '#1A1A30',
  purple: '#A78BFA',
  white: '#FFFFFF',
  gray: '#9999AA',
  border: '#30304B',
};

// Bottom tab navigation
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarStyle: {
          backgroundColor: COLORS.card,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 65,
          paddingBottom: 8,
          paddingTop: 6,
        },

        tabBarActiveTintColor: COLORS.purple,
        tabBarInactiveTintColor: COLORS.gray,

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },

        tabBarIcon: ({ color, size, focused }) => {
          let iconName:
            | 'home'
            | 'home-outline'
            | 'checkbox'
            | 'checkbox-outline'
            | 'settings'
            | 'settings-outline';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Tasks') {
            iconName = focused
              ? 'checkbox'
              : 'checkbox-outline';
          } else {
            iconName = focused
              ? 'settings'
              : 'settings-outline';
          }

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      {/* Home Screen */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
      />

      {/* Tasks Screen */}
      <Tab.Screen
        name="Tasks"
        component={TasksScreen}
      />

      {/* Settings Screen */}
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
      />
    </Tab.Navigator>
  );
}

// Main application
export default function App() {
  return (
    <TaskProvider>
      <TaskSettingsProvider>
        <NavigationContainer>

          {/* Status bar */}
          <StatusBar style="light" />

          {/* Root stack navigator */}
          <Stack.Navigator
            screenOptions={{
              contentStyle: {
                backgroundColor: COLORS.background,
              },

              headerStyle: {
                backgroundColor: COLORS.card,
              },

              headerTintColor: COLORS.white,

              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            {/* Main bottom tabs */}
            <Stack.Screen
              name="MainTabs"
              component={MainTabs}
              options={{
                headerShown: false,
              }}
            />

            {/* Add Task Screen */}
            <Stack.Screen
              name="AddTask"
              component={AddTaskScreen}
              options={{
                title: 'Add Task',
                headerBackTitle: 'Back',
              }}
            />
          </Stack.Navigator>

        </NavigationContainer>
      </TaskSettingsProvider>
    </TaskProvider>
  );
}
