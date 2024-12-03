// Login.js
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  StatusBar,
  Platform,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../Context/auth-context';
import { supabase } from '../../Configs/supabaseClient';
import { useNavigation } from '@react-navigation/native';
import BackgroundAnimation from './Animation/Animation';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

const Login = () => {
  const navigation = useNavigation(); // Agregar hook de navegación
  const [email, setEmail] = useState('ezgajer@gmail.com');
  const [password, setPassword] = useState('ezequiel2006');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { setUser, setToken, setAuthError, fetchUserData } = useContext(AuthContext);

  const API_URL = 'https://open-moderately-silkworm.ngrok-free.app';

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const showAlert = (message) => {
    setAlertMessage(message);
    Alert.alert('', message);
    setTimeout(() => {
      setAlertMessage('');
    }, 3000);
  };

  const handleLogin = async () => {
    setAuthError(null);
  
    if (!email || !password) {
      setAuthError('Por favor, ingrese todos los campos');
      showAlert('Por favor, ingrese todos los campos');
      return;
    }
  
    try {
      // Asegúrate de usar la IP correcta de tu máquina en la red local
      const API_URL = 'https://open-moderately-silkworm.ngrok-free.app';
  
      console.log('Intentando conectar a:', API_URL);
  
      const response = await axios.post(
        `${API_URL}/api/login/login`,
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000, // Añadir timeout de 10 segundos
        }
      );
  
      console.log('Respuesta del servidor:', response.data);
  
      if (!response.data.token) {
        throw new Error('No se recibió token del servidor');
      }
  
      const { token } = response.data;
      await AsyncStorage.setItem('token', token);
      setToken(token);
      
      // Fetch user data immediately after login
      await fetchUserData(token);
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error completo:', error.message);
      const errorMessage = error.response?.data?.error || 
                          error.message || 
                          'Error de conexión al servidor';
      setAuthError(errorMessage);
      showAlert(errorMessage);
    }
  };
  

  const handleGoogleLogin = async () => {
    try {
      await WebBrowser.maybeCompleteAuthSession();
      const redirectUrl = Linking.createURL('/callback')

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          scopes: 'email profile',
          queryParams: { 
            prompt: 'select_account',
            // Añadir las URLs de callback configuradas en Google Console
            redirect_uri: [
              'https://cryvkjhhbrsdmffgqmbj.supabase.co/auth/v1/callback',
              'https://open-moderately-silkworm.ngrok-free.app/auth/v1/callback'
            ].join(',')
          }
        }
      });
  
      if (error) {
        console.error('Error OAuth:', error);
        Alert.alert('Error', error.message);
        return;
      }
  
      // Importante: Abrir la URL de manera explícita
      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(
          data.url, 
          redirectUrl
        );

        console.log('Resultado del login:', result);
      }
    } catch (error) {
      console.error('Error durante el inicio de sesión con Google:', error);
      Alert.alert('Error', 'No se pudo iniciar sesión con Google');
    }
  };

  return (
    <View style={styles.loginContainer}>
      <StatusBar 
        barStyle="light-content"
        translucent={true}
        backgroundColor="transparent"
      />
      {alertMessage && (
        <View style={styles.customAlert}>
          <Text style={styles.alertText}>{alertMessage}</Text>
        </View>
      )}
      <BackgroundAnimation />
      <Image source={require('./images/logo.png')} style={styles.logoYY} />
      <Text style={styles.title}>Iniciar sesión</Text>
      <Text style={styles.registerText}>
        Si no tienes una cuenta,{' '}
        <Text style={styles.linkText} onPress={() => navigation.navigate('Register')}>
          regístrate aquí!
        </Text>
      </Text>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWrapper}>
            <Image source={require('./images/icons8-correo-48.png')} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Escribir tu correo electrónico"
              placeholderTextColor="#fff"
              autoComplete="off"
              keyboardType="email-address"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contraseña</Text>
          <View style={styles.inputWrapper}>
            <Image source={require('./images/icons8-bloquear-50.png')} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Escribir tu contraseña"
              placeholderTextColor="#fff"
              secureTextEntry={!passwordVisible}
            />
            <TouchableOpacity onPress={togglePasswordVisibility}>
              <Image source={require('./images/icons8-visible-48.png')} style={styles.inputIconRight} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.options}>
          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setRememberMe(!rememberMe)}
            >
              {rememberMe && <View style={styles.checkboxInner} />}
            </TouchableOpacity>
            <Text style={styles.checkboxLabel}>Recuérdame</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('#')}>
            <Text style={styles.linkText}>Olvidé mi contraseña</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.btnLogin} onPress={handleLogin}>
          <Text style={styles.btnLoginText}>Ingresar</Text>
        </TouchableOpacity>

        <Text style={styles.continueText}>O continúa con</Text>

        <View style={styles.socialLogin}>
          <TouchableOpacity style={styles.btnGoogle} onPress={handleGoogleLogin}>
            <Image source={require('./images/icons8-logo-de-google-50.png')} style={styles.googleIcon} />
            <Text style={styles.btnGoogleText}>Iniciar sesión con Google</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.rolText}>
          Si desea cambiar de rol,{' '}
          <Text style={styles.linkText} onPress={() => navigation.navigate('ChangeRol')}>
            haga click aquí!
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0a1e2b',
  },
  logoYY: {
    width: 75,
    height: 75,
    marginBottom: 60,
    alignSelf: 'center',
    borderRadius: 37.5,
    marginTop: 100,
  },
  title: {
    marginBottom: 15,
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fff',
  },
  registerText: {
    marginBottom: 15,
    color: '#fff',
    fontSize: 14,
  },
  linkText: {
    color: '#00aaff',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 15,
    marginBottom: 3,
    color: '#ddd',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#fff',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingLeft: 35,
    color: 'white',
    fontSize: 14,
  },
  inputIcon: {
    position: 'absolute',
    left: 8,
    width: 18,
    height: 18,
  },
  inputIconRight: {
    width: 18,
    height: 18,
    marginRight: 8,
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#fff',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    backgroundColor: '#fff',
  },
  checkboxLabel: {
    color: '#fff',
    fontSize: 14,
  },
  btnLogin: {
    backgroundColor: '#0a743b',
    padding: 10,
    borderRadius: 25,
    marginBottom: 15,
  },
  btnLoginText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  continueText: {
    marginBottom: 15,
    marginTop: 30,
    fontSize: 15,
    textAlign: 'center',
    color: '#fff',
  },
  socialLogin: {
    alignItems: 'center',
  },
  btnGoogle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a1e2b',
    borderWidth: 3,
    borderColor: '#0a743b',
    borderRadius: 25,
    padding: 10,
    width: '100%',
    maxWidth: 300,
  },
  btnGoogleText: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
  googleIcon: {
    width: 18,
    height: 18,
    marginRight: 8,
  },
  rolText: {
    marginTop: 35,
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  customAlert: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#ff4d4d',
    padding: 15,
    borderRadius: 5,
    zIndex: 10,
  },
  alertText: {
    color: 'white',
  },
});

export default Login;