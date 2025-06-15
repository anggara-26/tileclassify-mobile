import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { CameraView as ExpoCamera, useCameraPermissions } from "expo-camera";
import { Image } from "expo-image";
import * as ImageManipulator from "expo-image-manipulator";
import * as MediaLibrary from "expo-media-library";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

interface CameraViewProps {
  onCapture: (imageUri: string) => void;
  onClose: () => void;
}

export default function CameraView({ onCapture, onClose }: CameraViewProps) {
  const [facing, setFacing] = useState<"front" | "back">("back");
  const [flash, setFlash] = useState<"on" | "off">("off");
  const [isTakingPicture, setIsTakingPicture] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, setMediaPermission] = useState<boolean | null>(null);

  const cameraRef = useRef<any>(null);
  const backgroundColor = useThemeColor(
    { light: "#fff", dark: "#000" },
    "background"
  );
  const textColor = useThemeColor({ light: "#000", dark: "#fff" }, "text");
  const tintColor = useThemeColor({ light: "#2f95dc", dark: "#fff" }, "tint");

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setMediaPermission(status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        setIsTakingPicture(true);
        // Take a picture
        const photo = await cameraRef.current?.takePictureAsync();

        if (photo?.uri) {
          // Compress and resize image to reduce file size for API upload
          const manipResult = await ImageManipulator.manipulateAsync(
            photo.uri,
            [{ resize: { width: 800 } }],
            { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
          );

          setCapturedImage(manipResult.uri);
        }
        setIsTakingPicture(false);
      } catch (error) {
        console.log("Error taking picture:", error);
        setIsTakingPicture(false);
      }
    }
  };

  const saveAndUseImage = async () => {
    if (capturedImage) {
      try {
        await MediaLibrary.saveToLibraryAsync(capturedImage);
        onCapture(capturedImage);
      } catch (error) {
        console.log("Error saving image:", error);
      }
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const toggleFlashMode = () => {
    setFlash(flash === "off" ? "on" : "off");
  };

  if (!permission) {
    // Camera permissions are still loading
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color={tintColor} />
      </ThemedView>
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.text}>Akses ke kamera dibutuhkan</ThemedText>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: tintColor }]}
          onPress={requestPermission}
        >
          <ThemedText style={styles.buttonText}>Izinkan Akses</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={onClose}
        >
          <ThemedText style={[styles.buttonText, { color: tintColor }]}>
            Kembali
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {capturedImage ? (
        <View style={styles.previewContainer}>
          <Image
            source={{ uri: capturedImage }}
            style={styles.previewImage}
            contentFit="cover"
          />
          <View style={styles.previewButtons}>
            <TouchableOpacity
              style={styles.previewButton}
              onPress={retakePhoto}
            >
              <Ionicons name="refresh-outline" size={24} color="#fff" />
              <Text style={styles.previewButtonText}>Ambil Ulang</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.previewButton}
              onPress={saveAndUseImage}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={24}
                color="#fff"
              />
              <Text style={styles.previewButtonText}>Gunakan Foto</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.cameraContainer}>
          {" "}
          <ExpoCamera
            ref={cameraRef}
            style={styles.camera}
            facing={facing}
            flash={flash}
          >
            <View style={styles.cameraControls}>
              <TouchableOpacity style={styles.controlButton} onPress={onClose}>
                <Ionicons name="close-outline" size={28} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={toggleFlashMode}
              >
                <Ionicons
                  name={flash === "on" ? "flash" : "flash-off"}
                  size={28}
                  color="#fff"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.captureContainer}>
              <TouchableOpacity
                style={styles.flipButton}
                onPress={toggleCameraFacing}
              >
                <Ionicons
                  name="camera-reverse-outline"
                  size={30}
                  color="#fff"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.captureButton}
                onPress={takePicture}
                disabled={isTakingPicture}
              >
                {isTakingPicture ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : null}
              </TouchableOpacity>
              <View style={{ width: 70 }} />
            </View>
          </ExpoCamera>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
  },
  cameraControls: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  controlButton: {
    padding: 10,
  },
  captureContainer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderWidth: 5,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  flipButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    width: "80%",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  previewContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  previewImage: {
    flex: 1,
  },
  previewButtons: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  previewButton: {
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
  },
  previewButtonText: {
    color: "#fff",
    marginLeft: 5,
    fontSize: 16,
  },
});
