import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImageManipulator from "expo-image-manipulator";
import * as ExpoImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

interface ImagePickerProps {
  onSelectImage: (imageUri: string) => void;
  onOpenCamera: () => void;
}

export default function ImagePicker({
  onSelectImage,
  onOpenCamera,
}: ImagePickerProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const backgroundColor = useThemeColor(
    { light: "#f9f9f9", dark: "#000" },
    "background"
  );
  const textColor = useThemeColor({ light: "#000", dark: "#fff" }, "text");
  const tintColor = useThemeColor({ light: "#2f95dc", dark: "#fff" }, "tint");
  const pickImage = async () => {
    try {
      // Request permission
      const { status } =
        await ExpoImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        alert("Diperlukan izin untuk mengakses galeri");
        return;
      }

      setIsLoading(true);

      // Buka image picker untuk memilih gambar
      const result = await ExpoImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Optimize image for upload
        const manipResult = await ImageManipulator.manipulateAsync(
          result.assets[0].uri,
          [{ resize: { width: 800 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        );

        setSelectedImage(manipResult.uri);
        onSelectImage(manipResult.uri);
      }
    } catch (error) {
      console.log("Error picking image:", error);
      alert("Gagal memilih gambar");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.imagePickerContainer}>
        <TouchableOpacity
          style={[styles.imageBox, { backgroundColor }]}
          onPress={pickImage}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="large" color={tintColor} />
          ) : selectedImage ? (
            <Image
              source={{ uri: selectedImage }}
              style={styles.selectedImage}
              contentFit="cover"
            />
          ) : (
            <>
              <Ionicons name="images" size={50} color={tintColor} />
              <ThemedText style={styles.imagePickerText}>
                Pilih Gambar dari Galeri
              </ThemedText>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.imageBox, { backgroundColor }]}
          onPress={onOpenCamera}
        >
          <Ionicons name="camera" size={50} color={tintColor} />
          <ThemedText style={styles.imagePickerText}>
            Ambil Foto dengan Kamera
          </ThemedText>
        </TouchableOpacity>
      </View>

      {selectedImage && (
        <ThemedText style={styles.helpText}>
          Gambar telah dipilih. Tekan tombol "Klasifikasi" untuk menganalisanya.
        </ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  imagePickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  imageBox: {
    width: "48%",
    height: 180,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    overflow: "hidden",
  },
  selectedImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  imagePickerText: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 14,
  },
  helpText: {
    textAlign: "center",
    marginTop: 10,
    opacity: 0.7,
    fontSize: 14,
  },
});
