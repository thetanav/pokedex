import { View } from "react-native";
import { SignIn } from "@/components/AuthSignIn";

export default function SignInScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
      }}
    >
      <SignIn />
    </View>
  );
}
