import React, { useState, useEffect, useMemo } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert // Added Alert for error handling
} from "react-native";
import { StackedBarChart } from "react-native-chart-kit";

// Assuming useAuthApi is available relative to this component
import { useAuthApi } from "../hooks/authApi"; 

import trophy from "../../assets/images/Cup silver.png"; 

const screenWidth = Dimensions.get("window").width;
// Adjusted CHART_WIDTH calculation to account for the card's horizontal padding (14px * 2) and the content padding (18px * 2) from Home.tsx
const CHART_WIDTH = screenWidth - 28 - 28; // ScreenWidth - (14*2) Card Padding - (14*2) Inner Chart Spacing (approx)

// --- Data Structure Definitions ---

interface MeetingBreakdown {
  "Direct Meetings": number;
  "Phone Calls": number;
  "Business Meetings": number;
}

interface MeetingsData {
  [key: string]: MeetingBreakdown; // keys are '0'-'11' for monthly, '1'-'4' for quarterly
}

interface MeetingsApiResponse {
  data: {
    monthly: MeetingsData;
    quarterly: MeetingsData;
    yearly: MeetingBreakdown; 
  };
  success: boolean;
  error_message: string | null;
}

// UPDATED: Added the required 'legend' property
interface TransformedChartData {
  labels: string[];
  data: number[][];
  barColors: string[];
  legend: string[]; 
}

// Map for chart data series and colors
const CHART_SERIES_MAP = {
  "Direct Meetings": "#6A1B9A", // Purple
  "Phone Calls": "#00ACC1",    // Cyan
  "Business Meetings": "#FFD54F", // Yellow
};

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];
const QUARTER_NAMES = ["Q1", "Q2", "Q3", "Q4"];


// --- Data Transformation Logic ---

const transformDataForChart = (
  data: MeetingsData,
  period: 'monthly' | 'quarterly'
): TransformedChartData => {
  const labels: string[] = [];
  const chartData: number[][] = [];
  const seriesKeys = Object.keys(CHART_SERIES_MAP) as (keyof MeetingBreakdown)[];

  // The legend is simply the set of series keys
  const legend = seriesKeys; 

  // Sort keys numerically to ensure chronological order
  const sortedKeys = Object.keys(data).sort((a, b) => parseInt(a) - parseInt(b));
  
  // We iterate over all keys, even if the count is zero, to ensure all time periods are represented
  const finalKeys = sortedKeys;

  finalKeys.forEach(key => {
      const item = data[key];
      const index = parseInt(key);

      // 1. Determine Label
      let label: string;
      if (period === 'monthly') {
          // Added robust check: use month name or the index as a string fallback
          label = MONTH_NAMES[index % 12] || String(index); 
      } else {
          // Quarter keys are 1-4, so subtract 1 for the 0-based index. Use Q[index] as fallback.
          label = QUARTER_NAMES[index - 1] || `Q${index}`; 
      }
      labels.push(label);


      // 2. Determine Data stack (must match the fixed seriesKeys order)
      const stack: number[] = [];
      seriesKeys.forEach(series => {
          // Ensure item is defined before accessing properties, default to 0
          stack.push(item ? item[series] : 0);
      });
      chartData.push(stack);
  });

  return {
      labels: labels,
      data: chartData,
      barColors: Object.values(CHART_SERIES_MAP),
      legend: legend, // ADDED: Return the legend array
  };
};


