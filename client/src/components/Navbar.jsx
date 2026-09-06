import React, { useState } from 'react';
import { useStore, DEMO_PERSONAS } from '../store/useStore.js';
import { Sparkles, Compass, Zap, Calendar, MessageSquare, Users, Award, User, Flame, ChevronDown, Check } from 'lucide-react';

export default function Navbar() {
  const { activeTab, setActiveTab, currentUser, activeDemoPersona, switchDemoPersona, showToast } = useStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navItems = [
    { id: 'discover', label: 'Discover Matches', icon: Compass },
    { id: 'roadmaps', label: 'AI Roadmaps', icon: Zap },
    { id: 'sessions', label: '1:1 Sessions', icon: Calendar },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'mentors', label: 'Mentors', icon: Award },
    { id: 'profile', label: 'My Profile', icon: User }
  ];

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-2xl sticky top-0 z-50 transition-all shadow-xl shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('discover')}
          className="flex items-center space-x-3 cursor-pointer group shrink-0"
        >
          <div className="h-10 w-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center shadow-lg shadow-indigo-500/10 group-hover:scale-105 transition-all">
            <Sparkles className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <span className="font-heading font-extrabold text-2xl tracking-tight text-white group-hover:text-indigo-300 transition-colors">
              Skill<span className="text-indigo-400">Swap</span>
            </span>
            <span className="block text-[10px] font-mono text-slate-400 tracking-wider -mt-1">
              AI Peer Marketplace
            </span>
          </div>
        </div>

        {/* Dynamic Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1.5 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800/80">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-inner'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Section: Stats & Demo Switcher */}
        <div className="flex items-center space-x-3 shrink-0">
          
          {/* User Gamification Stats */}
          <div className="hidden xl:flex items-center space-x-3 px-3.5 py-2 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs font-mono">
            <div className="flex items-center space-x-1 text-amber-400 font-bold">
              <Flame className="w-4 h-4 fill-amber-400/20" />
              <span>{currentUser?.profile?.learningStreak || 12}d streak</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center space-x-1.5 font-mono">
              <span className="px-2 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold text-[10px] border border-indigo-500/30">
                Lvl {currentUser?.profile?.level || 4}
              </span>
              <span className="text-slate-400 font-semibold">{currentUser?.profile?.totalXp || 850} XP</span>
            </div>
          </div>

          {/* Demo Persona Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2.5 px-3 py-1.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 transition-all text-left group"
            >
              <img
                src={activeDemoPersona.avatar}
                alt={activeDemoPersona.name}
                className="w-8 h-8 rounded-xl border border-indigo-500/30 bg-slate-950 object-cover"
              />
              <div className="hidden md:block">
                <span className="block text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {activeDemoPersona.name}
                </span>
                <span className="block text-[10px] text-indigo-400 font-mono leading-tight">
                  {activeDemoPersona.role}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl z-50 overflow-hidden py-3 backdrop-blur-2xl animate-in fade-in slide-in-from-top-2">
                <div className="px-4 pb-2.5 mb-1 border-b border-slate-800/80">
                  <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider block font-bold">
                    Demo Account Switcher
                  </span>
                  <span className="text-xs text-slate-400 block mt-0.5">
                    Test matching & 1:1 messaging as:
                  </span>
                </div>

                <div className="py-1">
                  {DEMO_PERSONAS.map((persona) => {
                    const isSelected = activeDemoPersona.id === persona.id;
                    return (
                      <button
                        key={persona.id}
                        onClick={() => {
                          switchDemoPersona(persona);
                          setDropdownOpen(false);
                          showToast(`Switched active demo user to ${persona.name}`, 'success');
                        }}
                        className={`w-full px-4 py-2.5 flex items-center justify-between text-left hover:bg-slate-800/60 transition-colors ${
                          isSelected ? 'bg-indigo-600/10 text-indigo-300 border-l-2 border-indigo-500' : 'text-slate-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={persona.avatar}
                            alt={persona.name}
                            className="w-8 h-8 rounded-xl bg-slate-950 border border-slate-700"
                          />
                          <div>
                            <span className="block text-xs font-bold text-white">{persona.name}</span>
                            <span className="block text-[10px] text-slate-400 font-mono">{persona.role}</span>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-indigo-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Mobile Horizontal Sub-Navigation */}
      <div className="flex lg:hidden overflow-x-auto px-4 py-2.5 border-t border-slate-800/60 space-x-2 no-scrollbar bg-slate-950/80">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs whitespace-nowrap font-medium transition-all ${
                isActive ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 font-bold' : 'text-slate-400 bg-slate-900/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
