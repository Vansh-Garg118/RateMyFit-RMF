import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { StyleSheet, Dimensions } from "react-native";


import { ResizeMode, Video } from "expo-av";
import { icons } from "../constants";

// Get screen width
const { width: screenWidth } = Dimensions.get("window");

const VideoCard = ({
  video: {
    title,
    thumbnail,
    video,
    creator: { username, avatar },
  },
}) => {
  const [play, setPlay] = useState(false);

  return (
    <View className="flex flex-col items-start px-4 mb-14 ">
      <View className="flex flex-row gap-3 items-start">
        <View className="flex justify-start items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>
          <View className="justify-center ml-3 gap-y-1 ">
            <Text className="text-white text-sm" numberOfLines={1}>
              {title}
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {username}
            </Text>
          </View>
        </View>
        <View className="pt-2">
          <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
        </View>
      </View>
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
        <TouchableOpacity className="w-full h-60 rounded-xl mt-3 relative justify-center items-center" onPress={()=>setPlay(true)}>
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />
          <Image source={icons.play} className="w-12 h-12  absolute " resizeMode="contain"/>
        </TouchableOpacity>
      )}
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
    
  });
export default VideoCard;
