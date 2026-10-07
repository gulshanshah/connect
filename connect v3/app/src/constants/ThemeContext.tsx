
import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';

const themes = {
  light: {
    mode: 'light',
    background: '#F1F2F6',
    text: '#000000',
    card: '#f2f2f2',
    primary: '#6200ee',
    white: '#fff',
  },
  dark: {
    mode: 'dark',
    background: '#121212',
    text: '#ffffff',
    card: '#1e1e1e',
    primary: '#bb86fc',
    white: '#121212',
  },
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? themes.dark : themes.light;

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
