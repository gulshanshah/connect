import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import TextMessage from './MessageList/TextMessage';
import ImageMessage from './MessageList/ImageMessage';
import VideoMessage from './MessageList/VideoMessage';
import AudioMessage from './MessageList/AudioMessage';

const SCREEN_WIDTH = Dimensions.get('window').width;

const formatTime = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const h = date.getHours() % 12 || 12;
  const m = date.getMinutes().toString().padStart(2, '0');
  const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
  return `${h}:${m} ${ampm}`;
};

const StatusIcon = ({ status }) => {
  if (status === 'sending') return <ActivityIndicator size="small" color="rgba(255,255,255,0.7)" />;
  if (status === 'sent') return <Icon name="access-time" size={12} color="rgba(255,255,255,0.7)" />;
  if (status === 'delivered') return <Icon name="done" size={12} color="rgba(255,255,255,0.7)" />;
  if (status === 'seen') return <Icon name="done-all" size={12} color="rgba(255,255,255,0.7)" />;
  return null;
};

export default function MessageItem({ message, onLongPress, onReply }) {
  const status = message.isUser
    ? ['sent', 'delivered', 'seen'].includes(message.status)
      ? message.status
      : 'sending'
    : null;

  const pan = React.useRef(new Animated.ValueXY()).current;
  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (e, gesture) => {
        if (Math.abs(gesture.dx) > SCREEN_WIDTH * 0.15) {
          onReply?.(message);
        }
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

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
    <Animated.View
      style={[styles.container, { transform: [{ translateX: pan.x }] }]}
      {...panResponder.panHandlers}
    >
      <View style={[
        styles.bubbleWrapper,
        message.isUser ? styles.userAlign : styles.otherAlign
      ]}>
        {message.replyTo && (
          <View style={[
            styles.replyPreview,
            message.isUser ? styles.userReplyPreview : styles.otherReplyPreview
          ]}>
            <Text style={styles.replySender}>{message.replyTo.sender}</Text>
            <Text style={styles.replyContent} numberOfLines={1}>
              {message.replyTo.content || 'Media'}
            </Text>
          </View>
        )}

        <TouchableOpacity
          onLongPress={(e) => onLongPress?.(message, e)}
          activeOpacity={0.8}
          style={[
            styles.bubble,
            message.isUser ? styles.userBubble : styles.otherBubble
          ]}
        >
          {renderContent()}

          {}
          <View style={styles.timeStatusContainer}>
            <Text style={[styles.timeText, message.isUser ? styles.userTimeText : styles.otherTimeText]}> 
              {formatTime(message.time)}
            </Text>
            {message.isUser && (
              <View style={styles.statusContainer}>
                <StatusIcon status={status} />
              </View>
            )}
          </View>
        </TouchableOpacity>

        {message.reactions?.length > 0 && (
          <View style={[
            styles.reactionsContainer,
            message.isUser ? styles.userReactions : styles.otherReactions
          ]}>
            {message.reactions.map((reaction, index) => (
              <Text key={index} style={styles.reactionText}>
                {reaction.emoji}{reaction.count > 1 ? ` ${reaction.count}` : ''}
              </Text>
            ))}
          </View>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 4,
  },
  bubbleWrapper: {
    maxWidth: '80%',
  },
  userAlign: {
    alignSelf: 'flex-end',
  },
  otherAlign: {
    alignSelf: 'flex-start',
  },
  bubble: {
    borderRadius: 8,
    padding: 12,
    paddingBottom: 6,
    overflow: 'hidden',
  },
  userBubble: {
    backgroundColor: '#128C7E',
    borderBottomRightRadius: 2,
  },
  otherBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 2,
  },
  timeStatusContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
    marginTop: 4,
  },
  timeText: {
    fontSize: 10,
  },
  userTimeText: {
    color: 'rgba(255,255,255,0.7)',
  },
  otherTimeText: {
    color: 'rgba(0,0,0,0.5)',
  },
  statusContainer: {
    marginLeft: 4,
  },
  replyPreview: {
    borderLeftWidth: 3,
    paddingLeft: 8,
    marginBottom: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  userReplyPreview: {
    borderLeftColor: '#128C7E',
  },
  otherReplyPreview: {
    borderLeftColor: '#075E54',
  },
  replySender: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#555',
  },
  replyContent: {
    fontSize: 12,
    color: '#777',
  },
  reactionsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 4,
  },
  userReactions: {
    alignSelf: 'flex-end',
  },
  otherReactions: {
    alignSelf: 'flex-start',
  },
  reactionText: {
    fontSize: 14,
    marginHorizontal: 2,
  },
});
