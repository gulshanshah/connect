import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Animated,
  LayoutAnimation,
  Pressable,
} from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../constants/ThemeContext';

const { width, height } = Dimensions.get('window');

const formatTime = (date) => {
  const diff = (Date.now() - date.getTime()) / 1000;
  if (diff < 5) return 'just now';
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const CommentModal = ({ visible, onClose }) => {
  const [comments, setComments] = useState(dummyComments);
  const [inputText, setInputText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const flatListRef = useRef(null);

  useEffect(() => {
    if (visible && comments.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [visible, comments.length]);

  const createLikeAnimation = () => {
    const animValue = new Animated.Value(1);
    const onPressIn = () => {
      Animated.spring(animValue, {
        toValue: 0.8,
        useNativeDriver: true,
      }).start();
    };
    const onPressOut = () => {
      Animated.spring(animValue, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }).start();
    };
    return { animValue, onPressIn, onPressOut };
  };

  const toggleLike = (commentId, replyId = null) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const updated = comments.map((comment) => {
      if (comment.id === commentId) {
        if (replyId) {
          const replies = comment.replies.map((reply) =>
            reply.id === replyId ? { ...reply, liked: !reply.liked, likes: reply.liked ? reply.likes - 1 : reply.likes + 1 } : reply
          );
          return { ...comment, replies };
        }
        return { ...comment, liked: !comment.liked, likes: comment.liked ? comment.likes - 1 : comment.likes + 1 };
      }
      return comment;
    });
    setComments(updated);
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newCommentData = {
      user: { name: 'CurrentUser', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
      text: inputText,
      liked: false,
      likes: 0,
      replies: [],
      timestamp: new Date(),
    };

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (replyingTo) {
      const newReply = { ...newCommentData, id: `${replyingTo.id}-${Date.now()}` };
      const updatedComments = comments.map((comment) => {
        if (comment.id === replyingTo.id) {
          return {
            ...comment,
            replies: [...comment.replies, newReply],
          };
        }
        return comment;
      });
      setComments(updatedComments);
    } else {
      const newComment = { ...newCommentData, id: Date.now().toString() };
      setComments([...comments, newComment]);
    }

    setInputText('');
    setReplyingTo(null);
  };

  const renderReply = (reply, commentId) => {
    const { animValue, onPressIn, onPressOut } = createLikeAnimation();
    return (
    <View key={reply.id} style={styles.replyContainer}>
      <Image source={{ uri: reply.user.avatar }} style={styles.avatarSmall} />
      <View style={styles.replyContent}>
        <View style={styles.commentHeader}>
          <Text style={styles.username}>{reply.user.name}</Text>
          <Text style={styles.timestamp}>{formatTime(reply.timestamp)}</Text>
        </View>
        <Text style={styles.commentText}>{reply.text}</Text>
      </View>
      <Pressable
        onPress={() => toggleLike(commentId, reply.id)}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={styles.likeButtonContainer}
      >
        <Animated.View style={{ transform: [{ scale: animValue }] }}>
          <Icon
            name={reply.liked ? 'heart' : 'heart-outline'}
            size={18}
            color={reply.liked ? styles.likedColor.color : styles.iconColor.color}
          />
        </Animated.View>
        {reply.likes > 0 && <Text style={styles.likeCount}>{reply.likes}</Text>}
      </Pressable>
    </View>
  )};

  const CommentItem = React.memo(({ item }) => {
    const { animValue, onPressIn, onPressOut } = createLikeAnimation();
    return (
    <View style={styles.commentItemContainer}>
      <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={styles.username}>{item.user.name}</Text>
          <Text style={styles.timestamp}>{formatTime(item.timestamp)}</Text>
        </View>
        <Text style={[styles.commentText, { color: theme.text }]}>{item.text}</Text>
        <TouchableOpacity
          style={styles.replyActionButton}
          onPress={() => setReplyingTo({ id: item.id, username: item.user.name })}
        >
          <Icon name="arrow-undo-outline" size={16} color="#555" />
          <Text style={styles.replyButtonText}>Reply</Text>
        </TouchableOpacity>
        {item.replies.map((reply) => renderReply(reply, item.id))}
      </View>
      <Pressable
        onPress={() => toggleLike(item.id)}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={styles.likeButtonContainer}
      >
        <Animated.View style={{ transform: [{ scale: animValue }] }}>
          <Icon
            name={item.liked ? 'heart' : 'heart-outline'}
            size={22}
            color={item.liked ? styles.likedColor.color : styles.iconColor.color}
          />
        </Animated.View>
        {item.likes > 0 && <Text style={styles.likeCount}>{item.likes}</Text>}
      </Pressable>
    </View>
  )});

  const theme = useTheme();

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      backdropTransitionOutTiming={0}
      style={styles.modal}
      avoidKeyboard
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoidingContainer}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
      >
        <View style={[styles.modalContentContainer, { backgroundColor: theme.card }]}>
          <View style={styles.header}>
            <Text style={styles.title}>Comments ({comments.length + comments.reduce((acc,c) => acc + c.replies.length, 0)})</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close-outline" size={30} color="#333" />
            </TouchableOpacity>
          </View>

          <FlatList
            ref={flatListRef}
            data={comments}
            renderItem={({ item }) => <CommentItem item={item} />}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            keyboardDismissMode="interactive"
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => {
                if (!replyingTo && comments.length > 0) {
                }
            }}
            onLayout={() => {
                 if (!replyingTo && comments.length > 0) {
                }
            }}
          />

          <View style={styles.inputWrapper}>
            {replyingTo && (
              <View style={styles.replyingToBanner}>
                <Text style={styles.replyingToText}>Replying to @{replyingTo.username}</Text>
                <TouchableOpacity onPress={() => setReplyingTo(null)} style={styles.closeReplyButton}>
                  <Icon name="close-circle-outline" size={22} color="#666" />
                </TouchableOpacity>
              </View>
            )}
            <View style={styles.inputContainer}>
               <Image
                  source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
                  style={styles.inputAvatar}
                />
              <TextInput
                value={inputText}
                onChangeText={setInputText}
                placeholder={replyingTo ? `Reply to @${replyingTo.username}...` : 'Add a comment...'}
                placeholderTextColor="#888"
                style={styles.input}
                multiline
                onSubmitEditing={handleSend}
                blurOnSubmit={false}
              />
              <TouchableOpacity
                onPress={handleSend}
                disabled={!inputText.trim()}
                style={[styles.sendButton, !inputText.trim() && styles.disabledSendButton]}
              >
                <Icon
                  name="arrow-up-circle"
                  size={32}
                  color={!inputText.trim() ? '#BDBDBD' : '#FF406E'}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  keyboardAvoidingContainer: {
  },
  modalContentContainer: {
    height: height * 0.87,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    display: 'flex',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 20 : 30,
  },
  commentItemContainer: {
    flexDirection: 'row',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
    marginRight: 8,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  username: {
    fontWeight: '700',
    color: '#222222',
    marginRight: 8,
    fontSize: 14,
  },
  timestamp: {
    fontSize: 11,
    color: '#888888',
  },
  commentText: {
    fontSize: 14,
    lineHeight: 21,
  },
  replyActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingVertical: 5,
    alignSelf: 'flex-start',
  },
  replyButtonText: {
    color: '#555555',
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 5,
  },
  likeButtonContainer: {
    paddingLeft: 10,
    paddingTop: 0,
    alignItems: 'center',
    minWidth: 40,
  },
  likeCount: {
    fontSize: 11,
    color: '#777777',
    marginTop: 3,
  },
  likedColor: { color: '#FF406E' },
  iconColor: { color: '#777777' },
  replyContainer: {
    flexDirection: 'row',
    marginTop: 12,
  },
  avatarSmall: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  replyContent: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#F8F9FA',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  inputWrapper: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 25 : 8,
    paddingHorizontal: 15,
  },
  replyingToBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    marginBottom: 8,
  },
  replyingToText: {
    color: '#555555',
    fontSize: 13,
    flexShrink: 1,
  },
  closeReplyButton: {
    padding: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  inputAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    marginRight: 10,
    marginBottom: Platform.OS === 'ios' ? 5 : 5,
  },
  input: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 10 : 8,
    paddingBottom: Platform.OS === 'ios' ? 10 : 8,
    fontSize: 15,
    color: '#222222',
    maxHeight: 100,
    minHeight: 40,
    textAlignVertical: 'center',
  },
  sendButton: {
    marginLeft: 10,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    marginBottom: Platform.OS === 'ios' ? 5 : 5,
  },
  disabledSendButton: {
  },
});

