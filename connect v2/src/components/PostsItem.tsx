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
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
  ActivityIndicator,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from "../assets/config";

const { width: screenWidth } = Dimensions.get('window');

const CommentModal = ({ 
  visible, 
  onClose, 
  comments, 
  commentText, 
  setCommentText, 
  addComment 
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [visible]);

  useEffect(() => {
    if (flatListRef.current && comments.length) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [comments]);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView 
        style={styles.modalContainer} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Comments</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>X</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            ref={flatListRef}
            data={comments}
            keyExtractor={(comment) => comment.id}
            renderItem={({ item: comment }) => (
              <View style={styles.commentContainer}>
                <Image
                  source={{ uri: `${BASE_URL}${comment.user.profilePicture}` }}
                  style={styles.commentUserImage}
                />
                <View style={styles.commentTextContainer}>
                  <Text style={styles.commentUser}>{comment.user.username}</Text>
                  <Text style={styles.commentText}>{comment.text}</Text>
                </View>
              </View>
            )}
            showsVerticalScrollIndicator={false}
            style={styles.commentsList}
            contentContainerStyle={{ paddingBottom: 10 }}
          />
          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Write a comment..."
              value={commentText}
              onChangeText={setCommentText}
            />
            <TouchableOpacity onPress={addComment}>
              <Text style={styles.commentButton}>Post</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

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
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        easing: Easing.ease,
        useNativeDriver: true,
      })
    ]).start();
  };

  const handleLikeToggle = async () => {
    const previousLiked = liked;
    const previousLikeCount = likeCount;
    
    try {
      const userData = await AsyncStorage.getItem('user');
      const user = JSON.parse(userData);
      if (!user?.id) throw new Error('User not found');

      const newLiked = !liked;
      setLiked(newLiked);
      setLikeCount(newLiked ? previousLikeCount + 1 : previousLikeCount - 1);

      if (newLiked) animateLike();

      const response = await fetch(`${BASE_URL}api/posts/posts/${item.id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to update like status');
      }

      const data = await response.json();
      setLiked(data.liked);
      setLikeCount(data.likeCount);
    } catch (err) {
      console.error('Error toggling like:', err);
      setLiked(previousLiked);
      setLikeCount(previousLikeCount);
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
    if (viewableItems.length > 0) {
      setCurrentImageIndex(viewableItems[0].index || 0);
    }
  }).current;

  const handleImageTap = (event) => {
    const { locationX } = event.nativeEvent;
    const thirdWidth = screenWidth / 3;
    if (locationX > screenWidth - thirdWidth) {
      if (currentImageIndex < item.postImages.length - 1) {
        setCurrentImageIndex(prev => prev + 1);
        flatListRef.current.scrollToIndex({ index: currentImageIndex + 1, animated: true });
      }
    } else if (locationX < thirdWidth) {
      if (currentImageIndex > 0) {
        setCurrentImageIndex(prev => prev - 1);
        flatListRef.current.scrollToIndex({ index: currentImageIndex - 1, animated: true });
      }
    } else {
      handleDoubleTap();
    }
  };

  const loadComments = async () => {
    try {
      const response = await fetch(`${BASE_URL}api/posts/posts/${item.id}/comments`);
      if (!response.ok) throw new Error('Failed to load comments');
      const data = await response.json();
      setComments(data.comments);
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const addComment = async () => {
    if (!commentText.trim()) return;
    let tempComment;
    try {
      const userData = await AsyncStorage.getItem('user');
      const user = JSON.parse(userData);
      if (!user?.id) throw new Error('User not found');

      tempComment = {
        id: `temp-${Date.now()}`,
        text: commentText,
        user: {
          id: user.id,
          username: user.username,
          profilePicture: user.profilePicture
        }
      };

      setComments(prev => [tempComment, ...prev]);
      setCommentText('');

      const response = await fetch(`${BASE_URL}api/posts/posts/${item.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: commentText,
          userId: user.id
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Failed to post comment');
      }

      const data = await response.json();
      setComments(prev => 
        prev.map(comment => 
          comment.id === tempComment.id ? data.comment : comment
        )
      );
    } catch (err) {
      console.error('Error adding comment:', err);
      if (tempComment) {
        setComments(prev => prev.filter(c => c.id !== tempComment.id));
      }
      Alert.alert('Error', err.message);
    }
  };

  useEffect(() => {
    if (isCommentModalVisible) {
      loadComments();
    }
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
              renderItem={({ item: image }) => (
                <Image 
                  source={{ uri: `${BASE_URL}${image}` }} 
                  style={styles.postImage} 
                />
              )}
              keyExtractor={(_, index) => index.toString()}
              onViewableItemsChanged={onViewableItemsChanged}
              viewabilityConfig={viewConfigRef.current}
              getItemLayout={(_, index) => ({
                length: screenWidth,
                offset: screenWidth * index,
                index,
              })}
            />
            <View style={styles.pagination}>
              {item.postImages.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    index === currentImageIndex && styles.activeDot
                  ]}
                />
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}

      <View style={styles.footer}>
        <View style={styles.actions}>
          <TouchableOpacity onPress={handleLikeToggle}>
            <Animated.Text style={[styles.actionIcon, liked && styles.liked, { transform: [{ scale: scaleAnim }] }]}>
              {liked ? '❤️' : '🤍'}
            </Animated.Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsCommentModalVisible(true)}>
            <Text style={styles.actionIcon}>💬</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => alert('Share feature, Coming soon in next updates')}>
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

const PostsItem = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (!userData) {
          return;
        }
        const user = JSON.parse(userData);
        const userId = user.id;

        const response = await fetch(`${BASE_URL}api/posts/posts?userId=${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error('Failed to fetch posts');
        
        const data = await response.json();
        const formattedPosts = data.posts.map(post => ({
          ...post,
          id: post.postId,
          postImages: post.postImages,
          user: {
            userId: post.user.userId,
            username: post.user.username,
            profilePicture: post.user.profilePicture,
          }
        }));
        
        setPosts(formattedPosts);
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
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <PostCard item={item} />}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  errorText: {
    color: 'red',
    fontSize: 16
  },
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 16,
  },
  userName: {
    marginLeft: 10,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  caption: {
    fontSize: 16,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: '#333',
  },
  imageContainer: {
    height: 400,
    position: 'relative',
  },
  postImage: {
    width: screenWidth - 20,
    height: 400,
  },
  footer: {
    padding: 10,
  },
  actions: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  actionIcon: {
    fontSize: 24,
    marginRight: 30,
  },
  liked: {
    color: 'red',
  },
  likes: {
    fontSize: 12,
    color: 'gray',
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 15,
    alignSelf: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.3)',
    margin: 3,
  },
  activeDot: {
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContent: {
    backgroundColor: '#fff',
    maxHeight: '55%',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 20,
    color: 'gray',
  },
  commentsList: {
    marginBottom: 10,
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  commentUserImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  commentTextContainer: {
    flex: 1,
  },
  commentUser: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  commentText: {
    fontSize: 14,
    color: '#333',
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingTop: 10,
  },
  commentInput: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ccc',
    marginRight: 10,
  },
  commentButton: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
});

export default PostsItem;
