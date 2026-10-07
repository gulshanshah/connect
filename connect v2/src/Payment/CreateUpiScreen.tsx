import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Modal
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const CreateUpiScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [upiId, setUpiId] = useState('');

  const generateUpiId = () => {
    const userName = 'student123';
    const randomSuffix = Math.floor(Math.random() * 10000);
    const upi = `${userName}${randomSuffix}@campusbank`;
    setUpiId(upi);
    setModalVisible(true);
  };

  const saveUpiId = () => {
    setModalVisible(false);
    alert("UPI ID Saved Successfully!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Your UPI ID</Text>

      <Text style={styles.description}>
        Create your unique UPI ID to start sending and receiving payments inside the app. 
        This UPI ID will be used for mock payments with your friends, splitting bills, and more.
      </Text>

      <Text style={styles.warning}>
        ⚠️ This is a mock UPI system for demonstration and learning purposes only.
        No real money is involved, and it does not connect to actual bank accounts or UPI services.
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
