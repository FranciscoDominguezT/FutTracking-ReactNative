import React, { useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Video } from 'expo-av';
import { AntDesign } from '@expo/vector-icons';
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
  const videoRef = useRef();

  useEffect(() => {
    if (videoRef.current) {
      const playVideo = async () => {
        try {
          if (isPlaying) {
            await videoRef.current.playAsync();
          }
        } catch (e) {
          console.error("Error al reproducir:", e);
          setIsPlaying(false);
        }
      };
      playVideo();
    }
  }, [video, setIsPlaying]);

  const handlePlayPause = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = (status) => {
    if (status.isPlaying) {
      setCurrentTime(status.positionMillis / 1000);
      setDuration(status.durationMillis / 1000);
    }
  };

  const handleScreenClick = () => {
    handlePlayPause();
  };

  return (
    <View style={styles.fullscreenVideo}>
      <Video
        source={{ uri: video.url }}
        style={styles.fullscreenVideoPlayer}
        ref={videoRef}
        shouldPlay={isPlaying}
        isLooping={true}
        resizeMode="stretch" // Cambiado a "stretch" para permitir la deformación
        onPlaybackStatusUpdate={handleTimeUpdate}
        useNativeControls={false}
      />
      
      <TouchableOpacity 
        style={styles.closeButton} 
        onPress={onClose}
      >
        <AntDesign name="arrowleft" size={35} color="white" />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.videoTouchable}
        onPress={handleScreenClick}
      >
        <View style={styles.infoPlayer}>
          <VideoControls
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            onPlayPause={handlePlayPause}
            videoRef={videoRef}
          />
          {children}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  fullscreenVideo: {
    position: 'absolute',
    top: -290, // Valor fijo en lugar de porcentaje
    left: 40, // Valor fijo en lugar de porcentaje
    width: 350, // Ancho fijo
    height: 750, // Alto fijo
    backgroundColor: 'black',
    zIndex: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullscreenVideoPlayer: {
    width: 350, // Mismo ancho fijo
    height: 750, // Mismo alto fijo
  },
  closeButton: {
    position: 'absolute',
    top: 20, // Ajustado para el nuevo tamaño
    left: 20,
    zIndex: 2,
  },
  videoTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  infoPlayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  }
});

export default FullScreenVideo;