import React, { useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import { useStore } from '../store/useStore.js';
import { Users, Heart, MessageSquare, Plus, Sparkles, Send, X, RefreshCw } from 'lucide-react';

export default function CommunityPage() {
  const { activeDemoPersona, showToast } = useStore();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState('ALL');

  // Create Post Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postCategory, setPostCategory] = useState('PROGRAMMING');
  const [submitting, setSubmitting] = useState(false);

  // Active Comment Drawer state
  const [activePostId, setActivePostId] = useState(null);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    fetchPosts();
  }, [selectedCat, activeDemoPersona]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/posts', { params: { category: selectedCat } });
      setPosts(res.data.posts || []);
    } catch (err) {
      console.error('Fetch posts error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const res = await api.post(`/posts/${postId}/like`);
      fetchPosts();
    } catch (err) {
      showToast('Failed to like post', 'error');
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!postTitle || !postContent) return;
    setSubmitting(true);

    try {
      await api.post('/posts', {
        title: postTitle,
        content: postContent,
        category: postCategory
      });
      showToast('Post published to Community Feed!', 'success');
      setModalOpen(false);
      setPostTitle('');
      setPostContent('');
      fetchPosts();
    } catch (err) {
      showToast('Failed to publish post', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddComment = async (postId) => {
    if (!commentText.trim()) return;
    try {
      await api.post(`/posts/${postId}/comments`, { content: commentText });
      setCommentText('');
      fetchPosts();
    } catch (err) {
      showToast('Failed to add comment', 'error');
    }
  };

  const categories = [
    { id: 'ALL', name: 'All Topics' },
    { id: 'PROGRAMMING', name: 'Programming & Code' },
    { id: 'DESIGN', name: 'UI/UX & Design' },
    { id: 'CAREER', name: 'Career Growth' },
    { id: 'BUSINESS', name: 'Product & Business' },
    { id: 'LANGUAGES', name: 'Languages' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30 p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-semibold">
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span>Peer Knowledge Exchange</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-heading">
            Community Discussions & <br />
            <span className="bg-gradient-to-r from-amber-400 via-teal-300 to-sky-400 bg-clip-text text-transparent">
              Learner Insights
            </span>
          </h1>

          <p className="text-slate-300 text-sm leading-relaxed">
            Share code patterns, design tokens, career tips, and lessons learned from your 1:1 SkillSwap sessions. Earn the Community Champion badge.
          </p>

          <button
            onClick={() => setModalOpen(true)}
            className="px-6 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold rounded-2xl text-sm flex items-center space-x-2 transition-all shadow-lg shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Create Community Post</span>
          </button>
        </div>
      </div>

      {/* Categories Filter Pills */}
      <div className="flex overflow-x-auto pb-2 space-x-2 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCat(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCat === cat.id
                ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Feed List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-slate-900/60 rounded-3xl border border-slate-800 animate-pulse p-6" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800 p-8 space-y-4">
          <Users className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-300">No posts in this category yet</h3>
          <p className="text-sm text-slate-500">Be the first to share your learning insights!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 rounded-3xl p-6 transition-all space-y-4"
            >
              {/* Author & Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={post.author?.profile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author?.profile?.username}`}
                    alt={post.author?.profile?.fullName}
                    className="w-11 h-11 rounded-xl bg-slate-950 border border-slate-700"
                  />
                  <div>
                    <h3 className="font-heading font-bold text-sm text-white">
                      {post.author?.profile?.fullName}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {post.author?.profile?.headline} • {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-amber-400 font-mono text-[10px] uppercase font-bold">
                  {post.category}
                </span>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <h2 className="text-lg font-bold text-white font-heading">{post.title}</h2>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{post.content}</p>
              </div>

              {/* Actions & Stats Bar */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center space-x-6 text-xs text-slate-400 font-mono">
                <button
                  onClick={() => handleLike(post.id)}
                  className="flex items-center space-x-1.5 hover:text-rose-400 transition-colors"
                >
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
                  <span>{post.likesCount || 0} Likes</span>
                </button>

                <button
                  onClick={() => setActivePostId(activePostId === post.id ? null : post.id)}
                  className="flex items-center space-x-1.5 hover:text-teal-300 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-teal-400" />
                  <span>{post.comments?.length || 0} Comments</span>
                </button>
              </div>

              {/* Comments Thread Drawer */}
              {activePostId === post.id && (
                <div className="pt-3 space-y-3 border-t border-slate-800/60 animate-in fade-in">
                  <div className="space-y-2">
                    {post.comments?.map((c) => (
                      <div key={c.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-start space-x-2.5">
                        <img
                          src={c.author?.profile?.avatarUrl}
                          alt={c.author?.profile?.fullName}
                          className="w-7 h-7 rounded-lg bg-slate-900 shrink-0"
                        />
                        <div className="text-xs">
                          <span className="font-bold text-white block">{c.author?.profile?.fullName}</span>
                          <p className="text-slate-300 mt-0.5">{c.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Comment Input */}
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write a constructive response..."
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      className="px-4 py-2 bg-amber-400 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-300 transition-colors"
                    >
                      Comment
                    </button>
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>
      )}

      {/* CREATE POST MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative animate-in zoom-in-95">
            <button onClick={() => setModalOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-heading text-xl font-bold text-white">Create Community Post</h3>

            <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Post Category</label>
                <select
                  value={postCategory}
                  onChange={(e) => setPostCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="PROGRAMMING">Programming & Web Development</option>
                  <option value="DESIGN">UI/UX & Design Systems</option>
                  <option value="CAREER">Career Growth & Mentorship</option>
                  <option value="BUSINESS">Product & SaaS Growth</option>
                  <option value="LANGUAGES">Languages & Communication</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Title</label>
                <input
                  type="text"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="e.g., How I built a reusable Tailwind & React design system..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Content</label>
                <textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  rows={5}
                  placeholder="Share your technical learnings, code snippets, or discussion questions..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold rounded-2xl text-xs shadow-lg shadow-amber-500/20"
              >
                {submitting ? 'Publishing...' : 'Publish Post'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
