import React, { useEffect, useState, useContext } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import getAuthenticatedAxios from '../../../../Utils/api';
import { AuthContext } from '../../../../Context/auth-context';

const { width } = Dimensions.get('window');

const ProfileInfo = ({ onEditClick }) => {
  const [profile, setProfile] = useState(null);
  const [followersCount, setFollowersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, token } = useContext(AuthContext);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const api = await getAuthenticatedAxios();
        const response = await api.get('/profile/profile');
        const data = response.data;
  
        setProfile(data.profile);
        setFollowersCount(data.followersCount);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Error al obtener el perfil. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchProfile();
  }, [token]);

  if (loading) {
    return <View style={styles.loadingContainer}><Text>Cargando...</Text></View>;
  }

  if (error) {
    return <View style={styles.errorContainer}><Text>{error}</Text></View>;
  }

  if (!profile) {
    return <View style={styles.errorContainer}><Text>No se encontró información del perfil</Text></View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileInfo}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: profile.avatar_url || '/default-avatar.png' }}
            style={styles.profilePic}
          />
        </View>
        <View style={styles.profileDetails}>
          <Text style={styles.profileName}>
            {profile.nombre}{profile.apellido}
          </Text>
          <Text style={styles.profileRole}>{profile.rol || 'Jugador'}</Text>
          <Text style={styles.profileLocation}>
            {profile.provincia_nombre || 'No especificada'}, {profile.nacion_nombre || 'No especificado'}
          </Text>
          <Text style={styles.profileFollowers}>
            {followersCount} <Text style={styles.followersText}>seguidores</Text>
          </Text>
        </View>
        <TouchableOpacity style={styles.editButton} onPress={onEditClick}>
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    paddingHorizontal: 16,
    marginTop: 40,
  },
  profileInfo: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 30,
    borderRadius: 24,
    position: 'relative',
    elevation: 4,
  },
  profileImageContainer: {
    position: 'absolute',
    top: -90,
    left: '5%',
    zIndex: 1,
  },
  profilePic: {
    width: 90,
    height: 90,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
    borderStyle: 'solid',
  },
  profileDetails: {
    alignItems: 'flex-start',
    marginTop: -20,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
    color: '#000',
  },
  profileRole: {
    fontSize: 18,
    color: '#000',
    marginBottom: 4,
    fontWeight: '400',
  },
  profileLocation: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
    fontWeight: '400',
  },
  profileFollowers: {
    fontSize: 16,
    color: '#157446',
    fontWeight: '600',
  },
  followersText: {
    fontWeight: '400',
  },
  editButton: {
    position: 'absolute',
    top: -15,
    right: 0,
    borderWidth: 2,
    borderColor: '#157446',
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 30,
    borderRadius: 24,
  },
  editButtonText: {
    color: '#157446',
    fontSize: 16,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileInfo;