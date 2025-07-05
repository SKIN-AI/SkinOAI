import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  Award,
  Camera,
  Clock,
  Scan,
  Shield,
  TrendingUp,
} from "lucide-react-native";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();

  const recentScans = [
    {
      id: "1",
      date: "2024-01-15",
      condition: "Healthy Skin",
      confidence: 95,
      image:
        "https://images.pexels.com/photos/3845457/pexels-photo-3845457.jpeg?auto=compress&cs=tinysrgb&w=150",
    },
    {
      id: "2",
      date: "2024-01-12",
      condition: "Mild Eczema",
      confidence: 87,
      image:
        "https://images.pexels.com/photos/5938519/pexels-photo-5938519.jpeg?auto=compress&cs=tinysrgb&w=150",
    },
    {
      id: "3",
      date: "2024-01-10",
      condition: "Dry Skin",
      confidence: 92,
      image:
        "https://images.pexels.com/photos/4154552/pexels-photo-4154552.jpeg?auto=compress&cs=tinysrgb&w=150",
    },
  ];

  const stats = [
    { icon: Scan, label: "Total Scans", value: "12", color: "#3b82f6" },
    { icon: TrendingUp, label: "Accuracy", value: "94%", color: "#10b981" },
    { icon: Shield, label: "Reliability", value: "99%", color: "#8b5cf6" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello there!</Text>
            <Text style={styles.subtitle}>How can I help you today?</Text>
          </View>
          <View style={styles.profileIcon}>
            <Award size={24} color="#3b82f6" />
          </View>
        </View>

        {/* Main Scan Button */}
        <TouchableOpacity
          style={styles.scanButtonContainer}
          onPress={() => router.push("/scan")}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={["#3b82f6", "#1d4ed8"]}
            style={styles.scanButton}
          >
            <View style={styles.scanIconContainer}>
              <Camera size={32} color="#ffffff" strokeWidth={2.5} />
            </View>
            <View style={styles.scanContent}>
              <Text style={styles.scanTitle}>Scan Your Skin</Text>
              <Text style={styles.scanSubtitle}>
                Get instant AI-powered analysis
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Your Progress</Text>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <View
                  style={[
                    styles.statIcon,
                    { backgroundColor: `${stat.color}15` },
                  ]}
                >
                  <stat.icon size={20} color={stat.color} strokeWidth={2} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Scans */}
        <View style={styles.recentScans}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Scans</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/history")}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {recentScans.map((scan) => (
            <TouchableOpacity key={scan.id} style={styles.scanItem}>
              <Image source={{ uri: scan.image }} style={styles.scanImage} />
              <View style={styles.scanInfo}>
                <Text style={styles.scanCondition}>{scan.condition}</Text>
                <Text style={styles.scanDate}>{scan.date}</Text>
              </View>
              <View style={styles.confidenceContainer}>
                <Text style={styles.confidenceText}>{scan.confidence}%</Text>
                <Clock size={16} color="#6b7280" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  greeting: {
    fontSize: 28,
    fontFamily: "Inter-Bold",
    color: "#1f2937",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    color: "#6b7280",
    marginTop: 4,
  },
  profileIcon: {
    width: 48,
    height: 48,
    backgroundColor: "#f0f9ff",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0f2fe",
  },
  scanButtonContainer: {
    marginHorizontal: 20,
    marginBottom: 32,
  },
  scanButton: {
    borderRadius: 16,
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  scanIconContainer: {
    width: 64,
    height: 64,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  scanContent: {
    flex: 1,
  },
  scanTitle: {
    fontSize: 20,
    fontFamily: "Inter-Bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  scanSubtitle: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "rgba(255, 255, 255, 0.8)",
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Inter-SemiBold",
    color: "#1f2937",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontFamily: "Inter-Bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    color: "#6b7280",
    textAlign: "center",
  },
  recentScans: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
    color: "#3b82f6",
  },
  scanItem: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  scanImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  scanInfo: {
    flex: 1,
  },
  scanCondition: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: "#1f2937",
    marginBottom: 4,
  },
  scanDate: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#6b7280",
  },
  confidenceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  confidenceText: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
    color: "#10b981",
    marginRight: 4,
  },
});
