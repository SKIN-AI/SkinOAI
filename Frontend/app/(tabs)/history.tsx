import { Calendar, Filter, TrendingUp } from "lucide-react-native";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HistoryScreen() {
  const scans = [
    {
      id: "1",
      date: "2024-01-15",
      time: "10:30 AM",
      condition: "Healthy Skin",
      confidence: 95,
      severity: "None",
      image:
        "https://images.pexels.com/photos/3845457/pexels-photo-3845457.jpeg?auto=compress&cs=tinysrgb&w=150",
    },
    {
      id: "2",
      date: "2024-01-12",
      time: "2:15 PM",
      condition: "Mild Eczema",
      confidence: 87,
      severity: "Mild",
      image:
        "https://images.pexels.com/photos/5938519/pexels-photo-5938519.jpeg?auto=compress&cs=tinysrgb&w=150",
    },
    {
      id: "3",
      date: "2024-01-10",
      time: "9:45 AM",
      condition: "Dry Skin",
      confidence: 92,
      severity: "Mild",
      image:
        "https://images.pexels.com/photos/4154552/pexels-photo-4154552.jpeg?auto=compress&cs=tinysrgb&w=150",
    },
    {
      id: "4",
      date: "2024-01-08",
      time: "4:20 PM",
      condition: "Normal Skin",
      confidence: 96,
      severity: "None",
      image:
        "https://images.pexels.com/photos/5938242/pexels-photo-5938242.jpeg?auto=compress&cs=tinysrgb&w=150",
    },
    {
      id: "5",
      date: "2024-01-05",
      time: "11:10 AM",
      condition: "Minor Irritation",
      confidence: 89,
      severity: "Mild",
      image:
        "https://images.pexels.com/photos/3845456/pexels-photo-3845456.jpeg?auto=compress&cs=tinysrgb&w=150",
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "None":
        return "#10b981";
      case "Mild":
        return "#f59e0b";
      case "Moderate":
        return "#ef4444";
      case "Severe":
        return "#dc2626";
      default:
        return "#6b7280";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Scan History</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Filter size={20} color="#6b7280" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Calendar size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Summary Stats */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <TrendingUp size={24} color="#3b82f6" />
          <View style={styles.summaryInfo}>
            <Text style={styles.summaryValue}>{scans.length}</Text>
            <Text style={styles.summaryLabel}>Total Scans</Text>
          </View>
        </View>
        <View style={styles.summaryCard}>
          <View
            style={[styles.healthIndicator, { backgroundColor: "#10b981" }]}
          />
          <View style={styles.summaryInfo}>
            <Text style={styles.summaryValue}>
              {scans.filter((s) => s.severity === "None").length}
            </Text>
            <Text style={styles.summaryLabel}>Healthy</Text>
          </View>
        </View>
      </View>

      {/* Scan List */}
      <ScrollView style={styles.scanList} showsVerticalScrollIndicator={false}>
        {scans.map((scan) => (
          <TouchableOpacity key={scan.id} style={styles.scanCard}>
            <Image source={{ uri: scan.image }} style={styles.scanImage} />

            <View style={styles.scanDetails}>
              <View style={styles.scanHeader}>
                <Text style={styles.scanCondition}>{scan.condition}</Text>
                <View style={styles.confidenceBadge}>
                  <Text style={styles.confidenceText}>{scan.confidence}%</Text>
                </View>
              </View>

              <View style={styles.scanMeta}>
                <Text style={styles.scanDate}>
                  {scan.date} • {scan.time}
                </Text>
                <View
                  style={[
                    styles.severityBadge,
                    { backgroundColor: getSeverityColor(scan.severity) + "20" },
                  ]}
                >
                  <View
                    style={[
                      styles.severityDot,
                      { backgroundColor: getSeverityColor(scan.severity) },
                    ]}
                  />
                  <Text
                    style={[
                      styles.severityText,
                      { color: getSeverityColor(scan.severity) },
                    ]}
                  >
                    {scan.severity}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
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
  title: {
    fontSize: 28,
    fontFamily: "Inter-Bold",
    color: "#1f2937",
  },
  headerActions: {
    flexDirection: "row",
  },
  actionButton: {
    width: 40,
    height: 40,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    elevation: 2,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  summaryContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  summaryCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  summaryInfo: {
    marginLeft: 12,
  },
  summaryValue: {
    fontSize: 20,
    fontFamily: "Inter-Bold",
    color: "#1f2937",
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    color: "#6b7280",
    marginTop: 2,
  },
  healthIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  scanList: {
    paddingHorizontal: 20,
  },
  scanCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  scanImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  scanDetails: {
    flex: 1,
  },
  scanHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  scanCondition: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: "#1f2937",
    flex: 1,
  },
  confidenceBadge: {
    backgroundColor: "#f0f9ff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e0f2fe",
  },
  confidenceText: {
    fontSize: 12,
    fontFamily: "Inter-Medium",
    color: "#0369a1",
  },
  scanMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  scanDate: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#6b7280",
  },
  severityBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  severityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  severityText: {
    fontSize: 12,
    fontFamily: "Inter-Medium",
  },
});
