import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const VideoInfo = ({ videoOwner, isFollowing, onFollowToggle }) => {
  if (!videoOwner) return null;

  return (
    <View style={styles.infoUser}>
      <Image
        source={{
          uri: videoOwner.avatar_url || "https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/no-profile-picture-icon.png",
        }}
        style={styles.imgUserProfile}
      />
      <View style={styles.detailsUser}>
        <Text style={styles.username}>{`${videoOwner.nombre}${videoOwner.apellido}`}</Text>
        <Text style={styles.userLocation}>{`${videoOwner.provincia_nombre || ''}, ${videoOwner.nacion_nombre || ''}`}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  infoUser: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10
  },
  imgUserProfile: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#fff',

  },
  detailsUser: {
    flexGrow: 1,
    
  },
  username: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    
  },
  userLocation: {
    color: '#ddd',
    fontSize: 16,
  },
  followButton: {
    backgroundColor: 'transparent',
    color: '#fff',
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 10,
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease, color 0.3s ease',
    
  },
  followButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default VideoInfo;
