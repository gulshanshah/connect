import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const ChatHeader = ({
  title,
  subtitle,
  onBack,
  onMenu,
  profilePic,
}: {
  title: string;
  subtitle: string;
  onBack?: () => void;
  onMenu?: () => void;
  profilePic?: string;
}) => (
  <View style={styles.headerContainer}>
    <View style={styles.leftSection}>
      <TouchableOpacity onPress={onBack} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
        <Icon name="chevron-back" size={24} color="#333" />
      </TouchableOpacity>
      <TouchableOpacity>
      {profilePic ? (
        <Image source={{ uri: profilePic }} style={styles.profilePic} />
      ) : (
        <View style={styles.placeholderPic}>
          <Icon name="person-circle-outline" size={36} color="#888" />
        </View>
      )}
      </TouchableOpacity>
      <TouchableOpacity>
      <View style={styles.centerSection}>
        <Text style={styles.headerTitle}>{title}</Text>
        <Text style={styles.headerSubtitle}>{subtitle}</Text>
      </View>
      </TouchableOpacity>
    </View>
    <TouchableOpacity onPress={onMenu} style={styles.rightSection} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
      <Icon name="ellipsis-vertical" size={22} color="#333" />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F1F2F6',
    borderBottomWidth: 1,
    borderColor: '#eee',
    height: 68,
    marginRight: 8,
    marginLeft: 5,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePic: {
    width: 38,
    height: 38,
    borderRadius: 18,
    backgroundColor: '#ddd',
    marginLeft: 12,
  },
  placeholderPic: {
    width: 38,
    height: 38,
    borderRadius: 18,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  centerSection: {
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'green',
    marginTop: 2,
  },
  rightSection: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
});

export default ChatHeader;