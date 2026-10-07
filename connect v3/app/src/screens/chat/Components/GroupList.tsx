import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const GroupList = ({ data }) => {
  return (
    <View style={styles.listContainer}>
      {data.map(group => (
        <View key={group.id} style={styles.listItem}>
          <Image source={{ uri: group.profilePic }} style={styles.profilePic} />
          <View style={styles.textContainer}>
            <Text style={styles.name}>{group.name}</Text>
            <Text style={styles.lastMessage}>{group.lastMessage}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 10,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textContainer: {
    marginLeft: 10,
  },
  name: {
    fontWeight: 'bold',
  },
  lastMessage: {
    color: '#666',
  },
});

export default GroupList;
