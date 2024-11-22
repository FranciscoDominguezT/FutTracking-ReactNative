import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Alert, Text, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import PostDetail from '../PostDetail';
import NewCommentModal from '../NewCommentModal';
import NewTweetModal from '../NewTweetModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Posteos = () => {
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  useEffect(() => {
    const initializeData = async () => {
      await loadLikedPosts();
      await fetchPosts();
    };
    
    initializeData();
  }, []);

  const fetchPosts = async () => {
    // Obtener el token desde AsyncStorage
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      console.error('Token no encontrado');
      return;
    }
  
    // Realizar la solicitud a la API
    const response = await fetch('https://open-moderately-silkworm.ngrok-free.app/api/posts', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  
    console.log('Estado de la respuesta:', response.status);
    console.log('Encabezados:', response.headers.map); // Muestra los encabezados de forma legible
  
    // Validar si la solicitud fue exitosa
    if (!response.ok) {
      console.error('Error en la solicitud:', response.status, response.statusText);
      return;
    }
  
    // Intentar analizar la respuesta como JSON
    try {
      const data = await response.json();
      console.log('Posts cargados:', data);
      setPosts(data);
    } catch (error) {
      console.error('Error al parsear la respuesta:', error);
    }
  };
  
  

  const loadLikedPosts = async () => {
    try {
      const storedLikes = await AsyncStorage.getItem('likedPosts');
      if (storedLikes) {
        setLikedPosts(JSON.parse(storedLikes));
      }
    } catch (error) {
      console.error('Error loading liked posts:', error);
      setLikedPosts({});
    }
  };

  const saveLikedPosts = (newLikedPosts) => {
    AsyncStorage.setItem('likedPosts', JSON.stringify(newLikedPosts));
  };

  const handleLike = async (postId) => {
    try {
      const isLiked = likedPosts[postId];
      const token = await AsyncStorage.getItem('token');

      // Realizar la solicitud con axios
      const response = await axios.put(`https://open-moderately-silkworm.ngrok-free.app/api/posts/${postId}/like`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;

      // Actualizar los likes del post específico
      setPosts(
        posts.map((post) =>
          post.post_id === postId ? { ...post, likes: data.likes } : post
        )
      );

      // Actualizar el estado de likedPosts
      const newLikedPosts = {
        ...likedPosts,
        [postId]: !isLiked,
      };

      setLikedPosts(newLikedPosts);
      saveLikedPosts(newLikedPosts);
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };

  const handleDeleteTweet = async (postId) => {
    if (!postId || typeof postId !== 'number') {
      console.error('Error: postId no está definido o es inválido.', postId);
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`https://open-moderately-silkworm.ngrok-free.app/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setPosts((prevPosts) =>
          prevPosts.filter((post) => post.post_id !== postId)
        );
        setSelectedPost(null);
        setIsConfirmModalOpen(false);
      } else {
        const errorText = await response.text();
        console.error('Error al eliminar el post. Respuesta:', errorText);
      }
    } catch (error) {
      console.error('Error al eliminar el tweet:', error);
    }
  };

  const openConfirmModal = (postId) => {
    console.log('Abriendo modal para el post:', postId);
    setPostToDelete(postId);
    setIsConfirmModalOpen(true);
  };

  const handleTweetCreated = (newTweet) => {
    setPosts([{ ...newTweet, post_id: newTweet.id }, ...posts]);
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
  };

  const handleCommentClick = (postId) => {
    setSelectedPostId(postId);
    setIsCommentModalOpen(true);
  };

  const handleCommentCreated = (newComment) => {
    setPosts(
      posts.map((post) =>
        post.post_id === newComment.posteoid
          ? { ...post, count: (post.count || 0) + 1 }
          : post
      )
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.newTweetButton} onPress={() => setIsModalOpen(true)}>
        <FontAwesome name="plus" size={24} color="white" />
      </TouchableOpacity>
      <NewTweetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTweetCreated={handleTweetCreated}
      />

      <FlatList
        data={posts}
        keyExtractor={(item) => item.post_id.toString()}
        contentContainerStyle={styles.postsContainer}
        ListEmptyComponent={() => (
          <View style={styles.noPostsMessage}>
            <Text>No hay posteos cargados aún.</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.post}
            onPress={() => handlePostClick(item)}
          >
            <View style={styles.postHeader}>
              <Image
                source={{ uri: item.avatar_url || 'default-avatar.png' }}
                style={styles.userAvatar}
              />
              <View style={styles.postHeaderDetails}>
                <Text style={styles.userName}>{item.nombre || 'Unknown'} {item.apellido || 'User'}</Text>
                <Text style={styles.postDate}>{new Date(item.fechapublicacion).toLocaleString()}</Text>
              </View>
              <TouchableOpacity onPress={(event) => openConfirmModal(item.post_id)}>
                <FontAwesome name="trash" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <Text style={styles.postContent}>{item.contenido}</Text>
            <View style={styles.postFooter}>
              <TouchableOpacity
                style={[styles.likeButton, likedPosts[item.post_id] && styles.likedButton]}
                onPress={() => handleLike(item.post_id)}
              >
                <FontAwesome name="heart" size={18} color={likedPosts[item.post_id] ? 'red' : '#333'} />
                <Text style={styles.likeCount}>{item.likes || 0}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.commentButton}
                onPress={() => handleCommentClick(item.post_id)}
              >
                <FontAwesome name="comment" size={18} color="#333" />
                <Text style={styles.commentCount}>{parseInt(item.count, 10) || 0}</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />

      {selectedPost && (
        <PostDetail
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onDelete={handleDeleteTweet}
          onLike={handleLike}
          likedPosts={likedPosts}
          fetchPosts={fetchPosts}
        />
      )}

      {isCommentModalOpen && selectedPostId && (
        <NewCommentModal
          isOpen={isCommentModalOpen}
          onClose={() => setIsCommentModalOpen(false)}
          postId={selectedPostId}
          onCommentCreated={handleCommentCreated}
        />
      )}

      {isConfirmModalOpen && (
        <View style={styles.confirmModal}>
          <View style={styles.confirmModalContent}>
            <Text style={styles.confirmModalTitle}>¿Estás seguro de que deseas eliminar este post?</Text>
            <View style={styles.confirmModalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsConfirmModalOpen(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteTweet(postToDelete)}
              >
                <Text style={styles.deleteButtonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
  },
  newTweetButton: {
    backgroundColor: '#157446',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    right: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  postsContainer: {
    paddingBottom: 80,
  },
  post: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.00,
    elevation: 1,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  postHeaderDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  postDate: {
    fontSize: 14,
    color: '#666',
  },
  postContent: {
    fontSize: 16,
    lineHeight: 22,
    color: '#333',
    marginBottom: 12,
  },
  postFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  likedButton: {
    color: 'red',
  },
  likeCount: {
    fontSize: 14,
    color: '#333',
    marginLeft: 4,
  },
  commentButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentCount: {
    fontSize: 14,
    color: '#333',
    marginLeft: 4,
  },
  noPostsMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  confirmModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmModalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '80%',
  },
  confirmModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  confirmModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  cancelButton: {
    backgroundColor: '#ddd',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#333',
  },
  deleteButton: {
    backgroundColor: '#157446',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: '#fff',
  },
});

export default Posteos;