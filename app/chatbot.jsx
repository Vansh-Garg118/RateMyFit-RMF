import React, { useState, useCallback, useRef } from "react";
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from "react-native";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.EXPO_PUBLIC_G_API_KEY// Add your Google AI Studio API Key

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const scrollViewRef = useRef(null);

  const sendMessage = useCallback(async () => {
    if (!inputText.trim()) return;

    const userMessage = { role: "user", content: inputText };

    // Optimized: Clear input **before** API call to prevent lag
    setInputText("");

    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(inputText);
      const botReply = await result.response.text();

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "bot", content: botReply },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "bot", content: "Error: Unable to get response." },
      ]);
    }
    
    // Scroll to bottom after sending a message
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
  }, [inputText]); // Only re-run when inputText changes

  return (
    <View style={styles.container}>
      <ScrollView style={styles.chatContainer} ref={scrollViewRef}>
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
          returnKeyType="send"
          onSubmitEditing={sendMessage} // Pressing "Enter" sends the message
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

export default ChatBot;
