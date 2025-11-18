// lib/cloudinary.js
// Client-side only utility for Cloudinary uploads

export async function uploadToCloudinary(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Upload failed');
    }

    return result.data;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }
}

// Mock function for client-side (actual deletion should be done via API route)
export async function deleteFromCloudinary(publicId) {
  console.warn('File deletion should be handled via server API');
  return { result: 'ok' };
}