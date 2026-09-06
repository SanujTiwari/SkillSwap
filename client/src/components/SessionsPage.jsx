import React, { useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import { useStore } from '../store/useStore.js';
import { Calendar, Clock, Video, Sparkles, CheckCircle2, Star, FileText, X, RefreshCw } from 'lucide-react';

export default function SessionsPage() {
  const { showToast, activeDemoPersona } = useStore();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  const [prepModalSession, setPrepModalSession] = useState(null);
  const [summaryModalSession, setSummaryModalSession] = useState(null);
  const [reviewModalSession, setReviewModalSession] = useState(null);
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => { fetchSessions(); }, [activeDemoPersona]);

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
    try {
      const res = await api.post(`/sessions/${sessionId}/ai-summary`);
      showToast('AI Summary generated!', 'success');
      setSummaryModalSession(res.data.session);
      fetchSessions();
    } catch (err) {
      showToast('Failed to generate summary', 'error');
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewModalSession) return;
    setReviewSubmitting(true);
    try {
      const isHost = reviewModalSession.hostId === activeDemoPersona.id;
      const revieweeId = isHost ? reviewModalSession.learnerId : reviewModalSession.hostId;
      await api.post(`/sessions/${reviewModalSession.id}/review`, {
        revieweeId, rating,
        comment: reviewComment || 'Great skill swap session!'
      });
      showToast('Review submitted!', 'success');
      setReviewModalSession(null);
      setReviewComment('');
      fetchSessions();
    } catch (err) {
      showToast('Failed to submit review', 'error');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const filteredSessions = sessions.filter(s => filter === 'ALL' || s.status === filter);

  const statusColors = {
    COMPLETED: 'badge-primary',
    ACCEPTED: 'badge-teal',
    REQUESTED: 'badge-accent',
  };

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Hero ── */}
      <div className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/30 via-surface-raised to-surface-raised" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="relative z-10 p-6 sm:p-10">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-medium">
              <Calendar className="w-3.5 h-3.5" />
              <span>Session Center</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-white leading-tight">
              Your Skill Swap <span className="text-gradient-teal">Sessions</span>
            </h1>
            <p className="text-gray-400 text-sm max-w-xl">
              Manage appointments, review AI agendas, and leave peer reviews.
            </p>
          </div>
        </div>
      </div>

      {/* ── Filter Tabs ── */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {['ALL', 'REQUESTED', 'ACCEPTED', 'COMPLETED'].map((st) => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              filter === st
                ? 'bg-primary-600 text-white shadow-glow-sm'
                : 'bg-surface-raised border border-white/[0.04] text-gray-400 hover:text-white hover:border-white/[0.08]'
            }`}
          >
            {st} ({sessions.filter(s => st === 'ALL' || s.status === st).length})
          </button>
        ))}
      </div>

      {/* ── Sessions Grid ── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 bg-surface-raised rounded-2xl border border-white/[0.04] animate-pulse shimmer" />
          ))}
        </div>
      ) : filteredSessions.length === 0 ? (
        <div className="text-center py-16 bg-surface-raised rounded-2xl border border-white/[0.04] space-y-3">
          <Calendar className="w-10 h-10 text-gray-700 mx-auto" />
          <h3 className="text-base font-semibold text-gray-300 font-heading">No sessions found</h3>
          <p className="text-xs text-gray-500">Book a session from the Discover page!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredSessions.map((session) => {
            const partner = session.hostId === activeDemoPersona.id ? session.learner : session.host;
            const isHost = session.hostId === activeDemoPersona.id;

            return (
              <div
                key={session.id}
                className="glass-card rounded-2xl p-5 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={partner?.profile?.avatarUrl}
                        alt={partner?.profile?.fullName}
                        className="w-11 h-11 rounded-xl bg-surface-DEFAULT border border-white/[0.06]"
                      />
                      <div>
                        <h3 className="font-heading font-semibold text-sm text-white">
                          {partner?.profile?.fullName}
                        </h3>
                        <p className="text-xs text-primary-400 font-mono">
                          {isHost ? 'Host' : 'Learner'} · {session.skill?.name}
                        </p>
                      </div>
                    </div>
                    <span className={`${statusColors[session.status] || 'badge-primary'} !text-[10px] font-mono uppercase`}>
                      {session.status}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-surface-DEFAULT border border-white/[0.04] space-y-2 text-xs">
                    <div className="flex items-center justify-between text-gray-300 font-mono">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-primary-400" />
                        <span>{new Date(session.startTime).toLocaleString()}</span>
                      </div>
                      <span className="text-gray-500">{session.durationMins} mins</span>
                    </div>
                    {session.notes && (
                      <p className="text-gray-500 italic text-[11px] pt-1">"{session.notes}"</p>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/[0.04] space-y-2 mt-4">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setPrepModalSession(session)}
                      className="btn-secondary !py-2 !text-xs flex items-center justify-center gap-1.5 !rounded-lg"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-primary-400" />
                      <span>AI Prep</span>
                    </button>

                    {session.status === 'ACCEPTED' ? (
                      <a
                        href={session.meetingUrl || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-primary !py-2 !text-xs flex items-center justify-center gap-1.5 !rounded-lg"
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
                        className="btn-secondary !py-2 !text-xs flex items-center justify-center gap-1.5 !rounded-lg !border-primary-500/20 !text-primary-300"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>AI Summary</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUpdateStatus(session.id, 'ACCEPTED')}
                        className="btn-primary !py-2 !text-xs flex items-center justify-center gap-1.5 !rounded-lg"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Accept</span>
                      </button>
                    )}
                  </div>

                  {session.status === 'ACCEPTED' && (
                    <button
                      onClick={() => handleUpdateStatus(session.id, 'COMPLETED')}
                      className="w-full py-2 rounded-lg bg-surface-overlay hover:bg-gray-600/30 text-primary-300 text-xs font-medium transition-colors"
                    >
                      Mark Completed (+150 XP)
                    </button>
                  )}

                  {session.status === 'COMPLETED' && (
                    <button
                      onClick={() => setReviewModalSession(session)}
                      className="w-full py-2 rounded-lg bg-accent-500/10 border border-accent-500/20 text-accent-300 hover:bg-accent-500/20 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Star className="w-3.5 h-3.5 fill-accent-400" />
                      <span>Leave Review</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── AI Prep Modal ── */}
      {prepModalSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setPrepModalSession(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative w-full max-w-lg bg-surface-raised border border-white/[0.08] rounded-2xl shadow-elevated animate-scale-in overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-primary-500 to-teal-400" />
            <div className="p-6 space-y-5">
              <button onClick={() => setPrepModalSession(null)} className="absolute top-5 right-5 p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.06]">
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary-600/15 border border-primary-500/25 text-primary-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold text-white">AI Session Prep</h3>
                  <p className="text-xs text-gray-500">Topic: {prepModalSession.skill?.name}</p>
                </div>
              </div>
              <div className="space-y-2 text-xs">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider font-semibold">Agenda Items</span>
                {JSON.parse(prepModalSession.aiAgendaJson || '[]').map((item, i) => (
                  <div key={i} className="p-3 rounded-xl bg-surface-DEFAULT border border-white/[0.04] text-gray-200 font-medium">{item}</div>
                ))}
              </div>
              <button onClick={() => setPrepModalSession(null)} className="w-full btn-primary !py-3">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── AI Summary Modal ── */}
      {summaryModalSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setSummaryModalSession(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative w-full max-w-lg bg-surface-raised border border-white/[0.08] rounded-2xl shadow-elevated animate-scale-in overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-teal-400 to-primary-500" />
            <div className="p-6 space-y-5">
              <button onClick={() => setSummaryModalSession(null)} className="absolute top-5 right-5 p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.06]">
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-teal-600/15 border border-teal-500/25 text-teal-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold text-white">AI Summary</h3>
                  <p className="text-xs text-gray-500">Takeaways & Action Items</p>
                </div>
              </div>
              {summaryModalSession.aiSummaryJson && (() => {
                const data = JSON.parse(summaryModalSession.aiSummaryJson);
                return (
                  <div className="space-y-4 text-xs">
                    <div className="p-4 rounded-xl bg-surface-DEFAULT border border-white/[0.04] text-gray-200">
                      <span className="text-[10px] font-mono text-primary-400 uppercase block mb-1 font-semibold">Overview</span>
                      {data.summary}
                    </div>
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider font-semibold">Action Items</span>
                      {(data.actionItems || []).map((act, i) => (
                        <div key={i} className="flex items-center gap-2 text-gray-300 p-3 rounded-xl bg-surface-DEFAULT border border-white/[0.04]">
                          <CheckCircle2 className="w-4 h-4 text-success-400 shrink-0" />
                          <span>{act}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
              <button onClick={() => setSummaryModalSession(null)} className="w-full btn-primary !py-3">Done</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Review Modal ── */}
      {reviewModalSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setReviewModalSession(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative w-full max-w-md bg-surface-raised border border-white/[0.08] rounded-2xl shadow-elevated animate-scale-in overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-accent-400 to-accent-600" />
            <div className="p-6 space-y-5">
              <button onClick={() => setReviewModalSession(null)} className="absolute top-5 right-5 p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.06]">
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-accent-500/15 border border-accent-500/25 text-accent-400">
                  <Star className="w-5 h-5 fill-accent-400" />
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold text-white">Rate Your Peer</h3>
                  <p className="text-xs text-gray-500">Help build community trust</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 font-medium mb-2">Rating</label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} type="button" onClick={() => setRating(star)} className="p-0.5 transition-transform hover:scale-110">
                        <Star className={`w-7 h-7 ${star <= rating ? 'text-accent-400 fill-accent-400' : 'text-gray-700'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-medium mb-1.5">Feedback</label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={3}
                    placeholder="Share your experience..."
                    className="input-field resize-none"
                  />
                </div>
              </div>
              <button
                onClick={handleSubmitReview}
                disabled={reviewSubmitting}
                className="w-full py-3 rounded-xl bg-accent-500 hover:bg-accent-400 text-surface-DEFAULT font-bold text-xs transition-all disabled:opacity-50"
              >
                {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
