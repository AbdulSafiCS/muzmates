import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";

const Listing = ({
  listingId,
  listingName,
  listingPrice,
  listingAddress,
  listingImages = [],
  listingDescription,
  isPending,
  isRejected,
  numberOfBeds,
  numberOfBaths,
}) => {
  const navigation = useNavigation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = () => {
    if (currentImageIndex < listingImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handlePreviousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };
  const handleImagePress = () => {
    navigation.navigate("ImageGallery", {
      listingImages,
    });
  };

  return (
    <View style={styles.card}>
      {isPending && (
        <View style={styles.pendingBox}>
          <Text style={styles.pendingText}>Pending Approval</Text>
        </View>
      )}
      {isRejected && (
        <View style={styles.rejectedBox}>
          <Text style={styles.rejectedText}>Listing Rejected</Text>
        </View>
      )}
      <View style={styles.imageContainer}>
        <TouchableOpacity
          style={styles.arrowLeft}
          onPress={handlePreviousImage}
          disabled={currentImageIndex === 0}
        >
          <Text style={styles.arrowText}>
            {<AntDesign name="caretleft" size={24} color="white" />}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.photo} onPress={handleImagePress}>
          <Image
            source={{ uri: listingImages[currentImageIndex] }}
            style={styles.photo}
            resizeMode="cover"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.arrowRight}
          onPress={handleNextImage}
          disabled={currentImageIndex === listingImages.length - 1}
        >
          <Text style={styles.arrowText}>
            {<AntDesign name="caretright" size={24} color="white" />}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{listingName}</Text>
        <View style={styles.divider}></View>
        <Text style={styles.price}> ${listingPrice}/month</Text>
        <View style={styles.divider}></View>
        <Text style={styles.address}>Near {listingAddress}</Text>
        <View style={styles.divider}></View>
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
        <Text style={styles.title}>Listing Description: </Text>

        <Text style={styles.type}>{listingDescription}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("EditListing", { listingId })}
        >
          <Text style={styles.buttonText}>EDIT LISTING</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    marginVertical: 10,
    elevation: 3,
    alignSelf: "stretch",
    padding: 20,
    flex: 1,
    width: "100%",
    position: "relative",
  },
  pendingBox: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "orange",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    zIndex: 1,
  },
  rejectedBox: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "red",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    zIndex: 1,
  },
  rejectedText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  pendingText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    
  },
  imageContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  photo: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  arrowLeft: {
    position: "absolute",
    left: 10,
    zIndex: 2,
    padding: 10,
    borderRadius: 5,
  },
  arrowRight: {
    position: "absolute",
    right: 10,
    zIndex: 2,
    padding: 10,
    borderRadius: 5,
  },
  arrowText: {
    color: "#fff",
    fontSize: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    paddingBottom: 10,
  },
  type: {
    fontSize: 20,
    color: "#757575",
    marginVertical: 4,
  },
  price: {
    fontSize: 20,
    color: "#4caf50",
    fontWeight: "bold",
  },
  address: {
    fontSize: 15,
    color: "#757575",
    marginVertical: 4,
  },
  button: {
    width: "100%",
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#90bc3b",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  divider: {
    padding: 0.5,
    width: "100%",
    backgroundColor: "#D3D3D3",
    margin: 5,
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

export default Listing;
