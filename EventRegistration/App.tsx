import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  View,
} from 'react-native';

// Props that will be passed into the EventInfo component
type EventInfoProps = {
  eventName: string;
  date: string;
  location: string;
};

// Functional component that uses props
function EventInfo({eventName, date, location}: EventInfoProps) {
  return (
    <View style={styles.eventCard}>
      <Text style={styles.eventName}>{eventName}</Text>
      <Text style={styles.eventText}>Date: {date}</Text>
      <Text style={styles.eventText}>Location: {location}</Text>
    </View>
  );
}

// Main functional component
function App(): React.JSX.Element {
  // State for the user's name
  const [name, setName] = useState('');

  // State for the user's email
  const [email, setEmail] = useState('');

  // State used to show the registration confirmation
  const [registered, setRegistered] = useState(false);

  // Registers the user for the event
  const handleRegister = () => {
    setRegistered(true);
  };

  // Clears the form so the user can start over
  const handleClear = () => {
    setName('');
    setEmail('');
    setRegistered(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Event Registration</Text>

        {/* Custom component receiving information through props */}
        <EventInfo
          eventName="Pittsburgh Tech Meetup"
          date="October 15, 2026"
          location="Pittsburgh, Pennsylvania"
        />

        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Register for the Event</Text>

          <Text style={styles.label}>Name</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Email</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Button used to register */}
          <Pressable style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </Pressable>

          {/* Second button clears the registration form */}
          <Pressable style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.clearButtonText}>Clear Form</Text>
          </Pressable>
        </View>

        {/* This section only appears after Register is pressed */}
        {registered && (
          <View style={styles.successBox}>
            <Text style={styles.successTitle}>
              Registration Successful!
            </Text>

            <Text style={styles.successText}>
              Thank you, {name}!
            </Text>

            <Text style={styles.successText}>
              You are registered for the Pittsburgh Tech Meetup.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Styles for the application
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8eef5',
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 30,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },

  eventCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },

  eventName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  eventText: {
    fontSize: 16,
    marginBottom: 5,
  },

  form: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },

  registerButton: {
    backgroundColor: '#1d4f91',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5,
  },

  buttonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
  },

  clearButton: {
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: 10,
  },

  clearButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
  },

  successBox: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 20,
  },

  successTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  successText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default App;