import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';

import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import PaymentScreen from '../screens/PaymentScreen';
import ExploreScreen from '../screens/ExploreScreen';

import ProfileScreen from '../screens/ProfileScreen';
import ChatScreen from '../screens/ChatScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const BottomTabsComponent = () => {
  return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: '#fff',
            paddingHorizontal: 20,
            height: 60,
          },
          tabBarIcon: ({ focused }) => {
            let iconName;
            let color = focused ? '#333' : '#CACCCB';

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
              return <Icon name={iconName} size={24} color={color} />;
            } else if (route.name === 'Search') {
              iconName = focused ? 'search' : 'search-outline';
              return <Icon name={iconName} size={24} color={color} />;
            } else if (route.name === 'Payment') {
              return (
                <View style={styles.payWrapper}>
                  <Text style={[styles.payText, { color }]}>
                    ₹
                  </Text>
                </View>
              );
            } else if (route.name === 'Explore') {
              iconName = focused ? 'grid' : 'grid-outline';
              return <Icon name={iconName} size={24} color={color} />;
            }

            return null;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="Payment" component={PaymentScreen} />
        <Tab.Screen name="Explore" component={ExploreScreen} />
      </Tab.Navigator>
  );
};

const ExtraStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={BottomTabsComponent} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  payWrapper: {
    height: 40,
    width: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default ExtraStack;
