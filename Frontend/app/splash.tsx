import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Brain, Sparkles } from "lucide-react-native";
import { useEffect } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

export default function SplashScreen() {
  const router = useRouter();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const sparkleScale = useSharedValue(0);

  useEffect(() => {
    // Start animations
    opacity.value = withTiming(1, { duration: 800 });
    scale.value = withSpring(1, { damping: 8, stiffness: 100 });

    // Animate sparkles with delay
    setTimeout(() => {
      sparkleScale.value = withSpring(1, { damping: 6, stiffness: 120 });
    }, 400);

    // Navigate to tabs after animation
    const timer = setTimeout(() => {
      runOnJS(() => router.replace("/(tabs)"))();
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const sparkleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sparkleScale.value }],
  }));

  return (
    <LinearGradient
      colors={["#1e40af", "#3b82f6", "#06b6d4"]}
      style={styles.container}
    >
      <Animated.View style={[styles.content, animatedStyle]}>
        <View style={styles.logoContainer}>
          <View style={styles.iconWrapper}>
            <Brain size={48} color="#ffffff" strokeWidth={2.5} />
          </View>
          <Animated.View style={[styles.sparkleContainer, sparkleStyle]}>
            <Sparkles size={20} color="#fbbf24" />
          </Animated.View>
        </View>

        <Text style={styles.title}>Skin AI</Text>
        <Text style={styles.subtitle}>Powered by AI</Text>

        <View style={styles.tagline}>
          <Text style={styles.taglineText}>
            Advanced skin analysis at your fingertips
          </Text>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 32,
  },
  logoContainer: {
    position: "relative",
    marginBottom: 32,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  sparkleContainer: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "rgba(251, 191, 36, 0.2)",
    borderRadius: 12,
    padding: 4,
  },
  title: {
    fontSize: 32,
    fontFamily: "Inter-Bold",
    color: "#ffffff",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Inter-Medium",
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 24,
    textAlign: "center",
  },
  tagline: {
    paddingHorizontal: 16,
  },
  taglineText: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    lineHeight: 20,
  },
});
