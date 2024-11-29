import React, { useEffect, useState, useContext } from "react";
import axios from 'axios';
import { AuthContext } from '../../../../Context/auth-context';
import FollowersList from "../FollowersList";
import { StyleSheet, Dimensions, View, ActivityIndicator, Image, TouchableOpacity, Text } from "react-native";

const { width } = Dimensions.get('window');

const ProfileInfo = ({ usuario_id }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [showFollowers, setShowFollowers] = useState(false);
  const { user, token } = useContext(AuthContext);

  useEffect(() => {
    const fetchProfileAndFollowStatus = async () => {
      if (!usuario_id) {
        setError("ID de usuario no proporcionado");
        setLoading(false);
        return;
      }

      try {
        const [profileResponse, followResponse] = await Promise.all([
          axios.get(`https://open-moderately-silkworm.ngrok-free.app/api/profile/player/${usuario_id}`), // Obtener el perfil del usuario
          axios.get(`https://open-moderately-silkworm.ngrok-free.app/api/profile/player/${usuario_id}/followers`), // Obtener la cantidad de seguidores
          user && user.id ? axios.get(`https://open-moderately-silkworm.ngrok-free.app/api/videos/${user.id}/${usuario_id}/follow`) : Promise.resolve({ data: { isFollowing: false } }) // Estado de seguimiento
        ]);

        setProfile(profileResponse.data.profile);
        setFollowersCount(followResponse.data.followersCount); // Actualizar la cantidad de seguidores
        setIsFollowing(followResponse.data.isFollowing);
      } catch (error) {
        console.error("Error fetching profile or follow status:", error);
        setError("Error al obtener la información. Por favor, intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileAndFollowStatus();
  }, [usuario_id, user]);

  const handleFollowToggle = async () => {
    if (!user || !user.id) return;

    try {
      const response = await axios.post(
        `https://open-moderately-silkworm.ngrok-free.app/api/videos/${user.id}/${usuario_id}/followChange`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsFollowing(response.data.isFollowing);
    } catch (error) {
      console.error("Error toggling follow status:", error);
    }
  };

  const handleFollowersClick = () => {
    setShowFollowers(true);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text>No se encontró información del perfil</Text>
      </View>
    );
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
          <Text style={styles.profileFollowers} onPress={handleFollowersClick}>
            <Text style={styles.followersCount}>{followersCount} seguidores</Text>
          </Text>
        </View>
        {showFollowers && (
        <FollowersList
          userId={usuario_id}
          onClose={() => setShowFollowers(false)}
        />
        )}
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