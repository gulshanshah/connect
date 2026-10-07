import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../constants/ThemeContext';
import { deleteTokens } from '../../../assets/Keychain';

const SettingsScreen = ({ navigation }) => {
  
  const handleLogout = () => {
  Alert.alert('Logout', 'Are you sure you want to logout?', [
    { text: 'Cancel', style: 'cancel' },
    {
      text: 'Logout',
      onPress: async () => {
        const success = await deleteTokens();
        if (success) {
          navigation.replace('Auth');
        } else {
          console.log('Failed to delete tokens');
        }
      }
    }
  ]);
};

  const settingsOptions = [
    { title: 'Profile', icon: 'person-outline', onPress: () => {} },
    { title: 'Privacy', icon: 'lock-closed-outline', onPress: () => {} },
    { title: 'Notifications', icon: 'notifications-outline', onPress: () => {} },
    { title: 'Appearance', icon: 'color-palette-outline', onPress: () => {} },
    { title: 'Help & Support', icon: 'help-circle-outline', onPress: () => {} },
    { title: 'About', icon: 'information-circle-outline', onPress: () => {} },
  ];

  const theme = useTheme();

const onBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerLeft}>
           <TouchableOpacity onPress={onBack} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
              <Icon name="chevron-back" size={24} color="#333" />
           </TouchableOpacity>
        <Text style={[styles.header, { color: theme.text }]}>Settings</Text>
        </View>

        {}
        {settingsOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.option, { backgroundColor: theme.card }]}
            onPress={option.onPress}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Icon name={option.icon} size={24} color={theme.text} />
            </View>
            <Text style={[styles.optionText, { color: theme.text }]}>{option.title}</Text>
            <Icon name="chevron-forward-outline" size={20} color="#bbb" style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>
        ))}

        {}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="exit-outline" size={24} color="#FF4C4C" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
  },
  headerLeft: {
     flexDirection: 'row',
     alignItems: 'center',
     gap: 5,
     marginBottom: 30,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginBottom: 12,
    elevation: 2,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 10,
    marginRight: 16,
  },
  optionText: {
    fontSize: 18,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
  },
  logoutText: {
    fontSize: 18,
    color: '#FF4C4C',
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
