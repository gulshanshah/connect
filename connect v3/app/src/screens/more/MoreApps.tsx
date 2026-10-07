import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutUp,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const PANEL_WIDTH = width * 0.6;
const ITEM_SPACING = 12;

const APP_DATA = [
  { id: '1', title: 'Settings', icon: 'settings-outline' },
  { id: '2', title: 'Saved', icon: 'bookmark-outline' },
  { id: '3', title: 'Scan', icon: 'qr-code-outline' },
  { id: '4', title: 'Help', icon: 'help-circle-outline' },
  { id: '5', title: 'Share', icon: 'share-social-outline' },
  { id: '6', title: 'About', icon: 'information-circle-outline' },
];

const MoreApps = ({ onClose }) => {
  const handleAppPress = (app) => {
    console.log('App pressed:', app.title);
    onClose();
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          style={styles.backdrop}
          entering={FadeIn.duration(150)}
          exiting={FadeOut.duration(100)}
        />
      </TouchableWithoutFeedback>

      <Animated.View
        style={styles.panelContainer}
        entering={SlideInDown.duration(250).springify()}
        exiting={SlideOutUp.duration(200)}
      >
        {}
        <View style={styles.panelHeader}>
          <View style={styles.arrow} />
        </View>

        {}
        <View style={styles.gridContainer}>
          {APP_DATA.map((app) => (
            <TouchableOpacity
              key={app.id}
              style={styles.appItem}
              activeOpacity={0.7}
              onPress={() => handleAppPress(app)}
            >
              <View style={styles.appIcon}>
                <Icon name={app.icon} size={24} color="#333" />
              </View>
              <Text style={styles.appLabel}>{app.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  panelContainer: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: PANEL_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
    zIndex: 1000,
  },
  panelHeader: {
    position: 'absolute',
    top: -10,
    right: 20,
    width: 20,
    height: 10,
    alignItems: 'center',
  },
  arrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#fff',
    transform: [{ translateY: -5 }],
  },
  gridContainer: {
    padding: ITEM_SPACING,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  appItem: {
    width: (PANEL_WIDTH - ITEM_SPACING * 3) / 2,
    alignItems: 'center',
    marginBottom: ITEM_SPACING,
    padding: 8,
  },
  appIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  appLabel: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
});

export default MoreApps;