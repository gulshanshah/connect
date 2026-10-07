import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import {
  useNavigation,
  useFocusEffect,
  useIsFocused
} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { io } from 'socket.io-client';
import { BASE_URL } from '../assets/config';

const socket = io(BASE_URL);

interface ChatItem {
  id: string;
  otherUser: { id: string; username: string; profileImage: string };
  lastMessage: { text: string; createdAt: string };
}

const ChatIndexScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [unseen, setUnseen] = useState<{ [chatId: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const currentUserId = useRef<string>('');

  useEffect(() => {
    (async () => {
      try {
        const rawUser = await AsyncStorage.getItem('user');
        if (!rawUser) throw new Error('User missing');
        const user = JSON.parse(rawUser);
        currentUserId.current = user.id;

        socket.emit('register', user.id);

        const resp = await fetch(`${BASE_URL}api/privateChat/?userId=${user.id}`);
        const data: ChatItem[] = await resp.json();
        setChats(data);

        const rawCounts = await AsyncStorage.getItem(`unseen_${user.id}`);
        if (rawCounts) setUnseen(JSON.parse(rawCounts));
      } catch (err) {
        console.error('Init error:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    socket.on('privateMessage', async ({ senderId }) => {
      if (!isFocused) return;

      const me = currentUserId.current;
      if (!me || senderId === me) return;

      const chatId = [me, senderId].sort().join('_');
      setUnseen(prev => {
        const next = { ...prev, [chatId]: (prev[chatId] || 0) + 1 };
        AsyncStorage.setItem(`unseen_${me}`, JSON.stringify(next));
        return next;
      });
    });

    return () => {
      socket.off('privateMessage');
    };
  }, [isFocused]);

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const me = currentUserId.current;
        if (!me) return;
        const raw = await AsyncStorage.getItem(`unseen_${me}`);
        setUnseen(raw ? JSON.parse(raw) : {});
      })();
    }, [])
  );

  const handlePress = async (item: ChatItem) => {
    const me = currentUserId.current;
    const chatId = [me, item.otherUser.id].sort().join('_');

    const next = { ...unseen, [chatId]: 0 };
    setUnseen(next);
    await AsyncStorage.setItem(`unseen_${me}`, JSON.stringify(next));

    navigation.navigate('ChattingScreen', {
      chatId,
      currentUserId: me,
      otherUser: item.otherUser
    });
  };

  const formatTime = (ts: string) =>
    new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const renderItem = ({ item }: { item: ChatItem }) => {
    const me = currentUserId.current;
    const chatId = [me, item.otherUser.id].sort().join('_');
    const count = unseen[chatId] || 0;

    return (
      <TouchableOpacity style={styles.chatItem} onPress={() => handlePress(item)}>
        <Image
          source={{ uri: BASE_URL + item.otherUser.profileImage }}
          style={styles.profileImage}
        />
        <View style={styles.chatDetails}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatName}>{item.otherUser.username}</Text>
            <Text style={styles.chatTime}>{formatTime(item.lastMessage.createdAt)}</Text>
          </View>
          {count > 0 ? (
            <Text style={[styles.chatMessage, { fontWeight: 'bold', color: '#000' }]}>
              New message ({count})
            </Text>
          ) : (
            <Text style={styles.chatMessage} numberOfLines={1}>
              {item.lastMessage.text}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        keyExtractor={i => i.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.noChatsText}>No conversations</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  listContainer: { padding: 10 },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 5
  },
  profileImage: { width: 50, height: 50, borderRadius: 25 },
  chatDetails: { flex: 1, marginLeft: 10 },
  chatHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  chatName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  chatTime: { fontSize: 12, color: 'gray' },
  chatMessage: { fontSize: 14, color: '#666' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  noChatsText: { textAlign: 'center', marginTop: 20, color: '#666', fontSize: 16 }
});

export default ChatIndexScreen;
