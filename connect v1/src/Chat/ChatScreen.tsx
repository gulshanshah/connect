import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  StyleSheet,
  KeyboardAvoidingView, 
  Platform,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { BASE_URL } from "../assets/config";
import { io } from 'socket.io-client';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'otherUser';
  time: string;
};

const socket = io(BASE_URL);

const ChatScreen = () => {
  const route = useRoute();
  const { currentUserId, otherUser } = route.params || {};

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [apiMessage, setApiMessage] = useState('');

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    socket.emit('register', currentUserId);

    const fetchChatMessages = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${BASE_URL}api/privateChat/messages?currentUserId=${currentUserId}&otherUserId=${otherUser.id}`
        );
        const data = await response.json();
        if (data.message === "No chats available") {
          setApiMessage(data.message);
          setMessages([]);
        } else {
          const transformedMessages = data.messages.map((msg: any, index: number) => ({
            id: `${index}_${msg.createdAt}`,
            text: msg.text,
            sender: msg.sender === currentUserId ? 'user' : 'otherUser',
            time: new Date(msg.createdAt).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit', 
              hour12: true 
            })
          }));
          setMessages(transformedMessages);
          setApiMessage('');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setApiMessage('Error loading messages');
      } finally {
        setLoading(false);
      }
    };

    fetchChatMessages();

    socket.on('privateMessage', (data: any) => {
      if (data.senderId === otherUser.id) {
        const incomingMessage: Message = {
          id: data.id || Date.now().toString(),
          text: data.message,
          sender: 'otherUser',
          time: new Date().toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: true 
          })
        };
        setMessages(prev => [...prev, incomingMessage]);
      }
    });

    return () => {
      socket.off('privateMessage');
    };
  }, [currentUserId, otherUser]);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
      })
    };

    setMessages(prev => [...prev, newMessage]);

    try {
      const response = await fetch(`${BASE_URL}api/privateChat/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentUserId,
          otherUserId: otherUser.id,
          text: inputText
        })
      });

      const data = await response.json();
      if (response.ok) {
        socket.emit('privateMessage', {
          senderId: currentUserId,
          receiverId: otherUser.id,
          message: inputText,
          id: newMessage.id
        });
      } else {
        console.error("Error sending message:", data.message);
      }
    } catch (err) {
      console.error("Send message error:", err);
    }
    
    setInputText('');
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer, 
      item.sender === 'user' ? styles.userMessage : styles.otherUserMessage
    ]}>
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.timeStamp}>{item.time}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007aff" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 60}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image 
            source={{ uri: BASE_URL + otherUser.profileImage }} 
            style={styles.profileImage}
          />
          <Text style={styles.headerName}>{otherUser.username}</Text>
        </View>
      </View>

      {messages.length === 0 ? (
        <View style={styles.noChatsContainer}>
          <Text style={styles.noChatsText}>{apiMessage || "No chats available"}</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }}
          ListFooterComponent={<View style={{ height: 80 }} />}
        />
      )}

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
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    backgroundColor: '#fff',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  profileImage: { width: 40, height: 40, borderRadius: 20 },
  headerName: { marginLeft: 10, fontSize: 20, fontWeight: 'bold', color: '#333' },
  messagesList: { padding: 10 },
  noChatsContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  noChatsText: { fontSize: 16, color: '#666' },
  messageContainer: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  userMessage: { alignSelf: 'flex-end', backgroundColor: '#dcf8c6' },
  otherUserMessage: { alignSelf: 'flex-start', backgroundColor: '#fff' },
  messageText: { fontSize: 16, color: '#333' },
  timeStamp: { fontSize: 12, marginTop: 4, color: '#666' },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    fontSize: 16,
    color: '#333',
  },
  sendButton: { 
    backgroundColor: '#007aff', 
    paddingHorizontal: 15, 
    paddingVertical: 10, 
    borderRadius: 20 
  },
  sendButtonText: { color: '#fff', fontSize: 16 },
});

export default ChatScreen;