import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BASE_URL } from '../assets/config';

const AddUserScreen = ({ navigation, route }) => {
  const { groupId, userId, currentMembers = [] } = route.params;
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${BASE_URL}api/user/users?userId=${userId}`);
        const data = await res.json();
        if (Array.isArray(data.users)) {
          const filtered = data.users.filter(u => !currentMembers.includes(u.userId));
          setUsers(filtered);
        }
      } catch (err) {
        Alert.alert('Error', 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [userId, currentMembers]);

  const toggleUserSelection = id => {
    setSelectedUsers(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const addUsersToGroup = async () => {
    if (!selectedUsers.length) {
      return Alert.alert('Error', 'Select at least one user');
    }
    try {
      const res = await fetch(`${BASE_URL}api/groupChat/${groupId}/add-members`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ members: selectedUsers }),
      });
      if (res.ok) {
        Alert.alert('Success', 'Users added');
        navigation.goBack();
      } else {
        throw new Error('Add failed');
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedUsers.includes(item.userId);
    return (
      <TouchableOpacity
        style={[styles.userItem, isSelected && styles.selectedUser]}
        onPress={() => toggleUserSelection(item.userId)}
      >
        <Image
          source={{
            uri: item.profileImage
              ? BASE_URL + item.profileImage
              : `${BASE_URL}uploads/default.png`
          }}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.username}>@{item.username}</Text>
        </View>
        {isSelected && <Icon name="check-circle" size={24} color="#4CAF50" />}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#007aff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={item => item.userId}
        ListHeaderComponent={<Text style={styles.header}>Select Users to Add</Text>}
      />
      <TouchableOpacity style={styles.addButton} onPress={addUsersToGroup}>
        <Text style={styles.addButtonText}>Add Selected Users</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  selectedUser: {
    backgroundColor: '#e3f2fd',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfo: { flex: 1 },
  name: { fontSize: 16, fontWeight: '500' },
  username: { color: '#666', fontSize: 14 },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  addButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 16,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AddUserScreen;
