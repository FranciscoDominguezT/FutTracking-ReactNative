import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const UserInfo = ({ userData, isFollowing, onFollowToggle, currentUserId }) => {
  const isOwnProfile = userData && currentUserId === userData.usuario_id;

  return (
    <View style={styles.userInfo}>
      {userData ? (
        <>
          <Image
            source={{ uri: userData.avatar_url || "default-avatar.png" }}
            style={styles.userProfileImg}
          />
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{`${userData.nombre} ${userData.apellido}`}</Text>
            <Text style={styles.userLocation}>{`${userData.provincia_nombre || ''}, ${userData.nacion_nombre || ''}`}</Text>
          </View>
          {!isOwnProfile && (
            <TouchableOpacity 
              style={[styles.followButton, isFollowing ? styles.following : null]} 
              onPress={onFollowToggle}
            >
              <Text style={styles.followButtonText}>
                {isFollowing ? "Siguiendo" : "Seguir"}
              </Text>
            </TouchableOpacity>
          )}
        </>
      ) : (
        <Text>Cargando información del usuario...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  userProfileImg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#fff',
  },
  userDetails: {
    flexGrow: 1,
  },
  userName: {
    color: '#fff',
    fontWeight: 'bold',
  },
  userLocation: {
    color: '#ddd',
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

export default UserInfo;
