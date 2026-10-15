
import React, { useEffect, useRef, useState } from 'react';

import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  StatusBar,
} from 'react-native';

import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';

// TypeScript interface for API records
interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

// External API endpoints
const API_URL =
  'https://jsonplaceholder.typicode.com/posts';

const ERROR_URL =
  'https://jsonplaceholder.typicode.com/invalid-endpoint';

export default function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emptyDemo, setEmptyDemo] = useState(false);

  
  const requestId = useRef(0);

  // Retrieve posts from JSONPlaceholder
  const fetchPosts = async (
    refresh = false,
    testError = false
  ) => {
    const currentRequest = ++requestId.current;

    if (refresh) {
      setRefreshing(true);
      setLoading(false);
    } else {
      setLoading(true);
      setRefreshing(false);
    }

    setError(null);
    setEmptyDemo(false);

    try {
      const response = await fetch(
        testError ? ERROR_URL : API_URL
      );

      if (!response.ok) {
        throw new Error(
          `Unable to load posts. HTTP ${response.status}`
        );
      }

      const data: Post[] = await response.json();

      if (!Array.isArray(data)) {
        throw new Error('Invalid API response');
      }

      if (currentRequest === requestId.current) {
        setPosts(data);
      }
    } catch (err) {
      if (currentRequest === requestId.current) {
        setError(
          err instanceof Error
            ? err.message
            : 'Something went wrong'
        );
      }
    } finally {
      if (currentRequest === requestId.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  };

  
  useEffect(() => {
    void fetchPosts();

    return () => {
      requestId.current++;
    };
  }, []);

  
  const testEmptyState = () => {
    requestId.current++;

    setPosts([]);
    setError(null);
    setLoading(false);
    setRefreshing(false);
    setEmptyDemo(true);
  };

  const busy = loading || refreshing;

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#090711"
      />

      <SafeAreaView
        style={styles.container}
        edges={['top', 'bottom']}
      >
        
        <Text style={styles.heading}>
          Game Posts Viewer
        </Text>

        <Text style={styles.subtitle}>
          Posts retrieved from an external API
        </Text>

        {/* First row of buttons */}
        <View style={styles.buttonRow}>
          <Pressable
            style={[
              styles.button,
              styles.refreshButton,
              busy && styles.disabledButton,
            ]}
            onPress={() => void fetchPosts(true)}
            disabled={busy}
          >
            <Text style={styles.buttonText}>
              Refresh Posts
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.button,
              styles.testButton,
              busy && styles.disabledButton,
            ]}
            onPress={() => void fetchPosts(false, true)}
            disabled={busy}
          >
            <Text style={styles.buttonText}>
              Test Error
            </Text>
          </Pressable>
        </View>

        {/* Centered third button */}
        <View style={styles.emptyButtonContainer}>
          <Pressable
            style={[
              styles.button,
              styles.emptyButton,
              busy && styles.disabledButton,
            ]}
            onPress={testEmptyState}
            disabled={busy}
          >
            <Text style={styles.buttonText}>
              Test Empty State
            </Text>
          </Pressable>
        </View>

        {/* Loading state */}
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator
              size="large"
              color="#A78BFA"
            />

            <Text style={styles.statusText}>
              Loading posts...
            </Text>
          </View>

        ) : error ? (

          /* Error state */
          <View style={styles.center}>
            <Text style={styles.errorTitle}>
              Something went wrong
            </Text>

            <Text style={styles.error}>
              {error}
            </Text>

            <Pressable
              style={[
                styles.button,
                styles.retryButton,
              ]}
              onPress={() => void fetchPosts()}
              disabled={busy}
            >
              <Text style={styles.buttonText}>
                Retry
              </Text>
            </Pressable>
          </View>

        ) : (


          <>
            <Text style={styles.counter}>
              Posts Loaded: {posts.length}
            </Text>

            <FlatList
              style={styles.list}
              data={posts}
              keyExtractor={(item) =>
                item.id.toString()
              }
              refreshing={refreshing}
              onRefresh={() => void fetchPosts(true)}
              contentContainerStyle={
                posts.length === 0
                  ? styles.emptyList
                  : styles.listContent
              }
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyTitle}>
                    No posts available.
                  </Text>

                  <Text style={styles.emptyDescription}>
                    {emptyDemo
                      ? 'This is a simulated empty state. Press Refresh Posts to reload the data.'
                      : 'The API returned no posts. Press Refresh Posts to try again.'}
                  </Text>
                </View>
              }
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <Text style={styles.title}>
                    {item.title}
                  </Text>

                  <Text style={styles.meta}>
                    Post ID: {item.id} | User ID: {item.userId}
                  </Text>

                  <Text style={styles.body}>
                    {item.body}
                  </Text>
                </View>
              )}
            />
          </>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090711',
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  heading: {
    fontSize: 29,
    fontWeight: 'bold',
    color: '#F5F3FF',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    color: '#A8A1BB',
    marginBottom: 20,
  },

  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },

  button: {
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },

  refreshButton: {
    backgroundColor: '#6D28D9',
    flex: 1,
  },

  testButton: {
    backgroundColor: '#3B1B62',
    borderWidth: 1,
    borderColor: '#7043A0',
    flex: 1,
  },

  emptyButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  emptyButton: {
    backgroundColor: '#8B5CF6',
    width: 190,
  },

  disabledButton: {
    opacity: 0.6,
  },

  retryButton: {
    backgroundColor: '#6D28D9',
    minWidth: 150,
    marginTop: 10,
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },

  counter: {
    color: '#C4B5FD',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 14,
  },

  list: {
    flex: 1,
  },

  listContent: {
    paddingBottom: 20,
  },

  card: {
    backgroundColor: '#1A1428',
    padding: 18,
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#352449',
  },

  title: {
    color: '#C4B5FD',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textTransform: 'capitalize',
  },

  meta: {
    color: '#9B90AD',
    fontSize: 12,
    marginBottom: 10,
  },

  body: {
    color: '#E5DFF0',
    fontSize: 14,
    lineHeight: 21,
  },

  center: {
    alignItems: 'center',
    marginTop: 50,
    paddingHorizontal: 15,
  },

  statusText: {
    color: '#A8A1BB',
    fontSize: 15,
    marginTop: 15,
  },

  errorTitle: {
    color: '#F0ABFC',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },

  error: {
    color: '#F5D0FE',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 18,
  },

  emptyList: {
    flexGrow: 1,
  },

  emptyContainer: {
    alignItems: 'center',
    marginTop: 65,
    paddingHorizontal: 20,
  },

  emptyTitle: {
    color: '#E9D5FF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  emptyDescription: {
    color: '#A8A1BB',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
});
