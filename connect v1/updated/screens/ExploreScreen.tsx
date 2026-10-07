import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import SearchBar from '../components/common/SearchBar';

const ChatScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const options = ['All', 'Users', 'Groups', 'Clubs'];
  const [selectedOption, setSelectedOption] = useState(options[0]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.chatstxt}>Chats</Text>

      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <View style={styles.optionsContainer}>
        {options.map(option => (
          <TouchableOpacity
            key={option}
            onPress={() => setSelectedOption(option)}
            style={[
              styles.optionButton,
              selectedOption === option && styles.optionButtonActive
            ]}
          >
            <Text
              style={[
                styles.optionText,
                selectedOption === option && styles.optionTextActive
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.placeholder}>
        <Text style={{ color: '#999' }}>Chat list will appear here…</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 10,
  },
  chatstxt: {
    fontSize: 26,
    fontWeight: '500',
    marginLeft: 20,
    marginBottom: 5,
    marginTop: 10
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: 8,
    backgroundColor: '#fff',
    marginLeft: 20,
  },
  optionButton: {
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  optionButtonActive: {
    backgroundColor: '#CACCCB',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  optionTextActive: {
    color: '#fff',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ChatScreen;
