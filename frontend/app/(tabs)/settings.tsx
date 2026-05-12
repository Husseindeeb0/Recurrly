import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth, useUser } from "@clerk/expo";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { posthog } from "../../src/config/posthog";

const SettingsScreen = () => {
  const { signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  const handleSignOut = async () => {
    try {
      posthog.capture("user_signed_out");
      posthog.reset();
      await signOut();
      router.replace("/(auth)/signIn");
    } catch (error) {
      Alert.alert("Error", "Failed to sign out. Please try again.");
    }
  };

  const SettingItem = ({ icon, title, value, type = "link", color = "#081126", onPress }: any) => (
    <TouchableOpacity 
      style={{ 
        flexDirection: "row", 
        alignItems: "center", 
        backgroundColor: "#fff8e7", 
        padding: 20, 
        borderRadius: 20, 
        borderWidth: 1, 
        borderColor: "rgba(0,0,0,0.05)", 
        marginBottom: 12 
      }}
      onPress={onPress}
      disabled={type === "toggle"}
      activeOpacity={0.7}
    >
      <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: "#fff9e3", alignItems: "center", justifyContent: "center", marginRight: 16 }}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={{ flex: 1, fontSize: 16, fontFamily: "sans-semibold", color }}>
        {title}
      </Text>
      {type === "link" && (
        <Ionicons name="chevron-forward" size={18} color="rgba(8,17,38,0.2)" />
      )}
      {type === "toggle" && (
        <Switch 
          value={value} 
          onValueChange={onPress}
          trackColor={{ false: "#e8def8", true: "#ea7a53" }}
          thumbColor="#fff"
        />
      )}
      {type === "text" && (
        <Text style={{ fontSize: 14, fontFamily: "sans-medium", color: "rgba(8, 17, 38, 0.5)" }}>{value}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff9e3" }} edges={["top"]}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        
        <View style={{ marginBottom: 32 }}>
          <Text style={{ fontSize: 30, fontFamily: "sans-extrabold", color: "#081126" }}>Settings</Text>
          <Text style={{ fontSize: 16, fontFamily: "sans-medium", color: "rgba(8, 17, 38, 0.5)", marginTop: 4 }}>
            Manage your account and app
          </Text>
        </View>

        {/* Profile Card */}
        <View style={{ backgroundColor: "#fff8e7", borderRadius: 24, padding: 24, borderWidth: 1, borderColor: "rgba(0,0,0,0.05)", marginBottom: 32 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: "#081126", alignItems: "center", justifyContent: "center", marginRight: 16 }}>
              <Text style={{ color: "#ffffff", fontSize: 24, fontFamily: "sans-bold" }}>
                {user?.firstName?.[0] || user?.emailAddresses[0]?.emailAddress?.[0]?.toUpperCase() || "U"}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 20, fontFamily: "sans-bold", color: "#081126" }}>
                {user?.fullName || "Recurly Member"}
              </Text>
              <Text style={{ fontSize: 14, fontFamily: "sans-regular", color: "rgba(8, 17, 38, 0.5)" }} numberOfLines={1}>
                {user?.emailAddresses[0]?.emailAddress}
              </Text>
            </View>
          </View>
        </View>

        {/* Preferences Section */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{ fontSize: 12, fontFamily: "sans-bold", color: "rgba(8, 17, 38, 0.3)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 16, marginLeft: 8 }}>
            Preferences
          </Text>
          <SettingItem 
            icon="moon-outline" 
            title="Dark Mode" 
            type="toggle" 
            value={isDarkMode} 
            onPress={() => setIsDarkMode(!isDarkMode)} 
          />
          <SettingItem 
            icon="notifications-outline" 
            title="Notifications" 
            value="Enabled" 
            type="text" 
          />
          <SettingItem 
            icon="globe-outline" 
            title="Currency" 
            value="USD ($)" 
            type="text" 
          />
        </View>

        {/* Support Section */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{ fontSize: 12, fontFamily: "sans-bold", color: "rgba(8, 17, 38, 0.3)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 16, marginLeft: 8 }}>
            Support
          </Text>
          <SettingItem icon="help-circle-outline" title="Help Center" />
          <SettingItem icon="shield-checkmark-outline" title="Privacy Policy" />
          <SettingItem icon="document-text-outline" title="Terms of Service" />
        </View>

        {/* Account Section */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{ fontSize: 12, fontFamily: "sans-bold", color: "rgba(8, 17, 38, 0.3)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 16, marginLeft: 8 }}>
            Account
          </Text>
          <SettingItem 
            icon="log-out-outline" 
            title="Sign Out" 
            color="#dc2626" 
            onPress={handleSignOut} 
          />
        </View>

        {/* Footer Info */}
        <View style={{ alignItems: "center", marginTop: 16 }}>
          <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: "rgba(8, 17, 38, 0.05)", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
            <Text style={{ color: "#081126", fontFamily: "sans-bold" }}>R</Text>
          </View>
          <Text style={{ fontSize: 14, fontFamily: "sans-medium", color: "rgba(8, 17, 38, 0.5)" }}>Recurly v1.0.0</Text>
          <Text style={{ fontSize: 12, fontFamily: "sans-regular", color: "rgba(8, 17, 38, 0.3)", marginTop: 4 }}>
            Made with ❤️ for smart billing
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
