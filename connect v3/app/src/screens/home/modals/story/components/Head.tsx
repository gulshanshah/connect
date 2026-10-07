import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

type HeadProps = {
  user: { id: string; name: string; avatar: string };
  timestamp?: string;
  onClose: () => void;
  onMorePress?: () => void;
};

export default function Head({ user, timestamp, onMorePress, onClose }: HeadProps) {
  const getRelativeTime = () => {
    const time = timestamp ? new Date(timestamp) : new Date();
    const diff = Date.now() - time.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return `${seconds}s ago`;
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onClose} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
        <Icon name="chevron-back" size={28} color="#333" />
      </TouchableOpacity>
      <Image source={{ uri: user.avatar }} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.time}>{getRelativeTime()}</Text>
      </View>
      <TouchableOpacity
        onPress={onMorePress}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Icon name="ellipsis-horizontal" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingRight: 20,
    paddingLeft: 10,
    backgroundColor: '#000',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    marginLeft: 5,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  time: {
    color: '#666',
    fontSize: 12,
    marginTop: 2,
  },
});
