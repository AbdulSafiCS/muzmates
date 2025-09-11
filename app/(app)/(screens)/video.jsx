//import { Video } from "expo-av";
import { router } from "expo-router";
import { VideoView } from "expo-video";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../../context/AuthContext";

const WelcomeScreen = () => {
  const videoRef = useRef(null);
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("Profile");
    }
  }, [isAuthenticated]);

  const handleVideoLoad = () => {
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}
      <VideoView
        ref={videoRef}
        source={require("../../../assets/videos/coverVideo.mp4")}
        rate={1.0}
        volume={1.0}
        isMuted={true}
        resizeMode="cover"
        shouldPlay
        isLooping
        style={styles.backgroundVideo}
        onError={(error) => console.log(error)}
        onLoad={handleVideoLoad}
      />
      {!isLoading && (
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "black", // Optional: To match the background of your video
  },
  loadingText: {
    color: "#ffffff",
    marginTop: 10,
    fontSize: 18,
  },
  backgroundVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    color: "white",
    marginBottom: 20,
  },
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
});

export default WelcomeScreen;
