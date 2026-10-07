import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, Image, StyleSheet, TouchableOpacity,
  Modal, FlatList, Dimensions, Animated
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const stories = [
  {
    id: 1,
    image: 'https://picsum.photos/600/800?random=1',
    caption: 'First adventure 🚴‍♂️',
  },
  {
    id: 2,
    image: 'https://picsum.photos/600/800?random=2',
    caption: 'Nature calling 🌲',
  },
  {
    id: 3,
    image: 'https://picsum.photos/600/800?random=3',
    caption: 'City lights ✨',
  }
];

const viewers = [
  { name: 'Alice', liked: true },
  { name: 'Bob', liked: false },
  { name: 'Charlie', liked: true },
  { name: 'Diana', liked: false }
];

const StoryScreen = () => {
  const [current, setCurrent] = useState(0);
  const [viewersVisible, setViewersVisible] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;

  const advance = (direction) => {
    if (direction === 'next' && current < stories.length - 1) {
      setCurrent(current + 1);
    } else if (direction === 'prev' && current > 0) {
      setCurrent(current - 1);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (current < stories.length - 1) {
        setCurrent(current + 1);
      }
    }, 5000);

    Animated.timing(progress, {
      toValue: (current + 1) / stories.length,
      duration: 500,
      useNativeDriver: false,
    }).start();

    return () => clearTimeout(timer);
  }, [current]);

  return (
    <View style={styles.container}>
      {}
      <View style={styles.progressWrapper}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: progress.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%']
              })
            }
          ]}
        />
      </View>

      {}
      <View style={styles.header}>
        <Image source={{ uri: 'https://i.pravatar.cc/150?img=8' }} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>Jane Doe</Text>
          <Text style={styles.time}>2h ago</Text>
        </View>
        <TouchableOpacity>
          <Icon name="ellipsis-horizontal" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {}
      <View style={styles.tapAreaContainer}>
        <TouchableOpacity style={styles.tapArea} onPress={() => advance('prev')} />
        <TouchableOpacity style={styles.tapArea} onPress={() => advance('next')} />
      </View>

      {}
      <Image
        key={stories[current].id}
        source={{ uri: stories[current].image }}
        style={styles.storyImage}
        resizeMode="cover"
      />

      {}
      <Text style={styles.caption}>{stories[current].caption}</Text>

      {}
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => setViewersVisible(true)} style={styles.iconButton}>
          <Icon name="eye" size={20} color="#fff" />
          <Text style={styles.iconText}>{viewers.length}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
          <Icon name="add-circle-outline" size={20} color="#fff" />
          <Text style={styles.iconText}>Add</Text>
        </TouchableOpacity>
      </View>

      {}
      <Modal visible={viewersVisible} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Viewers</Text>
            <FlatList
              data={viewers}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.viewerRow}>
                  <Text style={styles.viewerItem}>{item.name}</Text>
                  <Text style={{ color: item.liked ? 'red' : 'gray' }}>
                    {item.liked ? '❤️' : '👁️'}
                  </Text>
                </View>
              )}
            />
            <TouchableOpacity onPress={() => setViewersVisible(false)} style={styles.closeButton}>
              <Text style={{ color: 'white' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default StoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  progressWrapper: {
    height: 4,
    backgroundColor: '#333',
    width: '100%',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#feda75',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  avatar: {
    width: 40, height: 40, borderRadius: 20, marginRight: 10,
  },
  name: {
    color: '#fff', fontWeight: 'bold',
  },
  time: {
    color: '#aaa', fontSize: 12,
  },
  storyImage: {
    width: width, height: 650,
  },
  caption: {
    color: '#fff', padding: 10, fontSize: 16,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    borderTopWidth: 1,
    borderColor: '#333',
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconText: {
    color: '#fff', marginLeft: 5,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#222',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
  },
  viewerItem: {
    color: '#fff',
    fontSize: 16,
  },
  viewerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: '#444',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  tapAreaContainer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    zIndex: 1,
  },
  tapArea: {
    flex: 1,
  },
});
