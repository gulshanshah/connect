import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  PermissionsAndroid,
  Alert,
  Platform,
} from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary } from 'react-native-image-picker';

const audioRecorderPlayer = new AudioRecorderPlayer();

const ChatScreen = () => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      type: 'text',
      content: 'Hey! Check out this new feature 🚀',
      isUser: false,
      time: '09:30',
      status: 'delivered',
      name: 'John',
    },
    {
      id: '2',
      type: 'image',
      uri: 'https://picsum.photos/seed/default/50',
      isUser: true,
      time: '09:31',
      status: 'seen',
    },
    {
      id: '3',
      type: 'video',
      uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      isUser: false,
      time: '09:32',
      name: 'Sarah',
      thumbnail: 'https://peach.blender.org/wp-content/uploads/bbb-splash.png',
    },
    {
      id: '4',
      type: 'audio',
      uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      isUser: true,
      time: '09:33',
      status: 'sent',
      duration: '03:45',
    },
    {
      id: '5',
      type: 'text',
      content: 'Wow, that video looks amazing! 😍',
      isUser: true,
      time: '09:34',
      status: 'seen',
    },
  ]);
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [currentAudioTime, setCurrentAudioTime] = useState('00:00');
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const videoRefs = useRef({});
  const recordingPath = useRef('');

  useEffect(() => {
    return () => {
      audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();
    };
  }, []);

  const requestPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);
      return (
        granted['android.permission.RECORD_AUDIO'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.READ_EXTERNAL_STORAGE'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.WRITE_EXTERNAL_STORAGE'] ===
          PermissionsAndroid.RESULTS.GRANTED
      );
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const handleAudioRecord = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    if (isRecording) {
      try {
        const result = await audioRecorderPlayer.stopRecorder();
        setIsRecording(false);
        audioRecorderPlayer.removeRecordBackListener();
        
        const newMessage = {
          id: Date.now().toString(),
          type: 'audio',
          uri: result,
          isUser: true,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          duration: currentAudioTime,
          status: 'sent',
        };
        setMessages(prev => [newMessage, ...prev]);
      } catch (err) {
        Alert.alert('Error', 'Failed to stop recording');
      }
    } else {
      try {
        recordingPath.current = await audioRecorderPlayer.startRecorder();
        setIsRecording(true);
        
        audioRecorderPlayer.addRecordBackListener((e) => {
          setCurrentAudioTime(audioRecorderPlayer.mmssss(Math.floor(e.current_position)));
        });
      } catch (err) {
        Alert.alert('Error', 'Failed to start recording');
      }
    }
  };

  const handleAudioPlay = async (item) => {
    if (playingAudioId === item.id) {
      await audioRecorderPlayer.stopPlayer();
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(item.id);
      await audioRecorderPlayer.startPlayer(item.uri);
      
      audioRecorderPlayer.addPlayBackListener((e) => {
        if (e.current_position >= e.duration) {
          setPlayingAudioId(null);
          audioRecorderPlayer.stopPlayer();
        }
        setCurrentAudioTime(audioRecorderPlayer.mmssss(Math.floor(e.current_position)));
      });
    }
  };

  const handleSendText = () => {
    if (!text.trim()) return;
    const newMessage = {
      id: Date.now().toString(),
      type: 'text',
      content: text,
      isUser: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    };
    setMessages(prev => [newMessage, ...prev]);
    setText('');
  };

  const handleMediaPick = async () => {
    const result = await launchImageLibrary({
      mediaType: 'mixed',
      quality: 0.8,
      includeExtra: true,
    });

    if (result.didCancel || !result.assets?.[0]) return;

    const file = result.assets[0];
    const newMessage = {
      id: Date.now().toString(),
      type: file.type?.startsWith('video') ? 'video' : 'image',
      uri: file.uri,
      isUser: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
      ...(file.type?.startsWith('video') && { thumbnail: file.uri }),
    };
    setMessages(prev => [newMessage, ...prev]);
  };

  const renderMessage = ({ item }) => {
    const isUser = item.isUser;
    const timeComponent = (
      <View style={styles.timeContainer}>
        {item.status && isUser && (
          <Icon 
            name={item.status === 'seen' ? 'done-all' : 'done'}
            size={12}
            color={item.status === 'seen' ? '#007bff' : '#666'}
            style={styles.statusIcon}
          />
        )}
        <Text style={styles.timeText}>{item.time}</Text>
      </View>
    );

    return (
      <View style={[styles.messageContainer, isUser && styles.userMessageContainer]}>
        {item.name && !isUser && <Text style={styles.senderName}>{item.name}</Text>}
        {renderMessageContent(item)}
        {timeComponent}
      </View>
    );
  };

  const renderMessageContent = (item) => {
    switch (item.type) {
      case 'text':
        return (
          <Text style={[styles.textMessage, item.isUser && styles.userTextMessage]}>
            {item.content}
          </Text>
        );

      case 'image':
        return (
          <TouchableOpacity activeOpacity={0.8}>
            <Image 
              source={{ uri: item.uri }} 
              style={styles.image}
              resizeMode="cover"
            />
          </TouchableOpacity>
        );

      case 'video':
        return (
          <TouchableOpacity
            onPress={() => videoRefs.current[item.id]?.presentFullscreenPlayer()}
            activeOpacity={0.8}
          >
            <Video
              ref={(ref) => (videoRefs.current[item.id] = ref)}
              source={{ uri: item.uri }}
              style={styles.video}
              resizeMode="cover"
              controls={false}
              paused={true}
              posterResizeMode="contain"
            />
            <Icon name="play-circle-filled" size={50} style={styles.videoPlayButton} />
            <View style={styles.videoDuration}>
              <Text style={styles.videoDurationText}>2:45</Text>
            </View>
          </TouchableOpacity>
        );

      case 'audio':
        return (
          <TouchableOpacity
            onPress={() => handleAudioPlay(item)}
            style={[styles.audioContainer, item.isUser && styles.userAudioContainer]}
            activeOpacity={0.8}
          >
            <Icon
              name={playingAudioId === item.id ? 'pause' : 'play-arrow'}
              size={24}
              color={item.isUser ? '#fff' : '#007bff'}
            />
            <View style={styles.audioProgress}>
              <View style={[
                styles.audioProgressBar,
                { width: `${(currentAudioTime / item.duration) * 100}%` }
              ]} />
            </View>
            <Text style={[styles.audioTime, item.isUser && styles.userAudioTime]}>
              {playingAudioId === item.id ? currentAudioTime : item.duration}
            </Text>
          </TouchableOpacity>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Team Chat</Text>
        <Text style={styles.headerSubtitle}>3 members online</Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.listContent}
        inverted
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.inputContainer}>
        <TouchableOpacity 
          onPress={handleMediaPick}
          style={styles.mediaButton}
        >
          <Icon name="image" size={26} color="green" />
        </TouchableOpacity>

        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type a message..."
          placeholderTextColor="#888"
          style={styles.textInput}
          multiline
          maxLength={500}
        />

        {text ? (
          <TouchableOpacity onPress={handleSendText} style={styles.sendButton}>
            <Icon name="send" size={20} color="#fff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            onPress={handleAudioRecord}
            onLongPress={handleAudioRecord}
            style={[styles.recordButton, isRecording && styles.recording]}
            delayLongPress={300}
          >
            {isRecording ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Icon name="mic" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12345',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  messageContainer: {
    maxWidth: '80%',
    marginVertical: 8,
    alignSelf: 'flex-start',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  textMessage: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  userTextMessage: {
    backgroundColor: 'green',
    color: '#fff',
    borderBottomRightRadius: 4,
    borderBottomLeftRadius: 16,
  },
  image: {
    width: 240,
    height: 160,
    borderRadius: 12,
    marginVertical: 4,
  },
  video: {
    width: 240,
    height: 160,
    borderRadius: 12,
    backgroundColor: '#000',
  },
  videoPlayButton: {
    position: 'absolute',
    alignSelf: 'center',
    top: '30%',
    color: 'rgba(255,255,255,0.9)',
  },
  videoDuration: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  videoDurationText: {
    color: '#fff',
    fontSize: 12,
  },
  audioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 25,
    minWidth: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  userAudioContainer: {
    backgroundColor: 'green',
  },
  audioProgress: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginHorizontal: 8,
    borderRadius: 2,
    overflow: 'hidden',
  },
  audioProgressBar: {
    height: '100%',
    backgroundColor: 'green',
  },
  audioTime: {
    fontSize: 12,
    color: '#666',
  },
  userAudioTime: {
    color: 'rgba(255,255,255,0.8)',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  timeText: {
    fontSize: 10,
    color: '#666',
  },
  statusIcon: {
    marginRight: 4,
  },
  senderName: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    paddingHorizontal: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    marginHorizontal: 8,
    fontSize: 16,
    color: '#333',
    paddingTop: Platform.OS === 'android' ? 8 : 10,
  },
  mediaButton: {
    padding: 8,
  },
  sendButton: {
    backgroundColor: 'green',
    borderRadius: 20,
    padding: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButton: {
    backgroundColor: 'green',
    borderRadius: 20,
    padding: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recording: {
    backgroundColor: '#dc3545',
  },
});

export default ChatScreen;