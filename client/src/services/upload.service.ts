import api from "./api";

export interface UploadImageResponse {
  success: boolean;
  message: string;
  image: {
    url: string;
    public_id: string;
  };
}

export interface UploadImagesResponse {
  success: boolean;
  message: string;
  images: Array<{
    url: string;
    public_id: string;
  }>;
}

export const uploadService = {
  /**
   * Upload a single image
   */
  uploadImage: async (file: File): Promise<UploadImageResponse> => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await api.post<UploadImageResponse>("/upload/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  /**
   * Upload multiple images
   */
  uploadImages: async (files: File[]): Promise<UploadImagesResponse> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    const response = await api.post<UploadImagesResponse>("/upload/images", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },
};

