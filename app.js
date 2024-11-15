import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/Context/auth-context';
import AppNavigator from './src/Navigation/AppNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
}