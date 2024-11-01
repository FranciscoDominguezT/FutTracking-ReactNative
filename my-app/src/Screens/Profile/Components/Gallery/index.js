// Gallery.js (React Native)

import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Image, Modal } from 'react-native';
import axios from 'axios';
import { AuthContext } from "../../../../Context/auth-context";
import CommentSection from './Components/CommentSection';
import FullScreenVideo from './Components/FullScreenVideo';
import GalleryGrid from './Components/GalleryGrid';
import ShareMenu from './Components/ShareMenu';
import VideoControls from './Components/VideoControls';
import VideoInfo from './Components/VideoInfo';
import VideoStats from './Components/VideoStats';

const API_BASE_URL = 'http://localhost:5001/api';

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
        const response = await axios.get(`${API_BASE_URL}/userProfile/${isUserProfile ? 'my-videos' : `videos/${usuarioId}`}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = response.data;
        setVideos(data.message === "No hay videos cargados" ? [] : data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
    fetchVideos();
  }, [usuarioId, isUserProfile]);

  const handleVideoClick = async (video) => {
    setSelectedVideo(video);
    try {
      const videoData = await axios.get(`${API_BASE_URL}/videos/${video.id}`);
      setLikes(videoData.data.likes || 0);

      const ownerResponse = await axios.get(`${API_BASE_URL}/user/${video.usuarioid}`);
      setVideoOwner(ownerResponse.data);
    } catch (error) {
      console.error("Error fetching video data:", error);
    }
  };

  const handleLikeClick = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/videos/${selectedVideo.id}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLikes(response.data.likes);
      setLiked(response.data.liked);
    } catch (error) {
      console.error('Error updating video likes:', error);
    }
  };

  return (
    <View style={styles.gallery}>
      <ScrollView contentContainerStyle={styles.videoGrid}>
        {videos.map((video) => (
          <TouchableOpacity key={video.id} onPress={() => handleVideoClick(video)} style={styles.galleryItem}>
            <Image source={{ uri: video.thumbnail }} style={styles.galleryImg} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selectedVideo && (
        <Modal transparent={true} visible={!!selectedVideo} animationType="slide">
          <FullScreenVideo
            video={selectedVideo}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            currentTime={currentTime}
            setCurrentTime={setCurrentTime}
            duration={duration}
            setDuration={setDuration}
            onClose={() => setSelectedVideo(null)}
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
              onCommentClick={() => setShowCommentMenu(true)}
              onShareClick={() => setShowShareMenu(true)}
            />
            {showShareMenu && <ShareMenu onClose={() => setShowShareMenu(false)} videoUrl={selectedVideo.url} />}
            {showCommentMenu && <CommentSection videoId={selectedVideo.id} comments={comments} setComments={setComments} />}
          </FullScreenVideo>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  gallery: {
    flex: 1,
    backgroundColor: 'white',
  },
  videoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  galleryItem: {
    width: '33.33%',
    aspectRatio: 9 / 16,
    overflow: 'hidden',
  },
  galleryImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  fullscreenVideo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  buttonPause: {
    backgroundColor: '#464747',
    borderRadius: 20,
    padding: 10,
  },
  buttonCommentSend: {
    backgroundColor: '#464747',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    color: '#fff',
  },
  menuComment: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '50%',
    backgroundColor: '#0c0c0c',
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  titleComment: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  sectionComment: {
    flex: 1,
    width: '100%',
  },
  commentWrapperInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  inputComment: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#fff',
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
  },
  iconLikeComment: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Gallery;
