
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import type { NFLTeam } from '../types/NFL';

type Props = {
  team: NFLTeam;
  isFavorite: boolean;
  onPress: () => void;
  onToggleFavorite: () => void;
};

export default function TeamCard({
  team,
  isFavorite,
  onPress,
  onToggleFavorite,
}: Props) {
  return (
    <View style={styles.card}>

      {/* Team Information */}
      <TouchableOpacity
        style={styles.teamInfo}
        onPress={onPress}
      >
        <Text style={styles.teamName}>
          {team.name}
        </Text>

        <Text style={styles.teamDetails}>
          {team.city} | {team.conference}
        </Text>

        <Text style={styles.viewPlayers}>
          View Players →
        </Text>
      </TouchableOpacity>

      {/* Favorite Button */}
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={onToggleFavorite}
        accessibilityRole="button"
        accessibilityLabel={
          isFavorite
            ? `Remove ${team.name} from favorites`
            : `Add ${team.name} to favorites`
        }
      >
        <Text style={styles.heart}>
          {isFavorite ? '♥' : '♡'}
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#17182B',
    borderRadius: 12,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#292A40',
    flexDirection: 'row',
    alignItems: 'center',
  },

  teamInfo: {
    flex: 1,
  },

  teamName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },

  teamDetails: {
    color: '#BBBBCC',
    fontSize: 14,
    marginBottom: 10,
  },

  viewPlayers: {
    color: '#A78BFA',
    fontSize: 14,
    fontWeight: '600',
  },

  favoriteButton: {
    padding: 12,
    marginLeft: 8,
  },

  heart: {
    color: '#A78BFA',
    fontSize: 32,
  },
});
