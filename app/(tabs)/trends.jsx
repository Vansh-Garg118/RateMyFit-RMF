import React, { useState } from 'react';
import { View, Text, FlatList, Image, Modal, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';


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
        keyExtractor={item => item.id}
        renderItem={({ item }) => <PostCard post={item} onPress={setSelectedPost} />}
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
              <Image source={{ uri: selectedPost?.image }} style={styles.modalImage} />
              <Text style={styles.modalTitle}>{selectedPost?.title}</Text>
              <Text style={styles.modalDescription}>{selectedPost?.description}</Text>
              <TouchableOpacity onPress={() => setSelectedPost(null)} style={styles.closeButton}>
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
    backgroundColor: '#f4f4f4',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 3,
    height: 320,
  },
  cardImage: {
    width: '100%',
    height: 275,
  },
  cardTitle: {
    fontSize: 18,
    padding: 10,
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    maxHeight: '80%',
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  modalDescription: {
    fontSize: 16,
    color: '#444',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#007bff',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


const posts = [
    {
      id: '1',
      title: 'Spring Streetwear 2025',
      description: 'Bold prints and oversized silhouettes are dominating the spring streetwear scene in 2025. Think graphic tees, cargo pants, and sneakers. This look pairs vibrant graphics with muted tones to create a bold yet wearable ensemble, perfect for urban settings and fashion-forward individuals looking to make a statement.',
      image: 'https://picsum.photos/seed/${50}/300/200',
    },
    {
      id: '2',
      title: 'Y2K Revival',
      description: 'Y2K fashion is back with a bang—metallics, butterfly clips, and low-rise jeans are trending hard among Gen Z and influencers. Nostalgic fashion from the early 2000s is reinvented with modern silhouettes, merging kitsch with couture in a playful yet polished way.',
      image: 'https://picsum.photos/seed/${1}/300/200',
    },
    {
      id: '3',
      title: 'Minimalist Neutrals',
      description: 'Monochrome outfits in beige, cream, and gray are the epitome of chic this season. Pair clean lines with structured accessories. This trend emphasizes simplicity and elegance, drawing inspiration from Scandinavian minimalism and soft tailoring.',
      image: 'https://picsum.photos/seed/${2}/300/200',
    },
    {
      id: '4',
      title: 'Denim on Denim',
      description: 'Denim is eternal. Layer jackets with jeans for a coordinated denim-on-denim look that screams effortless cool. Combine different washes and textures to add depth and personality to this rugged yet refined trend.',
      image: 'https://picsum.photos/seed/${3}/300/200',
    },
    {
      id: '5',
      title: 'Athleisure Luxe',
      description: 'Blending comfort with style, the athleisure trend includes elevated tracksuits, sleek sneakers, and sporty handbags. Luxurious fabrics like silk-blend jerseys and matte lycra give a high-end feel to otherwise casual looks.',
      image: 'https://picsum.photos/seed/${4}/300/200',
    },
    {
      id: '6',
      title: 'Sheer Layers',
      description: 'Sheer fabrics layered over bralettes or bold undergarments make a daring and trendy statement for 2025. This trend embraces body positivity and expressive fashion, allowing wearers to play with textures and transparency.',
      image: 'https://picsum.photos/seed/${5}/300/200',
    },
    {
      id: '7',
      title: 'Sustainable Chic',
      description: 'Eco-conscious fashion is not just a movement but a trend. Think upcycled fabrics and slow fashion pieces. Designers are combining sustainability with high fashion aesthetics to encourage mindful consumerism without compromising style.',
      image: 'https://picsum.photos/seed/${75}/300/200',
    },
    {
      id: '8',
      title: 'Power Suits with a Twist',
      description: 'Blazers in bright colors and asymmetrical cuts bring a fresh take to traditional power dressing. This new wave of tailoring emphasizes individuality, strength, and femininity with bold colors and unconventional cuts.',
      image: 'https://picsum.photos/seed/${15}/300/200',
    },
    {
      id: '9',
      title: 'Futuristic Accessories',
      description: 'Visors, holographic bags, and metallic belts are making a futuristic splash on runways and street style. These standout pieces act as conversation starters, transforming even basic outfits into high-concept looks.',
      image: 'https://picsum.photos/seed/${53}/300/200',
    },
    {
      id: '10',
      title: 'Cottagecore Comeback',
      description: 'Florals, flowy fabrics, and romantic aesthetics continue to dominate the dreamy world of cottagecore fashion. Inspired by pastoral life, this trend embraces femininity, comfort, and a return to slower, simpler living.',
      image: 'https://picsum.photos/seed/${85}/300/200',
    },
];
  