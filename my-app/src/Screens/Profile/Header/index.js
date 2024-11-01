import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const Header = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.header}>
            <TouchableOpacity 
                style={styles.backButton}
                onPress={() => navigation.navigate('Home')}
            >
                <Icon name="chevron-left" size={18} color="white" />
            </TouchableOpacity>
            <Image 
                source={require('./Images/logo.png')} 
                style={styles.logo}
                resizeMode="contain"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#157446',
        paddingVertical: 40,
        paddingHorizontal: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    backButton: {
        backgroundColor: '#000',
        borderRadius: 35/2,
        width: 35,
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 30,
        left: 25,
    },
    logo: {
        width: 80,
        height: 80,
    }
});

export default Header;