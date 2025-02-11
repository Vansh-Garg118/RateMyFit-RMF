import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'


const trends = () => {
  return (
     <SafeAreaView className="bg-blue-300 h-full">
      <View className="flex-1 justify-center items-center">
        <Text className="text-xl font-bold">Trends</Text>
      </View>
    </SafeAreaView>
  )
}

export default trends