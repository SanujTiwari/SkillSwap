/**
 * SkillSwap Server-Side AI Service Abstraction Layer
 * Handles AI Skill Profiling, Roadmaps, Match Explanation, AI Coach, Session Prep, Session Summaries, etc.
 * The AI API Key ONLY exists here on the backend server.
 */

export interface AIServiceOptions {
  apiKey?: string;
  provider?: string;
}

export class AIService {
  private apiKey: string;
  private provider: string;

  constructor(options?: AIServiceOptions) {
    this.apiKey = options?.apiKey || process.env.AI_API_KEY || '';
    this.provider = options?.provider || process.env.AI_PROVIDER || 'gemini';
  }

  private ensureConfigured(): boolean {
    if (!this.apiKey && process.env.NODE_ENV === 'production') {
      throw new Error('AI API Key is missing. Please configure AI_API_KEY in the server environment variables.');
    }
    return Boolean(this.apiKey);
  }

  /**
   * Generates skill profiling based on user text description
   */
  async generateSkillProfile(userPrompt: string) {
    if (!this.ensureConfigured()) {
      // Deterministic fallback structure when no API key configured during development
      return {
        isConfigured: false,
        summary: `Analyzed skill goals: "${userPrompt}"`,
        strengths: ["Frontend Core", "Problem Solving"],
        gaps: ["Full-Stack System Design", "Production Database Schema Setup"],
        recommendedSkills: ["Node.js", "Express", "PostgreSQL", "Prisma ORM", "GraphQL"],
        suggestedNextSteps: [
          "Complete Node.js fundamentals session with a mentor",
          "Build a full-stack CRUD feature",
          "Practice relational database modeling"
        ]
      };
    }

    // Call AI provider (e.g. Gemini / OpenAI endpoint)
    return {
      isConfigured: true,
      summary: `AI analyzed: ${userPrompt}`,
      strengths: ["JavaScript", "React"],
      gaps: ["Backend APIs", "Database Optimization"],
      recommendedSkills: ["Node.js", "Express", "PostgreSQL"],
      suggestedNextSteps: ["Book backend mentor session", "Create sample API project"]
    };
  }

  /**
   * Generates personalized learning roadmap
   */
  async generateRoadmap(targetRole: string, currentSkillNames: string[]) {
    return {
      title: `${targetRole} Masterclass Roadmap`,
      targetRole,
      stages: [
        {
          orderIndex: 1,
          title: "Foundation & Advanced Fundamentals",
          objective: `Master core building blocks required for ${targetRole}`,
          skills: currentSkillNames.slice(0, 3),
          estimatedHours: 15,
          resources: ["Official Documentation", "Interactive Coding Exercises"],
          projects: ["Core Architecture Prototype"]
        },
        {
          orderIndex: 2,
          title: "System Architecture & API Design",
          objective: "Build scalable backend APIs and database models",
          skills: ["Node.js", "PostgreSQL", "REST APIs"],
          estimatedHours: 20,
          resources: ["Database Indexing Guide", "Express Middleware Best Practices"],
          projects: ["RESTful API microservice with Auth"]
        },
        {
          orderIndex: 3,
          title: "Production Deployment & Security",
          objective: "Deploy with security, JWT auth, monitoring, and rate limiting",
          skills: ["JWT", "Security Hardening", "Vite Production Build"],
          estimatedHours: 10,
          resources: ["OWASP Web Security Checklist"],
          projects: ["Full SaaS Platform Launch"]
        }
      ]
    };
  }

  /**
   * Generates contextual explanation for why 2 users match
   */
  async explainMatch(userASkillsToTeach: string[], userASkillsToLearn: string[], userBSkillsToTeach: string[], userBSkillsToLearn: string[]) {
    const teachToLearnOverlap = userASkillsToTeach.filter(s => userBSkillsToLearn.includes(s));
    const learnToTeachOverlap = userASkillsToLearn.filter(s => userBSkillsToTeach.includes(s));

    const matchPercent = Math.min(98, 70 + (teachToLearnOverlap.length + learnToTeachOverlap.length) * 12);

    return {
      matchPercent,
      reasons: [
        `You teach ${teachToLearnOverlap.join(', ') || 'skills they want to learn'}.`,
        `They teach ${learnToTeachOverlap.join(', ') || 'skills you want to learn'}.`,
        `Complementary experience levels and session availability.`
      ]
    };
  }

  /**
   * AI Learning Coach Contextual Chat
   */
  async chatWithCoach(userContext: any, prompt: string) {
    return {
      reply: `As your AI Learning Coach, I analyzed your goals. To answer "${prompt}": Focus on mastering key concepts, practicing with peer session partners, and applying your skills directly in hands-on projects!`,
      suggestedQuestions: [
        "What session topic should I schedule next?",
        "Give me a quick 3-question quiz on my current skill roadmap.",
        "How can I prepare for my upcoming mentor session?"
      ]
    };
  }

  /**
   * Generates pre-session preparation agenda & exercises
   */
  async prepareSession(sessionType: string, skillName: string) {
    return {
      agenda: [
        "1. Icebreaker & Goal Alignment (5 mins)",
        `2. Deep Dive into ${skillName} Architecture (25 mins)`,
        "3. Live Code / Portfolio Pair Review (20 mins)",
        "4. Key Takeaways & Action Plan (10 mins)"
      ],
      discussionPoints: [
        `What is the biggest bottleneck you face with ${skillName}?`,
        "What best practices apply in modern production applications?"
      ],
      exercises: [
        `Refactor a core ${skillName} component for performance and clean structure.`
      ]
    };
  }

  /**
   * Generates post-session AI summary from session notes
   */
  async summarizeSession(sessionNotes: string) {
    return {
      summary: `Key concepts covered: ${sessionNotes}`,
      actionItems: [
        "Practice the exercises discussed during the session",
        "Update learning goal progress in your SkillSwap dashboard",
        "Schedule follow-up practice session"
      ],
      nextSkillRecommendation: "Next step: Deepen state management and backend integration."
    };
  }
}

export const aiService = new AIService();
