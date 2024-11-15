import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Importa FontAwesome desde @expo/vector-icons

const VideoControls = ({ isPlaying, currentTime, duration, onPlayPause, videoRef }) => {
  const progressBarRef = useRef();
  const [isDragging, setIsDragging] = useState(false);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleProgressClick = (e) => {
    const newTime =
      (e.nativeEvent.locationX / progressBarRef.current.offsetWidth) * duration;
    videoRef.current.currentTime = newTime;
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    handleProgressClick(e);
  };

  const handleTouchMove = (e) => {
    if (isDragging) {
      handleProgressClick(e);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <View style={styles.wrapperControls}>
      <TouchableOpacity style={styles.buttonPause} onPress={onPlayPause}>
        {isPlaying ? (
          <FontAwesome name="pause" size={24} color="black" /> // Ícono de pausa
        ) : (
          <FontAwesome name="play" size={24} color="black" /> // Ícono de play
        )}
      </TouchableOpacity>
      <View
        style={styles.barTime}
        ref={progressBarRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Text style={styles.time}>{formatTime(currentTime)}</Text>
        <View style={styles.barProgress}>
          <View
            style={{
              ...styles.progress,
              width: `${(currentTime / duration) * 100}%`,
            }}
          />
        </View>
        <Text style={styles.time}>{formatTime(duration - currentTime)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapperControls: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  buttonPause: {
    marginRight: 10,
    padding: 10,
  },
  barTime: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  time: {
    width: 40,
    textAlign: 'center',
  },
  barProgress: {
    flex: 1,
    height: 5,
    backgroundColor: '#ddd',
    borderRadius: 2,
    overflow: 'hidden',
    marginHorizontal: 5,
  },
  progress: {
    height: '100%',
    backgroundColor: '#007BFF',
  },
});

export default VideoControls;
