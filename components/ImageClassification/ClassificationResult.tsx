import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { ClassificationResponse } from "@/services/api";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

interface ClassificationResultProps {
  imageUri: string | null;
  result: ClassificationResponse | null;
  isLoading: boolean;
  onReset: () => void;
}

export default function ClassificationResult({
  imageUri,
  result,
  isLoading,
  onReset,
}: ClassificationResultProps) {
  const backgroundColor = useThemeColor(
    { light: "#ffffff", dark: "#121212" },
    "background"
  );
  const cardBackground = useThemeColor(
    { light: "#f5f5f5", dark: "#1e1e1e" },
    "background"
  );
  const tintColor = useThemeColor(
    { light: "#2f95dc", dark: "#4cc9f0" },
    "tint"
  );

  if (!imageUri) return null;

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.card, { backgroundColor: cardBackground }]}>
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          contentFit="cover"
        />

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={tintColor} />
            <ThemedText style={styles.loadingText}>
              Mengklasifikasi gambar...
            </ThemedText>
          </View>
        ) : result ? (
          <View style={styles.resultContainer}>
            {result.status === 200 ? (
              <>
                <View style={styles.resultHeader}>
                  <ThemedText style={styles.classNameText}>
                    {result.data.tile_type}
                  </ThemedText>
                  <ThemedText style={styles.classPriceText}>
                    {result.data.tile_price}
                  </ThemedText>
                  <ThemedText style={styles.confidenceText}>
                    {result.data.confidence}% yakin
                  </ThemedText>
                </View>
              </>
            ) : (
              <View style={styles.errorContainer}>
                <Ionicons name="warning-outline" size={32} color="#ff7b00" />
                <ThemedText style={styles.errorText}>
                  {result.message || "Gagal mengklasifikasi gambar"}
                </ThemedText>
              </View>
            )}

            <TouchableOpacity
              style={[styles.resetButton, { backgroundColor: tintColor }]}
              onPress={onReset}
            >
              <Ionicons name="refresh-outline" size={20} color="#fff" />
              <ThemedText style={styles.resetButtonText}>Coba Lagi</ThemedText>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  image: {
    width: "100%",
    height: 250,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  resultContainer: {
    padding: 20,
  },
  resultHeader: {
    marginBottom: 15,
  },
  classNameText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  classPriceText: {
    fontSize: 20,
    color: "#4caf50",
    marginBottom: 5,
  },
  confidenceText: {
    fontSize: 16,
    opacity: 0.7,
  },
  otherPredictionsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
  },
  predictionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(150, 150, 150, 0.2)",
  },
  predictionClass: {
    fontSize: 14,
  },
  predictionConfidence: {
    fontSize: 14,
    opacity: 0.7,
  },
  errorContainer: {
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
  },
  resetButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
});
