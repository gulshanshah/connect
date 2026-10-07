import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  Dimensions,
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';

const USER_AVATAR = 'https://i.pravatar.cc/150?img=3';
const USER_NAME = 'You';
const USER_HANDLE = '@yourhandle';

const initialTweets = [
  {
    id: 1,
    user: {
      name: 'Elon Musk',
      handle: '@elonmusk',
      avatar: 'https://i.pravatar.cc/150?img=1',
      verified: true,
    },
    content: '🚀 Starship launch attempt soon!',
    image: 'https://picsum.photos/500/300?random=1',
    likes: 245200,
    retweets: 89400,
    replies: 15600,
    time: '2h',
    isLiked: false,
    originalId: 1,
  },
  {
    id: 2,
    user: {
      name: 'React Native',
      handle: '@reactnative',
      avatar: 'https://i.pravatar.cc/150?img=2',
      verified: false,
    },
    content: 'Just released React Native 0.72 with improved performance and new features! 🎉 #reactnative',
    likes: 18900,
    retweets: 6200,
    replies: 850,
    time: '3h',
    isLiked: true,
    originalId: 2,
  },
  {
    id: 3,
    user: {
      name: 'React Community',
      handle: '@reactjs',
      avatar: 'https://i.pravatar.cc/150?img=4',
      verified: true,
    },
    content: 'React Native 0.73 is out! 🚀\nCheck the docs for migration tips.',
    image: null,
    likes: 3256,
    retweets: 410,
    replies: 120,
    time: '10m',
    isLiked: false,
    originalId: 3,
  }
];

function generateId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

