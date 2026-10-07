import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  ImageBackground,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import storiesData from '../data/Story';
import StoryViewerModal from '../modals/StoryViewerModal';

const screenWidth = Dimensions.get('window').width;

const yourStoryItem = {
  id: 'your_story',
  isYourStory: true,
  avatar: '',
  name: 'You',
  stories: [],
};

const StoryItem = ({ item, onPress }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const lastImage = item.stories?.[item.stories.length - 1]?.image;

  const handleImageLoad = () => setImageLoading(false);
  const borderColor = item.stories?.some(s => !s.viewed) ? '#e1306c' : '#999';

  const renderOverlay = () => (
    item.isYourStory ? (
      <View style={styles.yourStoryContent}>
        <Icon name="add-circle" size={30} color="#CACCCB" />
        <Text style={styles.yourStoryText}>Your Story</Text>
      </View>
    ) : (
      <>
        <Image
          source={{ uri: item.avatar }}
          style={[styles.avatarSmall, { borderColor }]}
        />
        <View style={styles.nameOverlay}>
          <Text style={styles.nameText}>{item.name}</Text>
        </View>
      </>
    )
  );

  if (imageError || !lastImage) {
    return (
      <TouchableOpacity style={styles.storyWrapper} onPress={() => onPress(item)} activeOpacity={0.8}>
        <View style={[styles.storyBox, { backgroundColor: '#ccc' }]}>
          {renderOverlay()}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.storyWrapper} onPress={() => onPress(item)} activeOpacity={0.8}>
      <ImageBackground
        source={{ uri: lastImage }}
        style={styles.storyBox}
        imageStyle={styles.storyImage}
        onError={() => setImageError(true)}
        onLoad={handleImageLoad}
      >
        {imageLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#000" />
          </View>
        )}
        {renderOverlay()}
      </ImageBackground>
    </TouchableOpacity>
  );
};

const StoryScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentUserIndex, setCurrentUserIndex] = useState(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  const openStory = useCallback((user) => {
    if (user.isYourStory) {
      console.log('Open add your story screen');
      return;
    }
    const index = storiesData.findIndex(s => s.id === user.id);
    setCurrentUserIndex(index);
    setCurrentStoryIndex(0);
    setModalVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
    setCurrentUserIndex(null);
    setCurrentStoryIndex(0);
  }, []);

  const handleNextStory = useCallback(() => {
    const currentUser = storiesData[currentUserIndex];
    if (currentStoryIndex < currentUser.stories.length - 1) {
      setCurrentStoryIndex(i => i + 1);
    } else if (currentUserIndex < storiesData.length - 1) {
      setCurrentUserIndex(i => i + 1);
      setCurrentStoryIndex(0);
    } else {
      closeModal();
    }
  }, [currentUserIndex, currentStoryIndex, closeModal]);

  const handlePrevStory = useCallback(() => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(i => i - 1);
    } else if (currentUserIndex > 0) {
      const prevIndex = currentUserIndex - 1;
      const prevStories = storiesData[prevIndex].stories;
      setCurrentUserIndex(prevIndex);
      setCurrentStoryIndex(prevStories.length - 1);
    } else {
      closeModal();
    }
  }, [currentStoryIndex, currentUserIndex, closeModal]);

  const handleNextUser = useCallback(() => {
    if (currentUserIndex !== null && currentUserIndex < storiesData.length - 1) {
      setCurrentUserIndex(i => i + 1);
      setCurrentStoryIndex(0);
    } else {
      closeModal();
    }
  }, [currentUserIndex, closeModal]);

  const handlePrevUser = useCallback(() => {
    if (currentUserIndex !== null && currentUserIndex > 0) {
      const prevUserIndex = currentUserIndex - 1;
      const prevStoriesLength = storiesData[prevUserIndex].stories.length;
      setCurrentUserIndex(prevUserIndex);
      setCurrentStoryIndex(prevStoriesLength - 1);
    } else {
      closeModal();
    }
  }, [currentUserIndex, closeModal]);

  const currentUser = currentUserIndex !== null ? storiesData[currentUserIndex] : null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={[yourStoryItem, ...storiesData]}
        renderItem={({ item }) => <StoryItem item={item} onPress={openStory} />}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.storyList}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={3}
      />
      {currentUser && (
        <StoryViewerModal
          visible={modalVisible}
          onClose={closeModal}
          stories={currentUser.stories}
          currentStoryIndex={currentStoryIndex}
          user={{
            name: currentUser.name,
            avatar: currentUser.avatar,
            fullName: currentUser.fullName || '',
          }}
          onNextStory={handleNextStory}
          onPrevStory={handlePrevStory}
          onNextUser={handleNextUser}
          onPrevUser={handlePrevUser}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: 5,
  },
  storyList: {
    paddingLeft: 5,
    paddingRight: 5,
  },
  storyWrapper: {
    marginRight: 0,
    padding: 4,
  },
  storyBox: {
    width: 100,
    height: 120,
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    borderWidth: 3,
    borderColor: '#e0e0e0',
  },
  storyImage: {
    borderRadius: 10,
  },
  avatarSmall: {
    position: 'absolute',
    top: 6,
    left: 6,
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
  },
  yourStoryContent: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingVertical: 6,
    backgroundColor: 'rgba(0,0,0,0.4)',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  yourStoryText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 2,
    fontWeight: '600',
  },
  nameOverlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    width: '100%',
    paddingVertical: 4,
    alignItems: 'center',
  },
  nameText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
});

export default StoryScreen;
