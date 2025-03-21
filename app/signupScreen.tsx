import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';

export default function SignupScreen() {
  const [fontsLoaded] = useFonts({
    OCRA: require('../assets/fonts/OCRA.ttf'),
  });

  if (!fontsLoaded) return null;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const auth = getAuth();

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSignup = async () => {
    setErrorMessage('');
    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address (example@domain.com).");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/chatScreen');
    } catch (error: any) {
      console.error("Error creating user:", error);
      if (error.code === "auth/email-already-in-use") {
        setErrorMessage("Email address already in use. Please try using a different email or log in.");
      } else {
        setErrorMessage("User could not be created. Please try again later.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      {errorMessage !== '' && <Text style={styles.errorText}>{errorMessage}</Text>}
      <TextInput 
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#AAA"
        value={email}
        onChangeText={text => { setEmail(text); setErrorMessage(''); }}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput 
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#AAA"
        value={password}
        onChangeText={text => { setPassword(text); setErrorMessage(''); }}
        secureTextEntry
      />
      <TextInput 
        style={styles.input}
        placeholder="Confirm password"
        placeholderTextColor="#AAA"
        value={confirmPassword}
        onChangeText={text => { setConfirmPassword(text); setErrorMessage(''); }}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/loginScreen')}>
        <Text style={styles.linkText}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#3A3D4A' 
  },
  title: { 
    color: '#FFFFFF',
    fontSize: 24, 
    fontWeight: 'bold',
    marginBottom: '5%', 
    fontFamily: 'OCRA' 
  },
  input: { 
    fontFamily: 'OCRA', 
    color: '#FFFFFF',
    width: '80%', 
    height: 50, 
    borderColor: '#CCC', 
    borderWidth: 1, 
    marginBottom: 15, 
    padding: 10, 
    borderRadius: 5 
  },
  button: { 
    backgroundColor: '#0FA958', 
    padding: 15, 
    borderRadius: 5, 
    width: '80%', 
    alignItems: 'center', 
    marginTop: '2%',
    marginBottom: '3%' 
  },
  buttonText: { 
    color: '#FFF', 
    fontSize: 16, 
    fontWeight: 'bold',
    fontFamily: 'OCRA' 
  },
  linkText: { 
    color: '#0FA958', 
    fontSize: 14, 
    fontFamily: 'OCRA' 
  },
  errorText: {
    color: 'red',
    marginBottom: '1%',
    fontFamily: 'OCRA',
    textAlign: 'center'
  },
});