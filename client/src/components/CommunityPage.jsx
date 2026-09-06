import React, { useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import { useStore } from '../store/useStore.js';
import { Users, Heart, MessageSquare, Plus, X, Send } from 'lucide-react';

export default function CommunityPage() {
  const { activeDemoPersona, showToast } = useStore();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState('ALL');

  const [modalOpen, setModalOpen] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postCategory, setPostCategory] = useState('PROGRAMMING');
  const [submitting, setSubmitting] = useState(false);

  const [activePostId, setActivePostId] = useState(null);
  const [commentText, setCommentText] = useState('');

  useEffect(() => { fetchPosts(); }, [selectedCat, activeDemoPersona]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/posts', { params: { category: selectedCat } });
      setPosts(res.data.posts || []);
    } catch (err) { console.error('Fetch posts error:', err); }
    finally { setLoading(false); }
  };

  const handleLike = async (postId) => {
    try { await api.post(`/posts/${postId}/like`); fetchPosts(); }
    catch (err) { showToast('Failed to like post', 'error'); }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!postTitle || !postContent) return;
    setSubmitting(true);
    try {
      await api.post('/posts', { title: postTitle, content: postContent, category: postCategory });
      showToast('Post published!', 'success');
      setModalOpen(false);
      setPostTitle('');
      setPostContent('');
      fetchPosts();
    } catch (err) { showToast('Failed to publish post', 'error'); }
    finally { setSubmitting(false); }
  };

  const handleAddComment = async (postId) => {
    if (!commentText.trim()) return;
    try {
      await api.post(`/posts/${postId}/comments`, { content: commentText });
      setCommentText('');
      fetchPosts();
    } catch (err) { showToast('Failed to add comment', 'error'); }
  };

  const categories = [
    { id: 'ALL', name: 'All Topics' },
    { id: 'PROGRAMMING', name: 'Programming' },
    { id: 'DESIGN', name: 'Design' },
    { id: 'CAREER', name: 'Career' },
    { id: 'BUSINESS', name: 'Product' },
    { id: 'LANGUAGES', name: 'Languages' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Hero ── */}
      <div className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/30 via-surface-raised to-surface-raised" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-danger-500/5 rounded-full blur-3xl -mr-12 -mb-12" />
        <div className="relative z-10 p-6 sm:p-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-600/10 border border-primary-500/20 text-primary-300 text-xs font-medium">
              <Users className="w-3.5 h-3.5" />
              <span>Knowledge Hub</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-white leading-tight">
              Community <span className="text-gradient-primary">Discussions</span>
            </h1>
            <p className="text-gray-400 text-sm max-w-xl">
              Share learnings, code patterns, and career insights with fellow peers.
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="btn-primary flex items-center gap-2 !rounded-xl"
            >
              <Plus className="w-4 h-4" />
              <span>Create Post</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Category Filter ── */}
      <div className="flex overflow-x-auto gap-2 pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCat(cat.id)}
            className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              selectedCat === cat.id
                ? 'bg-primary-600 text-white shadow-glow-sm'
                : 'bg-surface-raised border border-white/[0.04] text-gray-400 hover:text-white hover:border-white/[0.08]'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* ── Feed ── */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-surface-raised rounded-2xl border border-white/[0.04] animate-pulse shimmer" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 bg-surface-raised rounded-2xl border border-white/[0.04] space-y-3">
          <Users className="w-10 h-10 text-gray-700 mx-auto" />
          <h3 className="text-base font-semibold text-gray-300 font-heading">No posts yet</h3>
          <p className="text-xs text-gray-500">Be the first to share your insights!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="glass-card rounded-2xl p-5 space-y-4">
              {/* Author */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={post.author?.profile?.avatarUrl}
                    alt={post.author?.profile?.fullName}
                    className="w-10 h-10 rounded-xl bg-surface-DEFAULT border border-white/[0.06]"
                  />
                  <div>
                    <h3 className="font-heading font-semibold text-sm text-white">{post.author?.profile?.fullName}</h3>
                    <p className="text-[10px] text-gray-500 font-mono">
                      {post.author?.profile?.headline} · {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className="badge-primary !text-[10px] font-mono uppercase">{post.category}</span>
              </div>

              {/* Content */}
              <div className="space-y-1.5">
                <h2 className="text-base font-bold text-white font-heading">{post.title}</h2>
                <p className="text-xs text-gray-400 leading-relaxed whitespace-pre-line">{post.content}</p>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-white/[0.04] flex items-center gap-5 text-xs text-gray-400">
                <button
                  onClick={() => handleLike(post.id)}
                  className="flex items-center gap-1.5 hover:text-danger-400 transition-colors"
                >
                  <Heart className="w-4 h-4 text-danger-400 fill-danger-400/20" />
                  <span>{post.likesCount || 0}</span>
                </button>
                <button
                  onClick={() => setActivePostId(activePostId === post.id ? null : post.id)}
                  className="flex items-center gap-1.5 hover:text-primary-300 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-primary-400" />
                  <span>{post.comments?.length || 0}</span>
                </button>
              </div>

              {/* Comments Drawer */}
              {activePostId === post.id && (
                <div className="pt-3 space-y-3 border-t border-white/[0.04] animate-fade-in">
                  {post.comments?.map((c) => (
                    <div key={c.id} className="p-3 rounded-xl bg-surface-DEFAULT border border-white/[0.04] flex items-start gap-2.5">
                      <img src={c.author?.profile?.avatarUrl} alt="" className="w-6 h-6 rounded-md bg-surface-raised shrink-0" />
                      <div className="text-xs">
                        <span className="font-semibold text-white">{c.author?.profile?.fullName}</span>
                        <p className="text-gray-400 mt-0.5">{c.content}</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write a comment..."
                      className="input-field !py-2 !text-xs flex-1"
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      className="btn-primary !px-4 !py-2 !text-xs !rounded-lg flex items-center gap-1"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Create Post Modal ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative w-full max-w-lg bg-surface-raised border border-white/[0.08] rounded-2xl shadow-elevated animate-scale-in overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-primary-500 to-accent-400" />
            <div className="p-6 space-y-5">
              <button onClick={() => setModalOpen(false)} className="absolute top-5 right-5 p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.06]">
                <X className="w-4 h-4" />
              </button>
              <h3 className="font-heading text-lg font-bold text-white">New Community Post</h3>
              <form onSubmit={handleCreatePost} className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 font-medium mb-1.5">Category</label>
                  <select value={postCategory} onChange={(e) => setPostCategory(e.target.value)} className="input-field">
                    <option value="PROGRAMMING">Programming & Code</option>
                    <option value="DESIGN">UI/UX & Design</option>
                    <option value="CAREER">Career Growth</option>
                    <option value="BUSINESS">Product & SaaS</option>
                    <option value="LANGUAGES">Languages</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-medium mb-1.5">Title</label>
                  <input
                    type="text"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    placeholder="e.g., How I built a reusable design system..."
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-medium mb-1.5">Content</label>
                  <textarea
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    rows={5}
                    placeholder="Share your technical learnings..."
                    className="input-field resize-none"
                  />
                </div>
                <button type="submit" disabled={submitting} className="w-full btn-primary !py-3 disabled:opacity-50">
                  {submitting ? 'Publishing...' : 'Publish Post'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
