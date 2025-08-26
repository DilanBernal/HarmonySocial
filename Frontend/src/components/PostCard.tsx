import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Post from '../models/Post';

const PostCard = ({ p }: { p: Post }) => {
  return (
    <View style={styles.card}>
      {/* header */}
      <View style={styles.cardHead}>
        <Image source={p.avatar} style={styles.cardAvatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.cardUser}>{p.user}</Text>
          <Text style={styles.cardTime}>{p.time}</Text>
        </View>
        <Ionicons name="ellipsis-horizontal" size={20} color="#9AA3B2" />
      </View>

      {/* cover */}
      <Image source={p.cover} style={styles.cardCover} />

      {/* info */}
      <View style={styles.cardMeta}>
        <Text style={styles.cardTitle}>{p.title}</Text>
        <Text style={styles.cardArtist}>{p.artist}</Text>
      </View>

      {/* acciones */}
      <View style={styles.cardActions}>
        <View style={styles.row}>
          <Ionicons name="heart-outline" size={22} color="#C9D0E3" />
          <Text style={styles.actionText}>{p.likes}</Text>
          <Ionicons
            name="chatbubble-outline"
            size={22}
            color="#C9D0E3"
            style={{ marginLeft: 14 }}
          />
          <Text style={styles.actionText}>{p.comments}</Text>
        </View>
        <View style={styles.row}>
          <Ionicons name="share-social-outline" size={22} color="#C9D0E3" />
          <Ionicons
            name="play-circle-outline"
            size={26}
            color="#C9D0E3"
            style={{ marginLeft: 14 }}
          />
        </View>
      </View>
    </View>
  );
};

export default PostCard;

const styles = StyleSheet.create({
  /* feed cards */
  card: {
    backgroundColor: '#171b23',
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#242b37',
    marginTop: 14,
  },
  cardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 10,
  },
  cardAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#222',
  },
  cardUser: {
    color: '#E6EAF2',
    fontWeight: '700',
  },
  cardTime: {
    color: '#9AA3B2',
    fontSize: 12,
  },
  cardCover: {
    width: '100%',
    height: 190,
    backgroundColor: '#222',
  },
  cardMeta: {
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  cardTitle: {
    color: '#EDEFFF',
    fontWeight: '800',
    fontSize: 16,
  },
  cardArtist: {
    color: '#A8B0C3',
    marginTop: 2,
  },
  cardActions: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    color: '#C9D0E3',
    marginLeft: 6,
    fontWeight: '600',
  },
});
