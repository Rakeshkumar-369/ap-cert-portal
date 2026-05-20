import { useState } from 'react';
import { Shield, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { authAPI } from '../services/api'; // adjust path

const AdminLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  if (!email || !password) {
    setError('Please enter both email and password');
    setLoading(false);
    return;
  }

  try {
    const res = await authAPI.login(email, password);

    // Extract token and user from API response
    const token = res.data[0].accessToken;
    const user = res.data[0].user;

    // Store in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    // Notify parent if provided
    if (onLogin) {
      onLogin({
        success: true,
        token,
        user,
      });
    }

  } catch (err) {
    const message =
      err.message === 'Failed to fetch'
        ? 'Network error. Please check your connection.'
        : err.message || 'Login failed. Please check your credentials.';

    setError(message);
    console.error('Login error:', err);

  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-[#0A162F] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-ap-gold/10 mb-4">
            <Shield className="w-10 h-10 text-ap-gold" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white">
            Admin Access
          </h1>
          <p className="text-ap-lavender text-xs font-bold uppercase tracking-[0.3em] mt-2">
            AP-CERT Control Panel
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-ap-navy/50 backdrop-blur-sm rounded-2xl border border-ap-purple/20 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ap-lavender mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0A162F] border border-ap-purple/30 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-ap-gold transition-colors"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ap-lavender mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0A162F] border border-ap-purple/30 rounded-lg pl-10 pr-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-ap-gold transition-colors"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-ap-gold transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ap-gold hover:bg-ap-gold/80 text-ap-navy py-3 rounded-lg font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-ap-navy border-t-transparent rounded-full animate-spin"></div>
                  Authenticating...
                </>
              ) : (
                'Login to Dashboard'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;