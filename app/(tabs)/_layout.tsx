// app/(tabs)/_layout.tsx
import React from "react";
import { Tabs } from "expo-router";
import { View, StyleSheet, Platform, Image } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconWrap, focused && styles.iconWrapActive, focused && styles.iconLift]}>
              <Image
                source={
                  focused
                    ? require("../../assets/images/homeActive.png")
                    : require("../../assets/images/home.png")
                }
                style={styles.icon}
                resizeMode="contain"
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="badges"
        options={{
          title: "badges",
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconWrap, focused && styles.iconWrapActive, focused && styles.iconLift]}>
              <Image
                source={
                  focused
                    ? require("../../assets/images/diamondActive.png")
                    : require("../../assets/images/diamondtab.png")
                }
                style={styles.icon}
                resizeMode="contain"
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="LeaderBoard"
        options={{
          title: "LeaderBoard",
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconWrap, focused && styles.iconWrapActive, focused && styles.iconLift]}>
              <Image
                source={
                  focused
                    ? require("../../assets/images/gamepadActive.png")
                    : require("../../assets/images/gamepad.png")
                }
                style={styles.icon}
                resizeMode="contain"
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="Schedule"
        options={{
          title: "Schedule",
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconWrap, focused && styles.iconWrapActive, focused && styles.iconLift]}>
              <Image
                source={
                  focused
                    ? require("../../assets/images/boxActive.png")
                    : require("../../assets/images/box.png")
                }
                style={styles.icon}
                resizeMode="contain"
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="customer"
        options={{
          title: "customer",
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconWrap, focused && styles.iconWrapActive, focused && styles.iconLift]}>
              <Image
                source={
                  focused
                    ? require("../../assets/images/castleActive.png")
                    : require("../../assets/images/castle.png")
                }
                style={styles.icon}
                resizeMode="contain"
              />
            </View>
          ),
        }}
      />


       <Tabs.Screen
        name="customerDetail"
        options={{
          href: null, // hides from tab bar
          tabBarStyle: { display: "none" },
          headerShown: false,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    left: 18,
    right: 18,
    bottom: Platform.OS === "ios" ? 26 : 14,
    height: 70, // compact height like your mock
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    backgroundColor: "#113f78",
    borderTopWidth: 0,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 8,
    paddingHorizontal: 14,
    flexDirection: "row",
  },

  iconWrap: {
    width: 54,
    height: 54,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    marginHorizontal: 6,
  },

  // active icon circular background
  iconWrapActive: {
    backgroundColor: "#1cc0d8", // teal-ish shown in your mock
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.15)",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 6,
  },

  // lift focused icon slightly up so it "pops"
  iconLift: {
    transform: [{ translateY: -6 }],
  },

  icon: {
    width: 54,
    height: 54,
    borderRadius: 20,
  },
  
});
