import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Alert,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { Camera } from 'react-native-camera-kit';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function ScanScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [flashOn, setFlashOn] = useState(false);
  const laserAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA
        );
        setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
      } else {
        setHasPermission(true);
      }
    })();
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(laserAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(laserAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [laserAnim]);

  const handleScan = ({ nativeEvent }) => {
    const code = nativeEvent.codeStringValue || '';
    const match = code.match(/[?&]pa=([^&]+)/i);
    if (match?.[1]) {
      const upiId = decodeURIComponent(match[1]);
      navigation.navigate('PayScreen', { upiId });
    } else {
      Alert.alert('Invalid QR', 'Please scan a valid UPI QR code');
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.centered}>
        <Text style={styles.permissionText}>Requesting Camera Permission...</Text>
      </View>
    );
  }
  if (!hasPermission) {
    return (
      <View style={styles.centered}>
        <Icon name="camera-off" size={50} color="#FF5252" />
        <Text style={styles.permissionText}>Camera permission required</Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={() =>
            PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA).then(
              (granted) => setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED)
            )
          }
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        flashMode={flashOn ? 'on' : 'off'}
        scanBarcode={true}
        onReadCode={handleScan}
      />
      <View style={styles.overlay}>
        <Text style={styles.instructionText}>Align the QR code within the frame</Text>
        <View style={styles.frameContainer}>
          <Animated.View
            style={[
              styles.laser,
              {
                transform: [
                  {
                    translateY: laserAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 250],
                    }),
                  },
                ],
              },
            ]}
          />
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>
        <Text style={styles.helperText}>Scanning will start automatically</Text>

        <View style={styles.controls}>
          <TouchableOpacity onPress={() => setFlashOn(!flashOn)} style={styles.controlButton}>
            <Icon name={flashOn ? 'flash-on' : 'flash-off'} size={24} color="white" />
            <Text style={styles.controlText}>{flashOn ? 'Flash On' : 'Flash Off'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Alert.alert('Gallery', 'Gallery pick not implemented yet.')}
            style={styles.controlButton}
          >
            <Icon name="photo-library" size={24} color="white" />
            <Text style={styles.controlText}>Gallery</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A1A' },
  camera: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100,
  },
  instructionText: { color: 'white', fontSize: 18, marginBottom: 20, fontWeight: '500' },
  helperText: { color: 'rgba(255,255,255,0.8)', marginTop: 20, fontSize: 14 },
  frameContainer: { width: 250, height: 250, marginVertical: 20 },
  laser: { height: 2, backgroundColor: '#FF3D00', width: '100%' },
  corner: { position: 'absolute', width: 30, height: 30, borderColor: '#00C853' },
  topLeft: { top: 0, left: 0, borderLeftWidth: 4, borderTopWidth: 4 },
  topRight: { top: 0, right: 0, borderRightWidth: 4, borderTopWidth: 4 },
  bottomLeft: { bottom: 0, left: 0, borderLeftWidth: 4, borderBottomWidth: 4 },
  bottomRight: { bottom: 0, right: 0, borderRightWidth: 4, borderBottomWidth: 4 },
  controls: {
    position: 'absolute',
    bottom: 30,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  controlButton: { alignItems: 'center', marginHorizontal: 20 },
  controlText: { color: 'white', marginTop: 6, fontSize: 14 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  permissionText: { fontSize: 18, color: '#FF5252', textAlign: 'center' },
  permissionButton: { marginTop: 20, padding: 12, backgroundColor: '#FF5252', borderRadius: 8 },
  permissionButtonText: { color: 'white', fontSize: 18 },
});
