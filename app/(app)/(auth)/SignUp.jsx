import { Octicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
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
import Toast from "react-native-toast-message";
import Loading from "../../../components/Loading.jsx";
import { useAuth } from "../../../context/AuthContext";

const SignUp = () => {
  const { register } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(true);
  const [loading, setLoading] = useState(false);
  const [deactivated, setDeactivated] = useState(true);

  useEffect(() => {
    if (emailAddress && password) {
      setDeactivated(false);
    } else {
      setDeactivated(true);
    }
  }, [emailAddress, password]);

  const handleSignUp = async () => {
    setLoading(true);
    if (!firstName || !lastName || !gender || !emailAddress || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      setLoading(false);
      return;
    }

    let response = await register(
      firstName,
      lastName,
      gender,
      emailAddress,
      password
    );
    if (!response.success) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Something went wrong! ",
        position: "bottom",
      });
      setLoading(false);
    } else {
      setLoading(false);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Account Created Succesfully!",
        position: "bottom",
      });
      router.navigate("Profile");
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.select({ ios: "padding", android: "height" })}
        // Use ONLY KeyboardAvoidingView to adjust for keyboard.
        // Offset by the safe-area top (or your header height if you have one).
        keyboardVerticalOffset={Platform.select({ ios: 0, android: 0 })}
      >
        <StatusBar style="dark" />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          // keep keyboard up while tapping/scrolling inputs & buttons
          keyboardShouldPersistTaps="always"
          // don't dismiss keyboard when dragging the scrollview
          keyboardDismissMode="none"
          // IMPORTANT: let KAV handle insets — turn this OFF
          automaticallyAdjustKeyboardInsets={false}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <StatusBar style="dark" />

          <View style={styles.imageWrapper}>
            {
              <Image
                style={{ height: hp(25) }}
                resizeMode="contain"
                source={require("../../../assets/images/muzmatessignupimage.png")}
              />
            }
          </View>
          <View style={styles.formWrapper}>
            <Text
              style={{
                fontSize: hp(4),
                fontWeight: "bold",
                letterSpacing: 2,
                textAlign: "center",
              }}
            >
              Welcome!
            </Text>
            <View style={styles.form}>
              <Octicons name="person" size={hp(2.7)} color={"gray"} />
              <TextInput
                style={styles.input}
                placeholderTextColor="gray"
                placeholder="First Name..."
                fontWeight="500"
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>
            <View style={styles.form}>
              <Octicons name="person" size={hp(2.7)} color={"gray"} />
              <TextInput
                style={styles.input}
                placeholderTextColor="gray"
                placeholder="Last Name..."
                fontWeight="500"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>

            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={[
                  styles.genderOption,
                  gender === "male" && styles.selectedGender,
                ]}
                onPress={() => setGender("male")}
              >
                <Text
                  style={[
                    styles.genderText,
                    gender === "male" && styles.selectedGenderText,
                  ]}
                >
                  Male
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderOption,
                  gender === "female" && styles.selectedGender,
                ]}
                onPress={() => setGender("female")}
              >
                <Text
                  style={[
                    styles.genderText,
                    gender === "female" && styles.selectedGenderText,
                  ]}
                >
                  Female
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.form}>
              <Octicons name="mail" size={hp(2.2)} color={"gray"} />
              <TextInput
                style={styles.input}
                placeholderTextColor="gray"
                placeholder="Email Address..."
                fontWeight="500"
                value={emailAddress}
                onChangeText={setEmailAddress}
              />
            </View>
            <View style={styles.form}>
              <Octicons name="lock" size={hp(2.7)} color={"gray"} />
              <TextInput
                style={styles.input}
                placeholderTextColor="gray"
                placeholder="Password..."
                fontWeight="500"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
              />
            </View>
          </View>
          {loading ? (
            <View style={styles.loading}>
              <Loading size={hp(10)} />
            </View>
          ) : (
            <TouchableOpacity
              style={
                deactivated ? styles.inactiveSubmitButton : styles.submitButton
              }
              onPress={handleSignUp}
            >
              <Text style={styles.buttonText}>SIGN UP</Text>
            </TouchableOpacity>
          )}
          <View style={styles.signupView}>
            <Text style={styles.createAccountText}>
              Already have an account?
            </Text>
            <Pressable onPress={() => router.navigate("SignIn")}>
              <Text style={styles.signupText}>Sign In</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  innerContainer: {
    flex: 1,
    gap: 12,
    //paddingTop: hp(5),
    paddingHorizontal: wp(5),
  },
  imageWrapper: {
    //paddingTop: hp(4),
    justifyContent: "center",
    alignItems: "center",
  },
  formWrapper: {
    gap: 12,
    paddingTop: hp(4),
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
  input: {
    flex: 1,
    fontSize: hp(2),
    borderWidth: 0,
    paddingVertical: 0,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 10,
  },
  dropdownContainer: {
    height: hp(7),
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    paddingRight: 30,
    paddingLeft: 10,
    zIndex: 1000,
  },
  dropdown: {
    flex: 1,
    borderWidth: 0,
    backgroundColor: "#f0f0f0",
  },
  dropdownText: {
    fontSize: hp(2),
    color: "gray",
    fontWeight: "500",
  },
  dropdownContainerStyle: {
    backgroundColor: "white",
    borderWidth: 0,
    zIndex: 1000,
    width: "90%",
  },
  icon: {
    marginRight: 10,
  },
  submitButton: {
    //marginTop: 10,
    backgroundColor: "#90bc3b",
    height: hp(6.5),
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  inactiveSubmitButton: {
    backgroundColor: "grey",
    height: hp(6.5),
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    fontSize: hp(2.7),
    color: "white",
    fontWeight: "bold",
    letterSpacing: 3,
  },
  signupView: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  createAccountText: {
    fontSize: hp(1.8),
    fontWeight: "bold",
    color: "gray",
  },
  signupText: {
    fontSize: hp(1.8),
    fontWeight: "bold",
    color: "#6366F1",
  },
  loading: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  genderContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  genderOption: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "gray",
    marginHorizontal: 5,
  },
  selectedGender: {
    backgroundColor: "#90bc3b",
    borderColor: "#90bc3b",
  },
  genderText: {
    fontSize: hp(2),
    color: "gray",
  },
  selectedGenderText: {
    color: "white",
  },
});
