import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../Context/auth-context';
import { View, Text, StyleSheet } from 'react-native';
import Profile from '../Profile';
import Header from './Components/Header';
import ProfileInfo from './Components/ProfileInfo';
import Tabs from './Components/Tabs';
import Footer from './Components/Footer';
import Gallery from './Components/Gallery';
import Posteos from './Components/Posteos';
import PlayerPosteos from './Components/PlayerPosteos';
import MasInfo from './Components/MasInfo';
import Contactar from './Components/Contactar';

function PlayerProfile() {
  const { usuario_id } = useParams();
  const [activeTab, setActiveTab] = useState('Videos');
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();

  useEffect(() => {
    const storedTab = AsyncStorage.getItem('activeTab');
    if (storedTab) {
      setActiveTab(storedTab);
    }
  }, []);

  useEffect(() => {
    if (user && user.id === parseInt(usuario_id)) {
      navigation.navigate('Profile');
    }
  }, [user, usuario_id, navigation]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    AsyncStorage.setItem('activeTab', tab);
  };

  const handleEditClick = () => {
    setActiveTab('MisDatos');
    AsyncStorage.setItem('activeTab', 'MisDatos');
  };

  if (user && user.id === parseInt(usuario_id)) {
    return <Profile />;
  }

  return (
    <View style={styles.container}>
      <Header />
      <ProfileInfo usuario_id={usuario_id} onEditClick={handleEditClick} />
      <Tabs activeTab={activeTab} onTabChange={handleTabChange} />
      <View style={styles.mainContent}>
        {activeTab === 'Videos' && <Gallery usuarioId={usuario_id} />}
        {activeTab === 'Posteos' && (
          user && user.id === parseInt(usuario_id)
            ? <Posteos userId={usuario_id} />
            : <PlayerPosteos userId={usuario_id} />
        )}
        {activeTab === 'Mas Info' && <MasInfo userId={usuario_id} />}
        {activeTab === 'Contactar' && <Contactar userId={usuario_id} />}
      </View>
      <Footer />
    </View>
  );
}

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

export default PlayerProfile;