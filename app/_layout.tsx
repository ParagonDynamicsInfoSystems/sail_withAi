// app/_layout.tsx
import { ClerkProvider, getClerkInstance, useAuth } from "@clerk/clerk-expo";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useRef } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Import interceptor from project root (adjust if your path differs)
import { JSX } from "react/jsx-runtime";
import { setupClerkInterceptor } from "./hooks/apiClient";

// env key (may be undefined if not set)
const PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

// import messaging from '@react-native-firebase/messaging';
// import { NavigationContainer } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { Linking } from 'react-native';



// const Stacknav = createNativeStackNavigator();
// const NAVIGATION_IDS = ["(auth)"];

// function buildDeepLinkFromNotificationData(data: any): string | null {
//   const navigationId = data?.navigationId;
//   if (!NAVIGATION_IDS.includes(navigationId)) {
//     console.warn('Unverified navigationId', navigationId)
//     return null;
//   }
//   if (navigationId === '(auth)') {
//     return 'myapp://(auth)';
//   }


//   return null
// }

// const linking = {
//   prefixes: ['myapp://'],
//   config: {
//     screens: {
//       Home: '(auth)',
//       Settings: 'settings'
//     }
//   },
//   async getInitialURL() {
//     const url = await Linking.getInitialURL();
//     if (typeof url === 'string') {
//       return url;
//     }
//     //getInitialNotification: When the application is opened from a quit state.
//     const message = await messaging().getInitialNotification();
//     const deeplinkURL = buildDeepLinkFromNotificationData(message?.data);
//     if (typeof deeplinkURL === 'string') {
//       return deeplinkURL;
//     }
//   },
//   subscribe(listener: (url: string) => void) {
//     const onReceiveURL = ({url}: {url: string}) => listener(url);

//     // Listen to incoming links from deep linking
//     const linkingSubscription = Linking.addEventListener('url', onReceiveURL);

//       messaging().setBackgroundMessageHandler(async remoteMessage => {
//       console.log('Message handled in the background!', remoteMessage);
//     });

//     const foreground = messaging().onMessage(async remoteMessage => {
//       console.log('A new FCM message arrived!', remoteMessage);

//     });

//     //onNotificationOpenedApp: When the application is running, but in the background.
//     const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
//       const url = buildDeepLinkFromNotificationData(remoteMessage.data)
//       if (typeof url === 'string') {
//         listener(url)
//       }
//     });

//     return () => {
//       linkingSubscription.remove();
//       unsubscribe();
//       foreground();
//     };
//   },
// }

export const tokenCache = {
  async getToken(key: string): Promise<string | null> {
    try {
      const val = await SecureStore.getItemAsync(key);
     console.log("tokenCache getToken:",val);      
      return val;
    } catch (err) {
      console.warn("[tokenCache.getToken] SecureStore get error:", err);
      return null;
    }
  },
  async saveToken(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (err) {
      console.warn("[tokenCache.saveToken] SecureStore set error:", err);
    }
  },
};

/**
 * A small fallback UI shown when critical config is missing.
 */
function MissingKeyScreen({ message }: { message: string }) {
  return (
    <SafeAreaProvider>
      <View style={styles.center}>
        <Text style={styles.title}>Configuration error</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
    </SafeAreaProvider>
  );
}

/**
 * InitialLayout handles routing based on authentication status.
 * Also forces a fresh token on Android once we detect a signed-in session (prevents stale token issues).
 */
function InitialLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // guard: prevent multiple replace() calls in quick succession
  const navigatedRef = useRef(false);

  // install interceptor once at startup
  useEffect(() => {
    const eject = setupClerkInterceptor();
    return () => {
      try {
        eject();
      } catch {}
    };
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    if (navigatedRef.current) return;

    const inAuthGroup = segments[0] === "(auth)";

    const handleSignedIn = async () => {
      if (Platform.OS === "android") {
        try {
          const clerk = getClerkInstance();
          // Force fresh token at session recognition time
          await clerk.session?.getToken({ skipCache: true });
          console.debug("[_layout] Android: forced token refresh after sign-in/isLoaded");
        } catch (err) {
          console.warn("[_layout] Android token refresh failed:", err);
        }
      }
      navigatedRef.current = true;
      router.replace("/(tabs)");
    };

    const handleSignedOut = () => {
      navigatedRef.current = true;
      router.replace("/(auth)/login");
    };

    if (isSignedIn) {
      if (!inAuthGroup) handleSignedIn();
    } else {
      if (!inAuthGroup) handleSignedOut();
    }
  }, [isLoaded, isSignedIn, segments, router]);

  return (
        // <NavigationContainer linking={linking} fallback={<ActivityIndicator animating />}>

    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
    // {/* </NavigationContainer> */}
  );
}

export default function App(): JSX.Element {
  if (!PUBLISHABLE_KEY) {
    return <MissingKeyScreen message="Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY — add it to your .env" />;
  }

  return (
    <SafeAreaProvider>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} tokenCache={tokenCache}>
        <InitialLayout />
      </ClerkProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  message: { fontSize: 14, color: "#444", textAlign: "center" },
});
