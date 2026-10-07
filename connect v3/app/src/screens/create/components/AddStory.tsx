import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  TextInput,
  Dimensions,
  ImageBackground,
  StatusBar,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import PhotoEditor from '../../../../../components/Editor';

const { width, height } = Dimensions.get('window');

const AddStory = ({ 
  isVisible, 
  onClose, 
  yourStory,
  onViewStory,
  onStoryAdded 
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [editedImage, setEditedImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [editorVisible, setEditorVisible] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setSelectedImage(null);
      setEditedImage(null);
      setCaption('');
      
      if (yourStory?.stories?.length > 0) {
        setShowOptionsModal(true);
      }
    }
  }, [isVisible, yourStory]);

  const handleCamera = () => {
    launchCamera({ mediaType: 'photo', quality: 0.8 }, (response) => {
      if (!response.didCancel && !response.error && response.assets?.length > 0) {
        setSelectedImage(response.assets[0].uri);
        setEditorVisible(true);
        setShowOptionsModal(false);
      }
    });
  };

  const handleGallery = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, (response) => {
      if (!response.didCancel && !response.error && response.assets?.length > 0) {
        setSelectedImage(response.assets[0].uri);
        setEditorVisible(true);
        setShowOptionsModal(false);
      }
    });
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setEditedImage(null);
  };

  const handlePost = () => {
    if (editedImage || selectedImage || caption.trim()) {
      onStoryAdded(editedImage || selectedImage, caption);
      onClose();
    }
  };

  const handleAddToStory = () => {
    setShowOptionsModal(false);
  };

  const handleViewStory = () => {
    onViewStory();
    onClose();
  };

  const handleEditorSave = (fileInfo) => {
    setEditedImage(fileInfo.uri);
    setEditorVisible(false);
  };

  const handleEditorClose = () => {
    setEditorVisible(false);
  };

  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      onRequestClose={onClose}
      transparent
    >
      {}
      {editorVisible && selectedImage && (
        <PhotoEditor 
          source={{ uri: selectedImage }} 
          onSave={handleEditorSave}
          onClose={handleEditorClose}
        />
      )}

      {}
      {!editorVisible && showOptionsModal && (
        <View style={styles.optionsModalContainer}>
          <View style={styles.optionsModalContent}>
            <TouchableOpacity 
              style={styles.optionButton}
              onPress={handleViewStory}
            >
              <Text style={styles.optionText}>View Story</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.optionButton}
              onPress={handleAddToStory}
            >
              <Text style={styles.optionText}>Add to Story</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={onClose}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {}
      {!editorVisible && !showOptionsModal && (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingContainer}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
        >
          <View style={styles.container}>
            <StatusBar backgroundColor="#fff" />
            <SafeAreaView style={styles.safeArea}>
              {}
              <View style={styles.header}>
                <View style={styles.profileInfo}>
                  <Image 
                    source={{ uri: 'https://picsum.photos/200' }} 
                    style={styles.profileImage} 
                  />
                  <View style={styles.profileText}>
                    <Text style={styles.name}>John Doe</Text>
                    <Text style={styles.username}>@johndoe</Text>
                  </View>
                </View>
                
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Icon name="close" size={28} color="black" />
                </TouchableOpacity>
              </View>

              {}
              <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
              >
                <View style={styles.content}>
                  {(editedImage || selectedImage) ? (
                    <ImageBackground
                      source={{ uri: editedImage || selectedImage }}
                      style={styles.imagePreview}
                    >
                      <View style={styles.previewActions}>
                        <TouchableOpacity 
                          style={styles.editButton} 
                          onPress={() => setEditorVisible(true)}
                        >
                          <Icon name="create-outline" size={24} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.removeButton} 
                          onPress={handleRemoveImage}
                        >
                          <Icon name="close-circle" size={24} color="white" />
                        </TouchableOpacity>
                      </View>
                    </ImageBackground>
                  ) : (
                    <View style={styles.mediaOptions}>
                      <Text style={styles.addMediaTitle}>Add to your story</Text>
                      <Text style={styles.addMediaSubtitle}>
                        Share a photo, moment, or write something
                      </Text>
                      
                      <View style={styles.mediaButtons}>
                        <TouchableOpacity 
                          style={styles.mediaButton} 
                          onPress={handleCamera}
                        >
                          <View style={styles.iconCircle}>
                            <Icon name="camera" size={32} color="#007AFF" />
                          </View>
                          <Text style={styles.mediaButtonText}>Camera</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                          style={styles.mediaButton} 
                          onPress={handleGallery}
                        >
                          <View style={styles.iconCircle}>
                            <Icon name="images" size={32} color="#007AFF" />
                          </View>
                          <Text style={styles.mediaButtonText}>Gallery</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                  
                  <TextInput
                    style={styles.captionInput}
                    placeholder="What's on your mind?"
                    placeholderTextColor="#888"
                    value={caption}
                    onChangeText={setCaption}
                    multiline
                    textAlignVertical="top"
                    numberOfLines={4}
                  />
                </View>
              </ScrollView>

              {}
              <View style={styles.footer}>
                <TouchableOpacity 
                  style={[
                    styles.postButton, 
                    (!editedImage && !selectedImage && !caption.trim()) && styles.disabledButton
                  ]}
                  onPress={handlePost}
                  disabled={!editedImage && !selectedImage && !caption.trim()}
                >
                  <Text style={styles.postButtonText}>Post to Story</Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </View>
        </KeyboardAvoidingView>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  optionsModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsModalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    width: '80%',
    overflow: 'hidden',
  },
  optionButton: {
    paddingVertical: 18,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  optionText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  cancelButton: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 18,
    fontWeight: '500',
    color: 'red',
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  profileText: {
    justifyContent: 'center',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#000',
  },
  username: {
    color: '#666',
    fontSize: 15,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  mediaOptions: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  addMediaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
    textAlign: 'center',
  },
  addMediaSubtitle: {
    fontSize: 17,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  mediaButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
  },
  mediaButton: {
    alignItems: 'center',
    width: '45%',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  mediaButtonText: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: '500',
  },
  imagePreview: {
    width: '100%',
    height: height * 0.5,
    borderRadius: 5,
    marginBottom: 20,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    overflow: 'hidden',
    borderWidth: 0.2,
    borderColor: '#000',
  },
  previewActions: {
    flexDirection: 'row',
    position: 'absolute',
    top: 10,
    right: 10,
  },
  editButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 5,
    margin: 5,
  },
  removeButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 5,
    margin: 5,
  },
  captionInput: {
    width: '100%',
    minHeight: 120,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 15,
    padding: 15,
    fontSize: 18,
    textAlignVertical: 'top',
    color: '#000',
    backgroundColor: '#fff',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  postButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#c0c0c0',
  },
  postButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddStory;