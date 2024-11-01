import React from 'react';
import { View, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import Header from './Components/Header';
import Main from './Components/Main';
import Footer from './Components/Footer';

const { width } = Dimensions.get('window');

function Home() {
  return (
    <SafeAreaView style={styles.all}>
      <View style={styles.container}>
        <Header />
        <View style={styles.mainContent}>
          <Main />
        </View>
        <Footer />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  all: {
    flex: 1, // Asegúrate de que ocupe toda la pantalla
    backgroundColor: '#fff', // Fondo del body
  },
  container: {
    flex: 1, // Agregamos flex: 1 para que ocupe todo el espacio disponible
    width: width,
    maxWidth: 460, // Maximo ancho
    marginHorizontal: 'auto', // Centrando el contenedor
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5, // Para Android
    borderRadius: 8, // Para bordes redondeados
    overflow: 'hidden', // Para que el contenido no se salga del borderRadius
  },
  mainContent: {
    flex: 1, // Agregamos flex: 1 para que ocupe el espacio disponible entre header y footer
    position: 'relative',
  },
});

export default Home;
