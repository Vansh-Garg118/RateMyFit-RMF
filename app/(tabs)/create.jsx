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
import { createVideo } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
const { width: screenWidth } = Dimensions.get("window");



const create = () => {
  const {user}=useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    video: null,
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
      if (selectType === "image") {
        setForm({ ...form, thumbnail: result.assets[0] });
      }
      if (selectType === "video") {
        setForm({ ...form, video: result.assets[0] });
      }
    }
    //  else {
    //   setTimeout(() => {
    //     Alert.alert("Document picked", JSON.stringify(result, null, 2));
    //   }, 100);
    // }
  };

  const submit = async () => {
    
    if (!form.desc || !form.title || !form.thumbnail || !form.video) {
      // console.log(...form);
      
      return Alert.alert("Please fill in All the fields");
    }
    setUploading(true);
    try {

      await createVideo({
        ...form,userId:user.$id
      })

      Alert.alert("success", "post uploaded successfully");
      router.push("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setForm({
        title: "",
        video: null,
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
          {" "}
          Upload Video
        </Text>
        <FormField
          title="Video Title"
          value={form.title}
          placeholder="Give the video a catchy Title"
          handleChangeText={(e) => setForm({ ...form, title: e })}
          otherStyles="mt-10"
        />

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
                {/* <View className="w-14 h-14 border border-dashed border-secondary-100 justify-center items-center"> */}
                <Image
                  source={icons.upload}
                  ResizeMode="contain"
                  className="w-5 h-5 mr-2"
                />
                <Text className="text-sm text-gray-100 font-pmedium">
                  Choose A File
                </Text>
                {/* </View> */}
              </View>
            )}
          </TouchableOpacity>
        </View>
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
    width: screenWidth * 0.95, // Set width to the screen width
    height: (screenWidth * 9) / 16, // Maintain 16:9 aspect ratio (video height based on width)
    borderRadius: 33, // Rounded corners
    marginTop: 12, // Equivalent to "mt-3"
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Semi-transparent background
  },
});
export default create;
