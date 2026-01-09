import React, { useState } from 'react';
import { resolveImage } from '../../utils/api';
import axios from 'axios';

export default function MultipleFileUpload({ 
  token, 
  onUploadSuccess, 
  onUploadError, 
  currentImages = [], 
  maxFiles = 10,
  className = "",
  showPreview = true,
  previewSize = "w-24 h-24"
}) {
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState([]);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Check file limit
    if (currentImages.length + files.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Create previews
    const newPreviews = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setPreviews(newPreviews);

    try {
      setUploading(true);
      const formData = new FormData();
      
      files.forEach(file => {
        formData.append('images', file);
      });
      
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/upload/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Files uploaded successfully:', response.data);
      
      if (onUploadSuccess) {
        const newFilenames = response.data.files.map(f => f.filename);
        onUploadSuccess([...currentImages, ...newFilenames]);
      }
      
      setPreviews([]);
    } catch (error) {
      console.error('Error uploading files:', error);
      setPreviews([]);
      if (onUploadError) {
        onUploadError(error);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = (index) => {
    const newImages = currentImages.filter((_, i) => i !== index);
    if (onUploadSuccess) {
      onUploadSuccess(newImages);
    }
  };

  const handleRemovePreview = (index) => {
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Multiple Image Upload ({currentImages.length}/{maxFiles})
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          disabled={uploading || currentImages.length >= maxFiles}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 disabled:opacity-50"
        />
        {uploading && (
          <p className="mt-2 text-sm text-blue-600">Uploading...</p>
        )}
      </div>

      {showPreview && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {/* Current images */}
          {currentImages.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={resolveImage(image)}
                alt={`Image ${index + 1}`}
                className={`${previewSize} object-cover rounded-md border border-gray-300`}
              />
              <button
                type="button"
                onClick={() => handleRemoveFile(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ))}

          {/* Upload previews */}
          {previews.map((preview, index) => (
            <div key={`preview-${index}`} className="relative">
              <img
                src={preview.preview}
                alt={`Preview ${index + 1}`}
                className={`${previewSize} object-cover rounded-md border border-gray-300`}
              />
              <button
                type="button"
                onClick={() => handleRemovePreview(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 