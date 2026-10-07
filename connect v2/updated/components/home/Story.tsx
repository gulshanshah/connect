import React from 'react';
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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const screenWidth = Dimensions.get('window').width;

const storiesData = [
  {
    id: 'your',
    name: 'Your Story',
    isYourStory: true,
    storyImage: 'https://picsum.photos/200/200?random=1',
  },
  {
    id: '1',
    name: 'Alice',
    avatar: 'https://i.pravatar.cc/150?img=1',
    storyImage: 'https://picsum.photos/200/200?random=2',
  },
  {
    id: '2',
    name: 'Bob',
    avatar: 'https://i.pravatar.cc/150?img=2',
    storyImage: 'https://picsum.photos/200/200?random=3',
  },
  {
    id: '3',
    name: 'Charlie',
    avatar: 'https://i.pravatar.cc/150?img=3',
    storyImage: 'https://picsum.photos/200/200?random=4',
  },
  {
    id: '4',
    name: 'Diana',
    avatar: 'https://i.pravatar.cc/150?img=4',
    storyImage: 'https://picsum.photos/200/200?random=5',
  },
];

const StoryItem = ({ item }) => {
  return (
    <TouchableOpacity style={styles.storyWrapper}>
      <ImageBackground
        source={{ uri: item.storyImage }}
        style={styles.storyBox}
        imageStyle={styles.storyImage}
      >
        {}
        {!item.isYourStory && (
          <Image source={{ uri: item.avatar }} style={styles.avatarSmall} />
        )}

        {}
        {item.isYourStory ? (
          <View style={styles.yourStoryContent}>
            <Icon name="add-circle" size={30} color="#CACCCB" />
            <Text style={styles.yourStoryText}>Your Story</Text>
          </View>
        ) : (
          <View style={styles.nameOverlay}>
            <Text style={styles.nameText}>{item.name}</Text>
          </View>
        )}
      </ImageBackground>
    </TouchableOpacity>
  );
};

const StoryScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={storiesData}
        renderItem={({ item }) => <StoryItem item={item} />}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.storyList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: 5,
    paddingLeft: 10,
  },
  storyList: {
    paddingRight: 10,
  },
  storyWrapper: {
    marginRight: 12,
  },
  storyBox: {
    width: 100,
    height: 120,
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
  },
  storyImage: {
    borderRadius: 12,
  },
  avatarSmall: {
    position: 'absolute',
    top: 6,
    left: 6,
    width: 34,
    height: 34,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  yourStoryContent: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingVertical: 6,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 0,
  },  
  yourStoryText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 0,
    fontWeight: '600',
  },
  nameOverlay: {
    width: '100%',
    padding: 5,
    alignItems: 'center',
  },
  nameText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default StoryScreen;
