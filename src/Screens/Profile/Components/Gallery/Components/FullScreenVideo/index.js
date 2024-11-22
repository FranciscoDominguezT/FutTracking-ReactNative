import React, { useRef, useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, StatusBar } from 'react-native';
import { Video } from 'expo-av';
import { FontAwesome } from '@expo/vector-icons';
import VideoControls from '../VideoControls';

const FullScreenVideo = ({
  video,
  isPlaying,
  setIsPlaying,
  currentTime,
  setCurrentTime,
  duration,
  setDuration,
  onClose,
  children
}) => {
  const videoRef = useRef(null);
  const [status, setStatus] = useState({});

  useEffect(() => {
    StatusBar.setHidden(true);
    return () => {
      StatusBar.setHidden(false);
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.playAsync();
      } else {
        videoRef.current.pauseAsync();
      }
    }
  }, [isPlaying]);

  const handlePlayPause = async () => {
    if (!videoRef.current) return;
    
    if (status.isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }
    setIsPlaying(!status.isPlaying);
  };

  const handleVideoStatusUpdate = (status) => {
    setStatus(status);
    if (status.isLoaded) {
      setCurrentTime(status.positionMillis / 1000);
      setDuration(status.durationMillis / 1000);
    }
  };

  const handleLoad = async () => {
    if (videoRef.current) {
      const status = await videoRef.current.getStatusAsync();
      if (status.isLoaded) {
        setDuration(status.durationMillis / 1000);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        style={styles.videoPlayer}
        source={{ uri: video?.url }}
        resizeMode="contain"
        isLooping={false}
        onPlaybackStatusUpdate={handleVideoStatusUpdate}
        onLoad={handleLoad}
        useNativeControls={false}
      />

      <TouchableOpacity 
        style={styles.videoWrapper} 
        activeOpacity={1} 
        onPress={handlePlayPause}
      />

      <TouchableOpacity 
        style={styles.closeButton} 
        onPress={onClose}
      >
        <FontAwesome name="arrow-left" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <View style={styles.controlsContainer}>
        <VideoControls
          isPlaying={status.isPlaying}
          currentTime={currentTime}
          duration={duration}
          onPlayPause={handlePlayPause}
          videoRef={videoRef}
        />
        {children}
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  videoWrapper: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  videoPlayer: {
    width: width,
    height: height,
    backgroundColor: '#000000',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 10,
    zIndex: 2,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 2,
  }
});

export default FullScreenVideo;