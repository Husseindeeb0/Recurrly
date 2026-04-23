import { Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";

const SafeAreaView = styled(RNSafeAreaView);

const subscriptions = () => {
  return (
    <SafeAreaView className="flex-1 p-5 bg-background">
      <Text>subscriptions</Text>
    </SafeAreaView>
  );
};

export default subscriptions;
