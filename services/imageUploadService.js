// services/imageUploadService.js

export class ImageUploadService {
  static async uploadToCloudinary(file) {
    if (!file) {
      throw new Error('No file provided');
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Please select an image smaller than 5MB');
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Please select a JPG, PNG, or GIF image');
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
      
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Upload failed');
      }

      const data = await response.json();
      return data.secure_url; // Return the Cloudinary URL

    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error(error.message || 'Failed to upload image. Please try again.');
    }
  }
}