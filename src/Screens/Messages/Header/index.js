import React, { useEffect, useState, useContext } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import UserSearch from '../../Home/Components/UserSearch';
import { AuthContext } from '../../../Context/auth-context';
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
          console.log('No token found. Skipping avatar fetch.');
          setAvatarUrl(null);
          return;
        }

        const response = await axios.get('https://open-moderately-silkworm.ngrok-free.app/api/user/avatar', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAvatarUrl(response.data.avatar_url);
      } catch (error) {
        console.error('Error al obtener el avatar del usuario:', error?.response?.data || error.message);
      }
    };

    fetchAvatar();
  }, [token]);

  return (
    <View style={styles.header}>
      {/* Avatar */}
      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <Image
          source={avatarUrl ? { uri: avatarUrl } : user}
          style={styles.profileImg}
        />
      </TouchableOpacity>

      {/* Search */}
      <View style={styles.searchContainer}>
        <UserSearch />
      </View>

      {/* Icons */}
      <View style={styles.iconsContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('FilterScreen')}>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    height: 60, // Altura uniforme para el header
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  profileImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#157446',
  },
  searchContainer: {
    flex: 1, // Ocupa el espacio disponible entre los íconos
    marginHorizontal: 10,
    justifyContent: 'center', // Centra el buscador verticalmente
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Centra los íconos verticalmente
  },
  icon: {
    width: 24,
    height: 24,
    marginLeft: 10,
  },
});
