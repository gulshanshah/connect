import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, Modal, Image, ScrollView,
  Alert, ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const PaymentScreen = () => {
  const [qrVisible, setQrVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState('₹2,567.00');
  const upiId = `${username}@connecto`;

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          setUsername(user.username);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUsername();
  }, []);

  const qrUri = `https://api.qrserver.com/v1/create-qr-code/?data=upi://pay?pa=${upiId}&size=300x300`;

  const transactions = [
    { id: 1, type: 'sent', amount: 500, to: 'friend1', date: '2024-03-15' },
    { id: 2, type: 'received', amount: 1000, from: 'friend2', date: '2024-03-14' },
    { id: 3, type: 'split', amount: 250, with: 'group1', date: '2024-03-13' },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {}
      <LinearGradient
        colors={['#6C63FF', '#8B80F8']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.greeting}>Hello, {username}</Text>
        <View style={styles.upiContainer}>
          <Text style={styles.upiId}>{upiId}</Text>
        </View>
      </LinearGradient>

      {}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balanceAmount}>{balance}</Text>
      </View>

      {}
      <View style={styles.actionsRow}>
        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => Alert.alert('Pay Friend', 'Navigate to connected users list')}
        >
          <LinearGradient
            colors={['#6C63FF', '#8B80F8']}
            style={styles.gradientIcon}
          >
            <Icon name="people-outline" size={28} color="white" />
          </LinearGradient>
          <Text style={styles.actionText}>Pay Friend</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => setQrVisible(true)}
        >
          <LinearGradient
            colors={['#6C63FF', '#8B80F8']}
            style={styles.gradientIcon}
          >
            <Icon name="qr-code-outline" size={28} color="white" />
          </LinearGradient>
          <Text style={styles.actionText}>Show QR</Text>
        </TouchableOpacity>
      </View>

      {}
      <TouchableOpacity 
        style={styles.upiPaymentCard}
        onPress={() => Alert.alert('UPI Payment', 'Enter UPI ID screen')}
      >
        <Icon name="wallet-outline" size={24} color="#6C63FF" />
        <Text style={styles.upiPaymentText}>Pay using UPI ID</Text>
        <Icon name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>

      {}
      <Modal visible={qrVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.qrContainer}>
            <Text style={styles.modalTitle}>Scan to Pay</Text>
            <Image
              source={{ uri: qrUri }}
              style={styles.qrImage}
              resizeMode="contain"
            />
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setQrVisible(false)}
            >
              <Icon name="close" size={24} color="#6C63FF" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Transaction History</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.historyList}>
          {transactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <Icon 
                name={transaction.type === 'sent' ? 'arrow-up' : 'arrow-down'} 
                size={20} 
                color={transaction.type === 'sent' ? '#ff4444' : '#00C851'} 
              />
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionText}>
                  {transaction.type === 'sent' ? `Paid to ${transaction.to}` : 
                   transaction.type === 'received' ? `Received from ${transaction.from}` : 
                   `Split with ${transaction.with}`}
                </Text>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
              </View>
              <Text style={[
                styles.transactionAmount,
                { color: transaction.type === 'sent' ? '#ff4444' : '#00C851' }
              ]}>
                {transaction.type === 'sent' ? '-' : '+'}₹{transaction.amount}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Split History</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.historyList}>
          <View style={styles.splitHistoryItem}>
            <Icon name="receipt-outline" size={20} color="#6C63FF" />
            <Text style={styles.splitHistoryText}>Dinner with Team - ₹500</Text>
            <Text style={styles.splitStatus}>Pending</Text>
          </View>
          <View style={styles.splitHistoryItem}>
            <Icon name="receipt-outline" size={20} color="#6C63FF" />
            <Text style={styles.splitHistoryText}>Trip Expenses - ₹1,200</Text>
            <Text style={[styles.splitStatus, styles.settledStatus]}>Settled</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F5F7FB' 
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  header: {
    padding: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 24,
  },
  greeting: {
    color: 'white',
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 8,
  },
  upiContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 12,
    borderRadius: 12,
  },
  upiId: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'monospace',
  },
  balanceCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    margin: 16,
    padding: 20,
    elevation: 3,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2D2D2D',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  actionCard: {
    alignItems: 'center',
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    elevation: 4,
  },
  gradientIcon: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  actionText: {
    color: '#2D2D2D',
    fontSize: 16,
    fontWeight: '500',
  },
  upiPaymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    elevation: 2,
    marginVertical: 8,
  },
  upiPaymentText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#2D2D2D',
  },
  section: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 16,
    padding: 16,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D2D2D',
  },
  seeAllText: {
    color: '#6C63FF',
    fontWeight: '500',
  },
  historyList: {
    marginTop: 8,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  transactionDetails: {
    flex: 1,
    marginLeft: 16,
  },
  transactionText: {
    fontSize: 16,
    color: '#2D2D2D',
  },
  transactionDate: {
    color: '#888',
    fontSize: 12,
    marginTop: 4,
  },
  transactionAmount: {
    fontWeight: '600',
    fontSize: 16,
  },
  splitHistoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  splitHistoryText: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
    color: '#2D2D2D',
  },
  splitStatus: {
    color: '#ff4444',
    fontWeight: '500',
  },
  settledStatus: {
    color: '#00C851',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: 24,
  },
  qrContainer: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  qrImage: {
    width: 240,
    height: 240,
    marginVertical: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2D2D2D',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
  },
});

export default PaymentScreen;