import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from "../../../../Context/auth-context";
import CommentSection from './Components/CommentSection';
import FullScreenVideo from './Components/FullScreenVideo';
import GalleryGrid from './Components/GalleryGrid';
import ShareMenu from './Components/ShareMenu';
import VideoControls from './Components/VideoControls';
import VideoInfo from './Components/VideoInfo'
import VideoStats from './Components/VideoStats';
import { StyleSheet, View, FlatList, TouchableOpacity, Image, Text } from 'react-native';
import { Dimensions } from 'react-native';

const API_BASE_URL = 'https://open-moderately-silkworm.ngrok-free.app/api';

const Gallery = ({ usuarioId, isUserProfile = false }) => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showCommentMenu, setShowCommentMenu] = useState(false);
  const [videoData, setVideoData] = useState(null);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [videoOwner, setVideoOwner] = useState(null);
  const [liked, setLiked] = useState(false);

  const { user, token } = useContext(AuthContext);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        let url = isUserProfile
          ? `${API_BASE_URL}/userProfile/my-videos`
          : `${API_BASE_URL}/userProfile/videos/${usuarioId}`;

        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setVideos(data.message === "No hay videos cargados" ? [] : data);
        } else {
          console.log("Error al obtener los videos:", data.message);
        }
      } catch (error) {
        console.error("Error al obtener los videos:", error);
      }
    };

    fetchVideos();
  }, [usuarioId, isUserProfile]);

  const handleVideoClick = async (video) => {
    setSelectedVideo(video);
    try {
      const videoData = await fetch(`${API_BASE_URL}/videos/${video.id}`);
      if (!videoData.ok) {
        console.log("Error fetching video data:", videoData.statusText);
        return;
      }
      const data = await videoData.json();
      setLikes(data.likes || 0);
      
      const ownerResponse = await axios.get(`${API_BASE_URL}/user/${video.usuarioid}`);
      setVideoOwner(ownerResponse.data);
    } catch (error) {
      console.error("Error fetching video data:", error);
    }
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
  };

  const handleLikeClick = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/videos/${selectedVideo.id}/like`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setLikes(response.data.likes);
      setLiked(response.data.liked);
    } catch (error) {
      console.error('Error updating video likes:', error);
    }
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

  const handleFollowToggle = async () => {
    if (!selectedVideo) return;
    try {
      const response = await axios.post(`${API_BASE_URL}/videos/11/${selectedVideo.usuarioid}/followChange`);
      setIsFollowing(response.data.isFollowing);
    } catch (error) {
      console.error("Error toggling follow status:", error);
    }
  };

  useEffect(() => {
    const fetchFollow = async () => {
      if (!selectedVideo) return;
      try {
        const response = await axios.get(`${API_BASE_URL}/videos/11/${selectedVideo.usuarioid}/follow`);
        setIsFollowing(response.data.isFollowing);
      } catch (error) {
        console.error("Error fetching follow status:", error);
      }
    };

    fetchFollow();
  }, [selectedVideo]);

  return (
    <View style={styles.gallery}>
      <GalleryGrid videos={videos} onVideoClick={handleVideoClick} />

      {selectedVideo && (
        <FullScreenVideo
          video={selectedVideo}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          currentTime={currentTime}
          setCurrentTime={setCurrentTime}
          duration={duration}
          setDuration={setDuration}
          onClose={handleCloseVideo}
        >
          <VideoInfo
            videoOwner={videoOwner}
            isFollowing={isFollowing}
            onFollowToggle={handleFollowToggle}
          />
          <VideoStats
            likes={likes}
            commentsCount={commentsCount}
            onLikeClick={handleLikeClick}
            onCommentClick={handleCommentClick}
            onShareClick={() => setShowShareMenu(true)}
          />
          {showShareMenu && (
            <ShareMenu
              onClose={() => setShowShareMenu(false)}
              videoUrl={selectedVideo.url}
            />
          )}
          {showCommentMenu && (
            <CommentSection
              videoId={selectedVideo.id}
              comments={comments}
              setComments={setComments}
              onClose={() => setShowCommentMenu(false)}
              onCommentSubmit={(newComments) => setComments(newComments)}
            />
          )}
        </FullScreenVideo>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  gallery: {
    flex: 1,
  },
  videoGrid: {
    flex: 1,
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'flex-start',
  },
  galleryItem: {
    width: Dimensions.get('window').width / 3 - 20,
    aspectRatio: 9 / 16,
    overflow: 'hidden',
  },
  galleryImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  noVideosMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    color: 'white',
    fontSize: 18,
  },
});

export default Gallery;