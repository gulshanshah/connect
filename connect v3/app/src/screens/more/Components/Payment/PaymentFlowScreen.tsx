import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const PaymentFlowScreen = () => {
  const [processing, setProcessing] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [failureVisible, setFailureVisible] = useState(false);

  const handlePayment = () => {
    setProcessing(true);

    setTimeout(() => {
      setProcessing(false);

      const isSuccess = Math.random() > 0.5;

      if (isSuccess) {
        setSuccessVisible(true);
      } else {
        setFailureVisible(true);
      }
    }, 3000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Pay Now</Text>

      <TouchableOpacity
        style={styles.payButton}
        onPress={handlePayment}
        disabled={processing}
      >
        <Text style={styles.payButtonText}>{processing ? 'Processing...' : 'Pay ₹150'}</Text>
      </TouchableOpacity>

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
          <View style={styles.modal}>
            <View style={styles.circleSuccess}>
              <Icon name="checkmark-circle-outline" size={70} color="#4BB543" />
            </View>
            <Text style={styles.title}>Payment Successful</Text>
            <Text style={styles.amount}>₹150</Text>
            <Text style={styles.desc}>Sent to John Doe</Text>

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
          <View style={styles.modal}>
            <View style={styles.circleFail}>
              <Icon name="close-circle-outline" size={70} color="#FF4C4C" />
            </View>
            <Text style={styles.title}>Payment Failed</Text>
            <Text style={styles.desc}>Please try again later.</Text>

            <TouchableOpacity
              style={[styles.doneButton, { backgroundColor: '#FF4C4C' }]}
              onPress={() => setFailureVisible(false)}
            >
              <Text style={styles.doneText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PaymentFlowScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  payButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingBox: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    width: '70%',
  },
  processingText: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  modal: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    width: '80%',
  },
  circleSuccess: {
    backgroundColor: '#eafaf1',
    borderRadius: 100,
    padding: 10,
    marginBottom: 10,
  },
  circleFail: {
    backgroundColor: '#ffecec',
    borderRadius: 100,
    padding: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  amount: {
    fontSize: 26,
    fontWeight: '700',
    color: '#4BB543',
  },
  desc: {
    fontSize: 15,
    color: '#555',
    marginBottom: 25,
    textAlign: 'center',
  },
  doneButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  doneText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
