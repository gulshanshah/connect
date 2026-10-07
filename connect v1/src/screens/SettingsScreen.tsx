import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showAccountOptions, setShowAccountOptions] = useState(false);
  const [showSecurityOptions, setShowSecurityOptions] = useState(false);
  const navigation = useNavigation();

  const toggleAccountOptions = () => {
    setShowAccountOptions(prev => !prev);
  };

  const toggleSecurityOptions = () => {
    setShowSecurityOptions(prev => !prev);
  };

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: async () => {
          await AsyncStorage.removeItem('accessToken');
          await AsyncStorage.removeItem('refreshToken');
          await AsyncStorage.removeItem('user');
          navigation.replace('Auth');
        } }
      ],
      { cancelable: true }
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Settings</Text>

      <View style={styles.itemContainer}>
        <Text style={styles.itemLabel}>Enable Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
        />
      </View>

      <View style={styles.itemContainer}>
        <Text style={styles.itemLabel}>Dark Mode</Text>
        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
        />
      </View>

      <TouchableOpacity style={styles.itemContainer} onPress={toggleAccountOptions}>
        <Text style={styles.itemLabel}>Account</Text>
      </TouchableOpacity>
      {showAccountOptions && (
        <View style={styles.subOptions}>
          <TouchableOpacity style={styles.subItemContainer}>
            <Text style={styles.subItemLabel}>Change Email</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.subItemContainer}>
            <Text style={styles.subItemLabel}>Update Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.subItemContainer}>
            <Text style={styles.subItemLabel}>Manage Subscriptions</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.subItemContainer}>
            <Text style={styles.subItemLabel}>Delete Account</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.subItemContainer, styles.logoutItem]} onPress={handleLogout}>
            <Text style={[styles.subItemLabel, styles.logoutText]}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.itemContainer} onPress={toggleSecurityOptions}>
        <Text style={styles.itemLabel}>Security</Text>
      </TouchableOpacity>
      {showSecurityOptions && (
        <View style={styles.subOptions}>
          <TouchableOpacity style={styles.subItemContainer}>
            <Text style={styles.subItemLabel}>Change Password</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.subItemContainer}>
            <Text style={styles.subItemLabel}>Two-Factor Authentication</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.subItemContainer}>
            <Text style={styles.subItemLabel}>Manage Devices</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.itemContainer}>
        <Text style={styles.itemLabel}>Help</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1
  },
  itemLabel: {
    fontSize: 18
  },
  subOptions: {
    paddingLeft: 20,
    backgroundColor: '#f9f9f9',
  },
  subItemContainer: {
    paddingVertical: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  subItemLabel: {
    fontSize: 16,
  }
});

export default SettingsScreen;
