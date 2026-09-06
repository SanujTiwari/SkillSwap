import React, { useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import { useStore } from '../store/useStore.js';
import { Zap, Sparkles, CheckCircle2, Clock, Layers, Send, X, Bot, RefreshCw } from 'lucide-react';

export default function AIRoadmapPage() {
  const { showToast, activeDemoPersona } = useStore();
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [targetRole, setTargetRole] = useState('Full-Stack Engineer');
  const [generating, setGenerating] = useState(false);

  const [coachOpen, setCoachOpen] = useState(false);
  const [coachMessages, setCoachMessages] = useState([
    { sender: 'ai', text: 'Hello! I\'m your SkillSwap AI Coach. How can I help accelerate your learning today?' }
  ]);
  const [coachInput, setCoachInput] = useState('');
  const [coachLoading, setCoachLoading] = useState(false);

  useEffect(() => { fetchRoadmaps(); }, [activeDemoPersona]);

  const fetchRoadmaps = async () => {
    setLoading(true);
    try {
      const res = await api.get('/roadmaps');
      setRoadmaps(res.data.roadmaps || []);
    } catch (err) { console.error('Fetch roadmaps error:', err); }
    finally { setLoading(false); }
  };

  const handleGenerateRoadmap = async () => {
    setGenerating(true);
    try {
      await api.post('/roadmaps/generate', { targetRole, currentSkills: activeDemoPersona.teach });
      showToast(`Generated AI Roadmap for ${targetRole}!`, 'success');
      fetchRoadmaps();
    } catch (err) { showToast('Failed to generate roadmap', 'error'); }
    finally { setGenerating(false); }
  };

  const handleToggleStageStatus = async (stageId, currentStatus) => {
    const nextStatus = currentStatus === 'COMPLETED' ? 'NOT_STARTED' : currentStatus === 'IN_PROGRESS' ? 'COMPLETED' : 'IN_PROGRESS';
    try {
      await api.put(`/roadmaps/stage/${stageId}`, { status: nextStatus });
      showToast('Stage updated', 'success');
      fetchRoadmaps();
    } catch (err) { showToast('Failed to update stage', 'error'); }
  };

  const handleSendCoachMsg = async (e) => {
    e.preventDefault();
    if (!coachInput.trim()) return;
    const userText = coachInput;
    setCoachMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setCoachInput('');
    setCoachLoading(true);
    try {
      const res = await api.post('/ai/coach', { prompt: userText });
      const reply = res.data.coachResponse?.reply || 'Focus on your active roadmap stage and practice pair coding!';
      setCoachMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    } catch (err) {
      setCoachMessages(prev => [...prev, { sender: 'ai', text: 'Sorry, I ran into an issue.' }]);
    } finally { setCoachLoading(false); }
  };

  const activeRoadmap = roadmaps[0];

  return (
    <div className="space-y-6 animate-fade-in relative">

      {/* ── Hero & Generator ── */}
      <div className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/30 via-surface-raised to-surface-raised" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="relative z-10 p-6 sm:p-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-300 text-xs font-medium">
              <Zap className="w-3.5 h-3.5" />
              <span>AI Roadmap Architect</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-white leading-tight">
              Personalized <span className="text-gradient-warm">Learning Roadmaps</span>
            </h1>

            <p className="text-gray-400 text-sm max-w-xl">
              Generate customized learning paths tailored to your career goals. Track progress step-by-step.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="Target Role (e.g., Full-Stack Engineer, AI Specialist)..."
                className="input-field flex-1 !rounded-xl"
              />
              <button
                onClick={handleGenerateRoadmap}
                disabled={generating}
                className="btn-primary flex items-center justify-center gap-2 !rounded-xl shrink-0 disabled:opacity-50"
              >
                {generating ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Roadmap</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Active Roadmap ── */}
      {loading ? (
        <div className="h-96 bg-surface-raised rounded-2xl border border-white/[0.04] animate-pulse shimmer" />
      ) : !activeRoadmap ? (
        <div className="text-center py-16 bg-surface-raised rounded-2xl border border-white/[0.04] space-y-3">
          <Layers className="w-10 h-10 text-gray-700 mx-auto" />
          <h3 className="text-base font-semibold text-gray-300 font-heading">No roadmap yet</h3>
          <p className="text-xs text-gray-500">Generate one above to get started!</p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Overview Card */}
          <div className="glass-card rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase text-primary-400 font-semibold tracking-wider">
                Target: {activeRoadmap.targetRole}
              </span>
              <h2 className="text-xl font-bold text-white font-heading mt-1">{activeRoadmap.title}</h2>
              <p className="text-xs text-gray-400 mt-1">{activeRoadmap.description}</p>
            </div>
            <div className="w-full md:w-56 p-4 rounded-xl bg-surface-DEFAULT border border-white/[0.04] space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-gray-500">Progress</span>
                <span className="text-primary-300 font-bold">{activeRoadmap.progressPercent}%</span>
              </div>
              <div className="w-full bg-surface-overlay h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-primary-500 to-teal-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${activeRoadmap.progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Timeline Stages */}
          <div className="space-y-4">
            {activeRoadmap.stages?.map((stage, idx) => {
              const skills = JSON.parse(stage.skillsJson || '[]');
              const resources = JSON.parse(stage.resourcesJson || '[]');
              const projects = JSON.parse(stage.projectsJson || '[]');
              const isDone = stage.status === 'COMPLETED';
              const isInProgress = stage.status === 'IN_PROGRESS';

              return (
                <div
                  key={stage.id}
                  className={`glass-card rounded-2xl p-5 ${
                    isDone ? '!border-primary-500/30' : isInProgress ? '!border-teal-500/30 shadow-glow-teal' : ''
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-surface-DEFAULT border border-white/[0.06] text-primary-400 font-mono font-bold text-sm flex items-center justify-center">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <h3 className="text-base font-bold text-white font-heading">{stage.title}</h3>
                        <span className={`${isDone ? 'badge-primary' : isInProgress ? 'badge-teal' : 'badge'} bg-surface-overlay text-gray-400 border border-white/[0.06] !text-[10px] font-mono uppercase`}>
                          {stage.status.replace('_', ' ')}
                        </span>
                      </div>

                      <p className="text-xs text-gray-400 leading-relaxed pl-11">{stage.objective}</p>

                      <div className="pl-11 pt-1 flex flex-wrap gap-3 text-xs">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {skills.map((sk, i) => (
                            <span key={i} className="badge-primary !text-[10px]">{sk}</span>
                          ))}
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-500 font-mono text-[11px]">
                          <Clock className="w-3.5 h-3.5 text-accent-400" />
                          <span>{stage.estimatedHours}h</span>
                        </div>
                      </div>

                      <div className="pl-11 pt-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                        {projects.length > 0 && (
                          <div className="p-3 rounded-xl bg-surface-DEFAULT border border-white/[0.04]">
                            <span className="text-[10px] font-mono uppercase text-accent-400 font-semibold block mb-1">Project</span>
                            <span className="text-gray-300">{projects[0]}</span>
                          </div>
                        )}
                        {resources.length > 0 && (
                          <div className="p-3 rounded-xl bg-surface-DEFAULT border border-white/[0.04]">
                            <span className="text-[10px] font-mono uppercase text-primary-400 font-semibold block mb-1">Resources</span>
                            <span className="text-gray-300">{resources.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleStageStatus(stage.id, stage.status)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                        isDone ? 'btn-primary' : 'btn-secondary'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isDone ? 'Completed' : 'Mark Progress'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Floating AI Coach ── */}
      <div className="fixed bottom-6 right-6 z-50">
        {!coachOpen ? (
          <button
            onClick={() => setCoachOpen(true)}
            className="p-3.5 rounded-full btn-primary !rounded-full shadow-glow-md flex items-center gap-2 hover:scale-105 transition-transform"
          >
            <Bot className="w-5 h-5" />
            <span className="hidden sm:inline font-mono text-xs uppercase tracking-wider">AI Coach</span>
          </button>
        ) : (
          <div className="bg-surface-raised border border-white/[0.08] rounded-2xl w-80 sm:w-96 shadow-elevated overflow-hidden flex flex-col h-[480px] animate-slide-up">
            {/* Header */}
            <div className="p-4 bg-surface-DEFAULT border-b border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-primary-600/15 text-primary-400 border border-primary-500/25">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-white">AI Coach</h4>
                  <span className="text-[10px] text-primary-400 font-mono">24/7 Assistant</span>
                </div>
              </div>
              <button onClick={() => setCoachOpen(false)} className="p-1 text-gray-500 hover:text-white rounded-lg hover:bg-white/[0.06]">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
              {coachMessages.map((m, i) => (
                <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-xl leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-primary-600 text-white font-medium rounded-br-none'
                      : 'bg-surface-DEFAULT border border-white/[0.04] text-gray-300 rounded-bl-none'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {coachLoading && (
                <div className="text-gray-500 text-[10px] font-mono animate-pulse">Thinking...</div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSendCoachMsg} className="p-3 bg-surface-DEFAULT border-t border-white/[0.06] flex gap-2">
              <input
                type="text"
                value={coachInput}
                onChange={(e) => setCoachInput(e.target.value)}
                placeholder="Ask your AI coach..."
                className="input-field !py-2 !text-xs flex-1"
              />
              <button type="submit" className="p-2 btn-primary !rounded-lg !px-3">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
