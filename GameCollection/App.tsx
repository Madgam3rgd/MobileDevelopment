
import React from 'react';
import {
  NavigationContainer,
  DarkTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import GamesScreen from './screens/GamesScreen';
import DetailsScreen from './screens/DetailsScreen';
import AboutScreen from './screens/AboutScreen';
import CollectionScreen from './screens/CollectionScreen';
import AddGameScreen from './screens/AddGameScreen';

export type RootStackParamList = {
  Home: undefined;
  Games: undefined;
  Details: {
    title: string;
    genre: string;
    developer: string;
    description: string;
  };
  About: undefined;
  Collection: undefined;
  AddGame: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const GameTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#0F1020',
    card: '#17182B',
    text: '#FFFFFF',
    border: '#292A40',
    primary: '#8B5CF6',
  },
};

function App() {
  return (
    <NavigationContainer theme={GameTheme}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#17182B',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          animation: 'slide_from_right',
          gestureEnabled: true,
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Game Collection' }}
        />

        <Stack.Screen
          name="Games"
          component={GamesScreen}
          options={{ title: 'My Games' }}
        />

        <Stack.Screen
          name="Details"
          component={DetailsScreen}
          options={{ title: 'Game Details' }}
        />

        <Stack.Screen
          name="About"
          component={AboutScreen}
          options={{ title: 'About' }}
        />

        <Stack.Screen
          name="Collection"
          component={CollectionScreen}
          options={{ title: 'Saved Collection' }}
        />

        <Stack.Screen
          name="AddGame"
          component={AddGameScreen}
          options={{ title: 'Add New Game' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
