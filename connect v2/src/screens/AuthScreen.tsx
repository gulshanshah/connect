import React, { useState } from 'react';
import { 
  SafeAreaView, 
  KeyboardAvoidingView, 
  ScrollView, 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  Platform, 
  TouchableOpacity 
} from 'react-native';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

import logo from '../assets/logo.png';

const AuthScreen = () => {
  const [screen, setScreen] = useState('welcome');

  return (
    <SafeAreaView style={styles.safeContainer}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.logoContainer}>
            <Image 
              source={logo}
              style={styles.logo} 
              resizeMode="contain"
            />
            <Text style={styles.appTitle}>Connecto</Text>
          </View>

          {screen === 'welcome' ? (
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome to Connecto</Text>
              <TouchableOpacity 
                style={[styles.button, { backgroundColor: '#007aff' }]} 
                onPress={() => setScreen('login')}
              >
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, { backgroundColor: '#28a745' }]} 
                onPress={() => setScreen('register')}
              >
                <Text style={styles.buttonText}>Register</Text>
              </TouchableOpacity>
            </View>
          ) : screen === 'login' ? (
            <LoginForm switchToRegister={() => setScreen('register')} />
          ) : (
            <RegisterForm switchToLogin={() => setScreen('login')} />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#f0f4f7',
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 20,
  },
  appTitle: {
    marginTop: 10,
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007aff',
  },
  welcomeContainer: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  button: {
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AuthScreen;
