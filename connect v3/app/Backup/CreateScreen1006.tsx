import React, { useRef, useState } from 'react';
import { View, StyleSheet, Image, Animated, PanResponder, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const FRAME_WIDTH = SCREEN_WIDTH - 40;
const MIN_FRAME_HEIGHT = 200;
const MAX_FRAME_HEIGHT = 400;
const BORDER_HANDLE_HEIGHT = 30;

const InstagramEditor = () => {
  const [frameHeight, setFrameHeight] = useState(300);

  const scale = useRef(new Animated.Value(1)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const pan = useRef(new Animated.ValueXY()).current;

  const lastScale = useRef(1);
  const lastRotate = useRef(0);
  const lastPan = useRef({ x: 0, y: 0 });

  const initialDistance = useRef(null);
  const initialAngle = useRef(null);

  const mediaSource = { uri: 'https://picsum.photos/800/800' };

  const borderPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: (_, gestureState) => {
      const touchY = gestureState.y0;
      const isTopBorder = touchY < BORDER_HANDLE_HEIGHT;
      const isBottomBorder = touchY > frameHeight - BORDER_HANDLE_HEIGHT;
      return isTopBorder || isBottomBorder;
    },
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.y0 < BORDER_HANDLE_HEIGHT) {
        const newHeight = frameHeight + gestureState.dy;
        if (newHeight >= MIN_FRAME_HEIGHT && newHeight <= MAX_FRAME_HEIGHT) {
          setFrameHeight(newHeight);
        }
      } else if (gestureState.y0 > frameHeight - BORDER_HANDLE_HEIGHT) {
        const newHeight = frameHeight - gestureState.dy;
        if (newHeight >= MIN_FRAME_HEIGHT && newHeight <= MAX_FRAME_HEIGHT) {
          setFrameHeight(newHeight);
        }
      }
    },
  });

  const mediaPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      lastPan.current = { x: pan.x._value, y: pan.y._value };
      lastScale.current = scale._value;
      lastRotate.current = rotate._value;
      initialDistance.current = null;
      initialAngle.current = null;
    },
    onPanResponderMove: (evt, gestureState) => {
      const touches = evt.nativeEvent.touches;

      if (touches.length === 2) {
        const dx = touches[1].pageX - touches[0].pageX;
        const dy = touches[1].pageY - touches[0].pageY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);

        if (initialDistance.current === null) {
          initialDistance.current = distance;
          initialAngle.current = angle;
        }

        const scaleFactor = distance / initialDistance.current;
        const newScale = Math.max(0.5, Math.min(3, lastScale.current * scaleFactor));
        scale.setValue(newScale);

        const angleDiff = angle - initialAngle.current;
        rotate.setValue(lastRotate.current + angleDiff);
      } else if (touches.length === 1) {
        const newX = lastPan.current.x + gestureState.dx;
        const newY = lastPan.current.y + gestureState.dy;

        pan.x.setValue(newX);
        pan.y.setValue(newY);
      }
    },
    onPanResponderRelease: () => {
      lastPan.current = { x: pan.x._value, y: pan.y._value };
      lastScale.current = scale._value;
      lastRotate.current = rotate._value;
      initialDistance.current = null;
      initialAngle.current = null;
    },
  });

  const transform = [
    { translateX: pan.x },
    { translateY: pan.y },
    { scale: scale },
    {
      rotate: rotate.interpolate({
        inputRange: [-Math.PI, Math.PI],
        outputRange: ['-180rad', '180rad'],
      }),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={[styles.frame, { height: frameHeight }]}>
        <View style={styles.backgroundContainer}>
          <Image
            source={mediaSource}
            style={[
              styles.backgroundMedia,
              {
                width: FRAME_WIDTH * 1.5,
                height: frameHeight * 1.5,
                marginLeft: -FRAME_WIDTH * 0.25,
                marginTop: -frameHeight * 0.25,
              },
            ]}
            blurRadius={15}
          />
          <View style={styles.backgroundOverlay} />
        </View>

        <Animated.View style={[styles.mediaContainer, { transform }]} {...mediaPanResponder.panHandlers}>
          <Image source={mediaSource} style={styles.media} resizeMode="cover" />
        </Animated.View>

        <View style={[styles.borderHandle, styles.topBorderHandle]} {...borderPanResponder.panHandlers} />
        <View style={[styles.borderHandle, styles.bottomBorderHandle]} {...borderPanResponder.panHandlers} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  frame: {
    width: FRAME_WIDTH,
    borderRadius: 8,
    overflow: 'hidden',
    borderColor: 'rgba(255,255,255,0.5)',
    borderWidth: 1,
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  backgroundMedia: {
    opacity: 0.6,
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  mediaContainer: {
    width: '100%',
    height: '100%',
    zIndex: 2,
  },
  media: {
    width: '100%',
    height: '100%',
  },
  borderHandle: {
    position: 'absolute',
    width: '100%',
    height: BORDER_HANDLE_HEIGHT,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  topBorderHandle: {
    top: 0,
    borderBottomWidth: 2,
    borderColor: 'rgba(255,255,255,0.7)',
  },
  bottomBorderHandle: {
    bottom: 0,
    borderTopWidth: 2,
    borderColor: 'rgba(255,255,255,0.7)',
  },
});

export default InstagramEditor;
