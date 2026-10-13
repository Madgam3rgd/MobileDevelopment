
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Game {
  id: string;
  title: string;
  genre: string;
  platform: string;
}

const STORAGE_KEY = '@game_collection';

export async function loadGames(): Promise<Game[]> {
  const savedGames = await AsyncStorage.getItem(STORAGE_KEY);

  if (savedGames === null) {
    return [];
  }

  return JSON.parse(savedGames) as Game[];
}

export async function saveGames(
  games: Game[]
): Promise<void> {
  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(games)
  );
}
