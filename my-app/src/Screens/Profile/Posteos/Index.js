import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Button,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Utilizando Ionicons para los iconos
import NewTweetModal from "../NewTweetModal";
import PostDetail from "../PostDetail";
import NewCommentModal from "../NewCommentModal";
import axios from "axios";

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
    fetchPosts();
    loadLikedPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5001/api/posts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log("Posts cargados:", data);
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const loadLikedPosts = () => {
    const storedLikes = localStorage.getItem("likedPosts");
    if (storedLikes) {
      setLikedPosts(JSON.parse(storedLikes));
    }
  };

  const saveLikedPosts = (newLikedPosts) => {
    localStorage.setItem("likedPosts", JSON.stringify(newLikedPosts));
  };

  const handleLike = async (event, postId) => {
    event.stopPropagation();
    try {
      const isLiked = likedPosts[postId];
      const token = localStorage.getItem('token');

      // Realizar la solicitud con axios
      const response = await axios.put(
        `http://localhost:5001/api/posts/${postId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;

      setPosts(
        posts.map((post) =>
          post.post_id === postId ? { ...post, likes: data.likes } : post
        )
      );

      const newLikedPosts = {
        ...likedPosts,
        [postId]: !isLiked,
      };

      setLikedPosts(newLikedPosts);
      saveLikedPosts(newLikedPosts);
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  const handleDeleteTweet = async (postId) => {
    if (!postId || typeof postId !== "number") {
      console.error("Error: postId no está definido o es inválido.", postId);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/api/posts/${postId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPosts((prevPosts) =>
          prevPosts.filter((post) => post.post_id !== postId)
        );
        setSelectedPost(null);
        setIsConfirmModalOpen(false);
      } else {
        const errorText = await response.text();
        console.error("Error al eliminar el post. Respuesta:", errorText);
      }
    } catch (error) {
      console.error("Error al eliminar el tweet:", error);
    }
  };

  const openConfirmModal = (event, postId) => {
    event.stopPropagation();
    setPostToDelete(postId);
    setIsConfirmModalOpen(true);
  };

  const handleTweetCreated = (newTweet) => {
    setPosts((prevPosts) => [{ ...newTweet, post_id: newTweet.id }, ...prevPosts]);
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
  };

  const handleCommentClick = (event, postId) => {
    event.stopPropagation();
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
    <View style={styles.posteosContainer}>
      <Button title="Nuevo Tweet" onPress={() => setIsModalOpen(true)} />
      <NewTweetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTweetCreated={handleTweetCreated}
      />

      <ScrollView style={styles.postsScrollContainer}>
        {posts.length === 0 ? (
          <Text style={styles.noPostsMessage}>No hay posteos cargados aún.</Text>
        ) : (
          posts.map((post) => (
            <View
              key={post.post_id}
              style={styles.post}
              onTouchEnd={() => handlePostClick(post)}
            >
              <View style={styles.postHeader}>
                <Image
                  source={{ uri: post.avatar_url || "default-avatar.png" }}
                  style={styles.userAvatar}
                />
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>
                    {post.nombre || "Unknown"} {post.apellido || "User"}
                  </Text>
                  <Text style={styles.postDate}>
                    {new Date(post.fechapublicacion).toLocaleString()}
                  </Text>
                </View>
                <TouchableOpacity onPress={(event) => openConfirmModal(event, post.post_id)}>
                  <Ionicons name="trash" size={24} color="black" />
                </TouchableOpacity>
              </View>
              <Text style={styles.postContent}>{post.contenido}</Text>
              <View style={styles.postFooter}>
                <TouchableOpacity onPress={(event) => handleLike(event, post.post_id)}>
                  <Ionicons
                    name={likedPosts[post.post_id] ? "heart" : "heart-outline"}
                    size={24}
                    color={likedPosts[post.post_id] ? "#e0245e" : "#657786"}
                  />
                  <Text>{post.likes || 0}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={(event) => handleCommentClick(event, post.post_id)}>
                  <Ionicons name="chatbubble-outline" size={24} color="#657786" />
                  <Text>{parseInt(post.count, 10) || 0}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

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
          <Text>¿Estás seguro de que deseas eliminar este post?</Text>
          <View style={styles.confirmModalButtons}>
            <Button title="Cancelar" onPress={() => setIsConfirmModalOpen(false)} />
            <Button title="Eliminar" onPress={() => handleDeleteTweet(postToDelete)} />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  posteosContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  postsScrollContainer: {
    height: "80%", // Definir altura de la sección scrollable
  },
  post: {
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    padding: 10,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  postDate: {
    fontSize: 14,
    color: "#657786",
  },
  postContent: {
    marginBottom: 10,
    fontSize: 16,
  },
  postFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  noPostsMessage: {
    textAlign: "center",
    color: "#657786",
  },
  confirmModal: {
    position: "absolute",
    top: "40%",
    left: "10%",
    right: "10%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
    elevation: 5,
  },
  confirmModalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});

export default Posteos;
