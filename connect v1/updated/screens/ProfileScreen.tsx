import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

import HeadScreen from '../components/profile/Head';
import UserScreen from '../components/profile/User';
import ProfileStats from '../components/profile/Stats';
import PostMention from '../components/profile/PostMention';

const ProfileScreen = () => {
  const [selectedTab, setSelectedTab] = useState('Post');

  return (
    <LinearGradient
          colors={['#9CFBE5', '#F6FFFE']}
          style={styles.fullScreenGradient}
        >
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView style={styles.mainContent}>
        <HeadScreen />
        <UserScreen />
        <ProfileStats />


        <PostMention selectedTab={selectedTab} onSelectTab={setSelectedTab} />

      </ScrollView>

      <View style={styles.tabWrapper}>
      </View>
    </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  fullScreenGradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#f1f2f6',
  },
  mainContent: {
    padding: 10,
  },
  tabWrapper: {
    left: 0,
    right: 0,
  }  
});

export default ProfileScreen;
