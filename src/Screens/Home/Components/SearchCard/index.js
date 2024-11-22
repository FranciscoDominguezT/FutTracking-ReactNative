import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, Button, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../../../Context/auth-context';

const SearchCard = ({ users }) => {
  const navigation = useNavigation();
  const { user, token } = useContext(AuthContext);
  const [followStatus, setFollowStatus] = useState({});

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!user || !user.id) return;

      const statusPromises = users.map(async (targetUser) => {
        try {
          const response = await axios.get(`https://open-moderately-silkworm.ngrok-free.app/api/videos/${user.id}/${targetUser.id}/follow`);
          return { [targetUser.id]: response.data.isFollowing };
        } catch (error) {
          console.error(`Error checking follow status for user ${targetUser.id}:`, error);
          return { [targetUser.id]: false };
        }
      });

      const statuses = await Promise.all(statusPromises);
      setFollowStatus(Object.assign({}, ...statuses));
    };

    checkFollowStatus();
  }, [user, users]);

  const handleFollowToggle = async (targetUserId) => {
    if (!user || !user.id) return;

    try {
      const response = await axios.post(
        `https://open-moderately-silkworm.ngrok-free.app/api/api/videos/${user.id}/${targetUserId}/followChange`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFollowStatus((prev) => ({ ...prev, [targetUserId]: response.data.isFollowing }));
    } catch (error) {
      console.error('Error toggling follow status:', error);
    }
  };

  const handleCardClick = (userId) => {
    if (userId) {
      navigation.navigate('PlayerProfile', { userId }); // Navega a la pantalla de perfil
    } else {
      console.error('usuario_id is undefined');
    }
  };

  const renderItem = ({ item: targetUser }) => (
    <TouchableOpacity style={styles.userCard} onPress={() => handleCardClick(targetUser.id)}>
      <Image
        source={{ uri: targetUser.avatar_url || 'https://via.placeholder.com/60' }}
        style={styles.avatar}
      />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{`${targetUser.nombre} ${targetUser.apellido}`}</Text>
        <Text style={styles.userDetails}>{`${targetUser.seguidores} seguidores · ${targetUser.videos} videos`}</Text>
      </View>
      {targetUser.id !== user?.id && (
        <TouchableOpacity
          style={[
            styles.followButton,
            followStatus[targetUser.id] ? styles.following : styles.notFollowing,
          ]}
          onPress={() => handleFollowToggle(targetUser.id)}
        >
          <Text style={styles.followButtonText}>
            {followStatus[targetUser.id] ? 'Siguiendo' : 'Seguir'}
          </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userDetails: {
    fontSize: 14,
    color: '#666',
  },
  followButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  following: {
    backgroundColor: '#157446',
  },
  notFollowing: {
    backgroundColor: '#cccccc',
  },
  followButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SearchCard;
