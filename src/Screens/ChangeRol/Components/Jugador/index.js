import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import BackgroundAnimation from './Animation/Animation';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const Jugador = () => {
  const [formData, setFormData] = useState({
    edad: '',
    altura: '',
    peso: '',
    liga: '',
    equipo: '',
    posicion: '',
  });

  const [ligas, setLigas] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [posiciones, setPosiciones] = useState([]);

  const [error, setError] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchLigas = async () => {
      const response = await axios.get('https://open-moderately-silkworm.ngrok-free.app/api/changeRoles/getLigas');
      setLigas(response.data);
    };

    const fetchEquipos = async () => {
      const response = await axios.get('https://open-moderately-silkworm.ngrok-free.app/api/changeRoles/getEquipos');
      setEquipos(response.data);
    };

    const fetchPosiciones = async () => {
      const response = await axios.get('https://open-moderately-silkworm.ngrok-free.app/api/changeRoles/getPosiciones');
      setPosiciones(response.data);
    };

    fetchLigas();
    fetchEquipos();
    fetchPosiciones();
  }, []);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('https://open-moderately-silkworm.ngrok-free.app/api/changeRoles/changeToPlayer', {
        email: 'example@email.com',
        edad: formData.edad,
        altura: formData.altura,
        peso: formData.peso,
        liga: formData.liga,
        equipo: formData.equipo,
        posicion: formData.posicion,
      });

      if (response.data.jugador) {
        console.log('Nuevo jugador:', response.data.jugador);
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Error al cambiar a jugador');
    }
  };

  return (
    <View style={styles.container}>
      <BackgroundAnimation />
      <Image source={require('./images/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Cambiar a Jugador</Text>
      <Text style={styles.text}>
                ¿Deseas volver al login?{' '}
                <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
                Haga clic aquí
                </Text>
            </Text>
      {error ? <Text style={styles.errorMessage}>{error}</Text> : null}
      <View style={styles.inputGroup}>
                <Text style={styles.label}>Edad</Text>
                <View style={styles.inputWrapper}>
                    <Image source={require('./images/icons8-usuario-50.png')} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Edad"
                        value={formData.edad}
                        onChangeText={(value) => handleChange('edad', value)}
                        keyboardType="numeric"
                    />
                </View>
        </View>

        <View style={styles.inputGroup}>
                <Text style={styles.label}>Altura</Text>
                <View style={styles.inputWrapper}>
                    <Image source={require('./images/icons8-usuario-50.png')} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Altura"
                        value={formData.altura}
                        onChangeText={(value) => handleChange('altura', value)}
                        keyboardType="numeric"
                    />
                </View>
        </View>


        <View style={styles.inputGroup}>
                <Text style={styles.label}>Peso</Text>
                <View style={styles.inputWrapper}>
                    <Image source={require('./images/icons8-usuario-50.png')} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Peso"
                        value={formData.altura}
                        onChangeText={(value) => handleChange('altura', value)}
                        keyboardType="numeric"
                    />
                </View>
        </View>

      <Picker
        style={styles.picker}
        selectedValue={formData.liga}
        onValueChange={(value) => handleChange('liga', value)}
      >
        <Picker.Item label="Seleccionar liga" value="" />
        {ligas.map((liga) => (
          <Picker.Item key={liga.id} label={liga.nombre} value={liga.id} />
        ))}
      </Picker>
      <Picker
        style={styles.picker}
        selectedValue={formData.equipo}
        onValueChange={(value) => handleChange('equipo', value)}
      >
        <Picker.Item label="Seleccionar equipo" value="" />
        {equipos.map((equipo) => (
          <Picker.Item key={equipo.id} label={equipo.nombre} value={equipo.id} />
        ))}
      </Picker>
      <Picker
        style={styles.picker}
        selectedValue={formData.posicion}
        onValueChange={(value) => handleChange('posicion', value)}
      >
        <Picker.Item label="Seleccionar posición" value="" />
        {posiciones.map((posicion) => (
          <Picker.Item key={posicion.id} label={posicion.nombre} value={posicion.id} />
        ))}
      </Picker>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Confirmar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 0,
      padding: 20,
      flex: 1,
      backgroundColor: '#0a1e2b',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      height: '110%',
      overflow: 'hidden',
      position: 'relative',
      zIndex: 1,
      marginTop: -95,
  },
  logo: {
    width: 75,
    height: 75,
    marginBottom: 60,
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 50,
    marginTop: 120,
    top: 30,
  },
  title: {
    marginBottom: 15,
      fontSize: 25,
      fontWeight: 'bold',
      textAlign: 'center',
      color: 'white',
  },
  text: {
    marginBottom: 15,
    fontSize: 14,
    textAlign: 'center',
    color: '#fff',
  },
  link: {
      color: '#00aaff',
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 15,
    textAlign: 'left',
},
label: {
    fontSize: 15,
    marginBottom: 3,
    color: '#ddd',
},
inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
},
input: {
    width: '100%',
    padding: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#fff',
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 14,
    paddingLeft: 35,
    outline: 'none',
},
inputIcon: {
  position: 'absolute',
  left: 8,
  width: 18,
  height: 18,
  top: 10,
},
  picker: {
    height: 50,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    color: '#fff',
  },
  button: {
    backgroundColor: '#0a743b',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorMessage: {
    color: 'red',
    marginBottom: 16,
  },
});

export default Jugador;