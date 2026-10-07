import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  FlatList,
  Pressable,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import SearchBar from './components/SearchBar';
import { useTheme } from '../../constants/ThemeContext';

const OPTIONS = ['All', 'User', 'Institute', 'Post', 'Club', 'Event', 'Place'];

const OptionItem = ({ option, selected, onPress }) => (
  <Pressable
    onPress={() => onPress(option)}
    style={({ pressed }) => [
      styles.optionContainer,
      selected && styles.optionSelected,
      pressed && styles.optionPressed
    ]}
    accessibilityRole="button"
    accessibilityState={{ selected }}
  >
    <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
      {option}
    </Text>
  </Pressable>
);

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOption, setSelectedOption] = useState(OPTIONS[0]);
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.inner}
      >
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {}
        <FlatList
          data={OPTIONS}
          horizontal
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.optionsList}
          renderItem={({ item }) => (
            <OptionItem
              option={item}
              selected={item === selectedOption}
              onPress={setSelectedOption}
            />
          )}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F2F6' },
  inner: { 
    paddingTop: 10,
  },
  optionsList: { paddingVertical: 10 },
  optionContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 2,
    borderRadius: 20,
    justifyContent: 'center',
    marginLeft: 10,
  },
  optionText: { fontSize: 14, color: '#333', fontWeight: '500' },
  optionSelected: { backgroundColor: '#888' },
  optionTextSelected: { color: '#fff' },
  optionPressed: { opacity: 0.6 },
});
