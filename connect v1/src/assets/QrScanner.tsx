import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Alert,
  TouchableOpacity,
  Animated,
  Easing
} from 'react-native';
import { Camera } from 'react-native-camera-kit';
import Icon from 'react-native-vector-icons/MaterialIcons';

const App = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [upiId, setUpiId] = useState('');
  const [flashOn, setFlashOn] = useState(false);
  const [laserAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const requestPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA
        );
        setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
      } else {
        setHasPermission(true);
      }
    };
    requestPermission();
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(laserAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true
        }),
        Animated.timing(laserAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true
        })
      ])
    ).start();
  }, []);

  const ScannerFrame = () => (
    <View style={styles.frameContainer}>
      <Animated.View style={[styles.laser, {
        transform: [{
          translateY: laserAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 250]
          })
        }]
      }]} />

      <View style={[styles.corner, styles.topLeft]} />
      <View style={[styles.corner, styles.topRight]} />
      <View style={[styles.corner, styles.bottomLeft]} />
      <View style={[styles.corner, styles.bottomRight]} />
    </View>
  );

  const ResultScreen = () => (
    <View style={styles.resultContainer}>
      <Icon name="check-circle" size={80} color="#4CAF50" style={styles.successIcon} />
      <Text style={styles.resultTitle}>Scan Successful!</Text>
      
      <View style={styles.upiContainer}>
        <Text style={styles.upiLabel}>UPI ID:</Text>
        <Text style={styles.upiId}>{upiId}</Text>
      </View>

      <TouchableOpacity 
        style={styles.rescanButton}
        onPress={() => setUpiId('')}
      >
        <Icon name="camera-alt" size={24} color="white" />
        <Text style={styles.rescanText}>Scan Again</Text>
      </TouchableOpacity>
    </View>
  );

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
          onPress={() => PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA)
            .then(granted => setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED))}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!upiId ? (
        <>
          <Camera
            style={styles.camera}
            flashMode={flashOn ? 'on' : 'off'}
            scanBarcode={true}
            onReadCode={(event) => {
              const code = event.nativeEvent.codeStringValue || '';
              const match = code.match(/[?&]pa=([^&]+)/i);
              if (match?.[1]) {
                setUpiId(decodeURIComponent(match[1]));
              } else {
                Alert.alert('Invalid QR', 'Please scan a valid UPI QR code');
              }
            }}
          />
          
          <View style={styles.overlay}>
            <Text style={styles.instructionText}>Align the QR code within the frame</Text>
            <ScannerFrame />
            <Text style={styles.helperText}>Scanning will start automatically</Text>

            {}
            <View style={styles.controls}>
              <TouchableOpacity onPress={() => setFlashOn(!flashOn)} style={styles.controlButton}>
                <Icon name={flashOn ? 'flash-on' : 'flash-off'} size={24} color="white" />
                <Text style={styles.controlText}>{flashOn ? 'Flash On' : 'Flash Off'}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => Alert.alert('Gallery', 'Gallery pick not implemented yet.')} style={styles.controlButton}>
                <Icon name="photo-library" size={24} color="white" />
                <Text style={styles.controlText}>Gallery</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      ) : (
        <ResultScreen />
      )}
    </View>
  );
};

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
  frameContainer: {
    width: 250,
    height: 250,
    marginVertical: 20,
  },
  laser: {
    height: 2,
    backgroundColor: '#FF3D00',
    width: '100%',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#00C853',
  },
  topLeft: { top: 0, left: 0, borderLeftWidth: 4, borderTopWidth: 4 },
  topRight: { top: 0, right: 0, borderRightWidth: 4, borderTopWidth: 4 },
  bottomLeft: { bottom: 0, left: 0, borderLeftWidth: 4, borderBottomWidth: 4 },
  bottomRight: { bottom: 0, right: 0, borderRightWidth: 4, borderBottomWidth: 4 },
  instructionText: { color: 'white', fontSize: 18, marginBottom: 20, fontWeight: '500' },
  helperText: { color: 'rgba(255,255,255,0.8)', marginTop: 20, fontSize: 14 },
  controls: {
    position: 'absolute',
    bottom: 30,
    flexDirection: 'row',
    gap: 30,
    justifyContent: 'center',
  },
  controlButton: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  controlText: {
    color: 'white',
    marginTop: 6,
    fontSize: 14,
  },
  resultContainer: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  successIcon: { marginBottom: 20 },
  resultTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, color: '#333' },
  upiContainer: {
    backgroundColor: '#F5F5F5',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  upiLabel: { fontSize: 16, color: '#666', marginBottom: 8 },
  upiId: { fontSize: 18, fontWeight: '500', color: '#222', textAlign: 'center' },
  rescanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginTop: 30,
    elevation: 2,
  },
  rescanText: { color: 'white', marginLeft: 10, fontSize: 16, fontWeight: '500' },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  permissionText: { fontSize: 18, color: '#333', marginVertical: 20 },
  permissionButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default App;
