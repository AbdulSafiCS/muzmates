import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { useMemo, useRef } from "react";
import { StyleSheet, View } from "react-native";
import MapView from "react-native-maps";
import PublicListing from "../../../../components/PublicListing";
import Text from "../../../../components/Text";
import { useAuth } from "../../../../context/AuthContext";

const HomeScreen = () => {
  const snapPoints = useMemo(() => ["20%", "60%", "80%"], []);
  const { listingsWithUserData = [] } = useAuth();
  const bottomSheetRef = useRef(null);

  const renderItem = ({ item }) => (
    <View style={styles.itemWrap}>
      <PublicListing
        listingName={item.listingName}
        listingPrice={item.listingPrice}
        listingAddress={item.listingAddress}
        listingImages={item.listingImages}
        numberOfBeds={item.numberOfBeds}
        numberOfBaths={item.numberOfBaths}
        userName={item.user?.firstName ?? "Unknown"}
        userProfilePicture={item.user?.profilePicture}
      />
      <View style={styles.divider} />
    </View>
  );

  //const keyExtractor = (item, index) => String(item.docId ?? index);

  return (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        index={0}
        enablePanDownToClose
        onClose={() => bottomSheetRef.current?.snapToIndex(0)} // bounce back open
        backgroundStyle={styles.bottomSheetBackground}
      >
        <BottomSheetFlatList
          data={listingsWithUserData}
          keyExtractor={(item, index) =>
            String(item.docId || item.id || `${item.listingAddress}-${index}`)
          }
          renderItem={renderItem}
          contentContainerStyle={styles.listingsContainer}
          ListHeaderComponent={
            <Text style={styles.sheetHeadline}>MuzMates Near You</Text>
          }
          ListEmptyComponent={
            <View style={{ padding: 16 }}>
              <Text style={styles.noListingsText}>No listings available.</Text>
            </View>
          }
        />
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomSheetBackground: { backgroundColor: "white" },
  sheetContentContainer: { flex: 1, backgroundColor: "white", width: "100%" },
  sheetHeadline: {
    fontSize: 24,
    paddingVertical: 10,
    textAlign: "center",
    margin: 10,
    fontFamily: "Poppins_700Bold",
  },
  listingsContainer: { backgroundColor: "white", paddingBottom: 24 },
  noListingsText: {
    fontSize: 16,
    color: "#757575",
    marginTop: 8,
    textAlign: "center",
  },
  mapContainer: { flex: 1, height: "100%", width: "100%" },
  map: { width: "100%", height: "100%" },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  itemWrap: { paddingHorizontal: 12, paddingTop: 8 },
  divider: {
    height: 1,
    width: "100%",
    backgroundColor: "#D3D3D3",
    marginTop: 12,
    marginBottom: 12,
  },
});

export default HomeScreen;
