import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  Image,
  Modal,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const MessageInput = ({
  text,
  setText,
  onSend,
  onMediaPick,
  onAudioRecord,
  onPauseRecording,
  onResumeRecording,
  onStopRecording,
  isRecording,
  isPaused = false,
  recordingDuration = 0,
  replyingTo,
  setReplyingTo,
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [voiceModalVisible, setVoiceModalVisible] = useState(false);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const pickImage = async (source) => {
    let res;
    try {
      const options = {
        mediaType: 'photo',
        quality: 0.8,
        includeBase64: false
      };

      if (source === 'camera') {
        res = await launchCamera(options);
      } else {
        res = await launchImageLibrary(options);
      }

      if (res.assets && res.assets.length) {
        setSelectedImage(res.assets[0]);
        setImageModalVisible(true);
      }
    } catch (error) {
      console.error('Image picker error:', error);
    } finally {
      setActionModalVisible(false);
    }
  };

  const sendImage = () => {
    if (selectedImage) {
      onMediaPick(selectedImage);
      setSelectedImage(null);
      setImageModalVisible(false);
    }
  };

  const handleSend = () => {
    if (text.trim()) {
      onSend(text, replyingTo?.id);
      setText('');
      setReplyingTo(null);
    }
  };

  const startVoiceRecording = () => {
    setActionModalVisible(false);
    setVoiceModalVisible(true);
    onAudioRecord();
  };

  const sendVoiceRecording = () => {
    onStopRecording();
    setVoiceModalVisible(false);
  };

  const cancelRecording = () => {
    onStopRecording(true);
    setVoiceModalVisible(false);
  };

  const togglePauseRecording = () => {
    if (isPaused) {
      onResumeRecording();
    } else {
      onPauseRecording();
    }
  };

  return (
    <View style={styles.container}>
      {}
      {replyingTo && (
        <View style={styles.replyPreviewBar}>
          <View style={styles.replyIndicator} />
          <View style={styles.replyPreviewContent}>
            <Text style={styles.replyPreviewName}>
              Replying to {replyingTo.sender}
            </Text>
            <Text numberOfLines={1} style={styles.replyPreviewText}>
              {replyingTo.content || 'Media'}
            </Text>
          </View>
          <TouchableOpacity onPress={() => setReplyingTo(null)} style={styles.cancelReplyButton}>
            <Icon name="close" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      )}

      {}
      <View style={styles.inputContainer}>
        <TouchableOpacity
          onPress={() => setActionModalVisible(true)}
          style={styles.mediaButton}
        >
          <Icon name="add" size={26} color="#fff" />
        </TouchableOpacity>

        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type a message..."
          placeholderTextColor="#888"
          style={styles.textInput}
          multiline
          maxLength={500}
          blurOnSubmit={false}
          returnKeyType="send"
          onSubmitEditing={handleSend}
        />

        <TouchableOpacity 
          onPress={handleSend} 
          style={[
            styles.sendButton, 
            !text.trim() && styles.disabledButton
          ]}
          disabled={!text.trim()}
        >
          <Icon name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {}
      <Modal
        animationType="fade"
        transparent
        visible={actionModalVisible}
        onRequestClose={() => setActionModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setActionModalVisible(false)}>
          <View style={styles.sourceModalContainer}>
            <Text style={styles.modalTitle}>Choose Action</Text>
            <View style={styles.sourceOptions}>
              <TouchableOpacity
                style={styles.sourceOption}
                onPress={() => pickImage('camera')}
              >
                <Icon name="photo-camera" size={30} color="#128C7E" />
                <Text style={styles.sourceText}>Camera</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.sourceOption}
                onPress={() => pickImage('gallery')}
              >
                <Icon name="photo-library" size={30} color="#128C7E" />
                <Text style={styles.sourceText}>Gallery</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.sourceOption}
                onPress={startVoiceRecording}
              >
                <Icon name="mic" size={30} color="#128C7E" />
                <Text style={styles.sourceText}>Audio</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>

      {}
      <Modal
        animationType="slide"
        transparent
        visible={imageModalVisible}
        onRequestClose={() => setImageModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setImageModalVisible(false)}>
          <View style={styles.imageModalContainer}>
            {selectedImage && (
              <Image
                source={{ uri: selectedImage.uri }}
                style={styles.previewImage}
                resizeMode="contain"
              />
            )}
            <View style={styles.imageActions}>
              <TouchableOpacity
                onPress={() => setImageModalVisible(false)}
                style={[styles.actionButton, styles.cancelButton]}
              >
                <Text style={styles.actionText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={sendImage}
                style={[styles.actionButton, styles.sendImageButton]}
              >
                <Text style={[styles.actionText, styles.sendText]}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>

      {}
      <Modal
        animationType="fade"
        transparent
        visible={voiceModalVisible}
        onRequestClose={cancelRecording}
      >
        <View style={styles.voiceModalOverlay}>
          <View style={styles.voiceModalContainer}>
            <Text style={styles.voiceTimer}>{formatDuration(recordingDuration)}</Text>
            
            <View style={styles.voiceControls}>
              <TouchableOpacity
                onPress={cancelRecording}
                style={styles.voiceActionButton}
              >
                <Icon name="close" size={30} color="#fff" />
                <Text style={styles.voiceButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={togglePauseRecording}
                style={styles.voiceActionButton}
              >
                <Icon 
                  name={isPaused ? "play-arrow" : "pause"} 
                  size={30} 
                  color="#fff" 
                />
                <Text style={styles.voiceButtonText}>
                  {isPaused ? "Resume" : "Pause"}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={sendVoiceRecording}
                style={styles.voiceActionButton}
              >
                <Icon name="send" size={30} color="#fff" />
                <Text style={styles.voiceButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.recordingText}>
              {isPaused ? "Recording paused" : "Recording..."}
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  replyPreviewBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  replyIndicator: {
    height: 30,
    width: 4,
    backgroundColor: '#128C7E',
    borderRadius: 2,
    marginRight: 10,
  },
  replyPreviewContent: {
    flex: 1,
  },
  replyPreviewName: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  replyPreviewText: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  cancelReplyButton: {
    marginLeft: 10,
    padding: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(238, 241, 241, 0.5)',
    paddingBottom: 15,
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    paddingHorizontal: 10,
    marginHorizontal: 8,
    fontSize: 16,
    color: '#333',
    paddingVertical: 10,
  },
  mediaButton: {
    padding: 6,
    backgroundColor: 'rgba(18, 140, 126, 0.8)',
    borderRadius: 20,
  },
  sendButton: {
    backgroundColor: '#128C7E',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sourceModalContainer: {
    backgroundColor: '#fff',
    padding: 25,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sourceOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  sourceOption: {
    alignItems: 'center',
    width: 90,
    padding: 10,
  },
  sourceText: {
    marginTop: 10,
    fontSize: 14,
    color: '#333',
  },
  imageModalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    borderRadius: 10,
    margin: 20,
  },
  previewImage: {
    width: '100%',
    height: 300,
    borderRadius: 10,
  },
  imageActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
  actionButton: {
    flex: 1,
    padding: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#cccccc',
  },
  sendImageButton: {
    backgroundColor: '#128C7E',
  },
  actionText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  voiceModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  voiceModalContainer: {
    backgroundColor: '#333',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginHorizontal: 30,
  },
  voiceTimer: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
  },
  voiceControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  voiceActionButton: {
    alignItems: 'center',
    padding: 10,
  },
  voiceButtonText: {
    color: '#fff',
    marginTop: 5,
    fontSize: 14,
  },
  recordingText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 10,
  },
});

export default MessageInput;