import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';

const HeadScreen = () => {
  return (
    <SafeAreaView style={styles.container}>

        <View style={styles.header}>
          <TouchableOpacity>
          <Text style={styles.nameDropdown}>gulshan ▼</Text>
          </TouchableOpacity>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity>
            <View style={styles.hamburger}>
              <View style={styles.line} />
              <View style={styles.line} />
              <View style={styles.line} />
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
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: 'white',
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
    backgroundColor: 'black',
    marginVertical: 2,
  },
});
