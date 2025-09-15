import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import * as Location from "expo-location";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

import { useRouter } from "expo-router";
import PublicListing from "../../../../components/PublicListing";
import Text from "../../../../components/Text";
import { useAuth } from "../../../../context/AuthContext";

const FALLBACK_REGION = {
  latitude: 34.0522,
  longitude: -118.2437,
  latitudeDelta: 0.25,
  longitudeDelta: 0.25,
};

const HomeScreen = () => {
  const snapPoints = useMemo(() => ["20%", "60%", "80%"], []);
  const { listingsWithUserData = [] } = useAuth();
  const router = useRouter();

  const bottomSheetRef = useRef(null);
  const mapRef = useRef(null);

  const [userRegion, setUserRegion] = useState(FALLBACK_REGION);
  const [hasLocation, setHasLocation] = useState(false);
  const [markers, setMarkers] = useState([]);

  // Ask for permission & get user location
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Location Permission",
            "We couldn’t get your location. You can enable it in Settings to see nearby listings."
          );
          return;
        }

        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const region = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        };

        setUserRegion(region);
        setHasLocation(true);

        // Smooth move to user
        if (mapRef.current) {
          mapRef.current.animateToRegion(region, 650);
        }
      } catch (e) {
        console.warn("Location error:", e);
      }
    })();
  }, []);

  // Build listing markers
  useEffect(() => {
    let isMounted = true;

    const loadMarkers = async () => {
      // Listings that already have coordinates
      const baseMarkers = [];
      listingsWithUserData.forEach((l, idx) => {
        if (typeof l.lat === "number" && typeof l.lng === "number") {
          baseMarkers.push({
            id: String(l.docId || l.id || idx), // <-- listing id
            title: l.listingName || l.listingAddress || "Listing",
            coordinate: { latitude: l.lat, longitude: l.lng },
            listIndex: idx,
          });
        }
      });

      // Geocode missing ones with original index
      const geocoded = [];
      for (let i = 0; i < listingsWithUserData.length; i++) {
        const item = listingsWithUserData[i];
        if (typeof item.lat === "number" && typeof item.lng === "number")
          continue;

        const address =
          item.listingAddress ||
          item.city ||
          (item.user && item.user.city) ||
          "";
        if (!address) continue;

        try {
          const results = await Location.geocodeAsync(address);
          if (results && results.length) {
            const { latitude, longitude } = results[0];
            geocoded.push({
              id: String(item.docId || item.id || `g-${i}`),
              title: item.listingName || address,
              coordinate: { latitude, longitude },
              listIndex: i,
            });
          }
        } catch (err) {
          console.warn("Geocoding failed for:", address, err);
        }
      }

      setMarkers([...baseMarkers, ...geocoded]);
    };
    loadMarkers();
    return () => {
      isMounted = false;
    };
  }, [listingsWithUserData]);

  const goToListing = (listingId) => {
    router.push({
      pathname: "/(screens)/listing/[id]",
      params: { id: String(listingId) },
    });
  };

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

  const recenterToUser = () => {
    if (!mapRef.current) return;
    mapRef.current.animateToRegion(userRegion, 650);
  };

  return (
    <View style={styles.mapContainer}>
      <MapView
        ref={mapRef}
        style={styles.map}
        // provider={PROVIDER_GOOGLE}
        initialRegion={FALLBACK_REGION}
        showsUserLocation
        followsUserLocation={false}
        showsCompass
        // native Android button
        showsMyLocationButton={Platform.OS === "android"}
        userInterfaceStyle="light"
        // onMapReady can pre-zoom to user if we already have it
        onMapReady={() => {
          if (hasLocation && mapRef.current) {
            mapRef.current.animateToRegion(userRegion, 650);
          }
        }}
      >
        {Array.isArray(markers) &&
          markers.map((m) => (
            <Marker
              key={m.id}
              coordinate={m.coordinate}
              title={m.title}
              onPress={() => goToListing(m.id)}
            />
          ))}
      </MapView>

      {/* Custom recenter button */}
      {hasLocation && (
        <TouchableOpacity style={styles.recenterBtn} onPress={recenterToUser}>
          <Ionicons name="locate" size={22} />
        </TouchableOpacity>
      )}

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        index={0}
        enablePanDownToClose
        onClose={() => bottomSheetRef.current?.snapToIndex(0)}
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
  recenterBtn: {
    position: "absolute",
    right: 16,
    top: 16,
    zIndex: 20,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 999,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
});

export default HomeScreen;
