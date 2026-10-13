
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import type { Game } from '../storage/gameStorage';
import { loadGames, saveGames } from '../storage/gameStorage';

type Props = {
  navigation: {
    navigate: (screen: 'AddGame') => void;
  };
};

export default function CollectionScreen({ navigation }: Props) {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Load saved games whenever the screen is opened.
  useFocusEffect(
    useCallback(() => {
      let active = true;

      const fetchGames = async () => {
        setLoading(true);

        try {
          const savedGames = await loadGames();

          if (active) {
            setGames(savedGames);
            setErrorMessage('');
          }
        } catch {
          if (active) {
            setErrorMessage('Could not load your games.');
          }
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      };

      fetchGames();

      return () => {
        active = false;
      };
    }, [])
  );

  // Show the confirmation overlay.
  const handleDeletePress = (game: Game) => {
    console.log('DELETE PRESSED:', game.title);
    setErrorMessage('');
    setSelectedGame(game);
  };

  // Delete the selected game from AsyncStorage.
  const confirmDelete = async () => {
    if (!selectedGame || deleting) {
      return;
    }

    setDeleting(true);
    setErrorMessage('');

    try {
      const currentGames = await loadGames();

      const updatedGames = currentGames.filter(
        game => game.id !== selectedGame.id
      );

      await saveGames(updatedGames);

      setGames(updatedGames);
      setSelectedGame(null);

      console.log('GAME DELETED SUCCESSFULLY');
    } catch (error) {
      console.error('DELETE FAILED:', error);
      setErrorMessage('Could not delete the game. Try again.');
    } finally {
      setDeleting(false);
    }
  };

  const cancelDelete = () => {
    if (!deleting) {
      setSelectedGame(null);
      setErrorMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        ⭐ My Saved Collection
      </Text>

      <Text style={styles.subtitle}>
        Manage your favorite games.
      </Text>

      <Text style={styles.count}>
        Total Games: {games.length}
      </Text>

      <Pressable
        style={({ pressed }) => [
          styles.addButton,
          pressed && styles.buttonPressed,
        ]}
        onPress={() => navigation.navigate('AddGame')}
      >
        <Text style={styles.buttonText}>
          + Add New Game
        </Text>
      </Pressable>

      {errorMessage !== '' && selectedGame === null && (
        <Text style={styles.errorText}>
          {errorMessage}
        </Text>
      )}

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator
            size="large"
            color="#A78BFA"
          />
        </View>
      ) : (
        <FlatList
          data={games}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>
                🎮
              </Text>

              <Text style={styles.emptyTitle}>
                No Games Saved
              </Text>

              <Text style={styles.emptyText}>
                Add your first game to start your collection!
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.gameCard}>
              <Text style={styles.gameTitle}>
                {item.title}
              </Text>

              <Text style={styles.gameInfo}>
                Genre: {item.genre}
              </Text>

              <Text style={styles.gameInfo}>
                Platform: {item.platform}
              </Text>

              <Pressable
                style={({ pressed }) => [
                  styles.deleteButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={() => handleDeletePress(item)}
              >
                <Text style={styles.deleteText}>
                  Delete Game
                </Text>
              </Pressable>
            </View>
          )}
        />
      )}

      {/* Delete confirmation overlay */}
      {selectedGame !== null && (
        <View style={styles.overlay}>
          <View style={styles.confirmationBox}>
            <Text style={styles.confirmationTitle}>
              Delete Game?
            </Text>

            <Text style={styles.confirmationMessage}>
              Are you sure you want to delete{' '}
              {selectedGame.title}?
            </Text>

            {errorMessage !== '' && (
              <Text style={styles.errorText}>
                {errorMessage}
              </Text>
            )}

            <Pressable
              style={({ pressed }) => [
                styles.confirmButton,
                (pressed || deleting) && styles.buttonPressed,
              ]}
              onPress={confirmDelete}
              disabled={deleting}
            >
              <Text style={styles.deleteText}>
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.cancelButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={cancelDelete}
              disabled={deleting}
            >
              <Text style={styles.cancelText}>
                Cancel
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1020',
    padding: 20,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  heading: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  subtitle: {
    color: '#A78BFA',
    fontSize: 16,
    marginBottom: 15,
  },

  count: {
    color: '#B8B9C9',
    fontSize: 15,
    marginBottom: 20,
  },

  addButton: {
    backgroundColor: '#7C3AED',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },

  list: {
    flexGrow: 1,
    paddingBottom: 30,
  },

  gameCard: {
    backgroundColor: '#17182B',
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#292A40',
    marginBottom: 15,
  },

  gameTitle: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  gameInfo: {
    color: '#B8B9C9',
    fontSize: 15,
    marginBottom: 6,
  },

  deleteButton: {
    backgroundColor: '#B91C1C',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },

  deleteText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  buttonPressed: {
    opacity: 0.7,
  },

  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
    padding: 20,
  },

  emptyIcon: {
    fontSize: 55,
    marginBottom: 15,
  },

  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  emptyText: {
    color: '#B8B9C9',
    fontSize: 16,
    textAlign: 'center',
  },

  // Fixed overlay: no StyleSheet.absoluteFillObject
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 10,
    elevation: 10,
  },

  confirmationBox: {
    backgroundColor: '#17182B',
    width: '100%',
    maxWidth: 360,
    padding: 25,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#383A55',
  },

  confirmationTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },

  confirmationMessage: {
    color: '#B8B9C9',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 25,
  },

  confirmButton: {
    backgroundColor: '#B91C1C',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
  },

  cancelButton: {
    backgroundColor: '#1E2038',
    borderColor: '#7C3AED',
    borderWidth: 1,
    padding: 15,
    borderRadius: 10,
  },

  cancelText: {
    color: '#C4B5FD',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  errorText: {
    color: '#FCA5A5',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
});
