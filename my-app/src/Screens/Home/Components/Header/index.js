import React, { useEffect, useState, useContext } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import UserSearch from '../UserSearch';
import { AuthContext } from '../../../../Context/auth-context';
import { useNavigation } from '@react-navigation/native';
import user from './images/icons8-user-30.png';
import filter from './images/icons8-mezclador-horizontal-ajustes-30.png';
import settings from './images/icons8-ajustes-50.png';

const Header = () => {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const { token } = useContext(AuthContext);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        if (!token) {
          console.error('No token found');
          return;
        }

        const response = await axios.get('https://open-moderately-silkworm.ngrok-free.app/api/user/avatar', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAvatarUrl(response.data.avatar_url);
      } catch (error) {
        console.error('Error al obtener el avatar del usuario:', error);
      }
    };

    fetchAvatar();
  }, [token]);

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <Image
          source={avatarUrl ? { uri: avatarUrl } : user}
          style={styles.profileImg}
        />
      </TouchableOpacity>
      <UserSearch />
      <View style={styles.icons}>
        <TouchableOpacity onPress={() => navigation.navigate('Filter')}>
          <Image source={filter} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ConfigScreen')}>
          <Image source={settings} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    zIndex: 2,
    borderTopLeftRadius: 8, // Para mantener los bordes redondeados superiores
    borderTopRightRadius: 8,
  },
  profileImg: {
    width: 45,  // Sin comillas, es un número
    height: 45,  // Sin comillas, es un número
    borderRadius: 25,  // Mitad del tamaño para hacer un círculo
    borderWidth: 2,  // En lugar de 'border', usa 'borderWidth'
    borderColor: '#157446',  // En lugar de 'border', usa 'borderColor'
    marginLeft: 10,
    marginTop: 10,
  },
  icons: {
    flexDirection: 'row',
  },
  icon: {
    width: 24,
    height: 24,
    marginLeft: 10,
  },
});
