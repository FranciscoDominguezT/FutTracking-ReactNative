import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { AuthContext } from '../../Context/auth-context';
import Header from './Components/Header';
import ProfileInfo from './Components/ProfileInfo';
import Tabs from './Components/Tabs';
import Gallery from './Components/Gallery';
import Posteos from './Components/Posteos';
import MisDatos from './Components/MisDatos';
import MisDatosAficionado from './Components/MisDatosAficionado';
import MisDatosReclutador from './Components/MisDatosReclutador';
import Footer from '../Profile/Components/Footer';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const Profile = () => {
  const [activeTab, setActiveTab] = useState('Videos');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const initialize = async () => {
      try {
        const storedTab = await AsyncStorage.getItem('activeTab');
        if (storedTab) {
          setActiveTab(storedTab);
        }
      } catch (error) {
        console.error('Error loading stored tab:', error);
      } finally {
        setIsLoading(false); // Finaliza la carga
      }
    };

    initialize();
  }, []);

  const handleTabChange = async (tab) => {
    setActiveTab(tab);
    await AsyncStorage.setItem('activeTab', tab);
  };

  const handleEditClick = async () => {
    setActiveTab('MisDatos');
    await AsyncStorage.setItem('activeTab', 'MisDatos');
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text>No se pudo cargar la información del usuario</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <ProfileInfo onEditClick={handleEditClick} />
      <Tabs activeTab={activeTab} onTabChange={handleTabChange} />
      <View style={styles.mainContent}>
        {activeTab === 'Videos' && <Gallery isUserProfile={true} />}
        {activeTab === 'Posteos' && <Posteos />}
        {activeTab === 'MisDatos' && (
          user.rol === 'Jugador' ? <MisDatos />
          : user.rol === 'Aficionado' ? <MisDatosAficionado />
          : user.rol === 'Reclutador' ? <MisDatosReclutador />
          : null
        )}
      </View>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mainContent: {
    flex: 1,
  },
});

export default Profile;
