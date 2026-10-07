import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Image 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from "../assets/config";

const SearchScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (!userData) return;
        
        const user = JSON.parse(userData);
        const response = await fetch(`${BASE_URL}api/user/users?userId=${user.id}`);
        const data = await response.json();

        if (Array.isArray(data.users)) {
          setUsers(data.users.map(user => ({
            id: user.userId,
            name: user.name || "No Name",
            username: user.username,
            profileImage: user.profileImage,
          })));
        } else {
          setUsers([]);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.userCard}
      onPress={() => navigation.navigate('UserProfile', { user: item })}
      activeOpacity={0.7}
    >
      {item.profileImage ? (
        <Image source={{ uri: BASE_URL + item.profileImage }} style={styles.profileImage} />
      ) : (
        <Icon name="person-circle-outline" size={45} color="#ccc" style={styles.profileImage} />
      )}
      <View style={styles.userInfo}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.username}>@{item.username}</Text>
      </View>
      <Icon name="chevron-forward-outline" size={20} color="#ccc" style={styles.chevronIcon} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon name="search-outline" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          placeholder="Search users..."
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchInput}
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="while-editing"
        />
      </View>
      <FlatList
        data={filteredUsers}
        keyExtractor={item => (item.id ? item.id.toString() : Math.random().toString())}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.noResults}>No users found</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    padding: 16,
    backgroundColor: '#fff'
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  username: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  chevronIcon: {
    marginLeft: 8,
  },
  noResults: {
    textAlign: 'center',
    marginTop: 20,
    color: '#777',
    fontSize: 16,
  },
});

export default SearchScreen;
