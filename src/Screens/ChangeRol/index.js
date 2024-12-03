import React from 'react';
import { View, Text, Image, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BackgroundAnimation from '../Login/Animation/Animation'; // Asegúrate de que esta animación sea compatible con React Native

const ChangeRol = () => {
    const navigation = useNavigation();

    const handlePlayerClick = () => {
        navigation.navigate('MailJugador'); 
    };

    const handleRecruiterClick = () => {
        navigation.navigate('MailReclutador'); 
    };

    return (
        <View style={styles.container}>
            <BackgroundAnimation />
            <Image source={require('./images/logo.png')} style={styles.logo} />
            <Text style={styles.title}>Cambio de Rol</Text>
            <Text style={styles.text}>
                ¿Deseas volver al login?{' '}
                <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
                Haga clic aquí
                </Text>
            </Text>
            <TouchableOpacity style={styles.buttonRR} onPress={handlePlayerClick}>
                <Text style={styles.buttonText}>Cambiar a Jugador</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonRR} onPress={handleRecruiterClick}>
                <Text style={styles.buttonText}>Cambiar a Reclutador</Text>
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
    buttonRR: {
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

export default ChangeRol;
