import React, { useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import { useStore } from '../store/useStore.js';
import { Zap, Sparkles, CheckCircle2, Clock, BookOpen, Layers, ArrowRight, MessageSquare, Send, X, Bot, RefreshCw } from 'lucide-react';

export default function AIRoadmapPage() {
  const { showToast, activeDemoPersona } = useStore();
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);

  // AI Skill Profiler Input
  const [targetRole, setTargetRole] = useState('Full-Stack Engineer');
  const [generating, setGenerating] = useState(false);

  // AI Coach Floating Assistant
  const [coachOpen, setCoachOpen] = useState(false);
  const [coachMessages, setCoachMessages] = useState([
    { sender: 'ai', text: 'Hello! I am your SkillSwap AI Coach. How can I help you accelerate your learning today?' }
  ]);
  const [coachInput, setCoachInput] = useState('');
  const [coachLoading, setCoachLoading] = useState(false);

  useEffect(() => {
    fetchRoadmaps();
  }, [activeDemoPersona]);

  const fetchRoadmaps = async () => {
    setLoading(true);
    try {
      const res = await api.get('/roadmaps');
      setRoadmaps(res.data.roadmaps || []);
    } catch (err) {
      console.error('Fetch roadmaps error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateRoadmap = async () => {
    setGenerating(true);
    try {
      const res = await api.post('/roadmaps/generate', {
        targetRole,
        currentSkills: activeDemoPersona.teach
      });
      showToast(`Generated new AI Roadmap for ${targetRole}!`, 'success');
      fetchRoadmaps();
    } catch (err) {
      showToast('Failed to generate roadmap', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleToggleStageStatus = async (stageId, currentStatus) => {
    const nextStatus = currentStatus === 'COMPLETED' ? 'NOT_STARTED' : currentStatus === 'IN_PROGRESS' ? 'COMPLETED' : 'IN_PROGRESS';
    try {
      await api.put(`/roadmaps/stage/${stageId}`, { status: nextStatus });
      showToast('Updated stage status', 'success');
      fetchRoadmaps();
    } catch (err) {
      showToast('Failed to update stage status', 'error');
    }
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
      const reply = res.data.coachResponse?.reply || 'Stay focused on your active roadmap stage and practice with peer partners!';
      setCoachMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    } catch (err) {
      setCoachMessages(prev => [...prev, { sender: 'ai', text: 'Sorry, I ran into an issue processing your request.' }]);
    } finally {
      setCoachLoading(false);
    }
  };

  const activeRoadmap = roadmaps[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 relative">
      
      {/* Header & AI Generator Box */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/40 p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs font-mono font-semibold">
            <Zap className="w-3.5 h-3.5 text-sky-400" />
            <span>AI Roadmap & Skill Profiler</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-heading">
            Personalized AI Learning Roadmaps & <br />
            <span className="bg-gradient-to-r from-sky-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
              Stage Progress Tracking
            </span>
          </h1>

          <p className="text-slate-300 text-sm leading-relaxed">
            Generate custom learning paths tailored to your career target role. Every stage links directly to recommended peer swap topics, projects, and resources.
          </p>

          {/* AI Generator Form */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="Target Role (e.g., Full-Stack Engineer, AI Specialist, UI Designer)..."
              className="flex-1 bg-slate-950 border border-slate-700/80 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-sky-400"
            />
            <button
              onClick={handleGenerateRoadmap}
              disabled={generating}
              className="px-6 py-3 bg-gradient-to-r from-sky-500 to-teal-400 text-slate-950 font-bold rounded-2xl text-sm flex items-center justify-center space-x-2 transition-all shadow-lg shadow-sky-500/20"
            >
              {generating ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate New Roadmap</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Active Roadmap Timeline */}
      {loading ? (
        <div className="h-96 bg-slate-900/60 rounded-3xl border border-slate-800 animate-pulse p-8" />
      ) : !activeRoadmap ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800 p-8 space-y-4">
          <Layers className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-300">No active roadmap found</h3>
          <p className="text-sm text-slate-500">Generate a personalized roadmap above to get started!</p>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Roadmap Overview Header Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase text-sky-400 tracking-wider">
                Target Role: {activeRoadmap.targetRole}
              </span>
              <h2 className="text-2xl font-bold text-white font-heading mt-1">{activeRoadmap.title}</h2>
              <p className="text-xs text-slate-400 mt-1">{activeRoadmap.description}</p>
            </div>

            {/* Progress Bar */}
            <div className="w-full md:w-64 bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Roadmap Progress</span>
                <span className="text-teal-300 font-bold">{activeRoadmap.progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-teal-400 to-sky-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${activeRoadmap.progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Timeline Stages List */}
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
                  className={`bg-slate-900/80 border rounded-3xl p-6 transition-all ${
                    isDone
                      ? 'border-teal-500/40 bg-teal-950/10'
                      : isInProgress
                      ? 'border-sky-500/50 shadow-lg shadow-sky-500/5'
                      : 'border-slate-800'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    
                    {/* Stage Left Content */}
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center space-x-3">
                        <span className="w-8 h-8 rounded-xl bg-slate-950 border border-slate-800 text-teal-400 font-mono font-bold text-sm flex items-center justify-center">
                          0{idx + 1}
                        </span>
                        <h3 className="text-lg font-bold text-white font-heading">{stage.title}</h3>

                        {/* Status Badge */}
                        <span
                          className={`px-3 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold ${
                            isDone
                              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                              : isInProgress
                              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {stage.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed pl-11">{stage.objective}</p>

                      {/* Skills & Details */}
                      <div className="pl-11 pt-2 flex flex-wrap gap-4 text-xs">
                        {/* Skills */}
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-mono uppercase text-slate-400">Skills:</span>
                          {skills.map((sk, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-slate-950 text-sky-300 font-mono text-[11px] border border-slate-800">
                              {sk}
                            </span>
                          ))}
                        </div>

                        {/* Hours */}
                        <div className="flex items-center space-x-1.5 text-slate-400 font-mono text-[11px]">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          <span>Est. {stage.estimatedHours} Hours</span>
                        </div>
                      </div>

                      {/* Projects & Resources */}
                      <div className="pl-11 pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        {projects.length > 0 && (
                          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                            <span className="text-[10px] font-mono uppercase text-amber-400 block mb-1">
                              Recommended Project:
                            </span>
                            <span className="text-slate-300 font-medium">{projects[0]}</span>
                          </div>
                        )}
                        {resources.length > 0 && (
                          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                            <span className="text-[10px] font-mono uppercase text-sky-400 block mb-1">
                              Learning Resources:
                            </span>
                            <span className="text-slate-300 font-medium">{resources.join(', ')}</span>
                          </div>
                        )}
                      </div>

                    </div>

                    {/* Toggle Status Action Button */}
                    <div>
                      <button
                        onClick={() => handleToggleStageStatus(stage.id, stage.status)}
                        className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center space-x-2 ${
                          isDone
                            ? 'bg-teal-500 text-slate-950 hover:bg-teal-400'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{isDone ? 'Completed' : 'Mark Progress'}</span>
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* FLOATING AI COACH CHAT WIDGET */}
      <div className="fixed bottom-6 right-6 z-50">
        {!coachOpen ? (
          <button
            onClick={() => setCoachOpen(true)}
            className="p-4 rounded-full bg-gradient-to-r from-teal-500 to-sky-500 text-slate-950 font-bold shadow-2xl shadow-teal-500/30 flex items-center space-x-2 hover:scale-105 transition-transform"
          >
            <Bot className="w-6 h-6" />
            <span className="hidden sm:inline font-mono text-xs uppercase tracking-wider">AI Coach</span>
          </button>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-80 sm:w-96 shadow-2xl overflow-hidden flex flex-col h-[480px] animate-in slide-in-from-bottom-4">
            
            {/* Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-white">SkillSwap AI Coach</h4>
                  <span className="text-[10px] text-teal-400 font-mono">24/7 Contextual Assistant</span>
                </div>
              </div>
              <button onClick={() => setCoachOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat History */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
              {coachMessages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-teal-500 text-slate-950 font-semibold rounded-br-none'
                        : 'bg-slate-950 border border-slate-800 text-slate-300 rounded-bl-none'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {coachLoading && (
                <div className="text-slate-500 text-[10px] font-mono animate-pulse">
                  AI Coach thinking...
                </div>
              )}
            </div>

            {/* Form Input */}
            <form onSubmit={handleSendCoachMsg} className="p-3 bg-slate-950 border-t border-slate-800 flex space-x-2">
              <input
                type="text"
                value={coachInput}
                onChange={(e) => setCoachInput(e.target.value)}
                placeholder="Ask your learning coach..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-400"
              />
              <button
                type="submit"
                className="p-2 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl font-bold transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>
        )}
      </div>

    </div>
  );
}
