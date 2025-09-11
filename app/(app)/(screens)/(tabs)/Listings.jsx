import { router } from "expo-router";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Listing from "../../../../components/Listing.jsx";
import Loading from "../../../../components/Loading.jsx";
import { useAuth } from "../../../../context/AuthContext";
import { FIRESTORE_DB } from "../../../../FirebaseConfig.js";

const Listings = ({ route }) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  const handleAddListing = () => {
    router.push("AddListing");
  };

  useEffect(() => {
    if (user) {
      const listingRef = query(
        collection(FIRESTORE_DB, "listings"),
        where("id", "==", user?.uid)
      );

      const subscriber = onSnapshot(listingRef, {
        next: (snapshot) => {
          const newListings = [];
          snapshot.docs.forEach((doc) => {
            newListings.push({
              id: doc.id,
              ...doc.data(),
            });
          });
          setListings(newListings);
          setLoading(false);
        },
      });
      return () => subscriber();
    }
  }, [user]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Loading size={140} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {listings.length === 0 ? (
          <View style={styles.noListingContainer}>
            <Text style={styles.listingAnnouncement}>
              No Listing Available Yet
            </Text>
            <TouchableOpacity
              style={styles.addButtonCentered}
              onPress={handleAddListing}
            >
              <Icon name="add" size={30} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          listings.map((listing) => (
            <View key={listing.id} style={styles.listingContainer}>
              <Listing
                listingAddress={listing.listingAddress}
                listingName={listing.listingName}
                listingPrice={listing.listingPrice}
                listingDescription={listing.listingDescription}
                listingImages={listing.listingImages || []}
                isPending={listing.isPending}
                isRejected={listing.isRejected}
                isApproved={listing.isApproved}
                numberOfBeds={listing.numberOfBeds}
                numberOfBaths={listing.numberOfBaths}
              />
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    width: "100%",
    paddingHorizontal: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fefefe",
  },
  listingHeader: {
    fontSize: 30,
    textAlign: "center",
    marginVertical: 20,
  },
  listingAnnouncement: {
    fontSize: 20,
    color: "gray",
    marginTop: 30,
    textAlign: "center",
  },
  listingContainer: {
    marginBottom: 20,
  },
  noListingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonCentered: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 20,
  },
});

export default Listings;
