import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAbout } from '../../context/AboutContext';
import FileUpload from './FileUpload';

export default function AboutContentManager({ token }) {
  const { refreshContent } = useAbout();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState(null);
  const [formData, setFormData] = useState({});
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/about-content/admin/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSections(response.data);
    } catch (error) {
      console.error('Error fetching sections:', error);
      setMessage('Error loading content');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (section) => {
    setEditingSection(section._id);
    setFormData({
      title: section.title || '',
      subtitle: section.subtitle || '',
      description: section.description || '',
      content: section.content || '',
      image: section.image || '',
      items: section.items || [],
      isActive: section.isActive
    });
  };

  const handleCancel = () => {
    setEditingSection(null);
    setFormData({});
    setMessage('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };



  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { timeLine: '', title: '', description: '', image: '' }]
    }));
  };

  const removeItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);
      
      const url = `/api/about-content/admin/${editingSection}`;
      const method = 'put';

      const response = await axios[method](url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setUploading(false);
      setMessage('Content updated successfully!');
      setEditingSection(null);
      fetchSections(); // Refresh the list
      refreshContent(); // Refresh public view
    } catch (error) {
      console.error('Error saving content:', error);
      setMessage('Error saving content');
      setUploading(false);
    }
  };

  const toggleActive = async (sectionId) => {
    try {
      await axios.patch(`/api/about-content/admin/${sectionId}/toggle`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchSections();
      setMessage('Status updated successfully!');
      // Refresh frontend content
      refreshContent();
    } catch (error) {
      console.error('Error toggling status:', error);
      setMessage('Error updating status');
    }
  };

  const getSectionDisplayName = (section) => {
    const names = {
      'hero': 'Hero Section',
      'musical-journey': 'Musical Journey',
      'musical-style': 'Musical Style',
      'awards': 'Awards & Recognition',
      'philosophy': 'Philosophy'
    };
    return names[section] || section;
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">About Page Content Manager</h1>
            <p className="text-gray-600">Edit text and images for all sections of the about page</p>
          </div>
          <button
            onClick={() => {
              fetchSections();
              refreshContent();
              setMessage('Content refreshed!');
            }}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            Refresh Content
          </button>
        </div>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {message}
        </div>
      )}

      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {getSectionDisplayName(section.section)}
              </h2>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  section.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {section.isActive ? 'Active' : 'Inactive'}
                </span>
                <button
                  onClick={() => toggleActive(section._id)}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Toggle
                </button>
                <button
                  onClick={() => handleEdit(section)}
                  className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  Edit
                </button>
              </div>
            </div>

            {editingSection === section._id ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                                         <input
                       type="text"
                       name="title"
                       value={formData.title}
                       onChange={handleInputChange}
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                     />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subtitle
                    </label>
                                         <input
                       type="text"
                       name="subtitle"
                       value={formData.subtitle}
                       onChange={handleInputChange}
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                     />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                                     <textarea
                     name="description"
                     value={formData.description}
                     onChange={handleInputChange}
                     rows={4}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                     placeholder="Enter description (supports HTML)"
                   />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                  </label>
                                     <textarea
                     name="content"
                     value={formData.content}
                     onChange={handleInputChange}
                     rows={6}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                     placeholder="Enter rich content (supports HTML)"
                   />
                </div>

                <FileUpload
                  token={token}
                  currentImage={formData.image}
                  onUploadSuccess={(filename) => {
                    setFormData(prev => ({ ...prev, image: filename }));
                    setMessage('Image uploaded successfully!');
                  }}
                  onUploadError={(error) => {
                    const msg = error?.response?.data?.message || 'Error uploading image';
                    setMessage(msg);
                  }}
                  uploadEndpoint="/api/upload/image"
                />

                {/* Items section for timeline/awards */}
                {(section.section === 'musical-journey' || section.section === 'awards') && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Items
                      </label>
                      <button
                        type="button"
                        onClick={addItem}
                        className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                      >
                        Add Item
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {formData.items.map((item, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="font-medium">Item {index + 1}</h4>
                            <button
                              type="button"
                              onClick={() => removeItem(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Remove
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Timeline
                              </label>
                                                             <input
                                 type="text"
                                 value={item.timeLine || ''}
                                 onChange={(e) => handleItemChange(index, 'timeLine', e.target.value)}
                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                                 placeholder="e.g., 2010-2013"
                               />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title
                              </label>
                                                             <input
                                 type="text"
                                 value={item.title || ''}
                                 onChange={(e) => handleItemChange(index, 'title', e.target.value)}
                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                                 placeholder="Item title"
                               />
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Description
                            </label>
                                                         <textarea
                               value={item.description || ''}
                               onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                               rows={3}
                               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                               placeholder="Item description"
                             />
                          </div>
                          
                                                     <div className="mt-4">
                             <FileUpload
                               token={token}
                               currentImage={item.image}
                               onUploadSuccess={(filename) => {
                                 handleItemChange(index, 'image', filename);
                               }}
                               onUploadError={(error) => {
                                 const msg = error?.response?.data?.message || 'Error uploading item image';
                                 setMessage(msg);
                               }}
                               uploadEndpoint="/api/upload/image"
                               previewSize="w-24 h-24"
                             />
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
                  >
                    {uploading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                {section.title && (
                  <div>
                    <span className="font-medium text-gray-700">Title:</span>
                    <span className="ml-2 text-gray-900">{section.title}</span>
                  </div>
                )}
                {section.subtitle && (
                  <div>
                    <span className="font-medium text-gray-700">Subtitle:</span>
                    <span className="ml-2 text-gray-900">{section.subtitle}</span>
                  </div>
                )}
                {section.description && (
                  <div>
                    <span className="font-medium text-gray-700">Description:</span>
                    <div className="mt-1 text-gray-900" dangerouslySetInnerHTML={{ __html: section.description }} />
                  </div>
                )}
                {section.content && (
                  <div>
                    <span className="font-medium text-gray-700">Content:</span>
                    <div className="mt-1 text-gray-900" dangerouslySetInnerHTML={{ __html: section.content }} />
                  </div>
                )}
                {section.image && (
                  <div>
                    <span className="font-medium text-gray-700">Image:</span>
                    <div className="mt-2">
                      <img
                        src={resolveImage(section.image)}
                        alt="Section image"
                        className="w-32 h-32 object-cover rounded-md"
                      />
                    </div>
                  </div>
                )}
                {section.items && section.items.length > 0 && (
                  <div>
                    <span className="font-medium text-gray-700">Items:</span>
                    <div className="mt-2 space-y-2">
                      {section.items.map((item, index) => (
                        <div key={index} className="pl-4 border-l-2 border-gray-200">
                          <div className="font-medium">{item.title}</div>
                          <div className="text-sm text-gray-600">{item.timeLine}</div>
                          <div className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: item.description }} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}