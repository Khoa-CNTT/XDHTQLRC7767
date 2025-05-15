import axios from "axios";

class CloudinaryService {
  private cloudName: string;
  private uploadPreset: string;
  private apiKey: string;
  private apiSecret: string;

  constructor() {
    // Load from environment variables or use fallback values
    this.cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dp489la7s";
    this.uploadPreset =
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "ml_default";
    this.apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY || "268894864221893";
    this.apiSecret = import.meta.env.VITE_CLOUDINARY_API_SECRET || "";
  }

  async uploadImage(file: File): Promise<CloudinaryResponse> {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", this.uploadPreset);
      formData.append("folder", "doanratruong");

      console.log("Uploading to Cloudinary with preset:", this.uploadPreset);
      console.log("Cloud name:", this.cloudName);
      console.log("Folder:", "doanratruong");
      console.log("File size:", file.size, "bytes");
      console.log("File type:", file.type);

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
        formData
      );

      console.log("Cloudinary response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error uploading to Cloudinary:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        if (error.response.data && error.response.data.error) {
          console.error("Detailed error:", error.response.data.error);
        }
      }
      throw new Error(
        `Failed to upload image to Cloudinary: ${
          error.message || "Unknown error"
        }`
      );
    }
  }

  private async uploadImageUnsigned(file: File): Promise<CloudinaryResponse> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", this.uploadPreset);

    console.log("Uploading to Cloudinary with preset:", this.uploadPreset);
    console.log("Cloud name:", this.cloudName);
    console.log("File size:", file.size, "bytes");
    console.log("File type:", file.type);

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
      formData
    );

    console.log("Cloudinary response:", response.data);
    return response.data;
  }

  private async uploadImageSigned(file: File): Promise<CloudinaryResponse> {
    // Chuyển đổi file thành base64 để gửi qua API
    const base64data = await this.getBase64(file);
    const formData = new FormData();
    formData.append("file", base64data);
    formData.append("api_key", this.apiKey);

    // Thêm các tham số khác như timestamp và folder nếu cần
    const timestamp = Math.round(new Date().getTime() / 1000);
    formData.append("timestamp", timestamp.toString());
    formData.append("folder", "mentora");

    // Lưu ý: Trong môi trường thực tế, signature nên được tạo ở backend
    // Đây chỉ là mã mẫu, không nên sử dụng API secret ở frontend

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
      formData
    );

    return response.data;
  }

  // Hàm chuyển đổi File thành base64
  private getBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  async uploadBase64Image(base64String: string): Promise<CloudinaryResponse> {
    try {
      const formData = new FormData();
      formData.append("file", base64String);
      formData.append("upload_preset", this.uploadPreset);
      formData.append("folder", "doanratruong");

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
        formData
      );

      return response.data;
    } catch (error: any) {
      console.error("Error uploading base64 to Cloudinary:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
      throw new Error(
        `Failed to upload base64 image to Cloudinary: ${
          error.message || "Unknown error"
        }`
      );
    }
  }
}

export interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
  asset_id?: string;
  url?: string;
  format?: string;
  width?: number;
  height?: number;
  resource_type?: string;
}

export default new CloudinaryService();
