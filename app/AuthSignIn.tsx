import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";

export function SignIn() {
  const { signIn } = useAuthActions();
  const [step, setStep] = useState<"signIn" | { email: string }>("signIn");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("email", email);

      await signIn("resend-otp", formData);
      setStep({ email });
    } catch {
      Alert.alert("Error", "Failed to send code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!code) {
      Alert.alert("Error", "Please enter the verification code");
      return;
    }

    if (typeof step === "string") return; // Should not happen

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("code", code);
      formData.append("email", step.email);

      await signIn("resend-otp", formData);
      // Navigation will happen automatically when auth state changes
    } catch {
      Alert.alert("Error", "Invalid code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="w-full max-w-sm">
      <Text className="text-2xl font-bold text-center mb-6">Sign In</Text>

      {step === "signIn" ? (
        <View className="space-y-4">
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 text-base"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            className="bg-blue-500 rounded-lg py-3 items-center"
            onPress={handleSendCode}
            disabled={loading}
          >
            <Text className="text-white font-semibold text-base">
              {loading ? "Sending..." : "Send Code"}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="space-y-4">
          <Text className="text-center text-gray-600 mb-2">
            We sent a code to {(step as { email: string }).email}
          </Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 text-base text-center text-2xl tracking-widest"
            placeholder="000000"
            value={code}
            onChangeText={setCode}
            keyboardType="numeric"
            maxLength={6}
          />
          <TouchableOpacity
            className="bg-blue-500 rounded-lg py-3 items-center"
            onPress={handleVerifyCode}
            disabled={loading}
          >
            <Text className="text-white font-semibold text-base">
              {loading ? "Verifying..." : "Verify Code"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="py-2 items-center"
            onPress={() => setStep("signIn")}
          >
            <Text className="text-gray-600">Use different email</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}