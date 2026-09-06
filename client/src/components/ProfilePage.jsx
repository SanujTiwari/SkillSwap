import React, { useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import { useStore } from '../store/useStore.js';
import { Award, Flame, Star, ShieldCheck, Plus, Trash2, Edit3, Sparkles, X, CheckCircle2 } from 'lucide-react';

export default function ProfilePage() {
  const { activeDemoPersona, showToast } = useStore();
  const [profileData, setProfileData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [hourlyRate, setHourlyRate] = useState(0);

  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [skillType, setSkillType] = useState('TEACH');
  const [proficiency, setProficiency] = useState('INTERMEDIATE');

  useEffect(() => { fetchProfile(); fetchCategories(); }, [activeDemoPersona]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/users/${activeDemoPersona.username}`);
      const u = res.data.user;
      setProfileData(u);
      setFullName(u?.profile?.fullName || '');
      setHeadline(u?.profile?.headline || '');
      setBio(u?.profile?.bio || '');
      setLocation(u?.profile?.location || '');
      setHourlyRate(u?.profile?.hourlyRate || 0);
    } catch (err) { console.error('Fetch profile error:', err); }
    finally { setLoading(false); }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/skills/categories');
      setCategories(res.data.categories || []);
    } catch (err) { console.error('Fetch categories error:', err); }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await api.put('/users/profile', { fullName, headline, bio, location, hourlyRate });
      showToast('Profile updated!', 'success');
      setEditModalOpen(false);
      fetchProfile();
    } catch (err) { showToast('Failed to update profile', 'error'); }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!selectedSkillId) return;
    try {
      await api.post('/skills/user', { skillId: selectedSkillId, type: skillType, proficiency });
      showToast('Skill added!', 'success');
      setSkillModalOpen(false);
      fetchProfile();
    } catch (err) { showToast('Failed to add skill', 'error'); }
  };

  const handleRemoveSkill = async (userSkillId) => {
    try {
      await api.delete(`/skills/user/${userSkillId}`);
      showToast('Skill removed', 'success');
      fetchProfile();
    } catch (err) { showToast('Failed to remove skill', 'error'); }
  };

  if (loading) {
    return <div className="h-96 bg-surface-raised rounded-2xl border border-white/[0.04] animate-pulse shimmer" />;
  }

  const p = profileData?.profile || {};
  const teachSkills = profileData?.skills?.filter(s => s.type === 'TEACH') || [];
  const learnSkills = profileData?.skills?.filter(s => s.type === 'LEARN') || [];
  const badges = profileData?.badges || [];

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Profile Header ── */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/5 rounded-full blur-3xl -mr-16 -mt-16" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <img
              src={p.avatarUrl}
              alt={p.fullName}
              className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-surface-DEFAULT border-2 border-primary-500/30 shadow-glow-sm object-cover"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="font-heading font-bold text-2xl text-white">{p.fullName}</h1>
                <ShieldCheck className="w-5 h-5 text-primary-400" />
              </div>
              <p className="text-xs text-primary-400 font-mono font-medium">{p.headline}</p>
              <p className="text-xs text-gray-500">{p.location || 'Global Remote'} · {p.timezone}</p>
            </div>
          </div>
          <button
            onClick={() => setEditModalOpen(true)}
            className="btn-secondary !text-xs flex items-center gap-2 !rounded-lg"
          >
            <Edit3 className="w-3.5 h-3.5 text-primary-400" />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* Stats */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 border-t border-white/[0.04]">
          {[
            { label: 'Level', value: `Lv.${p.level || 1}`, sub: `${p.totalXp || 0} XP`, color: 'text-primary-300', icon: null },
            { label: 'Streak', value: `${p.learningStreak || 0}d`, sub: null, color: 'text-accent-400', icon: Flame },
            { label: 'Rating', value: p.rating || '5.0', sub: `${p.reviewCount || 0} reviews`, color: 'text-accent-400', icon: Star },
            { label: 'Sessions', value: p.completedSessions || 0, sub: 'completed', color: 'text-teal-300', icon: CheckCircle2 },
          ].map((stat) => (
            <div key={stat.label} className="p-3.5 rounded-xl bg-surface-DEFAULT border border-white/[0.04]">
              <span className="text-[10px] font-mono text-gray-500 uppercase font-semibold block">{stat.label}</span>
              <div className="flex items-center gap-1.5 mt-1">
                {stat.icon && <stat.icon className={`w-4 h-4 ${stat.color}`} />}
                <span className={`text-lg font-bold font-mono ${stat.color}`}>{stat.value}</span>
                {stat.sub && <span className="text-gray-600 text-[10px] ml-1">{stat.sub}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Badges ── */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <h2 className="font-heading font-bold text-base text-white flex items-center gap-2">
          <Award className="w-4 h-4 text-accent-400" />
          <span>Badges ({badges.length})</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {badges.map((ub) => (
            <div key={ub.id} className="p-4 rounded-xl bg-surface-DEFAULT border border-white/[0.04] text-center space-y-2 hover:border-accent-500/30 transition-colors">
              <div className="w-11 h-11 rounded-xl bg-accent-500/10 border border-accent-500/25 text-accent-400 mx-auto flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="block text-xs font-semibold text-white">{ub.badge?.title}</span>
              <span className="block text-[10px] text-gray-500 line-clamp-2">{ub.badge?.description}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Skill Management ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Teach */}
        <div className="glass-card rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-semibold text-sm text-white">Skills You Teach</h3>
            <button
              onClick={() => { setSkillType('TEACH'); setSkillModalOpen(true); }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-primary-600/10 border border-primary-500/20 text-primary-300 text-xs font-medium hover:bg-primary-600/20 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
          <div className="space-y-2">
            {teachSkills.map((us) => (
              <div key={us.id} className="p-3 rounded-xl bg-surface-DEFAULT border border-white/[0.04] flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-white">{us.skill?.name}</span>
                  <span className="block text-[10px] text-primary-400 font-mono mt-0.5">{us.proficiency} · {us.yearsExperience}yr</span>
                </div>
                <button onClick={() => handleRemoveSkill(us.id)} className="p-1 text-gray-600 hover:text-danger-400 rounded transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Learn */}
        <div className="glass-card rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-semibold text-sm text-white">Skills to Learn</h3>
            <button
              onClick={() => { setSkillType('LEARN'); setSkillModalOpen(true); }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-teal-600/10 border border-teal-500/20 text-teal-300 text-xs font-medium hover:bg-teal-600/20 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
          <div className="space-y-2">
            {learnSkills.map((us) => (
              <div key={us.id} className="p-3 rounded-xl bg-surface-DEFAULT border border-white/[0.04] flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-white">{us.skill?.name}</span>
                  <span className="block text-[10px] text-teal-400 font-mono mt-0.5">{us.proficiency} Target</span>
                </div>
                <button onClick={() => handleRemoveSkill(us.id)} className="p-1 text-gray-600 hover:text-danger-400 rounded transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Edit Profile Modal ── */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setEditModalOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative w-full max-w-md bg-surface-raised border border-white/[0.08] rounded-2xl shadow-elevated animate-scale-in overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-primary-500 to-teal-400" />
            <div className="p-6 space-y-5">
              <button onClick={() => setEditModalOpen(false)} className="absolute top-5 right-5 p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.06]">
                <X className="w-4 h-4" />
              </button>
              <h3 className="font-heading text-lg font-bold text-white">Edit Profile</h3>
              <form onSubmit={handleUpdateProfile} className="space-y-3.5">
                <div>
                  <label className="block text-xs text-gray-400 font-medium mb-1.5">Full Name</label>
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-medium mb-1.5">Headline</label>
                  <input type="text" value={headline} onChange={(e) => setHeadline(e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-medium mb-1.5">Bio</label>
                  <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="input-field resize-none" />
                </div>
                <button type="submit" className="w-full btn-primary !py-3">Save Changes</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Skill Modal ── */}
      {skillModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setSkillModalOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative w-full max-w-md bg-surface-raised border border-white/[0.08] rounded-2xl shadow-elevated animate-scale-in overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-accent-400 to-primary-500" />
            <div className="p-6 space-y-5">
              <button onClick={() => setSkillModalOpen(false)} className="absolute top-5 right-5 p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.06]">
                <X className="w-4 h-4" />
              </button>
              <h3 className="font-heading text-lg font-bold text-white">
                Add {skillType === 'TEACH' ? 'Teaching Skill' : 'Learning Goal'}
              </h3>
              <form onSubmit={handleAddSkill} className="space-y-3.5">
                <div>
                  <label className="block text-xs text-gray-400 font-medium mb-1.5">Select Skill</label>
                  <select value={selectedSkillId} onChange={(e) => setSelectedSkillId(e.target.value)} className="input-field">
                    <option value="">-- Choose Skill --</option>
                    {categories.flatMap(c => c.skills || []).map((sk) => (
                      <option key={sk.id} value={sk.id}>{sk.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-medium mb-1.5">Proficiency</label>
                  <select value={proficiency} onChange={(e) => setProficiency(e.target.value)} className="input-field">
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                    <option value="EXPERT">Expert</option>
                  </select>
                </div>
                <button type="submit" className="w-full btn-primary !py-3">Add to Profile</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
