import { getClerkInstance, useAuth } from "@clerk/clerk-expo";
import { EvilIcons, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

// --- Assuming these imports exist in your project structure ---
import logo from "../../assets/images/logo.png";
import DailyTasks from "../component/DailyTasks";
import MetricsRow from "../component/MetricsRow";
import StatisticsCard from "../component/StatisticsCard";
import StreakCircle from "../component/StreakCircle";
import SuggestionsCard from "../component/SuggestionsCard";
import UpcomingEvents from "../component/UpcomingEvents";
import WeekPills from "../component/WeekPills";
import { useAuthApi } from "../hooks/authApi"; // Corrected relative path for better clarity
// -------------------------------------------------------------

// Define a key for AsyncStorage
const USER_NAME_STORAGE_KEY = "authUserName";

// Define the expected structure of the API response data for type safety
interface OnboardedResponse {
 data: {
  is_onboarded: boolean;
  user_data: {
   user_name: string;
   sales_person_id: string;
   email: string;
  };
 };
 success: boolean;
 session_id: string;
 execution_time: number;
 error_message: string | null;
}

export default function Home() {
 const { signOut } = useAuth();
 const router = useRouter();
 // Initialize the authenticated API hook and get 'isLoaded' state
 const { get, isLoaded } = useAuthApi();

 // State to store and display the user's name, defaulted to 'Loading...'
 const [userName, setUserName] = useState<string>("Loading...");

 // --- LOGOUT HANDLER ---
 const handleSignOut = async () => {
  // 1. Clear local storage for the cached user name
  
  // 2. Sign out the user's Clerk session (handles SecureStore cleanup)
  try {

            const clerk = getClerkInstance();

       let token1 = await clerk?.session?.getToken();

       console.log("✅ User logged out successfully!",token1);
         await signOut();
         await AsyncStorage.clear(); 

        router.replace('/(auth)');

        clerk?.session?.remove();

                let token = await clerk?.session?.getToken();


              console.log("✅ User logged out successfully!",token);



  } catch (e) {
   console.error("Error during Clerk sign out:", e);
  }
  
  // 3. Navigate to the login route (replaces the current history)
 };
 // ----------------------

 // --- API CALL AND STORAGE LOGIC ---
 useEffect(() => {
  // 🎯 FIX: Only proceed if Clerk is fully loaded. 
  // This ensures 'get' has a chance to retrieve a valid token.
  if (!isLoaded) {
   setUserName("Loading...");
   return;
  }

  const fetchUserData = async () => {
   let storedName: string | null = null;

   // 1. Try to load name from storage first for quick display
   try {
    storedName = await AsyncStorage.getItem(USER_NAME_STORAGE_KEY);
    if (storedName) {
     setUserName(storedName);
    } else {
     setUserName("User"); // Set a placeholder if nothing is stored
    }
   } catch (e) {
    console.error("Failed to read user name from storage:", e);
    setUserName("User");
   }

   try {
    // 2. Call the API to get the latest data.
    const data = await get("preferences/is-onboarded") as OnboardedResponse;

    if (data?.success && data.data?.user_data?.user_name) {
     const fetchedName = data.data.user_data.user_name;
     
     // 3. Update state and local storage if a valid name is fetched
     if (fetchedName) {
      setUserName(fetchedName);
      // Save to local storage for persistence
      await AsyncStorage.setItem(USER_NAME_STORAGE_KEY, fetchedName);
     }
    } else if (!storedName) {
     // Only show an alert if API failed AND no name was loaded from storage
     Alert.alert("API Error", data.error_message || "Could not retrieve user name.");
     setUserName("Error Loading");
    }
   } catch (error: any) {
    console.error("Failed to fetch user data:", error);
    
    // Handle the specific case where Clerk may have failed to load the token 
    if (error.message && error.message.includes("Clerk Auth not loaded")) {
     // This shouldn't happen with the 'if (!isLoaded)' check above, but is a safe fallback
     setUserName("Auth Init Error");
     return;
    }
    
    // Only show a general error if no stored name is available
    if (!storedName) {
      Alert.alert("Error", "Failed to connect to the server or load user data. Check network.");
      setUserName("Error Loading");
    }
   }
  };

  fetchUserData();

  //     const requestUserPermission = async () => {
  //     PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  //    const authStatus = await messaging().requestPermission();
  //    const enabled =
  //      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  //    if (enabled) {
  //      console.log('Authorization status:', authStatus);
  //      const token = await messaging().getToken();
  //      console.log('FCM token:', token);
  //    }
  //  };

  //  requestUserPermission();






 }, [get, isLoaded]); // 🎯 FIX: Add isLoaded to dependency array
 // ----------------------------------
 
 return (
  <ScrollView 
   style={styles.page} 
   contentContainerStyle={{ paddingBottom: 50 }}
   showsVerticalScrollIndicator={false}
  >
   {/* TOP BLUE WELCOME CARD */}
   <LinearGradient
    colors={["#0B3B7A", "#1669B9"]} // deep to lighter blue
    start={{ x: 1, y: 1 }}
    end={{ x: 0, y: 0 }}
    style={styles.topCard}
   >
    <View style={styles.topHeader}>
     <Image source={logo} style={styles.logo} />
     <View style={{ marginLeft: 12, flex: 1 }}>
      <Text style={styles.welcome}>WELCOME BACK!!</Text>
      {/* Display the fetched/stored user name */}
      <Text style={styles.username}>{userName}</Text>
     </View>
     {/* LOGOUT BUTTON */}
     <TouchableOpacity
      style={styles.logoutButton}
      onPress={handleSignOut}
     >
      <Ionicons name="log-out-outline" size={28} color="#F5F7FA" />
     </TouchableOpacity>
    </View>
    <View style={styles.metaRow}>
     <View style={styles.metaItem}>
      <EvilIcons name="calendar" size={33} color="#dbe9ff" />
      <Text style={styles.metaText}>April 21, Friday</Text>
     </View>

     <View style={styles.metaItem}>
      <EvilIcons name="location" size={33} color="#dbe9ff" />
      <Text style={styles.metaText}>Perungudi, Chennai</Text>
     </View>
    </View>

    <View style={styles.topBody}>
     <View style={styles.streakRow}>
      {/* Left: Streak circle - Assuming it takes 'value' prop */}
      <View style={styles.streakCircleWrap}>
       <StreakCircle value={7} size={84} />
      </View>

      {/* Right: message + week pills stacked */}
      <View style={styles.streakRight}>
       <View style={styles.streakTextWrap}>
        <Text style={styles.streakText}>
         You have interacted with customers for 7 days !!
        </Text>
       </View>

       {/* Week Pills - Assuming it takes no props or uses internal state */}
       <WeekPills />

      </View>
     </View>
    </View>

   </LinearGradient>

   {/* METRICS ROW (scrollable horizontally) */}
   <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.metricsScroll} contentContainerStyle={{ paddingHorizontal: 18 }}>
    <MetricsRow />
   </ScrollView>

   {/* MAIN CONTENT CARDS */}
   <View style={styles.content}>
    {/* STATISTICS CARD */}
    <StatisticsCard />
    {/* SUGGESTIONS CARD */}
    <SuggestionsCard />

    {/* UPCOMING EVENTS */}
    <UpcomingEvents />

    {/* DAILY TASKS */}
    <DailyTasks />

   </View>
  </ScrollView>
 );
}

