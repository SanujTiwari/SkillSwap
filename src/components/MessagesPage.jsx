import React, { useState, useEffect, useRef } from 'react';
import { api } from '../lib/api.js';
import { useStore } from '../store/useStore.js';
import { MessageSquare, Send, Calendar, Sparkles, Check, CheckCheck, RefreshCw } from 'lucide-react';

export default function MessagesPage() {
  const { activeDemoPersona, showToast, setActiveTab } = useStore();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, [activeDemoPersona]);

  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation.id);
    }
  }, [activeConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const res = await api.get('/conversations');
      const list = res.data.conversations || [];
      setConversations(list);
      if (list.length > 0 && !activeConversation) {
        setActiveConversation(list[0]);
      }
    } catch (err) {
      console.error('Fetch conversations error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (convId) => {
    try {
      const res = await api.get(`/conversations/${convId}/messages`);
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error('Fetch messages error:', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMsg.trim() || !activeConversation) return;

    const content = inputMsg;
    setInputMsg('');

    try {
      const res = await api.post(`/conversations/${activeConversation.id}/messages`, {
        content
      });
      setMessages(prev => [...prev, res.data.message]);
      fetchConversations();
    } catch (err) {
      showToast('Failed to send message', 'error');
    }
  };

  const partnerUser = activeConversation?.participants?.find(p => p.id !== activeDemoPersona.id) || activeConversation?.participants?.[0];

  return (
    <div className="h-[calc(100vh-140px)] min-h-[550px] bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in fade-in duration-300">
      
      {/* Conversations Sidebar */}
      <div className="w-full md:w-80 bg-slate-950 border-r border-slate-800/80 flex flex-col">
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-teal-400" />
            <h2 className="font-heading font-bold text-base text-white">Direct Messages</h2>
          </div>
          <button onClick={fetchConversations} className="text-slate-400 hover:text-white">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {loading ? (
            <div className="p-4 text-center text-slate-500 font-mono text-xs">Loading conversations...</div>
          ) : conversations.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-xs">
              No direct messages yet. Connect with peers in Discover!
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
                  className={`w-full p-3 rounded-2xl text-left flex items-center space-x-3 transition-colors ${
                    isSelected ? 'bg-teal-500/10 border border-teal-500/30' : 'hover:bg-slate-900/60'
                  }`}
                >
                  <img
                    src={partner?.profile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${partner?.profile?.username}`}
                    alt={partner?.profile?.fullName}
                    className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-700"
                  />
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-white truncate">
                        {partner?.profile?.fullName || 'Peer Match'}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{lastMsg}</p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Stream */}
      {activeConversation ? (
        <div className="flex-1 flex flex-col bg-slate-900/40">
          
          {/* Active Chat Header */}
          <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={partnerUser?.profile?.avatarUrl}
                alt={partnerUser?.profile?.fullName}
                className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700"
              />
              <div>
                <h3 className="font-heading font-bold text-sm text-white">
                  {partnerUser?.profile?.fullName}
                </h3>
                <p className="text-[10px] text-teal-400 font-mono">{partnerUser?.profile?.headline || 'Verified Peer'}</p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('sessions')}
              className="px-3 py-1.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold flex items-center space-x-1.5 hover:bg-teal-500/20 transition-all"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Schedule 1:1 Swap</span>
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((m) => {
              const isMine = m.senderId === activeDemoPersona.id;
              return (
                <div
                  key={m.id}
                  className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] space-y-1`}>
                    <div
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                        isMine
                          ? 'bg-gradient-to-r from-teal-500 to-sky-500 text-slate-950 font-medium rounded-br-none shadow-md shadow-teal-500/10'
                          : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none'
                      }`}
                    >
                      {m.content}
                    </div>
                    <span className={`block text-[9px] font-mono text-slate-500 ${isMine ? 'text-right' : 'text-left'}`}>
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="p-3 bg-slate-950 border-t border-slate-800 flex space-x-2">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Type your message to peer..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-teal-400"
            />
            <button
              type="submit"
              className="px-5 py-3 bg-gradient-to-r from-teal-500 to-sky-500 hover:opacity-95 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md shadow-teal-500/10 flex items-center space-x-1"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
          Select a conversation to start messaging.
        </div>
      )}

    </div>
  );
}
