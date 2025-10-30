import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// Assuming this path is correct relative to where UpcomingEvents is used/defined
import { useAuthApi } from "../hooks/authApi";

type EventItem = {
  id: string;
  title: string; // Company Name
  mode: "Online" | "Offline";
  time: string; // Formatted Date/Time
  confidence: string;
};

// --- API RESPONSE INTERFACES ---
interface CalendarMeetings {
 [date: string]: string[]; // e.g., "2025-10-29": ["ASTRA POLYMERS", "SICA GLOBAL SERVICES LLC"]
}

interface PrePlanResponse {
  success: boolean;
  data: {
   calendar_meetings: CalendarMeetings;
  };
  error_message: string | null;
}
// -------------------------------

// Helper function to transform API data into the required FlatList format
const transformMeetings = (meetings: CalendarMeetings): EventItem[] => {
 const events: EventItem[] = [];
 
 // Get sorted list of dates
 const sortedDates = Object.keys(meetings).sort();

 sortedDates.forEach((dateString) => {
  // Format the date for display (e.g., "Oct 29")
  // Note: Using basic string manipulation since libraries like moment are not available here.
  const datePart = dateString.substring(5); // e.g., '10-29'
  
  const companyNames = meetings[dateString];
  companyNames.forEach((company, index) => {
   events.push({
    id: `${dateString}-${index}-${company}`, // Unique ID
    title: company,
    // Assign default/placeholder values based on data availability
    mode: (index % 2 === 0 ? "Online" : "Offline"), 
    time: `${datePart} @ 10:00AM`, // Placeholder Time
    confidence: "85%", // Placeholder Confidence
   });
  });
 });
 
 return events;
};


export default function UpcomingEvents() {
 const { get, isLoaded, isSignedIn } = useAuthApi();
 const [events, setEvents] = useState<EventItem[]>([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);

 useEffect(() => {
  // Only proceed if Clerk is loaded and the user is signed in.
  if (!isLoaded || !isSignedIn) {
   if (isLoaded) {
    setLoading(false);
    setError("Authentication required.");
   }
   return;
  }

  const fetchEvents = async () => {
   setLoading(true);
   setError(null);

   // Use fixed year/month (2025/10) as per request, but this should ideally be dynamic
   const year = 2025; 
   const month = 10; 
   
   const path = `calendar/pre-plan`;
   const params = { year: year.toString(), month: month.toString() };

   try {
    // Fetch data from the authenticated API hook
    const response = await get(path, params) as PrePlanResponse;

    if (response.success && response.data?.calendar_meetings) {
     const transformedEvents = transformMeetings(response.data.calendar_meetings);
     setEvents(transformedEvents);
     
     if (transformedEvents.length === 0) {
      setError("No upcoming events found for this month.");
     }

    } else {
      setError(response.error_message || "Failed to load events due to server error.");
      Alert.alert("Error", response.error_message || "Server Error fetching events.");
    }
   } catch (e: any) {
    console.error("Event Fetch Error:", e);
    setError(e.message || "Network error. Could not connect to API.");
   } finally {
    setLoading(false);
   }
  };

  fetchEvents();
 }, [get, isLoaded, isSignedIn]); // Re-run when auth state or 'get' function changes

 // --- Render Logic ---
 const renderContent = () => {
  if (loading) {
   return <Text style={styles.messageText}>Loading events...</Text>;
  }
  
  if (error) {
   return <Text style={[styles.messageText, styles.errorText]}>Error: {error}</Text>;
  }
  
  return (
    <FlatList
      data={events}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <EventCard event={item} />}
      scrollEnabled={false}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
    />
  );
 };


 return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Image
          source={require("../../assets/images/Open mail.png")} // dummy icon
          style={styles.headerIcon}
          resizeMode="contain"
        />
        <Text style={styles.cardTitle}>Upcoming events</Text>
      </View>

      {/* Event List or Loading/Error Message */}
      {renderContent()}
    </View>
 );
}

function EventCard({ event }: { event: EventItem }) {
  return (
    <View style={styles.eventCard}>
      <View style={styles.eventContent}>
        <Image
          source={require("../../assets/images/Letter.png")}
          style={styles.eventIcon}
          resizeMode="contain"
        />
        <View style={styles.eventDetails}>
          <Text style={styles.eventTitle}>{event.title}</Text>

          <View style={styles.metaRow}>
            <Text style={styles.metaItem}>⚙️ {event.mode}</Text>
            <Text style={styles.metaItem}>⏳ {event.time}</Text>
          </View>

          <View style={styles.divider} />

          {/* Confidence + Join Now in one row */}
        <View style={styles.bottomRow}>
          <Text style={styles.confidenceText}>
            Confidence: {event.confidence}
          </Text>

          <View style={{ flex: 1 }} />

          <TouchableOpacity style={styles.joinBtn} activeOpacity={0.85}>
            <Text style={styles.joinText}>🪙  Join Now</Text>
          </TouchableOpacity>
        </View>

        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f6fbff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  // Header
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  headerIcon: { width: 28, height: 28, marginRight: 10 },
  cardTitle: {
    // fontFamily: "Rubik", // Commented out non-standard font
    fontWeight: "700",
    fontSize: 18,
    color: "#15314a",
  },

  // Event card
  eventCard: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#e0ecff",
    borderRadius: 16,
    padding: 12,
  },

  eventContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  eventIcon: { width: 56, height: 56, marginRight: 12 },

  eventDetails: { flex: 1 },

  eventTitle: {
    // fontFamily: "Rubik", // Commented out non-standard font
    fontWeight: "700",
    fontSize: 16,
    color: "#1a2a44",
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 8,
  },
  metaItem: {
    // fontFamily: "Rubik", // Commented out non-standard font
    fontSize: 13,
    color: "#3d4a5d",
    marginRight: 12,
  },

  divider: {
    height: 1,
    backgroundColor: "#e6edf6",
    marginVertical: 6,
  },

  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  confidenceText: {
    // fontFamily: "Rubik", // Commented out non-standard font
    fontWeight: "500",
    color: "#0D47A1",
    fontSize: 13,
  },

  joinBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#f0d87a",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  coinIcon: { width: 16, height: 16, marginRight: 6 },
  joinText: {
    // fontFamily: "Rubik", // Commented out non-standard font
    fontWeight: "700",
    color: "#0D47A1",
    fontSize: 13,
  },

  // New styles for messages
  messageText: {
    textAlign: 'center',
    paddingVertical: 20,
    color: '#666',
    fontSize: 14,
  },
  errorText: {
    color: 'red',
    fontWeight: '600'
  }
});
