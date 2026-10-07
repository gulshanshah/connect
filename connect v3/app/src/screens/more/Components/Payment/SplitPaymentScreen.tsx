import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet
} from 'react-native';

const SplitPaymentScreen = () => {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [splitType, setSplitType] = useState('equal');
  const [selectedUsers, setSelectedUsers] = useState([]);

  const recentUsers = ['Aryan', 'Meena', 'Aman', 'Sneha', 'Rohit'];

  const handleUserSelect = (user) => {
    if (!selectedUsers.includes(user)) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleSplit = () => {
    alert(`Split request sent to ${selectedUsers.length} people`);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Split Payment</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter total amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

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
            <Text style={{
              color: splitType === type ? '#fff' : '#4a90e2',
              fontWeight: 'bold',
            }}>
              {type.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

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

      <Text style={styles.subHeading}>Selected</Text>
      {selectedUsers.map((user, idx) => (
        <View key={idx} style={styles.userItem}>
          <Text>{user}</Text>
          <Text>
            ₹{splitType === 'equal' && amount ? (Number(amount) / selectedUsers.length).toFixed(2) : '--'}
          </Text>
        </View>
      ))}

      <TextInput
        placeholder="Add a note (optional)"
        style={styles.noteInput}
        value={note}
        onChangeText={setNote}
      />

      <TouchableOpacity style={styles.payBtn} onPress={handleSplit}>
        <Text style={styles.payBtnText}>Split Now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 10,
    padding: 12, fontSize: 16, marginBottom: 20,
  },
  splitRow: {
    flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16,
  },
  splitOption: {
    borderWidth: 1, borderColor: '#4a90e2', paddingVertical: 8,
    paddingHorizontal: 16, borderRadius: 8, width: '30%', alignItems: 'center',
  },
  splitOptionActive: {
    backgroundColor: '#4a90e2',
  },
  subHeading: {
    fontSize: 16, fontWeight: '600', marginVertical: 12,
  },
  userChips: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 8,
  },
  chip: {
    backgroundColor: '#e3f2fd', paddingHorizontal: 12,
    paddingVertical: 6, borderRadius: 20, marginRight: 8, marginBottom: 8,
  },
  chipText: { color: '#1976d2', fontWeight: '500' },
  userItem: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 8, borderBottomWidth: 1, borderColor: '#eee',
  },
  noteInput: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 10,
    padding: 12, fontSize: 15, height: 80, textAlignVertical: 'top', marginTop: 10,
  },
  payBtn: {
    backgroundColor: '#4a90e2', padding: 14,
    borderRadius: 12, alignItems: 'center', marginTop: 20,
  },
  payBtnText: {
    color: '#fff', fontWeight: '600', fontSize: 16,
  },
});

export default SplitPaymentScreen;
