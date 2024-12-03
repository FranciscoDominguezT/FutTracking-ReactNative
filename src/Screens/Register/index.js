import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Dimensions, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { Feather, Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../Context/auth-context';

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const { setAuthError } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setPasswordVisible(!passwordVisible);
    } else if (field === 'confirmPassword') {
      setConfirmPasswordVisible(!confirmPasswordVisible);
    }
  };

  const handleSubmit = async () => {
    if (!termsAccepted) {
      setError('Debes aceptar los términos y condiciones');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await axios.post('https://open-moderately-silkworm.ngrok-free.app/api/register', formData);
      await AsyncStorage.setItem('token', response.data.token);
      navigation.navigate('Home');
    } catch (error) {
      setError(error.response?.data?.error || 'Error al registrar');
      setAuthError(error.response?.data?.error || 'Error al registrar');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Lógica para iniciar sesión con Google
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error durante el inicio de sesión con Google', error);
      setAuthError('Error al iniciar sesión con Google');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('./images/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Crear cuenta</Text>
      <Text style={styles.text}>
        <Text>¿Ya tienes una cuenta? </Text>
        <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
          Inicia sesión aquí
        </Text>
      </Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.inputGroup}>
        <Text style={styles.titles}>Nombre</Text>
        <View style={styles.inputWrapper}>
          <Feather name="user" size={18} color="#ddd" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={formData.nombre}
            onChangeText={(text) => handleChange('nombre', text)}
          />
        </View>
        <Text style={styles.titles}>Apellido</Text>
        <View style={styles.inputWrapper}>
          <Feather name="user" size={18} color="#ddd" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Apellido"
            value={formData.apellido}
            onChangeText={(text) => handleChange('apellido', text)}
          />
        </View>
        <Text style={styles.titles}>Email</Text>
        <View style={styles.inputWrapper}>
          <Feather name="mail" size={18} color="#ddd" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={formData.email}
            onChangeText={(text) => handleChange('email', text)}
          />
        </View>
        <Text style={styles.titles}>Contraseña</Text>
        <View style={styles.inputWrapper}>
          <Feather name="lock" size={18} color="#ddd" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            secureTextEntry={!passwordVisible}
            value={formData.password}
            onChangeText={(text) => handleChange('password', text)}
          />
          <Feather
            name={passwordVisible ? 'eye' : 'eye-off'}
            size={18}
            color="#ddd"
            style={styles.inputIcon}
            onPress={() => togglePasswordVisibility('password')}
          />
        </View>
        <Text style={styles.titles}>Confirmar Contraseña</Text>
        <View style={styles.inputWrapper}>
          <Feather name="lock" size={18} color="#ddd" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Confirmar Contraseña"
            secureTextEntry={!confirmPasswordVisible}
            value={formData.confirmPassword}
            onChangeText={(text) => handleChange('confirmPassword', text)}
          />
          <Feather
            name={confirmPasswordVisible ? 'eye' : 'eye-off'}
            size={18}
            color="#ddd"
            style={styles.inputIcon}
            onPress={() => togglePasswordVisibility('confirmPassword')}
          />
        </View>
      </View>
      <View style={styles.options}>
        <View style={styles.termsWrapper}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => setTermsAccepted(!termsAccepted)}
          >
            {termsAccepted ? (
              <Ionicons name="checkmark" size={16} color="#0a743b" />
            ) : null}
          </TouchableOpacity>
          <Text style={styles.termsText}>Acepto los términos y condiciones</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>
      <Text style={styles.continueText}>O continúa con</Text>
      <View style={styles.socialLogin}>
        <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
          <Image source={require('./images/icons8-logo-de-google-50.png')} style={styles.socialIcon} />
          <Text style={styles.socialButtonText}>Iniciar sesión con Google</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1e2b',
    paddingHorizontal: 20,
    paddingVertical: 50,
  },
  logo: {
    width: 75,
    height: 75,
    borderRadius: 50,
    marginBottom: 60,
    left: 140,
    top: 10,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  text: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 15,
  },
  link: {
    color: '#00aaff',
  },
  error: {
    color: 'red',
    marginBottom: 15,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 15,
  },
  titles: {
  color: '#fff',
  marginTop: 5,
  fontSize: 15,  
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#fff',
    paddingVertical: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#fff',
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
  },
  termsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#0a743b',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  termsText: {
    fontSize: 14,
    color: '#ddd',
  },
  button: {
    backgroundColor: '#0a743b',
    paddingVertical: 10,
    borderRadius: 25,
    width: '100%',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  continueText: {
    fontSize: 15,
    color: '#fff',
    marginVertical: 10,
    textAlign: 'center',
  },
  socialLogin: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a743b',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
  },
  socialIcon: {
    width: 30,
    height: 30,
    borderRadius: 50,
    marginRight: 8,
  },
  socialButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default Register;