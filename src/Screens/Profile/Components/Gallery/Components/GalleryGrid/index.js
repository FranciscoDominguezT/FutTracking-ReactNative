import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Video } from 'expo-av'; // Asegúrate de tener instalada la biblioteca expo-av para reproducir videos

const GalleryGrid = ({ videos, onVideoClick }) => {
  if (videos.length === 0) {
    return <Text style={styles.noVideosMessage}>No hay videos cargados aún.</Text>;
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.galleryItem} onPress={() => onVideoClick(item)}>
      <Video
        source={{ uri: item.url }} // Asegúrate de que el video tenga un formato URI válido
        style={styles.galleryImg}
        resizeMode="cover" // Ajusta la forma en que se muestra el video
        shouldPlay={false} // No reproducir automáticamente
        isLooping={false} // No reproducir en bucle
        isMuted={true} // Silenciar el video para que no interfiera con la experiencia
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.videoGrid}>
      <FlatList
        data={videos}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()} // Asegúrate de que cada video tenga un id único
        numColumns={3} // Cambia este número para modificar la cantidad de columnas
      />
    </View>
  );
};
const styles = StyleSheet.create({
  gallery: {
    flex: 1,
    backgroundColor: 'white',
  },
  videoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  galleryItem: {
    width: '33.33%',
    aspectRatio: 3 / 4,
    overflow: 'hidden',
  },
  galleryImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  fullscreenVideo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  buttonPause: {
    backgroundColor: '#464747',
    borderRadius: 20,
    padding: 10,
  },
  buttonCommentSend: {
    backgroundColor: '#464747',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    color: '#fff',
  },
  menuComment: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '50%',
    backgroundColor: '#0c0c0c',
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  titleComment: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  sectionComment: {
    flex: 1,
    width: '100%',
  },
  commentWrapperInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  inputComment: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#fff',
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
  },
  iconLikeComment: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});


export default GalleryGrid;
