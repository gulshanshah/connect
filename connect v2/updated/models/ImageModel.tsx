import React from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const screenWidth = Dimensions.get('window').width;

type Props = {
  visible: boolean;
  images: { url: string }[];
  initialIndex: number;
  onClose: () => void;
};

const ImageModal: React.FC<Props> = ({ visible, images, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);
  const flatListRef = React.useRef<FlatList>(null);

  React.useEffect(() => {
    if (visible) {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({ index: initialIndex, animated: false });
        setCurrentIndex(initialIndex);
      }, 50);
    }
  }, [visible, initialIndex]);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <FlatList
          ref={flatListRef}
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <Image source={{ uri: item.url }} style={styles.image} resizeMode="contain" />
          )}
          onMomentumScrollEnd={(e) => {
            const newIndex = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
            setCurrentIndex(newIndex);
          }}
        />

        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Icon name="close" size={28} color="#fff" />
        </TouchableOpacity>

        <View style={styles.counter}>
          <Text style={styles.counterText}>
            {currentIndex + 1} / {images.length}
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default ImageModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
  },
  image: {
    width: screenWidth,
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
  counter: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  counterText: {
    color: '#fff',
    fontSize: 14,
  },
});
