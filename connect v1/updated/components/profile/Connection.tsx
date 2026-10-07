import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default function ConnectionScreen() {
  return (
    <View style={styles.container}>
      
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.connectButton}>
          <Icon name="plug" size={18} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>Connect</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.messageButton}>
          <Icon name="comment-dots" size={18} color="#333" style={styles.icon} />
          <Text style={[styles.buttonText, { color: '#333' }]}>Message</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    marginTop: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 16,
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F46E5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 8,
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 8,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 8,
  },
  icon: {
    marginRight: 4,
  },
});
