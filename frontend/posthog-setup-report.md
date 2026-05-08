<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Recurrly Expo app. The SDK is initialized via `src/config/posthog.ts` using `expo-constants` to read credentials from `app.config.js` extras. `PostHogProvider` wraps the app in `app/_layout.tsx` with autocapture (touches) enabled and manual screen tracking wired to Expo Router's `usePathname`. Eight business-critical events are tracked across five files, covering the full sign-up funnel, authentication, user engagement, and sign-out.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signed in | `app/(auth)/signIn.tsx` |
| `sign_in_failed` | Sign-in attempt failed | `app/(auth)/signIn.tsx` |
| `sign_up_verification_started` | Verification code sent to user | `app/(auth)/signUp.tsx` |
| `user_signed_up` | Registration fully completed | `app/(auth)/signUp.tsx` |
| `sign_up_failed` | Sign-up attempt failed | `app/(auth)/signUp.tsx` |
| `subscription_expanded` | User expanded a subscription card | `components/SubscriptionCard.tsx` |
| `user_signed_out` | User signed out | `app/(tabs)/settings.tsx` |
| `onboarding_viewed` | User saw the onboarding screen | `app/onBoarding.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](/dashboard/1561978)
- [Sign-up conversion funnel](/insights/jhOuzYHI)
- [Daily sign-ins](/insights/EeIpCkiw)
- [New sign-ups per day](/insights/7MKP7rkk)
- [Sign-in failures](/insights/xRbwTr9M)
- [Subscription detail views](/insights/CZJu0S6x)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
