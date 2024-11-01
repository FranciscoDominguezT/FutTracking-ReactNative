import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import Modal from 'react-native-modal'; // Asegúrate de instalar react-native-modal
import { AuthContext } from '../../../../Context/auth-context';

const NewTweetModal = ({ isOpen, onClose, onTweetCreated }) => {
  const [content, setContent] = useState('');
  const { user, token } = useContext(AuthContext);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    try {
      const response = await fetch('http://localhost:5001/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          contenido: content,
          videourl: '' // Añade esto si es necesario
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
    }
  };

  return (
    <Modal isVisible={isOpen} onBackdropPress={onClose} style={styles.modal}>
      <View style={styles.modalContent}>
        <Text style={styles.title}>New Tweet</Text>
        <TextInput
          style={styles.textInput}
          value={content}
          onChangeText={setContent}
          placeholder="What's happening?"
          maxLength={280}
          multiline
        />
        <View style={styles.actions}>
          <Button title="Cancel" onPress={onClose} color="#ccc" />
          <Button title="Tweet" onPress={handleSubmit} color="#1da1f2" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxWidth: 450
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15
  },
  textInput: {
    width: '100%',
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    textAlignVertical: 'top'
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  }
});

export default NewTweetModal;
