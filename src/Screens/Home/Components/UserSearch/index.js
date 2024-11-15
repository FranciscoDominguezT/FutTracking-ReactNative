import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importa el icono de FontAwesome
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
      localStorage.setItem('searchResults', JSON.stringify(response.data));
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
      localStorage.setItem('searchResults', JSON.stringify(response.data));
      navigation.navigate('Search', { state: { searchTerm } });
    } catch (error) {
      console.error('Error searching users:', error);
    }
    setLoading(false);
  };

  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      searchUsers();
    }
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
        value={searchTerm}
        onChangeText={handleInputChange}
        onFocus={handleFocus}
        placeholder="Buscar..."
        style={styles.searchBar}
      />
      <TouchableOpacity onPress={handleSearch} disabled={loading} style={styles.searchButton}>
        {loading ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <Icon name="search" size={20} style={styles.searchIcon} />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default UserSearch;

const styles = StyleSheet.create({
  searchContainer: {
    flexGrow: 1,
    margin: 10,
    position: 'relative',
  },
  searchBar: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    outline: 'none',
    paddingRight: 30,
    marginTop: 10,
  },
  searchButton: {
    position: 'absolute',
    right: 10,
    top: '40%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: {
    color: '#ccc',
  },
});
