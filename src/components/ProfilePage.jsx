import React, { useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import { useStore } from '../store/useStore.js';
import { User, Award, Flame, Star, ShieldCheck, Plus, Trash2, Edit3, Sparkles, X, CheckCircle2, Zap } from 'lucide-react';

export default function ProfilePage() {
  const { activeDemoPersona, showToast } = useStore();
  const [profileData, setProfileData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Profile Modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [hourlyRate, setHourlyRate] = useState(0);

  // Add Skill Modal
  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [skillType, setSkillType] = useState('TEACH');
  const [proficiency, setProficiency] = useState('INTERMEDIATE');

  useEffect(() => {
    fetchProfile();
    fetchCategories();
  }, [activeDemoPersona]);

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
    } catch (err) {
      console.error('Fetch profile error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/skills/categories');
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error('Fetch categories error:', err);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await api.put('/users/profile', {
        fullName,
        headline,
        bio,
        location,
        hourlyRate
      });
      showToast('Profile updated successfully!', 'success');
      setEditModalOpen(false);
      fetchProfile();
    } catch (err) {
      showToast('Failed to update profile', 'error');
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!selectedSkillId) return;

    try {
      await api.post('/skills/user', {
        skillId: selectedSkillId,
        type: skillType,
        proficiency
      });
      showToast('Skill added to profile!', 'success');
      setSkillModalOpen(false);
      fetchProfile();
    } catch (err) {
      showToast('Failed to add skill', 'error');
    }
  };

  const handleRemoveSkill = async (userSkillId) => {
    try {
      await api.delete(`/skills/user/${userSkillId}`);
      showToast('Skill removed', 'success');
      fetchProfile();
    } catch (err) {
      showToast('Failed to remove skill', 'error');
    }
  };

  if (loading) {
    return <div className="h-96 bg-slate-900/60 rounded-3xl border border-slate-800 animate-pulse p-8" />;
  }

  const p = profileData?.profile || {};
  const teachSkills = profileData?.skills?.filter(s => s.type === 'TEACH') || [];
  const learnSkills = profileData?.skills?.filter(s => s.type === 'LEARN') || [];
  const badges = profileData?.badges || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Profile Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          
          <div className="flex items-center space-x-5">
            <img
              src={p.avatarUrl}
              alt={p.fullName}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-slate-950 border-2 border-teal-500/40 shadow-xl"
            />
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">{p.fullName}</h1>
                <ShieldCheck className="w-5 h-5 text-teal-400" />
              </div>
              <p className="text-xs sm:text-sm text-teal-400 font-mono">{p.headline}</p>
              <p className="text-xs text-slate-400">{p.location || 'Global Remote'} • Timezone: {p.timezone}</p>
            </div>
          </div>

          <button
            onClick={() => setEditModalOpen(true)}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-2xl text-xs flex items-center space-x-2 border border-slate-700 transition-colors"
          >
            <Edit3 className="w-4 h-4 text-teal-400" />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* Gamification Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80 text-xs font-mono">
          
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-slate-500 text-[10px] uppercase block">Level Rank</span>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <span className="text-lg font-bold text-teal-300">Level {p.level || 1}</span>
              <span className="text-slate-400 text-[11px]">({p.totalXp || 0} XP)</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-slate-500 text-[10px] uppercase block">Learning Streak</span>
            <div className="flex items-center space-x-1.5 mt-0.5 text-amber-400">
              <Flame className="w-4 h-4 fill-amber-400/20" />
              <span className="text-lg font-bold">{p.learningStreak || 0} Days</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-slate-500 text-[10px] uppercase block">Rating Score</span>
            <div className="flex items-center space-x-1.5 mt-0.5 text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
              <span className="text-lg font-bold">{p.rating || 5.0}</span>
              <span className="text-slate-500 text-[10px]">({p.reviewCount} reviews)</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-slate-500 text-[10px] uppercase block">Completed Swaps</span>
            <div className="flex items-center space-x-1.5 mt-0.5 text-sky-300">
              <CheckCircle2 className="w-4 h-4 text-sky-400" />
              <span className="text-lg font-bold">{p.completedSessions || 0} Sessions</span>
            </div>
          </div>

        </div>
      </div>

      {/* Gamification Badges Grid */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-bold text-lg text-white flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>Earned Gamification Badges ({badges.length})</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {badges.map((ub) => (
            <div
              key={ub.id}
              className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2 hover:border-amber-500/40 transition-colors"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-xs font-bold text-white">{ub.badge?.title}</span>
                <span className="block text-[10px] text-slate-400 mt-0.5 line-clamp-2">{ub.badge?.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills Manager Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Teach Skills */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-base text-white">Skills You Teach</h3>
            <button
              onClick={() => {
                setSkillType('TEACH');
                setSkillModalOpen(true);
              }}
              className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold flex items-center space-x-1 hover:bg-teal-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add Skill</span>
            </button>
          </div>

          <div className="space-y-2">
            {teachSkills.map((us) => (
              <div
                key={us.id}
                className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-white block">{us.skill?.name}</span>
                  <span className="text-[10px] text-teal-400 font-mono">{us.proficiency} • {us.yearsExperience} yrs exp</span>
                </div>
                <button onClick={() => handleRemoveSkill(us.id)} className="text-slate-500 hover:text-rose-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Learn Skills */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-base text-white">Skills You Want to Learn</h3>
            <button
              onClick={() => {
                setSkillType('LEARN');
                setSkillModalOpen(true);
              }}
              className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs font-semibold flex items-center space-x-1 hover:bg-sky-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add Goal</span>
            </button>
          </div>

          <div className="space-y-2">
            {learnSkills.map((us) => (
              <div
                key={us.id}
                className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-white block">{us.skill?.name}</span>
                  <span className="text-[10px] text-sky-400 font-mono">{us.proficiency} Target</span>
                </div>
                <button onClick={() => handleRemoveSkill(us.id)} className="text-slate-500 hover:text-rose-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* EDIT PROFILE MODAL */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative animate-in zoom-in-95">
            <button onClick={() => setEditModalOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-heading text-xl font-bold text-white">Edit Profile Details</h3>

            <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-teal-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Headline</label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-teal-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-teal-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-teal-500 text-slate-950 font-bold rounded-2xl text-xs"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ADD SKILL MODAL */}
      {skillModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative animate-in zoom-in-95">
            <button onClick={() => setSkillModalOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-heading text-xl font-bold text-white">
              Add {skillType === 'TEACH' ? 'Teaching Skill' : 'Learning Goal'}
            </h3>

            <form onSubmit={handleAddSkill} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Select Skill</label>
                <select
                  value={selectedSkillId}
                  onChange={(e) => setSelectedSkillId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-teal-400"
                >
                  <option value="">-- Choose Skill --</option>
                  {categories.flatMap(c => c.skills || []).map((sk) => (
                    <option key={sk.id} value={sk.id}>{sk.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Proficiency Level</label>
                <select
                  value={proficiency}
                  onChange={(e) => setProficiency(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-teal-400"
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                  <option value="EXPERT">Expert</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-teal-500 text-slate-950 font-bold rounded-2xl text-xs"
              >
                Add to Profile
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
