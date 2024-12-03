import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import { AuthContext } from '../../../../Context/auth-context';

const NewTweetModal = ({ isOpen, onClose, onTweetCreated }) => {
  const [content, setContent] = useState('');
  const { user, token } = useContext(AuthContext);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    try {
      const response = await fetch('https://open-moderately-silkworm.ngrok-free.app/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          contenido: content,
          videourl: '', // Añadir esto si es necesario
        })
      });

      if (!response.ok) {
        throw new Error('Error creating tweet');
      }

      const newTweet = await response.json();
      const newTweetWithUserData = {
        ...newTweet,
        nombre: user.nombre,
        apellido: user.apellido,
        avatar_url: user.avatar_url
      };

      onTweetCreated(newTweetWithUserData);
      setContent('');
      onClose();
    } catch (error) {
      console.error('Error creating tweet:', error);
      Alert.alert('Error', 'Hubo un error al crear el tweet.');
    }
  };

  return (
    <Modal visible={isOpen} animationType="fade" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Nuevo Tweet</Text>

          <TextInput
            style={styles.textArea}
            value={content}
            onChangeText={setContent}
            placeholder="¿Qué está pasando?"
            maxLength={280}
            multiline={true}
          />

          <View style={styles.modalActions}>
            <TouchableOpacity onPress={onClose} style={[styles.button, styles.cancelButton]}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmit} style={[styles.button, styles.submitButton]}>
              <Text style={styles.buttonText}>Tweet</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxWidth: 450,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  textArea: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: 'white',
    borderColor: '#1da1f2',
    borderWidth: 1,
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: '#1da1f2',
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
  },
});

export default NewTweetModal;
