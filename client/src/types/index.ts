export type Role = 'USER' | 'ADMIN';
export type SkillType = 'TEACH' | 'LEARN';
export type ProficiencyLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
export type ConnectionStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';
export type SessionType = 'SKILL_SWAP' | 'MENTORING' | 'WORKSHOP' | 'PORTFOLIO_REVIEW' | 'INTERVIEW_PREP' | 'PROJECT_HELP';
export type SessionStatus = 'REQUESTED' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';
export type RoadmapStageStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export interface UserProfile {
  id: string;
  userId: string;
  fullName: string;
  username: string;
  headline?: string;
  bio?: string;
  avatarUrl?: string;
  location?: string;
  timezone: string;
  hourlyRate: number;
  isMentor: boolean;
  totalXp: number;
  level: number;
  reputationScore: number;
  rating: number;
  reviewCount: number;
  completedSessions: number;
  responseRate: number;
  reliabilityScore: number;
  learningStreak: number;
  ninetyDayGoal?: string;
}

export interface User {
  id: string;
  email: string;
  role: Role;
  isVerified: boolean;
  isOnboarded: boolean;
  profile?: UserProfile;
  skills?: UserSkill[];
}

export interface SkillCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

export interface Skill {
  id: string;
  name: string;
  slug: string;
  description?: string;
  popularity: number;
  categoryId: string;
  category?: SkillCategory;
}

export interface UserSkill {
  id: string;
  userId: string;
  skillId: string;
  skill: Skill;
  type: SkillType;
  proficiency: ProficiencyLevel;
  yearsExperience: number;
  description?: string;
}

export interface MatchRecommendation {
  user: User;
  matchScore: number;
  reasons: string[];
  skillsTheyTeach: Skill[];
  skillsTheyWant: Skill[];
}

export interface Session {
  id: string;
  hostId: string;
  host: User;
  learnerId: string;
  learner: User;
  skillId: string;
  skill: Skill;
  sessionType: SessionType;
  status: SessionStatus;
  startTime: string;
  endTime: string;
  durationMins: number;
  price: number;
  meetingUrl?: string;
  notes?: string;
  aiAgendaJson?: string;
  aiSummaryJson?: string;
}

export interface LearningRoadmap {
  id: string;
  userId: string;
  title: string;
  targetRole: string;
  description?: string;
  progressPercent: number;
  stages: RoadmapStage[];
}

export interface RoadmapStage {
  id: string;
  orderIndex: number;
  title: string;
  objective: string;
  skillsJson: string;
  estimatedHours: number;
  resourcesJson: string;
  projectsJson: string;
  status: RoadmapStageStatus;
}
