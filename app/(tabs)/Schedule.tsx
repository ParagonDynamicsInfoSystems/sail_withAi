// app/(tabs)/Schedule.tsx
import React from "react";
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
import { EvilIcons } from "@expo/vector-icons";

const W = Dimensions.get("window").width;

// Dummy images — replace with your own local assets if available
const MAIL_IMG = require("../../assets/images/Letter.png"); // placeholder

type Meeting = {
  id: string;
  title: string;
  mode: "Online" | "Offline";
  time: string;
  confidence: string;
};

const MEETINGS: Meeting[] = [
  { id: "m1", title: "Meeting with Vijay", mode: "Online", time: "10:00PM", confidence: "85%" },
  { id: "m2", title: "Meeting with Vijay", mode: "Offline", time: "1:00PM", confidence: "85%" },
  { id: "m3", title: "Meeting with Vijay", mode: "Online", time: "4:00PM", confidence: "85%" },
];

export default function Schedule() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dates = ["11", "12", "13", "14", "15", "16", "17"];
  const todayIndex = 2; // e.g., Wednesday (index 2)

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={["#0B3B7A", "#103E7E"]} style={styles.headerGradient}>
        <Image source={require("../../assets/images/logo.png")} style={styles.logo} />
        <Text style={styles.headerTitle}>Schedule</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Date pill */}
        <View style={styles.dateCard}>
          <View style={styles.monthRow}>
            <Text style={styles.monthText}>October</Text>
            <View style={styles.monthDates}>
              <Text style={styles.monthSmall}>Mon</Text>
              <Text style={styles.monthSmall}>Tue</Text>
              <Text style={styles.monthSmall}>Wed</Text>
              <Text style={styles.monthSmall}>Thu</Text>
              <Text style={styles.monthSmall}>Fri</Text>
              <Text style={styles.monthSmall}>Sat</Text>
              <Text style={styles.monthSmall}>Sun</Text>
            </View>
          </View>

          <View style={styles.datesRow}>
            {dates.map((d, i) => {
              const isToday = i === todayIndex;
              return (
                <View key={i} style={[styles.dateBubble, isToday && styles.dateBubbleActive]}>
                  <Text style={[styles.dateDay, isToday && styles.dateDayActive]}>
                    {days[i].slice(0, 1)}
                  </Text>
                  <Text style={[styles.dateNum, isToday && styles.dateNumActive]}>{d}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Todays To-do */}
        <View style={styles.todoCard}>
          <View style={styles.todoHeader}>
            <Image source={require("../../assets/images/diamond.png")} style={styles.todoIcon} />
            <Text style={styles.todoTitle}>Todays To-do List</Text>
          </View>

          <View style={styles.chipsRow}>
            <View style={styles.chip}><Text style={styles.chipText}>5 meetings</Text></View>
            <View style={styles.chip}><Text style={styles.chipText}>3 Tasks</Text></View>
          </View>
        </View>

        {/* Timeline */}
        <View style={styles.timeline}>
          {/* For each visible time group show time and cards */}
          <View style={styles.timeGroup}>
            <Text style={styles.timeLabel}>8:00 am</Text>

            <View style={styles.meetingCard}>
              <Image source={MAIL_IMG} style={styles.meetingIcon} />
              <View style={{ flex: 1 }}>
                <Text style={styles.meetingTitle}>Meeting with Vijay</Text>

                <View style={styles.meetingMetaRow}>
                  <View style={styles.metaItem}>
                    <EvilIcons name="sc-telegram" size={16} color="#2a6fb6" />
                    <Text style={styles.metaText}>Online</Text>
                  </View>

                  <View style={[styles.metaItem, { marginLeft: 12 }]}>
                    <Text style={styles.metaText}>⏳ { "10:00PM" }</Text>
                  </View>
                </View>

                <View style={styles.cardDivider} />

                <View style={styles.cardBottomRow}>
                  <Text style={styles.confidenceText}>Confidence: 85%</Text>

                  <TouchableOpacity style={styles.joinBtn}>
                    <Text style={styles.joinText}>🪙 Join Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Add second card example */}
            <View style={styles.meetingCard}>
              <Image source={MAIL_IMG} style={styles.meetingIcon} />
              <View style={{ flex: 1 }}>
                <Text style={styles.meetingTitle}>Meeting with Vijay</Text>

                <View style={styles.meetingMetaRow}>
                  <View style={styles.metaItem}>
                    <EvilIcons name="sc-telegram" size={16} color="#2a6fb6" />
                    <Text style={styles.metaText}>Offline</Text>
                  </View>

                  <View style={[styles.metaItem, { marginLeft: 12 }]}>
                    <Text style={styles.metaText}>⏳ { "1:00PM" }</Text>
                  </View>
                </View>

                <View style={styles.cardDivider} />

                <View style={styles.cardBottomRow}>
                  <Text style={styles.confidenceText}>Confidence: 85%</Text>

                  <TouchableOpacity style={styles.joinBtn}>
                    <Text style={styles.joinText}>🪙  Join Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* 11:00 am group */}
          <View style={styles.timeGroup}>
            <Text style={styles.timeLabel}>11:00 am</Text>

            <View style={styles.meetingCard}>
              <Image source={MAIL_IMG} style={styles.meetingIcon} />
              <View style={{ flex: 1 }}>
                <Text style={styles.meetingTitle}>Meeting with Vijay</Text>

                <View style={styles.meetingMetaRow}>
                  <View style={styles.metaItem}>
                    <EvilIcons name="sc-telegram" size={16} color="#2a6fb6" />
                    <Text style={styles.metaText}>Online</Text>
                  </View>

                  <View style={[styles.metaItem, { marginLeft: 12 }]}>
                    <Text style={styles.metaText}>⏳ { "10:00PM" }</Text>
                  </View>
                </View>

                <View style={styles.cardDivider} />

                <View style={styles.cardBottomRow}>
                  <Text style={styles.confidenceText}>Confidence: 85%</Text>

                  <TouchableOpacity style={styles.joinBtn}>
                    <Text style={styles.joinText}>🪙  Join Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* 4:00 pm group */}
          <View style={styles.timeGroup}>
            <Text style={styles.timeLabel}>4:00 pm</Text>

            <View style={styles.meetingCard}>
              <Image source={MAIL_IMG} style={styles.meetingIcon} />
              <View style={{ flex: 1 }}>
                <Text style={styles.meetingTitle}>Meeting with Vijay</Text>

                <View style={styles.meetingMetaRow}>
                  <View style={styles.metaItem}>
                    <EvilIcons name="sc-telegram" size={16} color="#2a6fb6" />
                    <Text style={styles.metaText}>Online</Text>
                  </View>

                  <View style={[styles.metaItem, { marginLeft: 12 }]}>
                    <Text style={styles.metaText}>⏳ { "10:00PM" }</Text>
                  </View>
                </View>

                <View style={styles.cardDivider} />

                <View style={styles.cardBottomRow}>
                  <Text style={styles.confidenceText}>Confidence: 85%</Text>

                  <TouchableOpacity style={styles.joinBtn}>
                    <Text style={styles.joinText}>🪙  Join Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#071a3a" },

  headerGradient: {
    paddingTop: 18,
    paddingBottom: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: { position: "absolute", left: 16, width: 36, height: 36, },
  headerTitle: { color: "#fff", fontWeight: "800", fontSize: 20 },

  container: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 14,
    paddingTop: 12,
  },

  dateCard: {
    marginTop: 12,
    marginHorizontal: 6,
    backgroundColor: "#0b3b7a",
    borderRadius: 12,
    padding: 12,
    // slightly lighter inner area
    overflow: "hidden",
  },
  monthRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  monthText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  monthDates: { flexDirection: "row", gap: 8 },

  datesRow: { marginTop: 10, flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 6 },
  dateBubble: {
    width: (W - 80) / 7,
    alignItems: "center",
    paddingVertical: 6,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  dateBubbleActive: {
    backgroundColor: "#fff",
    borderColor: "#dfefff",
  },
  dateDay: { color: "#dbe9ff", fontSize: 11 },
  dateDayActive: { color: "#0b3b7a" },
  dateNum: { color: "#dbe9ff", fontSize: 12, fontWeight: "700" },
  dateNumActive: { color: "#0b3b7a" },

  todoCard: {
    marginTop: 12,
    backgroundColor: "#f6fbff",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#eef3f8",
  },
  todoHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  todoIcon: { width: 28, height: 28, marginRight: 8 },
  todoTitle: { color: "#173651", fontWeight: "800", fontSize: 16 },

  chipsRow: { flexDirection: "row", marginTop: 6 },
  chip: {
    backgroundColor: "#e9f3ff",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#dfeefc",
  },
  chipText: { color: "#0b69b6", fontWeight: "700" },

  timeline: { marginTop: 14, paddingBottom: 60 },

  timeGroup: { marginBottom: 18 },
  timeLabel: { color: "#173651", fontWeight: "700", marginBottom: 8 },

  meetingCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "#e6edf6",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  meetingIcon: { width: 56, height: 56, borderRadius: 8, marginRight: 10 },

  meetingTitle: { fontWeight: "800", color: "#15314a", marginBottom: 6 },
  meetingMetaRow: { flexDirection: "row", alignItems: "center" },
  metaItem: { flexDirection: "row", alignItems: "center" },
  metaText: { color: "#7b8b97", marginLeft: 6 },

  cardDivider: { height: 1, backgroundColor: "#eef3f8", marginVertical: 8 },

  cardBottomRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  confidenceText: { color: "#7b8b97" },

  joinBtn: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#f0d87a",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  coinIcon: { width: 16, height: 16, marginRight: 8 },
  joinText: { color: "#0D47A1", fontWeight: "700" },
   monthSmall: {
    color: "#dbe9ff",
    fontSize: 12,
    marginRight: 8,
    fontWeight: "600",
  },

});
