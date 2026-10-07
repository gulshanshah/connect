import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../constants/ThemeContext';

const { width } = Dimensions.get('window');
const CARD_SIZE = width * 0.42;

const features = [
  { title: 'Payment', icon: 'wallet-outline', screen: 'Payment', color: ['#667eea', '#764ba2'] },
  { title: 'Buy or Sell', icon: 'swap-horizontal', screen: 'BuySell', color: ['#4fd1c5', '#319795'] },
  { title: 'Events', icon: 'calendar', screen: 'Events', color: ['#f6ad55', '#dd6b20'] },
  { title: 'Innovation', icon: 'rocket', screen: 'Innovation', color: ['#f687b3', '#d53f8c'] },
  { title: 'Internship', icon: 'briefcase', screen: 'Internship', color: ['#68d391', '#38a169'] },
];

const MoreScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();

  return (
    <LinearGradient
      colors={[theme.background, theme.background]}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Services</Text>
        <Text style={styles.subtitle}>The premium solutions</Text>
      </View>

      <View style={styles.grid}>
        {features.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => navigation.navigate(item.screen)}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={item.color}
              style={styles.card}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.iconContainer}>
                <Icon name={item.icon} size={32} color="#fff" />
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    paddingVertical: 30,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2d3748',
    fontFamily: 'Helvetica',
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    marginTop: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});

export default MoreScreen;