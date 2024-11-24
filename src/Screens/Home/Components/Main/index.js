import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, StyleSheet, Dimensions, Alert, StatusBar } from 'react-native';
import axios from 'axios';
import VideoPlayer from './Components/VideoPlayer';
import Controls from './Components/Controls';
import UserInfo from './Components/UserInfo';
import Stats from './Components/Stats';
import ShareMenu from './Components/ShareMenu';
import CommentMenu from './Components/CommentMenu';
import { AuthContext } from '../../../../Context/auth-context';

const API_BASE_URL = 'https://open-moderately-silkworm.ngrok-free.app/api';

const Main = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showCommentMenu, setShowCommentMenu] = useState(false);
  const [videoData, setVideoData] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [likes, setLikes] = useState(0);
  const [likedComments, setLikedComments] = useState({});
  const [comments, setComments] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [liked, setLiked] = useState(false);  // Estado para saber si el video está likeado
  const [commentsCount, setCommentsCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [userData, setUserData] = useState(null);

  const { user, token } = useContext(AuthContext);
  const [currentUserId, setCurrentUserId] = useState(null);

  const videoRef = useRef(null);

  useEffect(() => {
    if (user) {
      setCurrentUserId(user.id);
    }
  }, [user]);

  useEffect(() => {
    const getRandomVideoId = () => Math.floor(Math.random() * 5) + 1;

    const fetchVideoData = async () => {
      const videoId = getRandomVideoId();
      try {
        const videoResponse = await axios.get(`${API_BASE_URL}/videos/${videoId}`);
        setVideoData(videoResponse.data);
        setSelectedVideo(videoResponse.data);
        setLikes(videoResponse.data.likes);
        setLiked(videoResponse.data.liked); // Actualiza el estado de liked desde la respuesta del servidor

        const userResponse = await axios.get(`${API_BASE_URL}/videos/player/${videoResponse.data.usuarioid}`);
        setUserData(userResponse.data);

        if (currentUserId) {
          const followResponse = await axios.get(`${API_BASE_URL}/videos/${currentUserId}/${videoResponse.data.usuarioid}/follow`);
          setIsFollowing(followResponse.data.isFollowing);
        }

        const likesResponse = await axios.get(`${API_BASE_URL}/videos/${videoId}/likes`);
        setLikes(likesResponse.data.likes);

        const comentarioLikesResponse = await axios.get(`${API_BASE_URL}/videos/${videoId}/commentLikes`);

        const likesMap = comentarioLikesResponse.data.reduce((acc, like) => {
          acc[like.comentarioid] = (acc[like.comentarioid] || 0) + 1;
          return acc;
        }, {});
        setLikedComments(likesMap);

      } catch (error) {
        console.error("Error al obtener datos del video:", error.response?.data || error.message);
      }
    };

    fetchVideoData();
  }, [currentUserId]);

  useEffect(() => {
    const fetchCommentsCount = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/comments/${selectedVideo.id}/countComments`);
        setCommentsCount(response.data.count);
      } catch (error) {
        console.error("Error fetching comments count:", error);
      }
    };

    if (selectedVideo) {
      fetchCommentsCount();
    }
  }, [selectedVideo]);

  useEffect(() => {
    const fetchFollow = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/videos/${currentUserId}/${selectedVideo.usuarioid}/follow`);
        setIsFollowing(response.data.isFollowing);
      } catch (error) {
        console.error("Error fetching follow status:", error);
      }
    };

    if (selectedVideo) {
      fetchFollow();
    }
  }, [selectedVideo, currentUserId]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleShareClick = () => {
    setShowShareMenu(!showShareMenu);
  };

  const handleCommentClick = async () => {
    setShowCommentMenu(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/comments/${selectedVideo.id}`);
      if (Array.isArray(response.data)) {
        setComments(response.data);
      } else {
        console.error("La respuesta no es un array:", response.data);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleLikeClick = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/videos/${selectedVideo.id}/like`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setLikes(response.data.likes);
      setLiked(response.data.liked); // Actualiza el estado de liked
    } catch (error) {
      console.error('Error updating video likes:', error);
    }
  };
  
  const handleFollowToggle = async () => {
    if (!selectedVideo || !currentUserId) return;
    try {
      const response = await axios.post(`${API_BASE_URL}/videos/${currentUserId}/${selectedVideo.usuarioid}/followChange`);
      setIsFollowing(response.data.isFollowing);
    } catch (error) {
      console.error("Error toggling follow status:", error);
    }
  };

  return (
    <View style={styles.imageContainer}>
      <StatusBar 
        barStyle="dark-content"
        translucent={true}
        backgroundColor="transparent"
      />
      <VideoPlayer
        videoData={videoData}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onTimeUpdate={setCurrentTime}
        onDurationChange={setDuration}
      />
      <View style={styles.playerInfo}>
        <Controls
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          onPlayPause={handlePlayPause}
          videoRef={videoRef}
        />
        <UserInfo
          userData={userData}
          isFollowing={isFollowing}
          onFollowToggle={handleFollowToggle}
          currentUserId={currentUserId}
        />
        <Stats
          likes={likes}
          commentsCount={commentsCount}
          onLikeClick={handleLikeClick}
          onCommentClick={handleCommentClick}
          onShareClick={handleShareClick}
          liked={liked} // Esto se utiliza para saber si el video fue likeado
        />
      </View>
      {showShareMenu && (
        <ShareMenu
          onClose={() => setShowShareMenu(false)}
          videoUrl={videoData?.url}
        />
      )}
      {showCommentMenu && (
        <CommentMenu
          comments={comments}
          selectedVideo={selectedVideo}
          currentUserId={currentUserId}
          onClose={() => setShowCommentMenu(false)}
          onCommentSubmit={(newComments) => setComments(newComments)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    maxWidth: '450px',
    height: '85vh',
    margin: '0 auto',
    backgroundColor: '#000',
    display: 'flex',
    justifyContent: 'center',  // Debe estar entre comillas
    alignItems: 'center',      // Debe estar entre comillas
  },
  playerInfo: {
    position: 'absolute',
    bottom: 55, // Ajusta la posición del componente
    zIndex: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%', // Ajusta el ancho según sea necesario
  }, 
});

export default Main;
