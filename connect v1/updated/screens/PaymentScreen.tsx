import React, { useState, useRef, useEffect } from 'react';
import {
  PermissionsAndroid,
  Platform,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView
} from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';
import uuid from 'react-native-uuid';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;
  const [isRecording, setIsRecording] = useState(false);
  const waveAnim = useRef(new Animated.Value(0)).current;
  const videoRef = useRef(null);

  useEffect(() => {
    setMessages([
      { _id: uuid.v4(), text: 'Hey! How are you?', createdAt: new Date(), user: { _id: 2 } },
      { _id: uuid.v4(), image: 'https://placekitten.com/300/300', createdAt: new Date(), user: { _id: 1 } },
      { _id: uuid.v4(), video: 'https://www.w3schools.com/html/mov_bbb.mp4', createdAt: new Date(), user: { _id: 2 } },
      { _id: uuid.v4(), audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', createdAt: new Date(), user: { _id: 1 } },
    ]);
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.CAMERA
      ]);
    }
  };

  const startWaveAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(waveAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
      ])
    ).start();
  };

  const onSend = (newMessages = []) => {
    setMessages(prev => GiftedChat.append(prev, newMessages));
  };

  const renderBubble = props => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: { backgroundColor: '#0084ff' },
        left: { backgroundColor: '#e6e6e6' }
      }}
      textStyle={{
        right: { color: '#fff' },
        left: { color: '#000' }
      }}
    />
  );

  const renderMessageVideo = props => (
    <TouchableOpacity
      onPress={() => videoRef.current?.presentFullscreenPlayer()}
      style={styles.mediaContainer}
    >
      <Video
        ref={videoRef}
        source={{ uri: props.currentMessage.video }}
        style={styles.video}
        controls
        resizeMode="cover"
        paused
      />
      <Icon name="play-arrow" size={40} color="#fff" style={styles.playIcon} />
    </TouchableOpacity>
  );

  const renderMessageAudio = props => (
    <View style={styles.audioContainer}>
      <TouchableOpacity onPress={() => audioRecorderPlayer.startPlayer(props.currentMessage.audio)}>
        <Icon name="play-circle-filled" size={40} color="#0084ff" />
      </TouchableOpacity>
      <Animated.View style={[styles.waveform, { transform: [{ scale: waveAnim }] }]} />
    </View>
  );

  const handlePayment = () => {
    alert('Payment feature coming soon!');
  };

  const startRecording = async () => {
    await requestPermissions();
    startWaveAnimation();
    await audioRecorderPlayer.startRecorder();
    setIsRecording(true);
  };

  const stopRecording = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    waveAnim.stopAnimation();
    setIsRecording(false);
    onSend([{ _id: uuid.v4(), audio: result, createdAt: new Date(), user: { _id: 1 } }]);
  };

  const renderInputToolbar = props => (
    <View style={styles.inputContainer}>
      <TouchableOpacity
        onPress={isRecording ? stopRecording : startRecording}
        style={[styles.recordButton, isRecording && { backgroundColor: '#c00' }]}
      >
        <Animated.View style={{ transform: [{ scale: waveAnim }] }}>
          <Icon name={isRecording ? 'stop' : 'mic'} size={28} color="#fff" />
        </Animated.View>
      </TouchableOpacity>
      <View style={styles.composer}>
        <TextInput
          value={props.text}
          onChangeText={props.onInputTextChanged}
          style={styles.input}
          placeholder="Type a message"
          placeholderTextColor="#999"
        />
      </View>
      <TouchableOpacity onPress={handlePayment}>
        <Icon name="attach-money" size={28} color="#666" style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => props.onSend({ text: props.text, user: { _id: 1 }, createdAt: new Date(), _id: uuid.v4() }, true)}
      >
        <Icon name="send" size={28} color="#0084ff" style={styles.icon} />
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{ _id: 1 }}
        renderBubble={renderBubble}
        renderMessageVideo={renderMessageVideo}
        renderMessageAudio={renderMessageAudio}
        renderInputToolbar={renderInputToolbar}
        alwaysShowSend
        scrollToBottom
        scrollToBottomComponent={() => <Icon name="arrow-downward" size={24} color="#0084ff" />}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  mediaContainer: { margin: 8, borderRadius: 12, overflow: 'hidden' },
  video: { width: 250, height: 200 },
  playIcon: { position: 'absolute', top: '45%', left: '45%' },
  audioContainer: { flexDirection: 'row', alignItems: 'center', margin: 8 },
  waveform: { flex: 1, height: 20, backgroundColor: '#e6e6e6', borderRadius: 10, marginLeft: 8 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 8, backgroundColor: '#f5f5f5' },
  icon: { marginHorizontal: 4 },
  recordButton: { backgroundColor: '#f44336', borderRadius: 20, padding: 8, marginHorizontal: 4 },
  composer: { flex: 1, marginHorizontal: 8 },
  input: { backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 16, height: 40 }
});

export default ChatScreen;
