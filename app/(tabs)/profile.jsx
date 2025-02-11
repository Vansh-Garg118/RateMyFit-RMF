import { View, Text, TouchableOpacity, Image, FlatList } from "react-native";
import React from "react";
import { useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyState from "../../components/EmptyState";
import { getUserPosts, signOut } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../../components/VideoCard";
import { useGlobalContext } from "../../context/GlobalProvider";
import { icons } from "../../constants";
import InfoBox from "../../components/InfoBox";
import { router } from "expo-router";
const Profile = () => {
  
  const { user, setUser, setIsLoggedIn} = useGlobalContext();

  const logOut = async () => {
    await signOut();
    setUser(null)
    setIsLoggedIn(false)
    router.replace("/sign-in")
  };

  const fetchPosts = useCallback(() => getUserPosts(user.$id), []);
  const { data: posts } = useAppwrite(fetchPosts);
  // console.log(posts);

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts} // Fixed the data to match the keyExtractor
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard
            video={item}
            // playingVideoId={playingVideoId}
            // setPlayingVideoId={setPlayingVideoId}
          />
        )}
        ListHeaderComponent={() => {
          return (
            <View className="w-full justify-center items-center mt-6 mb-12 px-4 ">
              <TouchableOpacity
                className="w-full items-end mb-10"
                onPress={logOut}
              >
                <Image
                  source={icons.logout}
                  resizeMode="contain"
                  className="w-6 h-6"
                />
              </TouchableOpacity>
              <View className="w-16 h-16 border border-secondary-100 rounded-lg justify-center items-center">
                <Image
                  source={{ uri: user?.avatar }}
                  className="w-[95%] h-[95%] rounded-lg"
                  resizeMode="cover"
                />
              </View>
              <InfoBox
                title={user?.username}
                containerStyles="mt-5"
                titleStyles="text-lg"
              />
              <View className="mt-5 flex-row">
                <InfoBox
                  title={posts.length||0}
                  subtitle="Posts"
                  containerStyles="mr-10"
                  titleStyles="text-xl"
                />
                <InfoBox
                  title="6"
                  subtitle="Followers"
                  // containerStyles="mt-5"
                  titleStyles="text-xl"
                />
              </View>
            </View>
          );
        }}
        ListEmptyComponent={() => (
          <EmptyState
            title="No content found"
            subtitle="Nothing found for this search query"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Profile;
// import { View, Text } from 'react-native'
// import React from 'react'
// import { SafeAreaView } from 'react-native-safe-area-context'

// const profile = () => {
//   return (
//      <SafeAreaView className="bg-cyan-00 h-full">
//           <View className="flex-1 justify-center items-center">
//             <Text className="text-xl font-bold">Profile</Text>
//           </View>
//         </SafeAreaView>
//   )
// }

// export default profile