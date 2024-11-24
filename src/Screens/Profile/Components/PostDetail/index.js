import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Modal, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import NewCommentModal from '../NewCommentModal';  // Assuming it's already refactored to React Native
import Icon from 'react-native-vector-icons/Ionicons'; // You can use vector icons for React Native
import AsyncStorage from '@react-native-async-storage/async-storage';

const PostDetail = ({ post, onClose, onDelete, onLike, likedPosts, fetchPosts }) => {
  const [comments, setComments] = useState([]);
  const [localPost, setLocalPost] = useState(post);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState(null);
  const [likedComments, setLikedComments] = useState({});

  useEffect(() => {
    if (post && post.post_id) {
      fetchComments();
      setLocalPost(post);
    }
  }, [post]);

  const fetchComments = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(
        `https://open-moderately-silkworm.ngrok-free.app/api/posts/${post.post_id}/comments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleLocalLike = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.put(
        `https://open-moderately-silkworm.ngrok-free.app/api/posts/${localPost.post_id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Actualiza el estado del post basándote en la respuesta del servidor.
      setLocalPost((prevPost) => ({
        ...prevPost,
        likes: response.data.likes, // Actualiza con los likes del servidor.
      }));
  
      // Si es necesario, actualiza también el estado global.
      if (onLike) onLike(localPost.post_id);
    } catch (error) {
      console.error('Error al likear el post:', error);
    }
  };

  const handleCommentLike = async (commentId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.put(
        `https://open-moderately-silkworm.ngrok-free.app/api/posts/${commentId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments(comments.map(comment => 
        comment.comment_id === commentId 
          ? { ...comment, likes: response.data.likes }
          : comment
      ));
      setLikedComments(prev => ({ ...prev, [commentId]: !prev[commentId] }));
    } catch (error) {
      console.error('Error al likear el comentario:', error);
    }
  };

  const handleCommentCreated = (newComment) => {
    setComments(prevComments => [...prevComments, newComment]);
    fetchComments(); // Refetch to ensure we have the latest data
  };

  const handleCommentDelete = async (commentId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.delete(`https://open-moderately-silkworm.ngrok-free.app/api/posts/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setComments(prevComments => prevComments.filter(comment => comment.comment_id !== commentId));
    } catch (error) {
      console.error('Error al eliminar el comentario:', error);
    }
  };

  const convertToLocalTime = (utcDateString) => {
    const date = new Date(utcDateString);
    return date.toLocaleString("es-AR", {
      timeZone: "America/Argentina/Buenos_Aires",
    });
  };

  const renderComments = (parentId = null, depth = 0) => {
    return comments
      .filter(comment => comment.parent_id === parentId)
      .map((comment) => (
        <View key={comment.comment_id} style={[styles.comment, { marginLeft: depth * 20 }]}>
          <View style={styles.commentHeader}>
            <Image
              source={{ uri: comment.avatar_url || 'default-avatar.png' }}
              style={styles.userAvatar}
            />
            <View style={styles.commentInfo}>
              <Text style={styles.userName}>{comment.nombre} {comment.apellido}</Text>
              <Text>{convertToLocalTime(comment.fechapublicacion)}</Text>
            </View>
          </View>
          <Text style={styles.commentContent}>{comment.contenido}</Text>
          <View style={styles.commentFooter}>
            <TouchableOpacity
              onPress={() => handleCommentLike(comment.comment_id)}
              style={[styles.actionButton, likedComments[comment.comment_id] && styles.likedButton]}
            >
              <Icon name="heart" size={20} color={likedComments[comment.comment_id] ? '#e0245e' : '#657786'} />
              <Text>{comment.likes || 0}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setSelectedParentId(comment.comment_id);
                setIsCommentModalOpen(true);
              }}
              style={styles.actionButton}
            >
              <Icon name="chatbubble" size={20} color="#657786" />
              <Text>{comments.filter(c => c.parent_id === comment.comment_id).length}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleCommentDelete(comment.comment_id)}
              style={styles.deleteButton}
            >
              <Icon name="trash" size={20} color="#888" />
            </TouchableOpacity>
          </View>
          {renderComments(comment.comment_id, depth + 1)}
        </View>
      ));
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Detalle del Post</Text>
        </View>

        <View style={styles.originalPost}>
          <View style={styles.postHeader}>
            <Image
              source={{ uri: localPost.avatar_url || 'default-avatar.png' }}
              style={styles.userAvatar}
            />
            <View style={styles.postInfo}>
              <Text style={styles.userName}>{localPost.nombre || "Unknown"} {localPost.apellido || "User"}</Text>
              <Text>{convertToLocalTime(localPost.fechapublicacion)}</Text>
            </View>
            <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
              <Icon name="trash" size={20} color="#888" />
            </TouchableOpacity>
          </View>

          <Text style={styles.postContent}>{localPost.contenido}</Text>

          <View style={styles.postFooter}>
            <TouchableOpacity
              onPress={handleLocalLike}
              style={[styles.actionButton, likedPosts[localPost.post_id] && styles.likedButton]}
            >
              <Icon name="heart" size={20} color={likedPosts[localPost.post_id] ? '#e0245e' : '#657786'} />
              <Text>{localPost.likes || 0}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setSelectedParentId(localPost.post_id);
                setIsCommentModalOpen(true);
              }}
              style={styles.actionButton}
            >
              <Icon name="chatbubble" size={20} color="#657786" />
              <Text>{comments.filter(c => c.parent_id === localPost.post_id).length}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.commentsSection}>
          <Text style={styles.commentHeaderText}>Comentarios</Text>
          {renderComments(localPost.post_id)}
        </ScrollView>

        <Modal visible={isCommentModalOpen} onRequestClose={() => setIsCommentModalOpen(false)}>
          <NewCommentModal
            isOpen={isCommentModalOpen}
            onClose={() => {
              setIsCommentModalOpen(false);
              setSelectedParentId(null);
            }}
            onCommentCreated={handleCommentCreated}
            postId={localPost.post_id}
            parentId={selectedParentId}
          />
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'fixed',
    top: -300,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  content: {
    backgroundColor: 'white',
    width: 400, // Ancho fijo
    height: 850, // Alto fijo
    padding: 20,
    borderRadius: 10,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
    overflow: 'hidden', // Asegura que el contenido no desborde
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginTop: 50,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
    marginTop: 50,
  },
  originalPost: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 20,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 15,
  },
  postInfo: {
    flexGrow: 1,
  },
  userName: {
    fontWeight: 'bold',
    color: '#333',
  },
  postContent: {
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  postFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    color: '#657786',
    fontSize: 14,
    marginRight: 10,
    marginBottom: 25,
  },
  likedButton: {
    color: '#e0245e',
  },
  commentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deleteButton: {
    marginLeft: 'auto',
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentContent: {
    marginBottom: 15,
    fontSize: 14,
    color: '#333',
  },
  commentsSection: {
    marginTop: 20,
  },
  commentHeaderText: {
    marginBottom: 20,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PostDetail;
