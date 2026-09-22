import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// Custom Component #1
function Education() {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Education</Text>

      <Text style={styles.text}>Point Park University</Text>
      <Text style={styles.text}>Major: Information Technology</Text>
      <Text style={styles.text}>Pittsburgh, Pennsylvania</Text>
    </View>
  );
}

// Custom Component #2
function TechnicalSkills() {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Technical Skills</Text>

      <Text style={styles.text}>JavaScript</Text>
      <Text style={styles.text}>HTML & CSS</Text>
      <Text style={styles.text}>Node.js</Text>
      <Text style={styles.text}>PostgreSQL</Text>
      <Text style={styles.text}>Git & GitHub</Text>
    </View>
  );
}

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>My Personal Profile</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>About Me</Text>

          <Text style={styles.name}>David Owusu</Text>

          <Text style={styles.text}>
            I am a student at Point Park University interested in
            technology and software development.
          </Text>
        </View>

        <Education />

        <TechnicalSkills />

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Career Goals</Text>

          <Text style={styles.text}>
            My goal is to build my technology skills and pursue a
            career where I can work with software and computer systems.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8eef5',
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 50,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },

  card: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 15,
    borderRadius: 12,
    borderWidth: 1,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  text: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default App;