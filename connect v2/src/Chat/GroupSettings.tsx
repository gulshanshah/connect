import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import { BASE_URL } from '../assets/config';

interface Member {
  _id: string;
  name: string;
  username: string;
  profileImage: string;
}

interface GroupResponse {
  group: {
    _id: string;
    groupName: string;
    groupImage: string;
    members: Member[];
  };
}

const GroupSettings = ({ route }: any) => {
  const { groupId } = route.params;
  const [loading, setLoading] = useState(true);
  const [groupName, setGroupName] = useState('');
  const [groupImage, setGroupImage] = useState<string | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [imageFile, setImageFile] = useState<any>(null);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await fetch(`${BASE_URL}api/groupChat/${groupId}/group-info`);
        if (!res.ok) throw new Error('Failed to fetch group');
        const data: GroupResponse = await res.json();

        setGroupName(data.group.groupName);
        setGroupImage(data.group.groupImage);
        setMembers(data.group.members);
      } catch (err) {
        Alert.alert('Error', 'Failed to load group data');
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, [groupId]);

  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, res => {
      if (res.assets?.[0]) {
        setGroupImage(res.assets[0].uri || null);
        setImageFile(res.assets[0]);
      }
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('groupName', groupName);
      if (imageFile) {
        formData.append('groupImage', {
          uri: imageFile.uri,
          name: imageFile.fileName || 'group.jpg',
          type: imageFile.type || 'image/jpeg',
        });
      }

      const res = await fetch(`${BASE_URL}api/posts/${groupId}/edit-group`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (!res.ok) throw new Error('Update failed');
      Alert.alert('Success', 'Group updated successfully');
    } catch (err) {
      Alert.alert('Error', 'Failed to update group');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Group Settings</Text>

      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
          {groupImage ? (
            <Image source={{ uri: BASE_URL + groupImage }} style={styles.profileImage} />
          ) : (
            <Icon name="add-photo-alternate" size={40} color="#6B7280" />
          )}
        </TouchableOpacity>
        <Text style={styles.imageHelperText}>
          {groupImage ? 'Tap to change group image' : 'Tap to add group image'}
        </Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Group Name</Text>
        <TextInput
          style={styles.input}
          value={groupName}
          onChangeText={setGroupName}
          placeholder="Enter group name"
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
        <Icon name="check-circle" size={24} color="white" style={styles.buttonIcon} />
      </TouchableOpacity>

      <Text style={styles.label}>Members</Text>
      <FlatList
        data={members}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={styles.memberRow}>
            <Image source={{ uri: BASE_URL + item.profileImage }} style={styles.memberImage} />
            <View>
              <Text style={styles.memberName}>{item.name}</Text>
              <Text style={styles.memberUsername}>@{item.username}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flexGrow: 1, padding: 24, backgroundColor: '#F9FAFB' },
  header: { fontSize: 28, fontWeight: '700', color: '#1F2937', textAlign: 'center', marginBottom: 24 },
  imageContainer: { alignItems: 'center', marginBottom: 24 },
  imagePicker: {
    width: 150, height: 150, borderRadius: 75,
    backgroundColor: '#E5E7EB', justifyContent: 'center',
    alignItems: 'center', borderWidth: 2, borderColor: '#D1D5DB'
  },
  profileImage: { width: '100%', height: '100%', borderRadius: 75 },
  imageHelperText: { color: '#6B7280', marginTop: 8, fontSize: 14 },
  inputGroup: { marginBottom: 5 },
  label: { fontSize: 16, fontWeight: '500', color: '#374151', marginBottom: 8 },
  input: {
    backgroundColor: 'white', borderRadius: 10, padding: 14,
    fontSize: 16, color: '#1F2937', borderWidth: 1, borderColor: '#E5E7EB'
  },
  memberRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF', padding: 12, borderRadius: 8,
    marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB'
  },
  memberImage: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },
  memberName: { fontSize: 16, fontWeight: '500', color: '#1F2937' },
  memberUsername: { fontSize: 14, color: '#6B7280', marginTop: 2 },
  saveButton: {
    backgroundColor: '#3B82F6', borderRadius: 12,
    paddingVertical: 16, paddingHorizontal: 32,
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', marginTop: 5, marginBottom: 10,
    shadowColor: '#3B82F6', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 8, elevation: 4
  },
  saveButtonText: { color: 'white', fontSize: 18, fontWeight: '600', marginRight: 8 },
  buttonIcon: { marginLeft: 8 },
});

export default GroupSettings;
