import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  StyleSheet,
  Dimensions,
} from "react-native";
import { ResizeMode, Video } from "expo-av";
import { icons } from "../constants";
import { likePost, addComment } from "../lib/appwrite";
import { useGlobalContext } from "../context/GlobalProvider";

const screenWidth = Dimensions.get("window").width;

const PostCard = ({
  post: {
    $id,
    title,
    desc,
    image,
    thumbnail,
    video,
    likes = [],
    comments = [],
    creator: { username, avatar },
  },
}) => {
  const { user } = useGlobalContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [localLikes, setLocalLikes] = useState(likes);
  const [localComments, setLocalComments] = useState(comments);
  const [commentText, setCommentText] = useState("");
  const [play, setPlay] = useState(false);
  const [mediaDimensions, setMediaDimensions] = useState({ width: screenWidth * 0.9, height: screenWidth * 9 / 16 });

  const isVideo = !!video;
  
  // Determine actual image dimensions
  useEffect(() => {
    const uri = isVideo ? thumbnail : image;
    if (uri) {
      Image.getSize(uri, (w, h) => {
        const scale = screenWidth * 0.9 / w;
        setMediaDimensions({
          width: screenWidth * 0.9,
          height: h * scale,
        });
      });
    }
  }, [image, thumbnail, isVideo]);

  const handleLike = async () => {
    const updatedLikes = await likePost($id, user.accountId, isVideo);
    setLocalLikes(updatedLikes);
  };

  const handleCommentSubmit = async () => {
    if (commentText.trim() === "") return;

    const isVideoPost = !!video; // If there is a video URL, it's a video post.

    const updatedComments = await addComment($id, commentText, user, isVideoPost);
    setLocalComments(updatedComments);
    setCommentText("");
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const seconds = Math.floor((now - date) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (seconds < 60) return "just now";
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    if (days < 2) return "yesterday";
    if (days < 30) return `${days} day${days !== 1 ? "s" : ""} ago`;
    if (months < 12) return `${months} month${months !== 1 ? "s" : ""} ago`;
    return `${years} year${years !== 1 ? "s" : ""} ago`;
  };

  const renderMedia = () => {
    if (isVideo) {
      return play ? (
        <Video
          source={{ uri: video }}
          style={[styles.media, mediaDimensions]}
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) setPlay(false);
          }}
        />
      ) : (
        <TouchableOpacity
          style={[styles.media, mediaDimensions]}
          onPress={() => setPlay(true)}
        >
          <Image source={{ uri: thumbnail }} style={[styles.media, mediaDimensions]} resizeMode="contain" />
          <View style={styles.playIcon}>
            <Image source={icons.play} style={styles.playImage} />
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Image source={{ uri: image }} style={[styles.media, mediaDimensions]} resizeMode="contain" />
        </TouchableOpacity>
      );
    }
  };

  return (
    <View style={styles.cardWrapper}>
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <Image source={{ uri: avatar }} style={styles.avatar} />
          <View style={styles.headerText}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.username}>@{username}</Text>
          </View>
        </View>

        {/* Media */}
        {renderMedia()}

        {/* Description */}
        {desc && <Text style={styles.description}>{desc}</Text>}

        {/* Likes & Comments */}
        <View style={styles.actions}>
          <TouchableOpacity onPress={handleLike} style={styles.actionItem}>
            <Image
              source={
                localLikes.includes(user.accountId) ? icons.liked : icons.like
              }
              style={styles.actionIcon}
            />
            <Text style={styles.actionText}>{localLikes.length}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.actionItem}>
            <Image source={icons.comment} style={styles.actionIcon} />
            <Text style={styles.actionText}>{localComments.length}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal */}
      <Modal visible={modalVisible} animationType="fade" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <ScrollView
            contentContainerStyle={styles.modalCard}
            showsVerticalScrollIndicator={false}
          >
            {renderMedia()}
            <Text style={styles.modalTitle}>{title}</Text>
            {desc && <Text style={styles.modalDesc}>{desc}</Text>}
            <Text style={styles.modalUsername}>@{username}</Text>

            {/* Comments */}
            <View>
              {localComments.length
                ? localComments.map((comment, i) => {
                    const parsed = typeof comment === "string" ? JSON.parse(comment) : comment;
                    return (
                      <View key={i} style={styles.commentBlock}>
                        <View style={styles.commentHeader}>
                          <Image source={{ uri: parsed.avatar }} style={styles.commentAvatar} />
                          <Text style={styles.commentUser}>{parsed.user}</Text>
                        </View>
                        <Text style={styles.commentText}>{parsed.text}</Text>
                        <Text style={styles.commentTime}>{formatTimestamp(parsed.createdAt)}</Text>
                      </View>
                    );
                  })
                : <Text style={styles.noComments}>No comments yet.</Text>}
            </View>

            {/* Comment Input */}
            <View style={styles.commentInputRow}>
              <TextInput
                placeholder="Write a comment..."
                placeholderTextColor="#888"
                value={commentText}
                onChangeText={setCommentText}
                style={styles.commentInput}
              />
              <TouchableOpacity onPress={handleCommentSubmit}>
                <Text style={styles.postButton}>Post</Text>
              </TouchableOpacity>
            </View>

            {/* Close */}
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: { paddingHorizontal: 16, marginBottom: 24 },
  card: {
    backgroundColor: "#1E1E2D",
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
  },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: "#6c63ff" },
  headerText: { marginLeft: 12, flex: 1 },
  title: { color: "#fff", fontSize: 16, fontWeight: "600" },
  username: { color: "#aaa", fontSize: 13 },
  menuIcon: { width: 16, height: 16 },
  media: {
    borderRadius: 16,
    overflow: "hidden",
    alignSelf: "center",
    backgroundColor: "#000",
    marginTop: 12,
  },
  playIcon: {
    position: "absolute",
    top: "50%",
    left: "50%",
    opacity: 10,
    transform: [{ translateX: -14 }, { translateY: -14 }],
    backgroundColor: "#000a",
    padding: 10,
    borderRadius: 50,
  },
  playImage: { width: 28, height: 28 },
  description: { marginTop: 10, color: "#ccc", fontSize: 15, lineHeight: 20 },
  actions: { flexDirection: "row", justifyContent: "space-between", marginTop: 14 },
  actionItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  actionIcon: { width: 30, height: 30 },
  actionText: { color: "#ccc", fontSize: 14 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#000c",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalCard: {
    width: "90%",
    backgroundColor: "#1a1a1a",
    borderRadius: 20,
    padding: 6,
    flexGrow: 1,
    justifyContent: "flex-start",
  },
  modalTitle: { color: "#fff", fontSize: 18, fontWeight: "600", marginTop: 16 },
  modalDesc: { color: "#aaa", marginTop: 4, fontSize: 14 },
  modalUsername: { color: "#666", fontSize: 12, marginTop: 2 },
  commentScroll: { marginTop: 12, maxHeight: 150 },
  commentBlock: {
    flexDirection: "column",
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  commentAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  commentUser: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  commentText: {
    color: "#ddd",
    fontSize: 13,
    marginLeft: 32, // aligns under username if avatar is 24 + 8 margin
    marginBottom: 4,
  },
  commentTime: {
    color: "#888",
    fontSize: 11,
    marginLeft: 32,
  },
  noComments: { textAlign: "center", color: "#666", fontSize: 14 },
  commentInputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 50,
    paddingHorizontal: 12,
  },
  commentInput: {
    flex: 1,
    color: "#fff",
    paddingVertical: 6,
  },
  postButton: {
    color: "#6c63ff",
    fontWeight: "600",
    paddingHorizontal: 8,
  },
  closeButton: {
    textAlign: "center",
    color: "#ff5a5f",
    fontWeight: "600",
    marginTop: 16,
  },
});

export default PostCard;