const styles = StyleSheet.create({
 page: { flex: 1, backgroundColor: "#f4f7fb" },

 /* Top blue card */
 topCard: {
  backgroundColor: "#0b3b7a",
  paddingTop: 20,
  paddingBottom: 40,
  paddingHorizontal: 16,
  borderBottomLeftRadius: 20,
  borderBottomRightRadius: 20,
 },
 topHeader: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: 'space-between'
 },
 logo: { width: 50, aspectRatio: 1, resizeMode: "contain", borderRadius: 8 },
 welcome: { color: "#F5F7FA", fontWeight: "bold", fontSize: 20, paddingTop: 10, /* fontFamily: "SF Pro Display" */ },
 username: { color: "#F5F7FA", fontWeight: "bold", fontSize: 20, /* fontFamily: "SF Pro Display" */ },
 metaRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: 8,
 },

 metaItem: {
  flexDirection: "row",
  alignItems: "center",
  flexShrink: 1,
 },

 metaText: {
  color: "#dbe9ff",
  fontSize: 14,
  marginLeft: 6,
  flexShrink: 1,
 },

 topBody: { marginTop: 12 },

 /* Metrics */
 metricsScroll: { marginTop: -26, paddingVertical: 8 },

 /* content container */
 content: { paddingHorizontal: 18, paddingTop: 18 },

 logoutButton: {
  padding: 8,
 },
 
 streakRow: {
  flexDirection: "row",
  alignItems: "flex-start",
  columnGap: 12,
 },

 streakCircleWrap: {
  width: 84,
  height: 84,
  alignItems: "center",
  justifyContent: "center",
  marginRight: 12,
 },

 streakRight: {
  flex: 1,
  flexDirection: "column",
  justifyContent: "center",
 },

 streakText: {
  color: "#F5F7FA",
  fontSize: 14,
  lineHeight: 20,
  fontWeight: "700"
 },

 streakTextWrap: {
  marginBottom: 8,
  paddingRight: 8,
 },
});