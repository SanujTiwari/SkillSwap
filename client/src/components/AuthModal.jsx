import React, { useState, useEffect } from 'react';
import { useStore, DEMO_PERSONAS } from '../store/useStore.js';
import { api } from '../lib/api.js';
import {
  Sparkles, Mail, Lock, User, Tag, ArrowRight, X,
  LogIn, UserPlus, ShieldCheck, Eye, EyeOff, Zap
} from 'lucide-react';

export default function AuthModal() {
  const {
    authModalOpen, authModalMode, setAuthModalOpen,
    setAuthToken, setCurrentUser, switchDemoPersona, showToast
  } = useStore();

  const [mode, setMode] = useState(authModalMode || 'login');
  const [showPassword, setShowPassword] = useState(false);

  // Login Form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form
  const [regFullName, setRegFullName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regHeadline, setRegHeadline] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Sync mode from store
  useEffect(() => {
    if (authModalMode) setMode(authModalMode);
  }, [authModalMode]);

  if (!authModalOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', {
        email: loginEmail,
        password: loginPassword
      });
      setAuthToken(res.data.token);
      setCurrentUser(res.data.user);
      showToast(`Welcome back, ${res.data.user?.profile?.fullName || 'User'}!`, 'success');
      setAuthModalOpen(false);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regEmail || !regPassword || !regFullName || !regUsername) {
      setErrorMsg('Please complete all required fields.');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await api.post('/auth/register', {
        fullName: regFullName,
        username: regUsername,
        email: regEmail,
        password: regPassword,
        headline: regHeadline || 'SkillSwap Community Member'
      });
      setAuthToken(res.data.token);
      setCurrentUser(res.data.user);
      showToast(`Account created! Welcome to SkillSwap, ${regFullName}!`, 'success');
      setAuthModalOpen(false);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = (persona) => {
    switchDemoPersona(persona);
    showToast(`Logged in as ${persona.name}`, 'success');
    setAuthModalOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && setAuthModalOpen(false)}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-surface-raised border border-white/[0.08] rounded-2xl shadow-elevated animate-scale-in overflow-hidden">
        
        {/* Decorative gradient top bar */}
        <div className="h-1 bg-gradient-to-r from-primary-500 via-teal-400 to-accent-400" />

        <div className="p-6 sm:p-8 space-y-5">
          {/* Close */}
          <button
            onClick={() => setAuthModalOpen(false)}
            className="absolute top-5 right-5 p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary-600/15 border border-primary-500/25 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-white">
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h3>
              <p className="text-xs text-gray-500">
                {mode === 'login' ? 'Sign in to continue' : 'Join the peer learning community'}
              </p>
            </div>
          </div>

          {/* Mode Tabs */}
          <div className="grid grid-cols-2 p-1 bg-surface-DEFAULT rounded-xl border border-white/[0.04]">
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMsg(''); }}
              className={`py-2 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                mode === 'login'
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Log In</span>
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setErrorMsg(''); }}
              className={`py-2 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                mode === 'signup'
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Sign Up</span>
            </button>
          </div>

          {/* Error */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-danger-500/10 border border-danger-500/20 text-danger-400 text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ── LOGIN FORM ── */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 font-medium mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="input-field !pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 font-medium mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field !pl-10 !pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary !py-3 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{loading ? 'Signing in...' : 'Sign In'}</span>
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          ) : (
            /* ── SIGNUP FORM ── */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 font-medium mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="Alex Rivera"
                    className="input-field !py-2.5 !text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-medium mb-1.5">Username</label>
                  <input
                    type="text"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="alex_rivera"
                    className="input-field !py-2.5 !text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 font-medium mb-1.5">Email</label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="input-field !py-2.5 !text-xs"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 font-medium mb-1.5">Headline / Role</label>
                <input
                  type="text"
                  value={regHeadline}
                  onChange={(e) => setRegHeadline(e.target.value)}
                  placeholder="Full-Stack Developer | React & Python"
                  className="input-field !py-2.5 !text-xs"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 font-medium mb-1.5">Password</label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="input-field !py-2.5 !text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary !py-3 flex items-center justify-center gap-2 disabled:opacity-50 mt-1"
              >
                <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          )}

          {/* ── Quick Demo Login ── */}
          <div className="pt-4 border-t border-white/[0.06]">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-3.5 h-3.5 text-accent-400" />
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider font-semibold">
                Quick Demo Login
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_PERSONAS.map((persona) => (
                <button
                  key={persona.id}
                  type="button"
                  onClick={() => handleQuickDemoLogin(persona)}
                  className="p-2.5 rounded-xl bg-surface-DEFAULT border border-white/[0.04] hover:border-primary-500/30 text-left flex items-center gap-2.5 transition-all hover:bg-white/[0.02] group"
                >
                  <img
                    src={persona.avatar}
                    alt={persona.name}
                    className="w-7 h-7 rounded-md bg-surface-raised border border-gray-700 group-hover:border-primary-500/30"
                  />
                  <div className="overflow-hidden">
                    <span className="block text-[11px] font-semibold text-white truncate group-hover:text-primary-300 transition-colors">
                      {persona.name}
                    </span>
                    <span className="block text-[9px] text-gray-500 font-mono truncate">
                      {persona.role}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
