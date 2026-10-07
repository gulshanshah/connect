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

const { width } = Dimensions.get('window');
const STORY_DURATION = 20000;

const IMAGE_RATIO_WIDTH = 3;
const IMAGE_RATIO_HEIGHT = 4;
const IMAGE_WIDTH = width;
const IMAGE_HEIGHT = (width * IMAGE_RATIO_HEIGHT) / IMAGE_RATIO_WIDTH;

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
  const slideAnim = useRef(new Animated.Value(0)).current;
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
    setPaused((prev) => !prev);
    if (!paused) {
      progressAnim.stopAnimation();
      clearTimeout(timerRef.current);
    }
  };

  const toggleCaption = () => {
    setCaptionExpanded((prev) => !prev);
    Animated.timing(captionHeightAnim, {
      toValue: captionExpanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
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

  useEffect(() => {
    slideAnim.setValue(0);
    Animated.spring(slideAnim, {
      toValue: 1,
      friction: 10,
      useNativeDriver: true,
    }).start();
  }, [currentIndex]);

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
      <TouchableOpacity activeOpacity={0.8}>
      <View style={styles.userInfo}>
        <Image source={{ uri: user.avatar }} style={styles.profileImage} />
        <View style={styles.userText}>
          <Text style={styles.username}>{user.name}</Text>
          <Text style={styles.timeAgo}>
            {getTimeAgo(currentStory.timestamp || Date.now() - 2 * 60 * 60 * 1000)}
          </Text>
        </View>
      </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={onClose} style={styles.closeButton} activeOpacity={0.6}>
        <Icon name="ellipsis-vertical" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footer}>
      {}

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
          <FontAwesome name="send" size={18} color="white" solid/>
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
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
        >
          <TouchableOpacity 
          style={styles.tapZone}
          />
          <TouchableOpacity
            style={[styles.storyContent, styles.tapZone]}
            activeOpacity={1}
            onPress={togglePause}
          >
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
              <Animated.View
                style={[
                  styles.captionContainer,
                  {
                    height: captionHeightAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [60, 120],
                    }),
                    opacity: captionHeightAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.7, 1],
                    }),
                  },
                ]}
              >
                <TouchableOpacity onPress={toggleCaption} activeOpacity={0.8}>
                  <Text style={styles.captionText} numberOfLines={captionExpanded ? 0 : 2}>
                    {currentStory.caption}
                  </Text>
                {!captionExpanded && <Text style={styles.moreText}>more</Text>}
                </TouchableOpacity>
              </Animated.View>
            )}

            {}
            {}

            {}
          {paused && (
              <View style={styles.pauseIndicator}>
                <Icon name="play" size={48} color="rgba(255,255,255,0.8)" />
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity 
          style={styles.tapZone}
          />

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
  storyContent: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'black',
  },tapZone: {
  },
  storyImage: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    marginTop: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: Platform.OS === 'ios' ? 40 : 20,
    left: 10,
    right: 10,
    height: 4,
    justifyContent: 'space-between',
  },
  progressBarBackground: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 2,
    borderRadius: 2,
  },
  progressBarFill: {
    height: 4,
    backgroundColor: 'white',
    borderRadius: 2,
  },
  header: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 40 : 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  },
  closeButton: {
    padding: 6,
  },
  captionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 10,
    right: 10,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  captionText: {
    color: 'white',
    fontSize: 14,
    lineHeight: 18,
  },
  moreText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    opacity: 0.7,
  },
  navContainer: {
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    flexDirection: 'row',
  },
  navLeft: {
    flex: 1,
  },
  navRight: {
    flex: 1,
  },
  pauseIndicator: {
    position: 'absolute',
    top: '45%',
    left: '45%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  reactionButton: {
    padding: 6,
    marginRight: 6,
    borderColor: '#fff',
    borderRadius: 80,
  },
  replyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 12 : 0,
    marginBottom: 10,
    width: 330,
  },
  replyInput: {
    flex: 1,
    color: 'white',
    fontSize: 14,
    maxHeight: 50,
    marginLeft: 2,
  },
  sendButton: {
    marginLeft: 10,
    marginRight: 10,
  },
});

export default StoryViewerModal;
