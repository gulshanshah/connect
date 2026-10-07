import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

import HeaderScreen from '../components/home/Head';
import StoryScreen from '../components/home/Story';
import PostScreen from '../components/home/Post';

const HomeScreen = () => {
  return (
    <LinearGradient
          colors={['#9CFBE5', '#F6FFFE']}
          style={styles.fullScreenGradient}
        >
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView style={styles.mainContent}>
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
    backgroundColor: '#f1f2f6',
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
