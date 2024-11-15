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
        <Text style={styles.username}>
          {videoOwner.nombre} {videoOwner.apellido}
        </Text>
        <Text style={styles.userLocation}>
          {videoOwner.provincia_nombre}, {videoOwner.nacion_nombre}
        </Text>
        <TouchableOpacity style={styles.followButton} onPress={onFollowToggle}>
          <Text style={styles.followButtonText}>
            {isFollowing ? 'Dejar de seguir' : 'Seguir'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  infoUser: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  imgUserProfile: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  detailsUser: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userLocation: {
    fontSize: 14,
    color: '#555',
  },
  followButton: {
    marginTop: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#007BFF',
  },
  followButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default VideoInfo;
