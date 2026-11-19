
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';

import { JournalEntry } from '../types/JournalEntry';

const STORAGE_KEY = '@location_journal_entries';

// Load saved journal entries
export async function loadEntries(): Promise<JournalEntry[]> {
  const saved = await AsyncStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return [];
  }

  return JSON.parse(saved) as JournalEntry[];
}

// Save journal entries
export async function saveEntries(
  entries: JournalEntry[]
): Promise<void> {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(entries)
    );

    console.log('Journal entries saved successfully');
  } catch (error) {
    console.error('AsyncStorage save error:', error);
    throw error;
  }
}

// Copy photo into permanent storage
export async function storePhoto(
  uri: string,
  id: string
): Promise<string> {
  try {
    const documentDirectory = FileSystem.documentDirectory;

    if (!documentDirectory) {
      throw new Error('Document storage is unavailable.');
    }

    const folder = `${documentDirectory}journalPhotos/`;

    // Create the folder if necessary
    await FileSystem.makeDirectoryAsync(folder, {
      intermediates: true,
    });

    // Determine image extension
    const cleanUri = uri.split('?')[0].toLowerCase();

    const extension = cleanUri.endsWith('.png')
      ? 'png'
      : cleanUri.endsWith('.webp')
      ? 'webp'
      : 'jpg';

    const destination = `${folder}${id}.${extension}`;

    console.log('Original photo:', uri);
    console.log('Saving photo to:', destination);

    // Copy photo
    await FileSystem.copyAsync({
      from: uri,
      to: destination,
    });

    // Verify saved file
    const fileInfo = await FileSystem.getInfoAsync(destination);

    if (!fileInfo.exists) {
      throw new Error(
        'The photo was copied but could not be found.'
      );
    }

    console.log('Photo successfully stored:', destination);

    return destination;
  } catch (error) {
    console.error('PHOTO STORAGE ERROR:', error);
    throw error;
  }
}

// Delete stored photo
export async function deletePhoto(
  uri: string
): Promise<void> {
  try {
    const fileInfo = await FileSystem.getInfoAsync(uri);

    if (fileInfo.exists) {
      await FileSystem.deleteAsync(uri, {
        idempotent: true,
      });

      console.log('Photo deleted:', uri);
    }
  } catch (error) {
    console.error('Photo deletion error:', error);
    throw error;
  }
}
