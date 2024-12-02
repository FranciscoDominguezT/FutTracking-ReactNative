import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const MasInfo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubscribeClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.message}>
        Para contactar a este jugador, necesitas una suscripción premium.
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleSubscribeClick}>
        <Text style={styles.buttonText}>Adquirir Suscripción</Text>
      </TouchableOpacity>

      <Modal visible={isModalOpen} transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Suscripción Premium</Text>
              <TouchableOpacity onPress={handleCloseModal}>
                <FontAwesome5 name="times" size={24} color="#636e72" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.premiumIntro}>Disfruta de los siguientes beneficios:</Text>
              <View style={styles.benefitsList}>
                <View style={styles.benefitItem}>
                  <FontAwesome5 name="crown" size={24} color="#157446" />
                  <Text style={styles.benefitText}>Contacta a cualquier jugador</Text>
                </View>
                <View style={styles.benefitItem}>
                  <FontAwesome5 name="user-friends" size={24} color="#157446" />
                  <Text style={styles.benefitText}>Accede a eventos exclusivos</Text>
                </View>
                <View style={styles.benefitItem}>
                  <FontAwesome5 name="envelope" size={24} color="#157446" />
                  <Text style={styles.benefitText}>Mensajes ilimitados con jugadores</Text>
                </View>
                <View style={styles.benefitItem}>
                  <FontAwesome5 name="eye" size={24} color="#157446" />
                  <Text style={styles.benefitText}>Visualiza perfiles completos</Text>
                </View>
                <View style={styles.benefitItem}>
                  <FontAwesome5 name="check-circle" size={24} color="#157446" />
                  <Text style={styles.benefitText}>Actualizaciones y notificaciones exclusivas</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.confirmButton}>
              <Text style={styles.confirmButtonText}>Suscribirme Ahora</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 16,
    color: '#000',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#157446',
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 32,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 40,
    width: '90%',
    maxWidth: 480,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2d3436',
  },
  modalBody: {
    alignItems: 'flex-start',
  },
  premiumIntro: {
    fontSize: 18,
    fontWeight: '400',
    color: '#2d3436',
    marginBottom: 20,
  },
  benefitsList: {
    width: '100%',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    padding: 15,
    marginBottom: 12,
    borderRadius: 12,
  },
  benefitText: {
    fontSize: 16,
    color: '#2d3436',
    fontWeight: '500',
  },
  confirmButton: {
    backgroundColor: '#157446',
    borderRadius: 50,
    paddingVertical: 15,
    paddingHorizontal: 40,
    marginTop: 30,
    elevation: 3,
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default MasInfo;