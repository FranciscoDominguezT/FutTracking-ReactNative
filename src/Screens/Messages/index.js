import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Audio } from 'expo-av';
import { FontAwesome } from '@expo/vector-icons';

export default function App() {
  const [recording, setRecording] = useState(null);
  const [audioList, setAudioList] = useState([]); // Almacena las grabaciones
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(null);

  async function startRecording() {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);

    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    setRecording(null);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    const { durationMillis } = await recording.getStatusAsync();

    // Agrega la grabación a la lista
    setAudioList((prevAudioList) => [
      ...prevAudioList,
      { uri, duration: Math.floor(durationMillis / 1000) }
    ]);
  }

  async function handleRecordButtonPress() {
    if (recording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  }

  async function playSound(uri, index) {
    if (isPlaying === index) {
      await sound.pauseAsync();
      setIsPlaying(null);
    } else {
      if (sound) {
        await sound.unloadAsync();
      }
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true }
      );
      setSound(newSound);
      setIsPlaying(index);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(null);
        }
      });
    }
  }

  function deleteAudio(index) {
    setAudioList((prevAudioList) => prevAudioList.filter((_, i) => i !== index));
  }

  return (
    <View style={styles.container}>
      <View style={styles.recordContainer}>
        <TouchableOpacity
          onPress={handleRecordButtonPress}
          style={[
            styles.recordButton,
            { backgroundColor: recording ? '#E74C3C' : '#007AFF' } // Rojo si está grabando, azul si no
          ]}
        >
          <FontAwesome name="microphone" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={audioList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.audioContainer}>
            <TouchableOpacity onPress={() => playSound(item.uri, index)} style={styles.playButton}>
              <Text style={styles.playText}>{isPlaying === index ? '⏸️' : '▶️'}</Text>
            </TouchableOpacity>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar]} />
            </View>
            <Text style={styles.timeText}>{`${Math.floor(item.duration / 60)}:${(item.duration % 60).toString().padStart(2, '0')}`}</Text>
            <TouchableOpacity onPress={() => deleteAudio(index)} style={styles.deleteButton}>
              <FontAwesome name="trash" size={20} color="#E74C3C" />
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEFEF',
  },
  recordContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  listContainer: {
    paddingBottom: 20,
  },
  audioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 15,
    width: '90%',
    elevation: 3,
    marginVertical: 5,
    alignSelf: 'center',
  },
  playButton: {
    marginRight: 10,
  },
  playText: {
    fontSize: 18,
    color: '#007AFF',
  },
  progressBarContainer: {
    flex: 1,
    height: 4,
    backgroundColor: '#DDD',
    borderRadius: 2,
    marginHorizontal: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  timeText: {
    fontSize: 14,
    color: '#555',
    marginRight: 10,
  },
  userImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  deleteButton: {
    marginLeft: 10,
  },
});
