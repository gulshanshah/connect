import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  Modal, 
  Text, 
  Animated, 
  PanResponder,
  Alert 
} from 'react-native';
import { BASE_URL } from "../assets/config";

const yourStory = {
  id: 0,
  user: 'Your Story',
  profileImage: `${BASE_URL}uploads/default.png`,
  storyImages: [],
};

const StoryItem = () => {
  const [storiesData, setStoriesData] = useState([]);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch(`${BASE_URL}api/posts/stories`);
        const data = await response.json();
        const storiesArray = Array.isArray(data) ? data : data.stories;
        if (!storiesArray) {
          throw new Error('No stories found in the API response.');
        }
        const mappedStories = storiesArray.map((story) => ({
          id: story.storyId,
          user: story.user.username,
          profileImage: story.user.profilePicture,
          storyImages: story.images,
          postedAt: story.postedAt,
        }));
        setStoriesData(mappedStories);
      } catch (error) {
        console.error('Error fetching stories:', error);
      }
    };

    fetchStories();
  }, []);

  const combinedStories = [yourStory, ...storiesData];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (selectedStoryIndex !== null) {
      progress.setValue(0);
      Animated.timing(progress, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: false,
      }).start();
      timer = setTimeout(() => {
        goToNextImage();
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [selectedStoryIndex, currentImageIndex]);

  const goToNextImage = () => {
    if (selectedStoryIndex !== null) {
      const currentStory = storiesData[selectedStoryIndex];
      if (!currentStory) return;
      if (currentImageIndex < currentStory.storyImages.length - 1) {
        setCurrentImageIndex(currentImageIndex + 1);
      } else {
        goToNextStory();
      }
    }
  };

  const goToPreviousImage = () => {
    if (selectedStoryIndex !== null && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    } else {
      goToPreviousStory();
    }
  };

  const goToNextStory = () => {
    if (selectedStoryIndex !== null) {
      if (selectedStoryIndex < storiesData.length - 1) {
        setSelectedStoryIndex(selectedStoryIndex + 1);
        setCurrentImageIndex(0);
      } else {
        setSelectedStoryIndex(null);
      }
    }
  };

  const goToPreviousStory = () => {
    if (selectedStoryIndex !== null && selectedStoryIndex > 0) {
      setSelectedStoryIndex(selectedStoryIndex - 1);
      const previousStory = storiesData[selectedStoryIndex - 1];
      setCurrentImageIndex(previousStory ? previousStory.storyImages.length - 1 : 0);
    }
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx > 50) {
        goToPreviousImage();
      } else if (gestureState.dx < -50) {
        goToNextImage();
      } else if (gestureState.dy > 100) {
        setSelectedStoryIndex(null);
      }
    },
  });

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', padding: 10 }}>
        <FlatList
          horizontal
          data={combinedStories}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity 
              onPress={() => { 
                if (item.id === 0) {
                  Alert.alert('Your Story', 'Coming soon in next updates!');
                } else {
                  setSelectedStoryIndex(index - 1);
                  setCurrentImageIndex(0);
                }
              }}
              style={{ alignItems: 'center', marginHorizontal: 5 }}
            >
              <Image 
                source={{ uri: BASE_URL + item.profileImage }} 
                style={{
                  width: 67, 
                  height: 67, 
                  borderRadius: 30, 
                  borderWidth: 3, 
                  borderColor: item.id === 0 ? 'gray' : '#ff8501',
                }} 
              />
              <Text style={{ color: 'black', fontSize: 14, marginTop: 5 }}>
                {item.user}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {selectedStoryIndex !== null && storiesData[selectedStoryIndex] && (
        <Modal visible={true} transparent>
          <Animated.View 
            {...panResponder.panHandlers}
            style={{ 
              flex: 1, 
              backgroundColor: 'black', 
              justifyContent: 'center', 
              alignItems: 'center',
              transform: [{ translateY }]
            }}
          >
            <View style={{ 
              position: 'absolute', 
              top: 20, 
              flexDirection: 'row', 
              width: '90%', 
              justifyContent: 'space-between', 
              zIndex: 10
            }}>
              {storiesData[selectedStoryIndex].storyImages.map((_, i) => (
                <View key={i} style={{ 
                  flex: 1, 
                  height: 3, 
                  backgroundColor: 'gray', 
                  marginHorizontal: 2, 
                  overflow: 'hidden'
                }}>
                  {i === currentImageIndex && (
                    <Animated.View 
                      style={{ 
                        height: '100%', 
                        width: progress.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0%', '100%']
                        }), 
                        backgroundColor: 'white' 
                      }} 
                    />
                  )}
                </View>
              ))}
            </View>

            <View style={{ 
              position: 'absolute', 
              top: 40, 
              left: 20, 
              flexDirection: 'row', 
              alignItems: 'center', 
              zIndex: 10 
            }}>
              <Image 
                source={{ uri: BASE_URL + storiesData[selectedStoryIndex].profileImage }} 
                style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
              />
              <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
                {storiesData[selectedStoryIndex].user}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', width: '100%', height: '100%' }}>
              <TouchableOpacity 
                style={{ flex: 1 }} 
                activeOpacity={1} 
                onPress={goToPreviousImage}
              />
              <Image 
                source={{ uri: BASE_URL + storiesData[selectedStoryIndex].storyImages[currentImageIndex] }} 
                style={{ width: '100%', height: '100%' }} 
                resizeMode="contain"
              />
              <TouchableOpacity 
                style={{ flex: 1 }} 
                activeOpacity={1} 
                onPress={goToNextImage}
              />
            </View>
          </Animated.View>
        </Modal>
      )}
    </View>
  );
};

export default StoryItem;
