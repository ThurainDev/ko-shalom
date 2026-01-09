import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useContent } from '../../context/ContentContext';
import { resolveImage, BACKEND_URL } from '../../utils/api';
import FileUpload from './FileUpload';

export default function HomeContentManager({ token }) {
  const { refreshContent } = useContent();
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
      const response = await axios.get(`${BACKEND_URL}/api/content/admin/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const homeSections = (response.data || []).filter((c) => c.page === 'home');
      setSections(homeSections);
    } catch (error) {
      console.error('Error fetching home sections:', error);
      setMessage('Error loading home content');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (section) => {
    setEditingSection(section._id);
    setFormData({
      section: section.section,
      page: section.page,
      title: section.title || '',
      subtitle: section.subtitle || '',
      description: section.description || '',
      content: section.content || '',
      image: section.image || '',
      buttonText: section.buttonText || '',
      buttonLink: section.buttonLink || '',
      secondaryButtonText: section.secondaryButtonText || '',
      secondaryButtonLink: section.secondaryButtonLink || '',
      items: Array.isArray(section.items) ? section.items.map((item) => ({
        title: item.title || '',
        subtitle: item.subtitle || '',
        description: item.description || '',
        date: item.date || '',
        time: item.time || '',
        venue: item.venue || '',
        link: item.link || '',
        buttonText: item.buttonText || '',
        image: item.image || ''
      })) : [],
      isActive: section.isActive,
      order: section.order || 0
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
    const newItems = [...(formData.items || [])];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...(prev.items || []),
        { title: '', subtitle: '', description: '', date: '', time: '', venue: '', link: '', buttonText: '', image: '' }
      ]
    }));
  };

  const removeItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: (prev.items || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);
      const formDataToSend = new FormData();

      // Add text fields
      const keys = ['section', 'page', 'title', 'subtitle', 'description', 'content', 'buttonText', 'buttonLink', 'secondaryButtonText', 'secondaryButtonLink', 'order', 'isActive'];
      keys.forEach((key) => {
        if (typeof formData[key] !== 'undefined') {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Add items
      formDataToSend.append('items', JSON.stringify(formData.items || []));

      // Add image filename (already uploaded)
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }
      
      const updateResponse = await axios.put(`${BACKEND_URL}/api/content/admin/${editingSection}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Home content updated successfully:', updateResponse.data);
      setMessage('Content updated successfully!');
      setEditingSection(null);
      setFormData({});
      await fetchSections();
      // Refresh frontend content
      refreshContent();
    } catch (error) {
      console.error('Error updating home content:', error);
      setMessage('Error updating content');
    } finally {
      setUploading(false);
    }
  };

  const toggleActive = async (sectionId) => {
    try {
      await axios.patch(`${BACKEND_URL}/api/content/admin/${sectionId}/toggle`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchSections();
      setMessage('Status updated successfully!');
      refreshContent();
    } catch (error) {
      console.error('Error toggling status:', error);
      setMessage('Error updating status');
    }
  };

  const getSectionDisplayName = (section) => {
    const names = {
      'hero': 'Hero Section',
      'about': 'About Section',
      'events': 'Upcoming Events',
      'latest': 'Latest Releases',
      'contact': 'Contact Section'
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Home Page Content Manager</h1>
            <p className="text-gray-600">Edit text and images for all sections of the home page</p>
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
          {!sections.some(s => s.section === 'latest') && (
            <button
              onClick={async () => {
                try {
                  const fd = new FormData();
                  fd.append('page', 'home');
                  fd.append('section', 'latest');
                  fd.append('title', 'Latest Releases');
                  fd.append('isActive', 'true');
                  fd.append('order', String((sections.length || 0) + 1));
                  fd.append('items', JSON.stringify([]));
                  await axios.post(`${BACKEND_URL}/api/content/admin`, fd, {
                    headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
                  });
                  await fetchSections();
                  refreshContent();
                  setMessage('Latest Releases section created');
                } catch (err) {
                  setMessage('Error creating Latest Releases');
                }
              }}
              className="ml-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Add Latest Releases
            </button>
          )}
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

                {/* Items section for events */}
                {section.section === 'events' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Event Items
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
                      {(formData.items || []).map((item, index) => (
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
                              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                              <input
                                type="text"
                                value={item.title || ''}
                                onChange={(e) => handleItemChange(index, 'title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                                placeholder="Event title"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                              <input
                                type="text"
                                value={item.venue || ''}
                                onChange={(e) => handleItemChange(index, 'venue', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                                placeholder="Venue"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                              <input
                                type="text"
                                value={item.date || ''}
                                onChange={(e) => handleItemChange(index, 'date', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                                placeholder="e.g., July 15, 2024"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                              <input
                                type="text"
                                value={item.time || ''}
                                onChange={(e) => handleItemChange(index, 'time', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                                placeholder="e.g., 8:00 PM"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                              <textarea
                                value={item.description || ''}
                                onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                                placeholder="Event description"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                              <input
                                type="text"
                                value={item.buttonText || ''}
                                onChange={(e) => handleItemChange(index, 'buttonText', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                                placeholder="e.g., Get Tickets"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
                              <input
                                type="text"
                                value={item.link || ''}
                                onChange={(e) => handleItemChange(index, 'link', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                                placeholder="URL to tickets or details"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Items section for latest releases */}
                {section.section === 'latest' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Latest Releases Items
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
                      {(formData.items || []).map((item, index) => (
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
                              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                              <input
                                type="text"
                                value={item.title || ''}
                                onChange={(e) => handleItemChange(index, 'title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                                placeholder="Album title"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                              <input
                                type="text"
                                value={item.subtitle || ''}
                                onChange={(e) => handleItemChange(index, 'subtitle', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                                placeholder="Optional subtitle"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                              <input
                                type="text"
                                value={item.buttonText || ''}
                                onChange={(e) => handleItemChange(index, 'buttonText', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                                placeholder="e.g., Listen"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
                              <input
                                type="text"
                                value={item.link || ''}
                                onChange={(e) => handleItemChange(index, 'link', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                                placeholder="URL to album"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <FileUpload
                                token={token}
                                currentImage={item.image}
                                onUploadSuccess={(filename) => {
                                  handleItemChange(index, 'image', filename);
                                  setMessage('Item image uploaded successfully!');
                                }}
                                onUploadError={() => {
                                  setMessage('Error uploading item image');
                                }}
                                uploadEndpoint="/api/upload/image"
                                previewSize="w-24 h-24"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                    <input
                      type="number"
                      name="order"
                      value={formData.order || 0}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={!!formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="mr-2"
                    />
                    <label className="text-sm font-medium text-gray-700">Active</label>
                  </div>
                </div>

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
                {section.image && (
                  <div>
                    <span className="font-medium text-gray-700">Image:</span>
                    <div className="mt-2">
                      <img
                        src={resolveImage(section.image)}
                        alt="Section"
                        className="w-32 h-32 object-cover rounded-md"
                      />
                    </div>
                  </div>
                )}
                {section.items && section.items.length > 0 && section.section === 'events' && (
                  <div>
                    <span className="font-medium text-gray-700">Items:</span>
                    <div className="mt-2 space-y-2">
                      {section.items.map((item, index) => (
                        <div key={index} className="pl-4 border-l-2 border-gray-200">
                          <div className="font-medium">{item.title}</div>
                          <div className="text-sm text-gray-600">{item.venue}</div>
                          <div className="text-sm text-gray-600">{item.date} {item.time}</div>
                          {item.description && (
                            <div className="text-sm text-gray-700">{item.description}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {section.items && section.items.length > 0 && section.section === 'latest' && (
                  <div>
                    <span className="font-medium text-gray-700">Items:</span>
                    <div className="mt-2 space-y-2">
                      {section.items.map((item, index) => (
                        <div key={index} className="pl-4 border-l-2 border-gray-200">
                          <div className="font-medium">{item.title}</div>
                          {item.subtitle && (
                            <div className="text-sm text-gray-600">{item.subtitle}</div>
                          )}
                          {item.buttonText && (
                            <div className="text-sm text-gray-600">{item.buttonText}</div>
                          )}
                          {item.link && (
                            <div className="text-sm text-gray-600">{item.link}</div>
                          )}
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