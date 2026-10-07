import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';

const PinScreen = ({ navigation }) => {
  const [pin, setPin] = useState('');

  const handlePinChange = (input) => {
    if (input.length <= 6) {
      setPin(input);
    }
  };

  const handleSubmit = () => {
    if (pin.length === 6) {
      Alert.alert('Success', 'PIN entered successfully!');
      navigation.navigate('Home');
    } else {
      Alert.alert('Error', 'Please enter a 4-digit PIN.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter your PIN</Text>
      <TextInput
        style={styles.pinInput}
        value={pin}
        onChangeText={handlePinChange}
        keyboardType="numeric"
        secureTextEntry
        maxLength={6}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  pinInput: {
    width: '80%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default PinScreen;