const HomeScreen = () => {
  const [tweetsData, setTweetsData] = useState(initialTweets);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTweet, setNewTweet] = useState('');
  const [posting, setPosting] = useState(false);
  const [pickedImageUri, setPickedImageUri] = useState(null);
  const { width } = Dimensions.get('window');

  const hasCurrentUserRetweeted = (tweet) =>
    tweetsData.some(
      t =>
        t.isRetweet &&
        t.originalId === (tweet.isRetweet ? tweet.originalId : tweet.id) &&
        t.retweeter &&
        t.retweeter.handle === USER_HANDLE
    );

  const getOriginalTweetById = (origId) => {
    return tweetsData.find(t => t.id === origId && !t.isRetweet);
  };

  const handleRetweet = (tweet) => {
    if (hasCurrentUserRetweeted(tweet)) {
      Alert.alert('Already Retweeted', "You already retweeted this tweet.");
      return;
    }
    const orig = tweet.isRetweet
      ? getOriginalTweetById(tweet.originalId)
      : tweet;
    if (!orig) return;
    const now = 'Now';
    const newRetweet = {
      id: generateId(),
      originalId: orig.id,
      isRetweet: true,
      time: now,
      retweeter: {
        name: USER_NAME,
        handle: USER_HANDLE,
        avatar: USER_AVATAR,
      },
    };
    setTweetsData(prev => [
      newRetweet,
      ...prev.map(t =>
        t.id === orig.id
          ? { ...t, retweets: t.retweets + 1 }
          : t
      ),
    ]);
  };

  const handleLike = (tweetId) => {
    setTweetsData(prev =>
      prev.map(tweet =>
        tweet.id === tweetId
          ? { ...tweet, isLiked: !tweet.isLiked, likes: tweet.isLiked ? tweet.likes - 1 : tweet.likes + 1 }
          : tweet
      )
    );
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const handlePost = () => {
    if (!newTweet.trim() && !pickedImageUri) return;
    setPosting(true);
    const newTweetObj = {
      id: generateId(),
      user: {
        name: USER_NAME,
        handle: USER_HANDLE,
        avatar: USER_AVATAR,
        verified: false,
      },
      content: newTweet,
      image: pickedImageUri,
      likes: 0,
      retweets: 0,
      replies: 0,
      time: 'Now',
      isLiked: false,
      originalId: null,
    };
    setTweetsData([newTweetObj, ...tweetsData]);
    setNewTweet('');
    setPickedImageUri(null);
    setPosting(false);
    setModalVisible(false);
  };

  const openGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 900,
        maxHeight: 900,
        quality: 0.8,
      },
      (response) => {
        if (response.didCancel || response.errorCode) return;
        if (response.assets && response.assets.length > 0) {
          setPickedImageUri(response.assets[0].uri);
        }
      }
    );
  };

  const Tweet = ({ tweet }) => {
    if (tweet.isRetweet) {
      const original = getOriginalTweetById(tweet.originalId);
      if (!original) return null;
      return (
        <View style={styles.tweetContainer}>
          <View style={styles.retweeterBar}>
            <Image source={{ uri: tweet.retweeter.avatar }} style={styles.retweeterAvatar} />
            <Text style={styles.retweeterName}>{tweet.retweeter.name}</Text>
            <Text style={styles.retweeterHandle}>{tweet.retweeter.handle}</Text>
            <Icon name="repeat" size={15} color="#657786" style={[styles.retweeterIcon, {marginLeft: 6, marginRight:2}]} />
            <Text style={styles.retweeterText}>Retweeted</Text>
          </View>
          <View style={styles.tweetRow}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: original.user.avatar }} style={styles.avatar} />
            </View>
            <View style={styles.tweetContent}>
              <View style={styles.tweetHeader}>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{original.user.name}</Text>
                  {original.user.verified && (
                    <Icon name="checkmark-circle" size={16} color="#1DA1F2" style={styles.verifiedBadge} />
                  )}
                  <Text style={styles.userHandle}>{original.user.handle}</Text>
                  <Text style={styles.time}>· {original.time} ago</Text>
                </View>
                <Icon name="ellipsis-horizontal" size={18} color="#657786" />
              </View>
              <Text style={styles.tweetText}>{original.content}</Text>
              {original.image && (
                <Image
                  source={{ uri: original.image }}
                  style={[styles.tweetImage, { width: width - 80 }]}
                  resizeMode="cover"
                />
              )}
              <View style={styles.tweetActions}>
                <View style={styles.actionItem}>
                  <Icon name="chatbubble-outline" size={18} color="#657786" />
                  <Text style={styles.actionText}>{formatNumber(original.replies)}</Text>
                </View>
                <Pressable
                  style={styles.actionItem}
                  onPress={() => handleRetweet(original)}
                >
                  <Icon
                    name={hasCurrentUserRetweeted(original) ? 'repeat' : 'repeat-outline'}
                    size={20}
                    color={hasCurrentUserRetweeted(original) ? '#00BA7C' : '#657786'}
                  />
                  <Text style={[styles.actionText, hasCurrentUserRetweeted(original) && styles.retweeted]}>
                    {formatNumber(original.retweets)}
                  </Text>
                </Pressable>
                <Pressable
                  style={styles.actionItem}
                  onPress={() => handleLike(original.id)}
                >
                  <Icon
                    name={original.isLiked ? 'heart' : 'heart-outline'}
                    size={18}
                    color={original.isLiked ? '#F91880' : '#657786'}
                  />
                  <Text style={[styles.actionText, original.isLiked && styles.liked]}>
                    {formatNumber(original.likes)}
                  </Text>
                </Pressable>
                <View style={styles.actionItem}>
                  <Icon name="share-outline" size={18} color="#657786" />
                </View>
              </View>
            </View>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.tweetContainer}>
        <View style={styles.tweetRow}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: tweet.user.avatar }} style={styles.avatar} />
          </View>
          <View style={styles.tweetContent}>
            <View style={styles.tweetHeader}>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{tweet.user.name}</Text>
                {tweet.user.verified && (
                  <Icon name="checkmark-circle" size={16} color="#1DA1F2" style={styles.verifiedBadge} />
                )}
                <Text style={styles.userHandle}>{tweet.user.handle}</Text>
                <Text style={styles.time}>· {tweet.time} ago</Text>
              </View>
              <Icon name="ellipsis-horizontal" size={18} color="#657786" />
            </View>
            <Text style={styles.tweetText}>{tweet.content}</Text>
            {tweet.image && (
              <Image
                source={{ uri: tweet.image }}
                style={[styles.tweetImage, { width: width - 80 }]}
                resizeMode="cover"
              />
            )}
            <View style={styles.tweetActions}>
              <View style={styles.actionItem}>
                <Icon name="chatbubble-outline" size={18} color="#657786" />
                <Text style={styles.actionText}>{formatNumber(tweet.replies)}</Text>
              </View>
              <Pressable
                style={styles.actionItem}
                onPress={() => handleRetweet(tweet)}
              >
                <Icon
                  name={hasCurrentUserRetweeted(tweet) ? 'repeat' : 'repeat-outline'}
                  size={20}
                  color={hasCurrentUserRetweeted(tweet) ? '#00BA7C' : '#657786'}
                />
                <Text style={[styles.actionText, hasCurrentUserRetweeted(tweet) && styles.retweeted]}>
                  {formatNumber(tweet.retweets)}
                </Text>
              </Pressable>
              <Pressable
                style={styles.actionItem}
                onPress={() => handleLike(tweet.id)}
              >
                <Icon
                  name={tweet.isLiked ? 'heart' : 'heart-outline'}
                  size={18}
                  color={tweet.isLiked ? '#F91880' : '#657786'}
                />
                <Text style={[styles.actionText, tweet.isLiked && styles.liked]}>
                  {formatNumber(tweet.likes)}
                </Text>
              </Pressable>
              <View style={styles.actionItem}>
                <Icon name="share-outline" size={18} color="#657786" />
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable>
          <Image source={{ uri: USER_AVATAR }} style={styles.profileImage} />
        </Pressable>
        <Icon name="logo-xing" size={28} color="black" />
        <Icon name="sparkles" size={24} color="black" />
      </View>
      <ScrollView>
        {tweetsData.map(tweet => (
          <Tweet key={tweet.id + (tweet.isRetweet ? 'r' : '')} tweet={tweet} />
        ))}
      </ScrollView>
      <Pressable
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Icon name="add" size={28} color="white" />
      </Pressable>
      {}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        statusBarTranslucent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalOuter}>
          <Pressable style={styles.modalBackdrop} onPress={() => setModalVisible(false)} />
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={28} color="#222" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Compose Tweet</Text>
              <View style={{ width: 28 }} />
            </View>
            <View style={styles.modalBody}>
              <Image source={{ uri: USER_AVATAR }} style={styles.modalAvatar} />
              <TextInput
                placeholder="What's happening?"
                placeholderTextColor="#888"
                style={styles.modalInput}
                multiline
                maxLength={280}
                value={newTweet}
                onChangeText={setNewTweet}
                autoFocus
              />
            </View>
            <View style={styles.modalActionsRow}>
              <TouchableOpacity style={styles.galleryIcon} onPress={openGallery}>
                <Icon name="images" size={26} color="#1DA1F2" />
                <Text style={{color: "#1DA1F2", fontSize: 12, marginLeft: 4}}>Gallery</Text>
              </TouchableOpacity>
              {pickedImageUri && (
                <View style={styles.thumbWrap}>
                  <Image source={{ uri: pickedImageUri }} style={styles.thumbPreview} />
                  <TouchableOpacity
                    style={styles.thumbRemoveButton}
                    onPress={() => setPickedImageUri(null)}
                  >
                    <Icon name="close-circle" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
              <View style={{ flex: 1 }} />
              <TouchableOpacity
                style={[
                  styles.postButton,
                  (!newTweet.trim() && !pickedImageUri) && { opacity: 0.5 }
                ]}
                onPress={handlePost}
                disabled={(!newTweet.trim() && !pickedImageUri) || posting}
              >
                <Text style={styles.postButtonText}>Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 15, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E1E8ED', backgroundColor: 'white',
  },
  profileImage: { width: 32, height: 32, borderRadius: 16 },
  tweetContainer: {
    paddingBottom: 0,
    backgroundColor: 'white',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E1E8ED',
  },
  retweeterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 3,
    paddingLeft: 20,
    backgroundColor: 'white',
  },
  retweeterAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 5,
    borderWidth: 1,
    borderColor: "#e1e8ed"
  },
  retweeterName: {
    fontSize: 13,
    color: '#222',
    fontWeight: 'bold',
    marginRight: 4,
  },
  retweeterHandle: {
    fontSize: 13,
    color: '#657786',
    marginRight: 5,
  },
  retweeterIcon: {},
  retweeterText: {
    fontSize: 12,
    color: '#657786',
    fontWeight: '500',
    letterSpacing: 0.2,
    marginLeft: 2,
  },
  tweetRow: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingTop: 4,
    paddingBottom: 15,
  },
  avatarContainer: { marginRight: 12 },
  avatar: { width: 40, height: 40, borderRadius: 24 },
  tweetContent: { flex: 1 },
  tweetHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  userInfo: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  userName: { fontWeight: 'bold', marginRight: 4 },
  userHandle: { color: '#657786', marginRight: 4 },
  time: { color: '#657786', fontSize: 12 },
  verifiedBadge: { marginRight: 4 },
  tweetText: { fontSize: 16, lineHeight: 22, marginBottom: 12, color: '#14171A' },
  tweetImage: { height: 200, borderRadius: 15, marginBottom: 12 },
  tweetActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginRight: 48 },
  actionItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionText: { color: '#657786', fontSize: 12 },
  liked: { color: '#F91880' },
  retweeted: { color: '#00BA7C' },
  fab: {
    position: 'absolute', bottom: 30, right: 20, backgroundColor: '#1DA1F2',
    width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84,
  },
  modalOuter: { flex: 1, justifyContent: 'flex-end' },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.28)',
  },
  modalContainer: {
    backgroundColor: 'white', borderTopRightRadius: 18, borderTopLeftRadius: 18,
    paddingHorizontal: 18, paddingTop: 14, paddingBottom: 24, minHeight: 230,
  },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7,
  },
  modalTitle: { fontWeight: '700', fontSize: 17, color: '#222' },
  modalBody: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  modalAvatar: { width: 38, height: 38, borderRadius: 19, marginRight: 10, marginTop: 6 },
  modalInput: { flex: 1, minHeight: 44, fontSize: 16, paddingVertical: 6, color: '#222' },
  modalActionsRow: {
    flexDirection: 'row', alignItems: 'center', marginTop: 4,
  },
  galleryIcon: {
    flexDirection: 'row', alignItems: 'center', padding: 3,
    marginRight: 10, backgroundColor: '#F1F8FD', borderRadius: 17, paddingHorizontal: 9, height: 34,
  },
  thumbWrap: {
    marginRight: 10, position: "relative",
    width: 44, height: 44, borderRadius: 10, overflow: "hidden", borderWidth: 1, borderColor: "#e1e8ed",
    justifyContent: "center", alignItems: "center"
  },
  thumbPreview: { width: 44, height: 44, borderRadius: 8 },
  thumbRemoveButton: {
    position: "absolute", top: -10, right: -10, backgroundColor: "#222",
    borderRadius: 12, padding: 1,
  },
  postButton: {
    alignSelf: 'flex-end', backgroundColor: '#1DA1F2', paddingHorizontal: 22,
    paddingVertical: 10, borderRadius: 22, marginTop: 6,
  },
  postButtonText: { color: 'white', fontWeight: 'bold', fontSize: 15, letterSpacing: 0.5 },
});

export default HomeScreen;