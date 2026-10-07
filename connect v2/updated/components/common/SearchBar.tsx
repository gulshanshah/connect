
import React from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <View style={styles.searchWrapper}>
      <Icon
        name="search"
        size={18}
        color="#666"
        style={styles.leftIcon}
      />
      <TextInput
        style={styles.searchInput}
        placeholder="Search..."
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={setSearchQuery}
        returnKeyType="search"
        accessible
        accessibilityLabel="Search input"
      />
      {searchQuery.length > 0 && (
        <Pressable
          onPress={() => setSearchQuery('')}
          style={styles.clearButton}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
        >
          <Icon name="times-circle" size={18} color="#666" />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchWrapper: {
    position: 'relative',
    marginVertical: 4,
    marginHorizontal: 12,
  },
  searchInput: {
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F2F2F2',
    paddingLeft: 46,
    paddingRight: 44,
    fontSize: 16,
    color: '#333',
    fontWeight: '400',
  },
  leftIcon: {
    position: 'absolute',
    top: 13,
    left: 16,
    zIndex: 10,
    elevation: 10,
  },
  clearButton: {
    position: 'absolute',
    top: 13,
    right: 14,
    zIndex: 10,
    elevation: 10,
  },
});

export default SearchBar;
