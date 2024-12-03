import React, { createContext, useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import { supabase } from '../Configs/supabaseClient';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext({
  user: null,
  token: null,
  authError: null,
  setUser: () => { },
  setToken: () => { },
  setAuthError: () => { },
  logout: () => { },
  fetchUserData: () => { },
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = 'https://open-moderately-silkworm.ngrok-free.app';

  const fetchUserComments = async () => {
    if (!token) return;
    try {
      const response = await axios.get(`${API_URL}/api/comments/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Mis comentarios:', response.data);
    } catch (error) {
      console.error("Error fetching user comments:", error);
    }
  };

  const fetchUserData = useCallback(async (token) => {
    console.log('fetchUserData llamado con token:', token);
    try {
      const response = await axios.get(`${API_URL}/api/profile/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Datos de usuario obtenidos:', response.data.profile);
      setUser({
        ...response.data.profile,
        id: response.data.profile.usuario_id
      });
      await fetchUserComments();
    } catch (error) {
      console.error("Error fetching user data:", error);
      setAuthError("Error fetching user data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log('AuthContext useEffect iniciado');
    
    const loadStoredToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        console.log('Token almacenado:', storedToken);
        if (storedToken) {
          setToken(storedToken);
          fetchUserData(storedToken);
        } else {
          console.log('No se encontró token almacenado');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error loading stored token:', error);
        setIsLoading(false);
      }
    };

    loadStoredToken();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Evento de autenticación completo:', { event, session });
      
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        if (session?.user) {
          try {
            console.log('Datos de usuario de Google:', session.user);
            const userMetadata = session.user.user_metadata;
            
            const response = await axios.post(`${API_URL}/api/login/google-login`, {
              name: userMetadata.full_name || session.user.name || 'Usuario Google',
              email: session.user.email,
              picture: userMetadata.avatar_url || session.user.user_metadata.picture
            });
    
            const newToken = response.data.token;
            console.log('Token recibido:', newToken);
            
            await AsyncStorage.setItem('token', newToken);
            setToken(newToken);
    
            await fetchUserData(newToken);
            navigation.navigate('Home');
          } catch (error) {
            console.error("Error completo en Google login:", {
              message: error.message,
              response: error.response?.data,
              status: error.response?.status
            });
            setAuthError(`Error en login de Google: ${error.message}`);
          }
        }
      }
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, [fetchUserData]);

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setToken(null);
      await AsyncStorage.removeItem('token');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  console.log('Estado actual del usuario:', user);
  console.log('Estado actual del token:', token);

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      authError, 
      setUser, 
      setToken, 
      setAuthError, 
      logout, 
      isLoading, 
      fetchUserData 
    }}>
      {children}
    </AuthContext.Provider>
  );
};