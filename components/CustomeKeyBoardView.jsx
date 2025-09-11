import React from "react";
import { KeyboardAvoidingView, Platform, View, StatusBar } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function CustomKeyboardView({ children }) {
  const ios = Platform.OS === "ios";
  const android = Platform.OS === "android";

  const calculateKeyboardVerticalOffset = () => {
    return 0;
  };

  return (
    <KeyboardAwareScrollView
      behavior={ios ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={calculateKeyboardVerticalOffset()}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ flex: 1 }}>{children}</View>
    </KeyboardAwareScrollView>
  );
}
