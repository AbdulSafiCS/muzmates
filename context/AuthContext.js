import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import Toast from "react-native-toast-message";
import {
  FIREBASE_AUTH,
  FIRESTORE_DB,
  storage,
  USER_REF,
} from "../FirebaseConfig.js";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);
  const [currentUser, setCurrentUser] = useState([]); // keep as array for your screens
  const [loading, setLoading] = useState(true);

  const [listingImages, setListingImages] = useState([]);
  const [listingAddress, setListingAddress] = useState(null);
  const [listingLat, setListingLat] = useState(0);
  const [listingLon, setListingLon] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [allListings, setAllListings] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [listingsWithUserData, setListingsWithUserData] = useState([]);

  // --- Auth state ---
  useEffect(() => {
    const unsub = onAuthStateChanged(FIREBASE_AUTH, (authUser) => {
      if (authUser) {
        setIsAuthenticated(true);
        setUser(authUser);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setCurrentUser([]);
      }
    });
    return unsub;
  }, []);

  // --- Current user realtime subscription ---
  useEffect(() => {
    if (!user?.uid) {
      setCurrentUser([]);
      setLoading(false);
      return;
    }
    const userDocRef = doc(FIRESTORE_DB, "users", user.uid);
    const unsub = onSnapshot(
      userDocRef,
      (snap) => {
        if (snap.exists()) {
          // keep array shape for your UI
          setCurrentUser([{ docId: snap.id, ...snap.data() }]);
        } else {
          setCurrentUser([]);
        }
        setLoading(false);
      },
      (err) => console.error("currentUser sub error:", err)
    );
    return unsub;
  }, [user?.uid]);

  useEffect(() => {
    const q = query(collection(FIRESTORE_DB, "listings"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const rows = snap.docs.map((d) => ({ docId: d.id, ...d.data() }));
        setAllListings(rows);
      },
      (err) => console.error("Listings subscription error:", err)
    );
    return unsub;
  }, []);

  // --- All users realtime subscription (with docId) ---
  useEffect(() => {
    const unsub = onSnapshot(
      collection(FIRESTORE_DB, "users"),
      (snap) => {
        const rows = snap.docs.map((d) => ({ docId: d.id, ...d.data() }));
        setAllUsers(rows);
      },
      (err) => console.error("users sub error:", err)
    );
    return unsub;
  }, []);

  // --- Merge listings + users ---
  useEffect(() => {
    const merged = allListings.map((listing) => {
      // Your listing has field `id` = user.uid at creation time
      const u = allUsers.find((usr) => usr.userId === listing.id);
      return { ...listing, user: u || {} };
    });
    setListingsWithUserData(merged);
  }, [allUsers, allListings]);

  // --- Auth API ---
  const login = async (emailAddress, password) => {
    try {
      await signInWithEmailAndPassword(FIREBASE_AUTH, emailAddress, password);
      return { success: true };
    } catch (e) {
      let msg = e.message;
      if (msg.includes("(auth/invalid-email)"))
        msg = "please enter a valid email";
      if (msg.includes("(auth/invalid-credential)"))
        msg = "incorrect credentials, please try again";
      return { success: false, msg };
    }
  };

  const logout = async () => {
    try {
      await signOut(FIREBASE_AUTH);
      setListingImages([]);
      setListingAddress(null);
      setListingLat(0);
      setListingLon(0);
      return { success: true };
    } catch (e) {
      return { success: false, msg: e.message, error: e };
    }
  };

  const register = async (firstName, lastName, gender, email, password) => {
    try {
      const response = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );
      await setDoc(doc(FIRESTORE_DB, "users", response?.user?.uid), {
        firstName,
        lastName,
        gender,
        email,
        userId: response?.user?.uid,
      });
      return { success: true, data: response?.user };
    } catch (e) {
      let msg = e.message;
      if (msg.includes("(auth/invalid-email)"))
        msg = "please enter a valid email";
      if (msg.includes("(auth/email-already-in-use)"))
        msg = "User already exist! Please sign in";
      return { success: false, msg };
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(FIREBASE_AUTH, email);
      return { success: true };
    } catch (error) {
      Alert.alert(error.message);
      return { succes: false, msg: error.message };
    }
  };

  const deleteAccount = () => {
    if (!user) {
      console.error("No user currently logged in.");
      return;
    }
    deleteUser(user)
      .then(() => {
        Alert.alert("User account deleted successfully.");
        router.replace("index");
      })
      .catch((error) => {
        console.error("Error deleting user account:", error);
      });
  };

  // --- Media pickers / uploads ---
  const profileImagePicker = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "We need permissions to access your media library."
        );
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images", "videos"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        uploadProfileImage(uri);
      }
    } catch {
      Alert.alert("Error", "Something went wrong with image picker.");
    }
  };

  const uploadProfileImage = async (uri) => {
    try {
      const fetchResponse = await fetch(uri);
      const theBlob = await fetchResponse.blob();

      // unique filename → new URL → avoids image cache issues
      const fileName = `${Date.now()}-${uri.split("/").pop()}`;
      const storageRef = ref(
        storage,
        `profilePictures/${user?.uid}/${fileName}`
      );

      const uploadTask = uploadBytesResumable(storageRef, theBlob);

      uploadTask.on(
        "state_changed",
        () => {},
        (error) => console.error(error),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const userDoc = doc(USER_REF, user.uid);
          await updateDoc(userDoc, {
            profilePicture: downloadURL,
            updatedAt: Date.now(),
          });

          Toast.show({
            type: "success",
            text1: "Success",
            text2: "Profile Picture Updated!",
            position: "bottom",
          });
        }
      );
    } catch (error) {
      Alert.alert("Error", `Image upload failed: ${error.message}`);
    }
  };

  const listingImagePicker = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "We need permissions to access your media library."
        );
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images", "videos"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        if (result.assets.length > 5) {
          Alert.alert("Limit Exceeded", "You can only select up to 5 images.");
        } else {
          uploadListingImages(result.assets.map((asset) => asset.uri));
        }
      }
    } catch {
      Alert.alert("Error", "Something went wrong with image picker.");
    }
  };

  const uploadListingImages = async (uris) => {
    try {
      for (const uri of uris) {
        const fetchResponse = await fetch(uri);
        const theBlob = await fetchResponse.blob();
        const storageRef = ref(
          storage,
          `listingImages/${user?.uid}/${uri.split("/").pop()}`
        );
        const uploadTask = uploadBytesResumable(storageRef, theBlob);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress);
            },
            (error) => reject(error),
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              setListingImages((prev) => [...prev, downloadURL]);
              resolve();
            }
          );
        });
      }

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Images Uploaded Successfully!",
        position: "bottom",
      });
    } catch (error) {
      Alert.alert("Error", `Image upload failed: ${error.message}`);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        logout,
        resetPassword,
        currentUser,
        loading,
        setLoading,
        deleteAccount,

        // listing helpers
        listingImagePicker,
        listingImages,
        setListingImages,

        // places / address
        listingAddress,
        setListingAddress,
        setListingLat,
        setListingLon,
        listingLat,
        listingLon,

        // uploads
        uploadProgress,
        profileImagePicker,
        uploadListingImages,

        // datasets
        allListings, // [{ docId, ...fields }]
        allUsers, // [{ docId, ...fields }]
        listingsWithUserData, // joined array
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be wrapped inside AuthContextProvider");
  }
  return value;
};
