import { View, Text, TouchableOpacity, Alert, Image } from "react-native";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { auth } from "@/convex/auth";

export default function Profile() {
  const { signOut } = useAuthActions();
  const user = useQuery(api.auth.getCurrentUser);

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
          } catch {
            Alert.alert("Error", "Failed to sign out");
          }
        },
      },
    ]);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
      }}
    >
      {user ? (
        <>
          <Image
            source={{ uri: user.image }}
            style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 16 }}
          />
          <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 8 }}>
            {user.name}
          </Text>
          <Text style={{ fontSize: 16, color: "#666", marginBottom: 24 }}>
            {user.email}
          </Text>
        </>
      ) : (
        <Text style={{ fontSize: 16, color: "#666", marginBottom: 24 }}>
          Loading user information...
        </Text>
      )}
      <Text
        style={{
          fontSize: 16,
          color: "#666",
          textAlign: "center",
          marginBottom: 32,
        }}
      >
        Welcome to your Pokemon app! You are successfully signed in.
      </Text>
      <TouchableOpacity
        style={{
          backgroundColor: "#dc2626",
          paddingVertical: 12,
          paddingHorizontal: 24,
          borderRadius: 8,
          width: "100%",
          alignItems: "center",
        }}
        onPress={handleSignOut}
      >
        <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
          Sign Out
        </Text>
      </TouchableOpacity>
    </View>
  );
}
