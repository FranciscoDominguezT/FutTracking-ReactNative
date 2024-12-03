import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from '../Screens/Login';
import Home from '../Screens/Home';
import ConfigScreen from '../Screens/Home/Components/ConfigScreen';
import Register from '../Screens/Register';
import Profile from '../Screens/Profile';
import PlayerProfile from '../Screens/PlayerProfile';
import FilterScreen from '../Screens/Home/Components/FilterScreen';
import SearchResults from '../Screens/Home/Components/SearchResultsPage';
import SearchResultsPage from '../Screens/Home/Components/SearchResultsPage';
import Messages from '../Screens/Messages';
import ChangeRol from '../Screens/ChangeRol';
import MailJugador from '../Screens/ChangeRol/Components/MailJugador';
import MailReclutador from '../Screens/ChangeRol/Components/MailReclutador';
import Jugador from '../Screens/ChangeRol/Components/Jugador';
// import Reclutador from '../Screens/ChangeRol/components/Reclutador';



const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Stack.Screen name="ConfigScreen" component={ConfigScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
      <Stack.Screen name="FilterScreen" component={FilterScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Search" component={SearchResultsPage} options={{ headerShown: false }}/>
      <Stack.Screen name="Messages" component={Messages} options={{ headerShown: false }}/>
      <Stack.Screen name="ChangeRol" component={ChangeRol} options={{ headerShown: false }} />
      <Stack.Screen name="MailJugador" component={MailJugador} options={{ headerShown: false }} />
      <Stack.Screen name="MailReclutador" component={MailReclutador} options={{ headerShown: false }} />
      <Stack.Screen name="Jugador" component={Jugador} options={{ headerShown: false }} />
      <Stack.Screen 
          name="PlayerProfile" 
          component={PlayerProfile}
          options={({ route }) => ({ 
              title: `Perfil de Jugador: ${route.params?.usuario_id || "Perfil"}`,
              headerShown: false // Ocultar el encabezado
          })}
      />
      {/* 



      

      
      <Stack.Screen name="Reclutador" component={Reclutador} />


       */}
    </Stack.Navigator>
  );
};

export default AppNavigator;