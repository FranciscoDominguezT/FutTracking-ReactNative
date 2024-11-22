import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const VideoControls = ({ isPlaying, currentTime, duration, onPlayPause, videoRef }) => {
  const formatTime = (time) => {
    if (!time) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleSeek = async (evt) => {
    if (!videoRef?.current || !duration) return;
    
    const { locationX, layoutMeasurements } = evt.nativeEvent;
    const progress = locationX / layoutMeasurements.width;
    const seekTime = progress * duration * 1000; // Convertir a milisegundos para Expo AV
    
    try {
      await videoRef.current.setPositionAsync(seekTime);
    } catch (error) {
      console.error('Error seeking:', error);
    }
  };

  return (
    <View style={styles.wrapperControls}>
      <TouchableOpacity 
        style={styles.buttonPause} 
        onPress={onPlayPause}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <FontAwesome 
          name={isPlaying ? "pause" : "play"} 
          size={24} 
          color="white" 
        />
      </TouchableOpacity>

      <View style={styles.barTime}>
        <Text style={styles.time}>{formatTime(currentTime)}</Text>
        
        <Pressable 
          style={styles.barProgress}
          onPress={handleSeek}
        >
          <View style={styles.progressBackground}>
            <View
              style={[
                styles.progress,
                {
                  width: `${((currentTime || 0) / (duration || 1)) * 100}%`,
                },
              ]}
            />
          </View>
        </Pressable>

        <Text style={styles.time}>
          {formatTime(duration)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapperControls: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  buttonPause: {
    marginRight: 10,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  barTime: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  time: {
    width: 45,
    textAlign: 'center',
    color: 'white',
    fontSize: 12,
  },
  barProgress: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  progressBackground: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#007BFF',
  },
});

export default VideoControls;