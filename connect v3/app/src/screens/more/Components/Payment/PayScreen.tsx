import React, { useState, useRef, useEffect } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AmountScreen({ route }) {
  const { upiId } = route.params;
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [failureVisible, setFailureVisible] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getUserIdFromStorage = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUserId(parsedUser.id);
        } else {
          Alert.alert('User not found', 'Please login again.');
        }
      } catch (err) {
        Alert.alert('Error', 'Failed to retrieve user info.');
      }
    };

    getUserIdFromStorage();
  }, []);


  const amountRef = useRef(null);
  const pinRef = useRef(null);

  const handlePayPress = () => {
    if (!amount || parseInt(amount, 10) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }
    setPin('');
    setPinModalVisible(true);
    setTimeout(() => pinRef.current?.focus(), 100);
  };

  const handleConfirmPin = async () => {
    if (pin.length !== 6) {
      Alert.alert('Invalid PIN', 'PIN must be exactly 6 digits');
      return;
    }

    setPinModalVisible(false);
    setProcessing(true);

    try {
      const response = await fetch('http://192.168.73.246:5000/api/payment/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, upiId, amount, pin }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessVisible(true);
      } else {
        setFailureVisible(true);
      }
    } catch (err) {
      setFailureVisible(true);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      {}
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <MaterialIcon name="payment" size={80} color="#FF9800" style={styles.icon} />
            <Text style={styles.title}>Payment for UPI ID</Text>
            <Text style={styles.upi}>{upiId}</Text>

            <View style={styles.amountContainer}>
              <Text style={styles.label}>Amount: ₹</Text>
              <TextInput
                ref={amountRef}
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
        visible={pinModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPinModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setPinModalVisible(false)}>
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
              onPress={() => setPinModalVisible(false)}
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

      {}
      <Modal transparent visible={processing} animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.processingBox}>
            <ActivityIndicator size="large" color="#4a90e2" />
            <Text style={styles.processingText}>Processing Payment...</Text>
          </View>
        </View>
      </Modal>

      {}
      <Modal transparent visible={successVisible} animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.resultModal}>
            <View style={styles.circleSuccess}>
              <Ionicon name="checkmark-circle-outline" size={70} color="#4BB543" />
            </View>
            <Text style={styles.resultTitle}>Payment Successful</Text>
            <Text style={styles.resultDesc}>₹{amount} sent from {upiId}</Text>
            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => setSuccessVisible(false)}
            >
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {}
      <Modal transparent visible={failureVisible} animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.resultModal}>
            <View style={styles.circleFail}>
              <Ionicon name="close-circle-outline" size={70} color="#FF4C4C" />
            </View>
            <Text style={styles.resultTitle}>Payment Failed</Text>
            <Text style={styles.resultDesc}>Please try again later.</Text>
            <TouchableOpacity
              style={[styles.doneButton, { backgroundColor: '#FF4C4C' }]}
              onPress={() => setFailureVisible(false)}
            >
              <Text style={styles.doneText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  inner: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
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

  modalBackdrop: { flex: 1, backgroundColor: '#00000066' },
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
  modalButtons: { flexDirection: 'row', width: '100%', justifyContent: 'space-between' },
  modalButton: { flex: 1, paddingVertical: 12, marginHorizontal: 5, borderRadius: 8, alignItems: 'center' },
  cancelButton: { backgroundColor: '#ccc' },
  confirmButton: { backgroundColor: '#FF9800' },
  modalButtonText: { color: 'white', fontSize: 16, fontWeight: '500' },

  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  processingBox: { backgroundColor: '#fff', padding: 25, borderRadius: 15, alignItems: 'center', width: '70%' },
  processingText: { marginTop: 15, fontSize: 16, fontWeight: '500', color: '#333' },

  resultModal: { backgroundColor: '#fff', padding: 25, borderRadius: 15, alignItems: 'center', width: '80%' },
  circleSuccess: { backgroundColor: '#eafaf1', borderRadius: 100, padding: 10, marginBottom: 10 },
  circleFail: { backgroundColor: '#ffecec', borderRadius: 100, padding: 10, marginBottom: 10 },
  resultTitle: { fontSize: 20, fontWeight: '600', marginBottom: 8 },
  resultDesc: { fontSize: 15, color: '#555', marginBottom: 25, textAlign: 'center' },
  doneButton: { backgroundColor: '#4a90e2', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 8 },
  doneText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
