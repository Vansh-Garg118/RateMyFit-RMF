import React, { useState } from "react";
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from "react-native";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {G_API_KEY} from "../../.env"

const API_KEY = G_API_KEY; // Replace with your actual Google AI Studio API Key

console.log(API_KEY)

const trends = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    // Add user message to chat
    const userMessage = { role: "user", content: inputText };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      // Initialize Google AI
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Send request to Gemini API
      const result = await model.generateContent(inputText);
      const botReply = await result.response.text();

      // Add bot response to chat
      const botMessage = { role: "bot", content: botReply };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prevMessages) => [...prevMessages, { role: "bot", content: "Error: Unable to get response." }]);
    }

    setInputText("");
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.chatContainer}>
        {console.log(messages)}
        {messages.map((msg, index) => (
          <View key={index} style={msg.role === "user" ? styles.userMessage : styles.botMessage}>
            <Text>{msg.content}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  chatContainer: { flex: 1, marginBottom: 10 },
  userMessage: { alignSelf: "flex-end", backgroundColor: "#ADD8E6", padding: 8, marginVertical: 4, borderRadius: 10 },
  botMessage: { alignSelf: "flex-start", backgroundColor: "#E0E0E0", padding: 8, marginVertical: 4, borderRadius: 10 },
  inputContainer: { flexDirection: "row", alignItems: "center", borderTopWidth: 1, paddingTop: 8 },
  input: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 8, marginRight: 8 },
});

export default trends;
