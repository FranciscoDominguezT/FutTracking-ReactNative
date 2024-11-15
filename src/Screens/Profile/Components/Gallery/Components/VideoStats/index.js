import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Importa FontAwesome desde @expo/vector-icons

const VideoStats = ({ likes, commentsCount, onLikeClick, onCommentClick, onShareClick }) => {
  return (
    <View style={styles.stats}>
      <TouchableOpacity style={styles.stat} onPress={onLikeClick}>
        <FontAwesome name="heart" size={24} color={likes > 0 ? "red" : "black"} /> 
        <Text style={styles.statText}>{likes}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.stat} onPress={onCommentClick}>
        <FontAwesome name="comment" size={24} color="black" /> 
        <Text style={styles.statText}>{commentsCount}</Text>
      </TouchableOpacity>
      <View style={styles.stat}>
        <FontAwesome name="eye" size={24} color="black" /> 
        <Text style={styles.statText}>61.3K</Text>
      </View>
      <TouchableOpacity style={styles.stat} onPress={onShareClick}>
        <FontAwesome name="share-alt" size={24} color="black" /> 
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
