import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert,
  Platform,
  PermissionsAndroid,
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
import ViewShot, { captureRef } from 'react-native-view-shot';

const clamp = (value, lower, upper) => {
  'worklet';
  return Math.min(Math.max(value, lower), upper);
};

const SCREEN_WIDTH = Dimensions.get('window').width;
const PRESET_SIZES = {
  large: SCREEN_WIDTH * 1.4,
  medium: SCREEN_WIDTH * 1.2,
  square: SCREEN_WIDTH,
  small: SCREEN_WIDTH * 0.8,
  xsmall: SCREEN_WIDTH * 0.6,
};
const PRESET_SIZE_KEYS = Object.keys(PRESET_SIZES);
const BORDER_WIDTH = 0.2;


const requestStoragePermission = async () => {
  if (Platform.OS === 'android') {
    const apiLevel = Platform.Version;

    if (apiLevel >= 33) {
      const readMediaImagesGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        {
          title: "Photos Access",
          message: "This app needs access to your photos to save edited images.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      return readMediaImagesGranted === PermissionsAndroid.RESULTS.GRANTED;
    }
    else if (apiLevel >= 29) {
      console.log("Android API level >= 29, assuming app-private storage no permission needed.");
      return true;
    }
    else {
      const writeGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "Storage Permission",
          message: "This app needs access to your storage to save edited photos.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      return writeGranted === PermissionsAndroid.RESULTS.GRANTED;
    }
  }
  return true;
};

export default function PhotoEditor({ source, initialFrameIndex = 2, onSave, onClose }) {
  const [frameIndex, setFrameIndex] = useState(initialFrameIndex);
  const [blurOn, setBlurOn] = useState(true);

  useEffect(() => {
    setFrameIndex(initialFrameIndex);
  }, [initialFrameIndex]);

  const FRAME_HEIGHT = PRESET_SIZES[PRESET_SIZE_KEYS[frameIndex]];

  const viewShotRef = useRef();

  const panRef = useRef();
  const pinchRef = useRef();
  const rotationRef = useRef();

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  useEffect(() => {
    translateX.value = 0;
    translateY.value = 0;
    scale.value = 1;
    rotation.value = 0;
  }, [source.uri]);

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

  const handleCaptureAndSave = async () => {

      if (Platform.OS === 'android') {
        const hasPermission = await requestStoragePermission();
        if (!hasPermission) {
            Alert.alert('Permission Denied', 'Cannot save image without necessary storage permission. Please enable it in app settings.');
            return;
        }
    }

    try {
      if (viewShotRef.current) {
        const uri = await captureRef(viewShotRef, {
          format: 'jpg',
          quality: 0.9,
          result: 'tmpfile',
        });

        console.log('Edited image captured URI:', uri);

        const fileName = uri.split('/').pop();
        const fileType = 'image/jpeg';
        const fileInfo = {
          type: 'image',
          uri: uri,
          fileName: fileName,
          fileSize: 0,
          width: SCREEN_WIDTH,
          height: FRAME_HEIGHT,
        };

        if (onSave) {
          onSave(fileInfo);
        }
        if (onClose) {
          onClose();
        }
      }
    } catch (error) {
      console.error('Failed to capture image:', error);
      Alert.alert('Error', `Failed to process image: ${error.message}. Please try again.`);
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      {}
      <TouchableOpacity style={styles.backButton} onPress={onClose}>
        <Icon name="arrow-back-circle-outline" size={40} color="#fff" />
      </TouchableOpacity>

      {}
      <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 0.9 }} style={{ width: SCREEN_WIDTH, height: FRAME_HEIGHT }}>
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
        <TouchableOpacity style={styles.optionButton} onPress={() => setFrameIndex((prevIndex) => (prevIndex + 1) % PRESET_SIZE_KEYS.length)}>
          <Icon name="expand-outline" size={32} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton} onPress={() => setBlurOn(!blurOn)}>
          <Icon name={blurOn ? 'water' : 'water-outline'} size={32} color="#fff" />
        </TouchableOpacity>
      </View>

      {}
      <TouchableOpacity
        style={styles.doneButton}
        onPress={handleCaptureAndSave}
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
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 5,
  },
});