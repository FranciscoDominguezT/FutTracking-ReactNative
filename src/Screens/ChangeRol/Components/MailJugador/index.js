import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios'; // Asegúrate de que axios esté instalado
import BackgroundAnimation from './Animation/Animation'; // Asegúrate de que esta animación sea compatible con React Native

const MailJugador = () => {
    const [email, setEmail] = useState("camilamanera@librodepases.com");
    const [password, setPassword] = useState("ldp123");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigation = useNavigation();

    const handleConfirm = async () => {
        try {
            const response = await axios.post('https://open-moderately-silkworm.ngrok-free.app/api/changeRoles/verify-aficionado', {
                email,
                contraseña: password
            });

            if (response.data.rol === 'Aficionado') {
                navigation.navigate('Jugador', { state: { email, password } }); 
            }
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data.error); 
            } else {
                setErrorMessage('Error de conexión con el servidor');
            }
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <View style={styles.container}>
            <BackgroundAnimation />
            <Image source={require('./images/logo.png')} style={styles.logo} />
            <Text style={styles.title}>Jugador</Text>
            <Text style={styles.text}>
                ¿Deseas volver al login?{' '}
                <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
                Haga clic aquí
                </Text>
            </Text>
            {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputWrapper}>
                    <Image source={require('./images/icons8-correo-48.png')} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Escribir tu correo electrónico"
                        placeholderTextColor="#ddd"
                        autoCompleteType="off"
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
                        secureTextEntry={!passwordVisible}
                        placeholderTextColor="#ddd"
                    />
                    <TouchableOpacity onPress={togglePasswordVisibility}>
                        <Image source={require('./images/icons8-visible-48.png')} style={styles.inputIconRight} />
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleConfirm}>
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
    inputIconRight: {
      width: 18,
      height: 18,
      top: -30,
      right: -160,
    },
    button: {
        marginTop: 60,
        backgroundColor: '#0a743b',
        padding: 10,
        borderRadius: 25,
        width: '90%',
        alignSelf: 'center',
        marginBottom: 30,
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default MailJugador;