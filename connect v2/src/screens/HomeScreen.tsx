import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, SafeAreaView, Text, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

import StoryItem from '../components/StoryItem';
import PostsItem from '../components/PostsItem';

const App = () => {
  const [username, setUsername] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUsername(parsedUser.username || 'User');
        }
        
        const token = await AsyncStorage.getItem('accessToken');
        
        if (!token) {
          setTimeout(() => navigation.replace('Auth'), 0);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
      <Text style={styles.welcomeText}>  Welcome, {username}!</Text>
        <Text style={styles.text}>Stories</Text>
        <StoryItem />
        <Text style={styles.welcomeText}>  Recent Posts!!</Text>
        <PostsItem />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    paddingLeft: 20,
    paddingTop: 10,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: -5,
    marginTop: 5,
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default App;
