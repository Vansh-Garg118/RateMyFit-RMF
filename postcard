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
  const [imageHeight, setImageHeight] = useState(200); // Default height
  const isVideo = !!video;

  const handleLike = async () => {
    const updatedLikes = await likePost($id, user.accountId, isVideo);
    setLocalLikes(updatedLikes);
  };

  const handleCommentSubmit = async () => {
    if (commentText.trim() === "") return;
    const updatedComments = await addComment($id, commentText, user);
    setLocalComments(updatedComments);
    setCommentText("");
  };

  const renderMedia = () => {
    if (isVideo) {
      return play ? (
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
      );
    } else {
      return (
        <TouchableOpacity
          className="w-full h-60 rounded-xl mt-3"
          onPress={() => setModalVisible(true)}
        >
          <Image
            source={{ uri: image }}
            className="w-full h-full rounded-xl"
            resizeMode="contain"
          />
        </TouchableOpacity>
      );
    }
  };

  return (
    <View className="flex flex-col items-start px-4 mb-10">
      <View className="flex flex-row gap-3 items-start">
        <View className="flex flex-row flex-1 items-center">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary p-0.5">
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-lg"
            />
          </View>
          <View className="ml-3">
            <Text className="text-white text-sm font-pbold">{title}</Text>
            <Text className="text-xs text-gray-100 font-plight">
              {username}
            </Text>
          </View>
        </View>
        <TouchableOpacity>
          <Image source={icons.menu} className="w-5 h-5" />
        </TouchableOpacity>
      </View>

      {renderMedia()}

      <View className="flex flex-row items-center mt-2 space-x-4">
        <TouchableOpacity
          onPress={handleLike}
          className="flex flex-row items-center space-x-1"
        >
          <Image
            source={
              localLikes.includes(user.accountId) ? icons.liked : icons.like
            }
            className="w-5 h-5"
          />
          <Text className="text-gray-100 text-sm font-pregular">
            {localLikes.length} Likes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="flex flex-row items-center space-x-1"
        >
          <Image source={icons.comment} className="w-5 h-5" />
          <Text className="text-gray-100 text-sm font-pregular">
            {localComments.length} Comments
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black bg-opacity-70 justify-center items-center">
          <View className="w-[90%] bg-gray-900 rounded-xl p-4">
            {/* <Image source={{ uri: image||thumbnail }} className="w-full h-96 rounded-md" />
             */}
            <View
              style={{ width: "100%" }}
              onLayout={(event) => {
                const { width } = event.nativeEvent.layout;
                setImageHeight((width * 9) / 16); // Maintain 16:9 aspect ratio
              }}
            >
              <Image
                source={{ uri: image || thumbnail }}
                style={{ width: "100%", height: imageHeight, borderRadius: 12 }}
                resizeMode="contain"
              />
            </View>
            <Text className="text-white font-pbold text-lg mt-2">{title}</Text>
            <Text className="text-gray-100 font-plight text-sm mt-1">
              By {username}
            </Text>

            <View className="mt-4">
              <Text className="text-gray-100 text-lg font-pmedium">
                Comments:
              </Text>
              <View className="max-h-52 overflow-hidden">
                <ScrollView className="mt-2">
                  {localComments.length > 0 ? (
                    localComments.map((comment, index) => {
                      const parsedComment =
                        typeof comment === "string"
                          ? JSON.parse(comment)
                          : comment;

                      return (
                        <View
                          key={index}
                          className="p-2 rounded-lg mt-2 border-b border-gray-50 pb-2"
                        >
                          <View className="flex flex-row items-center space-x-2">
                            <Image
                              source={{ uri: parsedComment.avatar }}
                              className="w-7 h-7 rounded-full mx-2"
                            />
                            <Text className="text-white font-psemibold">
                              {parsedComment.user}
                            </Text>
                          </View>
                          <Text className="text-gray-300 text-sm ml-8 px-3 py-0.5 font-pregular">
                            {parsedComment.text}
                          </Text>
                          <Text className="text-gray-500 text-xs ml-8 font-plight">
                            {new Date(parsedComment.createdAt).toLocaleString()}
                          </Text>
                        </View>
                      );
                    })
                  ) : (
                    <Text className="text-gray-500 mt-2 font-plight">
                      No comments yet
                    </Text>
                  )}
                </ScrollView>
              </View>
            </View>

            <View className="flex flex-row items-center mt-4 border border-gray-700 p-2 rounded-lg">
              <TextInput
                className="flex-1 text-white font-pregular"
                placeholder="Write a comment..."
                placeholderTextColor="#888"
                value={commentText}
                onChangeText={setCommentText}
              />
              <TouchableOpacity onPress={handleCommentSubmit}>
                <Text className="text-secondary-100 font-psemibold mx-3">
                  Post
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="mt-4 py-2 rounded-lg"
            >
              <Text className="font-pbold text-red-500 text-center">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    maxWidth: "90%", // Prevents overflowing into other elements
    overflow: "hidden",
    textAlign: "left",
  },
  username: {
    fontSize: 12,
    color: "#aaa",
    maxWidth: "90%", // Ensures it doesn’t overflow
    flexWrap: "wrap", // Allows multi-line text
  },
  video: {
    width: screenWidth * 0.95, // Set width to the screen width
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
