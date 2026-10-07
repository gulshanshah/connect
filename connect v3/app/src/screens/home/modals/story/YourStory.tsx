
import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';

import { stories, user, viewers } from './data';
import Progress from './components/Progress';
import Head from './components/Head';
import Content from './components/Content';
import Foot from './components/Foot';

const { width } = Dimensions.get('window');

const YourStory = () => {
  const [current, setCurrent] = useState(0);
  const [viewersVisible, setViewersVisible] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;

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
      <Progress progress={progress} />
      <Head user={user} />
      <Content
        story={stories[current]}
        onPrev={() => current > 0 && setCurrent(current - 1)}
        onNext={() => current < stories.length - 1 && setCurrent(current + 1)}
      />
      <Foot
        viewers={viewers}
        visible={viewersVisible}
        onToggleModal={() => setViewersVisible(!viewersVisible)}
      />
    </View>
  );
};

export default YourStory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 40,
  },
});
