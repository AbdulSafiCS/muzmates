import { router } from "expo-router";
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import Toast from "react-native-toast-message";
import defaultProfileImage from "../../../../assets/images/bismillah.png";
import Loading from "../../../../components/Loading.jsx";
import Text from "../../../../components/Text.jsx";
import { useAuth } from "../../../../context/AuthContext";
import { USER_REF } from "../../../../FirebaseConfig.js";

const Profile = () => {
  const [editing, setEditing] = useState(false);
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const { logout, resetPassword } = useAuth();
  const {
    user,
    currentUser,
    loading,
    setLoading,
    profileImagePicker,
    allListings,
  } = useAuth();

  const handleLogout = async () => {
    const response = await logout();
    if (response.success) {
      router.replace("/");
      setLoading(false);
    } else {
      Alert.alert("Error", response.msg);
    }
  };

  const handlePasswordReset = async () => {
    try {
      const response = await resetPassword(currentUser[0].email);
      if (response.success) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Link Sent to Existing Email",
          position: "bottom",
        });
      } else {
        Alert.alert("something went wrong!");
      }
    } catch (error) {
      Alert.alert(error.msg);
    }
  };

  const startEditing = () => {
    if (currentUser.length > 0) {
      setFirstName(currentUser[0].firstName || "");
      setLastName(currentUser[0].lastName || "");
      setEmail(currentUser[0].email || "");
      setGender(currentUser[0].gender || "");
      setEditing(true);
    }
  };

  const handleUpdateProfile = async () => {
    if (currentUser.length === 0 || !currentUser[0].userId) {
      Alert.alert("Error", "No user data available to update.");
      return;
    }
    try {
      const userDoc = doc(USER_REF, currentUser[0].userId);
      await updateDoc(userDoc, {
        firstName,
        lastName,
        email,
        gender,
      });
      setEditing(false);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Profile Updated Succesfully!",
        position: "bottom",
      });
    } catch (error) {
      Alert.alert("Error", "Failed to update profile.");
    }
  };

  const handleImagePicker = () => {
    profileImagePicker();
  };

  if (user && loading) {
    return (
      <View style={styles.loadingContainer}>
        <Loading size={140} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      {editing ? (
        <View style={styles.container}>
          <TouchableOpacity
            onPress={handleImagePicker}
            style={styles.profilePictureContainer}
          >
            <Image
              source={
                currentUser[0]?.profilePicture
                  ? { uri: currentUser[0].profilePicture }
                  : defaultProfileImage
              }
              style={styles.profilePicture}
            />
          </TouchableOpacity>
          <View style={styles.formWrapper}>
            <View style={styles.infoContainer}>
              <Text style={styles.infoLabel}>First Name:</Text>
              <TextInput
                style={styles.editingInfoInput}
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.infoLabel}>Last Name:</Text>
              <TextInput
                style={styles.editingInfoInput}
                value={lastName}
                onChangeText={setLastName}
              />
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.infoLabel}>Email:</Text>
              <TextInput
                style={styles.editingInfoInput}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
            </View>
            <View>
              <Text style={styles.genderWarningText}>
                Contact support to change this field
              </Text>
              <View style={styles.infoContainer}>
                <Text style={styles.disabledGenderLabel}>Gender:</Text>
                <TextInput
                  style={[styles.editingInfoInput, styles.disabledGenderLabel]}
                  value={gender}
                  onChangeText={setGender}
                  editable={false}
                />
              </View>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={handleUpdateProfile}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setEditing(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          <View style={styles.container}>
            <TouchableOpacity
              onPress={handleImagePicker}
              style={styles.profilePictureContainer}
            >
              <Image
                source={
                  currentUser[0]?.profilePicture
                    ? { uri: currentUser[0].profilePicture }
                    : defaultProfileImage
                }
                style={styles.profilePicture}
              />
            </TouchableOpacity>
            <View style={styles.formWrapper}>
              <View style={styles.infoContainer}>
                <Text style={styles.infoLabel}>Full Name:</Text>
                <Text style={styles.infoText}>
                  {currentUser[0]?.firstName + " " + currentUser[0]?.lastName}
                </Text>
              </View>

              <View style={styles.infoContainer}>
                <Text style={styles.infoLabel}>Email:</Text>
                <Text style={styles.infoText}>{currentUser[0]?.email}</Text>
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.infoLabel}>Gender:</Text>
                <Text style={styles.infoText}>{currentUser[0]?.gender}</Text>
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.infoLabel}>Account Created:</Text>
                <Text style={styles.infoText}>
                  {user?.metadata?.creationTime
                    ? new Date(user.metadata.creationTime).toLocaleDateString()
                    : "N/A"}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={() => router.navigate("Listings")}
              >
                <Text style={styles.buttonText}>MY LISTINGS</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={handlePasswordReset}
              >
                <Text style={styles.buttonText}>RESET PASSWORD</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={startEditing}>
                <Text style={styles.buttonText}>EDIT PROFILE</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleLogout}>
                <Text style={styles.buttonText}>SIGN OUT</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => router.push("DeleteUser")}
              >
                <Text style={styles.buttonText}>DELETE ACCOUNT!</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-start", // not center
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 30,
    backgroundColor: "#fefefe",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fefefe",
  },

  formWrapper: {
    width: "100%",
    marginVertical: 10,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  editingInfoInput: {
    flex: 1,
    fontSize: hp(2),
    borderWidth: 0,
    paddingVertical: 10,
    backgroundColor: "white",
    paddingHorizontal: 10,
    marginLeft: 5,
  },
  infoContainer: {
    width: "100%",
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    fontFamily: "Poppins_700Bold",
  },
  infoText: {
    fontSize: 18,
    color: "#555",
    marginLeft: 5,
    overflow: "hidden",
  },
  disabledGenderLabel: {
    fontSize: 18,
    color: "gray",
  },
  genderWarningText: {
    marginTop: 40,
    color: "red",
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
    color: "#ffffff",
    fontFamily: "Poppins_700Bold",
  },
  deleteButton: {
    backgroundColor: "#ff0000",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
    width: "100%",
  },
  loading: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  profilePictureContainer: {
    marginBottom: 20,
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
    borderWidth: 0.5,
  },
  profilePicture: {
    width: "100%",
    height: "100%",
  },
});
