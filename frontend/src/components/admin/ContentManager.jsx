import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { resolveImage } from '../../utils/api';
import { useContent } from '../../context/ContentContext';

export default function ContentManager({ token, pageFilter }) {
  const { refreshContent } = useContent();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [form, setForm] = useState({
    section: '',
    page: pageFilter || '',
    title: '',
    subtitle: '',
    description: '',
    content: '',
    buttonText: '',
    buttonLink: '',
    secondaryButtonText: '',
    secondaryButtonLink: '',
    items: [],
    socialLinks: {
      instagram: '',
      youtube: '',
      spotify: '',
      soundcloud: '',
      appleMusic: ''
    },
    isActive: true,
    order: 0
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Helpers to normalize backend<->frontend shape differences
  const normalizeSocialLinksToObj = (links) => {
    if (!links) {
      return {
        instagram: '',
        youtube: '',
        spotify: '',
        soundcloud: '',
        appleMusic: ''
      };
    }
    // If array [{ platform, url }] -> object { platform: url }
    if (Array.isArray(links)) {
      const obj = {
        instagram: '',
        youtube: '',
        spotify: '',
        soundcloud: '',
        appleMusic: ''
      };
      links.forEach((l) => {
        if (l && l.platform && typeof l.url === 'string') {
          const key = String(l.platform);
          if (obj.hasOwnProperty(key)) {
            obj[key] = l.url;
          }
        }
      });
      return obj;
    }
    // Assume already object
    return {
      instagram: links.instagram || '',
      youtube: links.youtube || '',
      spotify: links.spotify || '',
      soundcloud: links.soundcloud || '',
      appleMusic: links.appleMusic || ''
    };
  };

  const normalizeSocialLinksToArray = (links) => {
    if (!links) return [];
    if (Array.isArray(links)) return links;
    // Object { platform: url } -> array
    const entries = Object.entries(links || {});
    return entries
      .filter(([_, url]) => typeof url === 'string' && url.trim() !== '')
      .map(([platform, url]) => ({ platform, url }));
  };

  const normalizeItems = (items) => {
    if (!Array.isArray(items)) return [];
    return items.map((item) => ({
      title: item.title || '',
      subtitle: item.subtitle || '',
      description: item.description || '',
      date: item.date || '',
      time: item.time || '',
      venue: item.venue || '',
      link: item.link || '',
      buttonText: item.buttonText || '',
      image: item.image || ''
    }));
  };

  const sections = [
    { value: 'hero', label: 'Hero Section' },
    { value: 'about', label: 'About Section' },
    { value: 'events', label: 'Events Section' },
    { value: 'contact', label: 'Contact Section' },
    { value: 'footer', label: 'Footer' },
    { value: 'about-hero', label: 'About Hero' },
    { value: 'about-journey', label: 'About Journey' },
    { value: 'about-awards', label: 'About Awards' },
    { value: 'about-style', label: 'About Style' },
    { value: 'about-philosophy', label: 'About Philosophy' },
    { value: 'product-hero', label: 'Product Hero' },
    { value: 'product-faq', label: 'Product FAQ' },
    { value: 'product-streaming', label: 'Product Streaming' },
    { value: 'contact-hero', label: 'Contact Hero' },
    { value: 'contact-faq', label: 'Contact FAQ' }
  ];

  const pages = [
    { value: 'home', label: 'Home' },
    { value: 'about', label: 'About' },
    { value: 'product', label: 'Product' },
    { value: 'contact', label: 'Contact' },
    { value: 'global', label: 'Global' }
  ];

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/content/admin/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContent(res.data);
    } catch (err) {
      setError('Failed to fetch content');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingContent(null);
    setForm({
      section: '',
      page: pageFilter || '',
      title: '',
      subtitle: '',
      description: '',
      content: '',
      buttonText: '',
      buttonLink: '',
      secondaryButtonText: '',
      secondaryButtonLink: '',
      items: [],
      socialLinks: {
        instagram: '',
        youtube: '',
        spotify: '',
        soundcloud: '',
        appleMusic: ''
      },
      isActive: true,
      order: 0
    });
    setImageFile(null);
    setImagePreview(null);
    setShowForm(true);
  };

  const handleEdit = (contentItem) => {
    setEditingContent(contentItem);
    setForm({
      section: contentItem.section,
      page: contentItem.page,
      title: contentItem.title || '',
      subtitle: contentItem.subtitle || '',
      description: contentItem.description || '',
      content: contentItem.content || '',
      buttonText: contentItem.buttonText || '',
      buttonLink: contentItem.buttonLink || '',
      secondaryButtonText: contentItem.secondaryButtonText || '',
      secondaryButtonLink: contentItem.secondaryButtonLink || '',
      items: normalizeItems(contentItem.items || []),
      socialLinks: normalizeSocialLinksToObj(contentItem.socialLinks),
      isActive: contentItem.isActive,
      order: contentItem.order || 0
    });
    setImagePreview(contentItem.image ? resolveImage(contentItem.image) : null);
    setImageFile(null);
    setShowForm(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialLinkChange = (platform, value) => {
    setForm(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value }
    }));
  };

  const addItem = () => {
    setForm(prev => ({
      ...prev,
      items: [...prev.items, {
        title: '',
        subtitle: '',
        description: '',
        date: '',
        time: '',
        venue: '',
        link: '',
        buttonText: ''
      }]
    }));
  };

  const removeItem = (index) => {
    setForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleItemChange = (index, field, value) => {
    setForm(prev => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      
      // Add all form fields
      Object.keys(form).forEach(key => {
        if (key === 'items') {
          formData.append(key, JSON.stringify(form[key]));
        } else if (key === 'socialLinks') {
          const socialArray = normalizeSocialLinksToArray(form[key]);
          formData.append(key, JSON.stringify(socialArray));
        } else {
          formData.append(key, form[key]);
        }
      });

      if (imageFile) {
        formData.append('image', imageFile);
      }

      if (editingContent) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/content/admin/${editingContent._id}`, formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/content/admin`, formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      setShowForm(false);
      fetchContent();
      // Refresh client-facing content across the app
      refreshContent();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save content');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this content?')) return;
    
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/content/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContent(content.filter(c => c._id !== id));
      // Ensure client-facing content updates
      refreshContent();
    } catch (err) {
      setError('Failed to delete content');
    }
  };

  const handleToggle = async (id) => {
    try {
      const res = await axios.patch(`${import.meta.env.VITE_API_URL}/api/content/admin/${id}/toggle`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContent(content.map(c => c._id === id ? res.data : c));
      // Ensure client-facing content updates
      refreshContent();
    } catch (err) {
      setError('Failed to toggle content status');
    }
  };

  if (loading && content.length === 0) {
    return <div className="text-center py-8">Loading content...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          {pageFilter ? `Content Management — ${pages.find(p => p.value === pageFilter)?.label}` : 'Content Management'}
        </h2>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New Content
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Content List */}
      <div className="grid gap-4">
        {(pageFilter ? content.filter(item => item.page === pageFilter) : content).map((item) => (
          <div
            key={item._id}
            className={`border rounded-lg p-4 ${item.isActive ? 'bg-white' : 'bg-gray-50'}`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    {pages.find(p => p.value === item.page)?.label}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm font-medium text-gray-600">
                    {sections.find(s => s.value === item.section)?.label}
                  </span>
                  {!item.isActive && (
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                      Inactive
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  {item.title || 'Untitled Content'}
                </h3>
                {item.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {item.description}
                  </p>
                )}
                {item.items && item.items.length > 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    {item.items.length} item{item.items.length !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggle(item._id)}
                  className={`px-3 py-1 text-xs rounded ${
                    item.isActive
                      ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {item.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => handleEdit(item)}
                  className="bg-blue-100 text-blue-700 px-3 py-1 text-xs rounded hover:bg-blue-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="bg-red-100 text-red-700 px-3 py-1 text-xs rounded hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {editingContent ? 'Edit Content' : 'Add New Content'}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Page
                  </label>
                  <select
                    name="page"
                    value={form.page}
                    onChange={handleFormChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                    disabled={!!pageFilter}
                  >
                    <option value="">Select Page</option>
                    {pages.map(page => (
                      <option key={page.value} value={page.value}>
                        {page.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Section
                  </label>
                  <select
                    name="section"
                    value={form.section}
                    onChange={handleFormChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  >
                    <option value="">Select Section</option>
                    {sections.map(section => (
                      <option key={section.value} value={section.value}>
                        {section.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleFormChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    name="subtitle"
                    value={form.subtitle}
                    onChange={handleFormChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content (Rich Text)
                </label>
                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleFormChange}
                  rows="5"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Enter rich text content..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Button Text
                  </label>
                  <input
                    type="text"
                    name="buttonText"
                    value={form.buttonText}
                    onChange={handleFormChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Button Link
                  </label>
                  <input
                    type="text"
                    name="buttonLink"
                    value={form.buttonLink}
                    onChange={handleFormChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Secondary Button Text
                  </label>
                  <input
                    type="text"
                    name="secondaryButtonText"
                    value={form.secondaryButtonText}
                    onChange={handleFormChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Secondary Button Link
                  </label>
                  <input
                    type="text"
                    name="secondaryButtonLink"
                    value={form.secondaryButtonLink}
                    onChange={handleFormChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mt-2 w-32 h-32 object-cover rounded-lg"
                  />
                )}
              </div>

              {/* Social Links */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Social Links
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {Object.keys(form.socialLinks).map(platform => (
                    <div key={platform}>
                      <label className="block text-xs font-medium text-gray-600 mb-1 capitalize">
                        {platform}
                      </label>
                      <input
                        type="url"
                        value={form.socialLinks[platform]}
                        onChange={(e) => handleSocialLinkChange(platform, e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        placeholder={`${platform} URL`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Items Management */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Items (Events, Awards, etc.)
                  </label>
                  <button
                    type="button"
                    onClick={addItem}
                    className="bg-green-100 text-green-700 px-3 py-1 text-sm rounded hover:bg-green-200"
                  >
                    Add Item
                  </button>
                </div>
                {form.items.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Item {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Title"
                        value={item.title}
                        onChange={(e) => handleItemChange(index, 'title', e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Subtitle"
                        value={item.subtitle}
                        onChange={(e) => handleItemChange(index, 'subtitle', e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Date"
                        value={item.date}
                        onChange={(e) => handleItemChange(index, 'date', e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Time"
                        value={item.time}
                        onChange={(e) => handleItemChange(index, 'time', e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Venue"
                        value={item.venue}
                        onChange={(e) => handleItemChange(index, 'venue', e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Link"
                        value={item.link}
                        onChange={(e) => handleItemChange(index, 'link', e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Button Text"
                        value={item.buttonText}
                        onChange={(e) => handleItemChange(index, 'buttonText', e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                    <textarea
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      rows="2"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-2"
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={form.order}
                    onChange={handleFormChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={form.isActive}
                    onChange={(e) => setForm(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="mr-2"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Active
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : (editingContent ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}