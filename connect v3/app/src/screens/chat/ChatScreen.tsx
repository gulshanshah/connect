import React, { useState } from 'react';
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import OptionsStripe from './Components/OptionsStripe';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../constants/ThemeContext';
import chatData from './data/ChatData';
import TimeAgo from '../../components/TimeAgo';
import SearchBar from '../search/components/SearchBar';

const ChatScreen = () => {
  const theme = useTheme();
  const options = ['All', 'Users', 'Groups', 'Clubs'];
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  const getCombinedList = () => {
    let filtered = chatData.filter(item => {
      if (selectedOption === 'All') return true;
      return item.type === selectedOption.slice(0, -1);
    });
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(q) ||
        item.lastMessage.toLowerCase().includes(q)
      );
    }
    return filtered.sort(
      (a, b) => new Date(b.time) - new Date(a.time)
    );
  };

  const renderItem = ({ item }) => {
    let itemStyle = styles.userItem;
    if (item.type === 'Group') itemStyle = styles.groupItem;
    if (item.type === 'Club') itemStyle = styles.clubItem;

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('Chatting', { chatId: item.id })}
        activeOpacity={0.8}
      >
        <View style={[styles.itemContainer, itemStyle]}>
        <TouchableOpacity>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: item.profilePic }} style={styles.profilePic} />
            {item.isOnline && <View style={styles.onlineDot} />}
          </View>
        </TouchableOpacity>

          <View style={styles.textContainer}>
            {}
            <Text style={[styles.name, item.unreadCount > 0 && styles.unreadTextBold]}>
  {item.name}
</Text>
            <Text style={[styles.message, item.unreadCount > 0 && styles.unreadTextBold]}>
            {item.lastMessage}
            </Text>
          </View>

          <View style={styles.rightContainer}>
            <TimeAgo dateString={item.time} style={styles.time} />
            {item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{item.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.headerRow}>
  <Text style={styles.chatstxt}>Chats</Text>
  <TouchableOpacity onPress={() => console.log('Three dots pressed')}>
    <Ionicons name="ellipsis-vertical" size={24} color="#333" />
  </TouchableOpacity>
</View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          style={styles.searchbar}
        />

        <OptionsStripe
          options={options}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
        />

        <FlatList
          data={getCombinedList()}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  headerRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 15,
},
  chatstxt: {
    fontSize: 26,
    fontWeight: '500',
    marginBottom: 10,
    color: '#333',
  },
  searchbar: {
    marginLeft: 12,
    marginRight: 12,
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#fff',
  },
  avatarContainer: {
    position: 'relative',
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 10,
    width: 15,
    height: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  message: {
    color: '#555',
    marginTop: 2,
  },
  rightContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  time: {
    color: '#888',
    fontSize: 12,
  },
  unreadBadge: {
    backgroundColor: '#ff3b30',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  unreadText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  unreadTextBold: {
  fontWeight: 'bold',
  color: '#000',
  },
  userItem: {
    backgroundColor: '#e6f7ff',
  },
  groupItem: {
    backgroundColor: '#e8f5e9',
  },
  clubItem: {
    backgroundColor: '#f3e5f5',
  },
});

export default ChatScreen;
