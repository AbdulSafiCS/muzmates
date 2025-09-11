import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/Octicons";
import ProgressBar from "../../../../components/ProgressBar.jsx";
import { useAuth } from "../../../../context/AuthContext";
import { FIRESTORE_DB } from "../../../../FirebaseConfig";

const AddListing = () => {
  const [listingName, setListingName] = useState("");
  const [listingPrice, setListingPrice] = useState("");
  const [isApproved, setIsApproved] = useState(false);
  const [isPending, setIsPending] = useState(true);
  const [isRejected, setIsRejected] = useState(false);
  const [listingDescription, setListingDescription] = useState("");
  const [numberOfBaths, setNumberOfBaths] = useState(0);
  const [numberOfBeds, setNumberOfBeds] = useState(0);
  const CHARACTER_LIMIT = 500;
  const [charCount, setCharCount] = useState(0);

  const [uploading, setUploading] = useState(false);

  const {
    listingAddress,
    listingLat,
    listingLon,
    uploadProgress,
    listingImages,
    setListingImages,
    user,
    currentUser,
    listingImagePicker,
  } = useAuth();
  const incrementBeds = () => setNumberOfBeds((prev) => prev + 1);
  const decrementBeds = () => setNumberOfBeds((prev) => Math.max(0, prev - 1));
  const incrementBaths = () => setNumberOfBaths((prev) => prev + 1);
  const decrementBaths = () =>
    setNumberOfBaths((prev) => Math.max(0, prev - 1));

  const handleImagePicker = async () => {
    listingImagePicker();
  };

  const handleAddListing = async () => {
    try {
      const listingGender = currentUser?.[0]?.gender ?? "";
      if (
        !listingName ||
        !listingAddress ||
        !listingPrice ||
        numberOfBaths === 0 ||
        numberOfBeds === 0
      ) {
        Alert.alert("Fields", "Please fill in all the fields!");
        return;
      }
      if (!listingAddress) {
        Alert.alert("Select a City, Please");
        return;
      }
      if (!listingImages || listingImages.length < 1) {
        Alert.alert("Images", "Please upload at least one image to continue!");
        return;
      }

      //force price to number
      const priceNumber = Number(listingPrice);
      if (Number.isNaN(priceNumber)) {
        Alert.alert("Price", "Listing price must be a number.");
        return;
      }

      // write the doc
      const docRef = await addDoc(collection(FIRESTORE_DB, "listings"), {
        listingName,
        listingPrice: priceNumber,
        listingAddress,
        listingGender,
        listingImages,
        isPending,
        isApproved,
        id: user?.uid,
        listingDescription,
        isRejected,
        numberOfBaths,
        numberOfBeds,
        listingLat,
        listingLon,
        createdAt: serverTimestamp(),
      });

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Listing Created Successfully!",
        position: "bottom",
      });

      // navgiate to the new document with the listingId
      router.push({
        pathname: "/Listings",
        params: { listingId: docRef.id },
      });
    } catch (error) {
      console.error("Add listing error:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error?.message || "Something went wrong creating the listing.",
        position: "bottom",
      });
    }
  };

  const handleRemoveImage = (uri) => {
    setListingImages(listingImages.filter((image) => image !== uri));
  };

  const handleDescriptionChange = (text) => {
    if (text.length <= CHARACTER_LIMIT) {
      setListingDescription(text);
      setCharCount(text.length);
    }
  };

  return (
    <View style={{ ...styles.container }}>
      <View style={{ ...styles.innerContainer, zIndex: 3000 }}>
        <TouchableOpacity
          style={styles.cityButton}
          onPress={() => router.push("GooglePlaces")}
        >
          <Text style={styles.buttonText}>
            {!listingAddress ? (
              "Select City"
            ) : (
              <View style={styles.cityButton}>
                <Ionicons name="checkmark" size={30} color="white" />
                <Text style={styles.buttonText}>{listingAddress}</Text>
              </View>
            )}
          </Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.select({ ios: "padding", android: "height" })}
        // Use ONLY KeyboardAvoidingView to adjust for keyboard.
        // Offset by the safe-area top (or your header height if you have one).
        keyboardVerticalOffset={Platform.select({ ios: 0, android: 0 })}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          // keep keyboard up while tapping/scrolling inputs & buttons
          keyboardShouldPersistTaps="always"
          // don't dismiss keyboard when dragging the scrollview
          keyboardDismissMode="none"
          // IMPORTANT: let KAV handle insets — turn this OFF
          automaticallyAdjustKeyboardInsets={false}
          bounces={false}
        >
          <View style={styles.innerContainer}>
            <View style={styles.formWrapper}>
              <View style={styles.form}>
                <Icon name="home" size={20} color="gray" />
                <TextInput
                  style={{ ...styles.input }}
                  placeholder="Listing Name..."
                  placeholderTextColor="gray"
                  value={listingName}
                  onChangeText={setListingName}
                />
              </View>
              <View style={styles.form}>
                <Icon name="tag" size={20} color="gray" />
                <TextInput
                  style={styles.input}
                  placeholder="Listing Price..."
                  placeholderTextColor="gray"
                  keyboardType="numeric"
                  value={listingPrice}
                  onChangeText={setListingPrice}
                />
              </View>

              <TouchableOpacity
                style={styles.imagePicker}
                onPress={handleImagePicker}
              >
                {listingImages.length > 0 ? (
                  <View style={styles.imageContainer}>
                    {listingImages.map((image, index) => (
                      <ImageBackground
                        key={`${image}-${index}`}
                        source={{ uri: image }}
                        style={styles.image}
                      >
                        <TouchableOpacity
                          style={styles.removeImageButton}
                          onPress={() => handleRemoveImage(image)}
                        >
                          <Text style={styles.removeImageText}>X</Text>
                        </TouchableOpacity>
                      </ImageBackground>
                    ))}
                  </View>
                ) : (
                  <View style={styles.placeholder}>
                    <Ionicons name="image-outline" size={28} color="gray" />
                    <Text style={styles.placeholderText}>
                      Tap to add photos
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
              {uploading && (
                <View style={styles.progressContainer}>
                  <Text style={styles.uploadText}>Uploading images</Text>
                  <ProgressBar progress={uploadProgress} />
                </View>
              )}
              <View style={{ flexDirection: "row", marginVertical: 10 }}>
                <View style={styles.counterContainer}>
                  <TouchableOpacity onPress={decrementBeds}>
                    <Ionicons
                      name="remove-circle-outline"
                      size={24}
                      color="black"
                    />
                  </TouchableOpacity>
                  <Ionicons name="bed" size={24} color="black" />
                  <Text style={styles.numberText}>{numberOfBeds} Beds</Text>
                  <TouchableOpacity onPress={incrementBeds}>
                    <Ionicons
                      name="add-circle-outline"
                      size={24}
                      color="black"
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.counterContainer}>
                  <TouchableOpacity onPress={decrementBaths}>
                    <Ionicons
                      name="remove-circle-outline"
                      size={24}
                      color="black"
                    />
                  </TouchableOpacity>
                  <FontAwesome name="bath" size={24} color="black" />
                  <Text style={styles.numberText}>{numberOfBaths} Baths</Text>
                  <TouchableOpacity onPress={incrementBaths}>
                    <Ionicons
                      name="add-circle-outline"
                      size={24}
                      color="black"
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={[styles.form, styles.descriptionContainer]}>
                <Icon
                  name="file"
                  size={20}
                  color="gray"
                  style={styles.descriptionIcon}
                />
                <TextInput
                  style={{ ...styles.descriptionInput, zIndex: 1000 }}
                  placeholder="Listing Description..."
                  placeholderTextColor="gray"
                  multiline={true}
                  value={listingDescription}
                  onChangeText={handleDescriptionChange}
                  returnKeyType="done"
                  blurOnSubmit
                />
              </View>
              <Text
                style={
                  charCount >= CHARACTER_LIMIT
                    ? styles.charLimitExceeded
                    : styles.charLimit
                }
              >
                {charCount >= CHARACTER_LIMIT
                  ? "Max character limit reached"
                  : `${CHARACTER_LIMIT - charCount} characters left`}
              </Text>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleAddListing}
              >
                <Text style={styles.buttonText}>Add Listing</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => router.push("Listings")}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default AddListing;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  innerContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  formWrapper: {
    gap: 12,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  form: {
    height: hp(7),
    flexDirection: "row",
    gap: 4,
    paddingHorizontal: 15,
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
  },
  descriptionContainer: {
    height: "auto",
    alignItems: "flex-start",
    paddingVertical: 20,
    minHeight: hp(15),
  },
  descriptionInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 10,
    color: "black",
    textAlignVertical: "top",
    height: hp(18),
  },
  input: {
    flex: 1,
    fontSize: hp(2),
    borderWidth: 0,
    paddingVertical: 0,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 10,
  },

  descriptionIcon: {
    marginTop: 10,
  },

  imagePicker: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "gray",
    padding: 15,
    backgroundColor: "#f0f0f0",
    marginVertical: 10,
    zIndex: -1,
    flexDirection: "row",
  },
  placeholder: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  placeholderText: {
    color: "gray",
    fontSize: 16,
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    marginBottom: 10,
    position: "relative",
  },
  removeImageButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 5,
    right: 5,
    width: 30,
    height: 30,
    backgroundColor: "white",
    borderRadius: 100,
    padding: 4,
  },
  removeImageText: {
    color: "red",
    fontWeight: "900",
    fontSize: 12,
    textAlign: "center",
  },
  submitButton: {
    backgroundColor: "#90bc3b",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    zIndex: -1,
  },
  cancelButton: {
    backgroundColor: "#f13f17ff",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    zIndex: -1,
    marginBottom: 90,
  },
  cityButton: {
    flexDirection: "row",
    backgroundColor: "#90bc3b",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    zIndex: -1,
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  charLimit: {
    fontSize: 14,
    color: "gray",
    alignSelf: "flex-end",
    marginRight: 10,
  },
  charLimitExceeded: {
    fontSize: 14,
    color: "red",
    alignSelf: "flex-end",
    marginRight: 10,
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
