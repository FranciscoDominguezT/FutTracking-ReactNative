import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';
import { FaHeart, FaTrash } from "react-icons/fa"; // puedes reemplazarlos con otros íconos de react-native-vector-icons
import { AuthContext } from '../../../../../../Context/auth-context';

const API_BASE_URL = 'http://localhost:5001/api';

const CommentSection = ({ comments, selectedVideo, onClose, onCommentSubmit }) => {
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [likedComments, setLikedComments] = useState({});
  const [visibleReplies, setVisibleReplies] = useState({});
  const { user, token, isLoading } = useContext(AuthContext);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const storedLikes = JSON.parse(localStorage.getItem('likedComments')) || {};
    setLikedComments(storedLikes);
  }, []);

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
    try {
      await axios.delete(`${API_BASE_URL}/comments/${commentId}`, {
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
        const userId = user?.id;

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
                <Text style={styles.commentTimestamp}>{new Date(comment.fechacomentario).toLocaleString()}</Text>
              </View>
            </View>
            <Text style={styles.commentText}>{comment.contenido}</Text>
            <View style={styles.commentStats}>
              <TouchableOpacity onPress={() => setReplyTo(comment.id)}>
                <Text style={styles.replyButton}>Responder</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.commentLikeIcon} onPress={() => handleCommentLike(comment.id)}>
                <FaHeart color={likedComments[comment.id] ? "red" : "gray"} />
                <Text>{comment.likes}</Text>
              </TouchableOpacity>
              {user && userId === comment.usuarioid && (
                <TouchableOpacity onPress={() => handleDeleteComment(comment.id)}>
                  <FaTrash />
                </TouchableOpacity>
              )}
            </View>
            {hasReplies && (
              <View>
                {!areRepliesVisible && (
                  <TouchableOpacity onPress={() => setVisibleReplies({ ...visibleReplies, [comment.id]: true })}>
                    <Text style={styles.viewRepliesButton}>Ver Respuesta/s</Text>
                  </TouchableOpacity>
                )}
                {areRepliesVisible && (
                  <View style={styles.replies}>
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
        <TouchableOpacity 
          style={styles.commentSendButton} 
          onPress={handleSubmitComment}
          disabled={isLoading || isSubmitting || !newComment.trim()}
        >
          <Text>{isSubmitting ? 'Enviando...' : 'Enviar'}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
        <Text>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    commentMenu: {
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      borderRadius: 10,
      padding: 20,
      margin: 10,
      maxHeight: '80%',
    },
    commentTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'white',
      marginBottom: 20,
      textAlign: 'center',
    },
    commentSection: {
      maxHeight: 300,
      marginBottom: 20,
    },
    comment: {
      marginBottom: 10,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      padding: 10,
      borderRadius: 10,
    },
    commentUserInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 5,
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
      flex: 1,
    },
    commentUserName: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
    commentTimestamp: {
      color: 'gray',
      fontSize: 12,
    },
    commentText: {
      color: '#fff',
      marginTop: 5,
      fontSize: 14,
    },
    commentStats: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
      justifyContent: 'space-between',
    },
    replyButton: {
      color: 'cyan',
      fontSize: 14,
    },
    commentLikeIcon: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 15,
    },
    viewRepliesButton: {
      color: 'cyan',
      fontSize: 14,
      marginTop: 5,
    },
    hideRepliesButton: {
      color: 'cyan',
      fontSize: 14,
      marginTop: 5,
    },
    replies: {
      marginTop: 10,
      paddingLeft: 20,
    },
    commentReply: {
      marginBottom: 10,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      padding: 10,
      borderRadius: 10,
    },
    replyUserName: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 14,
    },
    commentInputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor: 'gray',
      paddingVertical: 10,
    },
    commentInput: {
      flex: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      color: 'white',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 10,
      marginRight: 10,
    },
    commentSendButton: {
      backgroundColor: '#007AFF',
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 5,
    },
    cancelButton: {
      alignItems: 'center',
      marginTop: 10,
    },
  });
  

export default CommentSection;
