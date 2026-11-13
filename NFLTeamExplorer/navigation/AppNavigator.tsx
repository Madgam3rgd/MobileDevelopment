
import React from 'react';

import { NavigationContainer } from '@react-navigation/native';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import Ionicons from '@expo/vector-icons/Ionicons';

// Import screens
import TeamsScreen from '../screens/TeamsScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import TeamDetailsScreen from '../screens/TeamDetailsScreen';

// Import navigation types
import type {
  RootStackParamList,
  TabParamList,
} from '../types/Navigation';

// Create navigators
const Stack =
  createNativeStackNavigator<RootStackParamList>();

const Tab =
  createBottomTabNavigator<TabParamList>();

// Bottom navigation tabs
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor: '#A78BFA',
        tabBarInactiveTintColor: '#888899',

        tabBarStyle: {
          backgroundColor: '#17182B',
          borderTopColor: '#292A40',
          height: 65,
          paddingBottom: 8,
          paddingTop: 5,
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },

        tabBarIcon: ({ focused, color, size }) => {
          let iconName:
            | 'football'
            | 'football-outline'
            | 'heart'
            | 'heart-outline';

          if (route.name === 'Teams') {
            iconName = focused
              ? 'football'
              : 'football-outline';
          } else {
            iconName = focused
              ? 'heart'
              : 'heart-outline';
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
      <Tab.Screen
        name="Teams"
        component={TeamsScreen}
      />

      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
      />
    </Tab.Navigator>
  );
}

// Main application navigation
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#17182B',
          },

          headerTintColor: '#FFFFFF',

          headerTitleStyle: {
            fontWeight: 'bold',
          },

          contentStyle: {
            backgroundColor: '#0F1020',
          },
        }}
      >
        {/* Main tabs */}
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{
            headerShown: false,
          }}
        />

        {/* Team details */}
        <Stack.Screen
          name="TeamDetails"
          component={TeamDetailsScreen}
          options={{
            title: 'Team Details',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
