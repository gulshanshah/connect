import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import AssistantBox from '../modals/AssistantBox';
import { useTheme } from '../../../constants/ThemeContext';

const HeaderScreen = () => {
  const navigation = useNavigation();
  const [showAssistant, setShowAssistant] = useState(false);
  const theme = useTheme();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerRow}>
        {}
        <TouchableOpacity onPress={() => setShowAssistant(true)}>
        <View style={[styles.companyContainer, { backgroundColor: theme.white }]}>
  <Text style={styles.companyText}>
    <Text style={styles.connectFirst}>Con</Text>
    <Text style={styles.connectSecond}>nect</Text>
  </Text>
</View>
</TouchableOpacity>


        {}
        <View style={styles.rightIcons}>
          <TouchableOpacity
            style={[styles.iconContainer, styles.iconBox, { backgroundColor: theme.white }]}
            onPress={() => navigation.navigate('Search')}
          >
            <Icon name="search" size={22} color={theme.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.iconContainer, styles.iconBox, { backgroundColor: theme.white }]}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Icon name="notifications" size={22} color={theme.text} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Profile')}
          >
            <Image
              source={{
                uri: 'https://i.pravatar.cc/10',
              }}
              style={[styles.avatar, styles.iconBox]}
            />
          </TouchableOpacity>
        </View>
      </View>
      <AssistantBox visible={showAssistant} onClose={() => setShowAssistant(false)} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  companyContainer: {
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 20,
  },
  companyText: {
  fontSize: 24,
  fontWeight: 'bold',
  flexDirection: 'row',
},
connectFirst: {
  color: '#4E8183',
},
connectSecond: {
  color: '#655DBB',
},
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 20,
  },
  iconBox: {
    borderWidth: 1,
    borderColor: '#ccc',
  },
  avatar: {
    width: 39,
    height: 39,
    borderRadius: 20,
    marginLeft: 8,
  },
});

export default HeaderScreen;
