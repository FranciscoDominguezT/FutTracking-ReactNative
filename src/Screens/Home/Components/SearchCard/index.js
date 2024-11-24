import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { AuthContext } from '../../../../Context/auth-context';

const SearchCard = ({ user }) => {
  const navigation = useNavigation();
  const { user: currentUser, token } = useContext(AuthContext);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    checkFollowStatus();
  }, []);

  const checkFollowStatus = async () => {
    if (!currentUser?.id || !user?.id) return;
    try {
      const response = await axios.get(
        `https://open-moderately-silkworm.ngrok-free.app/api/videos/${currentUser.id}/${user.id}/follow`
      );
      setIsFollowing(response.data.isFollowing);
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  };

  const handleFollowToggle = async () => {
    if (!currentUser?.id || !user?.id) return;
    try {
      const response = await axios.post(
        `https://open-moderately-silkworm.ngrok-free.app/api/videos/${currentUser.id}/${user.id}/followChange`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsFollowing(response.data.isFollowing);
    } catch (error) {
      console.error('Error toggling follow status:', error);
    }
  };

  return (
    <TouchableOpacity 
      style={styles.userCard}
      onPress={() => navigation.navigate('PlayerProfile', { userId: user.id })}
    >
      <Image
        source={{ uri: user.avatar_url || '/default-avatar.png' }}
        style={styles.userAvatar}
      />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{`${user.nombre} ${user.apellido}`}</Text>
        <Text style={styles.userStats}>
          {`${user.seguidores} seguidores · ${user.videos} videos`}
        </Text>
      </View>
      {user.id !== currentUser?.id && (
        <TouchableOpacity
          style={[styles.followButton, isFollowing && styles.followingButton]}
          onPress={handleFollowToggle}
        >
          <Text style={styles.followButtonText}>
            {isFollowing ? 'Siguiendo' : 'Seguir'}
          </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 16,
  },
  userAvatar: {
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
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  userStats: {
    fontSize: 14,
    color: '#666',
  },
  followButton: {
    backgroundColor: '#157446',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    marginLeft: 12,
  },
  followingButton: {
    backgroundColor: '#666',
  },
  followButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
  }
});

export default SearchCard;