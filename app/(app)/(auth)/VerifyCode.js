import { router } from "expo-router";
import { Alert, Button, Text, TextInput, View } from "react-native";
import { useAuth } from "../../../context/AuthContext";

export default function VerifyCode() {
  const { confirmPhoneCode } = useAuth();
  const [code, setCode] = useState("");

  const handleVerify = async () => {
    const res = await confirmPhoneCode(code);
    if (res.success) {
      router.replace("(screens)/Home"); // or your target route
    } else {
      Alert.alert("Verification failed", res.msg);
    }
  };

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text>Enter the 6-digit code</Text>
      <TextInput
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        style={{ borderWidth: 1, padding: 10, borderRadius: 8 }}
      />
      <Button title="Verify" onPress={handleVerify} />
    </View>
  );
}
