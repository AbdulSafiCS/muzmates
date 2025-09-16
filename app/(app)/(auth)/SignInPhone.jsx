import { Octicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { RecaptchaVerifier } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import {
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
  const [loading, setLoading] = useState(false);
  const [deactivated, setDeactivated] = useState(true);
  const [recaptchaReady, setRecaptchaReady] = useState(false);

  const { loginPhone, auth, phoneNumber, setPhoneNumber } = useAuth();
  const recaptchaRef = useRef(null);

  useEffect(() => {
    setDeactivated(!phoneNumber);
  }, [phoneNumber]);

  // Create reCAPTCHA once, then wait for render() to resolve
  useEffect(() => {
    if (recaptchaRef.current) return;

    const mount = async () => {
      try {
        // Older signature: new RecaptchaVerifier(containerId, options, auth)
        const v1 = new RecaptchaVerifier(
          "recaptcha-container",
          { size: "invisible" },
          auth
        );
        recaptchaRef.current = v1;
        await v1.render();
        setRecaptchaReady(true);
      } catch (e1) {
        try {
          // Newer signature: new RecaptchaVerifier(auth, containerId, options)
          const v2 = new RecaptchaVerifier(auth, "recaptcha-container", {
            size: "invisible",
          });
          recaptchaRef.current = v2;
          await v2.render();
          setRecaptchaReady(true);
        } catch (e2) {
          console.warn(
            "Recaptcha init failed (likely native env / no DOM):",
            e2?.message
          );
          setRecaptchaReady(false);
        }
      }
    };

    mount();
  }, [auth]);

  const handleSendCode = async () => {
    if (!phoneNumber) return;
    if (!recaptchaRef.current) {
      alert("reCAPTCHA not ready yet. Please wait a moment and try again.");
      return;
    }
    setLoading(true);
    const res = await loginPhone(auth, phoneNumber, recaptchaRef.current);
    setLoading(false);

    if (res?.success) {
      router.navigate("VerifyCode");
    } else {
      alert(res?.msg || "Failed to send verification code.");
      // if the verifier was consumed, you can recreate it:
      // try { await recaptchaRef.current.clear(); } catch(_) {}
      // recaptchaRef.current = null;
      // setRecaptchaReady(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: "padding", android: "height" })}
      keyboardVerticalOffset={Platform.select({ ios: 0, android: 0 })}
    >
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="none"
        automaticallyAdjustKeyboardInsets={false}
        bounces={false}
      >
        <View style={styles.innerContainer}>
          <View nativeID="recaptcha-container" style={{ minHeight: 1 }} />

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
              <Octicons name="device-mobile" size={hp(2.7)} color={"gray"} />
              <TextInput
                style={styles.input}
                placeholderTextColor="gray"
                placeholder="Phone number (e.g. +15555550123)"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                autoCapitalize="none"
                keyboardType="phone-pad"
                returnKeyType="done"
                onSubmitEditing={handleSendCode}
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
                deactivated || !recaptchaReady
                  ? styles.inactiveSubmitButton
                  : styles.submitButton
              }
              onPress={handleSendCode}
              disabled={deactivated || !recaptchaReady} // Disable if no phone number or reCAPTCHA not ready
            >
              <Text style={styles.buttonText}>
                {recaptchaReady ? "SEND CODE" : "coming soon…"}
              </Text>
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

          <View style={{ height: insets.bottom + 16 }} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;

// (styles unchanged)
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
