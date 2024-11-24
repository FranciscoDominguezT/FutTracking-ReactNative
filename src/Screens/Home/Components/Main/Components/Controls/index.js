import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Controls = ({ isPlaying, currentTime, duration, onPlayPause, videoRef }) => {
  const progressBarRef = useRef();
  const isDragging = useRef(false);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleProgressPress = async (e) => {
    if (videoRef.current && progressBarRef.current) {
      const { width } = await progressBarRef.current.measure();
      const position = e.nativeEvent.locationX;
      const percentage = position / width;
      const newTime = percentage * duration * 1000; // Convertir a milisegundos
      
      try {
        await videoRef.current.setPositionAsync(newTime);
      } catch (error) {
        console.error('Error al establecer la posición del video:', error);
      }
    }
  };

  const handleTouchStart = () => {
    isDragging.current = true;
  };

  const handleTouchMove = async (e) => {
    if (isDragging.current) {
      await handleProgressPress(e);
    }
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  return (
    <View style={styles.controlsWrapper}>
      <TouchableOpacity 
        style={styles.pauseButton} 
        onPress={onPlayPause}
      >
        <Icon 
          name={isPlaying ? 'pause' : 'play'} 
          size={20} 
          color="#fff" 
        />
      </TouchableOpacity>
      
      <View style={styles.timeBar}>
        <Text style={styles.time}>{formatTime(currentTime)}</Text>
        <TouchableWithoutFeedback
          onPressIn={handleTouchStart}
          onPressMove={handleTouchMove}
          onPressOut={handleTouchEnd}
        >
          <View 
            ref={progressBarRef}
            style={styles.progressBar}
          >
            <View
              style={[
                styles.progress,
                { width: `${(currentTime / (duration || 1)) * 100}%` }
              ]}
            />
          </View>
        </TouchableWithoutFeedback>
        <Text style={styles.time}>
          {formatTime(Math.max(0, duration - currentTime))}
        </Text>
      </View>
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
    fontSize: 12,
  },
});

export default Controls;