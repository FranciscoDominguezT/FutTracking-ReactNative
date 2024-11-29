import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, Modal, ActivityIndicator } from "react-native";
import { FontAwesome } from '@expo/vector-icons'; // Para reemplazar FaHeart y FaComment
import PlayerPostDetail from "../PlayerPostDetail"; // Asegúrate de importar correctamente
import NewCommentModal from "../NewCommentModal"; // Asegúrate de importar correctamente
import axios from "axios";

const PlayerPosteos = ({ userId }) => {
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState({});
  const [selectedPost, setSelectedPost] = useState(null);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  useEffect(() => {
    fetchPosts();
    loadLikedPosts();
  }, [userId]);

  const fetchPosts = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(`https://open-moderately-silkworm.ngrok-free.app/api/posts/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const loadLikedPosts = async () => {
    const storedLikes = await AsyncStorage.getItem("likedPosts");
    if (storedLikes) {
      setLikedPosts(JSON.parse(storedLikes));
    }
  };

  const saveLikedPosts = async (newLikedPosts) => {
    await AsyncStorage.setItem("likedPosts", JSON.stringify(newLikedPosts));
  };

  const handleLike = async (event, postId) => {
    event.stopPropagation();
    try {
      const isLiked = likedPosts[postId];
      const token = await AsyncStorage.getItem('token');

      const response = await axios.put(
        `https://open-moderately-silkworm.ngrok-free.app/api/posts/${postId}/like`,
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
    <View style={styles.container}>
      {posts.length === 0 ? (
        <Text style={styles.noPostsMessage}>
          Este usuario aún no tiene posteos.
        </Text>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.post_id.toString()}
          renderItem={({ item: post }) => (
            <TouchableOpacity
              style={styles.post}
              onPress={() => handlePostClick(post)}
              activeOpacity={0.8}
            >
              <View style={styles.postHeader}>
                <Image
                  source={{ uri: post.avatar_url || "default-avatar.png" }}
                  style={styles.userAvatar}
                />
                <View>
                  <Text style={styles.userName}>
                    {post.nombre || "Unknown"} {post.apellido || "User"}
                  </Text>
                  <Text style={styles.postDate}>
                    {new Date(post.fechapublicacion).toLocaleString()}
                  </Text>
                </View>
              </View>
              <Text style={styles.postContent}>{post.contenido}</Text>
              <View style={styles.postFooter}>
                <TouchableOpacity
                  style={[styles.actionButton, likedPosts[post.post_id] && styles.liked]}
                  onPress={(event) => handleLike(event, post.post_id)}
                >
                  <FontAwesome name="heart" size={18} color={likedPosts[post.post_id] ? "red" : "#888"} />{" "}
                  {post.likes || 0}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={(event) => handleCommentClick(event, post.post_id)}
                >
                  <FontAwesome name="comment" size={18} color="#888" />{" "}
                  {parseInt(post.count, 10) || 0}
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {selectedPost && (
        <Modal
          visible={!!selectedPost}
          animationType="slide"
          onRequestClose={() => setSelectedPost(null)}
        >
          <PlayerPostDetail
            post={selectedPost}
            onClose={() => setSelectedPost(null)}
            onLike={handleLike}
            likedPosts={likedPosts}
            fetchPosts={fetchPosts}
            isOwnProfile={false}
          />
        </Modal>
      )}

      {isCommentModalOpen && selectedPostId && (
        <Modal
          visible={isCommentModalOpen}
          animationType="slide"
          onRequestClose={() => setIsCommentModalOpen(false)}
        >
          <NewCommentModal
            isOpen={isCommentModalOpen}
            onClose={() => setIsCommentModalOpen(false)}
            postId={selectedPostId}
            onCommentCreated={handleCommentCreated}
          />
        </Modal>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#black',
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
    top: 325, // Ajusta este valor para cambiar la posición vertical
    left: 315,
    zIndex: 9999,
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
    shadowOpacity: 0.10,
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
    color: '#657786',
    marginLeft: 4,
  },
  commentButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentCount: {
    fontSize: 14,
    color: '#657786',
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

export default PlayerPosteos;