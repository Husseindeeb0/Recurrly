import React, { useState, useCallback } from "react";
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
import { posthog } from "../../src/config/posthog";

const SafeAreaView = styled(RNSafeAreaView);

const SignInScreen = () => {
  const { client, setActive } = useClerk();
  const { isLoaded } = useAuth();
  const signIn = client?.signIn;
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [verificationStatus, setVerificationStatus] = useState<"first" | "second" | null>(null);
  const [loading, setLoading] = useState(false);

  const onSignInPress = useCallback(async () => {
    if (!isLoaded || !signIn) return;

    if (!emailAddress || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        posthog.capture("user_signed_in", { method: "credentials" });
        router.replace("/(tabs)");
      } else if (signInAttempt.status === "needs_second_factor") {
        const secondFactor = signInAttempt.supportedSecondFactors?.find(
          (f) => f.strategy === "email_code"
        ) as any;

        if (secondFactor?.emailAddressId) {
          await signInAttempt.prepareSecondFactor({
            strategy: "email_code",
            emailAddressId: secondFactor.emailAddressId,
          });
          setVerificationStatus("second");
          setPendingVerification(true);
          Alert.alert("2FA Required", "A verification code has been sent to your email.");
        }
      } else if (signInAttempt.status === "needs_first_factor") {
        const firstFactor = signInAttempt.supportedFirstFactors?.find(
          (f) => f.strategy === "email_code"
        ) as any;

        if (firstFactor?.emailAddressId) {
          await signInAttempt.prepareFirstFactor({
            strategy: "email_code",
            emailAddressId: firstFactor.emailAddressId,
          });
          setVerificationStatus("first");
          setPendingVerification(true);
          Alert.alert("Verification Required", "A verification code has been sent to your email.");
        }
      } else {
        Alert.alert("Notice", `Additional verification required: ${signInAttempt.status}.`);
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      posthog.capture("sign_in_failed", {
        error_code: err.errors?.[0]?.code || "unknown",
      });
      Alert.alert("Error", err.errors?.[0]?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [isLoaded, emailAddress, password, signIn, setActive]);

  const onVerifyPress = useCallback(async () => {
    if (!isLoaded || !signIn || !code) return;

    setLoading(true);
    try {
      let result;
      if (verificationStatus === "second") {
        result = await signIn.attemptSecondFactor({
          strategy: "email_code",
          code,
        });
      } else {
        result = await signIn.attemptFirstFactor({
          strategy: "email_code",
          code,
        });
      }

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.replace("/(tabs)");
      } else {
        console.log(result);
        Alert.alert("Error", "Verification failed. Please check the code.");
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      Alert.alert("Error", err.errors?.[0]?.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  }, [isLoaded, signIn, code, verificationStatus, setActive]);

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
                {pendingVerification ? "Verify Code" : "Welcome back"}
              </Text>
              <Text className="auth-subtitle">
                {pendingVerification 
                  ? "Enter the code sent to your email to complete your sign in"
                  : "Sign in to continue managing your subscriptions"}
              </Text>
            </View>

            {/* Form Section */}
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
                    onPress={onSignInPress}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#081126" />
                    ) : (
                      <Text className="auth-button-text">Sign in</Text>
                    )}
                  </TouchableOpacity>
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
                    onPress={onVerifyPress}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#081126" />
                    ) : (
                      <Text className="auth-button-text">Verify & Sign In</Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setPendingVerification(false)}
                    className="auth-secondary-button"
                  >
                    <Text className="auth-secondary-button-text">Back to Sign In</Text>
                  </TouchableOpacity>
                </View>
              )}

              <View className="auth-link-row">
                <Text className="auth-link-copy">New to Recurly?</Text>
                <Link href="/(auth)/signUp" asChild>
                  <TouchableOpacity>
                    <Text className="auth-link">Create an account</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignInScreen;
