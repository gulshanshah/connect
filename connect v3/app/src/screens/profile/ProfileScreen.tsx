import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../constants/ThemeContext';

import HeadScreen from './components/Head';
import UserScreen from './components/User';
import ProfileStats from './components/Stats';
import PostMention from './components/PostMention';

const ProfileScreen = () => {
  const [selectedTab, setSelectedTab] = useState('Post');
  const theme = useTheme();

  return (
    <LinearGradient
          colors={['#9CFBE5', '#F6FFFE']}
          style={styles.fullScreenGradient}
        >
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
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
