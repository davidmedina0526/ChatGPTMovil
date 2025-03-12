import { Stack } from "expo-router";
import { AuthProvider } from "../context/authContext/AuthContext";
import { DataProvider } from "@/context/dataContext/DataContext";

export default function RootLayout() {
  return (
    <DataProvider>
        <AuthProvider>
          <Stack>
            <Stack.Screen name = "index" options = {{ title: "Welcome to ChatGPT", headerShown: false }} />
            <Stack.Screen name = "chatScreen" options = {{ title: "ChatGPT", headerShown: false }} />
            <Stack.Screen name = "loginScreen" options = {{ title: "Log in to ChatGPT", headerShown: false }} />
            <Stack.Screen name = "signupScreen" options = {{ title: "Sign up to ChatGPT", headerShown: false }} />
          </Stack>
      </AuthProvider>
    </DataProvider>
  );
}