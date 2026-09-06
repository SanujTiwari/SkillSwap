import React, { useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import { useStore } from '../store/useStore.js';
import { Search, Filter, Sparkles, Zap, Star, ArrowRight, ShieldCheck, CheckCircle2, MessageSquare, Calendar, X, RefreshCw } from 'lucide-react';

export default function DiscoverPage() {
  const { setMatchExplainerUser, setBookingTargetUser, showToast, activeDemoPersona } = useStore();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  
  // AI Match Explainer Modal state
  const [explainerUser, setExplainerUser] = useState(null);
  const [explainerData, setExplainerData] = useState(null);
  const [explainerLoading, setExplainerLoading] = useState(false);

  // Book Session Modal state
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
      const res = await api.post('/connections/match-explain', {
        targetUserId: peer.id
      });
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
      const res = await api.post('/sessions/book', {
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
    { id: 'ALL', name: 'All Domains' },
    { id: 'software-engineering', name: 'Software Engineering' },
    { id: 'design', name: 'UI/UX & Design' },
    { id: 'data-ai', name: 'Data & AI' },
    { id: 'product-business', name: 'Product & Business' },
    { id: 'languages', name: 'Languages' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-teal-950/40 p-8 border border-slate-800 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>AI Compatibility Engine v2.4</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-heading">
            Discover Verified Peers for <br />
            <span className="bg-gradient-to-r from-teal-400 via-sky-400 to-amber-300 bg-clip-text text-transparent">
              Reciprocal 1:1 Skill Swaps
            </span>
          </h1>
          
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Our AI matches what you want to learn with what verified community mentors teach. Trade knowledge, build projects together, and earn XP.
          </p>

          {/* Search & Filter Bar */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by skill, name, or role (e.g. React, Figma, Python)..."
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all"
              />
            </div>
            <button
              onClick={fetchUsers}
              className="px-6 py-3.5 bg-gradient-to-r from-teal-500 to-sky-500 hover:from-teal-400 hover:to-sky-400 text-slate-950 font-bold rounded-2xl text-sm flex items-center justify-center space-x-2 transition-all transform active:scale-95 shadow-lg shadow-teal-500/20"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Matches</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex overflow-x-auto pb-2 space-x-2 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20 font-bold'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Peer Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-72 bg-slate-900/60 rounded-3xl border border-slate-800/80 animate-pulse p-6" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800/60 p-8 space-y-4">
          <Sparkles className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-300">No peer matches found</h3>
          <p className="text-sm text-slate-500">Try adjusting your search criteria or domain category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((peer, idx) => {
            const teachSkills = peer.skills?.filter(s => s.type === 'TEACH') || [];
            const learnSkills = peer.skills?.filter(s => s.type === 'LEARN') || [];
            
            // Mock Match Compatibility % based on index & overlap
            const matchScore = Math.min(98, 82 + (idx % 4) * 5);

            return (
              <div
                key={peer.id}
                className="group bg-slate-900/80 border border-slate-800 hover:border-teal-500/50 rounded-3xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-teal-500/10 flex flex-col justify-between"
              >
                <div>
                  {/* Card Top Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3.5">
                      <img
                        src={peer.profile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${peer.profile?.username}`}
                        alt={peer.profile?.fullName}
                        className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-700/80 group-hover:scale-105 transition-transform"
                      />
                      <div>
                        <h3 className="font-heading font-bold text-lg text-white group-hover:text-teal-300 transition-colors">
                          {peer.profile?.fullName}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-1">{peer.profile?.headline}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-teal-400">
                            Lvl {peer.profile?.level || 1}
                          </span>
                          <div className="flex items-center text-amber-400 text-xs font-semibold font-mono">
                            <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                            <span>{peer.profile?.rating || 5.0}</span>
                            <span className="text-slate-500 ml-1">({peer.profile?.reviewCount || 0})</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* AI Match Badge */}
                    <div className="flex flex-col items-end">
                      <span className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-teal-500/20 to-sky-500/20 border border-teal-500/30 text-teal-300 font-mono text-xs font-extrabold">
                        {matchScore}% Match
                      </span>
                    </div>
                  </div>

                  {/* Bio */}
                  {peer.profile?.bio && (
                    <p className="mt-4 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {peer.profile.bio}
                    </p>
                  )}

                  {/* Skills Section */}
                  <div className="mt-5 space-y-3">
                    {/* Teaches */}
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider block mb-1.5">
                        Teaches:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {teachSkills.slice(0, 3).map((us) => (
                          <span
                            key={us.id}
                            className="px-2.5 py-1 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-medium"
                          >
                            {us.skill?.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Wants to Learn */}
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider block mb-1.5">
                        Wants to Learn:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {learnSkills.slice(0, 3).map((us) => (
                          <span
                            key={us.id}
                            className="px-2.5 py-1 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-300 text-xs font-medium"
                          >
                            {us.skill?.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleOpenExplainer(peer)}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                    <span>AI Breakdown</span>
                  </button>

                  <button
                    onClick={() => setBookingUser(peer)}
                    className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-teal-500 to-sky-500 hover:opacity-95 text-slate-950 text-xs font-bold flex items-center justify-center space-x-1.5 transition-all shadow-md shadow-teal-500/10"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Request Swap</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* AI MATCH EXPLAINER MODAL */}
      {explainerUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative animate-in zoom-in-95">
            <button
              onClick={() => setExplainerUser(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-white">AI Compatibility Analysis</h3>
                <p className="text-xs text-slate-400">SkillSwap Match Explainer Report</p>
              </div>
            </div>

            {explainerLoading ? (
              <div className="py-12 text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-teal-400 animate-spin mx-auto" />
                <p className="text-xs font-mono text-slate-400">Analyzing skill vectors & schedule availability...</p>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400 font-mono">Overall Compatibility:</span>
                  <span className="text-lg font-bold font-mono text-teal-300">
                    {explainerData?.matchPercent || 94}%
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block">
                    Synergy Highlights:
                  </span>
                  {(explainerData?.synergyHighlights || []).map((syn, i) => (
                    <div key={i} className="flex items-start space-x-2 text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/50">
                      <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                      <span>{syn}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pt-2">
                  <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block">
                    Recommended Session Agenda:
                  </span>
                  {(explainerData?.recommendedSessionTopics || []).map((topic, i) => (
                    <div key={i} className="p-3 rounded-xl bg-teal-500/5 border border-teal-500/20 text-teal-300">
                      {topic}
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
              className="w-full py-3 bg-gradient-to-r from-teal-500 to-sky-500 text-slate-950 font-bold rounded-2xl text-xs transition-all shadow-lg shadow-teal-500/20"
            >
              Proceed to Book Session
            </button>
          </div>
        </div>
      )}

      {/* BOOK SESSION MODAL */}
      {bookingUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative animate-in zoom-in-95">
            <button
              onClick={() => setBookingUser(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <img
                src={bookingUser.profile?.avatarUrl}
                alt={bookingUser.profile?.fullName}
                className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-700"
              />
              <div>
                <h3 className="font-heading text-lg font-bold text-white">
                  Request 1:1 Swap with {bookingUser.profile?.fullName}
                </h3>
                <p className="text-xs text-slate-400">Free Peer Exchange Session (60 Mins)</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">
                  Session Type
                </label>
                <select
                  value={sessionType}
                  onChange={(e) => setSessionType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-teal-400"
                >
                  <option value="SKILL_SWAP">1:1 Skill Swap (Free)</option>
                  <option value="MENTORING">Mentorship Review</option>
                  <option value="PORTFOLIO_REVIEW">Portfolio & Code Review</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">
                  Topic / What would you like to focus on?
                </label>
                <textarea
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  rows={3}
                  placeholder="e.g., Let's practice building custom React hooks and converting Figma tokens into code!"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
                />
              </div>
            </div>

            <button
              onClick={handleBookSession}
              disabled={bookingLoading}
              className="w-full py-3 bg-gradient-to-r from-teal-500 to-sky-500 text-slate-950 font-bold rounded-2xl text-xs transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center space-x-2"
            >
              {bookingLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Calendar className="w-4 h-4" />
                  <span>Send Session Request</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
