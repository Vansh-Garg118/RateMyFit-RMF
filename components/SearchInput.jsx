import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { React, useState } from "react";
import { icons } from "../constants";
import { router, usePathname } from "expo-router";


const SearchInput = () => {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  return (
    <View className="border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary-100 items-center flex-row space-x-4">
      <TextInput
        className="text-base mt-0.5 text-white flex-1 font-pregular"
        value={query}
        placeholder="Search Here"
        placeholderTextColor="#cdcde0"
        onChangeText={(e) => setQuery(e)}
      />
      <TouchableOpacity
        onPress={() => {
          if (!query) {
            return Alert.alert(
              "missing query",
              "please input something to search"
            );
          }
          if(pathname.startsWith('/search')) router.setParams({query})
            else router.push(`/search/${query}`)
        }}
      >
        <Image
          source={icons.search}
          className="w-5 h-5"
          resizeMode="containF"
        />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
