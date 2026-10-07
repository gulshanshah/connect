import React from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const HeaderScreen = () => {
  const navigation = useNavigation();
  return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerRow}>
          {}
          <View style={styles.leftIcons}>
            <TouchableOpacity style={[styles.iconContainer, styles.notification]}>
              <Icon name="notifications" size={25} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconContainer, styles.chat]} onPress={() => navigation.navigate('ChatScreen')}>
              <Icon name="chatbubble-ellipses" size={25} color="#333" />
            </TouchableOpacity>
          </View>

          {}
          <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
            <Image
              source={{
                uri: 'https://i.pravatar.cc/100',
              }}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftIcons: {
    flexDirection: 'row',
    gap: 10,
  },
  iconContainer: {
    padding: 10,
    borderRadius: 20,
  },
  notification: {
    backgroundColor: 'white',
    borderColor: '#655DBB',
  },
  chat: {
    backgroundColor: 'white',
    borderColor: '#FB6F92',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 25,
    borderColor: 'white',
    borderWidth: 2,
  },
});

export default HeaderScreen;
