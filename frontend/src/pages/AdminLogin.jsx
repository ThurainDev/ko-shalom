import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BACKEND_URL } from '../utils/api';

export default function AdminLogin() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(`${BACKEND_URL}/api/admin/login`, { username, password });
      login(res.data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      <form onSubmit={handleSubmit} className="bg-slate-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-200">Admin Login</h2>
        {error && <div className="mb-4 text-red-400 text-center">{error}</div>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded bg-slate-700 text-white focus:outline-none"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full mb-6 px-4 py-2 rounded bg-slate-700 text-white focus:outline-none"
          required
        />
        <button type="submit" className="w-full py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded hover:from-blue-500 hover:to-blue-600 transition-all">Login</button>
      </form>
    </div>
  );
} 