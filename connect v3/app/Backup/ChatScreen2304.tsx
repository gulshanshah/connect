import React, { useState } from 'react';
import { View, SafeAreaView, Text, StyleSheet } from 'react-native';
import OptionsStripe from './Components/OptionsStripe';
import { chatData } from './data/ChatData';
import UserList from './Components/UserList';
import GroupList from './Components/GroupList';
import ClubList from './Components/ClubList';

const ChatScreen = () => {
  const [searchText, setSearchText] = useState('');
  const options = ['All', 'Users', 'Groups', 'Clubs'];
  const [selectedOption, setSelectedOption] = useState(options[0]);

  return (
    <SafeAreaView style={styles.container}>
      {}
      <Text style={styles.chatstxt}>Chats</Text>

      {}
      <OptionsStripe
        options={options}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
      />

      {}
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Chat list will appear here…</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  chatstxt: {
    fontSize: 26,
    fontWeight: '500',
    marginBottom: 10,
    color: '#333',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#999',
  },
});

export default ChatScreen;
