import React, { useState, useCallback, useMemo } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  FlatList,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  View,
  ActivityIndicator
} from 'react-native';
import SearchBar from './components/SearchBar';
import { useTheme } from '../../constants/ThemeContext';

const OPTIONS = ['All', 'User', 'Institute', 'Post', 'Club', 'Event', 'Place'];

const OptionItem = React.memo(({ option, selected, onPress }) => {
  const theme = useTheme();
  
  return (
    <Pressable
      onPress={() => onPress(option)}
      style={({ pressed }) => [
        styles.optionContainer,
        { 
          backgroundColor: selected ? theme.primary : 'transparent',
          borderColor: theme.border,
          opacity: pressed ? 0.7 : 1,
        }
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      <Text style={[
        styles.optionText, 
        { color: selected ? theme.onPrimary : theme.text },
        selected && styles.optionTextSelected
      ]}>
        {option}
      </Text>
    </Pressable>
  );
});

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOption, setSelectedOption] = useState(OPTIONS[0]);
  const [isSearching, setIsSearching] = useState(false);
  const theme = useTheme();
  
  const memoizedOptions = useMemo(() => OPTIONS, []);
  
  const handleOptionSelect = useCallback((option) => {
    setSelectedOption(option);
  }, []);
  
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    
    if (query.length > 0) {
      setIsSearching(true);
      setTimeout(() => setIsSearching(false), 800);
    }
  }, []);

  const renderContent = () => {
    if (isSearching) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      );
    }
    
    if (searchQuery.length > 0 && !isSearching) {
      return (
        <View style={styles.centerContainer}>
          <Text style={[styles.emptyText, { color: theme.text }]}>
            No results found for "{searchQuery}"
          </Text>
        </View>
      );
    }
    
    return (
      <View style={styles.centerContainer}>
        <Text style={[styles.emptyText, { color: theme.text }]}>
          Search for users, posts, events, and more
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inner}
        keyboardVerticalOffset={Platform.select({ ios: 90, android: 0 })}
      >
        <View style={styles.header}>
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={handleSearch}
          />
          
          <FlatList
            data={memoizedOptions}
            horizontal
            keyExtractor={(item) => item}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.optionsList}
            renderItem={({ item }) => (
              <OptionItem
                option={item}
                selected={item === selectedOption}
                onPress={handleOptionSelect}
              />
            )}
          />
        </View>
        
        {renderContent()}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  inner: { 
    flex: 1,
    paddingTop: 10,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionsList: { 
    paddingVertical: 12,
  },
  optionContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 20,
    justifyContent: 'center',
    borderWidth: 1,
  },
  optionText: { 
    fontSize: 14,
    fontWeight: '500',
  },
  optionTextSelected: {
    fontWeight: '600',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});