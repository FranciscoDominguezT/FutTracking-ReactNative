import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Asegúrate de tener instalada la librería de FontAwesome

const Stats = ({ likes, commentsCount, onLikeClick, onCommentClick, onShareClick, liked }) => {
  return (
    <View style={styles.stats}>
      <TouchableOpacity onPress={onLikeClick} style={styles.stat}>
        <FontAwesome name="heart" size={24} color={liked ? '#ff5c5c' : '#fff'} />
        <Text style={styles.statText}>{likes}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onCommentClick} style={styles.stat}>
        <FontAwesome name="comment" size={24} color="#fff" />
        <Text style={styles.statText}>{commentsCount}</Text>
      </TouchableOpacity>
      <View style={styles.stat}>
        <FontAwesome name="eye" size={24} color="#fff" />
        <Text style={styles.statText}>61.3K</Text>
      </View>
      <TouchableOpacity onPress={onShareClick} style={styles.stat}>
        <FontAwesome name="share-alt" size={24} color="#fff" />
        <Text style={styles.statText}>Compartir</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 10,
    color: '#fff',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    color: '#fff',
    marginLeft: 5,
  },
});

export default Stats;
