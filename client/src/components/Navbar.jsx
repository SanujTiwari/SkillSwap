import React, { useState } from 'react';
import { useStore, DEMO_PERSONAS } from '../store/useStore.js';
import { Sparkles, Code2, Users, Calendar, MessageSquare, Award, Compass, User, Flame, ChevronDown, Check, Zap } from 'lucide-react';

export default function Navbar() {
  const { activeTab, setActiveTab, currentUser, activeDemoPersona, switchDemoPersona, showToast } = useStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navItems = [
    { id: 'discover', label: 'Discover Matches', icon: Compass },
    { id: 'roadmaps', label: 'AI Roadmaps', icon: Zap },
    { id: 'sessions', label: '1:1 Sessions', icon: Calendar },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'community', label: 'Community Feed', icon: Users },
    { id: 'mentors', label: 'Mentors', icon: Award },
    { id: 'profile', label: 'My Profile', icon: User }
  ];

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('discover')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-teal-500 to-sky-400 flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <span className="font-heading font-bold text-2xl tracking-tight text-white group-hover:text-teal-400 transition-colors">
              Skill<span className="text-teal-400">Swap</span>
            </span>
            <span className="block text-[10px] uppercase font-mono text-slate-400 tracking-wider -mt-1">
              AI Peer Marketplace
            </span>
          </div>
        </div>

        {/* Dynamic Navigation Items */}
        <nav className="hidden lg:flex items-center space-x-1 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/60">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-500/20 to-sky-500/20 text-teal-300 border border-teal-500/30 shadow-inner'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Controls: Level Badge & Demo User Switcher */}
        <div className="flex items-center space-x-4">
          
          {/* User Gamification Stats */}
          <div className="hidden sm:flex items-center space-x-3 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800/80 text-xs">
            <div className="flex items-center space-x-1 text-amber-400 font-semibold font-mono">
              <Flame className="w-4 h-4 fill-amber-400/20" />
              <span>{currentUser?.profile?.learningStreak || 12}d streak</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center space-x-1.5 font-mono">
              <span className="px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 font-bold text-[10px]">
                Lvl {currentUser?.profile?.level || 4}
              </span>
              <span className="text-slate-400">{currentUser?.profile?.totalXp || 850} XP</span>
            </div>
          </div>

          {/* Demo Persona Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2.5 px-3 py-1.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-all text-left"
            >
              <img
                src={activeDemoPersona.avatar}
                alt={activeDemoPersona.name}
                className="w-8 h-8 rounded-full border border-teal-500/40 bg-slate-950"
              />
              <div className="hidden md:block">
                <span className="block text-xs font-semibold text-white leading-tight">
                  {activeDemoPersona.name}
                </span>
                <span className="block text-[10px] text-teal-400 font-mono">
                  {activeDemoPersona.role}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden py-2 backdrop-blur-xl animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-2 border-b border-slate-800/80">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    Switch Demo Active Persona
                  </span>
                  <span className="text-xs text-slate-400 block mt-0.5">
                    Test peer matching & messaging as:
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
                          showToast(`Switched active persona to ${persona.name}`, 'success');
                        }}
                        className={`w-full px-4 py-2.5 flex items-center justify-between text-left hover:bg-slate-800/60 transition-colors ${
                          isSelected ? 'bg-teal-500/10 text-teal-300' : 'text-slate-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={persona.avatar}
                            alt={persona.name}
                            className="w-7 h-7 rounded-full bg-slate-950 border border-slate-700"
                          />
                          <div>
                            <span className="block text-xs font-semibold text-white">{persona.name}</span>
                            <span className="block text-[10px] text-slate-400 font-mono">{persona.role}</span>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-teal-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="flex lg:hidden overflow-x-auto px-4 py-2 border-t border-slate-800/40 space-x-2 no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap ${
                isActive ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' : 'text-slate-400 bg-slate-900/40'
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
