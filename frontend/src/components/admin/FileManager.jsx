import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { resolveImage } from '../../utils/api';
import FileUpload from './FileUpload';

export default function FileManager({ token, onFileSelect, showModal = false, onClose }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      // This would need a backend route to list all files
      // For now, we'll use a placeholder
      const extractPublicIdFromUrl = (url) => {
        if (!url || typeof url !== 'string') return null;
        const m = url.match(/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
        return m ? m[1] : null;
      };
      
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/upload/files`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const normalized = (response.data || []).map(item => {
        if (item && typeof item === 'object') {
          const id = item.public_id || item.filename || extractPublicIdFromUrl(item.url) || item.url;
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

  const handleFileSelect = (fObj) => {
    const filename = (fObj && (fObj.src || fObj.id)) || fObj;
    if (onFileSelect) onFileSelect(filename);
    if (showModal && onClose) onClose();
  };

  const handleDeleteFile = async (fObj) => {
    const filename = (fObj && (fObj.id || fObj.src)) || fObj;
    if (!window.confirm('Are you sure you want to delete this file?')) return;
    
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/upload/${encodeURIComponent(filename)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFiles(files.filter(f => (f.id !== filename && f.src !== filename)));
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const filteredFiles = files.filter(fObj => 
    (fObj && (fObj.id || fObj.src) || '').toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const content = (
    <div className="p-4">
      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="Search files..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
        />
        <button className="btn" onClick={() => setUploading(true)}>Upload</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredFiles.map((fObj, index) => (
          <div key={fObj.id || fObj.src || index} className="relative group">
            <img
              src={resolveImage(fObj.src || fObj.id)}
              alt={fObj.src || fObj.id}
              className="w-full h-24 object-cover rounded-md border border-gray-300 cursor-pointer hover:opacity-75 transition-opacity"
              onClick={() => handleFileSelect(fObj)}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-md flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleFileSelect(fObj)}
                  className="bg-blue-500 text-white px-2 py-1 rounded text-xs mr-1"
                >
                  Select
                </button>
                <button
                  onClick={() => handleDeleteFile(fObj)}
                  className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-1 truncate">{(fObj.src || fObj.id)}</p>
          </div>
        ))}
      </div>

      {uploading && (
        <div className="mt-4">
          <FileUpload
            onClose={() => setUploading(false)}
            onPick={(f) => { setUploading(false); handleFileSelect(f); fetchFiles(); }}
          />
        </div>
      )}

      {filteredFiles.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No files found
        </div>
      )}
    </div>
  );

  if (showModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-lg font-semibold">File Manager</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="overflow-y-auto max-h-[calc(80vh-80px)]">
            {content}
          </div>
        </div>
      </div>
    );
  }

  return content;
} 