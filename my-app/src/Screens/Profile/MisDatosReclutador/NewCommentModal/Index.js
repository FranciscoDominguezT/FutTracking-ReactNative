import React, { useState, useContext } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { AuthContext } from '../../../../Context/auth-context';

const NewCommentModal = ({ isOpen, onClose, onCommentCreated, postId, parentId = null }) => {
  const [content, setContent] = useState('');
  const { token } = useContext(AuthContext);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    try {
      const response = await fetch(`http://localhost:5001/api/posts/${postId}/comments`, {
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
      Alert.alert('Error', 'Hubo un problema al crear el comentario.');
    }
  };

  return (
    <Modal visible={isOpen} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.headerText}>{parentId ? "Nueva Respuesta" : "Nuevo Comentario"}</Text>
          <TextInput
            style={styles.textArea}
            value={content}
            onChangeText={setContent}
            placeholder={parentId ? "Escribe tu respuesta..." : "Escribe tu comentario..."}
            maxLength={280}
            multiline
          />
          <View style={styles.actions}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
              <Text style={styles.submitText}>{parentId ? "Responder" : "Comentar"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    width: '90%',
    maxWidth: 450,
  },
  headerText: {
    fontSize: 24,
    color: '#14171a',
    marginBottom: 20,
  },
  textArea: {
    height: 100,
    borderColor: '#e1e8ed',
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
    textAlignVertical: 'top',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderColor: '#1da1f2',
    borderWidth: 1,
    marginRight: 10,
  },
  cancelText: {
    color: '#1da1f2',
  },
  submitButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#1da1f2',
  },
  submitText: {
    color: 'white',
  },
});

export default NewCommentModal;
