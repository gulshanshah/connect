import React, { useRef, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { useNavigation } from '@react-navigation/native';

import { chatData } from './data/Data';
import ChatHeader from './chatting/ChatHeader';
import MessageInput from './chatting/MessageInput';
import MessageItem from './chatting/MessageItem';

const audioRecorderPlayer = new AudioRecorderPlayer();

const Chatting = () => {
  const [messages, setMessages] = useState(chatData);
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordSecs, setRecordSecs] = useState(0);
  const recordingPath = useRef(null);
  const navigation = useNavigation();

  const handleSend = () => {
    if (!text.trim()) return;
    const newMessage = {
      id: Date.now().toString(),
      type: 'text',
      content: text,
      isUser: true,
      timestamp: new Date().toISOString(),
      status: 'sent',
    };
    setMessages([newMessage, ...messages]);
    setText('');
  };

  const handleMediaPick = async (asset) => {
    if (!asset || !asset.uri) return;
    const newMessage = {
      id: Date.now().toString(),
      type: 'image',
      imageUri: asset.uri,
      isUser: true,
      timestamp: new Date().toISOString(),
      status: 'sent',
    };
    setMessages([newMessage, ...messages]);
  };

  const launchMediaPicker = () => {
    Alert.alert(
      'Send Photo',
      'Choose photo source',
      [
        {
          text: 'Camera',
          onPress: async () => {
            const res = await launchCamera({ mediaType: 'photo', quality: 0.8 });
            if (res.assets && res.assets.length) handleMediaPick(res.assets[0]);
          },
        },
        {
          text: 'Gallery',
          onPress: async () => {
            const res = await launchImageLibrary({ mediaType: 'photo', quality: 0.8 });
            if (res.assets && res.assets.length) handleMediaPick(res.assets[0]);
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const onAudioRecord = async () => {
    if (!isRecording) {
      try {
        const uri = await audioRecorderPlayer.startRecorder();
        audioRecorderPlayer.addRecordBackListener((e) => {
          setRecordSecs(e.currentPosition);
        });
        setIsRecording(true);
        recordingPath.current = uri;
      } catch (err) {
        setIsRecording(false);
      }
    } else {
      try {
        const uri = await audioRecorderPlayer.stopRecorder();
        audioRecorderPlayer.removeRecordBackListener();
        setIsRecording(false);

        if (recordSecs > 500) {
          const durationSeconds = Math.floor(recordSecs / 1000);
          const newMessage = {
            id: Date.now().toString(),
            type: 'audio',
            uri: uri,
            isUser: true,
            timestamp: new Date().toISOString(),
            status: 'sent',
          };
          setMessages([newMessage, ...messages]);
        }
        setRecordSecs(0);
      } catch (err) {
        setIsRecording(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <View style={styles.inner}>
        <ChatHeader
  title="Gulshan Kumar Shah"
  subtitle="Online"
  profilePic="https://picsum.photos/200/300"
  onBack={() => navigation.goBack()}
/>
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <MessageItem message={item} />}
            contentContainerStyle={styles.list}
            inverted
            keyboardShouldPersistTaps="handled"
          />
        </View>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View>
            <MessageInput
              text={text}
              setText={setText} ``
              onSend={handleSend}
              onMediaPick={launchMediaPicker}
              onAudioRecord={onAudioRecord}
              isRecording={isRecording}
            />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 8,
    paddingBottom: 2,
  },
});

export default Chatting;