
import React from 'react';

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

// Correct navigation type for stack screens
import type {
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

// Import favorites context
import { useFavorites } from '../context/FavoritesContext';

// Import types
import type { NFLTeam } from '../types/NFL';
import type { RootStackParamList } from '../types/Navigation';

// Import NFL team data
import teamData from '../data/teams.json';

// Define navigation props
type Props = NativeStackScreenProps<
  RootStackParamList,
  'TeamDetails'
>;

// Load NFL teams from JSON
const teams: NFLTeam[] = teamData.teams as NFLTeam[];

export default function TeamDetailsScreen({
  route,
}: Props) {

  // Get selected team ID from navigation
  const { teamId } = route.params;

  // Favorites functionality
  const {
    isFavorite,
    toggleFavorite,
    loading,
  } = useFavorites();

  // Find selected team
  const team = teams.find(item => item.id === teamId);

  // Handle team not found
  if (!team) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Team not found.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >

      {/* Team Header */}
      <Text style={styles.title}>
        {team.name}
      </Text>

      <Text style={styles.subtitle}>
        {team.city} | {team.conference}
      </Text>

      {/* Favorite Button */}
      <TouchableOpacity
        style={[
          styles.favoriteButton,
          isFavorite(team.id) && styles.favoriteActive,
        ]}
        onPress={() => {
          void toggleFavorite(team.id);
        }}
        disabled={loading}
        accessibilityRole="button"
        accessibilityLabel={
          isFavorite(team.id)
            ? 'Remove from favorites'
            : 'Add to favorites'
        }
      >
        <Text style={styles.favoriteText}>
          {isFavorite(team.id)
            ? '♥ Remove from Favorites'
            : '♡ Add to Favorites'}
        </Text>
      </TouchableOpacity>

      {/* Players Section */}
      <Text style={styles.sectionTitle}>
        Team Players
      </Text>

      <Text style={styles.sectionSubtitle}>
        Players currently listed in our NFL database.
      </Text>

      {/* Player Cards */}
      {team.players.map(player => (
        <View
          key={player.id}
          style={styles.playerCard}
        >

          {/* Jersey Number */}
          <View style={styles.numberBox}>
            <Text style={styles.jerseyNumber}>
              #{player.number}
            </Text>
          </View>

          {/* Player Information */}
          <View style={styles.playerInfo}>
            <Text style={styles.playerName}>
              {player.name}
            </Text>

            <Text style={styles.playerPosition}>
              Position: {player.position}
            </Text>
          </View>

        </View>
      ))}

      {/* Player Count */}
      <Text style={styles.playerCount}>
        {team.players.length} Players Listed
      </Text>

    </ScrollView>
  );
}

// App styling
const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#0F1020',
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  subtitle: {
    color: '#BBBBCC',
    fontSize: 16,
    marginBottom: 25,
  },

  favoriteButton: {
    backgroundColor: '#A78BFA',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 15,
    alignItems: 'center',
    marginBottom: 30,
  },

  favoriteActive: {
    backgroundColor: '#7C3AED',
  },

  favoriteText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6,
  },

  sectionSubtitle: {
    color: '#BBBBCC',
    fontSize: 14,
    marginBottom: 18,
  },

  playerCard: {
    backgroundColor: '#17182B',
    borderWidth: 1,
    borderColor: '#292A40',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  numberBox: {
    backgroundColor: '#292A40',
    padding: 12,
    borderRadius: 10,
    marginRight: 15,
    minWidth: 65,
    alignItems: 'center',
  },

  jerseyNumber: {
    color: '#A78BFA',
    fontSize: 20,
    fontWeight: 'bold',
  },

  playerInfo: {
    flex: 1,
  },

  playerName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },

  playerPosition: {
    color: '#BBBBCC',
    fontSize: 14,
  },

  playerCount: {
    color: '#888899',
    textAlign: 'center',
    fontSize: 13,
    marginTop: 15,
  },

  errorText: {
    color: '#FFFFFF',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 50,
  },

});
