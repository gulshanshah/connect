import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, FlatList,
  StyleSheet, TouchableOpacity, Image
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../assets/config';

const CreateGroupScreen = ({ navigation }) => {
  const [groupName, setGroupName] = useState('');
  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);

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
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const toggleUserSelection = (userId) => {
    setSelectedUserIds(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchText.toLowerCase())
  );

  const createGroup = async () => {
    if (!groupName.trim()) {
      alert('Group name is required');
      return;
    }

    if (selectedUserIds.length < 1) {
      alert('Select at least 2 users to create a group');
      return;
    }

    try {
      const userData = await AsyncStorage.getItem('user');
      const currentUser = JSON.parse(userData);

      const response = await fetch(`${BASE_URL}api/groupChat/group/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          groupName,
          members: selectedUserIds,
          createdBy: currentUser.id,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Group created successfully!');
        setGroupName('');
        setSelectedUserIds([]);
        navigation.navigate('Tabs');
      } else {
        alert(result.message || 'Something went wrong.');
      }
    } catch (err) {
      console.error(err);
      alert('Error creating group.');
    }
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedUserIds.includes(item.id);

    return (
      <TouchableOpacity
        style={[styles.userCard, isSelected && styles.selectedCard]}
        onPress={() => toggleUserSelection(item.id)}
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
        {isSelected && <Icon name="checkmark-circle" size={20} color="#4ade80" />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create a new Group</Text>

      <TextInput
        placeholder="Group Name"
        value={groupName}
        onChangeText={setGroupName}
        style={styles.groupNameInput}
      />
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
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.noResults}>No users found</Text>}
      />
      <TouchableOpacity style={styles.createButton} onPress={createGroup}>
        <Text style={styles.createButtonText}>Create Group</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { 
    fontSize: 22, 
    fontWeight: '700', 
    color: '#1F2937', 
    textAlign: 'center', 
    marginBottom: 24 
  },
  groupNameInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
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
  selectedCard: {
    backgroundColor: '#e6f7e6',
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
  noResults: {
    textAlign: 'center',
    marginTop: 20,
    color: '#777',
    fontSize: 16,
  },
  createButton: {
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateGroupScreen;
