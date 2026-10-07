import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { BASE_URL } from "../assets/config";

const RegisterForm = ({ switchToLogin }) => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!emailOrPhone || !username || !password) {
      Alert.alert('Error', 'All fields are required!');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`${BASE_URL}api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailOrPhone, username, password }),
      });

      const data = await response.json();
      
      if (response.ok) {
        Alert.alert(
          'Success',
          'Registration successful!',
          [
            { text: 'OK', onPress: () => switchToLogin() }
          ]
        );
      } else {
        Alert.alert('Error', data.message || 'Registration failed!');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.registerBox}>
      <Text style={styles.title}>Register</Text>

      <TextInput 
        style={styles.input} 
        placeholder="Email or Phone" 
        placeholderTextColor="#888" 
        value={emailOrPhone} 
        onChangeText={setEmailOrPhone} 
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput 
        style={styles.input} 
        placeholder="Username" 
        placeholderTextColor="#888" 
        value={username} 
        onChangeText={setUsername} 
        autoCapitalize="none"
      />
      <TextInput 
        style={styles.input} 
        placeholder="Password" 
        placeholderTextColor="#888" 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry
      />

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.registerButtonText}>Register</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={switchToLogin}>
        <Text style={styles.optionText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  registerBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    alignSelf: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    color: '#333',
  },
  registerButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  optionText: {
    color: '#007aff',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default RegisterForm;
