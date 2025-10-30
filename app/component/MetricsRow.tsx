// app/component/MetricsRow.tsx
import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator, ColorValue } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
// ASSUMPTION: You must import useAuthApi from its location
import { useAuthApi } from "../hooks/authApi"; 

// --- TYPE DEFINITIONS ---
export type Metric = {
  id?: string | number;
  icon?: any; // require(...) or { uri: ... }
  label: string;
  value: string | number;
  small?: string;
  colorGradient?: [ColorValue, ColorValue];
};

// Interface for API data structure
interface MonthlyData {
  current: number;
  target: number;
  achievement_percentage: number;
}
interface ApiData {
  data: {
    monthly: Record<string, MonthlyData>;
    yearly: {
      current: number;
      target: number;
      achievement_percentage: number;
    };
  };
}

// --- IMAGE MOCKS ---
// WARNING: Ensure these paths are correct relative to THIS file's location
const IMAGE_TOTAL_TEU = require("../../assets/images/totue.png");
const IMAGE_TARGET_TEU = require("../../assets/images/tgtue.png");
const IMAGE_CONVERSION = require("../../assets/images/cr.png");
const IMAGE_APPOINTMENTS = require("../../assets/images/aa.png");

// --- COMPONENT LOGIC ---
export default function MetricsRow() {
  const { get } = useAuthApi();
  const [metrics, setMetrics] = useState<Metric[] | null>(null);
  const [loading, setLoading] = useState(true);
  
  const DEFAULT_GRADIENT: [ColorValue, ColorValue] = ["#1e66b0", "#0D47A1"];

  const fetchAndSetMetrics = async () => {
    setLoading(true);
    try {
      const response: ApiData = await get("crm_data/target_status/teu");

      const date = new Date();
      const currentMonthIndex = date.getMonth();
      const currentMonthName = date.toLocaleString('default', { month: 'long' });

      const monthlyData = response.data.monthly[String(currentMonthIndex)];

      const yearlyData = response.data.yearly;
            console.log("yearlyData:", yearlyData);

      const totalTEUs = yearlyData.current; 
      
      const sumOfMonthlyTargets = Object.values(response.data.monthly)
        .reduce((sum, item: MonthlyData) => sum + item.target, 0);

      const fetchedMetrics: Metric[] = [
        {
          id: 1,
          icon: IMAGE_TOTAL_TEU,
          label: "Total TEUs",
          value: totalTEUs.toLocaleString(), 
          small: "Year to Date Total",
          colorGradient: ["#1e66b0", "#0D47A1"],
        },
        {
          id: 2,
          icon: IMAGE_TARGET_TEU,
          label: "Target TEUs",
          value: yearlyData.target.toLocaleString(),
          small: `Target for ${date.getFullYear()}`,
          colorGradient: ["#1e66b0", "#0D47A1"], 
        },
        {
          id: 3,
          icon: IMAGE_CONVERSION,
          label: "Conversion Rate",
          value: `${monthlyData.achievement_percentage}%`,
          small: `Achievement in ${currentMonthName}`,
          colorGradient: ["#0D47A1", "#0D47A1"], 
        },
        {
          id: 4,
          icon: IMAGE_APPOINTMENTS,
          label: "Active Appointments",
          value: "24", // Still a placeholder value
          small: "This week",
          colorGradient: ["#880E4F", "#C2185B"], 
        },
      ];

      setMetrics(fetchedMetrics);
    } catch (error) {
      console.error("Failed to fetch metrics:", error);
      setMetrics([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndSetMetrics();
  }, []); // Run only once on mount

  const items: Metric[] = Array.isArray(metrics) ? metrics : [];

  // --- RENDERING ---

  if (loading) {
      // Return a loading state while fetching
      return <ActivityIndicator size="large" color="#0D47A1" style={{ padding: 20 }} />;
  }
    
  if (items.length === 0) return null;

  return (
    <View style={styles.row}>
      {items.map((m, idx) => {
        const gradientColors = m.colorGradient || DEFAULT_GRADIENT;

        return (
          <LinearGradient
            key={m.id ?? idx}
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.card,
              // Slightly larger right margin for last card so it doesn't cut off
              idx === items.length - 1 ? { marginRight: 28 } : null,
            ]}
          >
            {/* Left icon badge - Conditionally rendered */}
            {m.icon ? (
              <View style={styles.iconWrap}>
                <Image source={m.icon} style={styles.icon} resizeMode="contain" />
              </View>
            ) : null}

            {/* Text content */}
            <View style={[styles.textWrap, !m.icon && { marginLeft: 0 }]}>
              <Text style={styles.label}>{m.label}</Text>
              <Text style={styles.value}>{m.value}</Text>
              {m.small ? <Text style={styles.small}>{m.small}</Text> : null}
            </View>
          </LinearGradient>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 6,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    width: 220,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 18,
    marginRight: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },

  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  icon: {
    width: 36,
    height: 36,
  },

  textWrap: {
    flex: 1,
    justifyContent: "center",
  },

  label: {
    color: "#cfe8ff",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
  },

  value: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 2,
  },

  small: {
    color: "#d3e7ff",
    fontSize: 12,
  },
});