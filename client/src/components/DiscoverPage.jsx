import React, { useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import { useStore } from '../store/useStore.js';
import {
  Search, Sparkles, Star, Calendar, X, RefreshCw,
  CheckCircle2, ShieldCheck, ArrowRight, Zap, Users, TrendingUp
} from 'lucide-react';

export default function DiscoverPage() {
  const { showToast, activeDemoPersona } = useStore();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // AI Match Explainer Modal
  const [explainerUser, setExplainerUser] = useState(null);
  const [explainerData, setExplainerData] = useState(null);
  const [explainerLoading, setExplainerLoading] = useState(false);

  // Book Session Modal
  const [bookingUser, setBookingUser] = useState(null);
  const [sessionNotes, setSessionNotes] = useState('');
  const [sessionType, setSessionType] = useState('SKILL_SWAP');
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [search, selectedCategory, activeDemoPersona]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users', {
        params: { search, category: selectedCategory }
      });
      setUsers(res.data.users || []);
    } catch (err) {
      console.error('Failed to fetch peers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenExplainer = async (peer) => {
    setExplainerUser(peer);
    setExplainerData(null);
    setExplainerLoading(true);
    try {
      const res = await api.post('/connections/match-explain', { targetUserId: peer.id });
      setExplainerData(res.data.explanation);
    } catch (err) {
      console.error('Match explanation error:', err);
      showToast('Could not load AI match explanation', 'error');
    } finally {
      setExplainerLoading(false);
    }
  };

  const handleBookSession = async () => {
    if (!bookingUser) return;
    setBookingLoading(true);
    try {
      const firstTeachSkill = bookingUser.skills?.find(s => s.type === 'TEACH')?.skillId;
      await api.post('/sessions/book', {
        hostId: bookingUser.id,
        skillId: firstTeachSkill || bookingUser.skills?.[0]?.skillId,
        sessionType,
        notes: sessionNotes || 'Looking forward to our skill swap session!'
      });
      showToast(`Session request sent to ${bookingUser.profile?.fullName}!`, 'success');
      setBookingUser(null);
      setSessionNotes('');
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to request session', 'error');
    } finally {
      setBookingLoading(false);
    }
  };

  const categories = [
    { id: 'ALL', name: 'All Domains', icon: null },
    { id: 'software-engineering', name: 'Engineering' },
    { id: 'design', name: 'Design' },
    { id: 'data-ai', name: 'Data & AI' },
    { id: 'product-business', name: 'Product' },
    { id: 'languages', name: 'Languages' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Hero Section ── */}
      <div className="relative rounded-2xl overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/40 via-surface-raised to-surface-raised" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/8 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl -ml-10 -mb-10" />

        <div className="relative z-10 p-6 sm:p-10">
          <div className="max-w-3xl space-y-4">
            {/* Status pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-600/10 border border-primary-500/20 text-primary-300 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-success-400 animate-pulse" />
              <span>AI Matching Active</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-white leading-tight">
              Find Your Perfect{' '}
              <span className="text-gradient-hero">Skill Match</span>
            </h1>

            <p className="text-gray-400 text-sm sm:text-base max-w-xl leading-relaxed">
              Connect with verified peers for reciprocal 1:1 skill exchanges. Learn what you need, teach what you know.
            </p>

            {/* Search */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <div className="relative flex-1">
                <Search className="w-4.5 h-4.5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  id="search-peers"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by skill, name, or role..."
                  className="input-field !pl-11 !rounded-xl"
                />
              </div>
              <button
                onClick={fetchUsers}
                className="btn-primary flex items-center justify-center gap-2 !rounded-xl shrink-0"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-4 pt-2">
              {[
                { icon: Users, label: 'Active Peers', value: users.length || '—' },
                { icon: Zap, label: 'Avg. Match', value: '92%' },
                { icon: TrendingUp, label: 'Sessions/Week', value: '140+' },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-2 text-xs text-gray-500">
                  <stat.icon className="w-3.5 h-3.5 text-gray-600" />
                  <span className="font-mono font-semibold text-gray-300">{stat.value}</span>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Category Filter ── */}
      <div className="flex overflow-x-auto gap-2 pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 ${
              selectedCategory === cat.id
                ? 'bg-primary-600 text-white shadow-glow-sm'
                : 'bg-surface-raised border border-white/[0.04] text-gray-400 hover:text-white hover:border-white/[0.08]'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* ── Peer Grid ── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-72 bg-surface-raised rounded-2xl border border-white/[0.04] animate-pulse shimmer" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-16 bg-surface-raised rounded-2xl border border-white/[0.04] space-y-3">
          <Search className="w-10 h-10 text-gray-700 mx-auto" />
          <h3 className="text-base font-semibold text-gray-300 font-heading">No matches found</h3>
          <p className="text-xs text-gray-500">Try adjusting your search or filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {users.map((peer, idx) => {
            const teachSkills = peer.skills?.filter(s => s.type === 'TEACH') || [];
            const learnSkills = peer.skills?.filter(s => s.type === 'LEARN') || [];
            const matchScore = Math.min(98, 84 + (idx % 3) * 5);

            return (
              <div
                key={peer.id}
                className="group glass-card rounded-2xl p-5 flex flex-col justify-between"
              >
                <div>
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={peer.profile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${peer.profile?.username}`}
                        alt={peer.profile?.fullName}
                        className="w-12 h-12 rounded-xl bg-surface-DEFAULT border border-white/[0.06] group-hover:scale-105 transition-transform object-cover"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-heading font-semibold text-sm text-white group-hover:text-primary-300 transition-colors">
                            {peer.profile?.fullName}
                          </h3>
                          <ShieldCheck className="w-3.5 h-3.5 text-primary-400" />
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                          {peer.profile?.headline}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="badge-primary !py-0.5 !text-[10px] font-mono">
                            Lv.{peer.profile?.level || 1}
                          </span>
                          <div className="flex items-center text-accent-400 text-xs font-medium">
                            <Star className="w-3 h-3 fill-accent-400 mr-0.5" />
                            <span>{peer.profile?.rating || '5.0'}</span>
                            <span className="text-gray-600 ml-0.5">({peer.profile?.reviewCount || 0})</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Match Score */}
                    <span className="badge-primary !rounded-lg font-mono shrink-0">
                      {matchScore}%
                    </span>
                  </div>

                  {/* Bio */}
                  {peer.profile?.bio && (
                    <p className="mt-3.5 text-xs text-gray-400 line-clamp-2 leading-relaxed">
                      {peer.profile.bio}
                    </p>
                  )}

                  {/* Skills */}
                  <div className="mt-4 space-y-2.5">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-gray-500 font-semibold tracking-wider block mb-1.5">
                        Teaches
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {teachSkills.slice(0, 3).map((us) => (
                          <span key={us.id} className="badge-primary !text-[10px]">
                            {us.skill?.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-gray-500 font-semibold tracking-wider block mb-1.5">
                        Wants to Learn
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {learnSkills.slice(0, 3).map((us) => (
                          <span key={us.id} className="badge-teal !text-[10px]">
                            {us.skill?.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 pt-4 border-t border-white/[0.04] flex gap-2.5">
                  <button
                    onClick={() => handleOpenExplainer(peer)}
                    className="flex-1 btn-secondary !py-2 !text-xs flex items-center justify-center gap-1.5 !rounded-lg"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-primary-400" />
                    <span>AI Match</span>
                  </button>
                  <button
                    onClick={() => setBookingUser(peer)}
                    className="flex-1 btn-primary !py-2 !text-xs flex items-center justify-center gap-1.5 !rounded-lg"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Swap</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── AI Match Explainer Modal ── */}
      {explainerUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setExplainerUser(null)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative w-full max-w-lg bg-surface-raised border border-white/[0.08] rounded-2xl shadow-elevated animate-scale-in overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-primary-500 to-teal-400" />
            <div className="p-6 space-y-5">
              <button
                onClick={() => setExplainerUser(null)}
                className="absolute top-5 right-5 p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.06]"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary-600/15 border border-primary-500/25 text-primary-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold text-white">AI Match Analysis</h3>
                  <p className="text-xs text-gray-500">Compatibility with {explainerUser.profile?.fullName}</p>
                </div>
              </div>

              {explainerLoading ? (
                <div className="py-10 text-center space-y-3">
                  <RefreshCw className="w-6 h-6 text-primary-400 animate-spin mx-auto" />
                  <p className="text-xs text-gray-500">Analyzing compatibility...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-surface-DEFAULT border border-white/[0.04] flex items-center justify-between">
                    <span className="text-xs text-gray-400">Compatibility</span>
                    <span className="text-2xl font-bold font-mono text-gradient-primary">
                      {explainerData?.matchPercent || 94}%
                    </span>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider font-semibold">
                      Key Synergies
                    </span>
                    {(explainerData?.synergyHighlights || ['Strong skill complementarity', 'Aligned learning goals', 'Matching availability']).map((syn, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-gray-300 bg-surface-DEFAULT p-3 rounded-xl border border-white/[0.04]">
                        <CheckCircle2 className="w-4 h-4 text-success-400 shrink-0 mt-0.5" />
                        <span>{syn}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  setBookingUser(explainerUser);
                  setExplainerUser(null);
                }}
                className="w-full btn-primary !py-3 flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Swap Session</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Book Session Modal ── */}
      {bookingUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setBookingUser(null)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative w-full max-w-md bg-surface-raised border border-white/[0.08] rounded-2xl shadow-elevated animate-scale-in overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-accent-400 to-primary-500" />
            <div className="p-6 space-y-5">
              <button
                onClick={() => setBookingUser(null)}
                className="absolute top-5 right-5 p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.06]"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3">
                <img
                  src={bookingUser.profile?.avatarUrl}
                  alt={bookingUser.profile?.fullName}
                  className="w-11 h-11 rounded-xl bg-surface-DEFAULT border border-white/[0.06]"
                />
                <div>
                  <h3 className="font-heading text-sm font-bold text-white">
                    Book with {bookingUser.profile?.fullName}
                  </h3>
                  <p className="text-xs text-gray-500">Reciprocal Skill Exchange</p>
                </div>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs text-gray-400 font-medium mb-1.5">Session Type</label>
                  <select
                    value={sessionType}
                    onChange={(e) => setSessionType(e.target.value)}
                    className="input-field"
                  >
                    <option value="SKILL_SWAP">1:1 Skill Swap (Free)</option>
                    <option value="MENTORING">Mentorship Session</option>
                    <option value="PORTFOLIO_REVIEW">Portfolio Review</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 font-medium mb-1.5">Topic Notes</label>
                  <textarea
                    value={sessionNotes}
                    onChange={(e) => setSessionNotes(e.target.value)}
                    rows={3}
                    placeholder="What would you like to cover?"
                    className="input-field resize-none"
                  />
                </div>
              </div>

              <button
                onClick={handleBookSession}
                disabled={bookingLoading}
                className="w-full btn-primary !py-3 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {bookingLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    <span>Send Request</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
