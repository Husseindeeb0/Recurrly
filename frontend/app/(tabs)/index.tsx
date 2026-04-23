import "../../global.css";
import { Text } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";

const SafeAreaView = styled(RNSafeAreaView); //  To enable the use of native wind styling on SAV
export default function App() {
  return (
    <SafeAreaView className="flex-1 p-5 bg-background">
      <Text className="text-xl font-bold text-success">
        Welcome to Nativewind!
      </Text>
      <Link
        href="/(auth)/signIn"
        className="mt-4 rounded bg-primary px-4 py-2 text-white"
      >
        Sign In
      </Link>
      <Link
        href="/(auth)/signUp"
        className="mt-4 rounded bg-primary px-4 py-2 text-white"
      >
        Sign Up
      </Link>
      <Link href="/subscriptions/spotify">Spotify Subscription</Link>
      <Link
        href={{ pathname: "/subscriptions/[id]", params: { id: "claude" } }}
      >
        Claude Max Subscription
      </Link>
    </SafeAreaView>
  );
}
