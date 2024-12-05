import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import Header from '../Header';
import Footer from '../Footer';
import { AuthContext } from '../../../../Context/auth-context';
import * as FileSystem from 'expo-file-system';

const { width } = Dimensions.get('window');

const MessageScreen = ({route}) => {
  const { selectedUser } = route.params || {};
  const { user, token } = useContext(AuthContext);
  console.log(selectedUser);

  const [recording, setRecording] = useState(null);
  const [audioList, setAudioList] = useState([]);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!user?.id || !selectedUser?.id) {
        setMessages([]); // Establece un array vacío si no hay usuario o receptor
        return;
      }

      try {
        const response = await axios.get(
          `https://open-moderately-silkworm.ngrok-free.app/api/messages/${user.id}/${selectedUser.id}`,
          { 
            headers: { Authorization: `Bearer ${token}` } 
          }
        );

        setMessages(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [user?.id, selectedUser?.id, token]);

  const sendMediaMessage = async (uri, mediaType) => {
    try {
      const formData = new FormData();
      formData.append('usuarioId', user.id);
      formData.append('receptorId', selectedUser.id);
      
      formData.append('media', {
        uri: uri,
        type: mediaType,
        name: `media_${Date.now()}.${mediaType.split('/')[1]}`
      });
  
      const response = await axios.post(
        'https://open-moderately-silkworm.ngrok-free.app/api/messages/send-media', 
        formData,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          } 
        }
      );
  
      setMessages(prevMessages => [...prevMessages, response.data]);
      setSelectedImage(null);
    } catch (error) {
      console.error('Error sending media message:', error.response ? error.response.data : error.message);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      alert('Lo siento, necesitamos permisos para acceder a la galería de fotos');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All, // Ahora permite imágenes y videos
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedAsset = result.assets[0];
      setSelectedImage(selectedAsset.uri);
    }
  };
  const sendMessage = async () => {
    if (!messageText.trim() || !selectedUser?.id) return;

    try {
      const response = await axios.post(
        'https://open-moderately-silkworm.ngrok-free.app/api/messages/send', 
        {
          usuarioId: user.id,
          receptorId: selectedUser.id,
          contenido: messageText,
          tipoMensaje: 'texto'
        },
        { 
          headers: { Authorization: `Bearer ${token}` } 
        }
      );

      // Add the new message to the messages list
      setMessages(prevMessages => [...prevMessages, response.data]);
      
      // Clear the input
      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  const sendImage = () => {
    if (selectedImage) {
      const mediaType = selectedImage.toLowerCase().endsWith('mp4') ? 'video/mp4' : 'image/jpeg';
      sendMediaMessage(selectedImage, mediaType);
    }
  };

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

  

  const sendAudioMessage = async (audioUri) => {
    console.log('Enviando mensaje de audio:', audioUri);
    try {
      const fileBuffer = await FileSystem.readAsStringAsync(audioUri, {
        encoding: FileSystem.EncodingType.Base64
      });

      const formData = new FormData();
      formData.append('usuarioId', user.id);
      formData.append('receptorId', selectedUser.id);
      
      formData.append('audio', {
        uri: audioUri,
        type: 'audio/x-m4a',  // Ajusta exactamente al tipo configurado
        name: `audio_${Date.now()}.m4a`
      });
  
      const response = await axios.post(
        'https://open-moderately-silkworm.ngrok-free.app/api/messages/send-audio', 
        formData,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          } 
        }
      );
  
      // Actualiza la lista de mensajes con el nuevo mensaje de audio
      setMessages(prevMessages => [...prevMessages, response.data]);
      
      // Limpia la lista de audios locales
      setAudioList([]);
    } catch (error) {
      console.error('Error sending audio message:', error.response ? error.response.data : error.message);
    }
  };

  async function stopRecording() {
    setRecording(null);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    const { durationMillis } = await recording.getStatusAsync();

    setAudioList((prevAudioList) => [
      ...prevAudioList,
      { uri, duration: Math.floor(durationMillis / 1000) },
    ]);

    await sendAudioMessage(uri);
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
    setAudioList((prevAudioList) =>
      prevAudioList.filter((_, i) => i !== index)
    );
  }

  const renderMessage = ({ item }) => {
    if (!item) return null;

    const isOwnMessage = item.usuarioid === user?.id;
    
    return (
      <View 
      style={[
        styles.messageContainer, 
        isOwnMessage ? styles.ownMessageContainer : styles.otherMessageContainer
      ]}
    >
      {!isOwnMessage && (
        <Image
          source={{ uri: selectedUser?.avatar_url || '/default-avatar.png' }}
          style={styles.avatar}
        />
      )}
      <View 
        style={[
          styles.messageContent, 
          isOwnMessage ? styles.ownMessageContent : styles.otherMessageContent
        ]}
      >
        <Text 
          style={[
            styles.messageText, 
            isOwnMessage ? styles.ownMessageText : styles.otherMessageText
          ]}
        >
          {item.contenido}
        </Text>
        <Text style={styles.messageTime}>
          {item.fechaenvio ? new Date(item.fechaenvio).toLocaleString() : ''}
        </Text>
      </View>
    </View>
    );
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? -80 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.innerContainer}>
            <Header />

            <View style={styles.userHeaderContainer}>
            <Image
              source={{ uri: selectedUser?.avatar_url || '/default-avatar.png' }}
              style={styles.userHeaderAvatar}
            />
            <Text style={styles.userHeaderName}>
              {selectedUser ? `${selectedUser.nombre} ${selectedUser.apellido}` : 'Nuevo Mensaje'}
            </Text>
          </View>

          <FlatList
            data={messages} 
            renderItem={({ item }) => item && renderMessage({ item })}
            keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
            ListEmptyComponent={
              <Text style={styles.noMessagesText}>
                No hay mensajes aún
              </Text>
            }
            contentContainerStyle={styles.messagesListContainer}
          />

            {selectedImage && (
              <View style={styles.imagePreviewContainer}>
                <Image
                  source={{ uri: selectedImage }}
                  style={styles.imagePreview}
                />
                <View style={styles.imagePreviewActions}>
                  <TouchableOpacity onPress={removeImage} style={styles.removeImageButton}>
                    <Ionicons name="close" size={20} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={sendImage} style={styles.sendImageButton}>
                    <Ionicons name="send" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <FlatList
              data={audioList}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <View style={styles.audioContainer}>
                  <TouchableOpacity
                    onPress={() => playSound(item.uri, index)}
                    style={[
                      styles.playButton,
                      isPlaying === index && styles.playButtonActive,
                    ]}
                  >
                    <Ionicons
                      name={isPlaying === index ? 'pause-circle' : 'play-circle'}
                      size={32}
                      color="#007AFF"
                    />
                  </TouchableOpacity>
                  <View style={styles.audioInfo}>
                    <Text style={styles.audioDuration}>
                      {`${Math.floor(item.duration / 60)}:${(item.duration % 60)
                        .toString()
                        .padStart(2, '0')}`}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => deleteAudio(index)}
                    style={styles.deleteButton}
                  >
                    <Ionicons name="trash" size={24} color="#E74C3C" />
                  </TouchableOpacity>
                </View>
              )}
              contentContainerStyle={styles.listContainer}
            />
            <View style={styles.inputContainer}>
              <TouchableOpacity
                onPress={pickImage}
                style={styles.addImageButton}
              >
                <Ionicons name="add" size={24} color="#FFF" />
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                placeholder="Escribe un mensaje..."
                value={messageText}  // Cambiado de messages a messageText
                onChangeText={setMessageText}  // Cambiado de setMessages a setMessageText
                multiline
              />
              <TouchableOpacity
                onPress={handleRecordButtonPress}
                style={[styles.recordButton, recording ? styles.recording : null]}
              >
                <FontAwesome name="microphone" size={24} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={sendMessage}  // Llama directamente a sendMessage
                style={[styles.recordButton]}
              >
                <FontAwesome name="paper-plane" size={18} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    maxWidth: 460,
    marginHorizontal: 'auto',
    backgroundColor: '#fff',
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
  },
  userHeaderContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    top: 45
  },
  userHeaderAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12
  },
  userHeaderName: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '600'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'space-between',
    bottom: 80,
  },
  addImageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreviewContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 10,
  },
  imagePreview: {
    width: 150,
    height: 150,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  imagePreviewActions: {
    position: 'absolute',
    bottom: -20,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  removeImageButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  sendImageButton: {
    backgroundColor: '#007AFF',
    borderRadius: 15,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 20,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  recordButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  recording: {
    backgroundColor: '#E74C3C',
  },
  audioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginVertical: 8,
    marginHorizontal: 20,
    top: 45
  },
  audioInfo: {
    flex: 1,
    marginLeft: 10,
  },
  audioDuration: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  playButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  playButtonActive: {
    backgroundColor: '#D1E8FF',
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FDEDEC',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginVertical: 8,
    marginHorizontal: 20,
    top: 45,
    width: '60%',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  noMessagesText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 80,
  },
  ownMessageContainer: {
    marginBottom: 28,
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
    width: '50%',
  },
});

export default MessageScreen;
