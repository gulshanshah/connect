import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const BottomTabsComponent = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.tabItem}>
        <Icon name="home" size={24} color="#333" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem}>
        <Icon name="search" size={24} color="#CACCCB" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem}>
        <View style={styles.payWrapper}>
          <Text style={styles.payText}>₹</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem}>
        <Icon name="grid" size={24} color="#CACCCB" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingLeft: 20,
    paddingRight: 20,
    borderWidth: 0,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    padding: 20,
    borderRadius: 40,
  },
  payWrapper: {
    height: 24,
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payText: {
    fontSize: 22,
    color: '#CACCCB',
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default BottomTabsComponent;
