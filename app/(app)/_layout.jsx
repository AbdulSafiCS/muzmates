import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import toastConfig from "../../components/ToastConfig";
import { AuthContextProvider } from "../../context/AuthContext";

export default function _layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <AuthContextProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(screens)" />
          </Stack>
          <Toast config={toastConfig} />
        </AuthContextProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
