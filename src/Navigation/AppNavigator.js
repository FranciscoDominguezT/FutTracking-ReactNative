import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from '../Screens/Login';
import Home from '../Screens/Home';
import ConfigScreen from '../Screens/Home/Components/ConfigScreen';
// import Register from '../Screens/Register';
import Profile from '../Screens/Profile';
// import PlayerProfile from '../Screens/PlayerProfile';
import FilterScreen from '../Screens/Home/Components/FilterScreen';
import SearchResults from '../Screens/Home/Components/SearchResultsPage';
import SearchResultsPage from '../Screens/Home/Components/SearchResultsPage';
// import ConfigScreen from '../Screens/ConfigScreen';
// import ChangeRol from '../Screens/ChangeRol';
// import Jugador from '../Screens/ChangeRol/components/Jugador';
// import Reclutador from '../Screens/ChangeRol/components/Reclutador';
// import MailJugador from '../Screens/ChangeRol/components/MailJugador';
// import MailReclutador from '../Screens/ChangeRol/components/MailReclutador';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Stack.Screen name="ConfigScreen" component={ConfigScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
      <Stack.Screen name="FilterScreen" component={FilterScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Search" component={SearchResultsPage} options={{ headerShown: false }}/>
      {/* 
      <Stack.Screen name="Register" component={Register} />

      <Stack.Screen name="ChangeRol" component={ChangeRol} />
      
      <Stack.Screen name="Jugador" component={Jugador} />
      <Stack.Screen 
        name="PlayerProfile" 
        component={PlayerProfile}
        options={({ route }) => ({ 
          title: `Perfil de Jugador: ${route.params?.usuario_id}` 
        })}
      />
      <Stack.Screen name="Reclutador" component={Reclutador} />

      <Stack.Screen name="MailJugador" component={MailJugador} />
      <Stack.Screen name="MailReclutador" component={MailReclutador} /> */}
    </Stack.Navigator>
  );
};

export default AppNavigator;