import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const UserList = ({ data, onPressItem }) => {
  return (
    <View style={styles.listContainer}>
      {data.map(user => (
        <TouchableOpacity
          key={user.id}
          style={styles.listItem}
          onPress={() => onPressItem && onPressItem(user)}
          activeOpacity={0.7}
        >
          <Image
            source={{
              uri: user.profilePic || 'https://via.placeholder.com/50',
            }}
            style={styles.profilePic}
          />
          <View style={styles.textContainer}>
            <Text style={styles.name}>{user.name}</Text>
            <Text
              style={styles.lastMessage}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {user.lastMessage}
            </Text>
          </View>
        </TouchableOpacity>
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
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ddd',
  },
  textContainer: {
    marginLeft: 10,
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  lastMessage: {
    color: '#666',
    fontSize: 14,
    marginTop: 2,
  },
});

export default UserList;
