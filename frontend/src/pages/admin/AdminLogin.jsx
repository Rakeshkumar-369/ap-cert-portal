import { useState, useEffect } from 'react';
import { Shield, Mail, Lock, Eye, EyeOff, RefreshCw, AlertCircle } from 'lucide-react';
import { authAPI } from '../../services/api';

const AdminLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [captcha, setCaptcha] = useState(null); // { id, svg }
  const [captchaText, setCaptchaText] = useState('');
  const [captchaLoading, setCaptchaLoading] = useState(false);

 const fetchCaptcha = async () => {
  setCaptchaLoading(true);
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/captcha`);
    const data = await res.json();
    setCaptcha({ id: data.data.id, svg: data.data.svg });
    setCaptchaText('');
  } catch (err) {
    console.error('Captcha fetch error:', err);
  } finally {
    setCaptchaLoading(false);
  }
};

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCaptcha();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }

    if (!captchaText || !captcha?.id) {
      setError('Please enter the captcha');
      setLoading(false);
      return;
    }

    try {
      const res = await authAPI.login(email, password, captcha.id, captchaText);

      const token = res.data[0].accessToken;
      const user = res.data[0].user;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      if (onLogin) {
        onLogin({ success: true, token, user });
      }
    } catch (err) {
      let message = err.message || 'Login failed. Please check your credentials.';

      // Show captcha-specific error messages clearly
      if (err.status === 400) {
        if (message === 'Login failed. Please check your credentials.' && err.message) {
          message = err.message;
        }
      } else if (message === 'Failed to fetch') {
        message = 'Network error. Please check your connection.';
      }

      setError(message);
      fetchCaptcha(); // refresh captcha on failed attempt
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-ap-navy/10 mb-4">
            <Shield className="w-10 h-10 text-ap-navy" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-ap-navy">
            Admin Access
          </h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em] mt-2">
            AP-CERT Control Panel
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-red-600 text-sm font-semibold">{error}</p>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-ap-glow transition-colors"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-12 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-ap-glow transition-colors"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-ap-navy transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Captcha */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Captcha
              </label>
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-slate-50 rounded-lg p-1 flex-1 border border-slate-200">
                  {captchaLoading ? (
                    <div className="h-[50px] flex items-center justify-center text-gray-400 text-sm">
                      Loading...
                    </div>
                  ) : captcha ? (
                    <div dangerouslySetInnerHTML={{ __html: captcha.svg }} />
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={fetchCaptcha}
                  className="p-2 text-slate-400 hover:text-ap-navy transition-colors"
                  title="Refresh captcha"
                >
                  <RefreshCw size={20} className={captchaLoading ? 'animate-spin' : ''} />
                </button>
              </div>
              <input
                type="text"
                value={captchaText}
                onChange={(e) => setCaptchaText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-ap-glow transition-colors"
                placeholder="Enter captcha text"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ap-navy hover:bg-ap-navy/80 text-white py-3 rounded-lg font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
