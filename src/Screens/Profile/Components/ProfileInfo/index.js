import React, { useEffect, useState, useContext } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import getAuthenticatedAxios from '../../../../Utils/api';
import { AuthContext } from '../../../../Context/auth-context';

const ProfileInfo = ({ onEditClick }) => {
  const [profile, setProfile] = useState(null);
  const [followersCount, setFollowersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, token } = useContext(AuthContext);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const api = getAuthenticatedAxios();
        const response = await api.get('https://open-moderately-silkworm.ngrok-free.app/api/profile/profile');
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
    <View style={styles.profileInfo}>
      <Image
        source={{ uri: profile.avatar_url || '/default-avatar.png' }}
        style={styles.profilePic}
      />
      <View style={styles.profileDetails}>
        <Text style={styles.profileName}>
          {profile.nombre} {profile.apellido}
        </Text>
        <Text style={styles.profileRole}>{profile.rol || 'Jugador'}</Text>
        <Text style={styles.profileLocation}>
          {profile.provincia_nombre || 'No especificada'}, {profile.nacion_nombre || 'No especificado'}
        </Text>
        <Text style={styles.profileFollowers}>
          <Text style={styles.followersCount}>{followersCount}</Text> seguidores
        </Text>
      </View>
      <TouchableOpacity style={styles.editButton} onPress={onEditClick}>
        <Text style={styles.editButtonText}>Editar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  profileInfo: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  profilePic: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  profileDetails: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  profileRole: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  profileLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  profileFollowers: {
    fontSize: 14,
    color: '#157446',
  },
  followersCount: {
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#157446',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 10,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
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
    backgroundColor: '#f5f5f5',
  },
});

export default ProfileInfo;