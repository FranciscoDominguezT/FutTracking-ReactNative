import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import SearchCard from '../SearchCard'; // Asegúrate de adaptar este componente a React Native
import UserSearch from '../UserSearch'; // Si lo usas
import Header from '../Header'; // Asegúrate de que este componente funcione en React Native
import Footer from '../Footer';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SearchResultsPage = ({ route }) => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const searchTerm = route?.params?.searchTerm || '';

    const loadUsers = useCallback(async () => {
        setLoading(true);
        try {
          const results = await AsyncStorage.getItem('searchResults'); // Usa AsyncStorage en lugar de localStorage
          if (results) {
            const parsedResults = JSON.parse(results);
            setUsers(parsedResults);
          } else {
            const response = await axios.get('https://open-moderately-silkworm.ngrok-free.app/api/search/search', {
              params: { term: searchTerm, page },
            });
            setUsers((prevUsers) => [...prevUsers, ...response.data]);
            setHasMore(response.data.length > 0);
          }
        } catch (error) {
          console.error('Error fetching users:', error);
        }
        setLoading(false);
      }, [page, searchTerm]);

      useEffect(() => {
        loadUsers();
      }, [loadUsers]);
    
      const handleLoadMore = () => {
        if (!loading && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      };

      const renderFooter = () => {
        if (!loading) return null;
        return <ActivityIndicator size="large" color="#0000ff" />;
      };
    
      return (
        <View style={styles.container}>
          <Header />
          {users.length > 0 ? (
            <FlatList
              data={users}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => <SearchCard user={item} />}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.5}
              ListFooterComponent={renderFooter}
            />
          ) : (
            <Text style={styles.noResultsMessage}>No se encontraron resultados</Text>
          )}
          <Footer />
        </View>
      );
    };

    const styles = StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: '#fff',
        },
        noResultsMessage: {
          textAlign: 'center',
          marginTop: 20,
          fontSize: 16,
          color: '#333',
        },
      });
      
      export default SearchResultsPage;