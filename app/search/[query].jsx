import {
  View,
  Text,
  FlatList,
} from "react-native";
import React from "react";
import {useEffect,useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchInput from "../../components/SearchInput";
import EmptyState from "../../components/EmptyState";
import { searchPosts } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../../components/VideoCard";
import { useLocalSearchParams } from "expo-router";

const Search = () => {
  const { query } = useLocalSearchParams();
  const fetchPosts = useCallback(() => searchPosts(query), [query]);
  const { data: posts, refetch } = useAppwrite(fetchPosts);
  
  // console.log(query,posts)
  

  useEffect(() => {
    refetch()
  

  }, [query])
  
 

  const onRefresh = async () => {
    setRefreshing(true);
    //re-call videos->if any new videos appeared
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="bg-primary  h-full">
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
            <View className="my-6 px-4">
              <Text className="font-pmedium text-sm text-gray-100 ">
                Search Results
              </Text>
              <Text className="text-2xl font-psemibold text-white">
                {query}
              </Text>
              <View className="mt-6 mb-8">
                <SearchInput initialQuery={query} />
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

export default Search;
// import { View, Text} from "react-native";
// import React from "react";
// import { useLocalSearchParams } from "expo-router";
// import { SafeAreaView } from "react-native-safe-area-context";

// const Search = () => {
//   const { query } = useLocalSearchParams();
//   return (
//     <SafeAreaView className="bg-primary h-full">
//         <Text className="text-3xl text-white">{query}</Text>
//     </SafeAreaView>
//   );
// };

// export default Search;
