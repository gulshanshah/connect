import React, { useState } from 'react';
import {
  View, StyleSheet, TouchableOpacity, Modal, Text, Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Swipeable } from 'react-native-gesture-handler';

import TextMessage from './MessageList/TextMessage';
import ImageMessage from './MessageList/ImageMessage';
import VideoMessage from './MessageList/VideoMessage';
import AudioMessage from './MessageList/AudioMessage';

const MessageItem = ({ message, onOptionSelect }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const renderContent = () => {
    switch (message.type) {
      case 'text': return <TextMessage message={message} />;
      case 'image': return <ImageMessage message={message} />;
      case 'video': return <VideoMessage message={message} />;
      case 'audio': return <AudioMessage message={message} />;
      default: return null;
    }
  };

  const MENU_OPTIONS = [
    { label: 'React', icon: 'emoji-emotions', action: 'react' },
    { label: 'Reply', icon: 'reply', action: 'reply' },
    { label: 'Delete for me', icon: 'delete', action: 'deleteForMe' },
    ...(message.isUser ? [{ label: 'Delete for everyone', icon: 'delete-forever', action: 'deleteForEveryone' }] : []),
  ];

  const renderLeftActions = () => (
    <View style={styles.leftAction}>
      <Icon name="reply" size={24} color="#fff" />
      <Text style={styles.leftActionText}>Reply</Text>
    </View>
  );

  return (
    <Swipeable
      renderLeftActions={renderLeftActions}
      onSwipeableLeftOpen={() => {
        if (onOptionSelect) onOptionSelect('reply', message);
      }}
    >
      <View style={styles.wrapper}>
        <TouchableOpacity
          onLongPress={() => setMenuVisible(true)}
          activeOpacity={0.7}
          style={[
            styles.container,
            message.isUser && styles.userContainer,
          ]}
        >
          {renderContent()}
        </TouchableOpacity>

        <Modal
          transparent
          visible={menuVisible}
          animationType="fade"
          onRequestClose={() => setMenuVisible(false)}
        >
          <Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
            <View style={styles.bottomSheet}>
              {MENU_OPTIONS.map(option => (
                <TouchableOpacity
                  key={option.action}
                  style={styles.menuOption}
                  onPress={() => {
                    setMenuVisible(false);
                    if (onOptionSelect) onOptionSelect(option.action, message);
                  }}
                >
                  <Icon name={option.icon} size={22} color="#333" style={{ width: 30 }} />
                  <Text style={styles.menuText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Pressable>
        </Modal>
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
  },
  container: {
    maxWidth: '80%',
    borderRadius: 8,
    padding: 4,
  },
  userContainer: {
    marginLeft: 'auto',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 12,
    paddingBottom: 30,
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowOffset: { width: 0, height: -2 },
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  menuText: {
    fontSize: 16,
    color: '#222',
    marginLeft: 8,
  },
  leftAction: {
    backgroundColor: '#4caf50',
    justifyContent: 'center',
    flex: 1,
    paddingLeft: 20,
    borderRadius: 10,
  },
  leftActionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default MessageItem;
