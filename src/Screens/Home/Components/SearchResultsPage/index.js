import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, SafeAreaView, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import SearchCard from '../SearchCard';
import Header from '../Header';
import Footer from './Footer';

const SearchResultsPage = ({ route, navigation }) => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const searchTerm = route.params?.searchTerm || '';

  const loadUsers = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const results = await AsyncStorage.getItem('searchResults');
      if (results) {
        const parsedResults = JSON.parse(results);
        setUsers(parsedResults);
      } else {
        const response = await axios.get('https://open-moderately-silkworm.ngrok-free.app/api/search/search', {
          params: { term: searchTerm, page }
        });
        if (page === 1) {
          setUsers(response.data);
        } else {
          setUsers(prevUsers => [...prevUsers, ...response.data]);
        }
        setHasMore(response.data.length > 0);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
    setLoading(false);
  }, [page, searchTerm, loading, hasMore]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleEndReached = () => {
    if (!loading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContentContainer} // Añadido
          onScroll={({ nativeEvent }) => {
            const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
            const isEndReached = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
            if (isEndReached) {
              handleEndReached();
            }
          }}
          scrollEventThrottle={400}
        >
          {users.length > 0 ? (
            <View>
              {users.map((user) => (
                <SearchCard key={user.id} user={user} />
              ))}
            </View>
          ) : (
            <Text style={styles.noResults}>No se encontraron resultados</Text>
          )}
          {loading && (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color="#157446" />
            </View>
          )}
        </ScrollView>
      <Footer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#fff'
  },
  scrollContentContainer: {
    flexGrow: 1, // Permite que el contenido crezca dinámicamente
    padding: 16,
  },
  searchResults: {
    flexGrow: 1,
    padding: 16,
    height: 800
  },
  loader: {
    padding: 16,
    alignItems: 'center'
  },
  noResults: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 24
  }
});

export default SearchResultsPage;