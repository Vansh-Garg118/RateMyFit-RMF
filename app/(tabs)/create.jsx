import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  Dimensions,
} from "react-native";
import { React, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";
import { Video, ResizeMode } from "expo-av";
import { icons } from "../../constants";
import CustomButton from "../../components/CustomButton";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import { createPost, createVideo } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
const { width: screenWidth } = Dimensions.get("window");

const create = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [isVideoPost, setIsVideoPost] = useState(true);
  const [form, setForm] = useState({
    title: "",
    video: null,
    image: null,
    thumbnail: null,
    desc: "",
  });

  const openPicker = async (selectType) => {
    const result = await DocumentPicker.getDocumentAsync({
      type:
        selectType === "image"
          ? ["image/png", "image/jpg", "image/jpeg"]
          : ["video/mp4", "video/gif", "video/hevc", "video/mkv"],
    });
    if (!result.canceled) {
      if (selectType === "image" && isVideoPost) {
        setForm({ ...form, thumbnail: result.assets[0] });
      } else if (selectType === "image" && !isVideoPost) {
        setForm({ ...form, image: result.assets[0] });
      } else if (selectType === "video") {
        setForm({ ...form, video: result.assets[0] });
      }
    }
  };

  const submit = async () => {
    if (isVideoPost) {
      if (!form.desc || !form.title || !form.thumbnail || !form.video) {
        return Alert.alert("Please fill in all the fields");
      }
    } else {
      if (!form.desc || !form.title || !form.image) {
        return Alert.alert("Please fill in all the fields");
      }
    }

    setUploading(true);
    try {
      if (isVideoPost) {
        await createVideo({
          ...form,
          userId: user.$id,
        });
      } else {
        await createPost({
          ...form,
          userId: user.$id,
        });
      }

      Alert.alert("Success", "Post uploaded successfully");
      router.push("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setForm({
        title: "",
        video: null,
        image: null,
        thumbnail: null,
        desc: "",
      });
      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full w-full">
      <ScrollView className="p-4 my-6">
        <Text className="text-white text-2xl font-psemibold">
          Upload {isVideoPost ? "Video" : "Photo"}
        </Text>

        <View className="flex-row justify-center space-x-4 mt-4">
          <TouchableOpacity
            className={`px-4 py-2 rounded-2xl mx-4 ${
              isVideoPost ? "bg-secondary" : "bg-gray-700"
            }`}
            onPress={() => setIsVideoPost(true)}
          >
            <Text className="text-white">Video Post</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-4 py-2 rounded-2xl ${
              !isVideoPost ? "bg-secondary" : "bg-gray-700"
            }`}
            onPress={() => setIsVideoPost(false)}
          >
            <Text className="text-white">Photo Post</Text>
          </TouchableOpacity>
        </View>

        <FormField
          title="Title"
          value={form.title}
          placeholder="Give your post a title"
          handleChangeText={(e) => setForm({ ...form, title: e })}
          otherStyles="mt-10"
        />

        {isVideoPost ? (
          <>
            <View className="mt-7 space-y-2">
              <Text className="text-base text-gray-100 font-pmedium">
                Upload Video
              </Text>
              <TouchableOpacity onPress={() => openPicker("video")}>
                {form.video ? (
                  <Video
                    source={{ uri: form.video.uri }}
                    style={styles.video}
                    useNativeControls
                    resizeMode={ResizeMode.COVER}
                    isLooping
                  />
                ) : (
                  <View className="w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center">
                    <View className="w-14 h-14 border border-dashed border-secondary-100 justify-center items-center">
                      <Image
                        source={icons.upload}
                        ResizeMode="contain"
                        className="w-1/2 h-1/2"
                      />
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <View className="mt-7 space-y-2">
              <Text className="text-base text-gray-100 font-pmedium">
                Thumbnail Image
              </Text>
              <TouchableOpacity onPress={() => openPicker("image")}>
                {form.thumbnail ? (
                  <Image
                    source={{ uri: form.thumbnail.uri }}
                    resizeMode="cover"
                    className="w-full h-64 rounded-2xl"
                  />
                ) : (
                  <View className="w-full h-16 px-4 bg-black-100 rounded-2xl justify-center items-center border-2 border-black-200 flex-row space-x-2">
                    <Image
                      source={icons.upload}
                      ResizeMode="contain"
                      className="w-5 h-5 mr-2"
                    />
                    <Text className="text-sm text-gray-100 font-pmedium">
                      Choose A File
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View className="mt-7 space-y-2">
            <Text className="text-base text-gray-100 font-pmedium">
              Upload Photo
            </Text>
            <TouchableOpacity onPress={() => openPicker("image")}>
              {form.image ? (
                <Image
                  source={{ uri: form.image.uri }}
                  resizeMode="cover"
                  className="w-full h-64 rounded-2xl"
                />
              ) : (
                <View className="w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center">
                  <View className="w-14 h-14 border border-dashed border-secondary-100 justify-center items-center">
                    <Image
                      source={icons.upload}
                      ResizeMode="contain"
                      className="w-1/2 h-1/2"
                    />
                  </View>
                </View>
              )}
            </TouchableOpacity>
          </View>
        )}

        <FormField
          title="Description"
          value={form.desc}
          placeholder="Describe The Post"
          handleChangeText={(e) => setForm({ ...form, desc: e })}
          otherStyles="mt-10"
        />
        <CustomButton
          title="Submit & Publish"
          handlePress={submit}
          containerStyles="mt-7"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  video: {
    width: screenWidth * 0.95,
    height: (screenWidth * 9) / 16,
    borderRadius: 33,
    marginTop: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
});

export default create;
