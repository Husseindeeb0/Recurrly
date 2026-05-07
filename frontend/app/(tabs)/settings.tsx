import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth, useUser } from "@clerk/expo";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const SettingsScreen = () => {
  const { signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/(auth)/signIn");
    } catch (error) {
      Alert.alert("Error", "Failed to sign out. Please try again.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#fff9e3]" edges={["top"]}>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24 }}>
        <View className="mb-10">
          <Text className="text-3xl font-[sans-extrabold] text-[#081126] mb-2">
            Settings
          </Text>
          <Text className="text-[rgba(8,17,38,0.5)] font-[sans-medium]">
            Manage your account and preferences
          </Text>
        </View>

        {/* Profile Card */}
        <View className="bg-[#fff8e7] rounded-3xl p-6 border border-[rgba(8,17,38,0.08)] mb-10 shadow-sm">
          <View className="flex-row items-center">
            <View className="w-16 h-16 rounded-full bg-[#081126] items-center justify-center mr-4 shadow-md">
              <Text className="text-white text-2xl font-[sans-bold]">
                {user?.firstName?.[0] || user?.emailAddresses[0]?.emailAddress?.[0]?.toUpperCase() || "U"}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-xl font-[sans-bold] text-[#081126]">
                {user?.fullName || "Recurly Member"}
              </Text>
              <Text className="text-[rgba(8,17,38,0.5)] font-[sans-regular]" numberOfLines={1}>
                {user?.emailAddresses[0]?.emailAddress}
              </Text>
            </View>
          </View>
        </View>

        {/* Action List */}
        <View className="mb-8">
          <Text className="text-xs font-[sans-bold] text-[rgba(8,17,38,0.3)] uppercase tracking-widest mb-4 ml-2">
            Account Actions
          </Text>
          
          <TouchableOpacity 
            className="flex-row items-center bg-[#fff8e7] p-5 rounded-2xl border border-[rgba(8,17,38,0.08)] shadow-sm active:opacity-70"
            onPress={handleSignOut}
          >
            <View className="w-10 h-10 rounded-xl bg-[rgba(220,38,38,0.1)] items-center justify-center mr-4">
              <Ionicons name="log-out-outline" size={22} color="#dc2626" />
            </View>
            <Text className="flex-1 text-lg font-[sans-semibold] text-[#dc2626]">
              Sign Out
            </Text>
            <Ionicons name="chevron-forward" size={20} color="rgba(8,17,38,0.15)" />
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View className="items-center mt-auto pb-10">
          <View className="w-10 h-10 rounded-xl bg-[rgba(8,17,38,0.05)] items-center justify-center mb-4">
            <Text className="text-[#081126] font-[sans-bold]">R</Text>
          </View>
          <Text className="text-[rgba(8,17,38,0.3)] font-[sans-medium]">
            Recurly v1.0.0
          </Text>
          <Text className="text-[rgba(8,17,38,0.2)] font-[sans-regular] text-xs mt-1">
            Made with ❤️ for smart billing
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
