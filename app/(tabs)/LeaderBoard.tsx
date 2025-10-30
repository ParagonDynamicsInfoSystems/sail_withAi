import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// --- DUMMY DATA ---
const dummyLeaderboardData = [
  { rank: 1, name: 'Maxwell', points: 7120, image: 'https://i.pravatar.cc/150?img=1', medalColor: '#F7D74E' }, 
  { rank: 2, name: 'Camelia', points: 6500, image: 'https://i.pravatar.cc/150?img=2', medalColor: '#E85B64' }, 
  { rank: 3, name: 'Wilson', points: 4800, image: 'https://i.pravatar.cc/150?img=3', medalColor: '#F2A32B' }, 
  { rank: 4, name: 'Jessica Anderson', points: 992, image: 'https://i.pravatar.cc/150?img=4' },
  { rank: 5, name: 'Sophia Anderson', points: 584, image: 'https://i.pravatar.cc/150?img=5' },
  { rank: 6, name: 'Ethan Carter', points: 448, image: 'https://i.pravatar.cc/150?img=6' },
  { rank: 7, name: 'Liam Johnson', points: 580, image: 'https://i.pravatar.cc/150?img=7' },
  { rank: 7, name: 'Oliver Smith', points: 580, image: 'https://i.pravatar.cc/150?img=8' },
];

// --- Reusable Component for List Items (Rank 4 onwards) ---
interface ListItemProps {
    rank: number;
    name: string;
    points: number;
    image: string;
}

const LeaderboardListItem: React.FC<ListItemProps> = ({ rank, name, points, image }) => {
  return (
    <View style={styles.listItemContainer}>
      <LinearGradient
        colors={['#F7D74E', '#F2A32B']}
        start={[0, 0]}
        end={[1, 0]}
        style={styles.rankGradient}
      >
        <Text style={styles.rankNumber}>{rank < 10 ? `0${rank}` : rank}</Text>
      </LinearGradient>

      <Image source={{ uri: image }} style={styles.listItemImage} />

      <View style={styles.listItemDetails}>
        <Text style={styles.listItemName}>{name}</Text>
        <Text style={styles.listItemPoints}>{points} points</Text>
      </View>

      <Text style={styles.listItemIndicator}>▲</Text>
    </View>
  );
};


// --- Component for Top 3 Podiums ---
interface PodiumProps {
    rank: number;
    name: string;
    points: number;
    image: string;
    medalColor: string;
}

const TopThreePodium: React.FC<PodiumProps> = ({ rank, name, points, image, medalColor }) => {
    let height: number, zIndex: number, marginTop: number, width: number;
    if (rank === 1) {
        height = 160;
        zIndex = 3;
        marginTop = 0;
        width = 120;
    } else if (rank === 2) {
        height = 130;
        zIndex = 2;
        marginTop = 30;
        width = 100;
    } else { // rank 3
        height = 120;
        zIndex = 1;
        marginTop = 40;
        width = 100;
    }

    return (
        <View style={{...styles.podiumItemContainer, zIndex, marginTop, width}}>
            <View style={styles.pointsBubble}>
                <Text style={{...styles.podiumPointsIcon, color: medalColor}}>●</Text>
                <Text style={styles.podiumPoints}>{points.toLocaleString()}</Text>
                {rank === 1 && <Text style={styles.podiumPointsIcon}>🏆</Text>}
            </View>

            <View style={{...styles.podiumCard, height, backgroundColor: medalColor}}>
                <Image source={{ uri: image }} style={styles.podiumImage} />
                
                <Text style={styles.podiumRank}>{rank}</Text>
                <Text style={styles.podiumName}>{name}</Text>
            </View>
        </View>
    );
};


// --- Main Leaderboard Component (LeaderBoard.tsx) ---
const LeaderBoard: React.FC = () => {
  const topThree = dummyLeaderboardData.filter(item => item.rank <= 3);
  const remainingRanks = dummyLeaderboardData.filter(item => item.rank > 3);

  const [activeTab, setActiveTab] = React.useState('Today');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>LeaderBoard</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Tab Selection Section (Sits on white background) */}
        <View style={styles.tabContainer}>
          {['Today', 'This week', 'All time'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Top 3 Podium Section (Sits on white background, which is why it has the curve at the top) */}
        <View style={styles.podiumSection}>
            {topThree.find(p => p.rank === 2) && <TopThreePodium {...topThree.find(p => p.rank === 2)!} />}
            {topThree.find(p => p.rank === 1) && <TopThreePodium {...topThree.find(p => p.rank === 1)!} />}
            {topThree.find(p => p.rank === 3) && <TopThreePodium {...topThree.find(p => p.rank === 3)!} />}
        </View>

        {/* Leaderboard List (Yellow block with rounded corners) */}
        <View style={styles.listSection}>
          {remainingRanks.map((item, index) => (
            <LeaderboardListItem key={index} {...item} rank={index + 4} /> 
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// --- STYLESHEET ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1E2B45', // Dark blue header background
  },
  header: {
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: '#1E2B45', // Ensure header background is solid blue
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    // UPDATED: Start the white background immediately below the header
    backgroundColor: '#fff', 
    // REMOVED: border radius here. This is now applied to the yellow list section
    paddingBottom: 40,
  },
  
  // --- Tabs Styles ---
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 30,
    padding: 5,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    marginTop: 20,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeTabButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    borderStyle: 'dotted',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tabText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderStyle: 'dotted',
  },

  // --- Podium Styles (Top 3) ---
  podiumSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 250,
    paddingHorizontal: 20,
    // ADDED: Negative margin to pull the podium section back up over the content curve
    marginTop: -30, 
    paddingTop: 30,
    // The visual separation between the dark blue and white now comes from the listSection below.
  },
  podiumItemContainer: {
    alignItems: 'center',
  },
  pointsBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  podiumPointsIcon: {
    fontSize: 10,
    marginHorizontal: 2,
  },
  podiumPoints: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  podiumCard: {
    borderRadius: 15,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
  },
  podiumImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#fff',
    position: 'absolute',
    top: -30,
  },
  podiumRank: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  podiumName: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 5,
    fontWeight: '600',
  },

  // --- List Item Styles (Rank 4 onwards) ---
  listSection: {
    backgroundColor: '#FFD700', 
    marginHorizontal: 15,
    // UPDATED: Critical fix! This negative margin makes the yellow block "touch" the bottom of the podium cards
    marginTop: -20, 
    // NEW: Applying the border radius here to create the rounded effect visible in the screenshot
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20,
    borderRadius: 20, // To keep the bottom rounded as well
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    paddingTop: 30,
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 5,
    backgroundColor: '#fff',
  },
  rankGradient: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  listItemImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  listItemDetails: {
    flex: 1,
  },
  listItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  listItemPoints: {
    fontSize: 12,
    color: '#888',
  },
  listItemIndicator: {
    fontSize: 18,
    color: '#F2A32B',
  },
});

export default LeaderBoard;