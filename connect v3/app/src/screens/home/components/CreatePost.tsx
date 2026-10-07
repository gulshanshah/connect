import React, { useState, useCallback } from 'react';
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
  const [music, setMusic] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editorModalVisible, setEditorModalVisible] = useState(false);
  const [imageToEdit, setImageToEdit] = useState(null);
  const [visibilityModalVisible, setVisibilityModalVisible] = useState(false);
  const [postVisibility, setPostVisibility] = useState('public');
  const theme = useTheme();

  const user = {
    name: 'Sarah Johnson',
    username: '@sarah_j',
    avatar: 'https://randomuser.me/api/portraits/women/12.jpg'
  };

  const handlePost = async () => {
    if (!postText.trim() && selectedMedia.length === 0) {
      Alert.alert('Empty Post', 'Please write something or add media before posting');
      return;
    }
    setIsLoading(true);


    try {
      const postData = {
        postText: postText,
        visibility: postVisibility,
        media: selectedMedia.map(media => ({
          uri: media.uri,
          type: media.type || 'image',
        })),
      };

      console.log('Posting data:', postData);

      
      
      setPostText('');
      setSelectedMedia([]);
      
      Alert.alert('Success', `Your ${postVisibility} post has been published!`);
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Failed to create post. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
      Alert.alert('Image Error', `Failed to pick image: ${response.errorMessage}`);
    } else if (response.assets?.length > 0) {
      const selectedAsset = response.assets[0];
      setImageToEdit({
        uri: selectedAsset.uri,
        initialFrameIndex: type === 'gallery' ? 3 : 2,
        key: Date.now().toString()
      });
      setEditorModalVisible(true);
    }
    setModalVisible(false);
  };

  const handleEditedImageSave = useCallback((imageInfo) => {
    if (selectedMedia.length < MAX_IMAGES) {
      setSelectedMedia(prev => [...prev, imageInfo]);
    } else {
      Alert.alert('Limit Reached', `You can only add up to ${MAX_IMAGES} images.`);
    }
    setEditorModalVisible(false);
    setImageToEdit(null);
  }, [selectedMedia.length]);

  const handleRemoveMedia = useCallback((indexToRemove) => {
    setSelectedMedia(prev => prev.filter((_, index) => index !== indexToRemove));
  }, []);

  const handleEditExistingMedia = useCallback((media) => {
    setImageToEdit({
      uri: media.uri,
      initialFrameIndex: 2,
      key: Date.now().toString()
    });
    setEditorModalVisible(true);
  }, []);

  const handleAddLocation = useCallback(() => {
    setLocation('San Francisco, CA');
    setModalVisible(false);
  }, []);


  const toggleVisibility = useCallback((visibility) => {
    setPostVisibility(visibility);
    setVisibilityModalVisible(false);
  }, []);

  const renderVisibilityOptions = () => (
    <View style={styles.visibilityOptions}>
      <TouchableOpacity
        style={[styles.visibilityOption, postVisibility === 'public' && styles.selectedOption]}
        onPress={() => toggleVisibility('public')}
      >
        <FontAwesome 
          name="globe" 
          size={18} 
          color={postVisibility === 'public' ? theme.primary : theme.text} 
        />
        <Text style={[styles.visibilityLabel, { color: postVisibility === 'public' ? theme.primary : theme.text }]}>
          Public
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.visibilityOption, postVisibility === 'private' && styles.selectedOption]}
        onPress={() => toggleVisibility('private')}
      >
        <Ionicons 
          name="lock-closed" 
          size={18} 
          color={postVisibility === 'private' ? theme.primary : theme.text} 
        />
        <Text style={[styles.visibilityLabel, { color: postVisibility === 'private' ? theme.primary : theme.text }]}>
          Private
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView 
      style={styles.scrollContainer} 
      contentContainerStyle={styles.scrollContentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={[styles.container, { backgroundColor: theme.card }]}>
        {}
        <View style={styles.userHeader}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: theme.text }]}>{user.name}</Text>
            <Text style={[styles.userHandle, { color: theme.secondaryText }]}>{user.username}</Text>
          </View>
          
          {}
          <TouchableOpacity
            style={[styles.visibilityButton, { backgroundColor: theme.inputBackground }]}
            onPress={() => setVisibilityModalVisible(true)}
          >
            {postVisibility === 'public' ? (
              <>
                <FontAwesome name="globe" size={14} color={theme.primary} />
                <Text style={[styles.visibilityButtonText, { color: theme.primary }]}>Public</Text>
              </>
            ) : (
              <>
                <Ionicons name="lock-closed" size={14} color={theme.primary} />
                <Text style={[styles.visibilityButtonText, { color: theme.primary }]}>Private</Text>
              </>
            )}
          </TouchableOpacity>
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
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.mediaGallery}
          >
            {selectedMedia.map((media, index) => (
              <View key={`media-${index}`} style={styles.mediaPreview}>
                <TouchableOpacity onPress={() => handleEditExistingMedia(media)}>
                  <Image 
                    source={{ uri: media.uri.startsWith('file://') ? media.uri : `file://${media.uri}` }} 
                    style={styles.previewImage} 
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
        {}

        {}
        {}

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
              (!postText.trim() && selectedMedia.length === 0) ? 
                styles.postButtonDisabled : 
                { backgroundColor: theme.primary }
            ]}
            onPress={handlePost}
            disabled={(!postText.trim() && selectedMedia.length === 0) || isLoading}
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

            <TouchableOpacity
              style={styles.actionOption}
              onPress={() => handleChoosePhoto('camera')}
              disabled={selectedMedia.length >= MAX_IMAGES}
            >
              <MaterialIcons name="photo-camera" size={26} color={selectedMedia.length >= MAX_IMAGES ? '#ccc' : theme.primary} />
              <Text style={[styles.actionLabel, { color: selectedMedia.length >= MAX_IMAGES ? '#ccc' : theme.text }]}>Camera Photo</Text>
              {selectedMedia.length >= MAX_IMAGES && <Text style={styles.limitText}>(Max {MAX_IMAGES})</Text>}
            </TouchableOpacity>

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

      {}
      <Modal
        visible={visibilityModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisibilityModalVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setVisibilityModalVisible(false)}
        >
          <View style={[styles.visibilitySheet, { backgroundColor: theme.card }]}>
            <Text style={[styles.sheetTitle, { color: theme.primary }]}>Who can see this?</Text>
            {renderVisibilityOptions()}
            <Text style={[styles.visibilityHint, { color: theme.secondaryText }]}>
              {postVisibility === 'public' 
                ? 'Anyone on the platform can see this post' 
                : 'Only you and approved followers can see this post'}
            </Text>
          </View>
        </Pressable>
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
  },
  container: {
    margin: 10,
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
  visibilityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    gap: 1,
    borderWidth: 1,
    borderColor: '#888',
  },
  visibilityButtonText: {
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 4,
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
  rowActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#eee',
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
  visibilitySheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 25,
    paddingBottom: Platform.OS === 'ios' ? 40 : 30,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: -3 },
    elevation: 8,
    alignItems: 'center',
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
  visibilityOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 15,
  },
  visibilityOption: {
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    width: '45%',
  },
  selectedOption: {
    borderColor: '#4a90e2',
    backgroundColor: '#e6f0ff',
  },
  visibilityLabel: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
  },
  visibilityHint: {
    marginTop: 15,
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 20,
  },
});

export default CreatePost;