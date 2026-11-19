
import React, { useState } from 'react';

import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { JournalEntry } from '../types/JournalEntry';

type Props = {
  entries: JournalEntry[];
  onBack: () => void;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, note: string) => Promise<void>;
};

export default function JournalScreen({
  entries,
  onBack,
  onDelete,
  onUpdate,
}: Props) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedNote, setEditedNote] = useState('');

  const [photoRatios, setPhotoRatios] = useState<
    Record<string, number>
  >({});

  const cardWidth = width - 32;

  // Calculate photo height
  function getPhotoHeight(id: string) {
    const ratio = photoRatios[id];

    if (!ratio || ratio <= 0) {
      return 240;
    }

    const naturalHeight = cardWidth / ratio;

    return Math.max(
      180,
      Math.min(naturalHeight, 420)
    );
  }

  // Store photo dimensions
  function handleImageLoad(
    id: string,
    imageWidth: number,
    imageHeight: number
  ) {
    if (imageWidth <= 0 || imageHeight <= 0) {
      return;
    }

    const ratio = imageWidth / imageHeight;

    setPhotoRatios(previous => {
      if (previous[id] === ratio) {
        return previous;
      }

      return {
        ...previous,
        [id]: ratio,
      };
    });
  }

  // Open Edit Entry popup
  function openEditor(entry: JournalEntry) {
    setEditingId(entry.id);
    setEditedNote(entry.note || '');
  }

  // Close Edit Entry popup
  function closeEditor() {
    if (saving) {
      return;
    }

    setEditingId(null);
    setEditedNote('');
  }

  // Save edited journal note
  async function saveEditedNote() {
    if (!editingId || saving) {
      return;
    }

    setSaving(true);

    try {
      await onUpdate(
        editingId,
        editedNote.trim()
      );

      setEditingId(null);
      setEditedNote('');

      Alert.alert(
        'Success',
        'Your journal entry has been updated!'
      );
    } catch (error) {
      console.error('Update journal error:', error);

      Alert.alert(
        'Update Error',
        error instanceof Error
          ? error.message
          : 'Unable to update the journal entry.'
      );
    } finally {
      setSaving(false);
    }
  }

  // Confirm deletion
  function confirmDelete(id: string) {
    Alert.alert(
      'Delete Journal Entry',
      'Are you sure you want to delete this journal entry?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            void deleteEntry(id);
          },
        },
      ]
    );
  }

  // Delete entry
  async function deleteEntry(id: string) {
    if (deletingId !== null) {
      return;
    }

    setDeletingId(id);

    try {
      await onDelete(id);
    } catch (error) {
      console.error('Delete journal error:', error);

      Alert.alert(
        'Delete Error',
        error instanceof Error
          ? error.message
          : 'Unable to delete the journal entry.'
      );
    } finally {
      setDeletingId(null);
    }
  }

  // Format timestamp
  function formatDate(timestamp: string) {
    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) {
      return timestamp;
    }

    return date.toLocaleString();
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + 12,
            paddingBottom: insets.bottom + 30,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <TouchableOpacity
          onPress={onBack}
          disabled={deletingId !== null}
        >
          <Text style={styles.backText}>
            ‹ Back to Home
          </Text>
        </TouchableOpacity>

        {/* Header */}
        <Text style={styles.title}>
          Saved Journal
        </Text>

        <Text style={styles.subtitle}>
          {entries.length}{' '}
          {entries.length === 1
            ? 'saved adventure'
            : 'saved adventures'}
        </Text>

        {/* Empty State */}
        {entries.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>
              📍
            </Text>

            <Text style={styles.emptyTitle}>
              No Entries Yet
            </Text>

            <Text style={styles.emptyText}>
              Create your first journal entry to see it here.
            </Text>
          </View>
        ) : (
          entries.map(entry => (
            <View
              key={entry.id}
              style={styles.journalCard}
            >
              {/* Journal Photo */}
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: entry.photoUri }}
                  style={[
                    styles.journalImage,
                    {
                      height: getPhotoHeight(entry.id),
                    },
                  ]}
                  resizeMode="contain"
                  onLoad={event => {
                    const source =
                      event.nativeEvent.source;

                    if (
                      source?.width &&
                      source?.height
                    ) {
                      handleImageLoad(
                        entry.id,
                        source.width,
                        source.height
                      );
                    }
                  }}
                  onError={event => {
                    console.warn(
                      'Journal photo error:',
                      event.nativeEvent.error
                    );
                  }}
                />
              </View>

              {/* Journal Details */}
              <View style={styles.cardContent}>
                {/* Date */}
                <Text style={styles.dateText}>
                  {formatDate(entry.timestamp)}
                </Text>

                {/* Note */}
                <Text style={styles.noteText}>
                  {entry.note?.trim()
                    ? entry.note
                    : 'No description provided'}
                </Text>

                {/* GPS Location */}
                <View style={styles.locationCard}>
                  <Text style={styles.locationTitle}>
                    📍 GPS Location
                  </Text>

                  <Text style={styles.locationText}>
                    Latitude: {entry.latitude.toFixed(6)}
                  </Text>

                  <Text style={styles.locationText}>
                    Longitude: {entry.longitude.toFixed(6)}
                  </Text>
                </View>

                {/* Edit Entry Button */}
                <TouchableOpacity
                  style={[
                    styles.editButton,
                    deletingId !== null &&
                      styles.disabledButton,
                  ]}
                  onPress={() => openEditor(entry)}
                  disabled={deletingId !== null}
                >
                  <Text style={styles.editButtonText}>
                    ✏️ Edit Entry
                  </Text>
                </TouchableOpacity>

                {/* Delete Entry Button */}
                <TouchableOpacity
                  style={[
                    styles.deleteButton,
                    deletingId !== null &&
                      styles.disabledButton,
                  ]}
                  onPress={() => confirmDelete(entry.id)}
                  disabled={deletingId !== null}
                >
                  {deletingId === entry.id ? (
                    <ActivityIndicator
                      size="small"
                      color="#FF8298"
                    />
                  ) : (
                    <Text style={styles.deleteButtonText}>
                      Delete Entry
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Edit Entry Modal */}
      <Modal
        visible={editingId !== null}
        transparent
        animationType="fade"
        onRequestClose={closeEditor}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={
            Platform.OS === 'ios'
              ? 'padding'
              : undefined
          }
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Edit Journal Entry
            </Text>

            <Text style={styles.modalSubtitle}>
              Update your journal note below.
            </Text>

            <TextInput
              style={styles.modalInput}
              multiline
              textAlignVertical="top"
              placeholder="What happened at this location?"
              placeholderTextColor="#888899"
              value={editedNote}
              onChangeText={setEditedNote}
              editable={!saving}
              autoFocus
            />

            {/* Save Changes */}
            <TouchableOpacity
              style={[
                styles.saveButton,
                saving && styles.disabledButton,
              ]}
              onPress={saveEditedNote}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator
                  color="#FFFFFF"
                />
              ) : (
                <Text style={styles.saveButtonText}>
                  Save Changes
                </Text>
              )}
            </TouchableOpacity>

            {/* Cancel */}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={closeEditor}
              disabled={saving}
            >
              <Text style={styles.cancelButtonText}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1020',
  },

  content: {
    paddingHorizontal: 16,
  },

  backText: {
    color: '#A78BFA',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 22,
    paddingVertical: 8,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },

  subtitle: {
    color: '#B5B4C8',
    fontSize: 14,
    marginTop: 8,
    marginBottom: 22,
  },

  journalCard: {
    backgroundColor: '#1A1A30',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#292A40',
    marginBottom: 20,
    overflow: 'hidden',
  },

  imageContainer: {
    width: '100%',
    backgroundColor: '#101021',
    alignItems: 'center',
    justifyContent: 'center',
  },

  journalImage: {
    width: '100%',
  },

  cardContent: {
    padding: 16,
  },

  dateText: {
    color: '#A78BFA',
    fontSize: 13,
    marginBottom: 10,
  },

  noteText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 23,
    marginBottom: 16,
  },

  locationCard: {
    backgroundColor: '#0F1020',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },

  locationTitle: {
    color: '#A78BFA',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  locationText: {
    color: '#B5B4C8',
    fontSize: 14,
    lineHeight: 23,
  },

  editButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },

  editButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },

  deleteButton: {
    backgroundColor: '#43202D',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },

  deleteButtonText: {
    color: '#FF8298',
    fontSize: 15,
    fontWeight: 'bold',
  },

  disabledButton: {
    opacity: 0.5,
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 110,
  },

  emptyIcon: {
    fontSize: 42,
    marginBottom: 15,
  },

  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  emptyText: {
    color: '#B5B4C8',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    padding: 20,
  },

  modalContent: {
    backgroundColor: '#1A1A30',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#292A40',
    padding: 20,
  },

  modalTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  modalSubtitle: {
    color: '#B5B4C8',
    fontSize: 14,
    marginBottom: 18,
  },

  modalInput: {
    backgroundColor: '#0F1020',
    borderWidth: 1,
    borderColor: '#292A40',
    borderRadius: 12,
    color: '#FFFFFF',
    padding: 14,
    fontSize: 15,
    minHeight: 130,
    marginBottom: 16,
  },

  saveButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
    marginBottom: 10,
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },

  cancelButton: {
    backgroundColor: '#292A40',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },

  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
