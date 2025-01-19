import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

const Search = () => {
  const {query} =useLocalSearchParams();
  return (
    <SafeAreaView > 
      <Text className="text-3xl  text-white">{query}</Text>
    </SafeAreaView>
  )
}

export default Search