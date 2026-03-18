import React, { useState } from 'react';
import axios from 'axios';
import { Cloud } from 'lucide-react';

const LoginScreen = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isRegister ? '/api/users/register' : '/api/users/login';
      const response = await axios.post(`https://meghaos.onrender.com${endpoint}`, {
        username,
        password
      });

      if (isRegister) {
        alert('Registration successful! Please login.');
        setIsRegister(false);
        setLoading(false);
      } else {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', response.data.username);
        onLogin(response.data.username);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0f111a] flex items-center justify-center p-4 font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Cloud className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-semibold text-white mb-2">
            {isRegister ? 'Join MeghOS' : 'Welcome Back'}
          </h2>
          <p className="text-gray-400 text-sm">
            {isRegister ? 'Create your cloud-powered account' : 'Sign in to Your Desktop in the Cloud'}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">Username</label>
            <input
              type="text"
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-sans"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
            <input
              type="password"
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-sans"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              isRegister ? 'Sign Up' : 'Sign In'
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <p className="text-gray-400 text-sm">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => { setIsRegister(!isRegister); setError(''); }}
              className="text-blue-400 hover:underline font-bold ml-1"
            >
              {isRegister ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>

      <div className="absolute bottom-6 left-6 flex items-center gap-4 text-gray-500 text-xs uppercase tracking-widest font-semibold">
        <span>Cloud</span>
        <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
        <span>Secure</span>
        <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
        <span>v1.2.0</span>
      </div>
    </div>
  );
};

export default LoginScreen;

