import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Button } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ShareMenu = ({ onClose, onDownload }) => {
  return (
    <View style={styles.shareMenu}>
      <Text style={styles.shareTitle}>Compartir video</Text>
      <View style={styles.shareOptions}>
        <View style={styles.shareSubtitleContainer}>
          <Ionicons name="mail-outline" size={24} style={styles.envelope} />
          <Text style={styles.shareSubtitle}>Enviar vía Mensaje Directo</Text>
        </View>
        <View style={styles.shareIcons}>
          {[
            {
              src: "https://cdn-icons-png.freepik.com/256/3983/3983877.png?semt=ais_hybrid",
              alt: "WhatsApp",
              label: "WhatsApp",
            },
            {
              src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/2048px-Telegram_logo.svg.png",
              alt: "Telegram",
              label: "Telegram",
            },
            {
              src: "https://cdn1.iconfinder.com/data/icons/logotypes/32/circle-linkedin-512.png",
              alt: "LinkedIn",
              label: "LinkedIn",
            },
            {
              src: "https://static-00.iconduck.com/assets.00/gmail-icon-1024x1024-09wrt8am.png",
              alt: "Gmail",
              label: "Gmail",
            },
          ].map((icon, index) => (
            <View style={styles.shareIconContainer} key={index}>
              <Image source={{ uri: icon.src }} style={styles.shareImg} />
              <Text>{icon.label}</Text>
            </View>
          ))}
        </View>
        <View style={styles.iconsShare}>
          <TouchableOpacity style={styles.containerShareIcon}>
            <Ionicons name="link-outline" size={24} />
            <Text>Copiar enlace</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.containerShareIcon}
            onPress={onDownload}
          >
            <Ionicons name="download-outline" size={24} />
            <Text>Guardar</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Button title="Cancelar" onPress={onClose} />
    </View>
  );
};

const styles = StyleSheet.create({
  shareMenu: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  shareTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  shareOptions: {
    marginBottom: 15,
  },
  shareSubtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  envelope: {
    marginRight: 5,
  },
  shareSubtitle: {
    fontSize: 16,
  },
  shareIcons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  shareIconContainer: {
    alignItems: 'center',
    width: '24%', // Ajusta el tamaño según sea necesario
    marginBottom: 10,
  },
  shareImg: {
    width: 40,
    height: 40,
    marginBottom: 5,
  },
  iconsShare: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  containerShareIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ShareMenu;
