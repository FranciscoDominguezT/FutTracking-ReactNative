import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FaHeart, FaComment, FaEye, FaShareAlt } from "react-icons/fa"; // Necesitarás asegurarte de que estos íconos funcionen en tu configuración de React Native.

const VideoStats = ({ likes, commentsCount, onLikeClick, onCommentClick, onShareClick }) => {
  return (
    <View style={styles.stats}>
      <TouchableOpacity style={styles.stat} onPress={onLikeClick}>
        <FaHeart className={`stat-icon ${likes > 0 ? "liked" : ""}`} />
        <Text style={styles.statText}>{likes}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.stat} onPress={onCommentClick}>
        <FaComment className="estat-icon" />
        <Text style={styles.statText}>{commentsCount}</Text>
      </TouchableOpacity>
      <View style={styles.stat}>
        <FaEye className="estat-icon" />
        <Text style={styles.statText}>61.3K</Text>
      </View>
      <TouchableOpacity style={styles.stat} onPress={onShareClick}>
        <FaShareAlt className="estat-icon" />
        <Text style={styles.statText}>Compartir</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 5,
    fontSize: 16,
  },
});

export default VideoStats;
