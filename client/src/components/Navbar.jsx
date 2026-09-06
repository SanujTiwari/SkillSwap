import React, { useState, useRef, useEffect } from 'react';
import { useStore, DEMO_PERSONAS } from '../store/useStore.js';
import {
  Sparkles, Compass, Zap, Calendar, MessageSquare,
  Users, Award, User, Flame, ChevronDown, Check,
  LogIn, UserPlus, LogOut, Menu, X
} from 'lucide-react';

export default function Navbar() {
  const {
    activeTab, setActiveTab, currentUser, activeDemoPersona,
    switchDemoPersona, setAuthModalOpen, logoutUser, authToken, showToast
  } = useStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navItems = [
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'roadmaps', label: 'Roadmaps', icon: Zap },
    { id: 'sessions', label: 'Sessions', icon: Calendar },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'mentors', label: 'Mentors', icon: Award },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-surface-DEFAULT/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">

          {/* ── Brand ── */}
          <div
            onClick={() => setActiveTab('discover')}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="h-9 w-9 rounded-lg bg-primary-600/20 border border-primary-500/30 flex items-center justify-center group-hover:bg-primary-600/30 transition-all duration-200">
              <Sparkles className="w-4.5 h-4.5 text-primary-400" />
            </div>
            <div className="hidden sm:block">
              <span className="font-heading font-bold text-lg text-white group-hover:text-primary-300 transition-colors leading-none">
                Skill<span className="text-primary-400">Swap</span>
              </span>
              <span className="block text-[10px] font-mono text-gray-500 leading-none mt-0.5">
                Peer Marketplace
              </span>
            </div>
          </div>

          {/* ── Desktop Navigation ── */}
          <nav className="hidden lg:flex items-center gap-1 bg-surface-raised/60 p-1 rounded-xl border border-white/[0.04]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-600/15 text-primary-300 font-semibold'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-primary-400' : ''}`} />
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-primary-500" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* ── Right Section ── */}
          <div className="flex items-center gap-2.5 shrink-0">

            {/* Gamification Stats Badge */}
            <div className="hidden xl:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-surface-raised/60 border border-white/[0.04] text-xs">
              <div className="flex items-center gap-1 text-accent-400 font-semibold">
                <Flame className="w-3.5 h-3.5" />
                <span>{currentUser?.profile?.learningStreak || 12}d</span>
              </div>
              <div className="w-px h-3.5 bg-gray-700" />
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded-md bg-primary-600/20 text-primary-300 font-mono text-[10px] font-bold">
                  Lv.{currentUser?.profile?.level || 4}
                </span>
                <span className="text-gray-400 font-mono font-medium">
                  {currentUser?.profile?.totalXp || 850} XP
                </span>
              </div>
            </div>

            {/* Auth Buttons */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                id="btn-login"
                onClick={() => setAuthModalOpen(true, 'login')}
                className="btn-secondary !px-3 !py-1.5 !text-xs !rounded-lg flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5 text-primary-400" />
                <span>Log In</span>
              </button>

              <button
                id="btn-signup"
                onClick={() => setAuthModalOpen(true, 'signup')}
                className="btn-primary !px-3.5 !py-1.5 !text-xs !rounded-lg flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Sign Up</span>
              </button>
            </div>

            {/* Demo Persona Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                id="demo-persona-toggle"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-surface-raised/60 hover:bg-surface-overlay border border-white/[0.04] hover:border-white/[0.08] transition-all group"
              >
                <img
                  src={activeDemoPersona.avatar}
                  alt={activeDemoPersona.name}
                  className="w-7 h-7 rounded-md border border-primary-500/20 bg-surface-DEFAULT object-cover"
                />
                <div className="hidden md:block text-left">
                  <span className="block text-xs font-semibold text-white leading-none">
                    {activeDemoPersona.name}
                  </span>
                  <span className="block text-[10px] text-primary-400 font-mono leading-none mt-0.5">
                    {activeDemoPersona.role}
                  </span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-surface-raised border border-white/[0.08] rounded-xl shadow-elevated z-50 overflow-hidden animate-slide-down">
                  {/* Dropdown Header */}
                  <div className="px-4 py-3 border-b border-white/[0.06]">
                    <span className="text-[10px] font-mono text-primary-400 uppercase tracking-wider font-bold">
                      Demo Persona
                    </span>
                    <span className="text-xs text-gray-500 block mt-0.5">
                      Test the app as different users
                    </span>
                  </div>

                  {/* Persona List */}
                  <div className="py-1">
                    {DEMO_PERSONAS.map((persona) => {
                      const isSelected = activeDemoPersona.id === persona.id;
                      return (
                        <button
                          key={persona.id}
                          onClick={() => {
                            switchDemoPersona(persona);
                            setDropdownOpen(false);
                            showToast(`Switched to ${persona.name}`, 'success');
                          }}
                          className={`w-full px-4 py-2.5 flex items-center justify-between text-left transition-colors ${
                            isSelected
                              ? 'bg-primary-600/10 border-l-2 border-primary-500'
                              : 'hover:bg-white/[0.03] border-l-2 border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={persona.avatar}
                              alt={persona.name}
                              className="w-8 h-8 rounded-md bg-surface-DEFAULT border border-gray-700"
                            />
                            <div>
                              <span className={`block text-xs font-semibold ${isSelected ? 'text-primary-300' : 'text-white'}`}>
                                {persona.name}
                              </span>
                              <span className="block text-[10px] text-gray-500 font-mono">
                                {persona.role}
                              </span>
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-primary-400" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Auth Action */}
                  <div className="p-2 border-t border-white/[0.06]">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        setAuthModalOpen(true, 'login');
                      }}
                      className="w-full py-2 px-3 rounded-lg text-xs text-primary-400 hover:bg-white/[0.04] flex items-center gap-2 font-medium transition-colors"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Login / Register</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-white/[0.04] text-gray-400"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Navigation ── */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/[0.06] bg-surface-DEFAULT/95 backdrop-blur-xl animate-slide-down">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary-600/15 text-primary-300'
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-primary-400' : ''}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Auth Buttons */}
          <div className="px-4 pb-4 pt-2 border-t border-white/[0.06] flex gap-2">
            <button
              onClick={() => { setAuthModalOpen(true, 'login'); setMobileMenuOpen(false); }}
              className="flex-1 btn-secondary !text-xs flex items-center justify-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Log In</span>
            </button>
            <button
              onClick={() => { setAuthModalOpen(true, 'signup'); setMobileMenuOpen(false); }}
              className="flex-1 btn-primary !text-xs flex items-center justify-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Sign Up</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}