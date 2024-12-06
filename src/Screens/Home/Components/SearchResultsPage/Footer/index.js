import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import home from './images/icons8-casa-24.png';
import comments from './images/icons8-burbuja-de-diálogo-con-puntos-30.png';
import camera from './images/icons8-camera-24.png';
import envelope from './images/icons8-nuevo-post-24.png';
import user from './images/icons8-persona-de-sexo-masculino-24.png';

const Footer = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.footerIcons}>
            <TouchableOpacity style={styles.footerIcon} onPress={() => navigation.navigate('Home')}>
                <Image source={home} style={styles.footerIconIcon} />
                <Text style={styles.text}>Inicio</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerIcon} onPress={() => navigation.navigate('Messages')}>
                <Image source={comments} style={styles.footerIconIcon} />
                <Text style={styles.text}>Mensajes</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={styles.footerIcon} 
                onPress={() => navigation.navigate('Camara')}
            >
                <Image source={camera} style={styles.footerIconIcon} />
                <Text style={styles.text}>Cámara</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerIcon}>
                <Image source={envelope} style={styles.footerIconIcon} />
                <Text style={styles.text}>Community</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerIcon} onPress={() => navigation.navigate('Profile')}>
                <Image source={user} style={styles.footerIconIcon} />
                <Text style={styles.text}>Perfil</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    footerIcons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        position: 'absolute',
        bottom: 30,
        left: 0,
    },
    footerIcon: {
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 10,
    },
    text: {
        color: '#000000',
        fontSize: 12,
    },
    footerIconIcon: {
        width: 24,
        height: 24,
        marginBottom: 5,
    },
});

export default Footer;
