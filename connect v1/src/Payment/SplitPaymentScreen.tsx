import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  FlatList,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ImageViewer from 'react-native-image-zoom-viewer';

import Story from '../new/components/Story';
import PostComponent from '../new/components/Post';
import useStories from '../new/hooks/useStories';
import usePosts from '../new/hooks/usePosts';
import { Post } from '../new/types/types';

export default function HomeScreen() {
  const [showCollege, setShowCollege] = useState(false);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setShowCollege((prev) => !prev), 3000);
    return () => clearInterval(interval);
  }, []);

  const stories = useStories();
  const posts = usePosts();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {}
        <View style={styles.header}>
          <Text style={styles.title}>Discover</Text>
          <TouchableOpacity>
            <Icon name="search" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {}
        <FlatList
          horizontal
          data={stories}
          renderItem={({ item }) => <Story story={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.storiesContainer}
          showsHorizontalScrollIndicator={false}
        />

        {}
        <FlatList
          data={posts}
          renderItem={({ item }) => (
            <PostComponent
              post={item}
              showCollege={showCollege}
              onImagePress={(post, idx) => {
                setCurrentPost(post);
                setCurrentImageIndex(idx);
                setViewerVisible(true);
              }}
            />
          )}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.postsContainer}
        />
      </ScrollView>

      {}
      <Modal visible={viewerVisible} transparent>
        <ImageViewer
          imageUrls={currentPost?.images || []}
          index={currentImageIndex}
          enableSwipeDown
          onCancel={() => setViewerVisible(false)}
          renderHeader={() => (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setViewerVisible(false)}
            >
              <Icon name="close" size={30} color="#fff" />
            </TouchableOpacity>
          )}
        />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  title: { fontSize: 28, fontWeight: 'bold', color: '#2d3436' },
  storiesContainer: { paddingLeft: 16, marginVertical: 8 },
  postsContainer: { paddingHorizontal: 0, paddingBottom: 0 },
  closeButton: { position: 'absolute', top: 40, right: 20, zIndex: 1 },
});
