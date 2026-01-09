import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import AboutContentManager from '../components/admin/AboutContentManager';
import ContentManager from '../components/admin/ContentManager';
import HomeContentManager from '../components/admin/HomeContentManager';
import ImageTest from '../components/admin/ImageTest';
import { useAuth } from '../context/AuthContext';
import { uploadsPath, resolveImage, BACKEND_URL } from '../utils/api';

export default function AdminDashboard() {
  const { token, logout, isAuthenticated, initialized } = useAuth();
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState({ title: '', type: 'album', releaseDate: '', price: '', description: '', tracks: [] });
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('about-content');
  const [contacts, setContacts] = useState([]);
  const [contactsError, setContactsError] = useState('');
  const [contactsLoading, setContactsLoading] = useState(false);
  const [visitStats, setVisitStats] = useState({ total: 0, last7: [] });
  const [visitStatsError, setVisitStatsError] = useState('');
  const [visitStatsLoading, setVisitStatsLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!initialized) return;
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    if (activeTab === 'products') fetchProducts();
    if (activeTab === 'contacts') fetchContacts();
    if (activeTab === 'analytics') fetchVisitStats();
    // eslint-disable-next-line
  }, [initialized, isAuthenticated, activeTab, token]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/admin/products`, { headers: { Authorization: `Bearer ${token}` } });
      setProducts(res.data);
    } catch (err) {
      setError('Failed to fetch products');
    }
  };

  const fetchContacts = async () => {
    setContactsLoading(true);
    setContactsError('');
    try {
      const res = await axios.get(`${BACKEND_URL}/api/admin/contacts`, { headers: { Authorization: `Bearer ${token}` } });
      setContacts(res.data);
    } catch (err) {
      setContactsError('Failed to fetch contact submissions');
    } finally {
      setContactsLoading(false);
    }
  };

  const fetchVisitStats = async () => {
    setVisitStatsLoading(true);
    setVisitStatsError('');
    try {
      const res = await axios.get(`${BACKEND_URL}/api/admin/visits`, { headers: { Authorization: `Bearer ${token}` } });
      setVisitStats(res.data);
    } catch (err) {
      setVisitStatsError('Failed to fetch site traffic stats');
    } finally {
      setVisitStatsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axios.delete(`${BACKEND_URL}/api/admin/products/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      setError('Delete failed');
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setForm({ ...product });
    setImagePreview(product.image ? resolveImage(product.image) : null);
    setImageFile(null);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditProduct(null);
    setForm({ title: '', type: 'album', releaseDate: '', price: '', description: '', tracks: [] });
    setImagePreview(null);
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
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTrackChange = (i, field, value) => {
    const tracks = [...form.tracks];
    tracks[i][field] = value;
    setForm({ ...form, tracks });
  };

  const addTrack = () => {
    setForm({ ...form, tracks: [...form.tracks, { title: '', duration: '', audioFile: null }] });
  };

  const removeTrack = (i) => {
    const tracks = [...form.tracks];
    tracks.splice(i, 1);
    setForm({ ...form, tracks });
  };

  const handleTrackAudioChange = (i, file) => {
    const tracks = [...form.tracks];
    tracks[i].audioFile = file;
    if (file) {
      const audio = document.createElement('audio');
      audio.preload = 'metadata';
      audio.onloadedmetadata = () => {
        const duration = audio.duration;
        const min = Math.floor(duration / 60);
        const sec = Math.round(duration % 60).toString().padStart(2, '0');
        tracks[i].duration = `${min}:${sec}`;
        setForm({ ...form, tracks });
      };
      audio.src = URL.createObjectURL(file);
      tracks[i].audio = undefined;
    } else {
      tracks[i].duration = '';
      setForm({ ...form, tracks });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'tracks') {
          // Fix: Include 'audio' in the map so existing audio links are preserved
          const tracksToSend = value.map(({ title, duration, audio }, idx) => ({ title, duration, audio }));
          formData.append('tracks', JSON.stringify(tracksToSend));
          value.forEach((track, idx) => {
            if (track.audioFile) {
              formData.append(`trackAudio${idx}`, track.audioFile);
            }
          });
        } else {
          formData.append(key, value);
        }
      });
      if (imageFile) {
        formData.append('image', imageFile);
      }
      const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } };
      if (editProduct) {
        await axios.put(`${BACKEND_URL}/api/admin/products/${editProduct._id}`, formData, config);
      } else {
        await axios.post(`${BACKEND_URL}/api/admin/products`, formData, config);
      }
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      setError('Save failed');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
      {/* Admin Navbar */}
      <nav className="bg-slate-800/80 backdrop-blur-sm border-b border-blue-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-blue-200">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-500 hover:to-blue-600 transition-all duration-300 border border-blue-500/30"
              >
                ← Back to Home
              </Link>
              <button 
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition-all duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Site Traffic Card */}
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-700/80 to-blue-900/80 rounded-lg shadow-lg p-6 border border-blue-500/30 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-blue-100">Total Site Visits</h3>
              <span className="text-3xl font-bold text-blue-200">{visitStatsLoading ? '...' : visitStats.total}</span>
            </div>
            <div className="text-blue-300 text-sm">All time</div>
            {visitStatsError && <div className="text-red-400 mt-2">{visitStatsError}</div>}
          </div>
          <div className="bg-slate-800/60 rounded-lg shadow-lg p-6 border border-blue-500/20">
            <h3 className="text-lg font-semibold text-blue-100 mb-2">Visits (Last 7 Days)</h3>
            {visitStatsLoading ? (
              <div className="text-blue-200">Loading...</div>
            ) : visitStats.last7 && visitStats.last7.length > 0 ? (
              <table className="w-full text-blue-200 text-sm">
                <thead>
                  <tr>
                    <th className="text-left py-1">Date</th>
                    <th className="text-left py-1">Visits</th>
                  </tr>
                </thead>
                <tbody>
                  {visitStats.last7.slice().reverse().map(day => (
                    <tr key={day._id}>
                      <td className="py-1">{day._id}</td>
                      <td className="py-1 font-bold">{day.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-blue-300">No data</div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 pt-8 flex space-x-4">
        <button
          className={`px-6 py-2 rounded-t-lg font-semibold border-b-2 transition-all duration-300 ${activeTab === 'about-content' ? 'border-blue-400 text-blue-200 bg-slate-800/60' : 'border-transparent text-blue-300 bg-slate-700/30 hover:text-white'}`}
          onClick={() => setActiveTab('about-content')}
        >
          About Content
        </button>
        <button
          className={`px-6 py-2 rounded-t-lg font-semibold border-b-2 transition-all duration-300 ${activeTab === 'home-content' ? 'border-blue-400 text-blue-200 bg-slate-800/60' : 'border-transparent text-blue-300 bg-slate-700/30 hover:text-white'}`}
          onClick={() => setActiveTab('home-content')}
        >
          Home Content
        </button>
        <button
          className={`px-6 py-2 rounded-t-lg font-semibold border-b-2 transition-all duration-300 ${activeTab === 'products' ? 'border-blue-400 text-blue-200 bg-slate-800/60' : 'border-transparent text-blue-300 bg-slate-700/30 hover:text-white'}`}
          onClick={() => setActiveTab('products')}
        >
          Products
        </button>
        <button
          className={`px-6 py-2 rounded-t-lg font-semibold border-b-2 transition-all duration-300 ${activeTab === 'contacts' ? 'border-blue-400 text-blue-200 bg-slate-800/60' : 'border-transparent text-blue-300 bg-slate-700/30 hover:text-white'}`}
          onClick={() => setActiveTab('contacts')}
        >
          Contact Submissions
        </button>
        <button
          className={`px-6 py-2 rounded-t-lg font-semibold border-b-2 transition-all duration-300 ${activeTab === 'analytics' ? 'border-blue-400 text-blue-200 bg-slate-800/60' : 'border-transparent text-blue-300 bg-slate-700/30 hover:text-white'}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
        <button
          className={`px-6 py-2 rounded-t-lg font-semibold border-b-2 transition-all duration-300 ${activeTab === 'image-test' ? 'border-blue-400 text-blue-200 bg-slate-800/60' : 'border-transparent text-blue-300 bg-slate-700/30 hover:text-white'}`}
          onClick={() => setActiveTab('image-test')}
        >
          Image Test
        </button>
      </div>

      {/* Main Content */}
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* About Content Management Tab */}
          {activeTab === 'about-content' && (
            <AboutContentManager token={token} />
          )}

          {/* Home Content Management Tab */}
          {activeTab === 'home-content' && (
            <div className="bg-slate-800/60 rounded-lg p-4 border border-blue-500/20">
              <h2 className="text-2xl font-bold text-blue-200 mb-4">Home Page Content</h2>
              <p className="text-blue-300 mb-4">Manage sections on the Home page (Hero, About, Events, Contact, Footer).</p>
              <HomeContentManager token={token} />
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <>
              {/* Header Section */}
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-blue-200 mb-2">Product Management</h2>
                  <p className="text-blue-300">Manage your music catalog and releases</p>
                </div>
                <button 
                  onClick={handleAdd} 
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-500 hover:to-blue-600 transition-all duration-300 border border-blue-500/30 font-semibold"
                >
                  + Add Product
                </button>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mb-6 p-4 bg-red-900/50 border border-red-500/30 rounded-lg text-red-200">
                  {error}
                </div>
              )}

              {/* Products Table */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg shadow-xl border border-blue-500/20 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-700/50">
                      <tr className="text-blue-200">
                        <th className="p-4 text-left font-semibold">Image</th>
                        <th className="p-4 text-left font-semibold">Title</th>
                        <th className="p-4 text-left font-semibold">Type</th>
                        <th className="p-4 text-left font-semibold">Release</th>
                        <th className="p-4 text-left font-semibold">Price</th>
                        <th className="p-4 text-left font-semibold">Tracks</th>
                        <th className="p-4 text-left font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product, index) => (
                        <tr key={product._id} className={`border-t border-blue-900/30 ${index % 2 === 0 ? 'bg-slate-800/30' : 'bg-slate-700/30'}`}>
                          <td className="p-4">
                            {product.image ? (
                              <img src={resolveImage(product.image)} alt={product.title} className="w-16 h-16 object-cover rounded" />
                            ) : (
                              <div className="w-16 h-16 bg-slate-700 rounded flex items-center justify-center text-blue-300/60 text-2xl">♪</div>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="font-semibold text-blue-100">{product.title}</div>
                            <div className="text-sm text-blue-300 mt-1">{product.description.substring(0, 50)}...</div>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              product.type === 'album' ? 'bg-blue-600/30 text-blue-200' :
                              product.type === 'ep' ? 'bg-green-600/30 text-green-200' :
                              product.type === 'single' ? 'bg-purple-600/30 text-purple-200' :
                              'bg-orange-600/30 text-orange-200'
                            }`}>
                              {product.type.toUpperCase()}
                            </span>
                          </td>
                          <td className="p-4 text-blue-200">{product.releaseDate}</td>
                          <td className="p-4 font-semibold text-blue-200">{product.price}</td>
                          <td className="p-4">
                            <div className="text-sm text-blue-300">
                              {product.tracks?.length || 0} tracks
                            </div>
                            <div className="text-xs text-blue-400 mt-1">
                              {product.tracks?.slice(0, 2).map((t, i) => (
                                <div key={i}>{t.title}</div>
                              ))}
                              {product.tracks?.length > 2 && <div>+{product.tracks.length - 2} more</div>}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => handleEdit(product)} 
                                className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-500 transition-colors text-sm"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDelete(product._id)} 
                                className="px-3 py-1 bg-red-600 rounded hover:bg-red-500 transition-colors text-sm"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Empty State */}
              {products.length === 0 && !error && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4 text-blue-300/40">♪</div>
                  <h3 className="text-xl font-semibold text-blue-200 mb-2">No Products Yet</h3>
                  <p className="text-blue-300 mb-4">Start by adding your first music product</p>
                  <button 
                    onClick={handleAdd}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-500 hover:to-blue-600 transition-all duration-300"
                  >
                    Add Your First Product
                  </button>
                </div>
              )}
            </>
          )}

          {/* Contact Submissions Tab */}
          {activeTab === 'contacts' && (
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg shadow-xl border border-blue-500/20 overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-blue-200 mb-4">Contact Submissions</h2>
                {contactsLoading ? (
                  <div className="text-blue-200 py-8 text-center">Loading contact submissions...</div>
                ) : contactsError ? (
                  <div className="text-red-400 py-8 text-center">{contactsError}</div>
                ) : contacts.length === 0 ? (
                  <div className="text-blue-300 py-8 text-center">No contact submissions yet.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-700/50">
                        <tr className="text-blue-200">
                          <th className="p-3 text-left font-semibold">Name</th>
                          <th className="p-3 text-left font-semibold">Email</th>
                          <th className="p-3 text-left font-semibold">Subject</th>
                          <th className="p-3 text-left font-semibold">Type</th>
                          <th className="p-3 text-left font-semibold">Message</th>
                          <th className="p-3 text-left font-semibold">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contacts.map((c, i) => (
                          <tr key={c._id} className={`border-t border-blue-900/30 ${i % 2 === 0 ? 'bg-slate-800/30' : 'bg-slate-700/30'}`}>
                            <td className="p-3 text-blue-100">{c.name}</td>
                            <td className="p-3 text-blue-200">{c.email}</td>
                            <td className="p-3 text-blue-200">{c.subject}</td>
                            <td className="p-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                c.type === 'general' ? 'bg-blue-600/30 text-blue-200' :
                                c.type === 'booking' ? 'bg-green-600/30 text-green-200' :
                                c.type === 'press' ? 'bg-purple-600/30 text-purple-200' :
                                'bg-orange-600/30 text-orange-200'
                              }`}>
                                {c.type.charAt(0).toUpperCase() + c.type.slice(1)}
                              </span>
                            </td>
                            <td className="p-3 text-blue-100 whitespace-pre-line">{c.message}</td>
                            <td className="p-3 text-blue-300">{new Date(c.date).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg shadow-xl border border-blue-500/20 overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-blue-200 mb-4">Site Analytics</h2>
                {visitStatsLoading ? (
                  <div className="text-blue-200 py-8 text-center">Loading analytics...</div>
                ) : visitStatsError ? (
                  <div className="text-red-400 py-8 text-center">{visitStatsError}</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-700/50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-blue-200 mb-4">Total Visits</h3>
                      <div className="text-4xl font-bold text-blue-100">{visitStats.total}</div>
                      <p className="text-blue-300 text-sm mt-2">All time visits</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-blue-200 mb-4">Recent Activity</h3>
                      {visitStats.last7 && visitStats.last7.length > 0 ? (
                        <div className="space-y-2">
                          {visitStats.last7.slice().reverse().map((day, index) => (
                            <div key={day._id} className="flex justify-between items-center">
                              <span className="text-blue-200">{day._id}</span>
                              <span className="text-blue-100 font-semibold">{day.count} visits</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-blue-300">No recent data</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Image Test Tab */}
          {activeTab === 'image-test' && (
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg shadow-xl border border-blue-500/20 overflow-hidden">
              <ImageTest token={token} />
            </div>
          )}
        </div>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <form onSubmit={handleFormSubmit} className="bg-slate-800 p-8 rounded-lg shadow-xl w-full max-w-2xl relative border border-blue-500/20" encType="multipart/form-data">
            <button 
              type="button" 
              onClick={() => setShowForm(false)} 
              className="absolute top-4 right-4 text-blue-200 hover:text-white text-xl"
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold mb-6 text-blue-200">{editProduct ? 'Edit' : 'Add'} Product</h3>
            
            {/* Image Upload */}
            <div className="mb-4">
              <label className="block text-blue-200 font-semibold mb-2">Product Image</label>
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded mb-2" />
              ) : (
                <div className="w-32 h-32 bg-slate-700 rounded flex items-center justify-center text-blue-300/60 text-3xl mb-2">♪</div>
              )}
              <input type="file" accept="image/*" onChange={handleImageChange} className="block mt-2 text-blue-100" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input 
                name="title" 
                value={form.title} 
                onChange={handleFormChange} 
                placeholder="Title" 
                className="w-full px-4 py-2 rounded bg-slate-700 text-white border border-blue-500/30 focus:border-blue-400 focus:outline-none" 
                required 
              />
              <select 
                name="type" 
                value={form.type} 
                onChange={handleFormChange} 
                className="w-full px-4 py-2 rounded bg-slate-700 text-white border border-blue-500/30 focus:border-blue-400 focus:outline-none"
              >
                <option value="album">Album</option>
                <option value="ep">EP</option>
                <option value="single">Single</option>
                <option value="live">Live</option>
              </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input 
                name="releaseDate" 
                value={form.releaseDate} 
                onChange={handleFormChange} 
                placeholder="Release Date" 
                className="w-full px-4 py-2 rounded bg-slate-700 text-white border border-blue-500/30 focus:border-blue-400 focus:outline-none" 
                required 
              />
              <input 
                name="price" 
                value={form.price} 
                onChange={handleFormChange} 
                placeholder="Price" 
                className="w-full px-4 py-2 rounded bg-slate-700 text-white border border-blue-500/30 focus:border-blue-400 focus:outline-none" 
                required 
              />
            </div>
            
            <textarea 
              name="description" 
              value={form.description} 
              onChange={handleFormChange} 
              placeholder="Description" 
              className="w-full mb-4 px-4 py-2 rounded bg-slate-700 text-white border border-blue-500/30 focus:border-blue-400 focus:outline-none h-24" 
              required 
            />
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-blue-200 font-semibold">Tracks</span>
                <button 
                  type="button" 
                  onClick={addTrack} 
                  className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-500 text-white text-sm"
                >
                  + Add Track
                </button>
              </div>
              {form.tracks.map((track, i) => (
                <div key={i} className="flex flex-col md:flex-row gap-2 mb-2 items-center">
                  <input 
                    value={track.title} 
                    onChange={e => handleTrackChange(i, 'title', e.target.value)} 
                    placeholder="Track Title" 
                    className="flex-1 px-3 py-2 rounded bg-slate-700 text-white border border-blue-500/30 focus:border-blue-400 focus:outline-none" 
                    required 
                  />
                  <input 
                    type="file"
                    accept="audio/*"
                    onChange={e => handleTrackAudioChange(i, e.target.files[0])}
                    className="w-48 px-3 py-2 rounded bg-slate-700 text-white border border-blue-500/30 focus:border-blue-400 focus:outline-none"
                    required={!editProduct && !track.audio}
                  />
                  {editProduct && track.audio && !track.audioFile && (
                    <a
                      href={uploadsPath(track.audio)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 underline text-xs ml-2"
                    >
                      Existing Audio
                    </a>
                  )}
                  <span className="text-blue-300 text-sm min-w-[60px] text-center">{track.duration || '--:--'}</span>
                  <button 
                    type="button" 
                    onClick={() => removeTrack(i)} 
                    className="px-3 py-2 bg-red-600 rounded hover:bg-red-500 text-white"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                type="button" 
                onClick={() => setShowForm(false)}
                className="px-6 py-2 border border-blue-400 text-blue-100 rounded hover:bg-blue-400 hover:text-slate-900 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded hover:from-blue-500 hover:to-blue-600 transition-all duration-300"
              >
                {editProduct ? 'Update' : 'Create'} Product
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}