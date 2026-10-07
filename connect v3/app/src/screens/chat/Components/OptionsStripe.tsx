import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const OptionsStripe = ({ options, selectedOption, setSelectedOption }) => {
  return (
    <View style={styles.optionsContainer}>
      {options.map(option => (
        <TouchableOpacity
          key={option}
          onPress={() => setSelectedOption(option)}
          style={[
            styles.optionButton,
            selectedOption === option && styles.optionButtonActive,
          ]}
        >
          <Text
            style={[
              styles.optionText,
              selectedOption === option && styles.optionTextActive,
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    marginLeft: 12,
    marginRight: 5,
  },
  optionButton: {
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginRight: 10,
  },
  optionButtonActive: {
    backgroundColor: '#888',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  optionTextActive: {
    color: '#fff',
  },
});

export default OptionsStripe;
