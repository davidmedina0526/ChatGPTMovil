// index.tsx
import React, { useState } from 'react';
import { Image, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import { Link } from 'expo-router';

export default function WelcomeScreen() {
  const [fontsLoaded] = useFonts({
    'OCRA': require('../assets/fonts/OCRA.ttf'),
  });
  const [step, setStep] = useState(0);

  if (!fontsLoaded) {
    return null;
  }

  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const handlePrevious = () => {
    setStep(prev => prev - 1);
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/ChatGPT_logo.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>Welcome to ChatGPT</Text>
      <Text style={styles.subtitle}>Ask anything, get your answer</Text>
      {step === 0 && (
        <>
          <Image
            source={require('../assets/images/Vector1.png')}
            style={styles.vector}
          />
          <Text style={styles.examplesTitle}>Examples</Text>
          <View style={styles.examplesContainer}>
            <Text style={styles.example}>"Explain quantum computing in simple terms"</Text>
            <Text style={styles.example}>"Got any creative ideas for a 10-year-old's birthday?"</Text>
            <Text style={styles.example}>"How do I make an HTTP request in Javascript?"</Text>
          </View>
          <TouchableOpacity style={styles.buttons} onPress={handleNext}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </>
      )}
      {step === 1 && (
        <>
          <Image 
            source={require('../assets/images/Vector2.png')}
            style={styles.vector}
          />
          <Text style={styles.examplesTitle}>Capabilities</Text>
          <View style={styles.examplesContainer}>
            <Text style={styles.example}>Remembers what user said earlier in the conversation</Text>
            <Text style={styles.example}>Allows user to provide follow-up corrections</Text>
            <Text style={styles.example}>Trained to decline inappropiate requests</Text>
          </View>
          <View style={styles.buttonsRow}>
            <TouchableOpacity style={styles.buttons} onPress={handlePrevious}>
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttons} onPress={handleNext}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      {step === 2 && (
        <>
          <Image 
            source={require('../assets/images/Vector3.png')}
            style={styles.vector}
          />
          <Text style={styles.examplesTitle}>Limitations</Text>
          <View style={styles.examplesContainer}>
            <Text style={styles.example}>May occasionally generate incorrect information</Text>
            <Text style={styles.example}>May ocassionally produce harmful instructions or biased content</Text>
            <Text style={styles.example}>Limited knowledge of world and events after 2021</Text>
          </View>
          <View style={styles.buttonsRow}>
            <TouchableOpacity style={styles.buttons} onPress={handlePrevious}>
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
            {/* Al presionar "Let's Chat" se redirige a la pantalla de Login */}
            <Link href='../loginScreen' style={styles.buttons}>
              <Text style={styles.buttonText}>Let's Chat ➜</Text>
            </Link>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3A3D4A',
  },
  logo: {
    width: 30,
    height: 30,
    marginBottom: 30,
    aspectRatio: 2,
    resizeMode: 'contain',
  },
  vector: {
    width: 27,
    height: 25,
    aspectRatio: 2,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    fontFamily: 'OCRA',
  },
  subtitle: {
    color: '#FFFFFF',
    fontSize: 15,
    marginBottom: 50,
    fontFamily: 'OCRA',
  },
  examplesTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    fontFamily: 'OCRA',
  },
  examplesContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 50,
  },
  example: {
    backgroundColor: '#6D6D6D',
    color: '#FFFFFF',
    padding: 10,
    width: '90%',
    textAlign: 'center',
    borderRadius: 7,
    marginVertical: 5,
    fontFamily: 'OCRA',
  },
  buttonsRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  buttons: {
    backgroundColor: '#0FA958',
    paddingVertical: 15,
    paddingHorizontal: 35,
    borderRadius: 10,
    marginHorizontal: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'OCRA',
  },
});