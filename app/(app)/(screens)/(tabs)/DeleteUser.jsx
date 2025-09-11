import { router } from "expo-router";
import {
  EmailAuthProvider,
  deleteUser,
  getAuth,
  reauthenticateWithCredential,
} from "firebase/auth";
import { useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { useAuth } from "../../../../context/AuthContext";

const DeleteAccountScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [password, setPassword] = useState("");
  const { logout } = useAuth();

  const handleDeleteAccount = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      try {
        const credential = EmailAuthProvider.credential(user.email, password);

        await reauthenticateWithCredential(user, credential);

        await deleteUser(user);
        Alert.alert("Success", "User account deleted successfully");
        setModalVisible(false);

        const response = await logout();
        if (response.success) {
          router.replace("/");
        } else {
          Alert.alert("Error", response.msg);
        }
        router.replace("/");
      } catch (error) {
        console.error("Error deleting user account:", error);
        Alert.alert("Error", `Error deleting user account: ${error.message}`);
      }
    } else {
      Alert.alert("Error", "No user is currently signed in");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.warningView}>
        <Text style={styles.warningText}>
          This operation will delete your account permanentely, and is
          irreversible. Are you sure you want to delete your account?
        </Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>Delete Account Permanantely</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.submitButton}
        onPress={() => router.replace("Profile")}
      >
        <Text style={styles.buttonText}>Cancel Account Deletion</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <TextInput
              placeholder="Enter your password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={styles.input}
            />
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDeleteAccount}
            >
              <Text style={styles.buttonText}>Confirm Deletion</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancel Deletion</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DeleteAccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: wp(90),
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  deleteButton: {
    height: hp(5),
    backgroundColor: "red",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    zIndex: -1,
    paddingHorizontal: 20,
    width: wp(80),
  },
  submitButton: {
    backgroundColor: "#90bc3b",
    height: hp(5),
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    zIndex: -1,
    paddingHorizontal: 20,
    width: wp(80),
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  warningText: {
    fontSize: 20,
  },
  warningView: {
    backgroundColor: "#c0c5ce",
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  input: {
    width: wp(80),
    height: hp(5),
    fontSize: hp(2),
    borderWidth: 0,
    paddingVertical: 0,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 10,
  },
});
