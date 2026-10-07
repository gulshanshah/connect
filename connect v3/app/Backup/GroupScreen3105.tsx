import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../constants/ThemeContext';

const INITIAL_ADMINS = [
  { id: 1, name: 'Alex Johnson', username: 'alex_johnson' },
  { id: 2, name: 'Sam Wilson', username: 'samwilson' },
];
const INITIAL_USERS = [
  { id: 3, name: 'Jordan Taylor', username: 'jtay' },
  { id: 4, name: 'Casey Smith', username: 'casey_smith' },
  { id: 5, name: 'Riley Miller', username: 'riley_m' },
  { id: 6, name: 'Jamie Brown', username: 'jamieb' },
];

const groupName = 'Mobile Dev Team';
const groupImage = 'https://picsum.photos/200/200?image=20';
const groupInitDescription =
  "A group for all mobile developers to share, learn, and discuss new trends in mobile development.";

const GroupScreen = ({ navigation }) => {
  const [admins, setAdmins] = useState(INITIAL_ADMINS);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [description, setDescription] = useState(groupInitDescription);
  const [editingDescription, setEditingDescription] = useState(false);
  const [descInput, setDescInput] = useState(description);
  const theme = useTheme();

  const handleAddMember = () => {
    const nextId = users.length + admins.length + 1;
    const newUser = {
      id: nextId,
      name: `New Member ${nextId}`,
      username: `user${nextId}`,
    };
    setUsers([...users, newUser]);
    Alert.alert('Member Added', `${newUser.name} (@${newUser.username}) has been added.`);
  };

  const handleShowMedia = () => {
    Alert.alert('Media', 'This would show media, links, and docs.');
  };

  const handleSaveDescription = () => {
    setDescription(descInput);
    setEditingDescription(false);
    Alert.alert('Description Updated', 'Group description has been updated.');
  };

  const showUserOptions = (item, isAdmin) => {
    Alert.alert(
      'Options',
      `${isAdmin ? 'Admin' : 'Member'}: ${item.name}`,
      [
        { text: 'View profile', onPress: () => {} },
        { text: 'Remove', onPress: () => {} },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const renderItem = ({ item, isAdmin }) => (
    <View style={styles.listItem}>
      <Image
        source={{ uri: `https://picsum.photos/200/200?random=${item.id}` }}
        style={styles.userAvatar}
      />
      <View style={{ flex: 1, marginLeft: 16 }}>
        <Text style={styles.listText}>{item.name}</Text>
        <Text style={styles.usernameText}>@{item.username}</Text>
      </View>
      {isAdmin && <Text style={styles.adminLabel}>Admin</Text>}
      <TouchableOpacity style={styles.listDots} onPress={() => showUserOptions(item, isAdmin)}>
        <Icon name="more-vert" size={22} color="#888" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {}
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <TouchableOpacity onPress={() => navigation && navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Group Info</Text>
        <TouchableOpacity>
          <Icon name="more-vert" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {}
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        {}
        <View style={styles.groupHeader}>
          <Image source={{ uri: groupImage }} style={styles.groupAvatar} />
          <Text style={[styles.groupName, { color: theme.text }]}>{groupName}</Text>
        </View>

        {}
        <View style={styles.infoSection}>
          <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
            <Text style={styles.descriptionLabel}>Description</Text>
            {!editingDescription && (
              <TouchableOpacity onPress={() => setEditingDescription(true)}>
                <Icon name="edit" size={18} color="#2348aa" />
              </TouchableOpacity>
            )}
          </View>
          
          {editingDescription ? (
            <View>
              <TextInput
                value={descInput}
                onChangeText={setDescInput}
                multiline
                style={styles.descInput}
                autoFocus
              />
              <View style={{flexDirection:'row', justifyContent:'flex-end', marginTop: 8}}>
                <TouchableOpacity onPress={() => setEditingDescription(false)} style={{marginRight:10}}>
                  <Text style={{color: '#888', fontSize: 15}}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSaveDescription}>
                  <Text style={{color:'#2348aa', fontWeight:'bold', fontSize: 15}}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <Text style={styles.descriptionText}>{description}</Text>
          )}

          <TouchableOpacity style={styles.actionRow} onPress={handleAddMember}>
            <Icon name="person-add" size={22} color="#2348aa" style={{ marginRight: 14 }} />
            <Text style={styles.actionText}>Add Member</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionRow} onPress={handleShowMedia}>
            <Icon name="perm-media" size={22} color="#2348aa" style={{ marginRight: 14 }} />
            <Text style={styles.actionText}>Media, Links, Docs</Text>
          </TouchableOpacity>
        </View>

        {}
        <Text style={[styles.sectionTitle, { color: theme.text, backgroundColor: theme.background }]}>Admins</Text>
        <FlatList
          data={admins}
          renderItem={({ item }) => renderItem({ item, isAdmin: true })}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          
        />

        {}
        <Text style={[styles.sectionTitle, { color: theme.text, backgroundColor: theme.background }]}>Members</Text>
        <FlatList
          data={users}
          renderItem={({ item }) => renderItem({ item, isAdmin: false })}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  scrollContainer: { flex: 1 },
  scrollContent: { paddingBottom: 20 },
  headerTitle: { fontSize: 18, fontWeight: '600' },

  groupHeader: {
    alignItems: 'center',
    padding: 20,
  },
  groupAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  groupName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  infoSection: {
    marginHorizontal: 16,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#2348aa",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  descriptionLabel: {
    fontSize: 15, color: '#444', fontWeight: '600', marginBottom: 6,
  },
  descriptionText: {
    fontSize: 15,
    color: '#445',
    marginBottom: 16,
    marginTop: 2,
  },
  descInput: {
    fontSize: 15,
    color: '#2348aa',
    backgroundColor:'#fff',
    borderRadius:8,
    borderColor:'#2348aa50',
    borderWidth:1,
    padding:8,
    minHeight: 40,
    textAlignVertical: 'top',
    marginTop:2,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderColor: '#ececec',
  },
  actionText: {
    fontSize: 17,
    fontWeight: '500',
    color: '#2348aa',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f1f2f6',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f1f2f6',
  },
  listText: { fontSize: 16, fontWeight: '500' },
  usernameText: { fontSize: 13, color: '#888' },
  userAvatar: { width: 40, height: 40, borderRadius: 20 },
  adminLabel: {
    color: 'blue',
    fontWeight: '500',
    marginLeft: 12,
    fontSize: 13,
  },
  listDots: {
    padding: 8,
    marginLeft: 2,
  },
});

export default GroupScreen;