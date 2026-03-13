import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Lock, Mail, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import LanguageToggle from '@/components/shared/LanguageToggle';

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('admin@gms.com');
  const [password, setPassword] = useState('password123');

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      login({ name: 'Admin User', email });
      setLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Language Switcher */}
      <div className="absolute top-8 right-8 z-50">
        <LanguageToggle />
      </div>

      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-[450px] space-y-8 relative">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white text-3xl font-black mx-auto shadow-2xl shadow-primary/30">
            G
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">{t('auth:gmsAdmin')}</h1>
          <p className="text-muted text-sm font-medium">{t('auth:gmsSubtitle')}</p>
        </div>

        {/* Login Form */}
        <div className="glass-card p-8 border-white/5 bg-white/5 backdrop-blur-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted uppercase tracking-widest pl-1">{t('auth:emailAddress')}</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface/50 border border-border rounded-xl pl-12 pr-4 py-3 text-sm text-white outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-smooth"
                  placeholder="admin@gms.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center pl-1">
                <label className="text-xs font-bold text-muted uppercase tracking-widest">{t('auth:password')}</label>
                <a href="#" className="text-[10px] text-primary font-bold hover:underline">{t('auth:forgotPassword')}</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface/50 border border-border rounded-xl pl-12 pr-12 py-3 text-sm text-white outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-smooth"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-smooth"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pl-1 select-none cursor-pointer group">
              <input type="checkbox" id="remember" className="w-4 h-4 rounded border-border bg-surface text-primary" />
              <label htmlFor="remember" className="text-xs text-muted group-hover:text-white transition-smooth">{t('auth:keepMeLoggedIn')}</label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-4 rounded-xl font-black text-sm shadow-2xl shadow-primary/30 hover:bg-primary/90 transition-smooth flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  {t('auth:signIn')}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-smooth" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted">
          {t('auth:noAccount')} <span className="text-primary font-bold cursor-pointer hover:underline">{t('auth:contactSupport')}</span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
