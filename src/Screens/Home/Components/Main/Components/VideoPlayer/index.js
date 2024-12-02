import React, { useRef, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Video } from 'expo-av';

const VideoPlayer = ({ videoData, isPlaying, onPlayPause, onTimeUpdate, onDurationChange }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      const playVideo = async () => {
        try {
          if (isPlaying) {
            await videoRef.current.playAsync();
          } else {
            await videoRef.current.pauseAsync();
          }
        } catch (e) {
          console.error("Error al reproducir:", e);
        }
      };
      playVideo();
    }
  }, [isPlaying]);

  const handlePlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      onTimeUpdate(status.positionMillis / 1000);
      onDurationChange(status.durationMillis / 1000);
    }
  };

  const handleScreenClick = () => {
    onPlayPause();
  };

  if (!videoData || !videoData.url) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <TouchableWithoutFeedback onPress={handleScreenClick}>
      <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{ uri: videoData?.url }}
        style={styles.playerImg}
        shouldPlay={isPlaying}
        isLooping={true}
        resizeMode="cover"
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        useNativeControls={false}
        volume={1.0} // Asegura que el volumen esté al máximo (1.0)
        isMuted={false} // Asegura que no esté muteado
      />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  playerImg: {
    width: '100%',
    height: '100%',
  },
});

export default VideoPlayer;