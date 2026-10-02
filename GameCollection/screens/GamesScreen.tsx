import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';

const games = [
  {
    title: 'Destiny 2',
    genre: 'Action / First-Person Shooter',
    developer: 'Bungie',
    icon: '🚀',
    color: '#38BDF8',
    description:
      'A sci-fi action game where you become a Guardian and protect humanity from powerful enemies across the solar system. Explore different worlds, collect powerful gear, complete missions, and fight alongside other Guardians.',
  },
  {
    title: 'The Outlast Trials',
    genre: 'Survival Horror',
    developer: 'Red Barrels',
    icon: '👁️',
    color: '#EF4444',
    description:
      'A survival horror game where players are trapped inside terrifying experiments run by the Murkoff Corporation. Complete dangerous trials alone or with other players while trying to survive and escape.',
  },
  {
    title: 'My Friend Peppa Pig',
    genre: 'Adventure',
    developer: 'Petoons Studio',
    icon: '🐷',
    color: '#F472B6',
    description:
      'A family-friendly adventure where you create your own character and explore the world of Peppa Pig. Meet familiar characters, visit locations from the show, and take part in different activities and adventures.',
  },
  {
    title: 'Risk of Rain 2',
    genre: 'Roguelike / Third-Person Shooter',
    developer: 'Hopoo Games',
    icon: '🌧️',
    color: '#F59E0B',
    description:
      'A fast-paced roguelike shooter where players battle increasingly difficult enemies on an alien planet. Collect powerful items, unlock survivors, defeat bosses, and create different combinations of abilities during each run.',
  },
  {
    title: 'Clair Obscur: Expedition 33',
    genre: 'Turn-Based RPG',
    developer: 'Sandfall Interactive',
    icon: '🎨',
    color: '#A78BFA',
    description:
      'A story-driven role-playing game set in a fantasy world inspired by Belle Époque France. Expedition 33 sets out on a desperate mission to defeat the mysterious Paintress and break her deadly cycle.',
  },
];

function GamesScreen({ navigation }: any) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>Choose a Game</Text>

      <Text style={styles.subtitle}>
        Tap a game below to view more information.
      </Text>

      {games.map((game, index) => (
        <View
          style={[
            styles.card,
            { borderLeftColor: game.color },
          ]}
          key={index}
        >
          <View style={styles.gameHeader}>
            <Text style={styles.icon}>
              {game.icon}
            </Text>

            <View style={styles.gameInformation}>
              <Text style={styles.gameTitle}>
                {game.title}
              </Text>

              <Text
                style={[
                  styles.genre,
                  { color: game.color },
                ]}
              >
                {game.genre}
              </Text>
            </View>
          </View>

          <Text style={styles.developer}>
            Developer: {game.developer}
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: game.color },
              pressed && styles.buttonPressed,
            ]}
            onPress={() =>
              navigation.navigate('Details', {
                title: game.title,
                genre: game.genre,
                developer: game.developer,
                description: game.description,
              })
            }
          >
            <Text style={styles.buttonText}>
              View Details →
            </Text>
          </Pressable>
        </View>
      ))}
    </ScrollView>
  );
}

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
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  subtitle: {
    color: '#999AAD',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 7,
    marginBottom: 25,
  },

  card: {
    backgroundColor: '#17182B',
    padding: 18,
    borderRadius: 14,
    marginBottom: 16,
    borderLeftWidth: 5,
  },

  gameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  icon: {
    fontSize: 35,
    marginRight: 15,
  },

  gameInformation: {
    flex: 1,
  },

  gameTitle: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: 'bold',
  },

  genre: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 3,
  },

  developer: {
    color: '#B8B9C9',
    fontSize: 15,
    marginTop: 15,
    marginBottom: 15,
  },

  button: {
    padding: 12,
    borderRadius: 8,
  },

  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },

  buttonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
});

export default GamesScreen;