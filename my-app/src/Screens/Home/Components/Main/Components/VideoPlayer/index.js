import React, { useRef, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Video } from 'expo-av';

const VideoPlayer = ({ videoData, isPlaying, onPlayPause, onTimeUpdate, onDurationChange }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoData && videoRef.current) {
      const playVideo = async () => {
        try {
          if (isPlaying) {
            await videoRef.current.seek(0);
          }
        } catch (e) {
          console.error("Error al reproducir:", e);
        }
      };
      playVideo();
    }
  }, [videoData, isPlaying]);

  const handleError = (error) => {
    console.error("Error en la reproducción del video:", error);
  };

  const handleTimeUpdate = (data) => {
    if (data && typeof data.currentTime === 'number') {
      onTimeUpdate(data.currentTime);
    }
  };

  const handleLoadedMetadata = (data) => {
    if (data && typeof data.duration === 'number') {
      onDurationChange(data.duration);
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
          onProgress={handleTimeUpdate}
          onLoad={handleLoadedMetadata}
          onError={handleError}
          paused={!isPlaying}
          useNativeControls
          resizeMode="cover"
          repeat
          playInBackground={false}
          playWhenInactive={false}
          ignoreSilentSwitch="ignore"
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