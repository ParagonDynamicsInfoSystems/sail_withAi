// app/(tabs)/badges.tsx
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { LineChart } from "react-native-chart-kit";

const SCREEN_W = Dimensions.get("window").width;

export default function Badges() {
    const [selectedSegment, setSelectedSegment] = useState<number>(0);

  const badges = [
    {
      image: require("../../assets/images/badge1.png"),
      label: "Elite\nCloser",
      labelColor: "#6b49ff",
    },
    {
      image: require("../../assets/images/badge2.png"),
      label: "Sharp\nScheduler",
      labelColor: "#8a2be2",
    },
    {
      image: require("../../assets/images/badge3.png"),
      label: "Prince\nof Calls",
      labelColor: "#23c39a",
    },
    {
      image: require("../../assets/images/badge4.png"),
      label: "Shark",
      labelColor: "#ff6b6b",
    },
    {
      image: require("../../assets/images/badge5.png"),
      label: "Star",
      labelColor: "#2b8cf4",
    },
  ];

  const chartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [3000, 800, 1150, 500, 1400, 2000, 1700],
        color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const tasks = [
    { title: "Appointment set", done: 83, total: 156 },
    { title: "Meetings Held", done: 83, total: 156 },
    { title: "Proposals sent", done: 83, total: 156 },
    { title: "Deals closed", done: 83, total: 156 },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header gradient + badges inside */}
        <LinearGradient
          colors={["#0B3B7A", "#1357A6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.headerGradient}
        >
          {/* Logo + centered title (logo absolute to left in styles) */}
          <View style={styles.headerTop}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.headerTitle}>BADGES</Text>
          </View>

          {/* Badges inside gradient */}
          <View style={styles.badgeContainer}>
            {badges.map((b, i) => (
              <View key={i} style={styles.badgeItem}>
                <View style={styles.badgeCircle}>
                  <Image
                    source={b.image}
                    style={styles.badgeIcon}
                    resizeMode="contain"
                  />
                </View>
                <Text
                  style={[styles.badgeLabel, { color: b.labelColor }]}
                  numberOfLines={2}
                >
                  {b.label}
                </Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* ---------- rest of the page (overview, chart, hero, progress) ---------- */}

        {/* Overview / stats card */}
        {/* Overview / stats card */}
<View style={styles.statsCard}>
  {/* Centered segmented control (selectable) */}
  <View style={styles.segmentRowCenter}>
    <View style={styles.segmentPill}>
      {["Overview", "Weekly", "Analytic"].map((label, idx) => {
        const active = idx === selectedSegment;
        return (
          <TouchableOpacity
            key={label}
            style={[
              styles.segmentOption,
              active ? styles.segmentOptionActive : null,
              // give first/last rounded corners when active for exact pill feel
              idx === 0 && active ? styles.segmentLeftActive : null,
              idx === 2 && active ? styles.segmentRightActive : null,
            ]}
            activeOpacity={0.85}
            onPress={() => setSelectedSegment(idx)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
          >
            <Text style={active ? styles.segmentTextActive : styles.segmentText}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  </View>

  {/* main content row */}
  <View style={styles.overviewRow}>
    {/* Left: big number + subtitle */}
    <View style={styles.overviewLeft}>
      <View style={styles.bigNumberRow}>
        <Text style={styles.bigNumber}>9,546</Text>

        {/* small green percentage pill aligned to number */}
        <View style={styles.percentPill}>
          <Text style={styles.percentText}>+1.3%</Text>
          <View style={styles.percentDot} />
        </View>
      </View>

      <Text style={styles.subText}>
        Your sales increased this month by 5.7%.
      </Text>

      <View style={styles.legendInline}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#2b8cf4" }]} />
          <Text style={styles.legendText}>Active</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#e49cf8" }]} />
          <Text style={styles.legendText}>Maintenance</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#111827" }]} />
          <Text style={styles.legendText}>Inactive</Text>
        </View>
      </View>
    </View>

    {/* Right: overlapping circles (pie-mimic) */}
    <View style={styles.overviewRight}>
      <View style={styles.pieWrap}>
        <View style={[styles.circleBig, { backgroundColor: "#2b8cf4" }]}>
          <Text style={styles.circleText}>70%</Text>
        </View>
        <View style={[styles.circleMed, { backgroundColor: "#e49cf8" }]}>
          <Text style={styles.circleTextSmall}>20%</Text>
        </View>
        <View style={[styles.circleSmall, { backgroundColor: "#111827" }]}>
          <Text style={styles.circleTextTiny}>10%</Text>
        </View>
      </View>
    </View>
  </View>
</View>


        {/* Chart card */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Image source={require("../../assets/images/chest.png")} style={styles.chartIcon} />
            <Text style={styles.chartTitle}>Active Sales</Text>
          </View>

          <LineChart
            data={chartData}
            width={SCREEN_W - 50}
            height={180}
            chartConfig={{
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
              labelColor: () => "#7b8b97",
              propsForDots: { r: "4", strokeWidth: "2", stroke: "#1976d2" },
            }}
            bezier
            style={styles.chart}
          />
        </View>

        {/* Hero total leads */}
     <ImageBackground
  source={require("../../assets/images/cardBK1.png")} // 🔹 use your own background image
  style={styles.heroCard}
  imageStyle={styles.heroBgImage}
  resizeMode="cover"
>
  <Image
    source={require("../../assets/images/crown.png")}
    style={styles.heroIcon}
  />
  <View style={styles.cardBK} >
    <Text style={styles.heroTitle}>Total Leads</Text>
    <Text style={styles.heroNumber}>156</Text>
    <Text style={styles.heroSub}>customers</Text>
  </View>
</ImageBackground>


        {/* Progress block */}
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Customers left to conquer ⚔️</Text>

          {tasks.map((t, idx) => {
            const pct = Math.round((t.done / t.total) * 100);
            return (
              <View key={idx} style={styles.taskCard}>
                <Text style={styles.taskName}>{t.title}</Text>

                <View style={styles.progressWrap}>
                  <View style={styles.progressBg}>
                    <View style={[styles.progressFill, { width: `${pct}%` }]} />
                  </View>
                  <Image source={require("../../assets/images/chest.png")} style={styles.progressIcon} />
                </View>

                <View style={styles.progressFooter}>
                  <Text style={styles.progressText}>{t.done} customers done</Text>
                  <Text style={styles.progressText}>Goal {t.total}</Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { backgroundColor: "#fff" },

  headerBottomCurve: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: -18,
    height: 36,
    backgroundColor: "#fff",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },

  headerGradient: {
    width: "100%",
    borderRadius: 16,
    paddingTop: 40,
    paddingBottom: 24,
    paddingHorizontal: 18,
    marginBottom: 16,
    overflow: "hidden",
    alignItems: "center",
  },

  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // centers the text
    width: "100%",
    position: "relative",
    marginBottom: 14,
  },

  logo: {
    position: "absolute",
    left: 0, // sticks the logo to the left edge
    width: 36,
    height: 36,
  },

  headerTitle: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 20,
    textAlign: "center",
    flex: 1, // allows proper centering
  },

  badgeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 3,
    paddingHorizontal: 4,
  },

  badgeItem: {
    alignItems: "center",
    width: (SCREEN_W - 60) / 5,
  },

  badgeCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",    
  },

  badgeIcon: {
    width: 54,
    height: 54,
  },

  badgeLabel: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 14,
  },

  /* ---------- stats card / overview styles ---------- */
  statsCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  /* centered segmented control wrapper */
  segmentRowCenter: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  /* outer pill which contains the three options */
  segmentPill: {
    flexDirection: "row",
    backgroundColor: "#f5f8fb",
    borderRadius: 28,
    padding: 4,
    borderWidth: 1,
    borderColor: "#e6eef8",
    minWidth: 260,
    alignItems: "center",
    justifyContent: "center",
  },

  segmentOption: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },

  segmentOptionActive: {
    backgroundColor: "#fff",
    // small shadow to look raised
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },

  segmentText: { color: "#7b8b97", fontSize: 13 },
  segmentTextActive: { color: "#0b69b6", fontSize: 13, fontWeight: "700" },

  /* main content row */
  overviewRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  overviewLeft: {
    flex: 1,
    paddingRight: 12,
  },

  bigNumberRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  bigNumber: {
    fontSize: 32,
    fontWeight: "800",
    color: "#111827",
    marginRight: 10,
  },

  /* small green pill with dot */
  percentPill: {
    backgroundColor: "#e9f7ef",
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  percentText: {
    color: "#1ca55a",
    fontWeight: "700",
    fontSize: 12,
    marginRight: 6,
  },
  percentDot: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: "#1ca55a",
  },

  subText: {
    color: "#64747f",
    fontSize: 13,
    marginTop: 8,
    lineHeight: 18,
  },

  /* legend inline beneath number */
  legendInline: {
    flexDirection: "row",
    marginTop: 14,
    alignItems: "center",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  legendDot: { width: 12, height: 12, borderRadius: 6, marginRight: 8 },
  legendText: { fontSize: 12, color: "#7b8b97", fontWeight: "600" },

  /* right side circles */
  overviewRight: {
    width: 150,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  pieWrap: {
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  circleBig: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: "center",
    justifyContent: "center",
  },
  circleMed: {
    width: 66,
    height: 66,
    borderRadius: 33,
    position: "absolute",
    right: -6,
    top: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  circleSmall: {
    width: 44,
    height: 44,
    borderRadius: 22,
    position: "absolute",
    right: 6,
    bottom: 6,
    alignItems: "center",
    justifyContent: "center",
  },

  circleText: { color: "#fff", fontWeight: "800", fontSize: 18 },
  circleTextSmall: { color: "#fff", fontWeight: "700", fontSize: 12 },
  circleTextTiny: { color: "#fff", fontWeight: "700", fontSize: 10 },

  /* Chart card */
  chartCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  chartHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  chartIcon: { width: 30, height: 30, marginRight: 8 },
  chartTitle: { fontWeight: "700", color: "#15314a", fontSize: 16 },
  chart: { borderRadius: 12 },

  /* Hero */
 heroCard: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-start",
  borderRadius: 14,
  padding: 16,
  marginBottom: 16,
  overflow: "hidden", // ensures rounded corners clip image
},

heroBgImage: {
  borderRadius: 14,
  opacity: 0.95, // softens image (optional)
},

heroIcon: {
  width: 80,
  height: 80,
  marginRight: 20,
},

heroTitle: {
  color: "#fff",
  fontWeight: "700",
  fontSize: 20,
},

heroNumber: {
  color: "#fff",
  fontSize: 32,
  fontWeight: "900",
  marginVertical: 2,
},

heroSub: {
  color: "#fff",
  fontSize: 20,
},
cardBK:{
 justifyContent: "center",
 alignItems: "center",
 display: "flex",
 width: "60%",

},

  /* Progress block */
  progressCard: {
    backgroundColor: "#052a4b",
    borderRadius: 12,
    padding: 16,
  },
  progressTitle: { color: "#fff", fontWeight: "700", marginBottom: 8 },
  taskCard: { marginBottom: 12 },
  taskName: { color: "#fff", fontWeight: "800", marginBottom: 6 },
  progressWrap: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  progressBg: {
    flex: 1,
    height: 10,
    borderRadius: 10,
    backgroundColor: "#0f3350",
    marginRight: 8,
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: "#34b36b" },
  progressIcon: { width: 30, height: 30 },
  progressFooter: { flexDirection: "row", justifyContent: "space-between" },
  progressText: { color: "#9fd0ff", fontSize: 12 },
  segmentLeftActive: {
  borderTopLeftRadius: 22,
  borderBottomLeftRadius: 22,
},
segmentRightActive: {
  borderTopRightRadius: 22,
  borderBottomRightRadius: 22,
},
});
