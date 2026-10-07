import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  FlatList,
  StyleSheet,
  useWindowDimensions,
  Alert,
  ActivityIndicator,
  Share,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { Post as PostType } from '../types';

type Props = {
  post: PostType;
  showCollege: boolean;
  onImagePress: (post: PostType, index: number) => void;
};

const PostComponent: React.FC<Props> = React.memo(({ post, showCollege, onImagePress }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(post.images.map(() => true));
  const { width } = useWindowDimensions();
  const carouselRef = useRef<FlatList<any>>(null);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length) setCurrentIndex(viewableItems[0].index);
  });
  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 });

  const handleLike = useCallback(() => setLiked(prev => !prev), []);
  const handleBookmark = useCallback(() => setBookmarked(prev => !prev), []);
  const handleOptions = useCallback(() => {
    Alert.alert('Post Options', undefined, [
      { text: 'Report', onPress: () => {} },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }, []);
  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        message: `${post.title} by ${post.username}`,
        url: post.images[currentIndex].url,
      });
    } catch (e) {
      console.warn(e);
    }
  }, [currentIndex, post]);

  const renderImage = useCallback(
    ({ item, index }: { item: { url: string }; index: number }) => (
      <Pressable
        style={[styles.imageWrapper, { width }]}
        onPress={() => onImagePress(post, index)}
        onLongPress={handleShare}
        android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
        accessibilityLabel={`View image ${index + 1} of ${post.images.length}`}
      >
        {loading[index] && <ActivityIndicator style={styles.loader} size="large" />}
        <Image
          source={{ uri: item.url }}
          style={[styles.postImage, { width }]}
          onLoad={() => {
            setLoading(l => {
              const copy = [...l];
              copy[index] = false;
              return copy;
            });
          }}
        />
      </Pressable>
    ),
    [handleShare, loading, onImagePress, post, width]
  );

  return (
    <View style={styles.container}>
      {}
      <View style={styles.header}>
        <Image source={{ uri: post.avatar }} style={styles.avatar} />
        <View style={styles.authorInfo}>
          <Text style={styles.username}>{post.username}</Text>
          <Text style={styles.name}>{showCollege ? post.college : post.fullName}</Text>
        </View>
        <Pressable onPress={handleOptions} style={styles.menuBtn}>
          <MaterialIcon name="more-vert" size={24} color="#666" />
        </Pressable>
      </View>

      {}
      <Text style={styles.title}>{post.title}</Text>

      {}
      <FlatList
        ref={carouselRef}
        data={post.images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={renderImage}
        keyExtractor={(_, i) => i.toString()}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewConfig.current}
      />
      <Text style={styles.pageIndicator}>
        {currentIndex + 1}/{post.images.length}
      </Text>

      {}
      <View style={styles.stats}>
        <Text style={styles.statText}>5 min read</Text>
      </View>

      {}
      <View style={styles.actions}>
        <Pressable onPress={handleLike} style={styles.actionBtn}>
          <MaterialIcon name={liked ? 'favorite' : 'favorite-border'} size={24} color={liked ? '#e74c3c' : '#666'} />
          <Text style={styles.actionText}>{liked ? post.likes + 1 : post.likes}</Text>
        </Pressable>
        <Pressable style={styles.actionBtn}>
          <MaterialIcon name="chat-bubble-outline" size={24} color="#666" />
          <Text style={styles.actionText}>{post.comments}</Text>
        </Pressable>
        <Pressable onPress={handleShare} style={styles.actionBtn}>
          <Ionicon name="paper-plane-outline" size={24} color="#666" />
          <Text style={styles.actionText}>{post.shares}</Text>
        </Pressable>
        <Pressable onPress={handleBookmark} style={styles.actionBtn}>
          <MaterialIcon name={bookmarked ? 'bookmark' : 'bookmark-border'} size={24} color={bookmarked ? '#3498db' : '#666'} />
          <Text style={styles.actionText}>{bookmarked ? post.bookmarks + 1 : post.bookmarks}</Text>
        </Pressable>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  authorInfo: { flex: 1 },
  username: { fontWeight: '600', fontSize: 14, color: '#2d3436' },
  name: { fontSize: 12, color: '#636e72', marginTop: 4 },
  menuBtn: { padding: 8 },
  title: { fontSize: 16, fontWeight: '600', marginHorizontal: 16, marginBottom: 8, color: '#2d3436' },
  imageWrapper: { justifyContent: 'center', alignItems: 'center' },
  postImage: { height: 300, borderRadius: 8 },
  loader: { position: 'absolute' },
  pageIndicator: {
    position: 'absolute',
    top: 8,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    overflow: 'hidden',
    fontSize: 12,
  },
  stats: { flexDirection: 'row', padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  statText: { color: '#636e72', fontSize: 14 },
  actions: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 12 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', padding: 8 },
  actionText: { color: '#636e72', fontSize: 14, marginLeft: 4 },
});

export default PostComponent;
