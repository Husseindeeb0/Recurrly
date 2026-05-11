import PostHog from "posthog-react-native";

const apiKey = process.env.EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.EXPO_PUBLIC_POSTHOG_HOST;

const isPostHogConfigured =
  !!apiKey && apiKey.startsWith("phc_") && apiKey !== "phc_your_project_token_here";

if (__DEV__) {
  console.log("PostHog config:", {
    apiKey: apiKey ? "SET" : "NOT SET",
    host: host ? "SET" : "NOT SET",
    isConfigured: isPostHogConfigured,
  });
}

export const posthog = new PostHog(apiKey || "placeholder", {
  host: host || "https://app.posthog.com",
  disabled: !isPostHogConfigured,
  captureAppLifecycleEvents: isPostHogConfigured,
  preloadFeatureFlags: isPostHogConfigured,
  sendFeatureFlagEvent: isPostHogConfigured,
  flushAt: 20,
  flushInterval: 10000,
  maxBatchSize: 100,
  maxQueueSize: 1000,
  featureFlagsRequestTimeoutMs: 10000,
  requestTimeout: 10000,
  fetchRetryCount: 3,
  fetchRetryDelay: 3000,
});
