import {
  Bell,
  ChevronRight,
  Database,
  CircleHelp as HelpCircle,
  Info,
  Mail,
  Moon,
  Shield,
  Smartphone,
  Sun,
} from "lucide-react-native";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);

  const settingSections = [
    {
      title: "Preferences",
      items: [
        {
          icon: darkMode ? Moon : Sun,
          title: "Dark Mode",
          subtitle: "Toggle dark theme",
          type: "switch",
          value: darkMode,
          onToggle: setDarkMode,
        },
        {
          icon: Bell,
          title: "Notifications",
          subtitle: "Scan reminders and updates",
          type: "switch",
          value: notifications,
          onToggle: setNotifications,
        },
        {
          icon: Database,
          title: "Data Sharing",
          subtitle: "Help improve AI accuracy",
          type: "switch",
          value: dataSharing,
          onToggle: setDataSharing,
        },
      ],
    },
    {
      title: "About",
      items: [
        {
          icon: Info,
          title: "About Skin AI",
          subtitle: "App version and info",
          type: "navigation",
          onPress: () => showAboutAlert(),
        },
        {
          icon: Shield,
          title: "Privacy Policy",
          subtitle: "How we protect your data",
          type: "navigation",
          onPress: () => showPrivacyAlert(),
        },
        {
          icon: HelpCircle,
          title: "Help & Support",
          subtitle: "FAQs and contact info",
          type: "navigation",
          onPress: () => showHelpAlert(),
        },
        {
          icon: Mail,
          title: "Contact Us",
          subtitle: "Get in touch with our team",
          type: "navigation",
          onPress: () => showContactAlert(),
        },
      ],
    },
  ];

  const showAboutAlert = () => {
    Alert.alert(
      "About Skin AI",
      "Version 1.0.0\n\nSkin AI is an advanced skin analysis application powered by artificial intelligence. Our mission is to make dermatological screening accessible to everyone.\n\n© 2024 Skin AI",
      [{ text: "OK" }]
    );
  };

  const showPrivacyAlert = () => {
    Alert.alert(
      "Privacy Policy",
      "Your privacy is important to us. We use industry-standard encryption to protect your data. Scan images are processed securely and can be deleted at any time. We never share personal information without consent.",
      [{ text: "OK" }]
    );
  };

  const showHelpAlert = () => {
    Alert.alert(
      "Help & Support",
      "Frequently Asked Questions:\n\n• How accurate is the AI? Our AI has 94% accuracy in clinical tests.\n\n• Is my data secure? Yes, all data is encrypted and stored securely.\n\n• Can I delete my scans? Yes, you can delete scans anytime in the History tab.",
      [{ text: "OK" }]
    );
  };

  const showContactAlert = () => {
    Alert.alert(
      "Contact Us",
      "Need help? We're here for you!\n\nEmail: support@skinai.app\nPhone: +1 (555) 123-4567\n\nBusiness Hours:\nMon-Fri: 9AM - 6PM EST\nWeekends: 10AM - 4PM EST",
      [{ text: "OK" }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <View style={styles.versionBadge}>
          <Smartphone size={16} color="#3b82f6" />
          <Text style={styles.versionText}>v1.0.0</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {settingSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>

            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={styles.settingItem}
                onPress={item.onPress}
                disabled={item.type === "switch"}
              >
                <View style={styles.settingIcon}>
                  <item.icon size={20} color="#3b82f6" strokeWidth={2} />
                </View>

                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>{item.title}</Text>
                  <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                </View>

                {item.type === "switch" ? (
                  <Switch
                    value={item.value}
                    onValueChange={item.onToggle}
                    trackColor={{ false: "#f3f4f6", true: "#3b82f6" }}
                    thumbColor={item.value ? "#ffffff" : "#9ca3af"}
                  />
                ) : (
                  <ChevronRight size={20} color="#9ca3af" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoTitle}>Skin AI</Text>
          <Text style={styles.appInfoSubtitle}>
            Advanced skin analysis powered by artificial intelligence
          </Text>
          <Text style={styles.disclaimer}>
            This app is not a substitute for professional medical advice. Always
            consult with a healthcare provider for medical concerns.
          </Text>
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
  title: {
    fontSize: 28,
    fontFamily: "Inter-Bold",
    color: "#1f2937",
  },
  versionBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f9ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e0f2fe",
  },
  versionText: {
    fontSize: 12,
    fontFamily: "Inter-Medium",
    color: "#0369a1",
    marginLeft: 4,
  },
  content: {
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: "#6b7280",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  settingItem: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    elevation: 2,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  settingIcon: {
    width: 40,
    height: 40,
    backgroundColor: "#f0f9ff",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: "#1f2937",
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#6b7280",
  },
  appInfo: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  appInfoTitle: {
    fontSize: 20,
    fontFamily: "Inter-Bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  appInfoSubtitle: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 16,
  },
  disclaimer: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    color: "#9ca3af",
    textAlign: "center",
    lineHeight: 16,
    fontStyle: "italic",
  },
});
