// SignupScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';

export default function SignupScreen() {
  const [fontsLoaded] = useFonts({
    OCRA: require('../assets/fonts/OCRA.ttf'),
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();
  const auth = getAuth();

  if (!fontsLoaded) return null;

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSignup = async () => {
    if (!validateEmail(email)) {
      Alert.alert("Error", "Por favor ingrese un correo electrónico válido (ejemplo@dominio.com).");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "La contraseña debe tener mínimo 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Opcional: crea un registro inicial en Firestore para el usuario aquí
      router.push('/chatScreen');
    } catch (error: any) {
      console.error("Error al crear usuario:", error);
      if (error.code === "auth/email-already-in-use") {
        Alert.alert("Error", "El correo electrónico ya está en uso. Por favor, utiliza otro correo o inicia sesión.");
      } else {
        Alert.alert("Error", "No se pudo crear el usuario. Inténtalo de nuevo.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
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
      <TextInput 
        style={styles.input}
        placeholder="Confirm password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
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
    fontFamily: 'OCRA' },
});