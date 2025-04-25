import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { images } from "../../constants";
const PostCard = ({ post, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={() => onPress(post)}>
    <Image source={{ uri: post.image }} style={styles.cardImage} />
    <Text style={styles.cardTitle}>{post.title}</Text>
  </TouchableOpacity>
);

export default function trends() {
  const [selectedPost, setSelectedPost] = useState(null);

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard post={item} onPress={setSelectedPost} />
        )}
        ListHeaderComponent={
          <>
            <View className="px-4 pt-6 pb-4">
              <View className="flex-row justify-between items-center mb-6">
                <View>
                  <Text className="text-3xl font-psemibold text-white">Trends</Text>
                </View>
                <View>
                  <Image
                    source={images.logoSmall}
                    className="w-10 h-10"
                    resizeMode="contain"
                  />
                </View>
              </View>
        
              <View className="mt-2 mb-4">
                <Text className="text-gray-100 text-base font-pregular">
                  Discover the latest trend.
                </Text>
              </View>
            </View>
          </>
        }
        
      />

      <Modal
        visible={!!selectedPost}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSelectedPost(null)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Image
                source={{ uri: selectedPost?.image }}
                style={styles.modalImage}
              />
              <Text style={styles.modalTitle}>{selectedPost?.title}</Text>
              <Text style={styles.modalDescription}>
                {selectedPost?.description}
              </Text>
              <TouchableOpacity
                onPress={() => setSelectedPost(null)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#111827",
  },
  card: {
    backgroundColor: "#1E1E2D",
    borderRadius: 10,
    marginBottom: 15,
    overflow: "hidden",
    elevation: 3,
    height: 320,
    marginHorizontal: 15,
  },
  cardImage: {
    width: "100%",
    height: 275,
  },
  cardTitle: {
    fontSize: 18,
    padding: 10,
    fontWeight: "bold",
    color: "white",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#111827",
    borderRadius: 15,
    padding: 15,
    maxHeight: "80%",
  },
  modalImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 10,
    color: "white",
  },
  modalDescription: {
    fontSize: 16,
    color: "#fff",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#8E97FD",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

const posts = [
  {
    id: "1",
    title: " Sustainable and Eco-Friendly Fabrics",
    description:
      "Embracing sustainability, Indian fashion is witnessing a surge in eco-friendly materials like organic cotton, hemp, and bamboo silk. These fabrics not only reduce environmental impact but also offer comfort and versatility.",
    image: "../../assets/trendImg/ecp1",
  },
  {
    id: "2",
    title: "Fusion Wear: East Meets West",
    description:"The blend of traditional Indian attire with contemporary Western styles is gaining momentum. Think lehengas paired with crop tops, sarees draped over jeans, or kurtas styled as dresses.",
       image: "../../assets/trendImg/FusionWear2",
  },
  {
    id: "3",
    title: "Vibrant and Bold Colors",
    description:
      "2025 is witnessing a resurgence of bold and vibrant hues in fashion. From electric oranges and sunny yellows to striking jewel tones like emerald green and sapphire blue, these colors are making strong statements in both traditional and contemporary outfits.",
    image: "../../assets/trendImg/VibrantBold3",
  },
  {
    id: "4",
    title: "Minimalist Traditional Wear",
    description:
      "Alongside bold colors, there's a growing appreciation for minimalist designs in traditional wear. Clean lines, subtle embellishments, and muted tones are defining this trend, focusing on the elegance of fabrics like silk and satin.",
    image: "../../assets/trendImg/minimilistic4",
  },
  {
    id: "5",
    title: "Bohemian Daydream",
    description:
      "Boho-chic styles are making a significant comeback, characterized by flowy silhouettes, earthy tones, and intricate patterns. This trend celebrates individuality and freedom, often incorporating elements like fringe, embroidery, and layered accessories.",
    image: "../../assets/trendImg/5",
  },
  {
    id: "6",
    title: "Elevated Athleisure",
    description:
      "The athleisure trend evolves in 2025, blending comfort with sophistication. Expect to see tailored joggers, chic hoodies, and sleek sneakers becoming staples not just for workouts but also for casual and semi-formal settings.",
    image: "../../assets/trendImg/Eleveted6",
  },
  {
    id: "7",
    title: "Coastal Cool",
    description:
      "Inspired by beachside aesthetics, the coastal cool trend introduces breezy fabrics, nautical stripes, and relaxed fits into everyday wear. This style emphasizes comfort and simplicity, often featuring light colors and natural materials.",
    image: "../../assets/trendImg/Coastal7",
  },
  {
    id: "8",
    title: "Pretty Pastels",
    description:
      "Soft pastel shades are dominating the color palette this season. From mint greens and baby blues to blush pinks and lavender, these hues bring a sense of calm and freshness to outfits, suitable for both daytime and evening wear.",
    image: "../../assets/trendImg/pastels8",
  },
  {
    id: "9",
    title: "Statement Accessories",
    description:
      "Accessories are taking center stage in 2025. Oversized earrings, chunky necklaces, and bold handbags are being used to elevate simple outfits. These statement pieces allow individuals to showcase their personality and add a touch of drama to their look.",
    image: "../../assets/trendImg/accessories9",
  },
  {
    id: "10",
    title: "Revival of Traditional Crafts",
    description:
      "There's a renewed interest in traditional Indian crafts like block printing, handloom weaving, and embroidery. Designers are incorporating these techniques into modern silhouettes, preserving cultural heritage while appealing to contemporary tastes.",
    image: "../../assets/trendImg/cultural10",
  },
];
