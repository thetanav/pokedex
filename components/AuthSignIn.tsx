import { useAuthActions } from "@convex-dev/auth/react";
import { View, Text, TouchableNativeFeedback , Button, Platform } from "react-native";
import { makeRedirectUri } from "expo-auth-session";
import { openAuthSessionAsync } from "expo-web-browser";
import { useRouter } from "expo-router";

const redirectTo = makeRedirectUri();

export function SignIn() {
  const { signIn } = useAuthActions();
  const router = useRouter();

  const handleSignIn = async () => {
    const { redirect } = await signIn("google", {
      redirectTo,
    });
    if (Platform.OS === "web") {
      return;
    }
    const result = await openAuthSessionAsync(redirect!.toString(), redirectTo);
    if (result.type === "success") {
      const { url } = result;
      const code = new URL(url).searchParams.get("code")!;
      await signIn("google", { code });
      // Redirect to home after successful sign-in
      router.replace("/(tabs)");
    }
  };

  return (
    <View className="w-full max-w-sm">
      <Text className="text-2xl font-bold text-center mb-6">Sign In</Text>
      <Button onPress={handleSignIn} title="Sign in with Google" />
    </View>
  );
}
