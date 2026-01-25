import { Stack } from "expo-router";
import "./globals.css";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Stack.Screen
        name="details"
        options={{
          title: "Details",
        }}
      />
    </Stack>
  );
}
