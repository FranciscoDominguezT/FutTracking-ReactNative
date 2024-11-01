import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Modal, Alert } from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/FontAwesome";
import NewCommentModal from "../NewCommentModal";

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
      const response = await axios.get(
        `http://localhost:5001/api/posts/${post.post_id}/comments`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleLocalLike = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5001/api/posts/${localPost.post_id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setLocalPost(prevPost => ({
        ...prevPost,
        likes: response.data.likes
      }));

      onLike(localPost.post_id);
    } catch (error) {
      console.error("Error al likear el post:", error);
    }
  };

  const handleCommentLike = async (commentId) => {
    try {
      const response = await axios.put(
        `http://localhost:5001/api/posts/${commentId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
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
      console.error("Error al likear el comentario:", error);
    }
  };

  const handleLocalDelete = async () => {
    try {
      await onDelete(localPost.post_id);
      onClose();
    } catch (error) {
      console.error("Error al eliminar el post:", error);
    }
  };

  const handleCommentCreated = (newComment) => {
    setComments(prevComments => [...prevComments, newComment]);
    fetchComments(); // Refetch to ensure we have the latest data
  };

  const handleCommentDelete = async (commentId) => {
    try {
      await axios.delete(`http://localhost:5001/api/posts/${commentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setComments(prevComments => prevComments.filter(comment => comment.comment_id !== commentId));
    } catch (error) {
      console.error("Error al eliminar el comentario:", error);
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
        <View 
          key={comment.comment_id} 
          style={[styles.comment, { marginLeft: depth * 20 }]}
        >
          <View style={styles.commentHeader}>
            <Image
              source={{ uri: comment.avatar_url || "default-avatar.png" }}
              style={styles.userAvatar}
            />
            <View style={styles.commentInfo}>
              <Text style={styles.commentUser}>{comment.nombre} {comment.apellido}</Text>
              <Text>{convertToLocalTime(comment.fechapublicacion)}</Text>
            </View>
          </View>
          <Text style={styles.commentContent}>{comment.contenido}</Text>
          <View style={styles.commentFooter}>
            <TouchableOpacity onPress={() => handleCommentLike(comment.comment_id)}>
              <Icon name="heart" size={16} color={likedComments[comment.comment_id] ? "#e0245e" : "#657786"} /> 
              <Text>{comment.likes || 0}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              setSelectedParentId(comment.comment_id);
              setIsCommentModalOpen(true);
            }}>
              <Icon name="comment" size={16} color="#657786" />
              <Text>{comments.filter(c => c.parent_id === comment.comment_id).length}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleCommentDelete(comment.comment_id)}>
              <Icon name="trash" size={16} color="#888" />
            </TouchableOpacity>
          </View>
          {renderComments(comment.comment_id, depth + 1)}
        </View>
      ));
  };

  return (
    <Modal transparent={true} visible={true}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Icon name="arrow-left" size={20} color="black" />
            </TouchableOpacity>
            <Text style={styles.title}>Detalle del Post</Text>
          </View>
          <ScrollView style={styles.content}>
            <View style={styles.post}>
              <View style={styles.postHeader}>
                <Image
                  source={{ uri: localPost.avatar_url || "default-avatar.png" }}
                  style={styles.userAvatar}
                />
                <View style={styles.postInfo}>
                  <Text>{localPost.nombre || "Unknown"} {localPost.apellido || "User"}</Text>
                  <Text>{convertToLocalTime(localPost.fechapublicacion)}</Text>
                </View>
                <TouchableOpacity onPress={handleLocalDelete}>
                  <Icon name="trash" size={16} color="#888" />
                </TouchableOpacity>
              </View>
              <Text style={styles.postContent}>{localPost.contenido}</Text>
              <View style={styles.postFooter}>
                <TouchableOpacity onPress={handleLocalLike}>
                  <Icon name="heart" size={16} color={likedPosts[localPost.post_id] ? "#e0245e" : "#657786"} />
                  <Text>{localPost.likes || 0}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  setSelectedParentId(localPost.post_id);
                  setIsCommentModalOpen(true);
                }}>
                  <Icon name="comment" size={16} color="#657786" />
                  <Text>{comments.length}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.commentsTitle}>Comentarios</Text>
            {renderComments(localPost.post_id)}
          </ScrollView>
        </View>
        {isCommentModalOpen && (
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
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  container: {
    backgroundColor: "white",
    padding: 20,
    width: "90%",
    maxWidth: 450,
    maxHeight: "90%",
    borderRadius: 10
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "#333"
  },
  content: {
    flex: 1
  },
  post: {
    paddingBottom: 20,
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 8
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15
  },
  postInfo: {
    flex: 1
  },
  postFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10
  },
  postContent: {
    fontSize: 16,
    color: "#333"
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 10
  },
  comment: {
    backgroundColor: "#f1f1f1",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5
  },
  commentInfo: {
    flex: 1,
    marginLeft: 10
  },
  commentContent: {
    fontSize: 14,
    color: "#333"
  },
  commentFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5
  }
});

export default PostDetail;
