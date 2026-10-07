import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Keychain from 'react-native-keychain';

import { ThemeProvider, useTheme } from './constants/ThemeContext';

import AuthScreen from './screens/auth/AuthScreen';
import BottomTabs from './main/BottomTabs';

const Stack = createNativeStackNavigator();

const AppContent = () => {
  const theme = useTheme();
  const [initialRoute, setInitialRoute] = useState<string | null>(null);


useEffect(() => {
  const checkLoginStatus = async () => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        const { accessToken } = JSON.parse(credentials.password);
        setInitialRoute(accessToken ? 'BottomTabs' : 'Auth');
      } else {
        setInitialRoute('BottomTabs');
      }
    } catch (error) {
      console.log('Error checking login status:', error);
      setInitialRoute('Auth');
    }
  };

  checkLoginStatus();
}, []);


  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007aff" />
      </View>
    );
  }

  return (
    <>
    <StatusBar backgroundColor={theme.background}
  barStyle="default"
  hidden={false} 
  />
  <GestureHandlerRootView style={{ flex: 1 }}>
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="BottomTabs" component={BottomTabs} />
        <Stack.Screen name="Auth" component={AuthScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    </GestureHandlerRootView>
    </>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
