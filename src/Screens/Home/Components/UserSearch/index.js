import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const UserSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const loadAllUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://open-moderately-silkworm.ngrok-free.app/api/search/search');
      await AsyncStorage.setItem('searchResults', JSON.stringify(response.data));
      navigation.navigate('Search');
    } catch (error) {
      console.error('Error loading users:', error);
    }
    setLoading(false);
  };

  const searchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://open-moderately-silkworm.ngrok-free.app/api/search/search', {
        params: { term: searchTerm }
      });
      console.log('Search results:', response.data);
      await AsyncStorage.setItem('searchResults', JSON.stringify(response.data));
      navigation.navigate('Search', { searchTerm });
    } catch (error) {
      console.error('Error searching users:', error);
    }
    setLoading(false);
  };

  const handleFocus = () => {
    if (searchTerm.trim() === '') {
      loadAllUsers();
    }
  };

  const handleInputChange = (text) => {
    setSearchTerm(text);
    if (text.trim() !== '') {
      searchUsers();
    }
  };

  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchBar}
        value={searchTerm}
        onChangeText={handleInputChange}
        onFocus={handleFocus}
        placeholder="Buscar..."
        placeholderTextColor="#999"
      />
      <TouchableOpacity 
        style={styles.searchButton} 
        onPress={() => searchTerm.trim() !== '' && searchUsers()}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#157446" />
        ) : (
          <Icon name="search" size={20} color="#aaa" style={styles.searchIcon} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexGrow: 1,
    margin: 10,
    position: 'relative',
  },
  searchBar: {
    width: '100%',
    height: 40,
    paddingHorizontal: 15,
    paddingRight: 40,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    fontSize: 16,
    marginTop: 9,
  },
  searchButton: {
    position: 'absolute',
    right: 1,  // Aumentar un poco el valor para mover más hacia la derecha
    top: '38%', // Ajustar top para mover el botón más hacia arriba
    transform: [{ translateY: -8 }], // Mover un poco hacia arriba (menos negativo que antes)
    padding: 8,
  },
  searchIcon: {
    width: 20,
    height: 20,
  }
});

export default UserSearch;