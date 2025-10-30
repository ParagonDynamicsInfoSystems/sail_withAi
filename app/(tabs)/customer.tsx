// app/(tabs)/customer.tsx
import React, { JSX } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

const W = Dimensions.get("window").width;

type CustomerItem = {
  id: number;
  name: string;
  entry: number;
  prizes: number;
  diamonds: number;
  phone?: string;
  email?: string;
};

const CUSTOMERS: CustomerItem[] = [
  { id: 1, name: "CUSTOMER1", entry: 1, prizes: 2, diamonds: 5, phone: "+91 99999 99999", email: "a@example.com" },
  { id: 2, name: "CUSTOMER2", entry: 1, prizes: 2, diamonds: 5, phone: "+91 88888 88888", email: "b@example.com" },
  { id: 3, name: "CUSTOMER3", entry: 1, prizes: 2, diamonds: 5, phone: "+91 77777 77777", email: "c@example.com" },
  { id: 4, name: "CUSTOMER4", entry: 1, prizes: 2, diamonds: 5 , phone: "+91 77777 77777", email: "c@example.com" },
  { id: 5, name: "CUSTOMER5", entry: 1, prizes: 2, diamonds: 5, phone: "+91 77777 77777", email: "c@example.com"  },
  { id: 6, name: "CUSTOMER6", entry: 1, prizes: 2, diamonds: 5 , phone: "+91 77777 77777", email: "c@example.com" },
];

export default function Customer(): JSX.Element {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={["#0B3B7A", "#103E7E"]} style={styles.header}>
        <Image source={require("../../assets/images/logo.png")} style={styles.logo} />
        <Text style={styles.headerTitle}>Customer Details</Text>
      </LinearGradient>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        {CUSTOMERS.map((c) => (
          <TouchableOpacity
            key={c.id}
            activeOpacity={0.85}
            onPress={() => {
              // navigate to detail page with id param
              router.push({
                pathname: "/customerDetail",
                params: { id: String(c.id) },
              });
            }}
          >
            <View style={styles.card}>
              {/* left: crown graphic (kept as decorative) and avatar */}
              <View style={styles.leftIconWrap}>
                <Image source={require("../../assets/images/crown.png")} style={styles.crown} />
                <Image
                  source={{ uri: `https://i.pravatar.cc/150?img=${(c.id % 70) + 1}` }}
                  style={styles.avatar}
                />
              </View>

              {/* main content */}
              <View style={styles.textContainer}>
                <Text style={styles.customerName}>{c.name}</Text>

                <View style={styles.infoRow}>
                  <View style={styles.infoGroup}>
                    <Text style={styles.entryLabel}>Entry</Text>
                    <View style={styles.circle}>
                      <Text style={styles.circleText}>{c.entry}</Text>
                    </View>
                  </View>

                  <View style={styles.infoGroup}>
                    <Text style={styles.entryLabel}>Prizes</Text>
                    <Text style={styles.entryValue}>🪙 {c.prizes}</Text>
                  </View>

                  <View style={styles.infoGroup}>
                    <Image source={require("../../assets/images/diamond.png")} style={styles.smallIcon} />
                    <Text style={styles.entryValue}>{c.diamonds}</Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#071a3a" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  logo: {
    position: "absolute",
    left: 18,
    width: 34,
    height: 34,
    tintColor: "#fff",
  },
  headerTitle: { color: "#fff", fontWeight: "800", fontSize: 18 },

  container: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingTop: 14,
    paddingHorizontal: 14,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.3,
    borderColor: "#e1e9ff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    position: "relative",
    backgroundColor: "#fff",
  },

  leftIconWrap: {
    width: 70,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  crown: {
    width: 54,
    height: 38,
    resizeMode: "contain",
  },
  avatar: {
    position: "absolute",
    left: 10,
    top: 4,
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "#fff",
  },

  textContainer: { flex: 1 },
  customerName: { color: "#0B3B7A", fontWeight: "800", fontSize: 15 },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  infoGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 14,
  },
  entryLabel: { color: "#7b8b97", fontSize: 12, marginRight: 6 },
  entryValue: {
    color: "#6a48ff",
    fontWeight: "700",
    fontSize: 13,
    marginLeft: 2,
  },

  circle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#ffde59",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 2,
  },
  circleText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#000",
  },

  smallIcon: { width: 16, height: 16, marginHorizontal: 4 },
});
