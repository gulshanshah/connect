import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

const audioRecorderPlayer = new AudioRecorderPlayer();

function formatTime(sec = 0) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

const AudioMessage = ({ message }) => {
  const { uri, isUser } = message;
  const [playing, setPlaying] = useState(false);
  const [durationSec, setDurationSec] = useState(0);
  const [positionSec, setPositionSec] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();
    };
  }, [uri]);

  useEffect(() => {
    let mounted = true;
    if (playing) {
      setLoading(true);
      audioRecorderPlayer.startPlayer(uri).then(() => {
        audioRecorderPlayer.setVolume(1.0);
        audioRecorderPlayer.addPlayBackListener(e => {
          if (!mounted) return;
          if (e.duration && durationSec !== Math.floor(e.duration / 1000)) {
            setDurationSec(Math.floor(e.duration / 1000));
          }
          setPositionSec(Math.floor(e.currentPosition / 1000));
          progressAnim.setValue(e.duration ? (e.currentPosition / e.duration) : 0);
          setLoading(false);
          if (e.currentPosition >= e.duration) {
            setPlaying(false);
            setPositionSec(0);
            progressAnim.setValue(0);
            audioRecorderPlayer.stopPlayer();
            audioRecorderPlayer.removePlayBackListener();
          }
        });
      });
    } else {
      audioRecorderPlayer.pausePlayer();
    }
    return () => {
      mounted = false;
      audioRecorderPlayer.removePlayBackListener();
      audioRecorderPlayer.stopPlayer();
    };
  }, [playing, uri]);

  useEffect(() => {
    if (!playing && positionSec >= durationSec && durationSec !== 0) {
      setPositionSec(0);
      progressAnim.setValue(0);
    }
  }, [playing, positionSec, durationSec]);

  const handlePlayPause = () => {
    if (loading) return;
    setPlaying(prev => !prev);
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.otherContainer,
        playing && styles.playing,
      ]}
      activeOpacity={0.88}
      onPress={handlePlayPause}
      disabled={loading}
    >
      <Icon
        name={playing ? 'pause' : 'play-arrow'}
        size={28}
        color={isUser ? '#fff' : '#333'}
        style={styles.icon}
      />
      {}
      <View style={styles.progress}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              backgroundColor: isUser ? '#fff' : '#007bff',
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
      <Text style={[styles.time, isUser && styles.userTime]}>
        {formatTime(positionSec)} / {formatTime(durationSec)}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    minWidth: 200,
    marginVertical: 4,
  },
  playing: {
    opacity: 0.94,
    transform: [{ scale: 0.99 }],
  },
  userContainer: {
  },
  otherContainer: {
  },
  icon: {
    marginRight: 7,
    marginLeft: 3,
  },
  waveformIcon: {
    marginRight: 8,
    opacity: 0.7,
  },
  progress: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.13)',
    borderRadius: 2,
    overflow: 'hidden',
    marginRight: 12,
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  time: {
    fontSize: 13,
    color: '#666',
    fontVariant: ['tabular-nums'],
    minWidth: 68,
    textAlign: 'right',
  },
  userTime: {
    color: '#fff',
    opacity: 0.8,
  },
});

export default AudioMessage;