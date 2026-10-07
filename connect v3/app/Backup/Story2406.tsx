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
  ActivityIndicator,
  Alert,
  Modal,
  TextInput
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import storiesDataFromAPI from '../data/Story';
import StoryViewerModal from '../modals/StoryViewerModal';
import AddStory from '../modals/story/components/AddStory';

const screenWidth = Dimensions.get('window').width;

const initialYourStoryItem = {
  id: 'your_story',
  isYourStory: true,
  avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  name: 'You',
  stories: [],
};

const StoryItem = ({ item, onPress }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const lastImage = item.stories?.[item.stories.length - 1]?.image || null;

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

  if (!item.isYourStory && (imageError || !lastImage)) {
    return (
      <TouchableOpacity style={styles.storyWrapper} onPress={() => onPress(item)} activeOpacity={0.8}>
        <View style={[styles.storyBox, { backgroundColor: '#ccc' }]}>
          {renderOverlay()}
        </View>
      </TouchableOpacity>
    );
  }

  if (item.isYourStory || !lastImage) {
      return (
          <TouchableOpacity style={styles.storyWrapper} onPress={() => onPress(item)} activeOpacity={0.8}>
              <View style={[styles.storyBox, { backgroundColor: '#f0f0f0', borderColor: item.isYourStory ? '#ccc' : '#e0e0e0' }]}>
                  {item.isYourStory && (
                      <View style={styles.yourStoryContent}>
                          {item.stories.length > 0 ? (
                            <ImageBackground
                                source={{ uri: lastImage }}
                                style={styles.storyBox}
                                imageStyle={styles.storyImage}
                                onError={() => setImageError(true)}
                                onLoad={handleImageLoad}
                            >
                                {}
                                <Text style={styles.yourStoryTextOverlay}>Your Story</Text>
                            </ImageBackground>
                          ) : (
                            <>
                                <Icon name="add-circle" size={30} color="#CACCCB" />
                                <Text style={styles.yourStoryText}>Your Story</Text>
                            </>
                          )}
                      </View>
                  )}
                  {!item.isYourStory && renderOverlay()} {}
              </View>
          </TouchableOpacity>
      );
  }


  return (
    <TouchableOpacity style={styles.storyWrapper} onPress={() => onPress(item)} activeOpacity={0.8}>
      <ImageBackground
        source={{ uri: lastImage }}
        style={[styles.storyBox, { borderColor }]}
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
  const [addStoryModalVisible, setAddStoryModalVisible] = useState(false);

  const [currentUserIndex, setCurrentUserIndex] = useState(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  const [allStories, setAllStories] = useState(() => {
    return [initialYourStoryItem, ...storiesDataFromAPI];
  });

  const yourStory = allStories.find(item => item.isYourStory);
  const otherStories = allStories.filter(item => !item.isYourStory);


  const openStory = useCallback((user) => {
    if (user.isYourStory) {
      setAddStoryModalVisible(true);
      return;
    }
    const index = allStories.findIndex(s => s.id === user.id);
    setCurrentUserIndex(index);
    setCurrentStoryIndex(0);
    setModalVisible(true);
  }, [allStories]);

  const closeModal = useCallback(() => {
    setModalVisible(false);
    setCurrentUserIndex(null);
    setCurrentStoryIndex(0);
  }, []);

  const addStoryClose = () => {
    setAddStoryModalVisible(false);
  };


  const handleViewYourStory = useCallback(() => {
    const index = allStories.findIndex(item => item.isYourStory);
    if (index !== -1) {
      setCurrentUserIndex(index);
      setCurrentStoryIndex(0);
      setModalVisible(true);
    }
    setAddStoryModalVisible(false);
  }, [allStories]);

  const handleStoryAdded = useCallback((imageUri, caption) => {
    setAllStories(prev => {
      const updated = [...prev];
      const yourStoryIndex = updated.findIndex(item => item.isYourStory);
      
      if (yourStoryIndex !== -1) {
        const newStory = {
          id: Date.now().toString(),
          image: imageUri,
          caption: caption || '',
          createdAt: new Date().toISOString(),
          viewed: false,
        };

        console.log("New Story: ", newStory);
        
        updated[yourStoryIndex] = {
          ...updated[yourStoryIndex],
          stories: [...updated[yourStoryIndex].stories, newStory]
        };
      }
      
      return updated;
    });
  }, []);


  const handleAddStory = async () => {
    Alert.alert("Error", "use brain.!!");
  };


  const handleNextStory = useCallback(() => {
    const currentUser = allStories[currentUserIndex];
    if (currentStoryIndex < currentUser.stories.length - 1) {
      setCurrentStoryIndex(i => i + 1);
    } else if (currentUserIndex < allStories.length - 1) {
      let nextIndex = currentUserIndex + 1;
      while (nextIndex < allStories.length && allStories[nextIndex].isYourStory) {
          nextIndex++;
      }
      if (nextIndex < allStories.length) {
          setCurrentUserIndex(nextIndex);
          setCurrentStoryIndex(0);
      } else {
          closeModal();
      }
    } else {
      closeModal();
    }
  }, [currentUserIndex, currentStoryIndex, allStories, closeModal]);

  const handlePrevStory = useCallback(() => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(i => i - 1);
    } else if (currentUserIndex > 0) {
      let prevIndex = currentUserIndex - 1;
      while (prevIndex >= 0 && allStories[prevIndex].isYourStory) {
          prevIndex--;
      }
      if (prevIndex >= 0) {
          const prevStories = allStories[prevIndex].stories;
          setCurrentUserIndex(prevIndex);
          setCurrentStoryIndex(prevStories.length - 1);
      } else {
          closeModal();
      }
    } else {
      closeModal();
    }
  }, [currentStoryIndex, currentUserIndex, allStories, closeModal]);

  const handleNextUser = useCallback(() => {
    if (currentUserIndex !== null && currentUserIndex < allStories.length - 1) {
        let nextIndex = currentUserIndex + 1;
        while (nextIndex < allStories.length && allStories[nextIndex].isYourStory) {
            nextIndex++;
        }
        if (nextIndex < allStories.length) {
            setCurrentUserIndex(nextIndex);
            setCurrentStoryIndex(0);
        } else {
            closeModal();
        }
    } else {
      closeModal();
    }
  }, [currentUserIndex, allStories, closeModal]);

  const handlePrevUser = useCallback(() => {
    if (currentUserIndex !== null && currentUserIndex > 0) {
        let prevUserIndex = currentUserIndex - 1;
        while (prevUserIndex >= 0 && allStories[prevUserIndex].isYourStory) {
            prevUserIndex--;
        }
        if (prevUserIndex >= 0) {
            const prevStoriesLength = allStories[prevUserIndex].stories.length;
            setCurrentUserIndex(prevUserIndex);
            setCurrentStoryIndex(prevStoriesLength - 1);
        } else {
            closeModal();
        }
    } else {
      closeModal();
    }
  }, [currentUserIndex, allStories, closeModal]);


  const currentUser = currentUserIndex !== null ? allStories[currentUserIndex] : null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={allStories}
        renderItem={({ item }) => <StoryItem item={item} onPress={openStory} />}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.storyList}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={3}
      />

      {}
      {currentUser && !currentUser.isYourStory && (
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

      {}
      <AddStory
        isVisible={addStoryModalVisible}
        onClose={addStoryClose}
        yourStory={yourStory}
        onViewStory={handleViewYourStory}
        onStoryAdded={handleStoryAdded}
      />
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
    resizeMode: 'cover',
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
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  yourStoryText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 2,
    fontWeight: '600',
  },
  addIconOverlay: {
    position: 'absolute',
    bottom: 30,
    zIndex: 1,
  },
  yourStoryTextOverlay: {
    position: 'absolute',
    bottom: 10,
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    zIndex: 1,
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
  postStoryModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  postStoryContent: {
    width: '90%',
    height: 'auto',
    backgroundColor: '#1C1C1C',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  finalStoryImagePreview: {
    width: screenWidth * 0.8,
    height: screenWidth * 0.8 * (4/3),
    borderRadius: 10,
    resizeMode: 'contain',
    marginBottom: 20,
    backgroundColor: '#333',
  },
  captionInput: {
    width: '100%',
    minHeight: 80,
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#fff',
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  postStoryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '80%',
    alignItems: 'center',
  },
  postStoryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default StoryScreen;