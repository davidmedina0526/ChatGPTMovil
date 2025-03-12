// LoginScreen.tsx
import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { AuthContext } from '../context/authContext/AuthContext';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [fontsLoaded] = useFonts({
    OCRA: require('../assets/fonts/OCRA.ttf'),
  });

  if (!fontsLoaded) return null;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  
  const { signIn } = useContext(AuthContext);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      Alert.alert("Error", "Por favor ingrese un correo electrónico válido (ejemplo@dominio.com).");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "La contraseña debe tener mínimo 6 caracteres.");
      return;
    }
    try {
      await signIn(email, password);
      router.push('/chatScreen');
    } catch (error: any) {
      console.error("Error al iniciar sesión:", error);
      Alert.alert("Error", "Usuario o contraseña incorrectos.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log in to ChatGPT</Text>
      <TextInput 
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput 
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log in</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/signupScreen')}>
        <Text style={styles.linkText}>New to ChatGPT? Register now</Text>
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
    color: '#FFFFFF',
    fontFamily: 'OCRA',
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
});