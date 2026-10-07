import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  ActivityIndicator,
  Alert,
  Animated
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../assets/config';
import CommentModal from './CommentModal';

const { width: screenWidth } = Dimensions.get('window');

const PostCard = ({ item }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const lastTap = useRef(0);
  const flatListRef = useRef(null);
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    setLiked(item.likedByUser);
    setLikeCount(item.totalLikes);
  }, [item]);

  const animateLike = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      })
    ]).start();
  };

  const handleLikeToggle = async () => {
    const prevLiked = liked;
    const prevCount = likeCount;
    try {
      const userData = await AsyncStorage.getItem('user');
      const user = JSON.parse(userData);
      if (!user?.id) throw new Error('User not found');

      const newLiked = !liked;
      setLiked(newLiked);
      setLikeCount(newLiked ? prevCount + 1 : prevCount - 1);
      if (newLiked) animateLike();

      const res = await fetch(`${BASE_URL}api/posts/posts/${item.id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });
      if (!res.ok) throw new Error('Failed to update like status');
      const data = await res.json();
      setLiked(data.liked);
      setLikeCount(data.likeCount);
    } catch (err) {
      console.error(err);
      setLiked(prevLiked);
      setLikeCount(prevCount);
    }
  };

  const handleDoubleTap = () => {
    const now = Date.now();
    if (lastTap.current && now - lastTap.current < 300 && !liked) {
      handleLikeToggle();
    }
    lastTap.current = now;
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length) {
      setCurrentImageIndex(viewableItems[0].index || 0);
    }
  }).current;

  const handleImageTap = ({ nativeEvent }) => {
    const third = screenWidth / 3;
    if (nativeEvent.locationX > screenWidth - third) {
      if (currentImageIndex < item.postImages.length - 1) {
        flatListRef.current.scrollToIndex({ index: currentImageIndex + 1, animated: true });
      }
    } else if (nativeEvent.locationX < third) {
      if (currentImageIndex > 0) {
        flatListRef.current.scrollToIndex({ index: currentImageIndex - 1, animated: true });
      }
    } else {
      handleDoubleTap();
    }
  };

  const loadComments = async () => {
    try {
      const res = await fetch(`${BASE_URL}api/posts/posts/${item.id}/comments`);
      if (!res.ok) throw new Error('Failed to load comments');
      const data = await res.json();
      setComments(data.comments);
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const addComment = async () => {
    if (!commentText.trim()) return;
    let temp;
    try {
      const userData = await AsyncStorage.getItem('user');
      const user = JSON.parse(userData);
      if (!user?.id) throw new Error('User not found');

      temp = {
        id: `temp-${Date.now()}`,
        text: commentText,
        user: {
          id: user.id,
          username: user.username,
          profilePicture: user.profilePicture
        }
      };
      setComments(prev => [temp, ...prev]);
      setCommentText('');

      const res = await fetch(`${BASE_URL}api/posts/posts/${item.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: commentText, userId: user.id })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.msg || 'Failed to post comment');
      }
      const data = await res.json();
      setComments(prev =>
        prev.map(c => c.id === temp.id ? data.comment : c)
      );
    } catch (err) {
      console.error(err);
      if (temp) setComments(prev => prev.filter(c => c.id !== temp.id));
      Alert.alert('Error', err.message);
    }
  };

  useEffect(() => {
    if (isCommentModalVisible) loadComments();
  }, [isCommentModalVisible]);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image
          source={{ uri: `${BASE_URL}${item.user.profilePicture}` }}
          style={styles.userImage}
        />
        <Text style={styles.userName}>{item.user.username}</Text>
      </View>

      {item.caption && <Text style={styles.caption}>{item.caption}</Text>}

      {item.postImages?.length > 0 && (
        <TouchableWithoutFeedback onPress={handleImageTap}>
          <View style={styles.imageContainer}>
            <FlatList
              ref={flatListRef}
              data={item.postImages}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              renderItem={({ item: img }) => (
                <Image
                  source={{ uri: `${BASE_URL}${img}` }}
                  style={styles.postImage}
                />
              )}
              keyExtractor={(_, i) => i.toString()}
              onViewableItemsChanged={onViewableItemsChanged}
              viewabilityConfig={viewConfigRef.current}
              getItemLayout={(_, i) => ({
                length: screenWidth,
                offset: screenWidth * i,
                index: i
              })}
            />
            <View style={styles.pagination}>
              {item.postImages.map((_, i) => (
                <View
                  key={i}
                  style={[styles.dot, i === currentImageIndex && styles.activeDot]}
                />
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}

      <View style={styles.footer}>
        <View style={styles.actions}>
          <TouchableOpacity onPress={handleLikeToggle}>
            <Animated.Text
              style={[styles.actionIcon, liked && styles.liked]}
            >
              {liked ? '❤️' : '🤍'}
            </Animated.Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsCommentModalVisible(true)}>
            <Text style={styles.actionIcon}>💬</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Alert.alert('Share', 'Coming soon!')}>
            <Text style={styles.actionIcon}>📤</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.likes}>Liked by {likeCount} people</Text>
      </View>

      <CommentModal
        visible={isCommentModalVisible}
        onClose={() => setIsCommentModalVisible(false)}
        comments={comments}
        commentText={commentText}
        setCommentText={setCommentText}
        addComment={addComment}
      />
    </View>
  );
};

export default function PostsItem() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (!userData) return;
        const user = JSON.parse(userData);
        const res = await fetch(
          `${BASE_URL}api/posts/posts?userId=${user.id}`
        );
        if (!res.ok) throw new Error('Failed to fetch posts');
        const data = await res.json();
        const formatted = data.posts.map(p => ({
          ...p,
          id: p.postId,
          postImages: p.postImages,
          user: {
            userId: p.user.userId,
            username: p.user.username,
            profilePicture: p.user.profilePicture
          }
        }));
        setPosts(formatted);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <PostCard item={item} />}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: 10, paddingBottom: 20 },
  loadingContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center'
  },
  errorContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20
  },
  errorText: { color: 'red', fontSize: 16 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  header: { flexDirection: 'row', alignItems: 'center', padding: 10 },
  userImage: { width: 40, height: 40, borderRadius: 16 },
  userName: { marginLeft: 10, fontWeight: 'bold', fontSize: 16, color: '#333' },
  caption: {
    fontSize: 16, paddingHorizontal: 10, marginBottom: 10, color: '#333'
  },
  imageContainer: { height: 400, position: 'relative' },
  postImage: { width: screenWidth - 20, height: 400 },
  footer: { padding: 10 },
  actions: { flexDirection: 'row', marginBottom: 8 },
  actionIcon: { fontSize: 24, marginRight: 30 },
  liked: { color: 'red' },
  likes: { fontSize: 12, color: 'gray' },
  pagination: {
    flexDirection: 'row', position: 'absolute', bottom: 15, alignSelf: 'center'
  },
  dot: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(0,0,0,0.3)', margin: 3
  },
  activeDot: { backgroundColor: 'rgba(0,0,0,0.8)' },
});
