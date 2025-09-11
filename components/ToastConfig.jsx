import React from "react";
import { BaseToast, ErrorToast } from "react-native-toast-message";

const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "green",
        height: 90,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: "400",
        color: "green",
      }}
      text2Style={{
        fontSize: 18,
        fontWeight: "500",
        color: "black",
      }}
    />
  ),

  error: (props) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: "red",
        height: 90,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: "400",
        color: "red",
      }}
      text2Style={{
        fontSize: 18,
        fontWeight: "500",
        color: "black",
      }}
    />
  ),
};

export default toastConfig;
