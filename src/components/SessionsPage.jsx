import React, { useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import { useStore } from '../store/useStore.js';
import { Calendar, Clock, Video, Sparkles, CheckCircle2, Star, MessageSquare, FileText, X, RefreshCw, Award } from 'lucide-react';

export default function SessionsPage() {
  const { showToast, activeDemoPersona } = useStore();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  // AI Prep Modal
  const [prepModalSession, setPrepModalSession] = useState(null);

  // AI Summary Modal
  const [summaryModalSession, setSummaryModalSession] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  // Review Modal
  const [reviewModalSession, setReviewModalSession] = useState(null);
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, [activeDemoPersona]);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/sessions');
      setSessions(res.data.sessions || []);
    } catch (err) {
      console.error('Fetch sessions error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (sessionId, status) => {
    try {
      await api.put(`/sessions/${sessionId}/status`, { status });
      showToast(`Session marked as ${status}!`, 'success');
      fetchSessions();
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleGenerateSummary = async (sessionId) => {
    setSummaryLoading(true);
    try {
      const res = await api.post(`/sessions/${sessionId}/ai-summary`);
      showToast('AI Post-Session Summary generated!', 'success');
      setSummaryModalSession(res.data.session);
      fetchSessions();
    } catch (err) {
      showToast('Failed to generate summary', 'error');
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewModalSession) return;
    setReviewSubmitting(true);

    try {
      const isHost = reviewModalSession.hostId === activeDemoPersona.id;
      const revieweeId = isHost ? reviewModalSession.learnerId : reviewModalSession.hostId;

      await api.post(`/sessions/${reviewModalSession.id}/review`, {
        revieweeId,
        rating,
        comment: reviewComment || 'Great skill swap session! Very informative and helpful.'
      });

      showToast('Review submitted! Thank you.', 'success');
      setReviewModalSession(null);
      setReviewComment('');
      fetchSessions();
    } catch (err) {
      showToast('Failed to submit review', 'error');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const filteredSessions = sessions.filter(s => {
    if (filter === 'ALL') return true;
    return s.status === filter;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono font-semibold">
            <Calendar className="w-3.5 h-3.5 text-teal-400" />
            <span>1:1 Session Management</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-heading">
            Scheduled Skill Swaps & <br />
            <span className="bg-gradient-to-r from-teal-400 via-sky-400 to-amber-300 bg-clip-text text-transparent">
              AI Prep Agendas
            </span>
          </h1>

          <p className="text-slate-300 text-sm leading-relaxed">
            Manage your peer swap appointments, review AI-generated prep agendas, join video rooms, and post post-session reviews to level up your XP rating.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 border-b border-slate-800 pb-3 font-mono text-xs">
        {['ALL', 'REQUESTED', 'ACCEPTED', 'COMPLETED'].map((st) => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`px-4 py-2 rounded-xl transition-all font-semibold ${
              filter === st
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            {st} ({sessions.filter(s => st === 'ALL' || s.status === st).length})
          </button>
        ))}
      </div>

      {/* Sessions Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 bg-slate-900/60 rounded-3xl border border-slate-800 animate-pulse p-6" />
          ))}
        </div>
      ) : filteredSessions.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800 p-8 space-y-4">
          <Calendar className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-300">No sessions match filter</h3>
          <p className="text-sm text-slate-500">Book a session with a peer from the Discover tab!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSessions.map((session) => {
            const partner = session.hostId === activeDemoPersona.id ? session.learner : session.host;
            const isHost = session.hostId === activeDemoPersona.id;
            const aiAgenda = JSON.parse(session.aiAgendaJson || '[]');
            const aiSummary = session.aiSummaryJson ? JSON.parse(session.aiSummaryJson) : null;

            return (
              <div
                key={session.id}
                className="bg-slate-900/80 border border-slate-800 hover:border-teal-500/40 rounded-3xl p-6 transition-all space-y-5 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  
                  {/* Top Bar */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={partner?.profile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${partner?.profile?.username}`}
                        alt={partner?.profile?.fullName}
                        className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-700"
                      />
                      <div>
                        <h3 className="font-heading font-bold text-base text-white">
                          {partner?.profile?.fullName}
                        </h3>
                        <p className="text-xs text-teal-400 font-mono">
                          {isHost ? 'Role: Mentor / Host' : 'Role: Learner'} • {session.skill?.name}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase font-bold ${
                        session.status === 'COMPLETED'
                          ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                          : session.status === 'ACCEPTED'
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {session.status}
                    </span>
                  </div>

                  {/* Date & Meeting URL */}
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-300 font-mono">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-teal-400" />
                        <span>{new Date(session.startTime).toLocaleString()}</span>
                      </div>
                      <span className="text-slate-500">{session.durationMins} mins</span>
                    </div>

                    {session.notes && (
                      <p className="text-slate-400 italic text-[11px] pt-1">"{session.notes}"</p>
                    )}
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="pt-3 border-t border-slate-800/80 space-y-2">
                  
                  <div className="grid grid-cols-2 gap-2">
                    {/* AI Agenda Button */}
                    <button
                      onClick={() => setPrepModalSession(session)}
                      className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                      <span>AI Prep Agenda</span>
                    </button>

                    {/* Join Meeting / Summary Button */}
                    {session.status === 'ACCEPTED' ? (
                      <a
                        href={session.meetingUrl || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-teal-500 to-sky-500 text-slate-950 text-xs font-bold flex items-center justify-center space-x-1.5 transition-all shadow-md shadow-teal-500/10"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Join Room</span>
                      </a>
                    ) : session.status === 'COMPLETED' ? (
                      <button
                        onClick={() => {
                          if (session.aiSummaryJson) setSummaryModalSession(session);
                          else handleGenerateSummary(session.id);
                        }}
                        className="py-2.5 px-3 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold flex items-center justify-center space-x-1.5 hover:bg-teal-500/20 transition-all"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>AI Summary</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUpdateStatus(session.id, 'ACCEPTED')}
                        className="py-2.5 px-3 rounded-xl bg-teal-500 text-slate-950 text-xs font-bold flex items-center justify-center space-x-1.5 transition-all"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Accept Session</span>
                      </button>
                    )}
                  </div>

                  {/* Secondary Actions: Complete / Leave Review */}
                  {session.status === 'ACCEPTED' && (
                    <button
                      onClick={() => handleUpdateStatus(session.id, 'COMPLETED')}
                      className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-medium transition-colors"
                    >
                      Mark Session Completed (+150 XP)
                    </button>
                  )}

                  {session.status === 'COMPLETED' && (
                    <button
                      onClick={() => setReviewModalSession(session)}
                      className="w-full py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 hover:bg-amber-500/20 text-xs font-medium flex items-center justify-center space-x-1 transition-colors"
                    >
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>Leave Peer Review</span>
                    </button>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* AI PREP AGENDA MODAL */}
      {prepModalSession && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative animate-in zoom-in-95">
            <button
              onClick={() => setPrepModalSession(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-white">AI Session Prep Agenda</h3>
                <p className="text-xs text-slate-400">Skill Topic: {prepModalSession.skill?.name}</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-2">
                <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block">
                  Structured Time Agenda (60 Mins):
                </span>
                {JSON.parse(prepModalSession.aiAgendaJson || '[]').map((item, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-slate-200 font-medium">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setPrepModalSession(null)}
              className="w-full py-3 bg-teal-500 text-slate-950 font-bold rounded-2xl text-xs"
            >
              Close Prep Agenda
            </button>
          </div>
        </div>
      )}

      {/* AI POST-SESSION SUMMARY MODAL */}
      {summaryModalSession && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative animate-in zoom-in-95">
            <button
              onClick={() => setSummaryModalSession(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-white">AI Post-Session Summary</h3>
                <p className="text-xs text-slate-400">Takeaways & Action Plan</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              {summaryModalSession.aiSummaryJson && (() => {
                const data = JSON.parse(summaryModalSession.aiSummaryJson);
                return (
                  <>
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200">
                      <span className="font-mono text-[10px] text-teal-400 uppercase block mb-1">Overview:</span>
                      {data.summary}
                    </div>

                    <div className="space-y-2">
                      <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block">
                        Action Items:
                      </span>
                      {(data.actionItems || []).map((act, i) => (
                        <div key={i} className="flex items-center space-x-2 text-slate-300 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/50">
                          <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                          <span>{act}</span>
                        </div>
                      ))}
                    </div>
                  </>
                );
              })()}
            </div>

            <button
              onClick={() => setSummaryModalSession(null)}
              className="w-full py-3 bg-teal-500 text-slate-950 font-bold rounded-2xl text-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* LEAVE REVIEW MODAL */}
      {reviewModalSession && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative animate-in zoom-in-95">
            <button
              onClick={() => setReviewModalSession(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Star className="w-6 h-6 fill-amber-400" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-white">Rate & Review Peer</h3>
                <p className="text-xs text-slate-400">Help maintain community reputation</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-mono text-[10px] uppercase mb-2">
                  Star Rating (1 to 5 Stars)
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-2 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">
                  Feedback Comment
                </label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  rows={3}
                  placeholder="Share how helpful your session partner was..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <button
              onClick={handleSubmitReview}
              disabled={reviewSubmitting}
              className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold rounded-2xl text-xs shadow-lg shadow-amber-500/20"
            >
              {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
