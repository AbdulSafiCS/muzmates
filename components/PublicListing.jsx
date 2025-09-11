import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Text from "../components/Text";
import { useAuth } from "../context/AuthContext";

const PublicListing = ({
  listingName,
  listingPrice,
  listingAddress,
  listingImages,
  numberOfBeds,
  numberOfBaths,
  userName,
  userProfilePicture,
}) => {
  const [loadingImages, setLoadingImages] = useState([]);

  const { allListings } = useAuth();

  useEffect(() => {
    setLoadingImages(new Array(allListings.length).fill(true));
  }, []);

  const handleImageLoad = (index) => {
    const updatedLoadingImages = [...loadingImages];
    updatedLoadingImages[index] = false;
    setLoadingImages(updatedLoadingImages);
  };
  return (
    <View style={styles.container}>
      <View style={styles.userInfoContainer}>
        <Image
          source={{ uri: userProfilePicture }}
          style={styles.profilePicture}
        />
        <Text style={styles.userName}>{userName}</Text>
        <TouchableOpacity onPress={() => router.navigate("ListingProfileInfo")}>
          <Entypo name="arrow-with-circle-right" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.imageScroll}
      >
        {listingImages.map((image, imgIndex) => (
          <View key={imgIndex} style={styles.imageContainer}>
            {loadingImages[imgIndex] && (
              <ActivityIndicator style={styles.imageLoader} size="large" />
            )}
            <Image
              source={{ uri: image }}
              style={styles.image}
              resizeMode="cover"
              onLoad={() => handleImageLoad(imgIndex)}
            />
          </View>
        ))}
      </ScrollView>
      <View style={styles.cardDetails}>
        <View style={styles.listingDetails}>
          <Text style={styles.title}>{listingName}</Text>
          <Text style={styles.price}>${listingPrice}/month</Text>
          <Text style={styles.address}>Near {listingAddress}</Text>
          <View style={styles.rowContainer}>
            <View style={styles.counterContainer}>
              <Ionicons name="bed" size={24} color="black" />
              <Text style={styles.numberText}>{numberOfBeds} Beds</Text>
            </View>

            <View style={styles.counterContainer}>
              <FontAwesome name="bath" size={24} color="black" />
              <Text style={styles.numberText}>{numberOfBaths} Baths</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Listing Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#555",
  },
  imageScroll: {
    height: 200,
    marginBottom: 10,
    zIndex: 1,
  },
  imageContainer: {
    position: "relative",
    height: 200,
    width: 300,
    marginRight: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  image: {
    height: "100%",
    width: "100%",
  },
  imageLoader: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -12.5 }, { translateY: -12.5 }],
  },
  listingDetails: {
    backgroundColor: "white",
    flex: 1,
  },
  button: {
    backgroundColor: "#90bc3b",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  cardDetails: {
    flex: 1,
    flexDirection: "column",
    width: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    fontFamily: "Poppins_700Bold",
  },
  price: {
    fontSize: 18,
    color: "#4caf50",
    fontWeight: "bold",
    marginBottom: 5,
  },
  address: {
    fontSize: 14,
    color: "#757575",
    marginBottom: 10,
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    backgroundColor: "#D6F0CB",
    padding: 10,
    borderRadius: 10,
  },
  arrowIcon: {
    marginLeft: 10,
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
    flex: 1,
  },
  rowContainer: {
    flexDirection: "row",

    marginVertical: 10,
  },
  counterContainer: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flex: 1,
    marginHorizontal: 5,
    justifyContent: "space-between",
    alignItems: "center",
  },
  numberText: {
    fontSize: 18,
    paddingHorizontal: 10,
    color: "black",
    textAlign: "center",
  },
});

export default PublicListing;
