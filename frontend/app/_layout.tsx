import { Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
// https://github.com/adrianhajdin/react-native-recurrly/blob/main/global.css