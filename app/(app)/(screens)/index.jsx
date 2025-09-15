import { router } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEffect, useState } from "react";
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import Loading from "../../../components/Loading";
import { useAuth } from "../../../context/AuthContext";

export default function WelcomeScreen() {
  const player = useVideoPlayer(
    "https://firebasestorage.googleapis.com/v0/b/muzmate-mobile.appspot.com/o/coverVideo.mp4?alt=media&token=af05a09b-7c7a-41a1-be7b-67fc94d3a103",
    (p) => {
      p.loop = true;
      p.play();
      // p.muted = true; // ← uncomment if you want silent autoplay on iOS
    }
  );
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true); // State to manage loading
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("Profile");
    }
  }, [isAuthenticated]);

  return (
    <View style={styles.container}>
      {/* draw under the status bar */}
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <VideoView
        style={StyleSheet.absoluteFillObject} // covers the entire parent
        player={player}
        nativeControls={false} // no play/pause UI
        allowsFullscreen={false}
        allowsPictureInPicture={false}
        contentFit="cover" // like background-size: cover
        onFirstFrameRender={() => setIsLoading(false)}
      />
      {isLoading ? (
        <View style={styles.loading}>
          <Loading size={hp(10)} />
        </View>
      ) : (
        <View style={styles.overlay}>
          <Image
            source={require("../../../assets/images/bismillah.png")}
            style={styles.image}
            resizeMode="contain"
          />
          <View style={styles.buttonContainer}>
            <Text style={styles.loginText}>LOG IN WITH</Text>
            <TouchableOpacity style={styles.submitButton}>
              <Text style={styles.buttonText}>PHONE NUMBER</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => router.navigate("SignIn")}
            >
              <Text style={styles.buttonText}>EMAIL</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black", // nice fallback while the video loads
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // sit on top of the video
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: { color: "white", fontSize: 32, fontWeight: "bold", marginBottom: 8 },
  subtitle: { color: "white", fontSize: 18, marginBottom: 32 },
  button: {
    backgroundColor: "#90bc3b",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 10,
    marginTop: 10,
  },
  //buttonText: { color: "white", fontSize: 18, fontWeight: "600" },
  loginText: {
    color: "white",
    fontSize: 20,
    marginBottom: 10,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: "transparent",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    width: "80%",
    borderWidth: 2,
    borderColor: "white",
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
  },
  image: {
    width: 400,
    height: 200,
    marginBottom: 20,
  },
  loading: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
});
