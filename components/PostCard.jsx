import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
} from "react-native";
import { icons } from "../constants";
import { likePost, addComment } from "../lib/appwrite";
import { useGlobalContext } from "../context/GlobalProvider";
import { ResizeMode, Video } from "expo-av";
import { StyleSheet, Dimensions } from "react-native";
const { width: screenWidth } = Dimensions.get("window");
const PostCard = ({
  post: {
    $id,
    title,
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

  // Determine if it's a video post
  const isVideo = !!video;

  // Toggle Like
  const handleLike = async () => {
    const updatedLikes = await likePost($id, user.accountId);
    setLocalLikes(updatedLikes);
  };

  // Submit Comment
  const handleCommentSubmit = async () => {
    if (commentText.trim() === "") return;
    const updatedComments = await addComment($id, commentText, user);
    setLocalComments(updatedComments);
    setCommentText(""); // Reset input
  };

  const renderMedia = () => {
    if (isVideo) {
      return (
        <>
          {play ? (
            <Video
              source={{ uri: video }}
              style={styles.video}
              resizeMode={ResizeMode.CONTAIN}
              useNativeControls
              shouldPlay
              onPlaybackStatusUpdate={(status) => {
                if (status.didJustFinish) {
                  setPlay(false);
                }
              }}
            />
          ) : (
            <TouchableOpacity 
              className="w-full h-60 rounded-xl mt-3 relative justify-center items-center" 
              onPress={() => setPlay(true)}
            >
              <Image
                source={{ uri: thumbnail }}
                className="w-full h-full rounded-xl"
                resizeMode="cover"
              />
              <Image 
                source={icons.play} 
                className="w-12 h-12 absolute" 
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
        </>
      );
    } else {
      // Photo post
      return (
        <TouchableOpacity 
          className="w-full h-60 rounded-xl mt-3" 
          onPress={() => setModalVisible(true)}
        >
          <Image
            source={{ uri: image }}
            className="w-full h-full rounded-xl"
            resizeMode="cover"
          />
        </TouchableOpacity>
      );
    }
  };

  return (
    <View className="flex flex-col items-start px-4 mb-10">
      {/* User Info */}
      <View className="flex flex-row gap-3 items-start">
        <View className="flex flex-row flex-1 items-center">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary p-0.5">
            <Image source={{ uri: avatar }} className="w-full h-full rounded-lg" />
          </View>
          <View className="ml-3">
            <Text className="text-white text-sm">{title}</Text>
            <Text className="text-xs text-gray-100">{username}</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Image source={icons.menu} className="w-5 h-5" />
        </TouchableOpacity>
      </View>

      {/* Media Content */}
      {renderMedia()}

      {/* Likes and Comments */}
      <View className="flex flex-row items-center mt-2 space-x-4">
        <TouchableOpacity onPress={handleLike} className="flex flex-row items-center space-x-1">
          <Image
            source={localLikes.includes(user.accountId) ? icons.liked : icons.like}
            className="w-5 h-5"
          />
          <Text className="text-gray-100 text-sm">{localLikes.length} Likes</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setModalVisible(true)} className="flex flex-row items-center space-x-1">
          <Image source={icons.comment} className="w-5 h-5" />
          <Text className="text-gray-100 text-sm">{localComments.length} Comments</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for Post Details */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black bg-opacity-70 justify-center items-center">
          <View className="w-[90%] bg-[#1e1e1e] rounded-xl p-4">
            <ScrollView>
              <Image source={{ uri: thumbnail }} className="w-full h-60 rounded-lg" />
              <Text className="text-white text-lg font-bold mt-2">{title}</Text>
              <Text className="text-gray-100 text-sm mt-1">By {username}</Text>

              {/* Comments Section */}
              <View className="mt-4">
                <Text className="text-gray-100 text-lg">Comments:</Text>
                {localComments.length > 0 ? (
                  localComments.map((comment, index) => (
                    <View key={index} className="mt-2 border-b border-gray-700 pb-2">
                      <View className="flex flex-row items-center space-x-2">
                        <Image source={{ uri: comment.avatar }} className="w-6 h-6 rounded-full" />
                        <Text className="text-gray-100">{comment.user}</Text>
                      </View>
                      <Text className="text-gray-300 text-sm ml-8">{comment.text}</Text>
                    </View>
                  ))
                ) : (
                  <Text className="text-gray-500 mt-2">No comments yet</Text>
                )}
              </View>

              {/* Add Comment Input */}
              <View className="flex flex-row items-center mt-4 border border-gray-700 p-2 rounded-lg">
                <TextInput
                  className="flex-1 text-white"
                  placeholder="Write a comment..."
                  placeholderTextColor="#888"
                  value={commentText}
                  onChangeText={setCommentText}
                />
                <TouchableOpacity onPress={handleCommentSubmit}>
                  <Text className="text-blue-500">Post</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="bg-red-500 mt-4 py-2 rounded-lg"
            >
              <Text className="text-white text-center">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
    video: {
        width: screenWidth*0.95, // Set width to the screen width
        height: (screenWidth * 9) / 16, // Maintain 16:9 aspect ratio (video height based on width)
        borderRadius: 33, // Rounded corners
        marginTop: 12, // Equivalent to "mt-3"
        backgroundColor: "rgba(255, 255, 255, 0.1)", // Semi-transparent background
      },
      image: {
        width: screenWidth * 0.95,
        height: screenWidth * 0.95, // Square aspect ratio for photos
        borderRadius: 33,
        marginTop: 12,
      },
  });
export default PostCard;