const dummyComments = [
  {
    id: '1',
    user: {
      name: 'john_doe',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    text: 'This is a really insightful post! I learned a lot. Thanks for sharing this with us. Keep up the great work!',
    liked: false,
    likes: 12,
    timestamp: new Date(Date.now() - 300000),
    replies: [
      {
        id: '1-1',
        user: {
          name: 'jane_smith',
          avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
        },
        text: 'Totally agree! Looking forward to more.',
        liked: true,
        likes: 5,
        timestamp: new Date(Date.now() - 240000),
      },
       {
        id: '1-2',
        user: {
          name: 'dev_guru',
          avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
        },
        text: 'Nice component structure.',
        liked: false,
        likes: 2,
        timestamp: new Date(Date.now() - 180000),
      },
    ],
  },
  {
    id: '2',
    user: {
      name: 'creative_cat',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    },
    text: 'Love the design! 🎨 What tools did you use for the mockups?',
    liked: true,
    likes: 31,
    timestamp: new Date(Date.now() - 1200000),
    replies: [],
  },
  {
    id: '3',
    user: {
      name: 'tech_explorer',
      avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
    },
    text: 'Just a short comment here. Looks good.',
    liked: false,
    likes: 3,
    timestamp: new Date(Date.now() - 7200000),
    replies: [],
  },
];

export default CommentModal;