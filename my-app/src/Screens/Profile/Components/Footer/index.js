import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

// Importación de imágenes
import home from './images/icons8-casa-24.png';
import comments from './images/icons8-burbuja-de-diálogo-con-puntos-30.png';
import camera from './images/icons8-camera-24.png';
import envelope from './images/icons8-nuevo-post-24.png';
import user from './images/icons8-persona-de-sexo-masculino-24.png';

const Footer = () => {
    return (
        <View style={styles.footerIcons}>
            <View style={styles.footerIcon}>
                <Image 
                    source={home} 
                    style={styles.footerIconIcon}
                    resizeMode="contain"
                />
                <Text style={styles.spa}>Inicio</Text>
            </View>

            <View style={styles.footerIcon}>
                <Image 
                    source={comments} 
                    style={styles.footerIconIcon}
                    resizeMode="contain"
                />
                <Text style={styles.spa}>Mensajes</Text>
            </View>

            <View style={styles.footerIcon}>
                <Image 
                    source={camera} 
                    style={styles.footerIconIcon}
                    resizeMode="contain"
                />
                <Text style={styles.spa}>Cámara</Text>
            </View>

            <View style={styles.footerIcon}>
                <Image 
                    source={envelope} 
                    style={styles.footerIconIcon}
                    resizeMode="contain"
                />
                <Text style={styles.spa}>Community</Text>
            </View>

            <View style={styles.footerIcon}>
                <Image 
                    source={user} 
                    style={styles.footerIconIcon}
                    resizeMode="contain"
                />
                <Text style={styles.spa}>Perfil</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    footerIcons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        paddingVertical: 8,
        backgroundColor: '#fff',
    },
    footerIcon: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    footerIconIcon: {
        width: 24,
        height: 24,
        marginBottom: 5,
    },
    spa: {
        fontSize: 12,
        color: '#555',
    }
});

export default Footer;