import axios from "axios";

// Buat instance axios dengan konfigurasi dasar
const api = axios.create({
  // Ganti dengan URL API yang sebenarnya
  baseURL: "https://9f7a-111-95-226-100.ngrok-free.app/",
  headers: {
    "Content-Type": "multipart/form-data",
    Accept: "application/json",
  },
});

// Tipe untuk response klasifikasi
export interface ClassificationResponse {
  status: number;
  data: {
    tile_type: string;
    tile_price: string;
    confidence: string;
  };
  message?: string;
}

// Service untuk klasifikasi gambar
export const imageClassificationService = {
  /**
   * Mengirim gambar ke API untuk diklasifikasikan
   * @param imageUri URI lokal dari gambar yang akan dikirim
   * @returns Promise dengan hasil klasifikasi
   */
  classifyImage: async (imageUri: string): Promise<ClassificationResponse> => {
    try {
      // Buat form data untuk mengirim gambar
      const formData = new FormData();

      // Ambil nama file dari path
      const filename = imageUri.split("/").pop() || `image_${Date.now()}.jpg`;

      // @ts-ignore - Tipe FormData di React Native berbeda dengan TypeScript standar
      formData.append("image_file", {
        uri: imageUri,
        name: filename,
        type: "image/jpeg",
      });

      formData.append("confidence_threshold", "0.5");

      // Kirim request ke endpoint klasifikasi
      const response = await api.post<ClassificationResponse>(
        "/api/classify-tile/",
        formData
      );
      console.log("Classification response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error classifying image:", error);
      // Return error response
      return {
        status: 500,
        data: {
          tile_type: "Error",
          tile_price: "N/A",
          confidence: "0",
        },
        message: "Failed to classify image",
      };
    }
  },
};

export default api;
