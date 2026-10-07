import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
  TextInput,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const { width, height } = Dimensions.get('window');
const STORY_DURATION = 7000;

const StoryViewerModal = ({
  visible,
  onClose,
  stories,
  currentStoryIndex,
  user,
  onNextStory,
  onPrevStory,
  onNextUser,
  onPrevUser,
}) => {
  const [currentIndex, setCurrentIndex] = useState(currentStoryIndex);
  const [paused, setPaused] = useState(false);
  const [captionExpanded, setCaptionExpanded] = useState(false);
  const [replyText, setReplyText] = useState('');
  const progressAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef(null);
  const captionHeightAnim = useRef(new Animated.Value(0)).current;

  const getTimeAgo = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const startProgress = () => {
    progressAnim.setValue(0);
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: STORY_DURATION,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished && !paused) handleNext();
    });
  };

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      onNextStory && onNextStory(currentIndex + 1);
    } else {
      onNextUser && onNextUser();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      onPrevStory && onPrevStory(currentIndex - 1);
    } else {
      onPrevUser && onPrevUser();
    }
  };

  const togglePause = () => {
    setPaused(prev => !prev);
  };

  const toggleCaption = () => {
    setCaptionExpanded(prev => !prev);
  };

  const handleReply = () => {
    if (replyText.trim()) {
      console.log('Reply sent:', replyText.trim());
      setReplyText('');
    }
  };

  useEffect(() => {
    setCurrentIndex(currentStoryIndex);
  }, [currentStoryIndex, visible]);

  useEffect(() => {
    if (visible && !paused) {
      startProgress();
    } else {
      progressAnim.stopAnimation();
      clearTimeout(timerRef.current);
    }
    
    return () => {
      progressAnim.stopAnimation();
      clearTimeout(timerRef.current);
    };
  }, [visible, currentIndex, paused]);

  const currentStory = stories[currentIndex] || {};

  const renderProgressBars = () => (
    <View style={styles.progressContainer}>
      {stories.map((_, i) => (
        <View key={i} style={styles.progressBarBackground}>
          <Animated.View
            style={[
              styles.progressBarFill,
              {
                width:
                  i === currentIndex
                    ? progressAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%'],
                      })
                    : i < currentIndex
                    ? '100%'
                    : '0%',
              },
            ]}
          />
        </View>
      ))}
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.userInfo}>
        <Image source={{ uri: user.avatar }} style={styles.profileImage} />
        <View style={styles.userText}>
          <Text style={styles.username}>{user.name}</Text>
          <Text style={styles.timeAgo}>
            {getTimeAgo(currentStory.timestamp || Date.now() - 2 * 60 * 60 * 1000)}
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={onClose} style={styles.closeButton} activeOpacity={0.6}>
        <Icon name="ellipsis-vertical" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.reactionButton} activeOpacity={0.6}>
        <Icon name="heart-outline" size={30} color="white" />
      </TouchableOpacity>

      <View style={styles.replyContainer}>
        <TextInput
          style={styles.replyInput}
          placeholder="Send message"
          placeholderTextColor="rgba(255,255,255,0.7)"
          value={replyText}
          onChangeText={setReplyText}
          multiline
          returnKeyType="send"
          onSubmitEditing={handleReply}
        />
        <TouchableOpacity onPress={handleReply} style={styles.sendButton}>
          <FontAwesome name="send" size={18} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardContainer}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          {}
          <View style={styles.storyContentContainer}>
            {}
            <Image
              source={{ uri: currentStory.image }}
              style={styles.storyImage}
              resizeMode="cover"
            />

            {}
            {renderProgressBars()}

            {}
            {renderHeader()}

            {}
            {currentStory.caption && (
              <View style={styles.captionContainer}>
                <TouchableOpacity onPress={toggleCaption} activeOpacity={0.8}>
                  <Text 
                    style={styles.captionText} 
                    numberOfLines={captionExpanded ? 0 : 2}
                  >
                    {currentStory.caption}
                  </Text>
                </TouchableOpacity>
                {!captionExpanded && (
                  <Text style={styles.moreText}>more</Text>
                )}
              </View>
            )}

            {}
            <View style={styles.navContainer}>
              <TouchableOpacity
                style={styles.navLeft}
                onPress={handlePrev}
                activeOpacity={0.8}
              />
              <TouchableOpacity
                style={styles.navCentre}
                onPress={togglePause}
                activeOpacity={0.8}
              />
              <TouchableOpacity
                style={styles.navRight}
                onPress={handleNext}
                activeOpacity={0.8}
              />
            </View>

            {}
            {paused && (
              <View style={styles.pauseIndicator}>
                <Icon name="play" size={48} color="rgba(255,255,255,0.8)" />
              </View>
            )}
          </View>

          {}
          {renderFooter()}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  keyboardContainer: {
    flex: 1,
  },
  storyContentContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  storyImage: {
    width: '100%',
    height: '80%',
    position: 'absolute',
    marginTop: 30,
  },
  progressContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: Platform.OS === 'ios' ? 40 : 30,
    left: 10,
    right: 10,
    height: 4,
    justifyContent: 'space-between',
    zIndex: 10,
  },
  progressBarBackground: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 2,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 2,
  },
  header: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'white',
  },
  userText: {
    marginLeft: 8,
  },
  username: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  timeAgo: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 2,
  },
  closeButton: {
    padding: 6,
  },
  captionContainer: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
    borderRadius: 10,
    padding: 15,
    zIndex: 10,
    alignItems: 'center',
  },
  captionText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 20,
  },
  moreText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    position: 'absolute',
    bottom: 0,
  },
  navContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    zIndex: 5,
  },
  navLeft: {
    flex: 1,
  },
  navCentre: {
    flex: 1,
  },
  navRight: {
    flex: 1,
  },
  pauseIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -24,
    marginTop: -24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 10,
  },
  reactionButton: {
    padding: 10,
    marginRight: 10,
  },
  replyContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  replyInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: 0,
  },
  sendButton: {
    padding: 8,
  },
});

export default StoryViewerModal;