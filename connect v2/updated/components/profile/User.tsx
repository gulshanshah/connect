import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';

const UserScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
            style={styles.avatar}
          />
          <Text style={styles.fullName}>Gulshan Kumar Shah</Text>
          <Text style={styles.username}>@gulshan</Text>
          <Text style={styles.college}>Jabalpur Engineering College, Jabalpur</Text>
        </View>
    </SafeAreaView>
  );
};

export default UserScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 100,
  },
  fullName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
  },
  username: {
    fontSize: 16,
    color: '#666',
  },
});
