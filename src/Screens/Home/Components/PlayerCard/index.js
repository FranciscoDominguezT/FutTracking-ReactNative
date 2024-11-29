import React from "react";
import { useNavigation } from '@react-navigation/native';
import { View, Image, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const cardWidth = (width * 0.55 - 20) / 1;

const PlayerCard = ({ player }) => {
    const navigation = useNavigation();

    const handleCardClick = () => {
      if (player.usuario_id) {
          console.log(`Navigating to profile with usuario_id: ${player.usuario_id}`);
          navigation.navigate('PlayerProfile', { usuario_id: player.usuario_id });
      } else {
          console.error("usuario_id is undefined");
      }
  };

    return (
        <TouchableOpacity 
          style={styles.card}
          onPress={handleCardClick}
          activeOpacity={0.7}
        >
          <Image
            source={{ 
              uri: player.avatar_url || '/api/placeholder/48/48' 
            }}
            style={styles.avatar}
          />
          <View style={styles.info}>
            <Text style={styles.name}>{`${player.nombre} ${player.apellido}`}</Text>
            <Text style={styles.details}>{`${player.edad}y | ${player.posicion_nombre}`}</Text>
            <Text style={styles.details}>{player.equipo_nombre}</Text>
            <Text style={styles.details}>{`${player.altura}cm | ${player.peso}kg`}</Text>
          </View>
        </TouchableOpacity>
      );
}

const styles = StyleSheet.create({
    card: {
        width: cardWidth,
        flexDirection: 'row',
        backgroundColor: '#2E2E2E',
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
        marginBottom: 10,
      },
      avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#555555', // Placeholder color while loading
      },
      info: {
        flex: 1,
        marginLeft: 10,
      },
      name: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
      },
      details: {
        fontSize: 12,
        color: '#CCCCCC',
        marginTop: 2,
      },
});

export default PlayerCard;