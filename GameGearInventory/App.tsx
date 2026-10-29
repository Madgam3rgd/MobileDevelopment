
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Category =
  | 'Console'
  | 'Controller'
  | 'Headset'
  | 'Accessory'
  | 'Other';

type Condition = 'Working' | 'Needs Repair' | 'Broken';

type InventoryItem = {
  id: string;
  name: string;
  category: Category;
  brand: string;
  condition: Condition;
  location: string;
  price: number;
  notes: string;
};

type Screen = 'home' | 'form';

const STORAGE_KEY = '@game_gear_inventory';

const categories: Category[] = [
  'Console',
  'Controller',
  'Headset',
  'Accessory',
  'Other',
];

const conditions: Condition[] = [
  'Working',
  'Needs Repair',
  'Broken',
];

const colors = {
  background: '#0F1020',
  card: '#1B1B30',
  input: '#292940',
  purple: '#8B5CF6',
  lightPurple: '#BBA5FF',
  white: '#FFFFFF',
  muted: '#AAA9C0',
  border: '#363650',
  red: '#F87171',
  green: '#4ADE80',
};

const emptyForm = () => ({
  name: '',
  category: 'Console' as Category,
  brand: '',
  condition: 'Working' as Condition,
  location: '',
  price: '',
  notes: '',
});

