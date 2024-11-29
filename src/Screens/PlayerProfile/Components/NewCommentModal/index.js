import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import { AuthContext } from '../../../../Context/auth-context';

const NewCommentModal = ({ isOpen, onClose, onCommentCreated, postId, parentId = null }) => {
  const [content, setContent] = useState('');
  const { token } = useContext(AuthContext);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    try {
      const response = await fetch(`https://open-moderately-silkworm.ngrok-free.app/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          contenido: content,
          parentid: parentId
        })
      });

      if (!response.ok) {
        throw new Error('Error creating comment');
      }

      const newComment = await response.json();
      onCommentCreated(newComment);
      setContent('');
      onClose();
    } catch (error) {
      console.error("Error creating comment:", error);
      Alert.alert('Error', 'Hubo un error al crear el comentario.');
    }
  };

  return (
    <Modal visible={isOpen} animationType="fade" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>{parentId ? 'Nueva Respuesta' : 'Nuevo Comentario'}</Text>

          <TextInput
            style={styles.textArea}
            value={content}
            onChangeText={setContent}
            placeholder={parentId ? 'Escribe tu respuesta...' : 'Escribe tu comentario...'}
            maxLength={280}
            multiline={true}
          />

          <View style={styles.modalActions}>
            <TouchableOpacity onPress={onClose} style={[styles.button, styles.cancelButton]}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmit} style={[styles.button, styles.submitButton]}>
              <Text style={styles.buttonText}>{parentId ? 'Responder' : 'Comentar'}</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
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
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    marginBottom: 15,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
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
    color: 'white',
    fontSize: 16,
  },
});

export default NewCommentModal;
