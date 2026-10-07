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
  Pressable,
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
  if (status === 'sending') return <ActivityIndicator size="small" color="rgba(0,0,0,0.4)" />;
  if (status === 'sent') return <Icon name="done" size={16} color="rgba(0,0,0,0.4)" />;
  if (status === 'delivered') return <Icon name="done-all" size={16} color="rgba(0,0,0,0.4)" />;
  if (status === 'seen') return <Icon name="done-all" size={16} color="rgba(35, 18, 225, 0.4)" />;
  return null;
};

export default function MessageItem({ message, onLongPress, onReply, onReaction }) {
  const status = message.isUser
    ? ['sent', 'delivered', 'seen'].includes(message.status)
      ? message.status
      : 'sending'
    : null;

  const pan = React.useRef(new Animated.ValueXY()).current;
  
  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        const { dx, dy } = gestureState;
        return Math.abs(dx) > Math.abs(dy) * 2;
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (_, gesture) => {
        if (Math.abs(gesture.dx) > SCREEN_WIDTH * 0.15) {
          onReply?.(message);
        }
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
      onPanResponderTerminate: () => {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  const renderContent = () => {
    const contentProps = {
      message,
      onPress: () => {}
    };

    switch (message.type) {
      case 'text':
        return <TextMessage {...contentProps} />;
      case 'image':
        return <ImageMessage {...contentProps} />;
      case 'video':
        return <VideoMessage {...contentProps} />;
      case 'audio':
        return <AudioMessage {...contentProps} />;
      default:
        return null;
    }
  };

  return (
    <Animated.View
      style={[styles.fullWidthContainer, { transform: [{ translateX: pan.x }] }]}
      {...panResponder.panHandlers}
    >
      <View style={[
        styles.messageContainer, 
        message.isUser ? styles.userMessageContainer : styles.otherMessageContainer
      ]}>
        {message.replyTo && (
          <View style={[
            styles.replyPreview,
            message.isUser ? styles.userReplyPreview : styles.otherReplyPreview
          ]}>
            <Text style={styles.replySender}>
              {message.replyTo.sender}
            </Text>
            <Text style={styles.replyContent} numberOfLines={1}>
              {message.replyTo.content || 'Media'}
            </Text>
          </View>
        )}
        
        <View
            style={[
              styles.bubbleContainer, 
              message.isUser ? styles.userBubbleContainer : styles.otherBubbleContainer
            ]}
          >
          {}
          <Pressable
            onLongPress={(e) => onLongPress?.(message, e)}
            style={[
              styles.bubble, 
              message.isUser ? styles.userBubble : styles.otherBubble
            ]}
            delayLongPress={300}
          >
            {renderContent()}
          </Pressable>
          
          <View style={styles.timeStatusContainer}>
            {!message.isUser && (
              <Text style={[styles.timeText, styles.otherTimeText]}>
                {formatTime(message.time)}
              </Text>
            )}
            
            {message.isUser && (
              <>
                <Text style={[styles.timeText, styles.userTimeText]}>
                  {formatTime(message.time)}
                </Text>
                <View style={styles.statusContainer}>
                  <StatusIcon status={status} />
                </View>
              </>
            )}
          </View>
        </View>
        
        {message.reaction && (
      <View style={[
        styles.reactionsContainer,
        message.isUser ? styles.userReactions : styles.otherReactions
      ]}>
        <Text style={styles.reactionText}>
          {message.reaction}
        </Text>
      </View>
    )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fullWidthContainer: {
    width: '100%',
  },
  messageContainer: {
    marginVertical: 4,
    maxWidth: '80%',
    alignSelf: 'flex-start',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  bubbleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  userBubbleContainer: {
    flexDirection: 'row-reverse',
  },
  otherBubbleContainer: {
    flexDirection: 'row',
  },
  bubble: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    overflow: 'hidden',
    maxWidth: '100%',
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
    flexDirection: 'column',
    marginHorizontal: 6,
    marginBottom: 4,
  },
  timeText: {
    fontSize: 10,
  },
  userTimeText: {
    color: 'rgba(0,0,0,0.5)',
  },
  otherTimeText: {
    color: 'rgba(0,0,0,0.5)',
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  replyPreview: {
    borderLeftWidth: 3,
    paddingLeft: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 4,
    padding: 4,
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
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    paddingHorizontal: 4,
    paddingRight: 0,
    paddingVertical: 2,
    marginTop: -10,
    flexWrap: 'wrap',
  },
  userReactions: {
    alignSelf: 'flex-end',
  },
  otherReactions: {
    alignSelf: 'flex-start',
  },
  reactionItem: {
    marginHorizontal: 2,
    padding: 2,
  },
  reactionText: {
    fontSize: 16,
    paddingRight: 4,
  },
});