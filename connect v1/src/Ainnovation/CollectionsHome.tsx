import React from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const stories = [
  { id: '1', user: 'Travel Diaries', image: 'https://picsum.photos/200/300?random=1' },
  { id: '2', user: 'Tech Today', image: 'https://picsum.photos/200/300?random=2' },
  { id: '3', user: 'Foodies', image: 'https://picsum.photos/200/300?random=3' },
  { id: '4', user: 'Art Space', image: 'https://picsum.photos/200/300?random=4' },
  { id: '5', user: 'Fitness Zone', image: 'https://picsum.photos/200/300?random=5' },
];

const posts = [
  { 
    id: '1',
    title: 'Mountain Escape',
    author: 'Nature Explorer',
    category: 'Travel',
    image: 'https://picsum.photos/400/600?random=6',
    likes: 234,
    comments: 45,
    bookmarks: 12,
    views: 1500
  },
  { 
    id: '2',
    title: 'Future of AI',
    author: 'Tech Vision',
    category: 'Technology',
    image: 'https://picsum.photos/400/600?random=7',
    likes: 891,
    comments: 156,
    bookmarks: 89,
    views: 4200
  },
  { 
    id: '3',
    title: 'Urban Artistry',
    author: 'City Canvas',
    category: 'Art',
    image: 'https://picsum.photos/400/600?random=8',
    likes: 567,
    comments: 89,
    bookmarks: 45,
    views: 3200
  },
];

const HomeScreen = () => {
  const renderStory = ({ item }) => (
    <TouchableOpacity style={styles.storyContainer}>
      <Image source={{ uri: item.image }} style={styles.storyImage} />
      <Text style={styles.storyUser}>{item.user}</Text>
    </TouchableOpacity>
  );

  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <View style={styles.authorInfo}>
          <Text style={styles.postCategory}>{item.category}</Text>
          <Text style={styles.postTitle}>{item.title}</Text>
          <Text style={styles.postAuthor}>By {item.author}</Text>
        </View>
        <TouchableOpacity style={styles.menuButton}>
          <Icon name="more-vert" size={24} color="#666" />
        </TouchableOpacity>
      </View>
      
      <Image source={{ uri: item.image }} style={styles.postImage} />
      
      <View style={styles.postStats}>
        <View style={styles.statItem}>
          <Icon name="visibility" size={18} color="#666" />
          <Text style={styles.statText}>{item.views} views</Text>
        </View>
        <View style={styles.statItem}>
          <Icon name="schedule" size={18} color="#666" />
          <Text style={styles.statText}>5 min read</Text>
        </View>
      </View>
      
      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="favorite-border" size={24} color="#666" />
          <Text style={styles.actionText}>{item.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="chat-bubble-outline" size={24} color="#666" />
          <Text style={styles.actionText}>{item.comments}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="bookmark-border" size={24} color="#666" />
          <Text style={styles.actionText}>{item.bookmarks}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Discover</Text>
          <TouchableOpacity style={styles.searchButton}>
            <Icon name="search" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {}
        <Text style={styles.sectionTitle}>Featured Collections</Text>
        <FlatList
          horizontal
          data={stories}
          renderItem={renderStory}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.storiesList}
          showsHorizontalScrollIndicator={false}
        />

        {}
        <Text style={styles.sectionTitle}>Trending Topics</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
          {['Technology', 'Travel', 'Art', 'Science', 'Food'].map((cat, index) => (
            <TouchableOpacity key={index} style={styles.categoryPill}>
              <Text style={styles.categoryText}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {}
        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={item => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.postsList}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2d3436',
    fontFamily: 'sans-serif-medium',
  },
  searchButton: {
    padding: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2d3436',
    paddingHorizontal: 16,
    marginVertical: 12,
  },
  storiesList: {
    paddingLeft: 16,
  },
  storyContainer: {
    width: 120,
    marginRight: 16,
  },
  storyImage: {
    width: 120,
    height: 160,
    borderRadius: 16,
    backgroundColor: '#ddd',
  },
  storyUser: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#2d3436',
    textAlign: 'center',
  },
  categories: {
    paddingLeft: 16,
    marginBottom: 16,
  },
  categoryPill: {
    backgroundColor: '#e3f2fd',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 12,
  },
  categoryText: {
    color: '#1976d2',
    fontWeight: '500',
  },
  postsList: {
    paddingHorizontal: 16,
  },
  postContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  authorInfo: {
    flex: 1,
  },
  postCategory: {
    color: '#0984e3',
    fontWeight: '500',
    fontSize: 14,
    marginBottom: 4,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3436',
    marginBottom: 4,
  },
  postAuthor: {
    color: '#636e72',
    fontSize: 14,
  },
  menuButton: {
    padding: 4,
  },
  postImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#ddd',
  },
  postStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    color: '#636e72',
    fontSize: 14,
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 8,
  },
  actionText: {
    color: '#636e72',
    fontSize: 14,
  },
});

export default HomeScreen;