import React, { useState, useEffect, useContext } from 'react';
import { View, ScrollView, SafeAreaView } from 'react-native';
import { AuthContext } from '../../Context/auth-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet } from 'react-native';
import Header from './Components/Gallery/Components/Header';
import ProfileInfo from './Components/ProfileInfo';
import Tabs from './Components/Tabs';
import Gallery from './Components/Gallery';
import Posteos from './Components/Posteos';
import MisDatos from './Components/MisDatos';
import MisDatosAficionado from './Components/MisDatosAficionado';
import MisDatosReclutador from './Components/MisDatosReclutador';
import Footer from '../Home/Components/Footer';

function Profile() {
    const [activeTab, setActiveTab] = useState('Videos');
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const loadStoredTab = async () => {
            try {
                const storedTab = await AsyncStorage.getItem('activeTab');
                if (storedTab) {
                    setActiveTab(storedTab);
                }
            } catch (error) {
                console.error('Error loading stored tab:', error);
            }
        };
        
        loadStoredTab();
    }, []);

    const handleTabChange = async (tab) => {
        setActiveTab(tab);
        try {
            await AsyncStorage.setItem('activeTab', tab);
        } catch (error) {
            console.error('Error saving tab:', error);
        }
    };

    const handleEditClick = async () => {
        setActiveTab('MisDatos');
        try {
            await AsyncStorage.setItem('activeTab', 'MisDatos');
        } catch (error) {
            console.error('Error saving tab:', error);
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'Videos':
                return <Gallery isUserProfile={true} />;
            case 'Posteos':
                return <Posteos />;
            case 'MisDatos':
                switch (user.rol) {
                    case 'Jugador':
                        return <MisDatos />;
                    case 'Aficionado':
                        return <MisDatosAficionado />;
                    case 'Reclutador':
                        return <MisDatosReclutador />;
                    default:
                        return null;
                }
            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Header />
                <ScrollView>
                    <ProfileInfo onEditClick={handleEditClick} />
                    <Tabs activeTab={activeTab} onTabChange={handleTabChange} />
                    <View style={styles.mainContent}>
                        {renderContent()}
                    </View>
                </ScrollView>
                <View style={styles.footer}>
                    <Footer />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        maxWidth: '100%',
    },
    mainContent: {
        flex: 1,
    },
    footer: {
        padding: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
});

export default Profile;