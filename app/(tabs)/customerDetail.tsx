// app/(tabs)/customerDetail.tsx
import React, { JSX } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {  useRouter } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";

/**
 * Mock data (same shape as your list). In real app fetch by id.
 */
const CUSTOMERS = [
  {
    id: "1",
    company: "XYZ NAME",
    contact: "Andrew G",
    phone: "+91 899898989",
    email: "andrewg@gmail.com",
    designation: "Senior sales executive",
    contractValue: "$ 168,000",
    expectedClose: "30/10/2023",
    expectedProfit: "$ 34,000",
    confidence: "65%",
  },
  {
    id: "2",
    company: "ACME Corp",
    contact: "Maria S",
    phone: "+91 8888888888",
    email: "maria@example.com",
    designation: "Head of Sales",
    contractValue: "$ 98,500",
    expectedClose: "12/11/2023",
    expectedProfit: "$ 12,300",
    confidence: "72%",
  },
  // add more mock customers if needed
];

export default function CustomerDetail(): JSX.Element {
  const params = useSearchParams();
  const router = useRouter();
  const id = (params?.get("id") as string) || "1";

  const data = CUSTOMERS.find((c) => c.id === id);

  const navigateBack = () => {
    if (router.canGoBack()) router.back();
    else router.push("/customer"); // fallback
  };

  if (!data) {
    return (
      <SafeAreaView style={styles.safe}>
        <LinearGradient colors={["#0B3B7A", "#103E7E"]} style={styles.headerBackground} />
        <View style={styles.headerBar}>
          <Text style={styles.headerTitle}>Customer Details</Text>
        </View>

        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Customer not found.</Text>
          <TouchableOpacity style={styles.scheduleBtn} onPress={navigateBack}>
            <Text style={styles.scheduleBtnText}>Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* header gradient (background) */}
      <LinearGradient colors={["#0B3B7A", "#103E7E"]} style={styles.headerBackground} />

      {/* header bar with logo + title */}
      <View style={styles.headerBar}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
        />
        <Text style={styles.headerTitle}>Customer Details</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Floating white card that overlaps header */}
        <View style={styles.floatingTopCard}>
          {/* Title row: back button on left, centered company name with icons */}
          <View style={styles.titleRow}>
            <TouchableOpacity onPress={navigateBack} style={styles.backButton} accessibilityLabel="Go back">
              <Text style={styles.backButtonText}>‹</Text>
            </TouchableOpacity>

            <View style={styles.customerTitleWrap}>
              <Image source={require("../../assets/images/crown.png")} style={styles.crownIcon} />
              <Text style={styles.customerTitle}>{data.company}</Text>
              <Image source={require("../../assets/images/crown.png")} style={styles.crownIcon} />
            </View>

            <View style={{ width: 36 }} />
          </View>

          {/* Contact info (two columns) */}
          <View style={styles.infoBox}>
            <View style={styles.infoRow}>
              <View style={styles.col}>
                <Text style={styles.infoLabel}>Contact Person Name</Text>
                <Text style={styles.infoValue}>{data.contact}</Text>

                <Text style={[styles.infoLabel, { marginTop: 12 }]}>Email</Text>
                <Text style={[styles.infoValue, { color: "#0B3B7A" }]}>{data.email}</Text>
              </View>

              <View style={styles.col}>
                <Text style={styles.infoLabel}>Contact Number</Text>
                <Text style={styles.infoValue}>{data.phone}</Text>

                <Text style={[styles.infoLabel, { marginTop: 12 }]}>Designation</Text>
                <Text style={[styles.infoValue, { color: "#0B3B7A" }]}>{data.designation}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Stats rows */}
            <View style={styles.statRow}>
              <Image source={require("../../assets/images/briefcase.png")} style={styles.statIcon} />
              <View style={styles.statTextWrap}>
                <Text style={styles.statLabel}>TOTAL CONTRACT VALUE</Text>
                <Text style={styles.statValue}>{data.contractValue}</Text>
              </View>
            </View>

            <View style={styles.statRow}>
              <Image source={require("../../assets/images/castle.png")} style={styles.statIcon} />
              <View style={styles.statTextWrap}>
                <Text style={styles.statLabel}>EXPECTED CLOSE DATE</Text>
                <Text style={styles.statValue}>{data.expectedClose}</Text>
              </View>
            </View>

            <View style={styles.statRow}>
              <Image source={require("../../assets/images/totue.png")} style={styles.statIcon} />
              <View style={styles.statTextWrap}>
                <Text style={styles.statLabel}>TOTAL EXPECTED PROFIT</Text>
                <Text style={styles.statValue}>{data.expectedProfit}</Text>
              </View>
            </View>

            {/* Confidence row (two items side-by-side) */}
            <View style={[styles.statRow, styles.confidenceRow]}>
              <View style={styles.confidenceItem}>
                <Image source={require("../../assets/images/confidance.png")} style={styles.statIconSmall} />
                <View style={styles.statTextWrap}>
                  <Text style={styles.statLabel}>CONFIDENCE</Text>
                  <Text style={styles.statValue}>{data.confidence}</Text>
                </View>
              </View>

              <View style={styles.confidenceItem}>
                <Image source={require("../../assets/images/Cup silver.png")} style={styles.statIconSmall} />
                <View style={styles.statTextWrap}>
                  <Text style={styles.statLabel}>CONFIDENCE</Text>
                  <Text style={styles.statValue}>{data.confidence}</Text>
                </View>
              </View>
            </View>

            {/* Schedule button */}
            <TouchableOpacity style={styles.scheduleBtn} activeOpacity={0.85} >
              <Image source={require("../../assets/images/diamond.png")} style={styles.scheduleIcon} />
              <Text style={styles.scheduleBtnText}>Schedule a meeting</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* Styles */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0B3B7A" },

  headerBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 140,
  },

  headerBar: {
    paddingTop: 14,
    paddingBottom: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  logo: { position: "absolute", left: 18, width: 36, height: 36, },
  headerTitle: { color: "#fff", fontWeight: "800", fontSize: 18 },

  container: {
    backgroundColor: "#f5f8fb",
    flexGrow: 1,
    paddingTop: 50,
  },

  floatingTopCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: -24,
    padding: 18,
    paddingTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#eef3f8",
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: { color: "#0B3B7A", fontSize: 22, fontWeight: "800" },

  customerTitleWrap: { flexDirection: "row", alignItems: "center", justifyContent: "center", flex: 1 },
  crownIcon: { width: 20, height: 20, marginHorizontal: 6, tintColor: "#ffbb00" },
  customerTitle: { fontWeight: "800", fontSize: 16, color: "#0B3B7A" },

  infoBox: { marginTop: 8 },

  infoRow: { flexDirection: "row", justifyContent: "space-between" },
  col: { width: "48%" },

  infoLabel: { color: "#7b8b97", fontSize: 12, fontWeight: "700" },
  infoValue: { fontSize: 14, color: "#15314a", marginTop: 6, fontWeight: "700" },

  divider: { height: 1, backgroundColor: "#eef3f8", marginVertical: 16 },

  statRow: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  statIcon: { width: 34, height: 34, marginRight: 12, tintColor: undefined },
  statIconSmall: { width: 28, height: 28, marginRight: 8 },

  statTextWrap: { flex: 1 },
  statLabel: { color: "#0B3B7A", fontSize: 12, fontWeight: "800" },
  statValue: { fontSize: 16, color: "#15314a", fontWeight: "700", marginTop: 4 },

  confidenceRow: { justifyContent: "space-between" },
  confidenceItem: { flexDirection: "row", alignItems: "center", width: "48%" },

  scheduleBtn: {
    marginTop: 14,
    backgroundColor: "#0D47A1",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    shadowColor: "#0D47A1",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
  scheduleIcon: { width: 18, height: 18, marginRight: 10, tintColor: "#fff" },
  scheduleBtnText: { color: "#fff", fontWeight: "800", fontSize: 15 },

  notFoundContainer: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  notFoundText: { color: "#fff", fontSize: 18, marginBottom: 12 },
});