export default function App() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [screen, setScreen] = useState<Screen>('home');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState('All');
  const [form, setForm] = useState(emptyForm());

  useEffect(() => {
    const loadInventory = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);

        if (saved) {
          setItems(JSON.parse(saved));
        }
      } catch (error) {
        Alert.alert('Error', 'Could not load your inventory.');
      } finally {
        setLoaded(true);
      }
    };

    loadInventory();
  }, []);

  useEffect(() => {
    if (!loaded) return;

    const saveInventory = async () => {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(items)
        );
      } catch (error) {
        Alert.alert('Error', 'Could not save your inventory.');
      }
    };

    saveInventory();
  }, [items, loaded]);

  const updateForm = (
    field: keyof ReturnType<typeof emptyForm>,
    value: string
  ) => {
    setForm(previous => ({
      ...previous,
      [field]: value,
    }));
  };

  const openAdd = () => {
    setForm(emptyForm());
    setEditingId(null);
    setScreen('form');
  };

  const openEdit = (item: InventoryItem) => {
    setEditingId(item.id);

    setForm({
      name: item.name,
      category: item.category,
      brand: item.brand,
      condition: item.condition,
      location: item.location,
      price: item.price.toString(),
      notes: item.notes,
    });

    setScreen('form');
  };

  const saveItem = () => {
    if (!form.name.trim()) {
      Alert.alert('Missing Name', 'Please enter an equipment name.');
      return;
    }

    if (!form.brand.trim()) {
      Alert.alert('Missing Brand', 'Please enter a brand.');
      return;
    }

    if (!form.location.trim()) {
      Alert.alert('Missing Location', 'Please enter a location.');
      return;
    }

    const price =
      form.price.trim() === '' ? 0 : Number(form.price);

    if (!Number.isFinite(price) || price < 0) {
      Alert.alert(
        'Invalid Price',
        'Enter a valid price of zero or more.'
      );
      return;
    }

    const item: InventoryItem = {
      id: editingId || `${Date.now()}-${Math.random()}`,
      name: form.name.trim(),
      category: form.category,
      brand: form.brand.trim(),
      condition: form.condition,
      location: form.location.trim(),
      price,
      notes: form.notes.trim(),
    };

    if (editingId) {
      setItems(previous =>
        previous.map(existing =>
          existing.id === editingId ? item : existing
        )
      );
    } else {
      setItems(previous => [...previous, item]);
    }

    setScreen('home');
    setEditingId(null);
    setForm(emptyForm());
  };

  // Delete an item after confirmation.
  const deleteItem = (id: string) => {
    Alert.alert(
      'Delete Equipment',
      'Are you sure you want to remove this item?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setItems(previous =>
              previous.filter(item => item.id !== id)
            );

            setScreen('home');
            setEditingId(null);
          },
        },
      ]
    );
  };

  const filteredItems = items.filter(
    item => filter === 'All' || item.category === filter
  );

  const getEmoji = (category: Category) => {
    switch (category) {
      case 'Console':
        return '🎮';
      case 'Controller':
        return '🕹️';
      case 'Headset':
        return '🎧';
      case 'Accessory':
        return '⌨️';
      default:
        return '📦';
    }
  };

  const renderField = (
    label: string,
    field: 'name' | 'brand' | 'location' | 'price' | 'notes',
    placeholder: string,
    multiline = false
  ) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        style={[
          styles.input,
          multiline && styles.notesInput,
        ]}
        value={form[field]}
        onChangeText={value => updateForm(field, value)}
        placeholder={placeholder}
        placeholderTextColor="#77778F"
        keyboardType={
          field === 'price' ? 'decimal-pad' : 'default'
        }
        multiline={multiline}
      />
    </View>
  );

  const renderChoices = (
    label: string,
    choices: readonly string[],
    selected: string,
    onSelect: (value: string) => void
  ) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.choiceContainer}>
        {choices.map(choice => (
          <TouchableOpacity
            key={choice}
            style={[
              styles.choice,
              selected === choice && styles.selectedChoice,
            ]}
            onPress={() => onSelect(choice)}
          >
            <Text
              style={[
                styles.choiceText,
                selected === choice &&
                  styles.selectedChoiceText,
              ]}
            >
              {choice}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          🎮 Game Gear
        </Text>

        <Text style={styles.subtitle}>
          My Gaming Inventory
        </Text>
      </View>

      {screen === 'home' ? (
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>
                TOTAL ITEMS
              </Text>

              <Text style={styles.statNumber}>
                {items.length}
              </Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statLabel}>
                CATEGORIES
              </Text>

              <Text style={styles.statNumber}>
                {
                  new Set(
                    items.map(item => item.category)
                  ).size
                }
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>
            My Equipment
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
          >
            {['All', ...categories].map(category => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.filterButton,
                  filter === category &&
                    styles.activeFilter,
                ]}
                onPress={() => setFilter(category)}
              >
                <Text
                  style={[
                    styles.filterText,
                    filter === category &&
                      styles.activeFilterText,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {!loaded ? (
            <Text style={styles.emptyText}>
              Loading inventory...
            </Text>
          ) : filteredItems.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyIcon}>
                📦
              </Text>

              <Text style={styles.emptyTitle}>
                No equipment found
              </Text>

              <Text style={styles.emptyText}>
                {filter === 'All'
                  ? 'Add your first gaming item to get started.'
                  : 'There are no items in this category.'}
              </Text>
            </View>
          ) : (
            filteredItems.map(item => (
              <View
                key={item.id}
                style={styles.itemCard}
              >
                <View style={styles.itemTop}>
                  <Text style={styles.itemEmoji}>
                    {getEmoji(item.category)}
                  </Text>

                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>
                      {item.name}
                    </Text>

                    <Text style={styles.itemSubtitle}>
                      {item.brand} • {item.category}
                    </Text>
                  </View>
                </View>

                <View style={styles.itemDetails}>
                  <Text style={styles.detailText}>
                    📍 {item.location}
                  </Text>

                  <Text style={styles.detailText}>
                    💲 ${item.price.toFixed(2)}
                  </Text>

                  <Text
                    style={[
                      styles.conditionText,
                      {
                        color:
                          item.condition === 'Working'
                            ? colors.green
                            : colors.red,
                      },
                    ]}
                  >
                    ● {item.condition}
                  </Text>
                </View>

                {item.notes ? (
                  <Text style={styles.itemNotes}>
                    {item.notes}
                  </Text>
                ) : null}

                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => openEdit(item)}
                  >
                    <Text style={styles.buttonText}>
                      Edit
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteItem(item.id)}
                  >
                    <Text style={styles.deleteText}>
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}

          <TouchableOpacity
            style={styles.addButton}
            onPress={openAdd}
          >
            <Text style={styles.addButtonText}>
              + Add Equipment
            </Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={
            Platform.OS === 'ios'
              ? 'padding'
              : undefined
          }
        >
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            <TouchableOpacity
              onPress={() => setScreen('home')}
            >
              <Text style={styles.backText}>
                ← Back to Inventory
              </Text>
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>
              {editingId
                ? 'Edit Equipment'
                : 'Add Equipment'}
            </Text>

            {renderField(
              'Equipment Name *',
              'name',
              'e.g. Xbox Series X'
            )}

            {renderChoices(
              'Category',
              categories,
              form.category,
              value => updateForm('category', value)
            )}

            {renderField(
              'Brand *',
              'brand',
              'e.g. Microsoft'
            )}

            {renderChoices(
              'Condition',
              conditions,
              form.condition,
              value => updateForm('condition', value)
            )}

            {renderField(
              'Location *',
              'location',
              'e.g. Bedroom'
            )}

            {renderField(
              'Purchase Price ($)',
              'price',
              'e.g. 499.99'
            )}

            {renderField(
              'Notes',
              'notes',
              'Additional details...',
              true
            )}

            <TouchableOpacity
              style={styles.addButton}
              onPress={saveItem}
            >
              <Text style={styles.addButtonText}>
                {editingId
                  ? 'Save Changes'
                  : 'Add to Inventory'}
              </Text>
            </TouchableOpacity>

            {editingId && (
              <TouchableOpacity
                style={styles.formDeleteButton}
                onPress={() => deleteItem(editingId)}
              >
                <Text style={styles.deleteText}>
                  Delete Equipment
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? 35 : 50,
  },

  header: {
    paddingHorizontal: 22,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  headerTitle: {
    fontSize: 27,
    fontWeight: 'bold',
    color: colors.white,
  },

  subtitle: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 4,
  },

  content: {
    padding: 20,
    paddingBottom: 50,
  },

  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 25,
  },

  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },

  statLabel: {
    color: colors.lightPurple,
    fontSize: 11,
    fontWeight: 'bold',
  },

  statNumber: {
    color: colors.white,
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 8,
  },

  sectionTitle: {
    color: colors.white,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 18,
  },

  filterScroll: {
    marginBottom: 18,
  },

  filterButton: {
    backgroundColor: colors.card,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },

  activeFilter: {
    backgroundColor: colors.purple,
    borderColor: colors.purple,
  },

  filterText: {
    color: colors.muted,
    fontSize: 13,
  },

  activeFilterText: {
    color: colors.white,
    fontWeight: 'bold',
  },

  emptyCard: {
    backgroundColor: colors.card,
    borderRadius: 15,
    padding: 35,
    alignItems: 'center',
    marginBottom: 20,
  },

  emptyIcon: {
    fontSize: 42,
    marginBottom: 12,
  },

  emptyTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },

  emptyText: {
    color: colors.muted,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
  },

  itemCard: {
    backgroundColor: colors.card,
    borderRadius: 15,
    padding: 17,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },

  itemTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },

  itemEmoji: {
    fontSize: 30,
    marginRight: 14,
  },

  itemInfo: {
    flex: 1,
  },

  itemName: {
    color: colors.white,
    fontSize: 17,
    fontWeight: 'bold',
  },

  itemSubtitle: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 4,
  },

  itemDetails: {
    gap: 7,
    marginBottom: 12,
  },

  detailText: {
    color: colors.muted,
    fontSize: 13,
  },

  conditionText: {
    fontSize: 13,
    fontWeight: 'bold',
  },

  itemNotes: {
    color: colors.muted,
    fontStyle: 'italic',
    marginBottom: 12,
  },

  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },

  editButton: {
    flex: 1,
    backgroundColor: colors.purple,
    padding: 11,
    borderRadius: 9,
    alignItems: 'center',
  },

  deleteButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.red,
    padding: 11,
    borderRadius: 9,
    alignItems: 'center',
  },

  buttonText: {
    color: colors.white,
    fontWeight: 'bold',
  },

  deleteText: {
    color: colors.red,
    fontWeight: 'bold',
  },

  addButton: {
    backgroundColor: colors.purple,
    padding: 17,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 14,
  },

  addButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },

  backText: {
    color: colors.lightPurple,
    fontSize: 15,
    marginBottom: 25,
  },

  field: {
    marginBottom: 22,
  },

  label: {
    color: colors.white,
    fontWeight: 'bold',
    marginBottom: 9,
    fontSize: 14,
  },

  input: {
    backgroundColor: colors.input,
    color: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    fontSize: 15,
  },

  notesInput: {
    minHeight: 95,
    textAlignVertical: 'top',
  },

  choiceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
  },

  choice: {
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 9,
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
  },

  selectedChoice: {
    backgroundColor: colors.purple,
    borderColor: colors.purple,
  },

  choiceText: {
    color: colors.muted,
    fontSize: 13,
  },

  selectedChoiceText: {
    color: colors.white,
    fontWeight: 'bold',
  },

  formDeleteButton: {
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
});
