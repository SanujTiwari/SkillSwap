import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useStore } from './store/useStore.js';
import { api } from './lib/api.js';
import Navbar from './components/Navbar.jsx';
import DiscoverPage from './components/DiscoverPage.jsx';
import AIRoadmapPage from './components/AIRoadmapPage.jsx';
import SessionsPage from './components/SessionsPage.jsx';
import MessagesPage from './components/MessagesPage.jsx';
import CommunityPage from './components/CommunityPage.jsx';
import MentorsPage from './components/MentorsPage.jsx';
import ProfilePage from './components/ProfilePage.jsx';
import { CheckCircle2, AlertCircle, Info, Sparkles } from 'lucide-react';

export default function App() {
  const { activeTab, activeDemoPersona, setCurrentUser, toastMessage } = useStore();

  useEffect(() => {
    // Fetch initial user profile for active demo persona
    api.get(`/users/${activeDemoPersona.username}`)
      .then((res) => {
        if (res.data.user) {
          setCurrentUser(res.data.user);
        }
      })
      .catch((err) => console.error('Initial user fetch error:', err));
  }, [activeDemoPersona]);

  const renderActivePage = () => {
    switch (activeTab) {
      case 'discover':
        return <DiscoverPage />;
      case 'roadmaps':
        return <AIRoadmapPage />;
      case 'sessions':
        return <SessionsPage />;
      case 'messages':
        return <MessagesPage />;
      case 'community':
        return <CommunityPage />;
      case 'mentors':
        return <MentorsPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <DiscoverPage />;
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-teal-500/30 selection:text-teal-300">
        
        {/* Navigation Bar */}
        <Navbar />

        {/* Dynamic Toast Notifications */}
        {toastMessage && (
          <div className="fixed top-24 right-6 z-50 animate-in slide-in-from-top-4 fade-in">
            <div
              className={`px-4 py-3 rounded-2xl shadow-2xl border flex items-center space-x-2.5 text-xs font-semibold backdrop-blur-xl ${
                toastMessage.type === 'success'
                  ? 'bg-teal-950/90 border-teal-500/40 text-teal-200'
                  : toastMessage.type === 'error'
                  ? 'bg-rose-950/90 border-rose-500/40 text-rose-200'
                  : 'bg-slate-900/90 border-slate-700 text-slate-200'
              }`}
            >
              {toastMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-teal-400" />}
              {toastMessage.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400" />}
              {toastMessage.type === 'info' && <Info className="w-4 h-4 text-sky-400" />}
              <span>{toastMessage.msg}</span>
            </div>
          </div>
        )}

        {/* Main View Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderActivePage()}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span>SkillSwap Platform © 2026</span>
            </div>
            <p>Powered by Node.js, Express, Neon PostgreSQL, Prisma ORM & React JSX</p>
          </div>
        </footer>

      </div>
    </Router>
  );
}
