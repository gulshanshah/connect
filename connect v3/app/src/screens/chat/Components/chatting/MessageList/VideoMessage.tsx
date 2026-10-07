import React, { useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  ActivityIndicator,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';

const formatDuration = (sec) => {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

const VideoMessage = ({ message }) => {
  const videoRef = useRef(null);
  const [paused, setPaused] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [error, setError] = useState(false);

  React.useEffect(() => {
    if (showControls && !paused) {
      const timer = setTimeout(() => setShowControls(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [showControls, paused]);

  const toggleControls = () => {
    setShowControls(true);
  };
  const togglePlay = () => {
    setPaused((prev) => !prev);
    setShowControls(true);
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={toggleControls}>
        <View>
          <Video
            ref={videoRef}
            source={{ uri: message.uri }}
            style={styles.video}
            paused={paused}
            poster={message.thumbnail}
            posterResizeMode="cover"
            resizeMode="cover"
            controls={false}
            onLoadStart={() => { setLoading(true); setError(false); }}
            onLoad={data => {
              setDuration(data.duration);
              setLoading(false);
              setError(false);
            }}
            onError={() => { setError(true); setLoading(false); }}
            onEnd={() => setPaused(true)}
            onProgress={prg => setCurrentTime(prg.currentTime)}
          />
          {(loading || error) && (
            <View style={styles.loadingOverlay}>
              {error ? (
                <Text style={styles.errorText}>Failed to load video</Text>
              ) : (
                <ActivityIndicator size="large" color="#fff" />
              )}
            </View>
          )}
          {!!paused && !loading && !error && (
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.playButton}
              onPress={togglePlay}
            >
              <Icon name="play-circle-filled" size={56} color="rgba(255,255,255,0.95)" />
            </TouchableOpacity>
          )}
          {}
          {showControls && !loading && !error && (
            <View style={styles.controlsOverlay}>
              <TouchableOpacity onPress={togglePlay} style={styles.control}>
                <Icon
                  name={paused ? 'play-arrow' : 'pause'}
                  size={34}
                  color="#fff"
                  style={{ marginRight: 4 }}
                />
              </TouchableOpacity>
              <Text style={styles.durationControlText}>
                {formatDuration(currentTime)} / {formatDuration(duration)}
              </Text>
              <TouchableOpacity
                onPress={() => videoRef.current?.presentFullscreenPlayer()}
                style={styles.control}
              >
                <Icon name="fullscreen" size={28} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
          {}
          {}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    width: 240,
    height: 160,
    backgroundColor: '#000',
  },
  video: {
    width: 240,
    height: 160,
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -28,
    marginLeft: -28,
    zIndex: 8,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  controlsOverlay: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    zIndex: 7,
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 8,
    height: 38,
    justifyContent: 'space-between',
  },
  control: {
    padding: 2,
  },
  durationControlText: {
    color: '#fff',
    fontSize: 13,
    flex: 1,
    textAlign: 'center',
    opacity: 0.8,
  },
  durationCorner: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 10,
  },
  durationText: {
    color: '#fff',
    fontSize: 12,
    fontVariant: ['tabular-nums'],
  },
});

export default VideoMessage;