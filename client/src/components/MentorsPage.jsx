import React, { useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import { useStore } from '../store/useStore.js';
import { Award, Star, Calendar, ShieldCheck } from 'lucide-react';

export default function MentorsPage() {
  const { activeDemoPersona, setActiveTab } = useStore();
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchMentors(); }, [activeDemoPersona]);

  const fetchMentors = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users', { params: { isMentor: 'true' } });
      setMentors(res.data.users || []);
    } catch (err) { console.error('Fetch mentors error:', err); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Hero ── */}
      <div className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-700/20 via-surface-raised to-surface-raised" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="relative z-10 p-6 sm:p-10">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-300 text-xs font-medium">
              <Award className="w-3.5 h-3.5" />
              <span>Verified Mentors</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-white leading-tight">
              Learn from <span className="text-gradient-warm">Industry Experts</span>
            </h1>
            <p className="text-gray-400 text-sm max-w-xl">
              Book 1:1 mentoring sessions for architecture reviews, portfolio breakdowns, and career coaching.
            </p>
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-72 bg-surface-raised rounded-2xl border border-white/[0.04] animate-pulse shimmer" />
          ))}
        </div>
      ) : mentors.length === 0 ? (
        <div className="text-center py-16 bg-surface-raised rounded-2xl border border-white/[0.04] space-y-3">
          <Award className="w-10 h-10 text-gray-700 mx-auto" />
          <h3 className="text-base font-semibold text-gray-300 font-heading">No mentors listed yet</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {mentors.map((mentor) => {
            const teachSkills = mentor.skills?.filter(s => s.type === 'TEACH') || [];
            const rate = mentor.profile?.hourlyRate || 0;

            return (
              <div key={mentor.id} className="glass-card rounded-2xl p-5 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={mentor.profile?.avatarUrl}
                        alt={mentor.profile?.fullName}
                        className="w-12 h-12 rounded-xl bg-surface-DEFAULT border border-white/[0.06] group-hover:scale-105 transition-transform"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-heading font-semibold text-sm text-white">{mentor.profile?.fullName}</h3>
                          <ShieldCheck className="w-3.5 h-3.5 text-accent-400" />
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{mentor.profile?.headline}</p>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <div className="flex items-center text-accent-400 text-xs font-medium">
                            <Star className="w-3 h-3 fill-accent-400 mr-0.5" />
                            <span>{mentor.profile?.rating || '5.0'}</span>
                            <span className="text-gray-600 ml-0.5">({mentor.profile?.reviewCount || 0})</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <span className="font-mono text-sm font-bold text-accent-300">
                      {rate > 0 ? `$${rate}/hr` : 'Free'}
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">{mentor.profile?.bio}</p>

                  <div>
                    <span className="text-[10px] font-mono uppercase text-gray-500 font-semibold tracking-wider block mb-1.5">
                      Expertise
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {teachSkills.map((us) => (
                        <span key={us.id} className="badge-accent !text-[10px]">{us.skill?.name}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('discover')}
                  className="w-full btn-primary !py-2.5 !text-xs flex items-center justify-center gap-2 !rounded-lg mt-5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Request Mentorship</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
