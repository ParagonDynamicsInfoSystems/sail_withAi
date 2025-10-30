// app/(auth)/login.tsx

import { getClerkInstance, useAuth, useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import GoogleIcon from "../../assets/icon/googleIcon.svg";

export default function Login() {
  const router = useRouter();
  const { signIn, setActive, isLoaded } = useSignIn();
  const { isSignedIn } = useAuth();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/(tabs)");
    }
  }, [isSignedIn, isLoaded, router]);

  const onSignInPress = async () => {
    if (!isLoaded) {
      console.warn("Clerk not loaded yet, ignoring sign-in attempt.");
      return;
    }

    setError("");

    if (!emailAddress || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {

              const clerk = getClerkInstance();

                              let token = await clerk?.session?.getToken();
      console.log("token before login", token);

      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
                              

        // ANDROID: Force Clerk to mint a fresh token immediately after sign-in
        if (Platform.OS === "android") {
          try {
            const clerk = getClerkInstance();
            await clerk.session?.getToken({ skipCache: true });
            console.debug("[login] Android: forced token refresh after sign-in");
          } catch (refreshErr) {
            console.warn("[login] forced token refresh failed:", refreshErr);
          }
        }

        router.replace("/(tabs)");
      } else {
        console.warn("Sign-in flow not complete, status:", signInAttempt.status);
        setError("Sign-in process requires further verification steps.");
      }
    } catch (err: any) {
      console.error("Clerk Sign-in Error:", JSON.stringify(err, null, 2));
      const errorMessage = err?.errors?.[0]?.longMessage || "Invalid email or password. Please try again.";
      setError(errorMessage);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.wrapper} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Image source={require("../../assets/images/loginImage.png")} style={styles.hero} resizeMode="contain" />
          <Text style={styles.title}>Sign In To Sail With AI</Text>

          <View style={styles.form}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputRow}>
              <Text style={styles.leftIcon}>✉️</Text>
              <TextInput
                value={emailAddress}
                onChangeText={setEmailAddress}
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                placeholderTextColor="#9aa0b0"
              />
            </View>

            <Text style={[styles.label, { marginTop: 16 }]}>Password</Text>
            <View style={styles.inputRow}>
              <Text style={styles.leftIcon}>🔒</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password..."
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                style={styles.input}
                placeholderTextColor="#9aa0b0"
              />
              <Pressable onPress={() => setShowPassword((s) => !s)} style={styles.eyeBtn} hitSlop={{ top: 6, bottom: 6, left: 8, right: 8 }}>
                <Text style={styles.eyeText}>{showPassword ? "👁️" : "👁️‍🗨️"}</Text>
              </Pressable>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity style={styles.primaryButton} onPress={onSignInPress} disabled={!isLoaded}>
              <Text style={styles.primaryText}>Sign In →</Text>
            </TouchableOpacity>

            <View className="or" style={styles.orRow}>
              <View style={styles.line} />
              <Text style={styles.orText}>or</Text>
              <View style={styles.line} />
            </View>

            <TouchableOpacity
              style={styles.googleBtn}
              onPress={() => {
                console.log("Google Sign-In Pressed (Requires useOAuth implementation)");
              }}
            >
              <GoogleIcon width={56} height={56} />
            </TouchableOpacity>

            <View style={styles.linksRow}>
              <Text style={styles.smallText}>Don’t have an account? </Text>
              <Pressable>
                <Text style={styles.linkText}>Sign Up.</Text>
              </Pressable>
            </View>

            <Pressable>
              <Text style={[styles.linkText, { marginTop: 8 }]}>Forgot Password</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// 🎨 Styles (No Change)
const BLUE = "#0D47A1";
const LIGHT_BORDER = "#D9D9D9";
const INPUT_BG = "#fff";

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#FFFFFF" },
  container: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 28,
    paddingTop: 36,
    paddingBottom: 50,
  },
  content: {
    width: "100%",
    alignItems: "center",
  },
  hero: {
    width: "100%",
    height: 260,
    marginTop: 6,
    marginBottom: 18,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: BLUE,
    textAlign: "center",
    marginBottom: 18,
  },
  form: {
    width: "100%",
    alignItems: "center",
  },
  label: {
    width: "100%",
    color: BLUE,
    fontWeight: "600",
    marginBottom: 8,
    paddingLeft: 12,
  },
  inputRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: LIGHT_BORDER,
    borderRadius: 28,
    paddingHorizontal: 12,
    backgroundColor: INPUT_BG,
    height: 52,
  },
  leftIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 10,
    color: "#222",
  },
  eyeBtn: {
    marginLeft: 8,
    padding: 6,
  },
  eyeText: {
    fontSize: 18,
  },
  primaryButton: {
    marginTop: 18,
    backgroundColor: BLUE,
    width: "86%",
    height: 52,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  orRow: {
    width: "86%",
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#e6e6e6",
  },
  orText: {
    marginHorizontal: 12,
    color: "#9aa0b0",
    fontSize: 13,
  },
  googleBtn: {
    marginTop: 18,
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: LIGHT_BORDER,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  linksRow: {
    flexDirection: "row",
    marginTop: 18,
    alignItems: "center",
  },
  smallText: {
    color: "#7b7b8a",
  },
  linkText: {
    color: BLUE,
    fontWeight: "600",
  },
  errorText: {
    marginTop: 12,
    color: "red",
    fontSize: 14,
    textAlign: "center",
    width: "100%",
  },
});
