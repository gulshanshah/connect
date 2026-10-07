import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  PanGestureHandler,
  PinchGestureHandler,
  RotationGestureHandler,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import ViewShot from 'react-native-view-shot';
import { captureRef } from 'react-native-view-shot';
import RNFS from 'react-native-fs';

const viewShotRef = useRef();

const clamp = (value, lower, upper) => {
  'worklet';
  return Math.min(Math.max(value, lower), upper);
};

const SCREEN_WIDTH = Dimensions.get('window').width;
const PRESET_SIZES = [SCREEN_WIDTH * 1.4, SCREEN_WIDTH * 1.2, SCREEN_WIDTH, SCREEN_WIDTH * 0.8, SCREEN_WIDTH * 0.6];
const BORDER_WIDTH = 0.2;

export default function PhotoEditor({ source = { uri: 'https://picsum.photos/400' }, onDone }) {
  const [frameIndex, setFrameIndex] = useState(0);
  const [blurOn, setBlurOn] = useState(true);
  const FRAME_HEIGHT = PRESET_SIZES[frameIndex];


  const panRef = useRef();
  const pinchRef = useRef();
  const rotationRef = useRef();

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const panHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => { ctx.startX = translateX.value; ctx.startY = translateY.value; },
    onActive: (e, ctx) => {
      translateX.value = ctx.startX + e.translationX;
      translateY.value = ctx.startY + e.translationY;
    },
  });

  const pinchHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => { ctx.startScale = scale.value; },
    onActive: (e, ctx) => {
      scale.value = clamp(ctx.startScale * e.scale, 0.5, 3);
    },
  });

  const rotationHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => { ctx.startRotate = rotation.value; },
    onActive: (e, ctx) => { rotation.value = ctx.startRotate + e.rotation; },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    zIndex: 2,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotateZ: `${rotation.value}rad` },
      { scale: scale.value },
    ],
  }));

  return (
    <GestureHandlerRootView style={styles.container}>
    <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }}>
      {}
      <View style={[styles.frameContainer, { width: SCREEN_WIDTH, height: FRAME_HEIGHT }]} pointerEvents="none">
        {blurOn ? (
          <Image source={source} style={styles.blurBackground} blurRadius={20} />
        ) : (
          <View style={[styles.blurBackground, { backgroundColor: '#000' }]} />
        )}
        <View style={styles.frameOverlay} />
      </View>

      {}
      <PanGestureHandler
        ref={panRef}
        onGestureEvent={panHandler}
        simultaneousHandlers={[pinchRef, rotationRef]}
      >
        <Animated.View style={[styles.frameContainer, { width: SCREEN_WIDTH, height: FRAME_HEIGHT }]}>  
          <RotationGestureHandler
            ref={rotationRef}
            onGestureEvent={rotationHandler}
            simultaneousHandlers={[panRef, pinchRef]}
          >
            <Animated.View>
              <PinchGestureHandler
                ref={pinchRef}
                onGestureEvent={pinchHandler}
                simultaneousHandlers={[panRef, rotationRef]}
              >
                <Animated.View style={[styles.imageWrapper, { width: SCREEN_WIDTH, height: FRAME_HEIGHT }, animatedStyle]}>  
                  <Image source={source} style={styles.image} resizeMode="contain" />
                </Animated.View>
              </PinchGestureHandler>
            </Animated.View>
          </RotationGestureHandler>
        </Animated.View>
      </PanGestureHandler>
      </ViewShot>

      {}
      <View style={styles.optionsBar} pointerEvents="auto">
        <TouchableOpacity style={styles.optionButton} onPress={() => setFrameIndex((frameIndex + 1) % PRESET_SIZES.length)}>
          <Icon name="move-outline" size={32} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton} onPress={() => setBlurOn(!blurOn)}>
          <Icon name={blurOn ? 'water' : 'water-outline'} size={32} color="#fff" />
        </TouchableOpacity>
      </View>

      {}
      <TouchableOpacity
        style={styles.doneButton}
        onPress={() => onDone({ translateX: translateX.value, translateY: translateY.value, rotation: rotation.value, scale: scale.value })}
      >
        <Icon name="checkmark-circle" size={50} color="#0f0" />
      </TouchableOpacity>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  frameContainer: {
    position: 'absolute',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  frameOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: BORDER_WIDTH,
    borderColor: '#fff',
  },
  imageWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  optionsBar: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: 40,
    zIndex: 4,
    left: 60,
    gap: 30,
  },
  optionButton: {
    padding: 10,
  },
  doneButton: {
    position: 'absolute',
    bottom: 40,
    right: 50,
    zIndex: 4,
  },
});