import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const getAuthenticatedAxios = async () => {
  const token = await AsyncStorage.getItem('token');
  return axios.create({
    baseURL: 'https://open-moderately-silkworm.ngrok-free.app/api',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export default getAuthenticatedAxios;