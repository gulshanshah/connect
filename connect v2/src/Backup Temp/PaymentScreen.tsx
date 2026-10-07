import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, Modal, Image
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const PaymentScreen = () => {
  const [users, setUsers] = useState([]);
  const [note, setNote] = useState('');
  const [amount, setAmount] = useState('');
  const [splitType, setSplitType] = useState('equal');
  const [showQRModal, setShowQRModal] = useState(false);

  const recentUsers = ['Aryan', 'Meena', 'Aman', 'Sneha', 'Rohit'];

  const handleUserSelect = (name) => {
    if (!users.includes(name)) setUsers([...users, name]);
  };

  const handlePay = () => {
    alert('Payment requested/sent!');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Split Payment</Text>

      {}
      <View style={styles.qrRow}>
        <TouchableOpacity style={styles.qrButton}>
          <Icon name="scan-outline" size={24} color="#4a90e2" />
          <Text style={styles.qrText}>Open Scanner</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.qrButton}
          onPress={() => setShowQRModal(true)}
        >
          <Icon name="qr-code-outline" size={24} color="#4a90e2" />
          <Text style={styles.qrText}>Show My QR</Text>
        </TouchableOpacity>
      </View>

      {}
      <TextInput
        placeholder="Enter Total Amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        style={styles.input}
      />

      {}
      <View style={styles.splitRow}>
        {['equal', 'custom', 'percent'].map((type) => (
          <TouchableOpacity
            key={type}
            onPress={() => setSplitType(type)}
            style={[
              styles.splitOption,
              splitType === type && styles.splitOptionActive,
            ]}
          >
            <Text
              style={{
                color: splitType === type ? '#fff' : '#4a90e2',
              }}
            >
              {type.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {}
      <Text style={styles.subHeading}>Suggested Friends</Text>
      <View style={styles.userChips}>
        {recentUsers.map((name) => (
          <TouchableOpacity
            key={name}
            style={styles.chip}
            onPress={() => handleUserSelect(name)}
          >
            <Text style={styles.chipText}>{name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {}
      <Text style={styles.subHeading}>Selected People</Text>
      {users.length === 0 ? (
        <Text style={{ color: '#888', marginBottom: 10 }}>No one added yet</Text>
      ) : (
        users.map((user, idx) => (
          <View key={idx} style={styles.userItem}>
            <Text>{user}</Text>
            <Text>{splitType === 'equal' && amount
              ? `₹${(Number(amount) / users.length).toFixed(2)}`
              : splitType === 'custom'
              ? 'Custom'
              : 'Percent'
            }</Text>
          </View>
        ))
      )}

      {}
      <Text style={styles.subHeading}>Add a Note (Optional)</Text>
      <TextInput
        placeholder="Like: Class trip expense..."
        style={styles.noteInput}
        value={note}
        onChangeText={setNote}
      />

      {}
      <View style={styles.summary}>
        <Text>Total: ₹{amount || 0}</Text>
        <Text>Users: {users.length}</Text>
        <Text>Split: {splitType.toUpperCase()}</Text>
      </View>

      <TouchableOpacity
        style={styles.payBtn}
        onPress={handlePay}
        disabled={!amount || users.length === 0}
      >
        <Text style={styles.payBtnText}>Send / Request</Text>
      </TouchableOpacity>

      {}
      <Modal visible={showQRModal} transparent animationType="slide">
        <View style={styles.qrModal}>
          <View style={styles.qrBox}>
            <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Scan to Pay Me</Text>
            <Image
              source={{ uri: 'https://api.qrserver.com/v1/create-qr-code/?data=upi://pay?pa=your@upi&size=150x150' }}
              style={{ width: 180, height: 180 }}
            />
            <TouchableOpacity
              onPress={() => setShowQRModal(false)}
              style={{ marginTop: 20 }}
            >
              <Text style={{ color: '#4a90e2' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  qrRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  qrButton: {
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#4a90e2',
    borderRadius: 10,
    width: '45%',
  },
  qrText: {
    marginTop: 8,
    color: '#4a90e2',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  splitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  splitOption: {
    borderWidth: 1,
    borderColor: '#4a90e2',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    width: '30%',
    alignItems: 'center',
  },
  splitOptionActive: {
    backgroundColor: '#4a90e2',
  },
  subHeading: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  userChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    color: '#1976d2',
    fontWeight: '500',
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  noteInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    height: 80,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  summary: {
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 10,
  },
  payBtn: {
    backgroundColor: '#4a90e2',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  payBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  qrModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrBox: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 14,
    alignItems: 'center',
  },
});

export default PaymentScreen;
