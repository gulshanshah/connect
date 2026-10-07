import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../constants/ThemeContext';

const ProfileStats = () => {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <View style={styles.statBox}>
        <Text style={[styles.number, { color: theme.text }]}>120</Text>
        <Text style={styles.label}>Posts</Text>
      </View>
      <TouchableOpacity>
      <View style={styles.statBox}>
        <Text style={[styles.number, { color: theme.text }]}>156</Text>
        <Text style={styles.label}>Connections</Text>
      </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    marginLeft: 18,
    marginRight: 18,
    marginTop: 18,
    borderRadius: 10,
    borderColor: 'rgba(202, 204, 203, 0.2)',
    borderTopWidth: 2,
    borderBottomWidth: 2,
  },
  statBox: {
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: '#555',
    fontWeight: '600',
  },
  number: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
});

export default ProfileStats;
