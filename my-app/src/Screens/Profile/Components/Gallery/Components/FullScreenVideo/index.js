import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Video from 'react-native-video';
import VideoControls from '../VideoControls'; // Asegúrate de que VideoControls esté adaptado para React Native
import Icon from 'react-native-vector-icons/FontAwesome';

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

  useEffect(() => {
    if (videoRef.current) {
      const playVideo = async () => {
        try {
          videoRef.current.seek(0);
          setIsPlaying(true);
        } catch (e) {
          console.error("Error al reproducir:", e);
          setIsPlaying(false);
        }
      };
      playVideo();
    }
  }, [video, setIsPlaying]);

  const handlePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = (data) => {
    setCurrentTime(data.currentTime);
    setDuration(data.seekableDuration);
  };

  const handleScreenClick = () => {
    handlePlayPause();
  };

  return (
    <View style={styles.fullscreenVideo}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Icon name="arrow-left" size={24} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity onPress={handleScreenClick} style={styles.videoContainer}>
        <Video
          source={{ uri: video.url }}
          style={styles.fullscreenVideoPlayer}
          ref={videoRef}
          paused={!isPlaying}
          repeat
          resizeMode="cover"
          onProgress={handleTimeUpdate}
          onLoad={() => {
            videoRef.current.seek(0);
          }}
        />
      </TouchableOpacity>

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
    </View>
  );
};

const styles = StyleSheet.create({
  fullscreenVideo: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenVideoPlayer: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  infoPlayer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
});

export default FullScreenVideo;
