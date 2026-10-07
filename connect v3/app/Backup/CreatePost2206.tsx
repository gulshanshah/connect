import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Image, ScrollView, ActivityIndicator, Modal, Pressable, Alert, Dimensions,
  Platform
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../constants/ThemeContext';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import PhotoEditor from '../../../components/Editor';

const MAX_CHARS = 280;
const MAX_IMAGES = 10;

const { width } = Dimensions.get('window');

const CreatePost = () => {
  const [postText, setPostText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [location, setLocation] = useState(null);
  const [music, setMusic] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editorModalVisible, setEditorModalVisible] = useState(false);
  const [imageToEdit, setImageToEdit] = useState(null);
  const theme = useTheme();

  const user = {
    name: 'Sarah Johnson',
    username: '@sarah_j',
    avatar: 'https://randomuser.me/api/portraits/women/12.jpg'
  };

  const handlePost = () => {
    if (!postText.trim() && selectedMedia.length === 0 && !music) {
      Alert.alert('Empty Post', 'Please write something or add media before posting');
      return;
    }
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setPostText('');
      setSelectedMedia([]);
      setLocation(null);
      setMusic(null);
      Alert.alert('Success', 'Your post has been published!');
    }, 1500);
  };

  const handleChoosePhoto = async (type) => {
    let response;
    const options = {
      mediaType: 'photo',
      quality: 0.7,
      selectionLimit: 1,
      includeBase64: false,
    };

    if (type === 'camera') {
      response = await launchCamera(options);
    } else {
      response = await launchImageLibrary(options);
    }

    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.errorCode) {
      console.log('ImagePicker Error: ', response.errorCode, response.errorMessage);
      Alert.alert('Image Error', `Failed to pick image: ${response.errorMessage}`);
    } else if (response.assets && response.assets.length > 0) {
      const selectedAsset = response.assets[0];
      setImageToEdit({
        uri: selectedAsset.uri,
        initialFrameIndex: type === 'gallery' ? 3 : 2,
        key: new Date().getTime().toString()
      });
      setEditorModalVisible(true);
    }
    setModalVisible(false);
  };

  const handleEditedImageSave = (imageInfo) => {
    console.log('CreatePost: Received imageInfo from editor:', imageInfo);
    if (selectedMedia.length < MAX_IMAGES) {
      setSelectedMedia(prevMedia => [
        ...prevMedia,
        imageInfo
      ]);
    } else {
      Alert.alert('Limit Reached', `You can only add up to ${MAX_IMAGES} images.`);
    }
    setEditorModalVisible(false);
    setImageToEdit(null);
  };

  const handleRemoveMedia = (indexToRemove) => {
    setSelectedMedia(prevMedia =>
      prevMedia.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleEditExistingMedia = (media) => {
    setImageToEdit({
      uri: media.uri,
      initialFrameIndex: 2,
      key: new Date().getTime().toString()
    });
    setEditorModalVisible(true);
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
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContentContainer}>
      <View style={[styles.container, { backgroundColor: theme.card }]}>
        {}
        <View style={styles.userHeader}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: theme.text }]}>{user.name}</Text>
            <Text style={[styles.userHandle, { color: theme.secondaryText }]}>{user.username}</Text>
          </View>
          <Text style={styles.postPrivacy}>
            <FontAwesome name="globe" size={14} color="#555" /> Public
          </Text>
        </View>

        {}
        <TextInput
          style={[styles.input, { color: theme.text }]}
          placeholder="What's on your mind?"
          placeholderTextColor={theme.secondaryText}
          multiline
          value={postText}
          onChangeText={setPostText}
          maxLength={MAX_CHARS}
        />

        {}
        <Text style={[
          styles.charCounter,
          postText.length > MAX_CHARS * 0.8 ? styles.charCounterWarning : { color: theme.secondaryText }
        ]}>
          {postText.length}/{MAX_CHARS}
        </Text>

        {}
        {selectedMedia.length > 0 && (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaGallery}>
    {selectedMedia.map((media, index) => (
      <View key={index} style={styles.mediaPreview}>
        <TouchableOpacity onPress={() => handleEditExistingMedia(media)}>
          <Image 
            source={{ uri: media.uri.startsWith('file://') ? media.uri : `file://${media.uri}` }} 
            style={styles.previewImage} 
            onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.removeMediaBtn}
          onPress={() => handleRemoveMedia(index)}
        >
          <Ionicons name="close-circle" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    ))}
  </ScrollView>
)}

        {}
        {music && (
          <View style={styles.musicPreview}>
            <Image source={{ uri: music.albumArt }} style={styles.musicArt} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={[styles.musicTitle, { color: theme.text }]}>{music.title}</Text>
              <Text style={[styles.musicArtist, { color: theme.secondaryText }]}>{music.artist}</Text>
            </View>
            <TouchableOpacity onPress={() => setMusic(null)}>
              <Ionicons name="close-circle" size={24} color={theme.secondaryText} />
            </TouchableOpacity>
          </View>
        )}

        {}
        {location && (
          <View style={[styles.locationContainer, { backgroundColor: theme.inputBackground }]}>
            <Ionicons name="location-outline" size={18} color={theme.primary} />
            <Text style={[styles.locationText, { color: theme.primary }]}>{location}</Text>
            <TouchableOpacity onPress={() => setLocation(null)}>
              <Ionicons name="close" size={18} color={theme.secondaryText} />
            </TouchableOpacity>
          </View>
        )}

        {}
        <View style={styles.rowActions}>
          <TouchableOpacity
            style={[styles.iconButtonCompact, { backgroundColor: theme.inputBackground }]}
            onPress={() => setModalVisible(true)}
          >
            <MaterialIcons name="add" size={22} color={theme.primary} />
            <Text style={[styles.buttonText, { color: theme.primary }]}>Add</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.postButtonCompact,
              (!postText.trim() && selectedMedia.length === 0 && !music) ? styles.postButtonDisabled : { backgroundColor: theme.primary }
            ]}
            onPress={handlePost}
            disabled={(!postText.trim() && selectedMedia.length === 0 && !music) || isLoading}
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
          <View style={[styles.actionSheet, { backgroundColor: theme.card }]}>
            <Text style={[styles.sheetTitle, { color: theme.primary }]}>Add to your post</Text>

            {}
            <TouchableOpacity
              style={styles.actionOption}
              onPress={() => handleChoosePhoto('camera')}
              disabled={selectedMedia.length >= MAX_IMAGES}
            >
              <MaterialIcons name="photo-camera" size={26} color={selectedMedia.length >= MAX_IMAGES ? '#ccc' : theme.primary} />
              <Text style={[styles.actionLabel, { color: selectedMedia.length >= MAX_IMAGES ? '#ccc' : theme.text }]}>Camera Photo</Text>
              {selectedMedia.length >= MAX_IMAGES && <Text style={styles.limitText}>(Max {MAX_IMAGES})</Text>}
            </TouchableOpacity>

            {}
            <TouchableOpacity
              style={styles.actionOption}
              onPress={() => handleChoosePhoto('gallery')}
              disabled={selectedMedia.length >= MAX_IMAGES}
            >
              <FontAwesome name="photo" size={24} color={selectedMedia.length >= MAX_IMAGES ? '#ccc' : theme.primary} />
              <Text style={[styles.actionLabel, { color: selectedMedia.length >= MAX_IMAGES ? '#ccc' : theme.text }]}>Gallery Image</Text>
              {selectedMedia.length >= MAX_IMAGES && <Text style={styles.limitText}>(Max {MAX_IMAGES})</Text>}
            </TouchableOpacity>

            {}
            <TouchableOpacity style={styles.actionOption} onPress={handleAddLocation}>
              <Ionicons name="location-outline" size={26} color={theme.primary} />
              <Text style={[styles.actionLabel, { color: theme.text }]}>Location</Text>
            </TouchableOpacity>

            {}
            <TouchableOpacity style={[styles.actionOption, { borderBottomWidth: 0 }]} onPress={handleAddMusic}>
              <FontAwesome name="music" size={24} color={theme.primary} />
              <Text style={[styles.actionLabel, { color: theme.text }]}>Song</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {}
      <Modal
        visible={editorModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditorModalVisible(false)}
      >
        {}
        {imageToEdit && (
          <PhotoEditor
            key={imageToEdit.key}
            source={{ uri: imageToEdit.uri }}
            initialFrameIndex={imageToEdit.initialFrameIndex}
            onSave={handleEditedImageSave}
            onClose={() => setEditorModalVisible(false)}
          />
        )}
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  scrollContentContainer: {
    paddingBottom: 20,
  },
  container: {
    margin: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    paddingVertical: 15,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  userHandle: {
    fontSize: 13,
  },
  postPrivacy: {
    fontSize: 12,
    backgroundColor: '#e0e0e0',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  input: {
    fontSize: 17,
    minHeight: 120,
    textAlignVertical: 'top',
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 35,
  },
  charCounter: {
    alignSelf: 'flex-end',
    fontSize: 12,
    paddingRight: 15,
    marginTop: -25,
    marginBottom: 10,
  },
  charCounterWarning: {
    color: '#ff4c4c',
    fontWeight: 'bold',
  },
  mediaGallery: {
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  mediaPreview: {
  width: width * 0.7,
  height: 200,
  borderRadius: 10,
  overflow: 'hidden',
  marginRight: 10,
  position: 'relative',
  backgroundColor: '#e0e0e0',
},
previewImage: {
  width: '100%',
  height: '100%',
  resizeMode: 'cover',
},
  removeMediaBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 15,
    padding: 2,
    zIndex: 1,
  },
  musicPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  musicArt: {
    width: 40,
    height: 40,
    borderRadius: 5,
    marginRight: 10,
  },
  musicTitle: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  musicArtist: {
    fontSize: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#e6f0ff',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 25,
    marginHorizontal: 15,
    marginBottom: 15,
    marginTop: 5,
    gap: 5,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '500',
  },
  rowActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#eee',
    marginTop: 10,
  },
  iconButtonCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 25,
    gap: 8,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '500',
  },
  postButtonCompact: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  actionSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    paddingTop: 15,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: -3 },
    elevation: 8,
  },
  sheetTitle: {
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  actionOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomColor: '#f0f0f0',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  actionLabel: {
    marginLeft: 20,
    fontSize: 17,
  },
  limitText: {
    marginLeft: 'auto',
    fontSize: 13,
    color: '#ff4c4c',
    fontWeight: 'bold',
  },
});

export default CreatePost;