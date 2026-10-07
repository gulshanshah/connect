import React, { useState } from 'react';
import { Image, TouchableOpacity, StyleSheet, View } from 'react-native';
import ImageZoomModal from '../../../../home/modals/ImageZoomModal';

const ImageMessage = ({ message }: { message: any }) => {
  const [zoomModalVisible, setZoomModalVisible] = useState(false);

  const images = (message.images ?? [{ uri: message.uri }]).map((img: any) => ({
    url: img.url || img.uri || '',
  }));

  return (
    <View>
      <TouchableOpacity activeOpacity={0.8} onPress={() => setZoomModalVisible(true)}>
        <Image source={{ uri: message.uri }} style={styles.image} />
      </TouchableOpacity>

      <ImageZoomModal
        visible={zoomModalVisible}
        images={images}
        initialIndex={0}
        onClose={() => setZoomModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 240,
    height: 160,
    borderRadius: 12,
    marginVertical: 4,
  },
});

export default ImageMessage;
