import axios from 'axios';

const getAuthenticatedAxios = () => {
  const token = localStorage.getItem('token');
  return axios.create({
    baseURL: 'https://open-moderately-silkworm.ngrok-free.app/api',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export default getAuthenticatedAxios;