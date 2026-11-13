
import React from 'react';

import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native';

// Safe area to prevent overlapping status bar
import { SafeAreaView } from 'react-native-safe-area-context';

import type {
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';

import type {
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import TeamCard from '../components/TeamCard';

import { useFavorites } from '../context/FavoritesContext';

import type { NFLTeam } from '../types/NFL';

import type {
  TabParamList,
  RootStackParamList,
} from '../types/Navigation';

import teamData from '../data/teams.json';

type Props = BottomTabScreenProps<
  TabParamList,
  'Favorites'
>;

type ParentNavigation = NativeStackNavigationProp<
  RootStackParamList
>;

const teams: NFLTeam[] = teamData.teams as NFLTeam[];

export default function FavoritesScreen({
  navigation,
}: Props) {

  const {
    favorites,
    isFavorite,
    toggleFavorite,
    loading,
  } = useFavorites();

  // Show only favorite teams
  const favoriteTeams = teams.filter(team =>
    favorites.includes(team.id)
  );

  // Open team details
  const openTeamDetails = (teamId: string) => {
    const parentNavigation =
      navigation.getParent<ParentNavigation>();

    parentNavigation?.navigate('TeamDetails', {
      teamId,
    });
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top']}
    >

      {/* Page Header */}
      <Text style={styles.title}>
        My Favorite Teams
      </Text>

      <Text style={styles.subtitle}>
        View and manage your favorite NFL teams.
      </Text>

      {/* Favorite Team Count */}
      <Text style={styles.teamCount}>
        {favoriteTeams.length} Favorite Teams
      </Text>

      {/* Favorites List */}
      <FlatList
        data={favoriteTeams}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}

        renderItem={({ item }) => (
          <TeamCard
            team={item}
            isFavorite={isFavorite(item.id)}
            onPress={() => openTeamDetails(item.id)}
            onToggleFavorite={() => {
              void toggleFavorite(item.id);
            }}
          />
        )}

        ListEmptyComponent={
          <View style={styles.emptyContainer}>

            <Text style={styles.emptyTitle}>
              {loading
                ? 'Loading favorites...'
                : 'No Favorite Teams Yet'}
            </Text>

            <Text style={styles.emptyText}>
              {loading
                ? 'Please wait while your teams load.'
                : 'Go to the Teams tab and tap the heart next to a team to add it to your favorites.'}
            </Text>

          </View>
        }
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#0F1020',
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  subtitle: {
    color: '#BBBBCC',
    fontSize: 15,
    marginBottom: 20,
    lineHeight: 22,
  },

  teamCount: {
    color: '#A78BFA',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 15,
  },

  listContent: {
    paddingBottom: 30,
    flexGrow: 1,
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: 20,
  },

  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },

  emptyText: {
    color: '#BBBBCC',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 23,
  },

});
