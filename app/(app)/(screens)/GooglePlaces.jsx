import { useNavigation } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import GooglePlacesTextInput from "react-native-google-places-textinput";
import Icon from "react-native-vector-icons/Octicons";
import { useAuth } from "../../../context/AuthContext";
import { GOOGLE_PLACES_KEY } from "../../../env";

export default function GooglePlaces() {
  const navigation = useNavigation();
  const { setListingAddress, setListingLat, setListingLon } = useAuth();

  const handlePlaceSelect = async (p) => {
    try {
      const placeId =
        p?.placeId ||
        (typeof p?.place === "string" ? p.place.split("/").pop() : undefined);

      // Full display text like, "Hollywood, Los Angeles, CA, USA"
      const addressText =
        p?.text?.text ||
        [
          p?.structuredFormat?.mainText?.text,
          p?.structuredFormat?.secondaryText?.text,
        ]
          .filter(Boolean)
          .join(", ");

      const label = p?.structuredFormat?.mainText?.text || null;

      const secondary = p?.structuredFormat?.secondaryText?.text || "";
      const parts = secondary.split(",").map((s) => s.trim());
      const parentCity = parts[0] || null;
      const stateCode = parts[1] || null;
      const countryCode = parts[2] || null;

      const isCity = p?.types?.includes("locality");
      const city = isCity ? label || parentCity : parentCity || label;

      let lat = null,
        lng = null,
        formattedAddress = addressText;

      if (placeId) {
        //const key = GOOGLE_PLACES_KEY;
        const url =
          `https://places.googleapis.com/v1/places/${placeId}` +
          `?fields=location,formattedAddress,displayName` +
          `&key=${GOOGLE_PLACES_KEY}`;

        const res = await fetch(url, { method: "GET" });
        if (res.ok) {
          const json = await res.json();
          lat = json?.location?.latitude ?? null;
          lng = json?.location?.longitude ?? null;
          formattedAddress = json?.formattedAddress || formattedAddress;
        } else {
          console.warn("Places details fetch failed:", await res.text());
        }
      }

      // Update context with selected place details
      setListingAddress(formattedAddress || addressText);

      if (lat != null) setListingLat(lat);
      if (lng != null) setListingLon(lng);
    } catch (e) {
      console.error("handlePlaceSelect error:", e);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.header}>ADD NEW LISTING</Text>
        <Text>Select City Only:</Text>

        <View style={styles.form}>
          <Icon name="location" size={20} color="gray" style={styles.icon} />

          <View style={styles.inputWrap}>
            <GooglePlacesTextInput
              apiKey={GOOGLE_PLACES_KEY}
              placeHolderText="Search for a city..."
              showClearButton
              onPlaceSelect={handlePlaceSelect}
              onError={(e) => console.error("Places error:", e)}
              minCharsToFetch={2}
              debounceDelay={300}
              languageCode="en"
              types={["locality", "sublocality", "neighborhood"]}
              style={{
                container: styles.gpContainer,
                input: styles.gpInput,
                suggestionsContainer: styles.gpSuggestions,
                suggestionItem: styles.gpSuggestionItem,
                suggestionText: {
                  main: styles.gpMainText,
                  secondary: styles.gpSecondaryText,
                },
                placeholder: { color: "#ccc" },
              }}
            />
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>DONE</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  innerContainer: { padding: 16 },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },

  form: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#f0f0f0ff",
    paddingHorizontal: 10,
    paddingVertical: 5,
    minHeight: 60,
    justifyContent: "center",
    position: "relative",
    zIndex: 10,
  },
  icon: { marginRight: 8 },

  inputWrap: { flex: 1, minWidth: 0 },

  // Google Places styles
  gpContainer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    alignSelf: "stretch",
    minWidth: 0,
    marginVertical: 0,
    paddingVertical: 0,
  },
  gpInput: {
    width: "100%",
    alignSelf: "stretch",
    fontSize: 16,
    color: "black",
    backgroundColor: "#f0f0f0ff",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 0,
  },
  gpSuggestions: {
    position: "absolute",
    top: "100%", // appear directly below the input
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 4, // shadow for Android
    zIndex: 9999, // ensure on top
    maxHeight: 250,
  },
  gpSuggestionItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#000000ff",
  },
  gpMainText: { fontSize: 16, color: "#222" },
  gpSecondaryText: { fontSize: 13, color: "#000000ff" },

  // Submit button styles
  submitButton: {
    backgroundColor: "#90bc3b",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    marginHorizontal: 16,
  },
  buttonText: { fontSize: 18, color: "white", fontWeight: "bold" },
});
