import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function AmountScreen({ route }) {
  const { upiId } = route.params;
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const inputRef = useRef(null);
  const pinRef = useRef(null);

  const handlePayPress = () => {
    if (amount && parseInt(amount, 10) > 0) {
      setModalVisible(true);
      setPin('');
      setTimeout(() => pinRef.current?.focus(), 100);
    } else {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
    }
  };

  const handleConfirmPin = () => {
    if (pin.length < 6) {
      Alert.alert('Invalid PIN', 'PIN must be 6 digits');
      return;
    }
    setModalVisible(false);
    Alert.alert('Payment Authorized', `₹${amount} will be sent from UPI ID ${upiId}`);
  };

  return (
    <>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <Icon name="payment" size={80} color="#FF9800" style={styles.icon} />
            <Text style={styles.title}>Payment for UPI ID</Text>
            <Text style={styles.upi}>{upiId}</Text>

            <View style={styles.amountContainer}>
              <Text style={styles.label}>Amount: ₹</Text>
              <TextInput
                ref={inputRef}
                style={styles.input}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                placeholder="Enter amount"
                placeholderTextColor="#aaa"
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={handlePayPress}>
              <Text style={styles.buttonText}>Pay</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalBackdrop} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Enter UPI PIN</Text>
          <TextInput
            ref={pinRef}
            style={styles.pinInput}
            keyboardType="numeric"
            secureTextEntry
            maxLength={6}
            value={pin}
            onChangeText={setPin}
            placeholder="••••••"
            placeholderTextColor="#999"
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.confirmButton]}
              onPress={handleConfirmPin}
            >
              <Text style={styles.modalButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  icon: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  upi: { fontSize: 18, fontWeight: '500', color: '#222', marginBottom: 30 },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    width: '100%',
  },
  label: { fontSize: 18, color: '#666', marginRight: 8 },
  input: {
    flex: 1,
    fontSize: 18,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    color: '#000',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#FF9800',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  buttonText: { color: 'white', fontSize: 18, fontWeight: '500' },

  modalBackdrop: {
    flex: 1,
    backgroundColor: '#00000066',
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 20, fontWeight: '600', marginBottom: 15 },
  pinInput: {
    width: '50%',
    fontSize: 24,
    textAlign: 'center',
    borderBottomWidth: 2,
    borderColor: '#ccc',
    marginBottom: 25,
    paddingVertical: 5,
    color: '#FF9800',
  },
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: { backgroundColor: '#ccc' },
  confirmButton: { backgroundColor: '#FF9800' },
  modalButtonText: { color: 'white', fontSize: 16, fontWeight: '500' },
});
