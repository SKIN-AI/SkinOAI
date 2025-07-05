import React, { useState, useEffect, useRef } from "react";
import { Camera, CameraType, CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  Camera as CameraIcon,
  CircleCheck as CheckCircle,
  FlipHorizontal,
  Info,
  Upload,
  X,
  Zap,
} from "lucide-react-native";
import {
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export default function ScanScreen() {
  const router = useRouter();
  const cameraRef = useRef<any>(null);
  const [facing, setFacing] = useState<CameraType>("back");

  // Use the hook to manage camera permissions
  const [permission, requestPermission] = useCameraPermissions();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysisStep, setAnalysisStep] = useState<
    "preparing" | "analyzing" | "finalizing"
  >("preparing");

  if (!permission) {
    // Permissions are still loading
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <View style={styles.permissionIcon}>
            <CameraIcon size={48} color="#3b82f6" />
          </View>
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionSubtitle}>
            We need access to your camera to analyze your skin condition
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const handleCapture = async () => {
    if (!cameraRef.current) return;
    setIsAnalyzing(true);
    setAnalysisStep("preparing");
    try {
      // Take picture with base64
      const photo = await cameraRef.current.takePictureAsync({ base64: true });
      const base64String = photo.base64;
      setIsAnalyzing(false);
      router.push({
        pathname: "/result",
        params: {
          image: base64String,
          text: "", // Optionally add user text input here
        },
      });
    } catch (error) {
      setIsAnalyzing(false);
      Alert.alert("Capture Error", "Failed to capture image. Please try again.");
    }
  };

  const handleUploadPhoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "We need access to your photo library to upload images for analysis.",
          [{ text: "OK" }]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets[0]) {
        const base64String = result.assets[0].base64;
        setIsAnalyzing(false);
        router.push({
          pathname: "/result",
          params: {
            image: base64String,
            text: "", // Optionally add user text input here
          },
        });
      }
    } catch (error) {
      setIsAnalyzing(false);
      console.error("Error picking image:", error);
      Alert.alert(
        "Upload Error",
        "There was an error selecting your image. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  const getAnalysisStepText = () => {
    switch (analysisStep) {
      case "preparing":
        return "Preparing image for analysis...";
      case "analyzing":
        return "AI analyzing skin patterns...";
      case "finalizing":
        return "Generating detailed report...";
      default:
        return "Processing...";
    }
  };

  const getAnalysisProgress = () => {
    switch (analysisStep) {
      case "preparing":
        return "25%";
      case "analyzing":
        return "70%";
      case "finalizing":
        return "95%";
      default:
        return "0%";
    }
  };

  if (isAnalyzing) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={["#1e40af", "#3b82f6"]}
          style={styles.analyzingContainer}
        >
          <View style={styles.analyzingContent}>
            {selectedImage && (
              <View style={styles.analyzingImageContainer}>
                <Image
                  source={{ uri: selectedImage }}
                  style={styles.analyzingImage}
                />
                <View style={styles.analyzingOverlay}>
                  <CheckCircle size={32} color="#10b981" />
                </View>
              </View>
            )}

            <View style={styles.analyzeIcon}>
              <Zap size={48} color="#ffffff" />
            </View>
            <Text style={styles.analyzingTitle}>Analyzing Your Skin</Text>
            <Text style={styles.analyzingSubtitle}>{getAnalysisStepText()}</Text>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: getAnalysisProgress() },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {getAnalysisProgress()} Complete
              </Text>
            </View>

            <View style={styles.analysisSteps}>
              <View
                style={[
                  styles.stepIndicator,
                  analysisStep === "preparing" && styles.activeStep,
                ]}
              >
                <Text style={styles.stepText}>Preparing</Text>
              </View>
              <View
                style={[
                  styles.stepIndicator,
                  analysisStep === "analyzing" && styles.activeStep,
                ]}
              >
                <Text style={styles.stepText}>Analyzing</Text>
              </View>
              <View
                style={[
                  styles.stepIndicator,
                  analysisStep === "finalizing" && styles.activeStep,
                ]}
              >
                <Text style={styles.stepText}>Finalizing</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <X size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan Your Skin</Text>
        <TouchableOpacity onPress={toggleCameraFacing} style={styles.flipButton}>
          <FlipHorizontal size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Camera View */}
      <View style={styles.cameraContainer}>
        <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
          {/* Camera Overlay */}
          <View style={styles.overlay}>
            <View style={styles.scanFrame} />
            <Text style={styles.overlayText}>
              Position the affected area within the frame
            </Text>
          </View>
        </CameraView>
      </View>

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <View style={styles.instructionItem}>
          <Info size={16} color="#3b82f6" />
          <Text style={styles.instructionText}>Ensure good lighting and clear focus</Text>
        </View>
        <View style={styles.instructionItem}>
          <Info size={16} color="#3b82f6" />
          <Text style={styles.instructionText}>Keep the camera steady for best results</Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.uploadButton} onPress={handleUploadPhoto}>
          <View style={styles.uploadIconContainer}>
            <Upload size={20} color="#3b82f6" />
          </View>
          <Text style={styles.uploadText}>Upload Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
          <View style={styles.captureInner}>
            <CameraIcon size={32} color="#ffffff" />
          </View>
        </TouchableOpacity>

        <View style={styles.placeholder} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // styles remain the same as your original code
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Inter-SemiBold",
    color: "#ffffff",
  },
  flipButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  cameraContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 16,
    overflow: "hidden",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: "#3b82f6",
    borderRadius: 16,
    backgroundColor: "transparent",
    borderStyle: "dashed",
  },
  overlayText: {
    fontSize: 16,
    fontFamily: "Inter-Medium",
    color: "#ffffff",
    textAlign: "center",
    marginTop: 20,
    paddingHorizontal: 40,
  },
  instructionsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  instructionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#ffffff",
    marginLeft: 8,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 30,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  uploadButton: {
    alignItems: "center",
    width: 80,
  },
  uploadIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: "rgba(59, 130, 246, 0.2)",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.3)",
  },
  uploadText: {
    fontSize: 12,
    fontFamily: "Inter-Medium",
    color: "#3b82f6",
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  captureInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#1d4ed8",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholder: {
    width: 80,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    backgroundColor: "#f8fafc",
  },
  permissionIcon: {
    width: 80,
    height: 80,
    backgroundColor: "#f0f9ff",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#e0f2fe",
  },
  permissionTitle: {
    fontSize: 24,
    fontFamily: "Inter-Bold",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 12,
  },
  permissionSubtitle: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  permissionButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  permissionButtonText: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: "#ffffff",
  },
  analyzingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  analyzingContent: {
    alignItems: "center",
    paddingHorizontal: 40,
  },
  analyzingImageContainer: {
    position: "relative",
    marginBottom: 24,
  },
  analyzingImage: {
    width: 120,
    height: 120,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  analyzingOverlay: {
    position: "absolute",
    top: -8,
    right: -8,
    width: 40,
    height: 40,
    backgroundColor: "rgba(16, 185, 129, 0.9)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  analyzeIcon: {
    width: 96,
    height: 96,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  analyzingTitle: {
    fontSize: 28,
    fontFamily: "Inter-Bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 12,
  },
  analyzingSubtitle: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
  },
  progressContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 32,
  },
  progressBar: {
    width: "100%",
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 12,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#10b981",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
    color: "rgba(255, 255, 255, 0.8)",
  },
  analysisSteps: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
  },
  stepIndicator: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  activeStep: {
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    borderColor: "#10b981",
  },
  stepText: {
    fontSize: 12,
    fontFamily: "Inter-Medium",
    color: "rgba(255, 255, 255, 0.8)",
  },
});
