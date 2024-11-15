import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { FontAwesome } from 'react-native-vector-icons/FontAwesome'; // Cambiado aquí
import * as Clipboard from 'expo-clipboard';
import { Linking } from 'react-native';

const ShareMenu = ({ onClose, videoUrl }) => {
  const handleDownload = () => {
    Alert.alert('Descarga', 'La función de descarga no está disponible en dispositivos móviles.');
  };

  const handleCopyLink = async () => {
    await Clipboard.setStringAsync(videoUrl);
    Alert.alert('Éxito', 'Enlace copiado al portapapeles');
  };

  return (
    <View style={styles.shareMenu} onTouchStart={(e) => e.stopPropagation()}>
      <Text style={styles.shareTitle}>Compartir video</Text>
      <View style={styles.shareSubtitleContainer}>
        <FontAwesome name="envelope" style={styles.envelope} />
        <Text style={styles.shareSubtitle}>Enviar vía Mensaje Directo</Text>
      </View>
      <View style={styles.shareIcons}>
        {[  // Aquí se mantienen los iconos de compartir
          {
            uri: 'https://cdn-icons-png.freepik.com/256/3983/3983877.png?semt=ais_hybrid',
            label: 'WhatsApp',
            onPress: () => Linking.openURL(`whatsapp://send?text=${videoUrl}`)
          },
          {
            uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/2048px-Telegram_logo.svg.png',
            label: 'Telegram',
            onPress: () => Linking.openURL(`tg://msg_url?url=${videoUrl}`)
          },
          {
            uri: 'https://cdn1.iconfinder.com/data/icons/logotypes/32/circle-linkedin-512.png',
            label: 'LinkedIn',
            onPress: () => Linking.openURL(`https://www.linkedin.com/sharing/share-offsite/?url=${videoUrl}`)
          },
          {
            uri: 'https://static-00.iconduck.com/assets.00/gmail-icon-1024x1024-09wrt8am.png',
            label: 'Gmail',
            onPress: () => Linking.openURL(`mailto:?body=${videoUrl}`)
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
          <View style={styles.shareIcon}>
            <FontAwesome name="link" /> {/* Cambiado aquí */}
          </View>
          <Text>Copiar enlace</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareIconContainer} onPress={handleDownload}>
          <View style={styles.shareIcon}>
            <FontAwesome name="download" /> {/* Cambiado aquí */}
          </View>
          <Text>Guardar</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
        <Text>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  shareMenu: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
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
