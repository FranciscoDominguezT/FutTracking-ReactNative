import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import Ionicons from 'react-native-vector-icons/Ionicons'; 

const Header = () => {
  const navigation = useNavigation(); 

  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Home')} 
      >
        <Ionicons name="chevron-back" size={24} color="white" />
      </TouchableOpacity>

      <Image
        source={require('./Images/logo.png')} 
        style={styles.logo}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#157446',
    paddingHorizontal: 50,
    paddingVertical: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  backButton: {
    backgroundColor: '#000',
    borderRadius: 50,
    width: 35,
    height: 35,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 30,
    left: 25,
    cursor: 'pointer', 
  },
  logo: {
    width: 80,
    height: 70,
  },
});

export default Header;
