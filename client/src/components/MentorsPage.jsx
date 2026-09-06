import React, { useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import { useStore } from '../store/useStore.js';
import { Award, Star, Calendar, ShieldCheck, CheckCircle2, DollarSign } from 'lucide-react';

export default function MentorsPage() {
  const { activeDemoPersona, setActiveTab, showToast } = useStore();
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMentors();
  }, [activeDemoPersona]);

  const fetchMentors = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users', { params: { isMentor: 'true' } });
      setMentors(res.data.users || []);
    } catch (err) {
      console.error('Fetch mentors error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-purple-950/30 p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono font-semibold">
            <Award className="w-3.5 h-3.5 text-purple-400" />
            <span>Verified Mentor Marketplace</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-heading">
            Learn 1:1 from Industry Experts & <br />
            <span className="bg-gradient-to-r from-purple-400 via-sky-400 to-teal-300 bg-clip-text text-transparent">
              Senior Tech Leaders
            </span>
          </h1>

          <p className="text-slate-300 text-sm leading-relaxed">
            Book structured mentoring sessions for code reviews, system architecture audits, portfolio breakdowns, and career coaching.
          </p>
        </div>
      </div>

      {/* Mentors Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-72 bg-slate-900/60 rounded-3xl border border-slate-800 animate-pulse p-6" />
          ))}
        </div>
      ) : mentors.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800 p-8">
          <Award className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-300">No verified mentors currently listed</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentors.map((mentor) => {
            const teachSkills = mentor.skills?.filter(s => s.type === 'TEACH') || [];
            const rate = mentor.profile?.hourlyRate || 0;

            return (
              <div
                key={mentor.id}
                className="bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 rounded-3xl p-6 transition-all space-y-5 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Top Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3.5">
                      <img
                        src={mentor.profile?.avatarUrl}
                        alt={mentor.profile?.fullName}
                        className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-700"
                      />
                      <div>
                        <div className="flex items-center space-x-1">
                          <h3 className="font-heading font-bold text-base text-white">
                            {mentor.profile?.fullName}
                          </h3>
                          <ShieldCheck className="w-4 h-4 text-purple-400 inline" />
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-1">{mentor.profile?.headline}</p>
                        
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center text-amber-400 text-xs font-mono font-semibold">
                            <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                            <span>{mentor.profile?.rating || 5.0}</span>
                            <span className="text-slate-500 ml-1">({mentor.profile?.reviewCount || 0})</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Hourly Rate */}
                    <div className="text-right font-mono">
                      <span className="text-lg font-bold text-purple-300">
                        {rate > 0 ? `$${rate}/hr` : 'Free Swap'}
                      </span>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {mentor.profile?.bio}
                  </p>

                  {/* Skills */}
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1.5">
                      Mentoring Expertise:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {teachSkills.map((us) => (
                        <span
                          key={us.id}
                          className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium"
                        >
                          {us.skill?.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('discover')}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-sky-500 text-slate-950 font-bold rounded-2xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-purple-500/20"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Request 1:1 Mentorship</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
