import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Image,
  TouchableOpacity,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  Animated,
  Alert,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from "../assets/config";

const PostScreen = () => {
  const [postMessage, setPostMessage] = useState('');
  const [postImages, setPostImages] = useState([]);
  const [storyImages, setStoryImages] = useState([]);
  const [user, setUser] = useState(null);
  const [postScaleAnim] = useState(new Animated.Value(1));
  const [storyScaleAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userString = await AsyncStorage.getItem('user');
        if (userString) {
          setUser(JSON.parse(userString));
        }
      } catch (err) {
        console.error('Failed to load user', err);
      }
    };
    fetchUser();
  }, []);

  const selectPostImages = () => {
    launchImageLibrary({ mediaType: 'photo', selectionLimit: 5 }, (response) => {
      if (response.assets && response.assets.length > 0) {
        setPostImages([...postImages, ...response.assets.map(asset => asset.uri)]);
      }
    });
  };

  const selectStoryImages = () => {
    launchImageLibrary({ mediaType: 'photo', selectionLimit: 5 }, (response) => {
      if (response.assets && response.assets.length > 0) {
        setStoryImages([...storyImages, ...response.assets.map(asset => asset.uri)]);
      }
    });
  };

  const removePostImage = (uri) => {
    setPostImages(postImages.filter(image => image !== uri));
  };

  const removeStoryImage = (uri) => {
    setStoryImages(storyImages.filter(image => image !== uri));
  };

  const postPostContent = async () => {
    if (!postMessage && postImages.length === 0) {
      Alert.alert('Error', 'Please add a caption or image before posting.');
      return;
    }
    
    if (!user || !user.id) {
      Alert.alert('Error', 'User data not available. Please login again.');
      return;
    }

    const formData = new FormData();
    formData.append('caption', postMessage);
    formData.append('userId', user.id);

    if (postImages.length > 0) {
      postImages.forEach((uri) => {
        const filename = uri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const mimeType = match ? `image/${match[1]}` : 'image/jpeg';
        formData.append('images', {
          uri,
          name: filename,
          type: mimeType,
        });
      });
    }

    try {
      const response = await fetch(`${BASE_URL}api/posts/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        body: formData,
      });
      
      const contentType = response.headers.get('content-type');
      let data;
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }
    
      if (response.ok) {
        Alert.alert('Success', 'Post posted successfully.');
        setPostMessage('');
        setPostImages([]);
      } else {
        console.error('Error posting:', data);
        Alert.alert('Error', data.msg || 'Failed to post');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'An error occurred while posting.');
    }
  };

  const postStoryContent = async () => {
    if (storyImages.length === 0) {
      Alert.alert('Error', 'Please select an image for your story.');
      return;
    }
    if (!user || !user.id) {
      Alert.alert('Error', 'User data not available. Please login again.');
      return;
    }

    const formData = new FormData();
    formData.append('userId', user.id);
    storyImages.forEach((uri) => {
      const filename = uri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const mimeType = match ? `image/${match[1]}` : 'image/jpeg';
      formData.append('images', {
        uri,
        name: filename,
        type: mimeType,
      });
    });

    try {
      const response = await fetch(`${BASE_URL}api/posts/stories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        body: formData,
      });
      
      const contentType = response.headers.get('content-type');
      let data;
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }
    
      if (response.ok) {
        Alert.alert('Success', 'Story posted successfully.');
        setStoryImages([]);
      } else {
        console.error('Error posting story:', data);
        Alert.alert('Error', data.msg || 'Failed to post story');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'An error occurred while posting your story.');
    }
  };

  const animateButton = (anim) => {
    Animated.sequence([
      Animated.timing(anim, { toValue: 1.2, duration: 150, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionHeader}>Create Post</Text>
      <TextInput
        style={styles.input}
        placeholder="What's on your mind?"
        multiline
        value={postMessage}
        onChangeText={setPostMessage}
      />
      <FlatList
        data={postImages}
        horizontal
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.imageWrapper}>
            <Image source={{ uri: item }} style={styles.image} />
            <TouchableOpacity onPress={() => removePostImage(item)} style={styles.deleteButton}>
              <Icon name="close-circle" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={selectPostImages} style={styles.iconButton}>
          <Icon name="images" size={24} color="#fff" />
          <Text style={styles.buttonText}>Select Images</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <Animated.View style={{ transform: [{ scale: postScaleAnim }] }}>
          <TouchableOpacity
            onPress={() => { 
              animateButton(postScaleAnim); 
              postPostContent(); 
            }}
            style={styles.postButton}
          >
            <Text style={styles.postText}>Create Post</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      <Text style={styles.sectionHeader}>Create Story</Text>
      <FlatList
        data={storyImages}
        horizontal
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.imageWrapper}>
            <Image source={{ uri: item }} style={styles.image} />
            <TouchableOpacity onPress={() => removeStoryImage(item)} style={styles.deleteButton}>
              <Icon name="close-circle" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={selectStoryImages} style={styles.iconButton}>
          <Icon name="images" size={24} color="#fff" />
          <Text style={styles.buttonText}>Select Story Images</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <Animated.View style={{ transform: [{ scale: storyScaleAnim }] }}>
          <TouchableOpacity
            onPress={() => { 
              animateButton(storyScaleAnim); 
              postStoryContent(); 
            }}
            style={styles.storyButton}
          >
            <Text style={styles.postText}>Create Story</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 10,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  iconButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
  },
  storyButton: {
    backgroundColor: '#FF9800',
    padding: 12,
    borderRadius: 8,
  },
  postButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
  },
  postText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 5,
  },
});

export default PostScreen;
