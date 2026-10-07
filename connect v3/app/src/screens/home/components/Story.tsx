import React, { useState, useCallback, useMemo } from 'react';
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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { usersStories } from '../modals/story/Data';
import ViewStory from '../modals/story/ViewStory';
import AddStory from '../modals/story/components/AddStory';

export type UserStoriesItem = {
  id: string;
  name: string;
  avatar: string;
  isYourStory?: boolean;
  stories: Array<{
    id: string;
    image: string;
    caption: string;
    createdAt: string;
    viewed: boolean;
  }>;
};

const initialYourStoryItem: UserStoriesItem = {
  id: 'your_story',
  name: 'You',
  avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  isYourStory: true,
  stories: [
    {
      id: '4',
      name: 'buve',
      avatar: 'https://i.pravatar.cc/150?img=1',
      stories: [
        {
          id: 'a1',
          image: 'https://picsum.photos/300/500?random=211',
          caption: 'My cat is cute 🐱',
          postedTime: '2024-03-25T12:15:00',
        },
        {
          id: 'a2',
          image: 'https://picsum.photos/300/500?random=216',
          caption: 'Lunch was amazing 😋',
          postedTime: '2024-03-25T13:00:00',
        },
        {
          id: 'a3',
          image: 'https://picsum.photos/300/500?random=217',
          caption: 'New haircut! 💇♀️',
          postedTime: '2024-03-24T10:00:00',
        },
      ]
      }
  ]
};

const transformStoriesData = (usersStories): UserStoriesItem[] =>
  usersStories.map(({ user, stories }) => ({
    id: user.id,
    name: user.name,
    avatar: user.avatar,
    stories: stories.map(s => ({
      id: s.id,
      image: s.image,
      caption: s.caption,
      createdAt: s.timestamp,
      viewed: s.viewed,
    })),
  }));

const StoryItem = ({ item, onPress }: { item: UserStoriesItem; onPress: (item: UserStoriesItem) => void }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const lastImage = item.stories[item.stories.length - 1]?.image;
  const hasUnviewed = item.stories.some(s => !s.viewed);
  const borderColor = item.isYourStory
    ? '#ccc'
    : hasUnviewed
    ? '#ff3b30'
    : '#999';

  const handleImageLoad = () => setImageLoading(false);

  const renderOverlay = () => (
    item.isYourStory ? (
      <View style={styles.yourStoryContent}>
        <Image source={{ uri: item.avatar }} style={[styles.avatarSmall, { borderColor }]} />
        <Icon name="add-circle" size={30} color="#CACCCB" />
        <Text style={styles.yourStoryText}>Your Story</Text>
      </View>
    ) : (
      <>
        <Image source={{ uri: item.avatar }} style={[styles.avatarSmall, { borderColor }]} />
        <View style={styles.nameOverlay}>
          <Text style={styles.nameText}>{item.name}</Text>
        </View>
      </>
    )
  );

  const boxStyle = [styles.storyBox, { borderColor }];

  return (
    <TouchableOpacity style={styles.storyWrapper} onPress={() => onPress(item)} activeOpacity={0.8}>
      {lastImage ? (
        <ImageBackground
          source={{ uri: lastImage }}
          style={boxStyle}
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
      ) : (
        <View style={boxStyle}>
          {renderOverlay()}
        </View>
      )}
    </TouchableOpacity>
  );
};

const StoryScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [addStoryModalVisible, setAddStoryModalVisible] = useState(false);
  const [allStories, setAllStories] = useState<UserStoriesItem[]>(() => [
    initialYourStoryItem,
    ...transformStoriesData(usersStories),
  ]);
  const [currentUserIndex, setCurrentUserIndex] = useState<number | null>(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState<number>(0);
  const [viewingUnviewedOnly, setViewingUnviewedOnly] = useState<boolean>(false);

  const displayedStories = useMemo(() => {
    const you = allStories.find(i => i.isYourStory)!;
    const others = allStories.filter(i => !i.isYourStory);
    const unviewed = others.filter(u => u.stories.some(s => !s.viewed));
    const viewed = others.filter(u => u.stories.every(s => s.viewed));
    return [you, ...unviewed, ...viewed];
  }, [allStories]);

  const openStory = useCallback((user: UserStoriesItem) => {
    if (user.isYourStory) {
      setAddStoryModalVisible(true);
      return;
    }
    const uIndex = displayedStories.findIndex(u => u.id === user.id);
    const firstUnviewed = user.stories.findIndex(s => !s.viewed);
    const onlyUn = firstUnviewed >= 0;
    setViewingUnviewedOnly(onlyUn);
    setCurrentUserIndex(uIndex);
    setCurrentStoryIndex(onlyUn ? firstUnviewed : 0);
    setModalVisible(true);
  }, [displayedStories]);

  const closeModal = useCallback(() => {
    setModalVisible(false);
    setCurrentUserIndex(null);
    setCurrentStoryIndex(0);
    setViewingUnviewedOnly(false);
  }, []);

  const markViewed = useCallback(() => {
    if (currentUserIndex === null) return;
    const user = displayedStories[currentUserIndex];
    user.stories[currentStoryIndex].viewed = true;
    setAllStories(prev => prev.map(u => (u.id === user.id ? user : u)));
  }, [currentUserIndex, currentStoryIndex, displayedStories]);

  const handleNextStory = useCallback(() => {
    if (currentUserIndex === null) return;
    markViewed();
    const user = displayedStories[currentUserIndex];
    if (currentStoryIndex < user.stories.length - 1) {
      setCurrentStoryIndex(i => i + 1);
    } else {
      handleNextUser();
    }
  }, [currentUserIndex, currentStoryIndex, displayedStories, markViewed]);

  const handlePrevStory = useCallback(() => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(i => i - 1);
    } else {
      closeModal();
    }
  }, [currentStoryIndex, closeModal]);

  const handleNextUser = useCallback(() => {
    if (currentUserIndex === null) return;
    let next = currentUserIndex + 1;
    while (
      viewingUnviewedOnly &&
      next < displayedStories.length &&
      displayedStories[next].stories.every(s => s.viewed)
    ) {
      next++;
    }
    if (next < displayedStories.length) {
      const nextUser = displayedStories[next];
      const startIdx = viewingUnviewedOnly
        ? nextUser.stories.findIndex(s => !s.viewed)
        : 0;
      setCurrentUserIndex(next);
      setCurrentStoryIndex(startIdx >= 0 ? startIdx : 0);
    } else {
      closeModal();
    }
  }, [currentUserIndex, displayedStories, viewingUnviewedOnly, closeModal]);

  const handlePrevUser = useCallback(() => {
    if (currentUserIndex === null) return;
    let prev = currentUserIndex - 1;
    while (
      viewingUnviewedOnly &&
      prev > 0 &&
      displayedStories[prev].stories.every(s => s.viewed)
    ) {
      prev--;
    }
    if (prev >= 0) {
      const prevUser = displayedStories[prev];
      const startIdx = viewingUnviewedOnly
        ? prevUser.stories.findIndex(s => !s.viewed)
        : prevUser.stories.length - 1;
      setCurrentUserIndex(prev);
      setCurrentStoryIndex(startIdx >= 0 ? startIdx : 0);
    } else {
      closeModal();
    }
  }, [currentUserIndex, displayedStories, viewingUnviewedOnly, closeModal]);

  const handleStoryAdded = useCallback((imageUri: string, caption: string) => {
    setAllStories(prev =>
      prev.map(item =>
        item.isYourStory
          ? {
              ...item,
              stories: [
                ...item.stories,
                {
                  id: Date.now().toString(),
                  image: imageUri,
                  caption,
                  createdAt: new Date().toISOString(),
                  viewed: false,
                },
              ],
            }
          : item
      )
    );
  }, []);

  const onViewSory =useCallback((user: UserStoriesItem) => {
    const uIndex = displayedStories.findIndex(u => u.id === user.id);
    const firstUnviewed = user.stories.findIndex(s => !s.viewed);
    const onlyUn = firstUnviewed >= 0;
    setViewingUnviewedOnly(onlyUn);
    setCurrentUserIndex(uIndex);
    setCurrentStoryIndex(onlyUn ? firstUnviewed : 0);
    setModalVisible(true);
  }, [displayedStories]);

  const yourStory = allStories.find(item => item.isYourStory)!;

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={displayedStories}
        renderItem={({ item }) => <StoryItem item={item} onPress={openStory} />}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.storyList}
      />

      {currentUserIndex !== null && !displayedStories[currentUserIndex].isYourStory && (
        <ViewStory
          visible={modalVisible}
          onClose={closeModal}
          stories={displayedStories[currentUserIndex].stories}
          currentStoryIndex={currentStoryIndex}
          user={displayedStories[currentUserIndex]}
          onNextStory={handleNextStory}
          onPrevStory={handlePrevStory}
          onNextUser={handleNextUser}
          onPrevUser={handlePrevUser}
        />
      )}

      <AddStory
        isVisible={addStoryModalVisible}
        onClose={() => setAddStoryModalVisible(false)}
        yourStory={yourStory}
        onStoryAdded={handleStoryAdded}
        onViewStory={onViewSory}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, paddingTop: 5 },
  storyList: { paddingLeft: 5, paddingRight: 5 },
  storyWrapper: { marginRight: 4, padding: 4 },
  storyBox: {
    width: 100,
    height: 120,
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    borderWidth: 3,
  },
  storyImage: { resizeMode: 'cover' },
  avatarSmall: {
    position: 'absolute',
    top: 6,
    left: 6,
    width: 35,
    height: 35,
    borderRadius: 17,
    borderWidth: 2,
  },
  yourStoryContent: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingVertical: 4,
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
  nameText: { color: '#fff', fontSize: 12, fontWeight: '500' },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
});

export default StoryScreen;
