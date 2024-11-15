import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { AuthContext } from '../../Context/auth-context';
import Header from './Components/Header';
import ProfileInfo from './Components/ProfileInfo';
import Tabs from './Components/Tabs';
import Gallery from './Components/Gallery';
import Posteos from './Components/Posteos';
import MisDatos from './Components/MisDatos';
import MisDatosAficionado from './Components/MisDatosAficionado';
import MisDatosReclutador from './Components/MisDatosReclutador';
import Footer from '../Home/Components/Footer';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const Profile = () => {
  const [activeTab, setActiveTab] = useState('Videos');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const getStoredTab = async () => {
      const storedTab = await AsyncStorage.getItem('activeTab');
      if (storedTab) {
        setActiveTab(storedTab);
      }
    };

    getStoredTab();
  }, []);

  const handleTabChange = async (tab) => {
    setActiveTab(tab);
    await AsyncStorage.setItem('activeTab', tab);
  };

  const handleEditClick = async () => {
    setActiveTab('MisDatos');
    await AsyncStorage.setItem('activeTab', 'MisDatos');
  };

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
