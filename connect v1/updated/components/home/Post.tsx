
import React, { useState, useRef } from 'react';
import {
  SafeAreaView,
  FlatList,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ViewToken,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

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
      { url: 'https://picsum.photos/800/600?random=13' },
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

const screenWidth = Dimensions.get('window').width;

const formatTimeAgo = (dateString: string) => {
  const postDate = new Date(dateString);
  const now = new Date();
  const diff = (now.getTime() - postDate.getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  const days = Math.floor(diff / 86400);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
};

const PostItem: React.FC<{ post: PostType }> = ({ post }) => {
  const [activeIndex, setActiveIndex] = useState(1);

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;
  const onViewableItemsChanged = useRef(
    (info: { viewableItems: ViewToken[] }) => {
      if (info.viewableItems.length) {
        const idx = info.viewableItems[0].index ?? 0;
        setActiveIndex(idx + 1);
      }
    }
  ).current;

  return (
    <View style={styles.postContainer}>
      <TouchableOpacity style={styles.threeDotsContainer}>
        <Icon name="ellipsis-vertical" size={24} color="#333" />
      </TouchableOpacity>

      <View style={styles.userInfo}>
        <Image source={{ uri: post.avatar }} style={styles.avatar} />
        <View style={styles.userText}>
          <Text style={styles.fullName}>{post.fullName}</Text>
          <Text style={styles.username}>@{post.username}</Text>
          <Text style={styles.college}>{post.college}</Text>
        </View>
      </View>

      <Text style={styles.title}>{post.title}</Text>

      <FlatList
        data={post.images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={screenWidth}
        snapToAlignment="start"
        decelerationRate="fast"
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <View style={{ width: screenWidth }}>
            <Image
              source={{ uri: item.url }}
              style={[styles.image, { width: screenWidth }]}
              resizeMode="cover"
            />
          </View>
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        style={styles.imageSlider}
      />

      <View style={styles.timeAndCountContainer}>
        <Text style={styles.timeText}>{formatTimeAgo(post.createdAt)}</Text>
        <Text style={styles.countText}>
          {activeIndex} / {post.images.length}
        </Text>
      </View>

      <View style={styles.actions}>
        {[
          { name: 'heart', count: post.likes },
          { name: 'chatbubble', count: post.comments },
          { name: 'share-social', count: post.shares },
        ].map((a) => (
          <TouchableOpacity style={styles.iconRow} key={a.name}>
            <Icon name={a.name} size={22} color="#CACCCB" />
            <Text style={styles.iconText}>{a.count}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.iconRow}>
          <Icon name="bookmark" size={22} color="#333" />
          <Text style={styles.iconText}>{post.bookmarks}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const PostScreen: React.FC = () => (
  <SafeAreaView style={styles.container}>
    <StatusBar barStyle="dark-content" />
    <FlatList
      data={mockPosts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <PostItem post={item} />}
      showsVerticalScrollIndicator={false}
    />
  </SafeAreaView>
);

export default PostScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  postContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 8,
    position: 'relative',
  },
  threeDotsContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  userInfo: {
    flexDirection: 'row',
    margin: 12,
  },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  userText: { marginLeft: 12, justifyContent: 'center' },
  fullName: { fontWeight: 'bold', fontSize: 16 },
  username: { fontSize: 13, color: '#888' },
  college: { fontSize: 12, color: '#444' },
  title: { fontSize: 15, fontWeight: '500', marginHorizontal: 12, color: '#333' },
  imageSlider: { marginVertical: 12 },
  image: { height: 280 },
  timeAndCountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 12,
    marginBottom: 6,
  },
  timeText: { fontSize: 12, fontWeight: '700', color: '#888' },
  countText: { fontSize: 12, fontWeight: '700', color: '#888' },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 15,
  },
  iconRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  iconText: { fontSize: 13, color: '#555', marginLeft: 4 },
});
