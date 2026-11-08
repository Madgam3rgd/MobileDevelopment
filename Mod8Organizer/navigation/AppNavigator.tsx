
import React from 'react';
import { Platform } from 'react-native';

import {
  NavigationContainer,
  NavigatorScreenParams,
} from '@react-navigation/native';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import HomeScreen from '../screens/Homescreen';
import TasksScreen from '../screens/TasksScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AddTaskScreen from '../screens/AddTaskScreen';
import TaskDetailsScreen from '../screens/TaskDetailsScreen';

import type {
  RootStackParamList,
  TabParamList,
} from '../types/Navigation';

const Stack =
  createNativeStackNavigator<RootStackParamList>();

const Tab =
  createBottomTabNavigator<TabParamList>();

const COLORS = {
  background: '#0F1020',
  card: '#17182B',
  border: '#292A40',
  primary: '#A78BFA',
  inactive: '#888888',
  text: '#FFFFFF',
};

// Bottom tab navigation
function MainTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.inactive,

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },

        tabBarIcon: ({ color, size, focused }) => {
          let iconName:
            React.ComponentProps<typeof Ionicons>['name'];

          if (route.name === 'Home') {
            iconName = focused
              ? 'home'
              : 'home-outline';
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

        // Keep tabs above Android navigation buttons
        tabBarStyle: {
          backgroundColor: COLORS.card,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 60 + insets.bottom,
          paddingTop: 6,
          paddingBottom: Math.max(insets.bottom, 6),
        },

        tabBarItemStyle: {
          paddingVertical: 2,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
      />

      <Tab.Screen
        name="Tasks"
        component={TasksScreen}
      />

      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
      />
    </Tab.Navigator>
  );
}

// Main stack navigation
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.card,
          },
          headerTintColor: COLORS.text,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: COLORS.background,
          },
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="AddTask"
          component={AddTaskScreen}
          options={{
            title: 'Add Task',
          }}
        />

        <Stack.Screen
          name="TaskDetails"
          component={TaskDetailsScreen}
          options={{
            title: 'Task Details',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
