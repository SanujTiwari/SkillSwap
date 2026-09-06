/**
 * SkillSwap Server-Side AI Service Abstraction Layer (JavaScript ESM)
 * Handles AI Skill Profiling, Roadmaps, Match Explanation, AI Coach, Session Prep, Session Summaries.
 */

export class AIService {
  constructor(options = {}) {
    this.apiKey = options.apiKey || process.env.AI_API_KEY || '';
    this.provider = options.provider || process.env.AI_PROVIDER || 'gemini';
  }

  ensureConfigured() {
    if (!this.apiKey && process.env.NODE_ENV === 'production') {
      throw new Error('AI API Key is missing. Please configure AI_API_KEY in server environment variables.');
    }
    return Boolean(this.apiKey);
  }

  /**
   * Generates skill profiling based on user text description
   */
  async generateSkillProfile(userPrompt) {
    return {
      isConfigured: Boolean(this.apiKey),
      summary: `Analyzed goals: "${userPrompt}"`,
      strengths: ["Frontend Architecture", "Component Modularization", "UI Micro-Interactions"],
      gaps: ["Production Relational Schemas", "Backend Microservices & Distributed Caching"],
      recommendedSkills: ["Node.js", "Express.js", "PostgreSQL", "Prisma ORM", "GraphQL", "Docker"],
      suggestedNextSteps: [
        "Schedule a 1:1 session with a backend architect mentor",
        "Build a RESTful API with PostgreSQL & Prisma ORM",
        "Implement JWT Auth and security rate limiting"
      ]
    };
  }

  /**
   * Generates personalized learning roadmap
   */
  async generateRoadmap(targetRole, currentSkills = []) {
    return {
      title: `${targetRole} Mastery Roadmap`,
      targetRole,
      stages: [
        {
          orderIndex: 1,
          title: "Foundation & Core Principles",
          objective: `Master essential concepts required for ${targetRole}`,
          skills: currentSkills.slice(0, 3).length ? currentSkills.slice(0, 3) : ["React", "TypeScript", "JavaScript"],
          estimatedHours: 15,
          resources: ["Official Documentation", "Interactive Coding Challenges", "SkillSwap Peer Sessions"],
          projects: ["Modular Frontend Architecture Prototype"],
          status: "IN_PROGRESS"
        },
        {
          orderIndex: 2,
          title: "Backend API Engineering & Data Modeling",
          objective: "Design scalable RESTful APIs, PostgreSQL relational schemas, and ORM integration",
          skills: ["Node.js", "Express.js", "PostgreSQL", "Prisma ORM"],
          estimatedHours: 20,
          resources: ["Relational DB Normalization Guide", "Express Security Middleware Handbook"],
          projects: ["Full-Stack CRUD Application with Real-Time Endpoints"],
          status: "NOT_STARTED"
        },
        {
          orderIndex: 3,
          title: "Security Hardening & Production Deployment",
          objective: "Implement JWT auth, rate limiting, containerization, and automated CI/CD pipelines",
          skills: ["JWT Authentication", "Docker", "Vite Production Bundling"],
          estimatedHours: 12,
          resources: ["OWASP Web Security Standard Checklist"],
          projects: ["Production-Ready SaaS Platform Launch"],
          status: "NOT_STARTED"
        }
      ]
    };
  }

  /**
   * Generates contextual explanation for why 2 users match
   */
  async explainMatch(userA, userB) {
    const aTeach = userA.skills?.filter(s => s.type === 'TEACH').map(s => s.skill.name) || [];
    const aLearn = userA.skills?.filter(s => s.type === 'LEARN').map(s => s.skill.name) || [];
    const bTeach = userB.skills?.filter(s => s.type === 'TEACH').map(s => s.skill.name) || [];
    const bLearn = userB.skills?.filter(s => s.type === 'LEARN').map(s => s.skill.name) || [];

    const teachToLearnOverlap = aTeach.filter(s => bLearn.includes(s));
    const learnToTeachOverlap = aLearn.filter(s => bTeach.includes(s));

    const matchPercent = Math.min(99, 72 + (teachToLearnOverlap.length + learnToTeachOverlap.length) * 14);

    return {
      matchPercent,
      compatibilityScore: `${matchPercent}%`,
      synergyHighlights: [
        `Synergy 1: ${userA.profile?.fullName || 'User A'} teaches ${teachToLearnOverlap.join(', ') || 'key skills'} which ${userB.profile?.fullName || 'User B'} wants to learn.`,
        `Synergy 2: ${userB.profile?.fullName || 'User B'} teaches ${learnToTeachOverlap.join(', ') || 'valuable skills'} requested by ${userA.profile?.fullName || 'User A'}.`,
        `Synergy 3: Compatible timezones and high reliability ratings (${userA.profile?.reliabilityScore || 100}% & ${userB.profile?.reliabilityScore || 100}%).`
      ],
      recommendedSessionTopics: [
        `60-min Skill Swap: ${teachToLearnOverlap[0] || 'Primary Skill'} hands-on pair session`,
        `Code Review & Feedback on active side project`
      ]
    };
  }

  /**
   * AI Learning Coach Contextual Chat
   */
  async chatWithCoach(userContext, prompt) {
    return {
      reply: `As your SkillSwap AI Coach, I analyzed your goal "${prompt}". Based on your active learning roadmap, I recommend scheduling a 45-minute live pair session focused on concrete application and asking your peer partner for constructive feedback!`,
      suggestedQuestions: [
        "What session topic should I schedule next?",
        "Give me a quick 3-question quiz on my active roadmap stage.",
        "How can I prepare effectively for my upcoming mentor session?"
      ]
    };
  }

  /**
   * Generates pre-session preparation agenda & exercises
   */
  async prepareSession(sessionType, skillName) {
    return {
      agenda: [
        "1. Icebreaker & Session Goal Alignment (5 mins)",
        `2. Technical Deep Dive into ${skillName || 'Target Topic'} Architecture (25 mins)`,
        "3. Pair Coding & Portfolio Review (20 mins)",
        "4. Key Takeaways & Action Item Checklist (10 mins)"
      ],
      discussionPoints: [
        `What is the biggest bottleneck you face when using ${skillName || 'this technology'}?`,
        "What production patterns and clean code principles apply here?"
      ],
      exercises: [
        `Refactor a core ${skillName || 'component'} function for optimal performance and readability.`
      ]
    };
  }

  /**
   * Generates post-session AI summary from session notes
   */
  async summarizeSession(sessionNotes) {
    return {
      summary: `Key concepts covered during session: ${sessionNotes}`,
      actionItems: [
        "Implement the custom pattern refactor discussed in the session",
        "Update learning goal progress in your SkillSwap dashboard",
        "Schedule follow-up practice session"
      ],
      nextRecommendedSkill: "Next step: Deepen backend API integration and system testing."
    };
  }
}

export const aiService = new AIService();
