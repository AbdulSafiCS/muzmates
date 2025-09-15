import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import {
  collection,
  doc,
  limit,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/Octicons";
import CustomKeyboardView from "../../../../components/CustomeKeyBoardView";
import { useAuth } from "../../../../context/AuthContext";
import { FIRESTORE_DB } from "../../../../FirebaseConfig";

const EditListing = () => {
  const [listingName, setListingName] = useState("");
  const [listingPrice, setListingPrice] = useState("");
  const [listingAddress, setListingAddress] = useState("");
  const [editingDocId, setEditingDocId] = useState(null);
  const [listingGender, setListingGender] = useState("");
  const [listings, setListings] = useState([]);
  const [numberOfBaths, setNumberOfBaths] = useState(0);
  const [numberOfBeds, setNumberOfBeds] = useState(0);

  const navigation = useNavigation();
  const [listingDescription, setListingDescription] = useState("");
  const CHARACTER_LIMIT = 500;
  const [charCount, setCharCount] = useState(0);
  const {
    user,
    currentUser,
    loading,
    //fetchUser,
    listingImagePicker,
    listingImages,
    setListingImages,
    uploading,
  } = useAuth();
  const incrementBeds = () => setNumberOfBeds((prev) => prev + 1);
  const decrementBeds = () => setNumberOfBeds((prev) => Math.max(0, prev - 1));
  const incrementBaths = () => setNumberOfBaths((prev) => prev + 1);
  const decrementBaths = () =>
    setNumberOfBaths((prev) => Math.max(0, prev - 1));

  useEffect(() => {
    const fetchListings = async () => {
      const listingRef = collection(FIRESTORE_DB, "listings");
      const subscriber = onSnapshot(listingRef, {
        next: (snapshot) => {
          const newListings = [];

          snapshot.docs.forEach((doc) => {
            newListings.push({ ...doc.data(), id: doc.id });
          });
          setListings(newListings);
        },
      });
      return () => subscriber();
    };

    fetchListings();
  }, []);

  useEffect(() => {
    if (!user?.uid) return;

    const base = collection(FIRESTORE_DB, "listings");
    const q = query(base, where("id", "==", user.uid), limit(1));

    const unsub = onSnapshot(
      q,
      (snap) => {
        if (snap.empty) {
          setEditingDocId(null);
          Toast.show({
            type: "info",
            text1: "No listing found for this user.",
          });
          return;
        }
        const d = snap.docs[0];
        const data = d.data();
        setEditingDocId(d.id);

        setListingName(data.listingName ?? "");
        setListingPrice(data.listingPrice ?? "");
        setListingAddress(data.listingAddress ?? "");
        setListingDescription(data.listingDescription ?? "");
        setListingImages(data.listingImages ?? []);
        setNumberOfBeds(data.numberOfBeds ?? 0);
        setNumberOfBaths(data.numberOfBaths ?? 0);
        setListingGender(data.listingGender ?? currentUser?.[0]?.gender ?? "");
        setCharCount((data.listingDescription ?? "").length);
      },
      (err) => {
        console.error(err);
        Toast.show({ type: "error", text1: "Error loading listing" });
      }
    );

    return unsub;
  }, [user?.uid]);

  const handleImagePicker = async () => {
    listingImagePicker();
  };

  const handleUpdateListing = async () => {
    if (
      listingName === "" ||
      listingAddress === "" ||
      listingPrice === "" ||
      listingDescription === "" ||
      listingAddress === "" ||
      numberOfBaths == 0 ||
      numberOfBaths == 0
    ) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please, fill the required fields",
        position: "bottom",
      });
      return;
    }
    if (listingImages.length < 1) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please, upload at least one image",
        position: "bottom",
      });
      return;
    }
    try {
      const docRef = doc(FIRESTORE_DB, "listings", listings[0]?.id);
      await updateDoc(docRef, {
        listingName,
        listingPrice,
        listingAddress,
        listingImages,
        listingGender,
        id: user?.uid,
        listingDescription,
        numberOfBaths,
        numberOfBeds,
      });
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Listing Updated Successfully!",
        position: "bottom",
      });
      navigation.navigate("Listings");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: { error },
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
    <View style={{ ...styles.container, zIndex: 3000 }}>
      <View style={{ ...styles.innerContainer, zIndex: 3000 }}>
        <Text style={styles.header}>EDIT LISTING</Text>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => router.push("GooglePlaces")}
        >
          <Text style={styles.buttonText}>
            {!listingAddress ? "Select City" : <Text>{listingAddress}</Text>}
          </Text>
        </TouchableOpacity>
      </View>
      <CustomKeyboardView>
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
              <Text>Upload Images</Text>
              {listingImages?.length > 0 && (
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
                  <Ionicons name="add-circle-outline" size={24} color="black" />
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
                  <Ionicons name="add-circle-outline" size={24} color="black" />
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
              onPress={handleUpdateListing}
            >
              <Text style={styles.buttonText}>Update Listing</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.navigate("Listings")}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CustomKeyboardView>
    </View>
  );
};

export default EditListing;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  innerContainer: {
    padding: 16,
  },
  formWrapper: {
    gap: 12,
    paddingTop: 16,
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

  textInputContainer: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingHorizontal: 10,
  },
  descriptionIcon: {
    marginTop: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 10,
    color: "black",
    height: hp(7),
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
  },
  listView: {
    position: "absolute",
    top: 45,
    left: 0,
    right: 0,
    zIndex: 3000,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 5,
  },
  row: {
    backgroundColor: "#FFFFFF",
    padding: 13,
    height: 44,
    flexDirection: "row",
  },
  description: {
    fontSize: 16,
  },
  predefinedPlacesDescription: {
    color: "#1faadb",
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
    marginVertical: 10,
    zIndex: -1,
  },
  cancelButton: {
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
