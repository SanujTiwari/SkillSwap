import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useStore } from './store/useStore.js';
import { api } from './lib/api.js';
import Navbar from './components/Navbar.jsx';
import AuthModal from './components/AuthModal.jsx';
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
      <div className="min-h-screen bg-surface-DEFAULT text-gray-100 flex flex-col">
        
        {/* Navigation Bar */}
        <Navbar />

        {/* Auth Modal */}
        <AuthModal />

        {/* Toast Notifications */}
        {toastMessage && (
          <div className="fixed top-20 right-4 z-50 animate-slide-down">
            <div
              className={`px-4 py-3 rounded-xl shadow-elevated border flex items-center gap-2.5 text-xs font-medium backdrop-blur-xl ${
                toastMessage.type === 'success'
                  ? 'bg-surface-raised/90 border-success-500/25 text-success-400'
                  : toastMessage.type === 'error'
                  ? 'bg-surface-raised/90 border-danger-500/25 text-danger-400'
                  : 'bg-surface-raised/90 border-primary-500/25 text-primary-300'
              }`}
            >
              {toastMessage.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
              {toastMessage.type === 'error' && <AlertCircle className="w-4 h-4" />}
              {toastMessage.type === 'info' && <Info className="w-4 h-4" />}
              <span>{toastMessage.msg}</span>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {renderActivePage()}
        </main>

        {/* Footer */}
        <footer className="border-t border-white/[0.04] bg-surface-DEFAULT py-6">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-primary-400" />
              <span className="text-xs font-semibold text-gray-400">
                SkillSwap © 2026
              </span>
            </div>
            <p className="text-xs text-gray-600 font-mono">
              Built with React · Express · PostgreSQL · Prisma
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}
