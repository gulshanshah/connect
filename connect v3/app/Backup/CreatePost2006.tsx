import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Image, ScrollView, ActivityIndicator, Modal, Pressable, Alert,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../constants/ThemeContext';

const MAX_CHARS = 280;

const CreatePost = () => {
  const [postText, setPostText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [location, setLocation] = useState(null);
  const [music, setMusic] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const theme = useTheme();

  const user = {
    name: 'Sarah Johnson',
    username: '@sarah_j',
    avatar: 'https://randomuser.me/api/portraits/women/12.jpg'
  };

  const handlePost = () => {
    if (!postText.trim() && !selectedMedia && !music) {
      Alert.alert('Empty Post', 'Please write something or add media before posting');
      return;
    }
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setPostText('');
      setSelectedMedia(null);
      setLocation(null);
      setMusic(null);
      Alert.alert('Success', 'Your post has been published!');
    }, 1500);
  };

  const handleAddPhoto = (source) => {
    const demoImage = 'https://picsum.photos/200/200?image=12';
    setSelectedMedia({ type: 'image', uri: demoImage, source });
    setModalVisible(false);
  };

  const handleAddLocation = () => {
    setLocation('San Francisco, CA');
    setModalVisible(false);
  };

  const handleAddMusic = () => {
    setMusic({
      title: "Imagine",
      artist: "John Lennon",
      albumArt: "https://picsum.photos/200/200?image=20"
    });
    setModalVisible(false);
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={[styles.container, { backgroundColor: theme.card }]}>
        {}
        <View style={styles.userHeader}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userHandle}>{user.username}</Text>
          </View>
          <Text style={styles.postPrivacy}>
            <FontAwesome name="globe" size={14} color="#555" /> Public
          </Text>
        </View>
        
        {}
        <TextInput
          style={styles.input}
          placeholder="What's on your mind?"
          placeholderTextColor="#666"
          multiline
          value={postText}
          onChangeText={setPostText}
          maxLength={MAX_CHARS}
        />
        
        {}
        <Text style={[
          styles.charCounter,
          postText.length > MAX_CHARS * 0.8 ? styles.charCounterWarning : null
        ]}>
          {postText.length}/{MAX_CHARS}
        </Text>
        
        {}
        {selectedMedia && (
          <View style={styles.mediaPreview}>
            <Image source={{ uri: selectedMedia.uri }} style={styles.previewImage} />
            <TouchableOpacity 
              style={styles.removeMediaBtn}
              onPress={() => setSelectedMedia(null)}
            >
              <Ionicons name="close-circle" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        {}
        {music && (
          <View style={styles.musicPreview}>
            <Image source={{ uri: music.albumArt }} style={styles.musicArt} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.musicTitle}>{music.title}</Text>
              <Text style={styles.musicArtist}>{music.artist}</Text>
            </View>
            <TouchableOpacity onPress={() => setMusic(null)}>
              <Ionicons name="close-circle" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        )}
        
        {}
        {location && (
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={18} color="#4267B2" />
            <Text style={styles.locationText}>{location}</Text>
            <TouchableOpacity onPress={() => setLocation(null)}>
              <Ionicons name="close" size={18} color="#777" />
            </TouchableOpacity>
          </View>
        )}

        {}
        <View style={styles.rowActions}>
          <TouchableOpacity 
            style={styles.iconButtonCompact}
            onPress={() => setModalVisible(true)}
          >
            <MaterialIcons name="add" size={22} color="#4267B2" />
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.postButtonCompact,
              (!postText.trim() && !selectedMedia && !music) ? styles.postButtonDisabled : null
            ]}
            onPress={handlePost}
            disabled={(!postText.trim() && !selectedMedia && !music) || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.postButtonText}>Post</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.actionSheet}>
            <Text style={styles.sheetTitle}>Add to your post</Text>
            <TouchableOpacity style={styles.actionOption} onPress={() => handleAddPhoto('camera')}>
              <MaterialIcons name="photo-camera" size={26} color="#4267B2" />
              <Text style={styles.actionLabel}>Camera Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionOption} onPress={() => handleAddPhoto('gallery')}>
              <FontAwesome name="photo" size={24} color="#4267B2" />
              <Text style={styles.actionLabel}>Gallery Image</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionOption} onPress={handleAddLocation}>
              <Ionicons name="location-outline" size={26} color="#4267B2" />
              <Text style={styles.actionLabel}>Location</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionOption} onPress={handleAddMusic}>
              <FontAwesome name="music" size={24} color="#4267B2" />
              <Text style={styles.actionLabel}>Song</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    margin: 6,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomColor: '#f0f0f0',
    padding: 15,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#333',
  },
  userHandle: {
    color: '#666',
    fontSize: 13,
  },
  postPrivacy: {
    fontSize: 12,
    color: '#555',
    backgroundColor: '#f0f0f0',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    fontSize: 16,
    minHeight: 85,
    textAlignVertical: 'top',
    padding: 12,
    borderColor: '#eee',
    marginBottom: 8,
  },
  charCounter: {
    alignSelf: 'flex-end',
    fontSize: 12,
    color: '#888',
    paddingRight: 10,
    marginTop: -30,
  },
  charCounterWarning: {
    color: '#ff6347',
  },
  mediaPreview: {
    marginVertical: 10,
    position: 'relative',
  },
  previewImage: {
    height: 280,
    resizeMode: 'cover',
  },
  removeMediaBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 13,
    alignSelf: 'flex-start',
  },
  locationText: {
    marginHorizontal: 5,
    color: '#4267B2',
    fontSize: 14,
  },
  rowActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 10,
    gap: 15,
  },
  iconButtonCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f0f2f5',
    borderRadius: 20,
    flexShrink: 1,
  },
  buttonText: {
    color: '#4267B2',
    fontSize: 14,
  },
  postButtonCompact: {
    backgroundColor: '#4267B2',
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 8,
    alignItems: 'center',
  },
  postButtonDisabled: {
    backgroundColor: '#a0b1d6',
  },
  postButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(30,30,30,0.36)',
    justifyContent: 'flex-end',
  },
  actionSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 26,
    paddingTop: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowOffset: { width: 0, height: -2 },
    elevation: 5,
  },
  sheetTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#4267B2',
    marginBottom: 14,
    textAlign: 'center'
  },
  actionOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  actionLabel: {
    marginLeft: 17,
    color: '#333',
    fontSize: 16,
  },
  musicPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  musicArt: {
    width: 44,
    height: 44,
    borderRadius: 7,
    backgroundColor: '#ddd'
  },
  musicTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#222'
  },
  musicArtist: {
    color: '#666',
    fontSize: 13,
  },
});

export default CreatePost;