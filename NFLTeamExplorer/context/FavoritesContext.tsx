
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@nfl_team_favorites';

type FavoritesContextType = {
  favorites: string[];
  loading: boolean;
  isFavorite: (teamId: string) => boolean;
  toggleFavorite: (teamId: string) => Promise<void>;
};

const FavoritesContext = createContext<
  FavoritesContextType | undefined
>(undefined);

export function FavoritesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Load saved favorites when the app opens
  useEffect(() => {
    async function loadFavorites() {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);

        if (saved) {
          const parsed = JSON.parse(saved);

          if (Array.isArray(parsed)) {
            setFavorites(parsed);
          }
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setLoading(false);
      }
    }

    loadFavorites();
  }, []);

  // Add or remove a favorite team
  const toggleFavorite = async (teamId: string) => {
    const updatedFavorites = favorites.includes(teamId)
      ? favorites.filter(id => id !== teamId)
      : [...favorites, teamId];

    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedFavorites)
      );

      setFavorites(updatedFavorites);
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const isFavorite = (teamId: string) => {
    return favorites.includes(teamId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        loading,
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error(
      'useFavorites must be used inside FavoritesProvider'
    );
  }

  return context;
}
