import { View, Text } from 'react-native';
import { useEffect } from 'react';
import { posthog } from '../src/config/posthog';

export default function OnBoarding() {
  useEffect(() => {
    posthog.capture("onboarding_viewed");
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-white text-xl">Onboarding Screen</Text>
    </View>
  );
}
