import AntDesign from "@expo/vector-icons/AntDesign";
import { SafeAreaView, StyleSheet, View } from "react-native";
import Text from "../../../components/Text";

const ListingProfileInfo = () => {
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View>
          <AntDesign name="down" size={24} color="black" />
        </View>
        <Text style={styles.profileInfoTitle}>Listing Profile Info</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginVertical: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  profileInfoTitle: {
    fontSize: 20,
    fontFamily: "Poppins_700Bold",
  },
});

export default ListingProfileInfo;
