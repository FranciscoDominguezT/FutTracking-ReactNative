import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../../../../../Context/auth-context'; // Ajusta la ruta a la correcta
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://open-moderately-silkworm.ngrok-free.app/api';

const CommentSection = ({ comments, selectedVideo, onClose, onCommentSubmit }) => {
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [likedComments, setLikedComments] = useState({});
  const [visibleReplies, setVisibleReplies] = useState({});
  const { user, token, isLoading } = useContext(AuthContext);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    console.log('Estado del usuario autenticado:', user);
  }, [user]);

  useEffect(() => {
    const loadLikesFromStorage = async () => {
      try {
        const storedLikes = await AsyncStorage.getItem('likedComments');
        if (storedLikes) {
          setLikedComments(JSON.parse(storedLikes));
        }
      } catch (error) {
        console.error('Error al cargar los likes desde AsyncStorage:', error);
      }
    };
    loadLikesFromStorage();
  }, []);

  useEffect(() => {
    const saveLikesToStorage = async () => {
      try {
        await AsyncStorage.setItem('likedComments', JSON.stringify(likedComments));
      } catch (error) {
        console.error('Error al guardar los likes en AsyncStorage:', error);
      }
    };
    saveLikesToStorage();
  }, [likedComments]);

  const handleCommentLike = async (commentId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/comments/${commentId}/like`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const updatedLikes = response.data.likes;
      onCommentSubmit(comments.map(c => (c.id === commentId ? { ...c, likes: updatedLikes } : c)));
      setLikedComments(prevLikedComments => ({
        ...prevLikedComments,
        [commentId]: !prevLikedComments[commentId]
      }));
    } catch (error) {
      console.error("Error updating comment likes:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      onCommentSubmit(comments.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error("Error al eliminar el comentario:", error.response?.data || error.message);
    }
  };

  const handleSubmitComment = async () => {
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
      const response = await axios.post(`${API_BASE_URL}/comments/${selectedVideo.usuarioid}/comments`, {
        contenido: newComment,
        parent_id: replyTo || null
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      onCommentSubmit([...comments, response.data]);
      setNewComment('');
      setReplyTo(null);
    } catch (error) {
      console.error('Error al publicar comentario:', error.response?.data || error.message);
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
                <Text style={styles.commentUserName}>{comment.nombre || "Unknown"} {comment.apellido || "User"}</Text>
                <Text style={styles.commentTimestamp}>{new Date(comment.fechacomentario).toLocaleString()}</Text>
              </View>
            </View>
            <Text style={styles.commentText}>{comment.contenido}</Text>
            <View style={styles.commentStats}>
              <TouchableOpacity onPress={() => setReplyTo(comment.id)}>
                <Text style={styles.replyButton}>Responder</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleCommentLike(comment.id)}>
                <Text style={[styles.likeButton, likedComments[comment.id] ? styles.liked : null]}>❤️ {comment.likes}</Text>
              </TouchableOpacity>
              {user && user.id === comment.usuarioid && (
                <TouchableOpacity onPress={() => handleDeleteComment(comment.id)}>
                  <Text style={styles.deleteButton}>🗑</Text>
                </TouchableOpacity>
              )}
            </View>
            {hasReplies && (
              <View>
                {!areRepliesVisible ? (
                  <TouchableOpacity onPress={() => setVisibleReplies({ ...visibleReplies, [comment.id]: true })}>
                    <Text style={styles.viewRepliesButton}>Ver Respuesta/s</Text>
                  </TouchableOpacity>
                ) : (
                  <View>
                    {replies.map(reply => (
                      <View key={reply.id} style={styles.commentReply}>
                        <Image
                          source={{ uri: reply.avatar_url || "default-avatar.png" }}
                          style={styles.commentUserProfileImg}
                        />
                        <Text style={styles.replyUserName}>
                          {reply.nombre || 'Unknown'} {reply.apellido || 'User'}
                        </Text>
                        <Text style={styles.commentTimestamp}>{new Date(reply.fechacomentario).toLocaleString()}</Text>
                        <Text style={styles.commentText}>{reply.contenido}</Text>
                        <View style={styles.commentStats}>
                          <TouchableOpacity onPress={() => setReplyTo(reply.id)}>
                            <Text style={styles.replyButton}>Responder</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => handleCommentLike(reply.id)}>
                            <Text style={[styles.likeButton, likedComments[reply.id] ? styles.liked : null]}>❤️ {reply.likes}</Text>
                          </TouchableOpacity>
                          {reply.usuarioid === user.id && (
                            <TouchableOpacity onPress={() => handleDeleteComment(reply.id)}>
                              <Text style={styles.deleteButton}>🗑</Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    ))}
                    <TouchableOpacity onPress={() => setVisibleReplies({ ...visibleReplies, [comment.id]: false })}>
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
          value={newComment}
          onChangeText={setNewComment}
          placeholder={replyTo !== null ? "Responde al comentario..." : "Escribí tu respuesta"}
          editable={!isLoading && !isSubmitting}
        />
        <TouchableOpacity style={styles.commentSendButton} onPress={handleSubmitComment} disabled={isLoading || isSubmitting || !newComment.trim()}>
          <Text>{isSubmitting ? 'Enviando...' : 'Enviar'}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
        <Text style={styles.cancelButtonText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cancelButton: {
    backgroundColor: 'transparent',
    borderColor: '#fff',
    borderWidth: 2,
    borderRadius: 20,
    padding: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  commentMenu: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '40%',
    backgroundColor: '#0c0c0c',
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  commentTitle: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  commentSection: {
    flex: 1,
    marginBottom: 20,
  },
  comment: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#1c1c1c',
  },
  commentUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentUserProfileImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  commentUserDetails: {
    marginLeft: 10,
  },
  commentUserName: {
    color: '#fff',
    fontWeight: 'bold',
  },
  commentTimestamp: {
    color: '#ccc',
    fontSize: 12,
  },
  commentText: {
    color: '#fff',
    marginVertical: 5,
  },
  commentStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  replyButton: {
    color: '#007BFF',
    fontSize: 12,
  },
  likeButton: {
    color: '#fff',
    fontSize: 12,
  },
  liked: {
    color: 'red',
  },
  deleteButton: {
    color: 'red',
    fontSize: 12,
  },
  commentReply: {
    paddingLeft: 20,
    borderLeftColor: '#007BFF',
    borderLeftWidth: 2,
  },
  viewRepliesButton: {
    color: '#007BFF',
    fontSize: 12,
    marginTop: 5,
  },
  hideRepliesButton: {
    color: '#007BFF',
    fontSize: 12,
    marginTop: 5,
  },
  commentInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#333',
    borderRadius: 20,
    paddingHorizontal: 10,
    color: '#fff',
  },
  commentSendButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 20,
  },
});

export default CommentSection;
