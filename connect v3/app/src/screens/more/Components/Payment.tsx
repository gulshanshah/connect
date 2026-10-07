import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, Modal, Image, ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const PaymentScreen = () => {
  const [qrVisible, setQrVisible] = useState(false);
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>UPI Payments</Text>

      {}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('QrScanner')}>
          <Icon name="scan-outline" size={28} color="#4a90e2" />
          <Text style={styles.btnText}>Scan QR</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={() => setQrVisible(true)}>
          <Icon name="qr-code-outline" size={28} color="#4a90e2" />
          <Text style={styles.btnText}>My QR</Text>
        </TouchableOpacity>
      </View>

      {}
      <Modal visible={qrVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.qrContainer}>
            <Text style={{ marginBottom: 10 }}>Scan this QR to pay me</Text>
            <Image
              source={{ uri: 'https://api.qrserver.com/v1/create-qr-code/?data=upi://pay?pa=example@connecto&size=200x200' }}
              style={{ width: 200, height: 200 }}
            />
            <TouchableOpacity onPress={() => setQrVisible(false)} style={{ marginTop: 20 }}>
              <Text style={{ color: '#4a90e2' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {}
      <Text style={styles.sectionTitle}>Send Payment</Text>
      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.extraButton}>
          <Icon name="person-outline" size={20} color="#fff" />
          <Text style={styles.extraButtonText}>Pay to a Friend</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.extraButton}>
          <Icon name="cash-outline" size={20} color="#fff" />
          <Text style={styles.extraButtonText}>Pay to a UPI ID</Text>
        </TouchableOpacity>
      </View>

      {}
      <Text style={styles.sectionTitle}>Group Payments</Text>
      <TouchableOpacity
        style={styles.splitBox}
        onPress={() => navigation.navigate('SplitPayment')}
      >
        <Icon name="people-outline" size={28} color="#fff" />
        <Text style={styles.splitText}>Split a Bill</Text>
      </TouchableOpacity>

      {}
      <Text style={styles.sectionTitle}>More Options</Text>
      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.extraButton}>
          <Icon name="wallet-outline" size={20} color="#fff" />
          <Text style={styles.extraButtonText}>Check Balance</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.extraButton}>
          <Icon name="document-text-outline" size={20} color="#fff" />
          <Text style={styles.extraButtonText}>Transaction History</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.extraButton}>
          <Icon name="layers-outline" size={20} color="#fff" />
          <Text style={styles.extraButtonText}>Split History</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F2F6', padding: 16 },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },

  actionsRow: {
    flexDirection: 'row', justifyContent: 'space-around', marginBottom: 30,
  },
  actionBtn: {
    alignItems: 'center', borderWidth: 1, borderColor: '#4a90e2',
    padding: 20, borderRadius: 12, width: '42%',
  },
  btnText: { marginTop: 10, fontWeight: '600', color: '#4a90e2' },

  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', alignItems: 'center',
  },
  qrContainer: {
    backgroundColor: '#fff', padding: 24,
    borderRadius: 16, alignItems: 'center',
  },

  sectionTitle: {
    fontSize: 16, fontWeight: '600', marginBottom: 10, marginTop: 20,
  },

  splitBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#4a90e2', padding: 10,
    borderRadius: 12, justifyContent: 'center',
  },
  splitText: {
    color: '#fff', fontWeight: '600', fontSize: 16,
    marginLeft: 12,
  },

  buttonGroup: {
    gap: 12,
    marginTop: 10,
    marginBottom: 30,
  },
  extraButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4a90e2',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  extraButtonText: {
    color: '#fff',
    marginLeft: 10,
    fontWeight: '600',
    fontSize: 15,
  },
});

export default PaymentScreen;
