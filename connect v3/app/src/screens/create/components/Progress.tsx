import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

type ProgressProps = {
  progress: Animated.Value;
  storiesCount: number;
};

const Progress: React.FC<ProgressProps> = ({ progress, storiesCount }) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: storiesCount }).map((_, i) => {
        const start = i / storiesCount;
        const end = (i + 1) / storiesCount;
        const width = progress.interpolate({
          inputRange: [start, end],
          outputRange: ['0%', '100%'],
          extrapolate: 'clamp',
        });
        return (
          <View style={styles.segmentWrapper} key={i}>
            <Animated.View style={[styles.segmentFill, { width }]} />
          </View>
        );
      })}
    </View>
  );
};

export default Progress;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  segmentWrapper: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.6)',
    marginHorizontal: 2,
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  segmentFill: {
    height: 3,
    backgroundColor: '#feda75',
  },
});