export default function StatisticsCard() {
  const { get } = useAuthApi(); 

  // State for API data and selected time period (defaulting to quarterly)
  const [apiData, setApiData] = useState<MeetingsApiResponse['data'] | null>(null);
  const [timePeriod, setTimePeriod] = useState<'monthly' | 'quarterly'>('quarterly');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data on mount
  useEffect(() => {
    const fetchMeetingsData = async () => {
      try {
        const response = await get("crm_data/meetings_split/") as MeetingsApiResponse;
        if (response.success && response.data) {
          setApiData(response.data);
        } else {
          console.error("API error:", response.error_message);
          Alert.alert("Error", response.error_message || "Failed to load meetings data.");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        Alert.alert("Error", "Could not connect to the server to load statistics.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeetingsData();
  }, [get]);


  // Use useMemo to re-calculate chart data only when API data or time period changes
  const chartData = useMemo(() => {
    if (!apiData) {
      // UPDATED: Included 'legend' in the fallback data structure
      return { labels: ["-"], data: [[0, 0, 0]], barColors: Object.values(CHART_SERIES_MAP), legend: Object.keys(CHART_SERIES_MAP) };
    }
    
    const rawData = timePeriod === 'monthly' ? apiData.monthly : apiData.quarterly;
    // Use the safe transformation logic
    return transformDataForChart(rawData, timePeriod);

  }, [apiData, timePeriod]);
  

  const chartConfig = {
    backgroundGradientFrom: "#fbfdff",
    backgroundGradientTo: "#fbfdff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0,0,0,${opacity * 0.6})`,
    labelColor: (opacity = 1) => `rgba(80,80,90,${opacity})`,
    barPercentage: 0.4,
    style: { borderRadius: 8 },
    propsForLabels: { fontSize: 12 },
    propsForVerticalLabels: { fontSize: 11, fontWeight: 'bold' } // smaller font for labels
  };
  
  // Check if the chart data has meaningful content to display
  const hasChartData = chartData.data.some(stack => stack.some(value => value > 0));


  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <Image source={trophy} style={styles.icon} resizeMode="contain" />
          <Text style={styles.cardTitle}>Meetings Statistics</Text>
        </View>
        
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {['quarterly', 'monthly'].map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                timePeriod === period && styles.periodButtonActive,
              ]}
              onPress={() => setTimePeriod(period as 'monthly' | 'quarterly')}
            >
              <Text style={[
                styles.periodText,
                timePeriod === period && styles.periodTextActive,
              ]}>
                {period === 'monthly' ? 'Monthly' : 'Quarterly'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Chart/Loading State */}
      <View style={styles.chartWrap}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1669B9" />
            <Text style={styles.loadingText}>Loading Meetings Data...</Text>
          </View>
        ) : !hasChartData && !isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.noDataText}>No meetings data available for the selected period.</Text>
          </View>
        ) : (
          <StackedBarChart
            data={chartData}
            width={CHART_WIDTH}
            height={200}
            chartConfig={chartConfig}
            hideLegend={true}
            withHorizontalLabels={true}
            style={{ borderRadius: 8 }}
          />
        )}
      </View>

      {/* Legend */}
      <View style={styles.legendRow}>
        {Object.entries(CHART_SERIES_MAP).map(([label, color]) => (
          <View key={label} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: color }]} />
            <Text style={styles.legendText}>{label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: { width: 28, height: 28, marginRight: 8 },
  cardTitle: { fontWeight: "800", fontSize: 16, color: "#15314a" },
  cardSmall: { color: "#9aa0b0" },
  chartWrap: {
    marginTop: 12,
    backgroundColor: "#fbfdff",
    borderRadius: 8,
    paddingVertical: 4,
    minHeight: 200, // Added minHeight for visual stability during loading/empty state
  },
  legendRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: 'wrap', // Added flexWrap for better layout on small screens
    marginTop: 12,
    paddingHorizontal: 4
  },
  legendItem: { 
    flexDirection: "row", 
    alignItems: "center",
    marginBottom: 4, // Space out items if they wrap
  },
  legendDot: {
    width: 14,
    height: 14,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: { color: "#7b8b97", fontSize: 13 },
  
  // --- New Styles for Period Selector and Loading ---
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#eef3f8',
    borderRadius: 20,
    padding: 3,
  },
  periodButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 18,
  },
  periodButtonActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  periodText: {
    color: '#7b8b97',
    fontSize: 13,
    fontWeight: '600',
  },
  periodTextActive: {
    color: '#15314a',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
    borderRadius: 8,
    backgroundColor: "#fbfdff",
  },
  loadingText: {
    marginTop: 10,
    color: '#7b8b97',
    fontSize: 14,
  },
  noDataText: {
    textAlign: 'center',
    color: '#7b8b97',
    fontSize: 14,
    padding: 20,
  },
});
