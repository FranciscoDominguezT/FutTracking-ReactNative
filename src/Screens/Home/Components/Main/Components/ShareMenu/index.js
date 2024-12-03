import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as Clipboard from 'expo-clipboard';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Linking } from 'react-native';

const ShareMenu = ({ onClose, videoUrl }) => {
  const handleDownload = async () => {
    try {
      const fileUri = `${FileSystem.documentDirectory}video.mp4`;
      const downloadResumable = FileSystem.createDownloadResumable(
        videoUrl,
        fileUri
      );

      const { uri } = await downloadResumable.downloadAsync();
      if (Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert('Descarga completa', `Archivo guardado en ${uri}`);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo descargar el video.');
    }
  };

  const handleCopyLink = async () => {
    await Clipboard.setStringAsync(videoUrl);
    Alert.alert('Éxito', 'Enlace copiado al portapapeles');
  };

  return (
    <View style={styles.shareMenu}>
      <Text style={styles.shareTitle}>Compartir video</Text>
      <View style={styles.shareIcons}>
        {[
          {
            uri: 'https://cdn-icons-png.freepik.com/256/3983/3983877.png?semt=ais_hybrid',
            label: 'WhatsApp',
            onPress: () =>
              Linking.openURL(`whatsapp://send?text=¡Mira este video! ${videoUrl}`),
          },
          {
            uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/2048px-Telegram_logo.svg.png',
            label: 'Telegram',
            onPress: () => Linking.openURL(`tg://msg_url?url=${videoUrl}`),
          },
        ].map((icon, index) => (
          <TouchableOpacity
            key={index}
            style={styles.shareIconContainer}
            onPress={icon.onPress}
          >
            <Image source={{ uri: icon.uri }} style={styles.shareImg} />
            <Text>{icon.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.shareIcons}>
        <TouchableOpacity style={styles.shareIconContainer} onPress={handleCopyLink}>
          <FontAwesome name="link" size={24} color="#fff" />
          <Text>Copiar enlace</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareIconContainer} onPress={handleDownload}>
          <FontAwesome name="download" size={24} color="#fff" />
          <Text>Guardar</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
        <Text style={{ color: '#fff' }}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  shareMenu: {
    position: 'absolute',
    bottom: 50,
    left: '13%',
    transform: [{ translateX: -50 }],
    width: '100%',
    maxWidth: 450,
    minHeight: '20%',
    maxHeight: '80%',
    backgroundColor: '#0c0c0c',
    padding: 20,
    borderRadius: 10,
    flexDirection: 'column',
    alignItems: 'center',
    color: '#fff',
    zIndex: 1000,
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 10,
    overflowY: 'auto',
  },
  shareTitle: {
    color: '#fff',
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  shareSubtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  envelope: {
    color: 'gray',
    marginRight: 10,
  },
  shareSubtitle: {
    color: '#fff',
    margin: 0,
  },
  shareIcons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
    width: '100%',
    marginBottom: 15,
  },
  shareIconContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
  },
  shareIcon: {
    borderColor: '#fff',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 60,
    fontSize: 20,
  },
  shareImg: {
    width: 48,
    height: 48,
    marginBottom: 5,
    borderRadius: 50,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    color: '#fff',
    borderColor: '#fff',
    borderWidth: 2,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 10,
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease, color 0.3s ease',
  },
});

export default ShareMenu;
