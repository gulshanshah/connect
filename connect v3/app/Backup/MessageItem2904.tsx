import React from 'react';
import { View, StyleSheet } from 'react-native';
import TextMessage from './MessageList/TextMessage';
import ImageMessage from './MessageList/ImageMessage';
import VideoMessage from './MessageList/VideoMessage';
import AudioMessage from './MessageList/AudioMessage';

const MessageItem = ({ message }: { message: any }) => {
  const renderContent = () => {
    switch (message.type) {
      case 'text':
        return <TextMessage message={message} />;
      case 'image':
        return <ImageMessage message={message} />;
      case 'video':
        return <VideoMessage message={message} />;
      case 'audio':
        return <AudioMessage message={message} />;
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, message.isUser && styles.userContainer]}>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: '80%',
    marginVertical: 8,
    alignSelf: 'flex-start',
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
});

export default MessageItem;