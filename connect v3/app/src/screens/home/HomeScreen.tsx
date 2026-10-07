import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../constants/ThemeContext';

import HeaderScreen from './components/Head';
import StoryScreen from './components/Story';
import PostScreen from './components/Post';
import CreatePostScreen from './components/CreatePost';

const HomeScreen = () => {
  const theme = useTheme();
  return (
    <LinearGradient
          colors={[theme.background, theme.background]}
          style={styles.fullScreenGradient}
        >
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="dark-content" />

      <ScrollView style={styles.mainContent}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      >
        <HeaderScreen />

        <View style={styles.optdf}>
          <TouchableOpacity style={styles.item}>
        <Text style={[styles.text, { color: '#000' }]}>Discover</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item}>
        <Text style={styles.text}>Connected</Text>
          </TouchableOpacity>
        </View>

        <StoryScreen />

        <CreatePostScreen />

        <View style={styles.optrp}>
          <TouchableOpacity style={styles.item}>
        <Text style={[styles.text, { color: '#000' }]}>Recent Posts</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="ellipsis-horizontal" size={24} color="#333" style={styles.elpshr}/>
          </TouchableOpacity>
        </View>

        <PostScreen />
      </ScrollView>
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
    padding: 0,
  },
  optdf: {
    flexDirection: 'row',
    marginTop: 15,
  },
  item: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  text: {
    fontSize: 17,
    color: '#CACCCB',
    fontWeight: '800',
  },
  optrp: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  elpshr: {
    marginRight: 24,
    paddingTop: 10,
  },
});

export default HomeScreen;
