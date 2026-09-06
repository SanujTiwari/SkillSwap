import React, { useState, useEffect, useRef } from 'react';
import { api } from '../lib/api.js';
import { useStore } from '../store/useStore.js';
import { MessageSquare, Send, Calendar, RefreshCw } from 'lucide-react';

export default function MessagesPage() {
  const { activeDemoPersona, showToast, setActiveTab } = useStore();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => { fetchConversations(); }, [activeDemoPersona]);
  useEffect(() => { if (activeConversation) fetchMessages(activeConversation.id); }, [activeConversation]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const res = await api.get('/conversations');
      const list = res.data.conversations || [];
      setConversations(list);
      if (list.length > 0 && !activeConversation) setActiveConversation(list[0]);
    } catch (err) { console.error('Fetch conversations error:', err); }
    finally { setLoading(false); }
  };

  const fetchMessages = async (convId) => {
    try {
      const res = await api.get(`/conversations/${convId}/messages`);
      setMessages(res.data.messages || []);
    } catch (err) { console.error('Fetch messages error:', err); }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMsg.trim() || !activeConversation) return;
    const content = inputMsg;
    setInputMsg('');
    try {
      const res = await api.post(`/conversations/${activeConversation.id}/messages`, { content });
      setMessages(prev => [...prev, res.data.message]);
      fetchConversations();
    } catch (err) { showToast('Failed to send message', 'error'); }
  };

  const partnerUser = activeConversation?.participants?.find(p => p.id !== activeDemoPersona.id) || activeConversation?.participants?.[0];

  return (
    <div className="h-[calc(100vh-140px)] min-h-[580px] bg-surface-raised border border-white/[0.06] rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-elevated animate-fade-in">

      {/* ── Sidebar ── */}
      <div className="w-full md:w-80 bg-surface-DEFAULT/80 border-r border-white/[0.06] flex flex-col shrink-0">
        <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary-400" />
            <h2 className="font-heading font-bold text-sm text-white">Messages</h2>
          </div>
          <button onClick={fetchConversations} className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.04]">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {loading ? (
            <div className="p-4 text-center text-gray-500 font-mono text-xs">Loading...</div>
          ) : conversations.length === 0 ? (
            <div className="p-6 text-center text-gray-500 text-xs">
              No active threads. Connect with peers!
            </div>
          ) : (
            conversations.map((conv) => {
              const partner = conv.participants?.find(p => p.id !== activeDemoPersona.id) || conv.participants?.[0];
              const lastMsg = conv.messages?.[0]?.content || 'Connected on SkillSwap';
              const isSelected = activeConversation?.id === conv.id;

              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveConversation(conv)}
                  className={`w-full p-3 rounded-xl text-left flex items-center gap-3 transition-all ${
                    isSelected
                      ? 'bg-primary-600/10 border border-primary-500/20'
                      : 'hover:bg-white/[0.03] border border-transparent'
                  }`}
                >
                  <img
                    src={partner?.profile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${partner?.profile?.username}`}
                    alt={partner?.profile?.fullName}
                    className="w-10 h-10 rounded-xl bg-surface-DEFAULT border border-white/[0.06] object-cover"
                  />
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className={`font-semibold text-xs truncate ${isSelected ? 'text-primary-300' : 'text-white'}`}>
                        {partner?.profile?.fullName || 'Peer Match'}
                      </span>
                      <span className="text-[10px] text-gray-600 font-mono">
                        {new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 truncate mt-0.5">{lastMsg}</p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ── Chat Thread ── */}
      {activeConversation ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 bg-surface-DEFAULT/80 border-b border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={partnerUser?.profile?.avatarUrl}
                alt={partnerUser?.profile?.fullName}
                className="w-9 h-9 rounded-lg bg-surface-DEFAULT border border-white/[0.06]"
              />
              <div>
                <h3 className="font-heading font-semibold text-sm text-white">{partnerUser?.profile?.fullName}</h3>
                <p className="text-[10px] text-primary-400 font-mono">{partnerUser?.profile?.headline || 'Verified Peer'}</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('sessions')}
              className="btn-secondary !px-3 !py-1.5 !text-xs !rounded-lg flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5 text-primary-400" />
              <span className="hidden sm:inline">Schedule Swap</span>
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((m) => {
              const isMine = m.senderId === activeDemoPersona.id;
              return (
                <div key={m.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                  <div className="max-w-[80%] space-y-1">
                    <div
                      className={`p-3 rounded-xl text-xs leading-relaxed ${
                        isMine
                          ? 'bg-primary-600 text-white font-medium rounded-br-none shadow-glow-sm'
                          : 'bg-surface-DEFAULT border border-white/[0.04] text-gray-200 rounded-bl-none'
                      }`}
                    >
                      {m.content}
                    </div>
                    <span className={`block text-[9px] font-mono text-gray-600 ${isMine ? 'text-right' : 'text-left'}`}>
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-3 bg-surface-DEFAULT border-t border-white/[0.06] flex gap-2">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Type your message..."
              className="input-field !py-2.5 !text-xs flex-1"
            />
            <button type="submit" className="btn-primary !px-4 !py-2.5 !rounded-xl flex items-center gap-1">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-600 text-xs">
          Select a conversation to start chatting
        </div>
      )}
    </div>
  );
}
