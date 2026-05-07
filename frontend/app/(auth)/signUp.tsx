import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { useClerk, useAuth } from "@clerk/expo";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";

const SafeAreaView = styled(RNSafeAreaView);

const SignUpScreen = () => {
  const { client, setActive } = useClerk();
  const { isLoaded } = useAuth();
  const signUp = client?.signUp;
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  // Start the sign up process
  const onSignUpPress = async () => {
    if (!isLoaded || !signUp) return;

    if (!emailAddress || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await signUp.create({
        emailAddress,
        password,
      });

      // Send the verification code to the user's email
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Change the UI to our pending verification view
      setPendingVerification(true);
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      Alert.alert("Error", err.errors?.[0]?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Verify the email address
  const onPressVerify = async () => {
    if (!isLoaded || !signUp) return;

    if (!code) {
      Alert.alert("Error", "Please enter the verification code");
      return;
    }

    setLoading(true);
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace("/(tabs)");
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
        Alert.alert("Error", "Verification failed. Please try again.");
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      Alert.alert("Error", err.errors?.[0]?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="auth-safe-area">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="auth-scroll"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="auth-content">
            {/* Logo Section */}
            <View className="auth-brand-block">
              <View className="auth-logo-wrap">
                <View className="auth-logo-mark">
                  <Text className="auth-logo-mark-text">R</Text>
                </View>
                <View>
                  <Text className="auth-wordmark">Recurly</Text>
                  <Text className="auth-wordmark-sub">Smart Billing</Text>
                </View>
              </View>

              <Text className="auth-title">
                {pendingVerification ? "Verify Email" : "Create Account"}
              </Text>
              <Text className="auth-subtitle">
                {pendingVerification
                  ? `Enter the verification code sent to ${emailAddress}`
                  : "Join Recurly to start managing your subscriptions effortlessly"}
              </Text>
            </View>

            <View className="auth-card">
              {!pendingVerification ? (
                <View className="auth-form">
                  <View className="auth-field">
                    <Text className="auth-label">Email</Text>
                    <TextInput
                      className="auth-input"
                      placeholder="Enter your email"
                      placeholderTextColor="rgba(8, 17, 38, 0.4)"
                      autoCapitalize="none"
                      keyboardType="email-address"
                      value={emailAddress}
                      onChangeText={setEmailAddress}
                    />
                  </View>

                  <View className="auth-field">
                    <Text className="auth-label">Password</Text>
                    <TextInput
                      className="auth-input"
                      placeholder="Enter your password"
                      placeholderTextColor="rgba(8, 17, 38, 0.4)"
                      secureTextEntry
                      value={password}
                      onChangeText={setPassword}
                    />
                  </View>

                  <TouchableOpacity
                    className={`auth-button ${loading ? "auth-button-disabled" : ""}`}
                    onPress={onSignUpPress}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#081126" />
                    ) : (
                      <Text className="auth-button-text">Sign up</Text>
                    )}
                  </TouchableOpacity>

                  <View className="auth-link-row">
                    <Text className="auth-link-copy">Already have an account?</Text>
                    <Link href="/(auth)/signIn" asChild>
                      <TouchableOpacity>
                        <Text className="auth-link">Sign in</Text>
                      </TouchableOpacity>
                    </Link>
                  </View>
                </View>
              ) : (
                <View className="auth-form">
                  <View className="auth-field">
                    <Text className="auth-label">Verification Code</Text>
                    <TextInput
                      className="auth-input"
                      placeholder="Enter code"
                      placeholderTextColor="rgba(8, 17, 38, 0.4)"
                      keyboardType="numeric"
                      value={code}
                      onChangeText={setCode}
                    />
                  </View>

                  <TouchableOpacity
                    className={`auth-button ${loading ? "auth-button-disabled" : ""}`}
                    onPress={onPressVerify}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#081126" />
                    ) : (
                      <Text className="auth-button-text">Verify</Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="auth-secondary-button"
                    onPress={() => setPendingVerification(false)}
                    disabled={loading}
                  >
                    <Text className="auth-secondary-button-text">Back to Sign Up</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUpScreen;