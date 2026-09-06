import { create } from 'zustand';

export const DEMO_PERSONAS = [
  {
    id: 'aarav_sharma',
    name: 'Aarav Sharma',
    username: 'aarav_sharma',
    role: 'Frontend Specialist',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aarav_sharma',
    teach: ['React', 'TypeScript', 'Tailwind CSS'],
    learn: ['Node.js', 'PostgreSQL']
  },
  {
    id: 'elena_design',
    name: 'Elena Rostova',
    username: 'elena_design',
    role: 'Senior UI/UX Lead',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=elena_design',
    teach: ['Figma', 'Design Systems', 'User Research'],
    learn: ['React', 'TypeScript']
  },
  {
    id: 'marcus_backend',
    name: 'Marcus Chen',
    username: 'marcus_backend',
    role: 'Staff Backend Architect',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marcus_backend',
    teach: ['Node.js', 'PostgreSQL', 'Express.js', 'Docker'],
    learn: ['Figma', 'Prompt Engineering']
  },
  {
    id: 'priya_ai',
    name: 'Priya Patel',
    username: 'priya_ai',
    role: 'AI Product Lead',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya_ai',
    teach: ['Prompt Engineering', 'Python', 'LangChain'],
    learn: ['Product Management', 'Public Speaking']
  }
];

export const useStore = create((set, get) => ({
  activeTab: 'discover',
  setActiveTab: (tab) => set({ activeTab: tab }),

  currentDemoUserId: null, // Populated after fetching seed user
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user, currentDemoUserId: user?.id || null }),

  demoPersonas: DEMO_PERSONAS,
  activeDemoPersona: DEMO_PERSONAS[0],
  switchDemoPersona: (persona) => {
    set({ activeDemoPersona: persona });
    // Refetch user context from API with new x-demo-user-id header
  },

  // Modals
  matchExplainerUser: null,
  setMatchExplainerUser: (user) => set({ matchExplainerUser: user }),

  bookingTargetUser: null,
  setBookingTargetUser: (user) => set({ bookingTargetUser: user }),

  sessionPrepModal: null, // session object
  setSessionPrepModal: (session) => set({ sessionPrepModal: session }),

  sessionSummaryModal: null, // session object
  setSessionSummaryModal: (session) => set({ sessionSummaryModal: session }),

  toastMessage: null,
  showToast: (msg, type = 'info') => {
    set({ toastMessage: { msg, type } });
    setTimeout(() => set({ toastMessage: null }), 4000);
  }
}));
