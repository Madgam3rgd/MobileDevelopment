
import React, { useMemo, useState } from 'react';

import {
  View,
  Text,
  TextInput,
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
  'Teams'
>;

type ParentNavigation = NativeStackNavigationProp<
  RootStackParamList
>;

const teams: NFLTeam[] = teamData.teams as NFLTeam[];

export default function TeamsScreen({ navigation }: Props) {

  const [search, setSearch] = useState('');

  const {
    isFavorite,
    toggleFavorite,
    loading,
  } = useFavorites();

  // Filter teams by name or city
  const filteredTeams = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return teams;
    }

    return teams.filter(team =>
      team.name.toLowerCase().includes(query) ||
      team.city.toLowerCase().includes(query)
    );
  }, [search]);

  // Open selected team's details
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
        NFL Team Explorer
      </Text>

      <Text style={styles.subtitle}>
        Explore NFL teams, view players, and save favorites.
      </Text>

      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search teams or cities..."
        placeholderTextColor="#888899"
        value={search}
        onChangeText={setSearch}
        autoCorrect={false}
        autoCapitalize="none"
      />

      {/* Team Count */}
      <Text style={styles.teamCount}>
        {filteredTeams.length} Teams Found
      </Text>

      {/* Team List */}
      <FlatList
        data={filteredTeams}
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
            <Text style={styles.emptyText}>
              No NFL teams found.
            </Text>

            <Text style={styles.emptySubtext}>
              Try searching for another team or city.
            </Text>
          </View>
        }
      />

      {loading && (
        <Text style={styles.loadingText}>
          Loading saved favorites...
        </Text>
      )}

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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    color: '#BBBBCC',
    marginBottom: 20,
    lineHeight: 22,
  },

  searchInput: {
    backgroundColor: '#17182B',
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#292A40',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 18,
  },

  teamCount: {
    color: '#A78BFA',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 12,
  },

  listContent: {
    paddingBottom: 30,
  },

  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
    paddingHorizontal: 20,
  },

  emptyText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  emptySubtext: {
    color: '#BBBBCC',
    fontSize: 14,
    textAlign: 'center',
  },

  loadingText: {
    color: '#BBBBCC',
    textAlign: 'center',
    paddingVertical: 10,
  },

});
