import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { View, Text, TextInput, Button, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { AuthContext } from '../../../../../../Context/auth-context';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://open-moderately-silkworm.ngrok-free.app/api';

const CommentMenu = ({ comments, selectedVideo, onClose, onCommentSubmit }) => {
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [likedComments, setLikedComments] = useState({});
  const [visibleReplies, setVisibleReplies] = useState({});
  const { user, token, isLoading } = useContext(AuthContext);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    console.log('Estado del usuario autenticado:', user);
    if (!user) {
      console.error('Usuario no autenticado');
      return;
   }
  }, [user]);

  useEffect(() => {
    console.log('Usuario actual:', user);
    console.log('Comentarios:', comments);
  }, [user, comments]);

  useEffect(() => {
    const loadLikedComments = async () => {
      const storedLikes = await AsyncStorage.getItem('likedComments');
      setLikedComments(storedLikes ? JSON.parse(storedLikes) : {});
    };
    loadLikedComments();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('likedComments', JSON.stringify(likedComments));
  }, [likedComments]);

  const handleCommentLike = async (commentId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/comments/${commentId}/like`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const updatedLikes = response.data.likes;

      onCommentSubmit(comments.map(c =>
        c.id === commentId ? { ...c, likes: updatedLikes } : c
      ));

      setLikedComments(prevLikedComments => ({
        ...prevLikedComments,
        [commentId]: !prevLikedComments[commentId]
      }));
    } catch (error) {
      console.error("Error updating comment likes:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    console.log(`Intentando borrar comentario:`, commentId);
    try {
      const response = await axios.delete(`${API_BASE_URL}/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Respuesta del servidor:', response.data);
      onCommentSubmit(comments.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error("Error al eliminar el comentario:", error.response?.data || error.message);
    }
  };

  const handleSubmitComment = async () => {
    console.log('handleSubmitComment iniciado');
    
    if (isLoading) {
      console.log('Esperando a que se cargue la información del usuario...');
      return;
    }

    if (!newComment.trim()) {
      console.error('No se puede enviar un comentario vacío');
      return;
    }

    if (!user) {
      console.error('Usuario no autenticado');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Intentando enviar comentario...');

      const response = await axios.post(`${API_BASE_URL}/comments/${selectedVideo.id}/comments`, {
        contenido: newComment,
        parent_id: replyTo || null
      }, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Respuesta del servidor:', response.data);
      onCommentSubmit([...comments, response.data]);
      setNewComment('');
      setReplyTo(null);
    } catch (error) {
      console.error('Error al publicar comentario:', error.response?.data || error.message);
      if (error.response && error.response.status === 401) {
        console.error('Usuario no autenticado');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderComments = (parentId = null) => {
    const sortedComments = [...comments].sort((a, b) => new Date(b.fechacomentario) - new Date(a.fechacomentario));
  
    return sortedComments
      .filter(comment => comment.parent_id === parentId)
      .map(comment => {
        const hasReplies = sortedComments.some(reply => reply.parent_id === comment.id);
        const replies = sortedComments.filter(reply => reply.parent_id === comment.id);
        const areRepliesVisible = visibleReplies[comment.id];
  
        return (
          <View key={comment.id} style={styles.comment}>
            <View style={styles.commentUserInfo}>
              <Image
                source={{ uri: comment.avatar_url || "default-avatar.png" }}
                style={styles.commentUserProfileImg}
              />
              <View style={styles.commentUserDetails}>
                <Text style={styles.commentUserName}>
                  {comment.nombre || "Unknown"} {comment.apellido || "User"}
                </Text>
                <Text style={styles.commentTimestamp}>
                  {new Date(comment.fechacomentario).toLocaleString()}
                </Text>
              </View>
            </View>
            <Text style={styles.commentText}>{comment.contenido}</Text>
            <View style={styles.commentStats}>
              <TouchableOpacity onPress={() => setReplyTo(comment.id)}>
                <Text style={styles.replyButton}>Responder</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.commentLikeIcon} 
                onPress={() => handleCommentLike(comment.id)}
              >
                <FontAwesome 
                  name="heart" 
                  size={20} 
                  color={likedComments[comment.id] ? "red" : "#fff"} 
                  style={likedComments[comment.id] ? styles.liked : styles.likeIcon}
                />
                <Text style={{ color: '#fff' }}>{comment.likes}</Text>
              </TouchableOpacity>
              {user && user.id === comment.usuarioid && (
                <TouchableOpacity onPress={() => handleDeleteComment(comment.id)}>
                  <FontAwesome name="trash" size={20} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
            {hasReplies && (
              <View style={styles.replies}>
                {!areRepliesVisible ? (
                  <TouchableOpacity 
                    onPress={() => setVisibleReplies({ ...visibleReplies, [comment.id]: true })}
                  >
                    <Text style={styles.viewRepliesButton}>Ver Respuesta/s</Text>
                  </TouchableOpacity>
                ) : (
                  <View>
                    {replies.map(reply => (
                      <View key={reply.id} style={styles.commentReply}>
                        <View style={styles.commentUserInfo}>
                          <Image
                            source={{ uri: reply.avatar_url || "default-avatar.png" }}
                            style={styles.commentUserProfileImg}
                          />
                          <View style={styles.commentUserDetails}>
                            <View style={styles.replyUserName}>
                              <Text style={styles.commentUserName}>
                                {reply.nombre || 'Unknown'} {reply.apellido || 'User'}
                              </Text>
                              <FontAwesome name="play" size={12} color="#fff" style={{ marginHorizontal: 5 }} />
                              <Text style={styles.commentUserName}>
                                {comment.nombre || 'Unknown'} {comment.apellido || 'User'}
                              </Text>
                            </View>
                            <Text style={styles.commentTimestamp}>
                              {new Date(reply.fechacomentario).toLocaleString()}
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.commentText}>{reply.contenido}</Text>
                        <View style={styles.commentStats}>
                          <TouchableOpacity onPress={() => setReplyTo(reply.id)}>
                            <Text style={styles.replyButton}>Responder</Text>
                          </TouchableOpacity>
                          <TouchableOpacity 
                            style={styles.commentLikeIcon} 
                            onPress={() => handleCommentLike(reply.id)}
                          >
                            <FontAwesome 
                              name="heart" 
                              size={20} 
                              color={likedComments[reply.id] ? "red" : "#fff"} 
                              style={likedComments[reply.id] ? styles.liked : styles.likeIcon}
                            />
                            <Text style={{ color: '#fff' }}>{reply.likes}</Text>
                          </TouchableOpacity>
                          {reply.usuarioid === user.id && (
                            <TouchableOpacity onPress={() => handleDeleteComment(reply.id)}>
                              <FontAwesome name="trash" size={20} color="#fff" />
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    ))}
                    <TouchableOpacity 
                      onPress={() => setVisibleReplies({ ...visibleReplies, [comment.id]: false })}
                    >
                      <Text style={styles.hideRepliesButton}>Ocultar Respuestas</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          </View>
        );
      });
  };

  return (
    <View style={styles.commentMenu}>
      <Text style={styles.commentTitle}>Comentarios</Text>
      <ScrollView style={styles.commentSection}>
        {renderComments()}
      </ScrollView>
      <View style={styles.commentInputWrapper}>
        <TextInput
          style={styles.commentInput}
          placeholder="Escribe un comentario..."
          placeholderTextColor="#aaa"
          value={newComment}
          onChangeText={setNewComment}
        />
        <Button 
          title={isSubmitting ? "Enviando..." : "Enviar"} 
          onPress={handleSubmitComment} 
          disabled={isSubmitting}
        />
      </View>
      <TouchableOpacity onPress={onClose}>
        <Text style={styles.hideRepliesButton}>Cerrar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  commentMenu: {
    position: 'absolute',
    bottom: 0,
    left: '10%',
    transform: [{ translateX: -50 }],
    width: '103%',
    maxWidth: 450,
    height: '50%',
    backgroundColor: '#0c0c0c',
    padding: 20,
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: '#fff',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5, // Para Android
  },
  commentTitle: {
    color: '#fff',
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  commentSection: {
    width: '100%',
    marginBottom: 20,
    overflowY: 'auto', // Puedes ajustar esto si es necesario
    flexGrow: 1,
  },
  comment: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
  },
  commentUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentUserProfileImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderColor: '#fff',
    borderWidth: 1,
  },
  commentUserDetails: {
    flexGrow: 1,
  },
  commentUserName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  commentText: {
    color: '#ddd',
    marginTop: 5,
    fontSize: 14,
    paddingLeft: 3,
  },
  commentTimestamp: {
    color: '#aaa',
    fontSize: 12,
  },
  commentStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
    paddingLeft: 5,
  },
  replyButton: {
    backgroundColor: 'transparent',
    color: '#fff',
    borderWidth: 0,
    // cursor: 'pointer',
    fontSize: 12,
  },
  commentReply: {
    marginTop: 10,
    paddingLeft: 3,
  },
  replyUserName: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    fontWeight: 'bold',
    fontSize: 14,
  },
  commentLikeIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    // cursor: 'pointer',
    paddingLeft: 12,
  },
  likeIcon: {
    // cursor: 'pointer',
  },
  liked: {
    color: 'red', // Cambia a rojo cuando está likeado
  },
  replies: {
    marginTop: 10,
    paddingLeft: 20,
  },
  viewRepliesButton: {
    backgroundColor: 'transparent',
    color: 'grey',
    borderWidth: 0,
    // cursor: 'pointer',
    fontSize: 12,
  },
  commentInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  commentInput: {
    flexGrow: 1,
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#fff',
    marginRight: 10,
  },
  commentSendButton: {
    backgroundColor: '#464747',
    color: '#fff',
    borderWidth: 0,
    borderRadius: 20,
    padding: 10,
    // cursor: 'pointer',
    fontWeight: 'bold',
  },
  commentSendButtonHover: {
    backgroundColor: '#fff',
    color: '#000',
  },
  hideRepliesButton: {
    fontSize: 12,
    color: '#fff',
    borderWidth: 0,
    padding: 5,
    marginTop: 5,
    // cursor: 'pointer',
    backgroundColor: '#0c0c0c',
  },
});

export default CommentMenu;
