// app/components/TaskCard.tsx
import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageSourcePropType,
  GestureResponderEvent,
  TouchableOpacity,
} from "react-native";

type Props = {
  id?: string | number;
  title: string;
  done: number;
  goal: number;
  icon?: ImageSourcePropType;
  onPressIcon?: (e: GestureResponderEvent) => void;
  // optional size tweaks
  compact?: boolean;
};

export default function TaskCard({
  title,
  done,
  goal,
  icon,
  onPressIcon,
  compact = false,
}: Props) {
  const pct = Math.max(0, Math.min(100, Math.round((done / goal) * 100)));

  return (
    <View style={[styles.taskCard, compact && styles.taskCardCompact]}>
      <View style={styles.taskRow}>
        <Text style={[styles.taskTitle, compact && styles.taskTitleCompact]} numberOfLines={2}>
          {title}
        </Text>
      </View>

      <View style={styles.progressWrapper}>
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${pct}%` }]} />
        </View>

        {icon ? (
          <TouchableOpacity onPress={onPressIcon} activeOpacity={0.8} style={styles.iconTouchable}>
            <Image source={icon} style={styles.taskIcon} resizeMode="contain" />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.taskFooter}>
        <Text style={styles.taskSmall}>{done} customers done</Text>
        <Text style={styles.taskSmall}>Goal {goal}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  taskCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e6eef8",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginTop: 12,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  taskCardCompact: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  taskTitle: {
    fontFamily: "RubikOne",
    fontSize: 20,
    fontWeight: "800",
    color: "#2b1e1e",
    flex: 1,
    marginRight: 8,
  },
  taskTitleCompact: {
    fontSize: 16,
  },

  progressWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 8,
  },

  progressBg: {
    flex: 1,
    height: 14,
    borderRadius: 14,
    backgroundColor: "#eaf6ee",
    overflow: "hidden",
    justifyContent: "center",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#2fb36a",
    borderRadius: 14,
  },

  iconTouchable: {
    marginLeft: 12,
    alignSelf: "center",
  },

  taskIcon: {
    width: 34,
    height: 34,
  },

  taskFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },

  taskSmall: {
    fontFamily: "Rubik",
    fontSize: 12,
    color: "#1b6aa6",
  },
});
