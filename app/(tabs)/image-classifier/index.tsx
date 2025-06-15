import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CameraView from "@/components/ImageClassification/CameraView";
import ClassificationResult from "@/components/ImageClassification/ClassificationResult";
import ImagePicker from "@/components/ImageClassification/ImagePicker";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  ClassificationResponse,
  imageClassificationService,
} from "@/services/api";

export default function ImageClassifierScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [isClassifying, setIsClassifying] = useState(false);
  const [result, setResult] = useState<ClassificationResponse | null>(null);

  const router = useRouter();
  const tintColor = useThemeColor(
    { light: "#2f95dc", dark: "#4cc9f0" },
    "tint"
  );

  const handleSelectImage = (imageUri: string) => {
    setSelectedImage(imageUri);
    setResult(null);
  };

  const handleCaptureFromCamera = (imageUri: string) => {
    setSelectedImage(imageUri);
    setShowCamera(false);
    setResult(null);
  };

  const handleOpenCamera = () => {
    setShowCamera(true);
  };

  const handleCloseCamera = () => {
    setShowCamera(false);
  };

  const handleClassifyImage = async () => {
    if (!selectedImage) return;

    try {
      setIsClassifying(true);
      const classificationResult =
        await imageClassificationService.classifyImage(selectedImage);
      setResult(classificationResult);
    } catch (error) {
      console.error("Error classifying image:", error);
      setResult({
        status: 500,
        data: {
          tile_type: "Error",
          tile_price: "N/A",
          confidence: "0",
        },
        message: "Terjadi kesalahan saat mengklasifikasi gambar",
      });
    } finally {
      setIsClassifying(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setResult(null);
  };
  if (showCamera) {
    return (
      <CameraView
        onCapture={handleCaptureFromCamera}
        onClose={handleCloseCamera}
      />
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerTitle: "Klasifikasi Gambar",
          headerShown: true,
        }}
      />
      <StatusBar style="auto" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <ThemedView style={styles.header}>
          <ThemedText style={styles.title}>
            Deteksi dan Klasifikasi Gambar
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Ambil foto atau pilih gambar dari galeri untuk diklasifikasikan
          </ThemedText>
        </ThemedView>

        {!selectedImage ? (
          <ImagePicker
            onSelectImage={handleSelectImage}
            onOpenCamera={handleOpenCamera}
          />
        ) : (
          <ClassificationResult
            imageUri={selectedImage}
            result={result}
            isLoading={isClassifying}
            onReset={handleReset}
          />
        )}

        {selectedImage && !result && !isClassifying && (
          <ThemedView style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: tintColor }]}
              onPress={handleClassifyImage}
            >
              <Ionicons
                name="scan"
                size={20}
                color="#fff"
                style={styles.buttonIcon}
              />
              <ThemedText style={styles.buttonText}>Klasifikasi</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={handleReset}
            >
              <Ionicons
                name="close"
                size={20}
                color={tintColor}
                style={styles.buttonIcon}
              />
              <ThemedText style={[styles.buttonText, { color: tintColor }]}>
                Batal
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
    backgroundColor: "transparent",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: "column",
    gap: 12,
    paddingHorizontal: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
