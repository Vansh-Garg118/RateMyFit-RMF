import React from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

const TryOn = () => {
  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: "https://kwai-kolors-kolors-virtual-try-on.hf.space" }}
        style={styles.webview}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default TryOn;