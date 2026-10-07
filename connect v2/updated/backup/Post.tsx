import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const formatTimeAgo = (date: string) => {
  const postDate = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} days ago`;
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths} months ago`;
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} years ago`;
};

export type PostType = {
  id: string;
  username: string;
  fullName: string;
  college: string;
  avatar: string;
  title: string;
  images: { url: string }[];
  likes: number;
  comments: number;
  shares: number;
  bookmarks: number;
  createdAt: string;
};

const mockPosts: PostType[] = [
  {
    id: '1',
    username: 'john_doe',
    fullName: 'John Doe',
    college: 'Harvard University',
    avatar: 'https://picsum.photos/50?random=1',
    title: 'Exploring the woods 🌲',
    images: [
      { url: 'https://picsum.photos/800/600?random=11' },
      { url: 'https://picsum.photos/800/600?random=12' },
    ],
    likes: 120,
    comments: 34,
    shares: 15,
    bookmarks: 50,
    createdAt: '2025-04-10T12:30:00Z',
  },
  {
    id: '2',
    username: 'jane_smith',
    fullName: 'Jane Smith',
    college: 'Stanford University',
    avatar: 'https://picsum.photos/50?random=2',
    title: 'Lazy beach day 🌊',
    images: [
      { url: 'https://picsum.photos/800/600?random=21' },
      { url: 'https://picsum.photos/800/600?random=22' },
    ],
    likes: 200,
    comments: 80,
    shares: 30,
    bookmarks: 60,
    createdAt: '2025-04-08T16:00:00Z',
  },
];

const PostScreen = () => {
  const screenWidth = Dimensions.get('window').width;

  const renderPost = ({ item }: { item: PostType }) => {
    return (
      <View style={styles.postContainer}>
        <TouchableOpacity style={styles.threeDotsContainer}>
          <Icon name="ellipsis-vertical" size={24} color="#333" />
        </TouchableOpacity>

        <View style={styles.userInfo}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          <View style={styles.userText}>
            <Text style={styles.fullName}>{item.fullName}</Text>
            <Text style={styles.username}>@{item.username}</Text>
            <Text style={styles.college}>{item.college}</Text>
          </View>
        </View>

        <Text style={styles.title}>{item.title}</Text>

        <FlatList
          data={item.images}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          style={styles.imageSlider}
          renderItem={({ item: image }) => (
            <Image
              source={{ uri: image.url }}
              style={[styles.image, { width: screenWidth }]}
              resizeMode="cover"
            />
          )}
        />

        <Text style={styles.timeText}>{formatTimeAgo(item.createdAt)}</Text>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.iconRow}>
            <Icon name="heart" size={22} color="#CACCCB" />
            <Text style={styles.iconText}>{item.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconRow}>
            <Icon name="chatbubble" size={22} color="#CACCCB" />
            <Text style={styles.iconText}>{item.comments}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconRow}>
            <Icon name="share-social" size={22} color="#CACCCB" />
            <Text style={styles.iconText}>{item.shares}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconRow}>
            <Icon name="bookmark" size={22} color="#333" />
            <Text style={styles.iconText}>{item.bookmarks}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <FlatList
        data={mockPosts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        contentContainerStyle={{ padding: 0 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default PostScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  postContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 0,
    marginBottom: 10,
    margin: 8,
    position: 'relative',
  },
  threeDotsContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  userInfo: {
    flexDirection: 'row',
    marginBottom: 12,
    marginLeft: 12,
    marginTop: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userText: {
    marginLeft: 12,
    justifyContent: 'center',
  },
  fullName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  username: {
    fontSize: 13,
    color: '#888',
  },
  college: {
    fontSize: 12,
    color: '#444',
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
    margin: 12,
    color: '#333',
  },
  imageSlider: {
    marginBottom: 12,
  },
  image: {
    height: 280,
    borderRadius: 0,
    marginRight: 12,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#888',
    marginTop: 6,
    marginLeft: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 15,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconText: {
    fontSize: 13,
    color: '#555',
    marginLeft: 4,
  },
});
