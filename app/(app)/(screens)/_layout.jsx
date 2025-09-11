import { Stack } from "expo-router";
//import { AuthContextProvider } from "../(auth)/context/AuthContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import toastConfig from "../../../components/ToastConfig";

export default function _layout() {
  return (
    <>
      <GestureHandlerRootView>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen
            name="GooglePlaces"
            options={{ presentation: "modal" }}
          />
          <Stack.Screen
            name="ListingProfileInfo"
            options={{
              title: "Lister Profile",
              presentation: "modal",
            }}
          />
        </Stack>
        <Toast config={toastConfig} />
      </GestureHandlerRootView>
    </>
  );
}
