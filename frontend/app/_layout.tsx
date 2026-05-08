import { Stack, SplashScreen, usePathname, useGlobalSearchParams } from "expo-router";
import "../global.css";
import { useFonts } from "expo-font";
import { useEffect, useRef } from "react";
import { ClerkProvider, ClerkLoaded } from "@clerk/expo";
import * as SecureStore from "expo-secure-store";
import { View, Text, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { PostHogProvider } from "posthog-react-native";
import { posthog } from "../src/config/posthog";

const publishableKey =
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

const tokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (err) {
      console.log(err);
      return null;
    }
  },

  async saveToken(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (err) {
      console.log(err);
    }
  },
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "sans-extrabold": require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
    "sans-bold": require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
    "sans-light": require("../assets/fonts/PlusJakartaSans-Light.ttf"),
    "sans-medium": require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
    "sans-regular": require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "sans-semibold": require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
  });

  const pathname = usePathname();
  const params = useGlobalSearchParams();
  const previousPathname = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Manual screen tracking for Expo Router
  useEffect(() => {
    if (previousPathname.current !== pathname) {
      posthog.screen(pathname, {
        previous_screen: previousPathname.current ?? null,
        ...params,
      });
      previousPathname.current = pathname;
    }
  }, [pathname, params]);

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff9e3", // Match the design system background
        }}
      >
        <Text style={{ fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' }}>Loading...</Text>
      </View>
    );
  }

  return (
    <PostHogProvider
      client={posthog}
      autocapture={{
        captureScreens: false,
        captureTouches: true,
        propsToCapture: ["testID"],
      }}
    >
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
        <ClerkLoaded>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="onBoarding" />
          </Stack>
        </ClerkLoaded>
      </ClerkProvider>
    </PostHogProvider>
  );
}
