import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

type Props = {
  progress: Animated.Value;
  storiesCount: number;
  currentIndex: number;
};

const Progress: React.FC<Props> = ({ progress, storiesCount, currentIndex }) => {
  return (
    <View style={styles.container}>
      {[...Array(storiesCount)].map((_, i) => {
        if (i < currentIndex) {
          return (
            <View key={i} style={[styles.track, styles.completedTrack]}>
              <View style={[styles.bar, styles.completedBar]} />
            </View>
          );
        }
        
        if (i === currentIndex) {
          return (
            <View key={i} style={styles.track}>
              <Animated.View 
                style={[
                  styles.bar, 
                  { 
                    width: progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%']
                    }) 
                  }
                ]} 
              />
            </View>
          );
        }
        
        return (
          <View key={i} style={styles.track}>
            <View style={styles.bar} />
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingHorizontal: 5,
  },
  track: {
    flex: 1,
    height: 3,
    marginHorizontal: 2,
    borderRadius: 1,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    backgroundColor: '#feda75',
    width: '0%',
  },
  completedTrack: {
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  completedBar: {
    backgroundColor: '#fada75',
    width: '100%',
  },
});

export default Progress;