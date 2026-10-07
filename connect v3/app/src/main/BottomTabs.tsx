import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../constants/ThemeContext';

import Testing from '../screens/testing/test';

import HomeScreen from '../screens/home/HomeScreen';
import ChatScreen from '../screens/chat/ChatScreen';
import CreateScreen from '../screens/create/CreateScreen';
import MoreScreen from '../screens/more/MoreScreen';

import ProfileScreen from '../screens/profile/ProfileScreen';
import Chatting from '../screens/chat/Components/Chatting';
import NotificationScreen from '../screens/chat/Components/notification/NotificationScreen';
import SearchScreen from '../screens/search/SearchScreen';
import SettingsScreen from '../screens/profile/components/Settings';
import EditProfileScreen from '../screens/profile/components/EditProfile';

import BuySellScreen from '../screens/more/Components/BuySell';
import PaymentScreen from '../screens/more/Components/Payment';
import CreateUpiScreen from '../screens/more/Components/Payment/CreateUpiScreen';
import PaymentFlowScreen from '../screens/more/Components/Payment/PaymentFlowScreen';
import SplitPaymentScreen from '../screens/more/Components/Payment/SplitPaymentScreen';
import ScanScreen from '../screens/more/Components/Payment/QrScanner';
import AmountScreen from '../screens/more/Components/Payment/PayScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


const BottomTabsComponent = () => {
  const [showMoreApps, setShowMoreApps] = useState(false);
  const theme = useTheme();

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarHideOnKeyboard: true, 
          tabBarStyle: {
            backgroundColor: theme.background,
            paddingHorizontal: 20,
            height: 60,
          },
          tabBarIcon: ({ focused }) => {
            let iconName;
            let color = focused ? theme.text : '#CACCCB';

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
              return <Icon name={iconName} size={26} color={color} />;
            } else if (route.name === 'Chat') {
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
              return <Icon name={iconName} size={26} color={color} />;
            } else if (route.name === 'Create') {
              iconName = focused ? 'add-circle' : 'add-circle-outline';
              return <Icon name={iconName} size={26} color={color} />;
            } else if (route.name === 'More') {
              iconName = focused ? 'grid' : 'grid-outline';
              return <Icon name={iconName} size={24} color={color} />;
            }

            return null;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Chat" component={ChatScreen} />
        <Tab.Screen name="Create" component={CreateScreen} />
        {}
        <Tab.Screen name="More" component={MoreScreen} />

      </Tab.Navigator>
      
    {showMoreApps && <MoreApps onClose={() => setShowMoreApps(false)} />}
    </View>
  );
};

const ExtraStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={BottomTabsComponent} />
      {}
      <Stack.Screen name="Testing"  component={Testing} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Chatting" component={Chatting} />
      <Stack.Screen name="Notifications" component={NotificationScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="BuySell" component={BuySellScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="CreateUpi" component={CreateUpiScreen} />
      <Stack.Screen name="PaymentFlow" component={PaymentFlowScreen} />
      <Stack.Screen name="SplitPayment" component={SplitPaymentScreen} />
      <Stack.Screen name="QrScanner" component={ScanScreen} />
      <Stack.Screen name="PayScreen" component={AmountScreen} />
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
