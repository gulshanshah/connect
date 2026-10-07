import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from "../assets/config";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState({
    name: 'Loading...',
    username: '@loading',
    profileImage: `${BASE_URL}uploads/default.png`
  });

  const loadProfileData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        const profileImage = parsedUser.profileImage 
          ? parsedUser.profileImage.startsWith('http') 
            ? parsedUser.profileImage 
            : `${BASE_URL}${parsedUser.profileImage}`
          : `${BASE_URL}/uploads/default.png`;

        setUserData({
          name: parsedUser.name || 'No Name',
          username: parsedUser.username || '@username',
          profileImage
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load profile data');
      console.error('Profile load error:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadProfileData();
    }, [])
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <LinearGradient
        colors={['#F8F9FF', '#EFF1FF']}
        style={styles.backgroundGradient}
      >
        {}
        <View style={styles.profileHeader}>
          <LinearGradient
            colors={['#6D5DFB', '#C86DD7']}
            style={styles.profileImageBorder}
          >
            <Image
              source={{ uri: userData.profileImage }}
              style={styles.profileImage}
              onError={() => setUserData(prev => ({
                ...prev,
                profileImage: `${BASE_URL}/uploads/default.png`
              }))}
            />
          </LinearGradient>
          
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{userData.name}</Text>
            <Text style={styles.username}>{userData.username}</Text>
            
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate('ProfileSetup')}
            >
              <LinearGradient
                colors={['#6D5DFB', '#C86DD7']}
                style={styles.editButtonGradient}
              >
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFF',
  },
  backgroundGradient: {
    flex: 1,
    paddingBottom: 30,
  },
  profileHeader: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
    alignItems: 'center',
  },
  profileImageBorder: {
    borderRadius: 60,
    padding: 4,
  },
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: '#FFF',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2D2D2D',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: '#6B6B6B',
    marginBottom: 16,
  },
  editButton: {
    borderRadius: 20,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  editButtonGradient: {
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default ProfileScreen;
