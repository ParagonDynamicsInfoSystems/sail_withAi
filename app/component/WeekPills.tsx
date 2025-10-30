// app/components/WeekPills.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const WeekPills = () => {
  const today = new Date();
  // normalize times to midnight for safe compare
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  // Start of week = Sunday
  const startOfWeek = new Date(todayOnly);
  startOfWeek.setDate(todayOnly.getDate() - todayOnly.getDay());

  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];
  const week = weekDays.map((label, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const isToday = dateOnly.getTime() === todayOnly.getTime();
    const isPastOrToday = dateOnly.getTime() <= todayOnly.getTime();

    return { label, dateNum: dateOnly.getDate(), isToday, isPastOrToday };
  });

  return (
    <View style={styles.weekPills}>
      {week.map((item, i) => {
        // Past or today -> gradient background
        if (item.isPastOrToday) {
          // Use a different gradient when it's exactly today
          const colors = item.isToday ? ["#66A7FF", "#2E7AE6"] : ["rgba(102,167,255,0.18)", "rgba(46,122,230,0.18)"];

          return (
            <LinearGradient
              key={i}
              colors={colors}
              start={{ x: 0.2, y: 0 }}
              end={{ x: 0.8, y: 1 }}
              style={[
                styles.dayPill,
                item.isToday ? styles.dayPillToday : styles.dayPillPast,
                item.isToday && styles.dayPillTodayBorder,
              ]}
            >
              <Text style={[styles.dayLabel, item.isToday ? styles.dayLabelActive : styles.dayLabelPast]}>
                {item.label}
              </Text>
              <Text style={[styles.dayNumber, item.isToday ? styles.dayNumberActive : styles.dayNumberPast]}>
                {item.dateNum}
              </Text>
            </LinearGradient>
          );
        }

        // Future -> no fill, just outline
        return (
          <View key={i} style={styles.dayPill}>
            <Text style={styles.dayLabel}>{item.label}</Text>
            <Text style={styles.dayNumber}>{item.dateNum}</Text>
          </View>
        );
      })}
    </View>
  );
};

export default WeekPills;

const styles = StyleSheet.create({
  weekPills: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 8,
  },

  dayPill: {
    width: 33,
    height: 33,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.25)",
    marginRight: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },

  // Past (but not today) — subtle filled look
  dayPillPast: {
    borderColor: "rgba(255,255,255,0.25)",
  },

  // Today — bright gradient + white border
  dayPillToday: {
    borderColor: "#FFFFFF",
  },
  dayPillTodayBorder: {
    borderWidth: 3,
  },

  dayLabel: {
    color: "#dbe9ff",
    fontSize: 12,
    fontWeight: "700",
    fontFamily: "RubikOne", // ensure you have loaded this font
  },

  dayLabelPast: {
    color: "#eaf4ff",
  },

  dayLabelActive: {
    color: "#ffffff",
  },

  dayNumber: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "900",
    fontFamily: "RubikOne",
  },

  dayNumberPast: {
    color: "#ffffff",
    opacity: 0.95,
  },

  dayNumberActive: {
    color: "#ffffff",
  },

  
});
