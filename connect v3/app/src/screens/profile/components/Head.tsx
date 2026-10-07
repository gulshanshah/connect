import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../constants/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';

const HeadScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const onBack = () => {
    navigation.goBack();
  };
   return (
    <SafeAreaView style={styles.container}>

        <View style={styles.header}>
          <View style={styles.headerLeft}>
          <TouchableOpacity onPress={onBack} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
                  <Icon name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity>
          <Text style={[styles.nameDropdown, { color: theme.text }]}>gulshan ▼</Text>
          </TouchableOpacity>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity style={[styles.editButton, { backgroundColor: theme.card }]} onPress={() => navigation.navigate('EditProfile')}>
              <Text style={[styles.editText, { color: theme.text }]}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <View style={styles.hamburger}>
              <View style={[styles.line, { backgroundColor: theme.text }]}/>
              <View style={[styles.line, { backgroundColor: theme.text }]}/>
              <View style={[styles.line, { backgroundColor: theme.text }]}/>
            </View>
            </TouchableOpacity>
          </View>
        </View>
    </SafeAreaView>
  );
};

export default HeadScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameDropdown: {
    fontSize: 18,
    fontWeight: '600',
    paddingBottom: 5,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
  },
  editText: {
    fontWeight: '600',
    fontSize: 18,
  },
  hamburger: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    width: 22,
    height: 2,
    marginVertical: 2,
  },
});
