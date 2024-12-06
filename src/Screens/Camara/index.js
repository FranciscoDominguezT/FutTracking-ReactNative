import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { CameraView, Camera, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';

const Camara = () => {
    const navigation = useNavigation();
    const [facing, setFacing] = useState('back');
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [timerInterval, setTimerInterval] = useState(null);
    const [camera, setCamera] = useState(null);
  
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const [mediaLibraryPermission, requestMediaLibraryPermission] = MediaLibrary.usePermissions();

  // Solicitar permisos
  useEffect(() => {
    (async () => {
      if (!cameraPermission?.granted) await requestCameraPermission();
      if (!mediaLibraryPermission?.granted) await requestMediaLibraryPermission();
    })();
  }, []);

  // Manejar inicio de grabación
  const startRecording = async () => {
    if (camera) {
      try {
        const video = await camera.recordAsync();
        
        setIsRecording(true);

        // Iniciar temporizador
        const interval = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
        setTimerInterval(interval);

        return video;
      } catch (error) {
        console.error('Error al iniciar grabación:', error);
        Alert.alert('Error', 'No se pudo iniciar la grabación');
      }
    }
  };

  // Manejar detención de grabación
  const stopRecording = async () => {
    if (camera) {
      try {
        // Detener grabación
        camera.stopRecording();

        // Detener temporizador
        clearInterval(timerInterval);
        
        setIsRecording(false);
        setRecordingTime(0);
      } catch (error) {
        console.error('Error al detener grabación:', error);
        Alert.alert('Error', 'No se pudo detener la grabación');
      }
    }
  };

  // Manejar guardado de video
  const saveVideo = async (uri) => {
    try {
      // Guardar en la galería
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync('Grabaciones', asset, false);
      
      Alert.alert('Video guardado', 'El video se ha guardado en la galería');
    } catch (error) {
      console.error('Error al guardar video:', error);
      Alert.alert('Error', 'No se pudo guardar el video');
    }
  };

  // Cambiar entre cámaras
  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  // Verificar permisos
  if (!cameraPermission?.granted || !mediaLibraryPermission?.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Por favor, concede permisos de cámara y galería
        </Text>
        <TouchableOpacity 
          style={styles.permissionButton} 
          onPress={() => {
            requestCameraPermission();
            requestMediaLibraryPermission();
          }}
        >
          <Text style={styles.buttonText}>Conceder Permisos</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
        <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.navigate('Home')}
      >
        <ArrowLeft color="white" size={24} />
      </TouchableOpacity>
      <CameraView 
        ref={(ref) => setCamera(ref)}
        style={styles.camera} 
        facing={facing}
        mode="video"
        onRecordingStart={() => {
          // Opcional: Callback cuando comienza la grabación
          console.log('Grabación iniciada');
        }}
        onRecordingEnd={async (video) => {
          // Guardar video cuando termina
          await saveVideo(video.uri);
        }}
      >
        {/* Temporizador */}
        {isRecording && (
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>
              {`${Math.floor(recordingTime / 60)
                  .toString()
                  .padStart(2, '0')}:${(recordingTime % 60)
                  .toString()
                  .padStart(2, '0')}`}
            </Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          {/* Botón de cambiar cámara */}
          <TouchableOpacity 
            style={styles.toggleCameraButton} 
            onPress={toggleCameraFacing}
          >
            <Text style={styles.toggleCameraText}>📷</Text>
          </TouchableOpacity>

          {/* Botón de grabación */}
          {!isRecording ? (
            <TouchableOpacity 
              style={styles.recordButton} 
              onPress={startRecording}
            >
              <View style={styles.recordButtonInner} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.stopButton} 
              onPress={stopRecording}
            >
              <View style={styles.stopButtonInner} />
            </TouchableOpacity>
          )}
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 25,
    padding: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  toggleCameraButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  button: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
    borderRadius: 10,
  },
  recordButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 50,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'red',
  },
  stopButtonInner: {
    width: 30,
    height: 30,
    backgroundColor: 'white',
  },
  stopButton: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  timerContainer: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 10,
  },
  timerText: {
    color: 'white',
    fontSize: 18,
  },
  message: {
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 10,
    alignSelf: 'center',
  },
});

export default Camara;