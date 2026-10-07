import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { Story as StoryType } from '../types';

type Props = { story: StoryType };

export default function Story({ story }: Props) {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.8}>
      <Image source={{ uri: story.image }} style={styles.image} />
      <Text style={styles.user}>{story.user}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 120,
    marginRight: 16,
  },
  image: {
    width: 120,
    height: 160,
    borderRadius: 16,
  },
  user: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#2d3436',
    textAlign: 'center',
  },
});
