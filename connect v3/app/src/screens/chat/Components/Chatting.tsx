import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Modal,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

import { chatData } from './data/Data';
import ChatHeader from './chatting/ChatHeader';
import MessageInput from './chatting/MessageInput';
import MessageItem from './chatting/MessageItem';

const audioRecorderPlayer = new AudioRecorderPlayer();

const Chatting = () => {
  const [messages, setMessages] = useState([...chatData]);
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordSecs, setRecordSecs] = useState(0);
  const [replyingTo, setReplyingTo] = useState(null);
  const [showReactionModal, setShowReactionModal] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const recordingPath = useRef(null);
  const navigation = useNavigation();
  const flatListRef = useRef(null);

  const formatDateHeader = (date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const msgDate = new Date(date);

    if (msgDate.toDateString() === today.toDateString()) return 'Today';
    if (msgDate.toDateString() === yesterday.toDateString()) return 'Yesterday';
    
    const day = msgDate.getDate();
    const month = msgDate.toLocaleString('default', { month: 'short' });
    const year = msgDate.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const groupMessagesByDate = () => {
    const grouped = [];
    let lastDate = null;

    messages.forEach((msg) => {
      const dateStr = formatDateHeader(msg.time);

      if (dateStr !== lastDate) {
        grouped.push({
          id: `header-${msg.id}-${dateStr}`,
          type: 'header',
          date: dateStr,
        });
        lastDate = dateStr;
      }
      grouped.push(msg);
    });

    return grouped;
  };

  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = () => {
    if (!text.trim() && !replyingTo) return;
    
    const newMessage = {
      id: Date.now().toString(),
      type: 'text',
      content: text,
      isUser: true,
      time: new Date().toISOString(),
      status: 'sent',
      replyTo: replyingTo ? {
        id: replyingTo.id,
        content: replyingTo.content || (replyingTo.type === 'text' ? replyingTo.content : 'Media'),
        sender: replyingTo.isUser ? 'You' : 'Gulshan',
      } : null,
    };

    setMessages(prev => [...prev, newMessage]);
    setText('');
    setReplyingTo(null); 
    console.log("New Message: ", newMessage);
  };

  const handleMediaPick = async (asset) => {
    if (!asset || !asset.uri) return;
    
    const newMessage = {
      id: Date.now().toString(),
      type: 'image',
      uri: asset.uri,
      isUser: true,
      time: new Date().toISOString(),
      status: 'sent',
      replyTo: replyingTo ? {
        id: replyingTo.id,
        content: replyingTo.content || (replyingTo.type === 'text' ? replyingTo.content : 'Media'),
        sender: replyingTo.isUser ? 'You' : 'Gulshan',
      } : null,
    };

    setMessages(prev => [...prev, newMessage]);
    setReplyingTo(null);
     console.log("New Message: ", newMessage);
  };

  const handleMessageLongPress = (message, event) => {
    setSelectedMessage(message);
    
    event.target.measure((x, y, width, height, pageX, pageY) => {
      setPosition({
        x: pageX + 90,
        y: pageY - 50,
      });
      setShowReactionModal(true);
    });
  };


const handleReactionSelect = (emoji) => {
  if (!selectedMessage) return;
  
  setMessages(prev => prev.map(msg => {
    if (msg.id === selectedMessage.id) {
      if (msg.reaction === emoji) {
        return {
          ...msg,
          reaction: null
        };
      }
      
      return {
        ...msg,
        reaction: emoji
      };
    }
    return msg;
  }));
  
  setShowReactionModal(false);
};

const newMessage = {
  reaction: null,
};


  const handleReplySelect = () => {
    if (selectedMessage) {
      setReplyingTo(selectedMessage);
      setShowReactionModal(false);
    }
  };

  const startRecording = async () => {
    try {
      const uri = await audioRecorderPlayer.startRecorder();
      audioRecorderPlayer.addRecordBackListener((e) => {
        setRecordSecs(e.currentPosition);
      });
      setIsRecording(true);
      setIsPaused(false);
      recordingPath.current = uri;
    } catch (err) {
      setIsRecording(false);
      console.error('Recording start error:', err);
    }
  };

  const pauseRecording = async () => {
    try {
      await audioRecorderPlayer.pauseRecorder();
      setIsPaused(true);
    } catch (err) {
      console.error('Recording pause error:', err);
    }
  };

  const resumeRecording = async () => {
    try {
      await audioRecorderPlayer.resumeRecorder();
      setIsPaused(false);
    } catch (err) {
      console.error('Recording resume error:', err);
    }
  };

  const stopRecording = async (cancel = false) => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setIsRecording(false);
      setIsPaused(false);

      if (!cancel && recordSecs > 500) {
        const durationSeconds = Math.floor(recordSecs / 1000);
        const newMessage = {
          id: Date.now().toString(),
          type: 'audio',
          uri: result,
          isUser: true,
          time: new Date().toISOString(),
          status: 'sent',
          duration: `${Math.floor(durationSeconds / 60)}:${(durationSeconds % 60).toString().padStart(2, '0')}`,
          durationMs: recordSecs,
          replyTo: replyingTo ? {
            id: replyingTo.id,
            content: replyingTo.content || (replyingTo.type === 'text' ? replyingTo.content : 'Media'),
            sender: replyingTo.isUser ? 'You' : 'Gulshan',
          } : null,
        };
        setMessages(prev => [...prev, newMessage]);
        setReplyingTo(null);
         console.log("New Message: ", newMessage);
      }
      setRecordSecs(0);
    } catch (err) {
      setIsRecording(false);
      setIsPaused(false);
      console.error('Recording stop error:', err);
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
            ref={flatListRef}
            data={groupMessagesByDate()}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              if (item.type === 'header') {
                return (
                  <View style={styles.dateHeader}>
                    <Text style={styles.dateHeaderText}>{item.date}</Text>
                  </View>
                );
              }
              return (
                <MessageItem 
                  message={item} 
                  onReply={setReplyingTo}
                  onLongPress={handleMessageLongPress} 
                />
              );
            }}
            contentContainerStyle={styles.list}
          />
        </View>
        
        <MessageInput
          text={text}
          setText={setText}
          onSend={handleSend}
          onMediaPick={handleMediaPick}
          onAudioRecord={startRecording}
          onPauseRecording={pauseRecording}
          onResumeRecording={resumeRecording}
          onStopRecording={stopRecording}
          isRecording={isRecording}
          isPaused={isPaused}
          recordingDuration={Math.floor(recordSecs / 1000)}
          replyingTo={replyingTo}
          setReplyingTo={setReplyingTo}
        />
      </KeyboardAvoidingView>
      
      {}
      <Modal
        visible={showReactionModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowReactionModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => {
            setShowReactionModal(false);
            setShowMoreOptions(false);
          }}
        >
          <View style={[styles.reactionModal, { left: position.x - 100, top: position.y }]}>
            <TouchableOpacity onPress={() => handleReactionSelect('❤️')}>
              <Text style={styles.reactionEmoji}>❤️</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleReactionSelect('😂')}>
              <Text style={styles.reactionEmoji}>😂</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleReactionSelect('😮')}>
              <Text style={styles.reactionEmoji}>😮</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleReactionSelect('😢')}>
              <Text style={styles.reactionEmoji}>😢</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleReactionSelect('👍')}>
              <Text style={styles.reactionEmoji}>👍</Text>
            </TouchableOpacity>
           {}
            <TouchableOpacity onPress={() => setShowMoreOptions(prev => !prev)} style={styles.replyButton}>
              <Icon name="more-vert" size={24} color="#555" />
            </TouchableOpacity>
            {showMoreOptions && (
  <View style={styles.moreOptions}>
    <TouchableOpacity style={styles.optionItem} onPress={handleReplySelect}>
      <Icon name="reply" size={20} color="#555" style={styles.optionIcon} />
      <Text style={styles.optionText}>Reply</Text>
    </TouchableOpacity>
    
    <TouchableOpacity style={styles.optionItem} onPress={() => {}}>
      <Icon name="edit" size={20} color="#555" style={styles.optionIcon} />
      <Text style={styles.optionText}>Edit</Text>
    </TouchableOpacity>
    
    <TouchableOpacity style={styles.optionItem} onPress={() => {}}>
      <Icon name="delete-outline" size={20} color="#555" style={styles.optionIcon} />
      <Text style={styles.optionText}>Delete for Me</Text>
    </TouchableOpacity>
    
    <TouchableOpacity style={styles.optionItem} onPress={() => {}}>
      <Icon name="delete-forever" size={20} color="#d00" style={styles.optionIcon} />
      <Text style={styles.optionText}>Delete for Everyone</Text>
    </TouchableOpacity>
  </View>
)}

          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f0f0',
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
  dateHeader: {
    alignSelf: 'center',
    backgroundColor: '#E0E0E0',
    borderRadius: 15,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginVertical: 8,
  },
  dateHeaderText: {
    color: '#555',
    fontSize: 12,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  reactionModal: {
  position: 'absolute',
  flexDirection: 'row',
  backgroundColor: 'white',
  borderRadius: 25,
  paddingHorizontal: 12,
  paddingVertical: 6,
  maxWidth: '90%',
  alignSelf: 'center',
  top: -40,
  zIndex: 999,

  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 4,

  elevation: 5,
},

  reactionEmoji: {
    fontSize: 24,
    marginHorizontal: 4,
  },
  replyButton: {
    marginLeft: 8,
    justifyContent: 'center',
  },
  moreOptions: {
  position: 'absolute',
  top: 40,
  right: 0,
  backgroundColor: '#fff',
  borderRadius: 8,
  elevation: 5,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  paddingVertical: 4,
  minWidth: 180,
  zIndex: 999,
},

optionItem: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 10,
  paddingHorizontal: 16,
},

optionIcon: {
  marginRight: 10,
},

optionText: {
  fontSize: 16,
  color: '#333',
}

});

export default Chatting;