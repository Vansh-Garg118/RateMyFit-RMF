import { Text, View, ScrollView, Image } from "react-native";
import React from "react";
import { Link, Redirect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants";
import CustomButton from "../components/CustomButton";
import { StatusBar } from "expo-status-bar";
import "react-native-url-polyfill/auto";
import { useGlobalContext } from "../context/GlobalProvider";
import { signOut } from "../lib/appwrite";


const RootLayout = () => {
  const { isLoading, isLoggedIn } = useGlobalContext();

  if (!isLoading && isLoggedIn) return <Redirect href="/home" />;
  
  return (
    // <View className="flex-1 items-center justify-center align-middle">
    //   <Text className="text-3xl font-pblack">RateMyOutfit</Text>
    //   <Link href="/home" >Home</Link>
    // </View>
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className=" w-full justify-center items-center h-full px-4">
          <Text className="color-white text-6xl font-bold p-4">RateMyFit</Text>
          <Image
            source={images.cards}
            className="max-w-[380px] w-full max-h-[420px] rounded-3xl"
            resizeMode="cover"
          />
          <Text className="color-white text-3xl font-pthin p-6">
            Flaunt your <Text className="color-yellow-500">outfits</Text>
          </Text>
          <CustomButton
            title="continue with email"
            handlePress={() => router.push("/sign-in")}
            className="w-full mt-7"
          />
          {/* <Link href="/home"><Text className="color-white">Home</Text></Link>  */}
          {/* <CustomButton
            title="Destroy Session"
            handlePress={signOut}
            containerStyles="mt-7"
          /> */}
          {/* remove later */}
        </View>
        
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default RootLayout;
