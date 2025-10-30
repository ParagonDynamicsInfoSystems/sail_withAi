import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import welcomeImg from "../../assets/images/welcome_img.png";


export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Top Circle */}
      <View style={styles.circle} />

      {/* Title */}
      <Text style={styles.title}>Level Up with Sail With AI!</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Track your progress, win achievements,{"\n"}and make every sale count 🏆
      </Text>

      {/* Illustration */}
      <Image
        source={welcomeImg} // replace later
        style={styles.image}
        resizeMode="contain"
      />

      {/* Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(auth)/login")}
      >
        <Text style={styles.buttonText}>Get Started →</Text>
      </TouchableOpacity>

      {/* Sign In Text */}
      <Text style={styles.footerText}>
        Already have an account?{" "}
        <Text
          style={styles.signIn}
          onPress={() => router.push("/(auth)/login")}
        >
          Sign In
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  circle: {
    width: 70,
    height: 70,
    backgroundColor: "#0D47A1",
    borderRadius: 35,
    marginBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    color: "#0D47A1",
    marginBottom: 10,
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 350,
    marginVertical: 20,
  },
  button: {
    backgroundColor: "#0D47A1",
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  footerText: {
    marginTop: 25,
    color: "#666",
    fontSize: 14,
  },
  signIn: {
    color: "#0D47A1",
    fontWeight: "600",
  },
});
