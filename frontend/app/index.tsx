import { Redirect } from "expo-router";
import { useAuth } from "@clerk/expo";
import { View, Text } from "react-native";

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();

  console.log("INDEX RENDER");
  console.log({ isSignedIn, isLoaded });

  if (!isLoaded) {
    return (
      <View>
        <Text>Loading Auth...</Text>
      </View>
    );
  }

  if (isSignedIn) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/signIn" />;
}