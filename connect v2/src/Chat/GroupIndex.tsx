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
import { useNavigation, useFocusEffect, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { io } from 'socket.io-client';
import { BASE_URL } from "../assets/config";

const socket = io(BASE_URL);

interface GroupItem {
  id: string;
  groupName: string;
  groupImage: string;
  lastMessage?: {
    senderUsername: string;
    senderId: string;
    text: string;
    time: string;
  };
}

const GroupIndexScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [groups, setGroups] = useState<GroupItem[]>([]);
  const [unseen, setUnseen] = useState<{ [groupId: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const userIdRef = useRef<string>('');

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('user');
        if (!raw) throw new Error('User missing');
        const user = JSON.parse(raw);
        userIdRef.current = user.id;

        const resp = await fetch(`${BASE_URL}api/groupChat/${user.id}`);
        const data = await resp.json();
        data.groups.sort((a: GroupItem, b: GroupItem) => {
          const ta = a.lastMessage ? new Date(a.lastMessage.time).getTime() : 0;
          const tb = b.lastMessage ? new Date(b.lastMessage.time).getTime() : 0;
          return tb - ta;
        });
        setGroups(data.groups);

        const rawCounts = await AsyncStorage.getItem(`group_unseen_${user.id}`);
        if (rawCounts) setUnseen(JSON.parse(rawCounts));

        data.groups.forEach((g: GroupItem) => {
          socket.emit('joinGroup', g.id);
        });
      } catch (err) {
        console.error('Init groups error:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    socket.onAny((event, payload) => {
      if (!isFocused) return;
      if (!event.startsWith('groupMessage-')) return;
      const groupId = event.split('-')[1];
      const { senderId } = payload as { senderId: string };
      if (senderId === userIdRef.current) return;

      setUnseen(prev => {
        const next = { ...prev, [groupId]: (prev[groupId] || 0) + 1 };
        AsyncStorage.setItem(`group_unseen_${userIdRef.current}`, JSON.stringify(next));
        return next;
      });
    });
    return () => {
      socket.offAny();
    };
  }, [isFocused]);

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const raw = await AsyncStorage.getItem(`group_unseen_${userIdRef.current}`);
        setUnseen(raw ? JSON.parse(raw) : {});
      })();
    }, [])
  );

  const handlePress = async (group: GroupItem) => {
    const next = { ...unseen, [group.id]: 0 };
    setUnseen(next);
    await AsyncStorage.setItem(`group_unseen_${userIdRef.current}`, JSON.stringify(next));

    navigation.navigate('GroupingScreen', {
      groupId: group.id,
      userId: userIdRef.current,
      groupImage: group.groupImage
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent:'center', alignItems:'center' }]}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  const renderItem = ({ item }: { item: GroupItem }) => {
    const count = unseen[item.id] || 0;
    const time = item.lastMessage
      ? new Date(item.lastMessage.time).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })
      : '';
    const preview = item.lastMessage
      ? `${item.lastMessage.senderUsername}: ${item.lastMessage.text}`
      : 'No messages yet';

    return (
      <TouchableOpacity style={styles.groupItem} onPress={() => handlePress(item)}>
        <Image source={{ uri: BASE_URL + item.groupImage }} style={styles.groupImage} />
        <View style={styles.groupDetails}>
          <View style={styles.groupHeader}>
            <Text style={styles.groupName}>{item.groupName}</Text>
            <Text style={styles.groupTime}>{time}</Text>
          </View>
          <Text
            style={[
              styles.groupMessage,
              count > 0 && { fontWeight: 'bold', color: '#000' }
            ]}
            numberOfLines={1}
          >
            {count > 0
              ? `New messages (${count})`
              : preview
            }
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={groups}
        keyExtractor={g => g.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#f5f5f5' },
  listContainer: { padding:10 },
  groupItem: {
    flexDirection:'row', alignItems:'center',
    backgroundColor:'#fff', padding:10, borderRadius:8, marginBottom:10
  },
  groupImage: { width:50, height:50, borderRadius:25 },
  groupDetails: { flex:1, marginLeft:10 },
  groupHeader: { flexDirection:'row', justifyContent:'space-between', marginBottom:5 },
  groupName: { fontSize:16, fontWeight:'bold', color:'#333' },
  groupTime: { fontSize:12, color:'gray' },
  groupMessage: { fontSize:14, color:'#666' },
});

export default GroupIndexScreen;
