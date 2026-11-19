
import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';

import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Coordinates,
  JournalEntry,
} from '../types/JournalEntry';

import {
  storePhoto,
  deletePhoto,
} from '../utils/journalStorage';

type Props = {
  onBack: () => void;
  onSave: (entry: JournalEntry) => Promise<void>;
};

export default function CreateEntryScreen({
  onBack,
  onSave,
}: Props) {
  const insets = useSafeAreaInsets();

  // Journal information
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState(false);
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [note, setNote] = useState('');

  // Loading states
  const [busy, setBusy] = useState(false);
  const [busyAction, setBusyAction] = useState<
    'camera' | 'gallery' | 'location' | 'save' | null
  >(null);

  function startLoading(
    action: 'camera' | 'gallery' | 'location' | 'save'
  ) {
    setBusy(true);
    setBusyAction(action);
  }

  function stopLoading() {
    setBusy(false);
    setBusyAction(null);
  }

  // Open the device camera
  async function openCamera() {
    if (busy) return;

    startLoading('camera');

    try {
      // Request camera permission
      const permission =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          'Camera Permission',
          'Please allow camera access in your device settings.'
        );
        return;
      }

      // Open the Android camera interface
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.9,
      });

      if (result.canceled || !result.assets?.length) {
        return;
      }

      const capturedPhoto = result.assets[0];

      if (!capturedPhoto.uri) {
        throw new Error(
          'The camera did not return a valid photo.'
        );
      }

      console.log('Camera photo URI:', capturedPhoto.uri);
      console.log(
        'Photo dimensions:',
        capturedPhoto.width,
        capturedPhoto.height
      );

      setPhotoError(false);
      setPhotoUri(capturedPhoto.uri);

    } catch (error) {
      console.error('Camera capture error:', error);

      Alert.alert(
        'Camera Error',
        error instanceof Error
          ? error.message
          : 'Unable to capture the photo.'
      );
    } finally {
      stopLoading();
    }
  }

  // Choose photo from gallery
  async function chooseFromGallery() {
    if (busy) return;

    startLoading('gallery');

    try {
      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: false,
          quality: 0.9,
        });

      if (result.canceled || !result.assets?.length) {
        return;
      }

      const selectedPhoto = result.assets[0];

      if (!selectedPhoto.uri) {
        throw new Error(
          'The selected image does not have a valid URI.'
        );
      }

      console.log('Gallery photo URI:', selectedPhoto.uri);

      setPhotoError(false);
      setPhotoUri(selectedPhoto.uri);

    } catch (error) {
      console.error('Gallery error:', error);

      Alert.alert(
        'Gallery Error',
        error instanceof Error
          ? error.message
          : 'Unable to select a photo.'
      );
    } finally {
      stopLoading();
    }
  }

  // Get GPS location
  async function getLocation() {
    if (busy) return;

    startLoading('location');

    try {
      // Request foreground location permission
      const permission =
        await Location.requestForegroundPermissionsAsync();

      if (permission.status !== 'granted') {
        Alert.alert(
          'Location Permission',
          'Please allow location access in device settings.'
        );
        return;
      }

      // Check location services
      const servicesEnabled =
        await Location.hasServicesEnabledAsync();

      if (!servicesEnabled) {
        Alert.alert(
          'Location Disabled',
          'Please enable location services in Android settings.'
        );
        return;
      }

      let position: Location.LocationObject | null = null;

      // Try to get a fresh location
      try {
        position = await Promise.race([
          Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Low,
          }),
          new Promise<never>((_, reject) => {
            setTimeout(() => {
              reject(new Error('GPS request timed out'));
            }, 10000);
          }),
        ]);
      } catch (error) {
        console.warn(
          'Fresh GPS unavailable, trying cached location:',
          error
        );

        // Fall back to recently cached GPS coordinates
        position = await Location.getLastKnownPositionAsync({
          maxAge: 300000,
        });
      }

      if (!position) {
        Alert.alert(
          'Location Unavailable',
          'Unable to retrieve GPS coordinates. Open the emulator Extended Controls and set a simulated location.'
        );
        return;
      }

      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      setCoords({
        latitude,
        longitude,
      });

      console.log('GPS latitude:', latitude);
      console.log('GPS longitude:', longitude);

    } catch (error) {
      console.error('GPS error:', error);

      Alert.alert(
        'Location Error',
        error instanceof Error
          ? error.message
          : 'Unable to retrieve GPS coordinates.'
      );
    } finally {
      stopLoading();
    }
  }

  // Save journal entry
  async function saveEntry() {
    if (busy) return;

    if (!photoUri || photoError) {
      Alert.alert(
        'Missing Photo',
        'Please take or choose a valid photo before saving.'
      );
      return;
    }

    if (!coords) {
      Alert.alert(
        'Missing Location',
        'Please capture your GPS location before saving.'
      );
      return;
    }

    startLoading('save');

    let storedUri: string | null = null;

    try {
      const id =
        `${Date.now()}-${Math.random().toString(36).slice(2)}`;

      console.log('Starting journal save...');
      console.log('Photo URI:', photoUri);

      // Copy photo to permanent app storage
      storedUri = await storePhoto(photoUri, id);

      console.log('Stored photo URI:', storedUri);

      // Create journal entry
      const newEntry: JournalEntry = {
        id,
        photoUri: storedUri,
        latitude: coords.latitude,
        longitude: coords.longitude,
        note: note.trim(),
        timestamp: new Date().toISOString(),
      };

      // Save journal entry
      await onSave(newEntry);

      console.log('Journal entry saved successfully');

    } catch (error) {
      console.error('JOURNAL SAVE FAILED:', error);

      // Remove copied photo if saving failed
      if (storedUri) {
        try {
          await deletePhoto(storedUri);
        } catch (cleanupError) {
          console.warn(
            'Photo cleanup error:',
            cleanupError
          );
        }
      }

      Alert.alert(
        'Save Error',
        error instanceof Error
          ? error.message
          : 'Unable to save your journal entry.'
      );
    } finally {
      stopLoading();
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + 12,
          paddingBottom: insets.bottom + 30,
        },
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Back Button */}
      <TouchableOpacity
        onPress={onBack}
        disabled={busy}
      >
        <Text style={styles.backText}>
          ‹ Back to Home
        </Text>
      </TouchableOpacity>

      {/* Header */}
      <Text style={styles.title}>
        New Journal Entry
      </Text>

      <Text style={styles.subtitle}>
        Capture a memory and save its location.
      </Text>

      {/* Photo Section */}
      <Text style={styles.label}>
        Photo
      </Text>

      {photoUri ? (
        <View>
          <Image
            key={photoUri}
            source={{ uri: photoUri }}
            style={styles.photoPreview}
            resizeMode="cover"
            onLoad={() => {
              console.log(
                'Photo preview loaded:',
                photoUri
              );
            }}
            onError={(event) => {
              console.warn(
                'Photo preview error:',
                event.nativeEvent.error
              );

              setPhotoError(true);
            }}
          />

          {photoError && (
            <Text style={styles.errorText}>
              Unable to display the photo.
              Please choose another image.
            </Text>
          )}
        </View>
      ) : (
        <View style={styles.photoPlaceholder}>
          <Text style={styles.placeholderIcon}>
            📷
          </Text>

          <Text style={styles.mutedText}>
            No photo selected yet
          </Text>
        </View>
      )}

      {/* Camera Button */}
      <TouchableOpacity
        style={[
          styles.button,
          busy && styles.disabledButton,
        ]}
        onPress={openCamera}
        disabled={busy}
      >
        <Text style={styles.buttonText}>
          {busyAction === 'camera'
            ? 'Opening Camera...'
            : photoUri
            ? 'Retake Photo'
            : 'Open Camera'}
        </Text>
      </TouchableOpacity>

      {/* Gallery Button */}
      <TouchableOpacity
        style={[
          styles.secondaryButton,
          busy && styles.disabledButton,
        ]}
        onPress={chooseFromGallery}
        disabled={busy}
      >
        <Text style={styles.buttonText}>
          {busyAction === 'gallery'
            ? 'Opening Gallery...'
            : 'Choose from Gallery'}
        </Text>
      </TouchableOpacity>

      {/* GPS Section */}
      <Text style={styles.label}>
        GPS Location
      </Text>

      <View style={styles.infoCard}>
        {coords ? (
          <>
            <Text style={styles.infoText}>
              Latitude: {coords.latitude.toFixed(6)}
            </Text>

            <Text style={styles.infoText}>
              Longitude: {coords.longitude.toFixed(6)}
            </Text>
          </>
        ) : (
          <Text style={styles.mutedText}>
            Location not captured
          </Text>
        )}
      </View>

      {/* GPS Button */}
      <TouchableOpacity
        style={[
          styles.button,
          busy && styles.disabledButton,
        ]}
        onPress={getLocation}
        disabled={busy}
      >
        <Text style={styles.buttonText}>
          {busyAction === 'location'
            ? 'Getting Location...'
            : coords
            ? 'Refresh GPS Location'
            : 'Get Current Location'}
        </Text>
      </TouchableOpacity>

      {/* Journal Note Section */}
      <Text style={styles.label}>
        Journal Note
      </Text>

      <TextInput
        style={styles.noteInput}
        placeholder="What happened at this location?"
        placeholderTextColor="#888899"
        multiline
        textAlignVertical="top"
        value={note}
        onChangeText={setNote}
        editable={!busy}
      />

      {/* Loading Indicator */}
      {busy && (
        <ActivityIndicator
          size="large"
          color="#A78BFA"
          style={styles.loadingIndicator}
        />
      )}

      {/* Save Button */}
      <TouchableOpacity
        style={[
          styles.button,
          busy && styles.disabledButton,
        ]}
        onPress={saveEntry}
        disabled={busy}
      >
        <Text style={styles.buttonText}>
          {busyAction === 'save'
            ? 'Saving Journal Entry...'
            : 'Save Journal Entry'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1020',
  },

  content: {
    paddingHorizontal: 20,
  },

  backText: {
    color: '#A78BFA',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 20,
    paddingVertical: 8,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },

  subtitle: {
    color: '#B5B4C8',
    fontSize: 15,
    marginTop: 8,
    marginBottom: 20,
  },

  label: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },

  photoPreview: {
    width: '100%',
    height: 220,
    borderRadius: 14,
    backgroundColor: '#1A1A30',
  },

  photoPlaceholder: {
    height: 180,
    backgroundColor: '#1A1A30',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#292A40',
  },

  placeholderIcon: {
    fontSize: 42,
    marginBottom: 10,
  },

  mutedText: {
    color: '#B5B4C8',
    fontSize: 14,
  },

  infoCard: {
    backgroundColor: '#1A1A30',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#292A40',
  },

  infoText: {
    color: '#FFFFFF',
    fontSize: 15,
    marginVertical: 4,
  },

  noteInput: {
    backgroundColor: '#1A1A30',
    borderWidth: 1,
    borderColor: '#292A40',
    borderRadius: 12,
    color: '#FFFFFF',
    fontSize: 15,
    padding: 15,
    minHeight: 110,
    marginBottom: 20,
  },

  button: {
    backgroundColor: '#8B5CF6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },

  secondaryButton: {
    backgroundColor: '#292A40',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },

  disabledButton: {
    opacity: 0.5,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  loadingIndicator: {
    marginVertical: 12,
  },

  errorText: {
    color: '#FF7B91',
    fontSize: 13,
    marginTop: 8,
  },
});
