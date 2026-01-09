import React, { useState } from 'react';
import axios from 'axios';
import { resolveImage } from '../../utils/api';

export default function FileUpload({ 
  token, 
  onUploadSuccess, 
  onUploadError, 
  currentImage, 
  uploadEndpoint = '/api/upload',
  className = "",
  showPreview = true,
  previewSize = "w-32 h-32"
}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create preview
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post(uploadEndpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      console.log('File uploaded successfully:', response.data);
      
      // Prefer cloud URL when returned, otherwise fall back to filename/public_id
      const returned = response.data;
      const imageValue = returned.url || returned.secure_url || returned.filename || returned.public_id || '';

      if (onUploadSuccess) {
        onUploadSuccess(imageValue);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setPreview(null);
      if (onUploadError) {
        onUploadError(error);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setPreview(null);
    if (onUploadSuccess) {
      onUploadSuccess('');
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image Upload
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 disabled:opacity-50"
        />
        {uploading && (
          <p className="mt-2 text-sm text-blue-600">Uploading...</p>
        )}
      </div>

      {showPreview && (
        <div className="space-y-2">
          {/* New upload preview */}
          {preview && (
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className={`${previewSize} object-cover rounded-md border border-gray-300`}
              />
              <button
                type="button"
                onClick={handleRemoveFile}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
              >
                ×
              </button>
            </div>
          )}

          {/* Current image */}
          {currentImage && !preview && (
            <div className="relative">
              <img
                src={resolveImage(currentImage)}
                alt="Current image"
                className={`${previewSize} object-cover rounded-md border border-gray-300`}
              />
              <button
                type="button"
                onClick={handleRemoveFile}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
              >
                ×
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}