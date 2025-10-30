import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import TaskCard from "./TaskCard";

const CHEST_ICON = require("../../assets/images/chest.png"); // dummy chest image

export default function DailyTasks() {
  const tasks = [
    { id: 1, title: "Contact 20 customers!!", done: 17, goal: 20 },
    // { id: 2, title: "complere 100!", done: 92, goal: 100 },
  ];

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Image
          source={require("../../assets/images/diamond.png")} // dummy diamond image
          style={styles.headerIcon}
          resizeMode="contain"
        />
        <Text style={styles.headerTitle}>Daily Tasks</Text>
      </View>

      {tasks.map((t) => (
        <TaskCard
          key={t.id}
          title={t.title}
          done={t.done}
          goal={t.goal}
          icon={CHEST_ICON}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f6fbff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  headerIcon: {
    width: 22,
    height: 22,
    marginRight: 8,
  },

  headerTitle: {
    fontFamily: "Rubik",
    fontWeight: "700",
    fontSize: 16,
    color: "#0D47A1",
  },
});
