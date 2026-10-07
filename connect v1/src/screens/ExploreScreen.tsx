import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const features = [
  { title: 'Buy or Sell', icon: 'cart-outline', screen: 'BuySellScreen' },
  { title: 'Votings', icon: 'checkmark-done-outline' },
  { title: 'Startup Ideas', icon: 'bulb-outline' },
  { title: 'Innovation Show', icon: 'rocket-outline' },
  { title: 'Tech News', icon: 'newspaper-outline' },
  { title: 'Daily Quiz', icon: 'help-circle-outline' },
  { title: 'Skill Challenges', icon: 'barbell-outline' },
  { title: 'Event Updates', icon: 'calendar-outline' },
  { title: 'Job & Internship', icon: 'briefcase-outline' },
];

const ExploreScreen = () => {
  const navigation = useNavigation();

  const handlePress = (screen) => {
    if (screen) navigation.navigate(screen);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Explore</Text>

      {}
      <TouchableOpacity
        style={[styles.box, styles.paymentBox]}
        onPress={() => handlePress('PaymentScreen')}
      >
        <Icon name="cash-outline" size={30} color="#388e3c" />
        <Text style={[styles.label, styles.paymentLabel]}>Payment</Text>
      </TouchableOpacity>

      <View style={styles.grid}>
        {features.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.box}
            onPress={() => handlePress(item.screen)}
          >
            <Icon name={item.icon} size={30} color="#4a90e2" />
            <Text style={styles.label}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
  },
  box: {
    width: '47%',
    aspectRatio: 1,
    backgroundColor: '#f0f4f7',
    borderRadius: 10,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  paymentBox: {
    alignSelf: 'center',
    backgroundColor: '#e8f5e9',
    marginBottom: 24,
  },
  paymentLabel: {
    color: '#388e3c',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  label: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
    color: '#333',
  },
});

export default ExploreScreen;
