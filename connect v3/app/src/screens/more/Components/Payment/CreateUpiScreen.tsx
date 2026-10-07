import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateUpiScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const userObj = JSON.parse(storedUser);
          setUsername(userObj.username);
          setUserId(userObj._id || userObj.id);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
  
    fetchUsername();
  }, []);
  

  const generateUpiId = () => {
    const upi = `${username}@connecto`;
    setUpiId(upi);
    setModalVisible(true);
  };

  const saveUpiId = async () => {
    if (pin === confirmPin && pin.length === 6 && /^\d+$/.test(pin)) {
      try {
        const response = await fetch('http://192.168.73.246:5000/api/payment/addBankAccount', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userId,
            upiUsername: upiId,
            pin: pin,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          setModalVisible(false);
          Alert.alert("Success", "UPI ID and PIN saved successfully!");
        } else {
          Alert.alert("Error", data.message || "Something went wrong.");
        }
      } catch (error) {
        console.error("API Error:", error);
        Alert.alert("Network Error", "Unable to save UPI details.");
      }
    } else {
      Alert.alert("Invalid PIN", "PINs do not match or are not valid 6-digit numbers.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Your UPI ID</Text>

      <Text style={styles.description}>
        Create your unique UPI ID to start sending and receiving payments inside the app.
      </Text>

      <Text style={styles.warning}>
        ⚠️ This is a mock UPI system for learning purposes only.
      </Text>

      <TouchableOpacity style={styles.button} onPress={generateUpiId}>
        <Icon name="wallet-outline" size={20} color="#fff" />
        <Text style={styles.buttonText}>Create UPI ID</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Your UPI ID</Text>
            <Text style={styles.upiText}>{upiId}</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter 6-digit PIN"
              keyboardType="numeric"
              maxLength={6}
              secureTextEntry
              onChangeText={(text) => setPin(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm 6-digit PIN"
              keyboardType="numeric"
              maxLength={6}
              secureTextEntry
              onChangeText={(text) => setConfirmPin(text)}
            />

            <TouchableOpacity style={styles.saveButton} onPress={saveUpiId}>
              <Icon name="save-outline" size={20} color="#fff" />
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1, padding: 20, backgroundColor: '#fff',
  },
  title: {
    fontSize: 24, fontWeight: 'bold', marginBottom: 10,
  },
  description: {
    fontSize: 15, color: '#444', marginBottom: 15,
  },
  warning: {
    fontSize: 14, color: '#d9534f', marginBottom: 25,
    fontStyle: 'italic',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#4a90e2',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center', alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  upiText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 20,
    color: '#4a90e2',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    width: '100%',
    marginBottom: 15,
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: '#4a90e2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 10,
    width: '100%',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  closeText: {
    color: '#4a90e2',
    fontWeight: '500',
    marginTop: 10,
  },
});

export default CreateUpiScreen;