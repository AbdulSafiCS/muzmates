import { Octicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Loading from "../../../components/Loading.jsx";
import { useAuth } from "../../../context/AuthContext";

const Login = () => {
  const insets = useSafeAreaInsets();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [deactivated, setDeactivated] = useState(true);
  const { login } = useAuth();

  useEffect(() => {
    setDeactivated(!(emailAddress && password));
  }, [emailAddress, password]);

  const handleLogin = async () => {
    if (!emailAddress || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      setDeactivated(true);
      return;
    }
    try {
      setLoading(true);
      const response = await login(emailAddress, password);
      if (!response.success) {
        Alert.alert("Sign In", response.msg);
        setEmailAddress("");
        setPassword("");
      } else {
        setEmailAddress("");
        setPassword("");
        router.navigate("Profile");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
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
        bounces={false}
      >
        <View style={styles.innerContainer}>
          <View style={styles.imageWrapper}>
            <Image
              style={{ height: hp(25), width: wp(70) }}
              resizeMode="contain"
              source={require("../../../assets/images/muzmatesloginimage.png")}
            />
          </View>

          <View style={styles.formWrapper}>
            <Text style={styles.welcomeText}>Welcome Back!</Text>

            <View style={styles.form}>
              <Octicons name="mail" size={hp(2.7)} color={"gray"} />
              <TextInput
                style={styles.input}
                placeholderTextColor="gray"
                placeholder="Email Address..."
                value={emailAddress}
                onChangeText={setEmailAddress}
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                returnKeyType="next"
              />
            </View>

            <View style={styles.form}>
              <Octicons name="lock" size={hp(2.7)} color={"gray"} />
              <TextInput
                style={styles.input}
                placeholderTextColor="gray"
                placeholder="Password..."
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
            </View>

            <Text
              onPress={() => router.navigate("ForgotPassword")}
              style={styles.forgotPassword}
            >
              Forgot Password?
            </Text>
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
              onPress={handleLogin}
              disabled={deactivated}
            >
              <Text style={styles.buttonText}>SIGN IN</Text>
            </TouchableOpacity>
          )}

          <View style={styles.signupView}>
            <Text style={styles.createAccountText}>Don't have an account?</Text>
            <Text
              style={styles.signupText}
              onPress={() => router.navigate("SignUp")}
            >
              Sign Up
            </Text>
          </View>

          {/* Small spacer so last button isn't hidden behind the keyboard on small screens */}
          <View style={{ height: insets.bottom + 16 }} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  scrollContent: { flexGrow: 1 },
  innerContainer: {
    flexGrow: 1,
    gap: 12,
    paddingTop: hp(8),
    paddingHorizontal: wp(5),
    justifyContent: "center",
  },
  imageWrapper: {
    paddingTop: hp(4),
    justifyContent: "center",
    alignItems: "center",
  },
  formWrapper: { gap: 12, paddingTop: hp(4) },
  welcomeText: {
    fontSize: hp(4),
    fontWeight: "bold",
    letterSpacing: 2,
    textAlign: "center",
  },
  form: {
    height: hp(7),
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 15,
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
  },
  input: { fontSize: hp(2), flex: 1, color: "#000" },
  forgotPassword: {
    fontSize: hp(1.8),
    fontWeight: "bold",
    textAlign: "right",
    color: "gray",
  },
  submitButton: {
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
    marginBottom: hp(2),
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
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
});
