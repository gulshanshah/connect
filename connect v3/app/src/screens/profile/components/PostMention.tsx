import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const PostMention = ({ selectedTab, onSelectTab }) => {
  const tabs = [
    { label: 'Post', icon: 'columns' },
    { label: 'Mention', icon: 'at-sign' },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => onSelectTab(tab.label)}
          style={[styles.tab, selectedTab === tab.label && styles.activeTab]}
        >
          <View style={styles.tabContent}>
            <Feather
              name={tab.icon}
              size={18}
              color={selectedTab === tab.label ? 'black' : 'gray'}
              style={styles.icon}
            />
            <Text style={selectedTab === tab.label ? styles.activeText : styles.text}>
              {tab.label}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    width: 180,
  },
  activeTab: {
    borderBottomColor: '#888',
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 5,
  },
  text: {
    fontSize: 16,
    color: 'gray',
  },
  activeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default PostMention;
