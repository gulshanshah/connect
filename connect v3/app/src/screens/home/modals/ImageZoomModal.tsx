import React from 'react';
import { Modal, View, StyleSheet, Dimensions, TouchableOpacity, Text, StatusBar } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import Icon from 'react-native-vector-icons/Ionicons';

interface ImageZoomModalProps {
  visible: boolean;
  images: { url: string }[];
  initialIndex?: number;
  onClose: () => void;
}

const ImageZoomModal: React.FC<ImageZoomModalProps> = ({
  visible,
  images,
  initialIndex = 0,
  onClose,
}) => {
  return (
    <Modal visible={visible} transparent={true} onRequestClose={onClose}>
      <StatusBar backgroundColor={'#000'}
        barStyle="light-content"
        hidden={false} 
        />
      <View style={styles.container}>
        <ImageViewer
          imageUrls={images}
          index={initialIndex}
          enableSwipeDown
          onSwipeDown={onClose}
          backgroundColor="black"
        />

        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Icon name="close" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default ImageZoomModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  closeBtn: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
});
