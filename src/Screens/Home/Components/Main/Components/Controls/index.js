import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Controls = ({ isPlaying, currentTime, duration, onPlayPause }) => {
  const progressBarRef = useRef();

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleProgressClick = (e) => {
    const newTime = (e.nativeEvent.locationX / progressBarRef.current.width) * duration;
    onPlayPause(newTime);
  };

  return (
    <View style={styles.controlsWrapper}>
      <TouchableOpacity style={styles.pauseButton} onPress={() => onPlayPause()}>
        <Icon name={isPlaying ? 'pause' : 'play'} size={20} color="#fff" />
      </TouchableOpacity>
      
      <TouchableWithoutFeedback onPress={handleProgressClick}>
        <View style={styles.timeBar} ref={progressBarRef}>
          <Text style={styles.time}>{formatTime(currentTime)}</Text>
          <View style={styles.progressBar}>
            <View
              style={[styles.progress, { width: `${(currentTime / duration) * 100}%` }]}
            />
          </View>
          <Text style={styles.time}>{formatTime(duration - currentTime)}</Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  controlsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    position: 'absolute',
    bottom: 154,
    width: '112%',
    zIndex: 10,
  },
  pauseButton: {
    backgroundColor: '#464747',
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  timeBar: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    marginHorizontal: 10,
  },
  progressBar: {
    flexGrow: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 50,
    overflow: 'hidden',
    position: 'relative',
    marginHorizontal: 10,
  },
  progress: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 50,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  time: {
    color: '#fff',
  },
});

export default Controls;
