import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const ClubList = ({ data }) => {
  return (
    <View style={styles.listContainer}>
      {data.map(club => (
        <View key={club.id} style={styles.listItem}>
          <Image source={{ uri: club.profilePic }} style={styles.profilePic} />
          <View style={styles.textContainer}>
            <Text style={styles.name}>{club.name}</Text>
            <Text style={styles.lastMessage}>{club.lastMessage}</Text>
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

export default ClubList;
