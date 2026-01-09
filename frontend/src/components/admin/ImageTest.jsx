import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { resolveImage, BACKEND_URL } from '../../utils/api';

export default function ImageTest({ token }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/api/upload/files`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Normalize response: cloudinary returns objects with url, backend local returns filename strings
      const extractPublicIdFromUrl = (url) => {
        if (!url || typeof url !== 'string') return null;
        // Cloudinary URLs usually contain '/upload/(v1234/)?<path>/<public_id>.<ext>'
        const m = url.match(/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
        return m ? m[1] : null;
      };

      const normalized = (response.data || []).map(item => {
        if (item && typeof item === 'object') {
          const id = item.public_id || item.filename || extractPublicIdFromUrl(item.url) || (item.url && item.url);
          const src = item.url || item.filename || item.public_id || item;
          return { id, src };
        }
        return { id: item, src: item };
      });

      setFiles(normalized);
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading files...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Image Test - Latest Uploads</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {files.slice(-8).map((file, index) => (
          <div key={index} className="border rounded p-2">
            <img
              src={(file.src && file.src.toString().startsWith('http')) ? file.src : resolveImage(file.src)}
              alt={file.id || file.src}
              className="w-full h-32 object-cover rounded"
              onError={(e) => {
                console.error('Image failed to load:', file);
                e.target.style.display = 'none';
              }}
              onLoad={() => {
                console.log('Image loaded successfully:', file);
              }}
            />
            <p className="text-xs mt-1 truncate">{file.id || file.src}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 