import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ThemeProvider, useTheme } from './constants/ThemeContext';

import AuthScreen from './screens/auth/AuthScreen';
import BottomTabs from './main/BottomTabs';

const Stack = createNativeStackNavigator();

const AppContent = () => {
  const theme = useTheme();


  return (
    <>
    <StatusBar backgroundColor={theme.background}
  barStyle="default"
  hidden={false} 
  />
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="BottomTabs" component={BottomTabs} />
        <Stack.Screen name="Auth" component={AuthScreen} />
      </Stack.Navigator>
    </NavigationContainer>
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
