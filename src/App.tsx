import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Sparkles, Code2, Users, Calendar, Award, ShieldCheck, ArrowRight } from 'lucide-react';

function LandingPlaceholder() {
  const [dbStatus, setDbStatus] = useState<'loading' | 'connected' | 'error'>('loading');

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'ok') setDbStatus('connected');
        else setDbStatus('error');
      })
      .catch(() => setDbStatus('error'));
  }, []);

  return (
    <div className="min-h-screen bg-bg-darkest text-brandText-primary flex flex-col justify-between selection:bg-primary/30">
      {/* Header / Navbar */}
      <header className="border-b border-surface-border/60 bg-bg-dark/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-glow-teal">
              <Sparkles className="w-5 h-5 text-bg-darkest" />
            </div>
            <span className="font-heading font-bold text-2xl tracking-tight text-white">
              Skill<span className="text-primary-light">Swap</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-brandText-secondary">
            <a href="#discover" className="hover:text-primary-light transition-colors">Discover</a>
            <a href="#how-it-works" className="hover:text-primary-light transition-colors">How It Works</a>
            <a href="#ai-coach" className="hover:text-primary-light transition-colors">AI Coach</a>
            <a href="#mentors" className="hover:text-primary-light transition-colors">Mentors</a>
            <a href="#pricing" className="hover:text-primary-light transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center space-x-4">
            <button className="text-sm font-semibold text-brandText-secondary hover:text-white px-4 py-2 transition-colors">
              Log In
            </button>
            <button className="text-sm font-semibold bg-gradient-to-r from-primary to-secondary hover:opacity-95 text-bg-darkest px-5 py-2.5 rounded-xl shadow-glow-teal transition-all transform active:scale-95">
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 flex flex-col justify-center">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-surface-card border border-surface-border text-primary-light text-xs font-semibold uppercase tracking-wider shadow-inner">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Peer Learning Marketplace</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Turn what you know into <br />
            <span className="bg-gradient-to-r from-primary-light via-secondary to-accent bg-clip-text text-transparent">
              what you want to learn.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-brandText-muted leading-relaxed max-w-2xl mx-auto">
            SkillSwap connects you with verified mentors & peers to exchange skills, build AI learning roadmaps, and schedule 1:1 interactive sessions.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto text-base font-bold bg-gradient-to-r from-primary to-secondary text-bg-darkest px-8 py-4 rounded-xl shadow-glow-teal hover:shadow-glow-cyan transition-all flex items-center justify-center space-x-2">
              <span>Find Your Match</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="w-full sm:w-auto text-base font-semibold bg-surface-card border border-surface-border hover:bg-surface-hover text-brandText-primary px-8 py-4 rounded-xl transition-all">
              Explore Skills
            </button>
          </div>
        </div>

        {/* Database Status Pill */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-3 px-5 py-2.5 rounded-2xl bg-surface-card/80 border border-surface-border text-xs font-mono">
            <span className="text-brandText-muted">Database Engine (Neon PostgreSQL):</span>
            {dbStatus === 'loading' && (
              <span className="text-amber-400 animate-pulse">Connecting...</span>
            )}
            {dbStatus === 'connected' && (
              <span className="text-emerald-400 flex items-center space-x-1">
                <ShieldCheck className="w-4 h-4 inline" />
                <span>Connected & Ready</span>
              </span>
            )}
            {dbStatus === 'error' && (
              <span className="text-rose-400">Offline / Standby</span>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-border/60 bg-bg-dark py-8 text-center text-xs text-brandText-dim">
        <p>© 2026 SkillSwap Inc. Learn faster. Teach smarter. Grow together.</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPlaceholder />} />
      </Routes>
    </Router>
  );
}
