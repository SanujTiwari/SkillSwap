import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting SkillSwap database seed...');

  // Clean existing records in safe order
  await prisma.aIInteraction.deleteMany();
  await prisma.blockedUser.deleteMany();
  await prisma.report.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.plan.deleteMany();
  await prisma.mentorOffering.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.userBadge.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.review.deleteMany();
  await prisma.session.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.connection.deleteMany();
  await prisma.roadmapStage.deleteMany();
  await prisma.learningRoadmap.deleteMany();
  await prisma.learningGoal.deleteMany();
  await prisma.userSkill.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.skillCategory.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned existing database tables.');

  const defaultPasswordHash = await bcrypt.hash('Password123!', 10);

  // 1. SEED SUBSCRIPTION PLANS
  const planFree = await prisma.plan.create({
    data: {
      code: 'FREE',
      name: 'Free Explorer',
      priceMonthly: 0,
      featuresJson: JSON.stringify([
        'Create Skill Profile',
        'Basic AI Skill Profiling',
        '2 Skill Swaps per month',
        'Community Access'
      ])
    }
  });

  const planPro = await prisma.plan.create({
    data: {
      code: 'PRO',
      name: 'Learner Pro',
      priceMonthly: 19,
      featuresJson: JSON.stringify([
        'Unlimited AI Skill Swaps',
        'Unlimited AI Coach Assistant',
        'Custom Interactive Learning Roadmaps',
        'Session Prep & Post-Session AI Summaries'
      ])
    }
  });

  const planMentorPro = await prisma.plan.create({
    data: {
      code: 'MENTOR_PRO',
      name: 'Mentor Pro',
      priceMonthly: 39,
      featuresJson: JSON.stringify([
        'Everything in Learner Pro',
        'Paid Session Monetization',
        'Featured Mentor Profile Boost',
        'Verified Mentor Badge'
      ])
    }
  });

  // 2. SEED GAMIFICATION BADGES
  const badgesData = [
    { code: 'FIRST_SKILL', title: 'Skill Pioneer', description: 'Added your first skill to teach or learn.', icon: 'Sparkles', category: 'ONBOARDING' },
    { code: 'FIRST_MATCH', title: 'Perfect Match', description: 'Connected with your first compatible skill swap partner.', icon: 'Zap', category: 'MATCHING' },
    { code: 'FIRST_SESSION', title: 'Icebreaker', description: 'Completed your first 1:1 learning session.', icon: 'Calendar', category: 'SESSIONS' },
    { code: 'TOP_MENTOR', title: 'Top Mentor', description: 'Maintained a 4.9+ rating across 10+ teaching sessions.', icon: 'Award', category: 'MENTORSHIP' },
    { code: 'FAST_LEARNER', title: 'Fast Learner', description: 'Completed a 6-stage AI Learning Roadmap.', icon: 'TrendingUp', category: 'LEARNING' },
    { code: 'COMMUNITY_HERO', title: 'Community Champion', description: 'Authored 5 helpful community posts and answers.', icon: 'MessageSquare', category: 'COMMUNITY' },
    { code: 'TEN_SESSIONS', title: 'Centurion Learner', description: 'Completed 10 interactive learning sessions.', icon: 'CheckCircle2', category: 'MILESTONE' },
    { code: 'STREAK_7', title: '7-Day Scholar', description: 'Maintained a 7-day active learning streak.', icon: 'Flame', category: 'STREAK' }
  ];

  await Promise.all(badgesData.map(b => prisma.badge.create({ data: b })));

  // 3. SEED SKILL CATEGORIES & SKILLS
  const categoriesData = [
    {
      name: 'Software Engineering',
      slug: 'software-engineering',
      icon: 'Code',
      description: 'Web development, mobile apps, backend systems, APIs.',
      skills: [
        { name: 'React', slug: 'react', description: 'Modern UI building with React hooks.', popularity: 98 },
        { name: 'JavaScript', slug: 'javascript', description: 'Core language for modern web development.', popularity: 99 },
        { name: 'Node.js', slug: 'nodejs', description: 'Asynchronous backend server runtime.', popularity: 92 },
        { name: 'Express.js', slug: 'express', description: 'Fast backend web framework for Node.js.', popularity: 88 },
        { name: 'PostgreSQL', slug: 'postgresql', description: 'Advanced relational database management system.', popularity: 90 },
        { name: 'Prisma ORM', slug: 'prisma', description: 'Next-generation ORM for Node.js.', popularity: 85 }
      ]
    },
    {
      name: 'UI/UX & Design',
      slug: 'design',
      icon: 'Palette',
      description: 'Visual design, interface wireframing, design systems.',
      skills: [
        { name: 'Figma', slug: 'figma', description: 'Collaborative interface design tool.', popularity: 97 },
        { name: 'Design Systems', slug: 'design-systems', description: 'Creating component libraries & tokens.', popularity: 89 },
        { name: 'Tailwind CSS', slug: 'tailwindcss', description: 'Utility-first CSS framework.', popularity: 93 }
      ]
    },
    {
      name: 'Data & AI',
      slug: 'data-ai',
      icon: 'Brain',
      description: 'Machine learning, prompt engineering, LLM integration.',
      skills: [
        { name: 'Prompt Engineering', slug: 'prompt-engineering', description: 'Crafting optimal context prompts for AI.', popularity: 95 },
        { name: 'Python', slug: 'python', description: 'Versatile language for backend and AI/ML.', popularity: 96 }
      ]
    }
  ];

  const skillNameToIdMap = {};

  for (const cat of categoriesData) {
    const createdCat = await prisma.skillCategory.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon,
        description: cat.description
      }
    });

    for (const sk of cat.skills) {
      const createdSkill = await prisma.skill.create({
        data: {
          name: sk.name,
          slug: sk.slug,
          description: sk.description,
          popularity: sk.popularity,
          categoryId: createdCat.id
        }
      });
      skillNameToIdMap[sk.name] = createdSkill.id;
    }
  }

  // 4. SEED USERS & PROFILES
  const usersSeedData = [
    {
      email: 'aarav.sharma@skillswap.dev',
      fullName: 'Aarav Sharma',
      username: 'aarav_sharma',
      headline: 'Frontend Engineer | React & JavaScript Specialist',
      bio: 'Building high-performance React web applications. Passionate about state management & UI micro-interactions. Looking to learn Node.js backend & PostgreSQL.',
      location: 'Bengaluru, India',
      timezone: 'Asia/Kolkata',
      hourlyRate: 0,
      isMentor: true,
      totalXp: 850,
      level: 4,
      reputationScore: 4.95,
      rating: 4.9,
      reviewCount: 14,
      completedSessions: 18,
      learningStreak: 12,
      teachSkills: [{ name: 'React', level: 'EXPERT', yrs: 4 }, { name: 'JavaScript', level: 'ADVANCED', yrs: 4 }, { name: 'Tailwind CSS', level: 'EXPERT', yrs: 3 }],
      learnSkills: [{ name: 'Node.js', level: 'BEGINNER' }, { name: 'PostgreSQL', level: 'BEGINNER' }],
      ninetyDayGoal: 'Build a full-stack SaaS project from scratch'
    },
    {
      email: 'elena.rostova@skillswap.dev',
      fullName: 'Elena Rostova',
      username: 'elena_design',
      headline: 'Senior UI/UX Designer & Design Systems Lead',
      bio: '10+ years crafting digital experiences and design systems. Eager to master React & JavaScript frontend implementation to bridge design & code.',
      location: 'Berlin, Germany',
      timezone: 'Europe/Berlin',
      hourlyRate: 45,
      isMentor: true,
      totalXp: 1450,
      level: 7,
      reputationScore: 4.98,
      rating: 5.0,
      reviewCount: 28,
      completedSessions: 32,
      learningStreak: 19,
      teachSkills: [{ name: 'Figma', level: 'EXPERT', yrs: 8 }, { name: 'Design Systems', level: 'EXPERT', yrs: 6 }],
      learnSkills: [{ name: 'React', level: 'INTERMEDIATE' }, { name: 'JavaScript', level: 'BEGINNER' }],
      ninetyDayGoal: 'Ship my own interactive UI design component library'
    },
    {
      email: 'marcus.chen@skillswap.dev',
      fullName: 'Marcus Chen',
      username: 'marcus_backend',
      headline: 'Staff Backend Architect | Node.js & Databases',
      bio: 'Passionate about databases, query optimization, high availability, and API security. Happy to mentor developers on backend system design in exchange for Figma UI design.',
      location: 'San Francisco, USA',
      timezone: 'America/Los_Angeles',
      hourlyRate: 65,
      isMentor: true,
      totalXp: 2100,
      level: 9,
      reputationScore: 4.99,
      rating: 4.98,
      reviewCount: 42,
      completedSessions: 50,
      learningStreak: 30,
      teachSkills: [{ name: 'Node.js', level: 'EXPERT', yrs: 7 }, { name: 'PostgreSQL', level: 'EXPERT', yrs: 8 }, { name: 'Express.js', level: 'EXPERT', yrs: 6 }],
      learnSkills: [{ name: 'Figma', level: 'BEGINNER' }, { name: 'Prompt Engineering', level: 'INTERMEDIATE' }],
      ninetyDayGoal: 'Master AI Prompt Engineering & GenAI Architectures'
    }
  ];

  const createdUsers = {};

  for (const u of usersSeedData) {
    const user = await prisma.user.create({
      data: {
        email: u.email,
        passwordHash: defaultPasswordHash,
        role: 'USER',
        isVerified: true,
        isOnboarded: true,
        profile: {
          create: {
            fullName: u.fullName,
            username: u.username,
            headline: u.headline,
            bio: u.bio,
            location: u.location,
            timezone: u.timezone,
            hourlyRate: u.hourlyRate,
            isMentor: u.isMentor,
            totalXp: u.totalXp,
            level: u.level,
            reputationScore: u.reputationScore,
            rating: u.rating,
            reviewCount: u.reviewCount,
            completedSessions: u.completedSessions,
            learningStreak: u.learningStreak,
            avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`,
            ninetyDayGoal: u.ninetyDayGoal
          }
        },
        subscription: {
          create: {
            planId: u.hourlyRate > 0 ? planMentorPro.id : planPro.id,
            status: 'ACTIVE'
          }
        }
      },
      include: { profile: true }
    });

    createdUsers[u.username] = user;

    for (const ts of u.teachSkills) {
      const skillId = skillNameToIdMap[ts.name];
      if (skillId) {
        await prisma.userSkill.create({
          data: {
            userId: user.id,
            skillId,
            type: 'TEACH',
            proficiency: ts.level,
            yearsExperience: ts.yrs || 2.0,
            description: `Teaches ${ts.name} through live coding.`
          }
        });
      }
    }

    for (const ls of u.learnSkills) {
      const skillId = skillNameToIdMap[ls.name];
      if (skillId) {
        await prisma.userSkill.create({
          data: {
            userId: user.id,
            skillId,
            type: 'LEARN',
            proficiency: ls.level,
            yearsExperience: 0.5,
            description: `Actively learning ${ls.name}.`
          }
        });
      }
    }
  }

  // 5. CONNECTIONS & CONVERSATIONS
  const userA = createdUsers['aarav_sharma'];
  const userE = createdUsers['elena_design'];

  const connectionAE = await prisma.connection.create({
    data: {
      requesterId: userA.id,
      receiverId: userE.id,
      status: 'ACCEPTED'
    }
  });

  const conversationAE = await prisma.conversation.create({
    data: {
      participants: { connect: [{ id: userA.id }, { id: userE.id }] },
      lastMessageAt: new Date()
    }
  });

  await prisma.message.createMany({
    data: [
      {
        conversationId: conversationAE.id,
        senderId: userA.id,
        content: "Hi Elena! I'd love to swap my React & JavaScript knowledge for Figma design system guidance!",
        createdAt: new Date(Date.now() - 3600000 * 48)
      },
      {
        conversationId: conversationAE.id,
        senderId: userE.id,
        content: "Hey Aarav! Perfect match. Let's schedule a 60-min session this week!",
        createdAt: new Date(Date.now() - 3600000 * 24)
      }
    ]
  });

  // 6. SESSIONS & REVIEWS
  const reactSkillId = skillNameToIdMap['React'];

  const completedSession = await prisma.session.create({
    data: {
      hostId: userA.id,
      learnerId: userE.id,
      skillId: reactSkillId,
      sessionType: 'SKILL_SWAP',
      status: 'COMPLETED',
      startTime: new Date(Date.now() - 3600000 * 48),
      endTime: new Date(Date.now() - 3600000 * 47),
      durationMins: 60,
      price: 0,
      meetingUrl: 'https://meet.skillswap.dev/room-aarav-elena-react',
      notes: 'Covered React custom hooks and state synchronization.',
      aiAgendaJson: JSON.stringify([
        '1. Icebreaker & React basics (10m)',
        '2. Live coding: Custom hooks (30m)',
        '3. Q&A and next steps (20m)'
      ]),
      aiSummaryJson: JSON.stringify({
        summary: 'Elena mastered React useState, useEffect, and custom hooks patterns.',
        actionItems: ['Practice building a theme toggle hook', 'Schedule follow-up Figma review']
      })
    }
  });

  await prisma.review.create({
    data: {
      sessionId: completedSession.id,
      reviewerId: userE.id,
      revieweeId: userA.id,
      rating: 5,
      comment: 'Aarav is an incredible teacher! Clear real-world examples.',
      reviewType: 'TEACHER'
    }
  });

  // 7. COMMUNITY POST
  const samplePost = await prisma.post.create({
    data: {
      authorId: userA.id,
      title: 'How I built a reusable Tailwind CSS & React design system',
      content: 'When scaling React apps, maintaining visual consistency across components is essential. Standardize design tokens with Tailwind CSS variables and keep component props structured!',
      category: 'PROGRAMMING',
      likesCount: 14,
      commentsCount: 1
    }
  });

  await prisma.comment.create({
    data: {
      postId: samplePost.id,
      authorId: userE.id,
      content: 'Spot on! Super happy our skill swap session helped crystallize these design token patterns.'
    }
  });

  // 8. LEARNING ROADMAP
  await prisma.learningRoadmap.create({
    data: {
      userId: userA.id,
      title: 'Full-Stack Node.js & PostgreSQL Master Roadmap',
      targetRole: 'Full-Stack Engineer',
      description: 'Personalized AI roadmap to transition from React specialist to Full-Stack Engineer.',
      progressPercent: 33,
      stages: {
        create: [
          {
            orderIndex: 1,
            title: 'Node.js & Express Fundamentals',
            objective: 'Understand event loops, asynchronous I/O, middleware pipelines, and HTTP servers.',
            skillsJson: JSON.stringify(['Node.js', 'Express.js']),
            estimatedHours: 12,
            resourcesJson: JSON.stringify(['Node.js Docs', 'Express Guide']),
            projectsJson: JSON.stringify(['RESTful Task Manager API']),
            status: 'COMPLETED'
          },
          {
            orderIndex: 2,
            title: 'Relational Database Modeling & Prisma ORM',
            objective: 'Design normalized PostgreSQL schemas, indexes, and migrations.',
            skillsJson: JSON.stringify(['PostgreSQL', 'Prisma ORM']),
            estimatedHours: 18,
            resourcesJson: JSON.stringify(['Prisma Schema Docs', 'Postgres Indexing Guide']),
            projectsJson: JSON.stringify(['SkillSwap Database Schema']),
            status: 'IN_PROGRESS'
          }
        ]
      }
    }
  });

  console.log('🎉 SkillSwap Database Seeding Complete in Pure JavaScript!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
