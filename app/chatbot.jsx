import React, { useState, useCallback, useRef } from "react";
import { View, ScrollView, TouchableOpacity, Image, Alert } from "react-native";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import FormField from "../components/FormField";
// import { parseChatbotResponse } from "../utils/parseChatbotResponse"; // Import parsing function
import { icons, images } from "../constants";
import { Text } from "react-native";
// import Snackbar from "react-native-snackbar";
// import { Alert } from "react-native";
const API_KEY = process.env.EXPO_PUBLIC_G_API_KEY;


const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const scrollViewRef = useRef(null);

  // Function to select an image

// Function to parse chatbot response into formatted JSX
const parseChatbotResponse = (response) => {
  const lines = response.split("\n").filter((line) => line.trim() !== ""); // Remove empty lines
  const parsedElements = [];

  lines.forEach((line, index) => {
    if (line.startsWith("Recommendations:")) {
      // Section Heading
      parsedElements.push(
        <Text key={index} className="font-pbold text-lg text-white mt-4">
          Recommendations:
        </Text>
      );
    } else if (line.match(/^\d+\./)) {
      // Bold Numbered Points (e.g., "1. Fit is Key:")
      const parts = line.split(":");
      parsedElements.push(
        <View key={index} className="mt-2">
          <Text className="font-pbold text-white">
            {parts[0]}:{" "}
            <Text className="font-pregular text-gray-300">
              {parts.slice(1).join(":").trim()}
            </Text>
          </Text>
        </View>
      );
    } else {
      // Handling **Semi-Bold** and *Bold* within a sentence
      let formattedText = [];
      let splitText = line.split(/(\*\*.*?\*\*|\*.*?\*)/g);

      splitText.forEach((segment, i) => {
        if (segment.startsWith("**") && segment.endsWith("**")) {
          formattedText.push(
            <Text key={i} className="font-psemibold">
              {segment.replace(/\*\*/g, "").trim()}
            </Text>
          );
        } else if (segment.startsWith("*") && segment.endsWith("*")) {
          formattedText.push(
            <Text key={i} className="font-pbold">
              {segment.replace(/\*/g, "").trim()}
            </Text>
          );
        } else {
          formattedText.push(<Text key={i}>{segment.trim()}</Text>);
        }
      });

      parsedElements.push(
        <Text key={index} className="font-pregular text-white">
          {formattedText}
        </Text>
      );
    }
  });

  return <View className="p-4">{parsedElements}</View>;
};

  const pickImage = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*",
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets || !result.assets[0].uri) {
        console.log("No image selected");
        return;
      }

      const imageUri = result.assets[0].uri;

      if (!imageUri) {
        console.error("Invalid file URI");
        return;
      }

      const base64Image = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      setSelectedImage({
        uri: imageUri,
        base64: base64Image,
        mimeType: result.assets[0].mimeType || "image/jpeg",
      });

      console.log("image selected")
      // Snackbar.show({
      //   text: "Image selected successfully!",
      //   duration: Snackbar.LENGTH_SHORT,
      //   backgroundColor: "#4CAF50", // Green success color
      // });
      // Alert.alert("image selected")
    } catch (error) {
      console.error("Image selection error:", error);
    }
  };

  // // Function to send message
  // const sendMessage = useCallback(async () => {
  //   if (!inputText.trim() && !selectedImage) return;

  //   const userMessage = {
  //     role: "user",
  //     content: inputText || "📷 Sent an image",
  //     image: selectedImage?.uri || null,
  //   };

  //   setInputText("");
  //   setSelectedImage(null);
  //   setMessages((prevMessages) => [...prevMessages, userMessage]);

  //   try {
  //     const genAI = new GoogleGenerativeAI(API_KEY);
  //     const model = genAI.getGenerativeModel({
  //       model: "gemini-2.0-flash-lite",
  //       systemInstruction:
  //         '<System> You are a highly knowledgeable and warm fashion expert dedicated to helping Gen Z and young Millennials and GenZ in India look their best. Your role is to analyze uploaded outfit images, automatically infer the user\'s body size, color profile of user and outfit and shape from visual cues, and provide personalized fashion recommendations with a sweet, friendly, and supportive tone. Your advice should blend modern Indian trends with timeless style principles, always aiming to uplift and empower the user. You have to answer text prompts if an image is not uploaded. if the text prompt is too out of context calmly deny the user of service aand remind them your role </System> <Context> Your model interacts with users who upload images of their outfits and occasionally share additional style details. In addition to analyzing the outfit, you must: 1. Automatically detect and infer key aspects of the user’s body size and shape from the image. 2. Combine these visual cues with any extra details provided (such as style preferences or inspirations) to deliver a holistic and personalized evaluation. 3. Offer specific recommendations and modifications tailored to the user’s unique body type and current trends in Indian fashion. 4. Maintain a sweet, eager-to-help manner that resonates with Gen Z and Millennial users in India. </Context> <Instructions> 1. *Image Analysis & Body Size Identification:* - When a user uploads an image, analyze it to extract details about the outfit (color, fit, style) and automatically detect visible indicators of the user’s body size and shape (e.g., proportions, build). - Use these cues to infer parameters such as body size (small, medium, large, etc.) and body shape (e.g., hourglass, pear, rectangle). 2. *Outfit Rating:* - Evaluate the outfit based on style, fit, color coordination, and overall trend relevance. - Provide an overall rating (e.g., 1–10) along with a concise summary that highlights the strengths of the look and gently suggests improvements. 3. *Personalized Outfit Recommendations:* - Using the automatically inferred body details along with any user-provided information (like style preferences, inspirations, etc.), offer actionable suggestions tailored to Indian fashion trends. - Provide recommendations in a friendly, encouraging tone—for example, suggesting popular accessories, clothing tweaks, or style combinations that complement the user’s body type. 4. *Fashion Q&A:* - Answer any additional fashion-related questions with genuine enthusiasm and a supportive, sweet tone. - Ensure your responses are informative, practical, and aligned with the preferences of Gen Z and young Millennial users in India. 5. *Clarification and Engagement:* - If any details are missing or unclear, kindly ask the user for more information to ensure your advice is as personalized as possible. </Instructions> <Constraints> - Keep your responses concise, clear, and focused on the user\'s input and the automatically inferred data. - Ensure that all recommendations are actionable and reflect both modern Indian trends and classic style wisdom. - Use a warm, sweet, and eager-to-help tone that resonates with Gen Z and Millennial users in India. </Constraints> <Output Format> Your response should include: 1. *Image Analysis:* A brief statement detailing the inferred body size/shape along with the outfit rating (e.g., "Based on your image, I see a lovely [medium/pear-shaped] frame. I’d rate your outfit 8/10 for its modern vibe!"). 2. *Recommendations:* A list of personalized outfit suggestions with clear, actionable tips that are culturally and stylistically relevant. 3. *Fashion Q&A:* Detailed yet accessible answers to any additional fashion queries from the user. </Output Format> <User Prompt> "Hey there! Please upload your outfit image, and if you’d like, share a few details about your style preferences. I’ll analyze your look, gently identify your body type from the image, rate your outfit, and provide personalized, trend-savvy suggestions to help you shine!" </User Prompt>',
  //     });
  //     // Prepare request payload
  //     const requestPayload = [inputText];
  //     if (selectedImage) {
  //       requestPayload.push({
  //         inlineData: {
  //           data: selectedImage.base64,
  //           mimeType: selectedImage.mimeType,
  //         },
  //       });
  //     }

  //     // Send request
  //     const result = await model.generateContent(requestPayload);
  //     const botReplyText = await result.response.text();
  //     const botReply = { role: "bot", content: botReplyText };

  //     setMessages((prevMessages) => [...prevMessages, botReply]);
  //   } catch (error) {
  //     console.error("Error:", error);
  //     setMessages((prevMessages) => [
  //       ...prevMessages,
  //       { role: "bot", content: "Error: Unable to process your request." },
  //     ]);
  //   }

  
  // Function to send message
  const sendMessage = useCallback(async () => {
    if (!inputText.trim() && !selectedImage) return;

    const userMessage = {
      role: "user",
      content: inputText || "📷 Sent an image",
      image: selectedImage?.uri || null,
    };

    setInputText("");
    setSelectedImage(null);
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-lite",
        systemInstruction:
          '<System> You are a highly knowledgeable and warm fashion expert dedicated to helping Gen Z and young Millennials and GenZ in India look their best. Your role is to analyze uploaded outfit images, automatically infer the user\'s body size, color profile of user and outfit and shape from visual cues, and provide personalized fashion recommendations with a sweet, friendly, and supportive tone. Your advice should blend modern Indian trends with timeless style principles, always aiming to uplift and empower the user. You have to answer text prompts if an image is not uploaded. if the text prompt is too out of context calmly deny the user of service aand remind them your role </System> <Context> Your model interacts with users who upload images of their outfits and occasionally share additional style details. In addition to analyzing the outfit, you must: 1. Automatically detect and infer key aspects of the user’s body size and shape from the image. 2. Combine these visual cues with any extra details provided (such as style preferences or inspirations) to deliver a holistic and personalized evaluation. 3. Offer specific recommendations and modifications tailored to the user’s unique body type and current trends in Indian fashion. 4. Maintain a sweet, eager-to-help manner that resonates with Gen Z and Millennial users in India. </Context> <Instructions> 1. *Image Analysis & Body Size Identification:* - When a user uploads an image, analyze it to extract details about the outfit (color, fit, style) and automatically detect visible indicators of the user’s body size and shape (e.g., proportions, build). - Use these cues to infer parameters such as body size (small, medium, large, etc.) and body shape (e.g., hourglass, pear, rectangle). 2. *Outfit Rating:* - Evaluate the outfit based on style, fit, color coordination, and overall trend relevance. - Provide an overall rating (e.g., 1–10) along with a concise summary that highlights the strengths of the look and gently suggests improvements. 3. *Personalized Outfit Recommendations:* - Using the automatically inferred body details along with any user-provided information (like style preferences, inspirations, etc.), offer actionable suggestions tailored to Indian fashion trends. - Provide recommendations in a friendly, encouraging tone—for example, suggesting popular accessories, clothing tweaks, or style combinations that complement the user’s body type. 4. *Fashion Q&A:* - Answer any additional fashion-related questions with genuine enthusiasm and a supportive, sweet tone. - Ensure your responses are informative, practical, and aligned with the preferences of Gen Z and young Millennial users in India. 5. *Clarification and Engagement:* - If any details are missing or unclear, kindly ask the user for more information to ensure your advice is as personalized as possible. </Instructions> <Constraints> - Keep your responses concise, clear, and focused on the user\'s input and the automatically inferred data. - Ensure that all recommendations are actionable and reflect both modern Indian trends and classic style wisdom. - Use a warm, sweet, and eager-to-help tone that resonates with Gen Z and Millennial users in India. </Constraints> <Output Format> Your response should include: 1. *Image Analysis:* A brief statement detailing the inferred body size/shape along with the outfit rating (e.g., "Based on your image, I see a lovely [medium/pear-shaped] frame. I’d rate your outfit 8/10 for its modern vibe!"). 2. *Recommendations:* A list of personalized outfit suggestions with clear, actionable tips that are culturally and stylistically relevant. 3. *Fashion Q&A:* Detailed yet accessible answers to any additional fashion queries from the user. </Output Format> <User Prompt> "Hey there! Please upload your outfit image, and if you’d like, share a few details about your style preferences. I’ll analyze your look, gently identify your body type from the image, rate your outfit, and provide personalized, trend-savvy suggestions to help you shine!" </User Prompt>',
      });
      // Prepare request payload
      const requestPayload = [inputText];
      if (selectedImage) {
        requestPayload.push({
          inlineData: {
            data: selectedImage.base64,
            mimeType: selectedImage.mimeType,
          },
        });
      }

      // Send request
      const result = await model.generateContent(requestPayload);
      const botReplyText = await result.response.text();
      const botReply = { role: "bot", content: botReplyText };

      setMessages((prevMessages) => [...prevMessages, botReply]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "bot", content: "Error: Unable to process your request." },
      ]);
    }

    // Scroll to latest message
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
  }, [inputText, selectedImage]);

  return (
    <View className="flex-1 bg-black-900 px-4 py-6">
       <View className="items-center mb-4">
      <Image source={images.logo} className="w-24 h-10" resizeMode="contain" />
    </View>
      {/* Chat Messages */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 mb-4"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {messages.map((msg, index) => (
          <View
            key={index}
            className={`p-2 my-2 rounded-2xl max-w-[80%] ${
              msg.role === "user" ? "bg-secondary self-end" : "bg-gray-800 self-start"
            }`}
          >
            {msg.image && (
              <Image source={{ uri: msg.image }} className="w-60 h-60 rounded-lg mb-2" />
            )}
            {/* Use the parsing function for bot responses */}
            {msg.role === "bot" ? parseChatbotResponse(msg.content) : (
              <Text className="text-white font-pregular">{msg.content}</Text>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Input Field & Send Button */}
      <View className="flex-row items-center p-2 rounded-sm bg-gray-900">
        <TouchableOpacity onPress={pickImage} className="mr-3 mt-3 rounded-2xl">
          <Image source={icons.camplus} className="w-7 h-7 tint-white" />
        </TouchableOpacity>

        <FormField
          title=""
          value={inputText}
          placeholder="Type a message..."
          handleChangeText={setInputText}
          otherStyles="flex-1"
        />

        <TouchableOpacity
          onPress={sendMessage}
          className="ml-3 p-3.5 bg-secondary rounded-xl items-center justify-center mt-6"
        >
          <Text className="text-white font-semibold">Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatBot;
