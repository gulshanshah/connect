import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView,
  Dimensions,
  SafeAreaView,
  Animated,
  Platform
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { BASE_URL } from "../assets/config";

const { width } = Dimensions.get('window');

const colors = {
  primary: '#1E90FF',
  secondary: '#32CD32',
  background: '#FFFFFF',
  text: '#333333',
  muted: '#888888',
  border: '#E0E0E0',
};

const UserProfileScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  const user = route.params?.user || {
    name: 'Unknown User',
    username: 'unknown',
    bio: '...',
    profileImage: 'https://picsum.photos/seed/userprofile/150',
    coverPhoto: 'https://picsum.photos/seed/cover/600/200',
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.header}>
        <Icon 
          name="chevron-back" 
          size={24} 
          color={colors.primary} 
          onPress={() => navigation.goBack()} 
          style={styles.headerButton}
        />
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.coverContainer}>
          <Image 
            source={{ uri: user.coverPhoto }} 
            style={styles.coverPhoto}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.3)', 'transparent']}
            style={styles.coverGradient}
          />
        </View>

        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image 
              source={{ uri: BASE_URL + user.profileImage }} 
              style={styles.profileImage}
              resizeMode="cover"
            />
          </View>

          <Text style={styles.fullName}>{user.name}</Text>
          <Text style={styles.username}>@{user.username}</Text>
          <Text style={styles.bio}>{user.bio}</Text>

          <View style={styles.actionButtons}>
            <View 
              style={[styles.button, styles.messageButton]}
              onTouchEnd={async () => {
                try {
                  const userData = await AsyncStorage.getItem('user');
                  const user_ = userData ? JSON.parse(userData) : null;
                  const params = {
                    currentUserId: user_?.id,
                    otherUser: user,
                  };
                  navigation.navigate('ChattingScreen', params);
                } catch (error) {
                  console.error("Error retrieving user data:", error);
                }
              }}
            >
              <Icon name="chatbox" size={18} color={colors.background} />
              <Text style={styles.buttonText}>Message</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: colors.background,
    ...Platform.select({
      ios: {
        shadowColor: colors.border,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      },
    }),
  },
  headerButton: {
    width: 40,
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
  },
  container: {
    flex: 1,
  },
  coverContainer: {
    height: 200,
    position: 'relative',
  },
  coverPhoto: {
    ...StyleSheet.absoluteFillObject,
  },
  coverGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: -50,
  },
  profileImageContainer: {
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: colors.background,
  },
  fullName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
  },
  username: {
    fontSize: 16,
    color: colors.muted,
    marginVertical: 4,
  },
  bio: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
    textAlign: 'center',
    marginVertical: 16,
    paddingHorizontal: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginVertical: 16,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 150,
    ...Platform.select({
      ios: {
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  messageButton: {
    backgroundColor: colors.secondary,
  },
  buttonText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default UserProfileScreen;
