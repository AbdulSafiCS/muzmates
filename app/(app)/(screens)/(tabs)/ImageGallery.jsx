import { useNavigation, useRoute } from "@react-navigation/native";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const screenWidth = Dimensions.get("window").width;

const ImageGallery = () => {
  const route = useRoute();
  const { listingImages } = route.params;
  const navigation = useNavigation();

  const renderImage = ({ item }) => (
    <Image source={{ uri: item }} style={styles.imageThumbnail} />
  );

  if (!listingImages || listingImages.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No images to display</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("Listings")}
      >
        <Icon name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
      <FlatList
        data={listingImages}
        renderItem={renderImage}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.imageGallery}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
    marginTop: 20,
  },
  imageGallery: {
    padding: 10,
    paddingBottom: 50,
    paddingTop: 80,
    width: "100%",
    alignItems: "center",
  },
  imageThumbnail: {
    width: screenWidth * 0.9,
    height: screenWidth * 0.9 * 0.75,
    marginVertical: 10,
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
});

export default ImageGallery;
