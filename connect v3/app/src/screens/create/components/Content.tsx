import React from 'react';
import { View, Image, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';

const { width } = Dimensions.get('window');

const Content = ({ story, onPrev, onNext }) => {
  return (
    <View style={{ flex: 1 }} pointerEvents="box-none">
      <View style={styles.tapAreaContainer} pointerEvents="box-none">
        <TouchableOpacity style={styles.tapArea} onPress={onPrev} />
        <TouchableOpacity style={styles.tapArea} onPress={onNext} />
      </View>
      <Image
        key={story.id}
        source={{ uri: story.image }}
        style={styles.storyImage}
        resizeMode="cover"
      />
      <Text style={styles.caption}>{story.caption}</Text>
    </View>
  );
};

export default Content;

const styles = StyleSheet.create({
  storyImage: {
    width: width,
    minHeight: 500,
    maxHeight: 650,
    resizeMode: 'cover',
  },
  caption: {
    color: '#000',
    padding: 10,
    fontSize: 16,
    marginLeft: 5,
  },
  tapAreaContainer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    zIndex: 1,
    bottom: 100,
  },
  tapArea: {
    flex: 1,
  },
});

