import React, { useState, useEffect, useCallback, useContext, useMemo } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, SafeAreaView, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import SearchCard from './Components/SearchCard';
import Header from './Header';
import Footer from './Components/Footer';
import { AuthContext } from '../../Context/auth-context';

const Messages = ({ route, navigation }) => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { user: currentUser } = useContext(AuthContext);
  const searchTerm = route.params?.searchTerm || '';

  const loadUsers = useCallback(async (currentPage) => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const results = await AsyncStorage.getItem('searchResults');
      
      if (results) {
        const parsedResults = JSON.parse(results);
        const filteredResults = parsedResults.filter(user => user.id !== currentUser?.id);
        setUsers(filteredResults);
        setHasMore(false);
      } else {
        const response = await axios.get('https://open-moderately-silkworm.ngrok-free.app/api/search/search', {
          params: { term: searchTerm, page: currentPage }
        });

        const filteredUsers = response.data.filter(user => user.id !== currentUser?.id);

        // Use a Set to ensure unique users
        const uniqueUsers = Array.from(
          new Map(
            [...users, ...filteredUsers].map(user => [user.id, user])
          ).values()
        );

        setUsers(uniqueUsers);
        setHasMore(filteredUsers.length > 0);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setHasMore(false);
    }
    setLoading(false);
  }, [page, searchTerm, loading, hasMore, currentUser?.id, users]);

  useEffect(() => {
    loadUsers(page);
  }, [page]);

  const handleEndReached = () => {
    if (!loading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  // Memoize the user list to prevent unnecessary re-renders
  const userList = useMemo(() => 
    users.map((user) => (
      <SearchCard 
        key={`user-${user.id}`}  // Ensure unique keys
        user={user} 
      />
    )), 
    [users]
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <Text style={styles.title}>Sugerencias</Text>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContentContainer}
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const isEndReached = 
            layoutMeasurement.height + contentOffset.y >= 
            contentSize.height - 20;
          
          if (isEndReached) {
            handleEndReached();
          }
        }}
        scrollEventThrottle={400}
      >
        {users.length > 0 ? (
          <View>
            {userList}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 40,
    marginBottom: 45,
    textAlign: 'center'
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#fff'
  },
  scrollContentContainer: {
    flexGrow: 1,
    padding: 16,
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

export default Messages;