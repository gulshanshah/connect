import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from "../assets/config";
import io from 'socket.io-client';

type Message = {
  senderId: string;
  senderUsername: string;
  senderImage: string;
  text: string;
  createdAt: string;
};

const SOCKET_URL = BASE_URL;

const GroupChatScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { groupId, userId, groupImage } = route.params as {
    groupId: string;
    userId: string;
    groupImage: string;
  };

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [groupName, setGroupName] = useState('Group Chat');
  const [memberCount, setMemberCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('');
  const socketRef = useRef<any>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    AsyncStorage.getItem('user').then(stored => {
      if (stored) {
        const u = JSON.parse(stored);
        setProfilePicture(u.profileImage);
        setUsername(u.username);
      }
    });
  }, []);

  useEffect(() => {
    fetch(`${BASE_URL}api/groupChat/${groupId}/messages`)
      .then(res => res.json())
      .then(data => {
        setGroupName(data.groupName);
        setMemberCount(data.memberCount);
        const formatted = data.messages.map((msg: Message) => ({
          ...msg,
          createdAt: new Date(msg.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        }));
        setMessages(formatted);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [groupId]);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL);
    socketRef.current.emit('register', userId);

    socketRef.current.on(`groupMessage-${groupId}`, (data: any) => {
      const incoming: Message = {
        senderId: data.senderId,
        senderUsername: data.senderUsername,
        senderImage: data.senderImage,
        text: data.text,
        createdAt: new Date(data.createdAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages(prev => [...prev, incoming]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [groupId, userId]);

  const sendMessage = () => {
    if (!inputText.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msg = {
      senderId: userId,
      senderUsername: username,
      senderImage: profilePicture || 'https://picsum.photos/seed/you/40',
      text: inputText.trim(),
      createdAt: now,
    };

    setMessages(prev => [...prev, msg]);
    setInputText('');

    socketRef.current.emit('groupMessage', {
      groupId,
      ...msg,
      createdAt: new Date().toISOString(),
    });

    fetch(`${BASE_URL}api/groupChat/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ groupId, senderId: userId, text: msg.text }),
    }).catch(err => console.error('Send error', err));
  };

  const renderItem = ({ item, index }: { item: Message; index: number }) => {
    const showSender = index === 0 || messages[index - 1].senderId !== item.senderId;
    const isMe = item.senderId === userId;
    return (
      <View style={[styles.messageContainer, isMe ? styles.userMessage : styles.memberMessage]}>
        {showSender && (
          <View style={styles.senderContainer}>
            <Image source={{ uri: BASE_URL + item.senderImage }} style={styles.senderImage} />
            <Text style={styles.senderName}>{isMe ? 'You' : item.senderUsername}</Text>
          </View>
        )}
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.messageTime}>{item.createdAt}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent:'center', alignItems:'center' }]}>
        <ActivityIndicator size="large" color="#007aff" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <View style={styles.header}>
        <Image
          source={{ uri: groupImage.startsWith('http') ? groupImage : BASE_URL + groupImage }}
          style={styles.groupImage}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{groupName}</Text>
          <Text style={styles.headerSubtitle}>{memberCount} members</Text>
        </View>
        <View style={styles.headerCalls}>
          <TouchableOpacity onPress={() => navigation.navigate('AddUser', { groupId, userId })}>
            <Text style={styles.callIcon}>➕</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('GroupSettings', { groupId })}>
            <Text style={styles.callIcon}>♾️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(_, i) => i.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => {
                    flatListRef.current?.scrollToEnd({ animated: true });
                  }}
                  ListFooterComponent={<View style={{ height: 80 }} />}
      />

      <View style={styles.inputContainer}>
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          style={styles.input}
          placeholder="Type your message..."
          placeholderTextColor="#666"
          onFocus={() => {
            setTimeout(() => {
              flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
          }}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#f5f5f5' },
  header: {
    flexDirection:'row', alignItems:'center',
    backgroundColor:'#fff', padding:15,
    borderBottomWidth:1, borderBottomColor:'#eee',
  },
  groupImage: { width:40, height:40, borderRadius:20 },
  headerInfo: { flex:1, marginLeft:10 },
  headerName:{ fontSize:20,fontWeight:'bold',color:'#333' },
  headerSubtitle:{ fontSize:14,color:'gray' },
  headerCalls:{ flexDirection:'row',alignItems:'center' },
  callIcon:{ fontSize:24,marginLeft:25,color:'#007aff' },
  messagesList:{ padding:10,paddingBottom:80 },
  messageContainer:{ marginBottom:5,padding:10,borderRadius:10,maxWidth:'80%' },
  senderContainer:{ flexDirection:'row',alignItems:'center',marginBottom:5 },
  senderImage:{ width:30,height:30,borderRadius:15 },
  senderName:{ marginLeft:5,fontSize:12,fontWeight:'bold',color:'#555' },
  userMessage:{ alignSelf:'flex-end',backgroundColor:'#dcf8c6' },
  memberMessage:{ alignSelf:'flex-start',backgroundColor:'#fff' },
  messageText:{ fontSize:16,color:'#333' },
  messageTime:{ fontSize:10,color:'#666',marginTop:4,alignSelf:'flex-end' },
  inputContainer:{
    flexDirection:'row',padding:10,backgroundColor:'#fff',
    position:'absolute',bottom:0,left:0,right:0,
    borderTopWidth:1,borderTopColor:'#eee',alignItems:'center'
  },
  input:{
    flex:1,backgroundColor:'#f1f1f1',
    paddingHorizontal:15,paddingVertical:10,
    borderRadius:20,marginRight:10,fontSize:16,color:'#333'
  },
  sendButton:{
    backgroundColor:'#007aff',
    paddingHorizontal:15,paddingVertical:10,
    borderRadius:20
  },
  sendButtonText:{ color:'#fff',fontSize:16 }
});

export default GroupChatScreen;
